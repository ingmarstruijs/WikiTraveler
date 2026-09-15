import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import {
  signToken,
  TRAVELER_ACCESS_TOKEN_TTL,
  TRAVELER_ACCESS_TOKEN_TTL_SECONDS,
  TRAVELER_REFRESH_TTL_MS,
  type Role,
} from "@/lib/auth";

export type AuthSessionResponse = {
  token: string;
  refreshToken: string;
  expiresIn: number;
  username: string;
  role: Role;
};

function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateRefreshToken(): string {
  return `wt_rt_${randomBytes(32).toString("base64url")}`;
}

export async function createRefreshSession(userId: string): Promise<string> {
  const refreshToken = generateRefreshToken();
  await prisma.refreshSession.create({
    data: {
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + TRAVELER_REFRESH_TTL_MS),
    },
  });
  return refreshToken;
}

export async function issueAuthSession(user: {
  id: string;
  username: string;
  role: Role;
}): Promise<AuthSessionResponse> {
  const token = signToken(
    { sub: user.username, role: user.role },
    TRAVELER_ACCESS_TOKEN_TTL
  );
  const refreshToken = await createRefreshSession(user.id);
  return {
    token,
    refreshToken,
    expiresIn: TRAVELER_ACCESS_TOKEN_TTL_SECONDS,
    username: user.username,
    role: user.role,
  };
}

/**
 * Rotate refresh token: revoke old session, mint new access + refresh.
 * Returns null when the refresh token is unknown, expired, or revoked.
 */
export async function rotateRefreshSession(
  refreshToken: string
): Promise<AuthSessionResponse | null> {
  const tokenHash = hashRefreshToken(refreshToken);
  const session = await prisma.refreshSession.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
  if (!session || session.revokedAt) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.refreshSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });
    return null;
  }

  await prisma.refreshSession.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });

  return issueAuthSession({
    id: session.user.id,
    username: session.user.username,
    role: session.user.role as Role,
  });
}
