import { randomBytes } from "crypto";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const DEFAULT_INTEGRATOR_SCOPES = [
  "read:accessibility",
  "read:resolve",
] as const;

export const INTEGRATOR_TOKEN_TTL = "15m";
export const INTEGRATOR_TOKEN_TTL_SECONDS = 15 * 60;

export type IntegratorScope = (typeof DEFAULT_INTEGRATOR_SCOPES)[number] | string;

export function generateClientId(): string {
  return `wt_ic_${randomBytes(8).toString("hex")}`;
}

export function generateClientSecret(): string {
  return randomBytes(32).toString("base64url");
}

export async function hashClientSecret(secret: string): Promise<string> {
  return hash(secret, 12);
}

export function normalizeScopes(scopes: string[] | undefined): string[] {
  if (!scopes?.length) return [...DEFAULT_INTEGRATOR_SCOPES];
  const cleaned = [...new Set(scopes.map((s) => s.trim()).filter(Boolean))];
  return cleaned.length ? cleaned : [...DEFAULT_INTEGRATOR_SCOPES];
}

export async function createIntegratorClient(input: {
  name: string;
  scopes?: string[];
}): Promise<{
  id: string;
  clientId: string;
  clientSecret: string;
  name: string;
  scopes: string[];
  createdAt: Date;
}> {
  const name = input.name.trim();
  if (!name) throw new Error("name required");

  const clientId = generateClientId();
  const clientSecret = generateClientSecret();
  const scopes = normalizeScopes(input.scopes);
  const secretHash = await hashClientSecret(clientSecret);

  const row = await prisma.integratorClient.create({
    data: { clientId, name, secretHash, scopes },
  });

  return {
    id: row.id,
    clientId: row.clientId,
    clientSecret,
    name: row.name,
    scopes: row.scopes,
    createdAt: row.createdAt,
  };
}

export async function listIntegratorClients() {
  return prisma.integratorClient.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      clientId: true,
      name: true,
      scopes: true,
      revokedAt: true,
      lastUsedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function revokeIntegratorClient(clientId: string) {
  const existing = await prisma.integratorClient.findUnique({ where: { clientId } });
  if (!existing) return null;
  if (existing.revokedAt) return existing;
  return prisma.integratorClient.update({
    where: { clientId },
    data: { revokedAt: new Date() },
  });
}

/**
 * Verify client credentials. Returns the client row (without secret) or null.
 */
export async function verifyIntegratorCredentials(
  clientId: string,
  clientSecret: string
): Promise<{ clientId: string; name: string; scopes: string[] } | null> {
  const row = await prisma.integratorClient.findUnique({ where: { clientId } });
  if (!row || row.revokedAt) return null;
  const ok = await compare(clientSecret, row.secretHash);
  if (!ok) return null;

  await prisma.integratorClient.update({
    where: { clientId },
    data: { lastUsedAt: new Date() },
  });

  return { clientId: row.clientId, name: row.name, scopes: row.scopes };
}

export function integratorHasScope(
  scopes: string[] | undefined,
  required: string
): boolean {
  if (!scopes?.length) return false;
  return scopes.includes(required);
}
