import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { issueAuthSession } from "@/lib/refreshSession";
import type { Role } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/login
 * Exchange username + password for a short-lived access JWT + opaque refresh token.
 */
export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const username = body.username?.trim().toLowerCase();
  const password = body.password;

  if (!username || !password) {
    return NextResponse.json(
      { message: "username and password are required" },
      { status: 422 }
    );
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    // Constant-time: still run bcrypt to avoid timing attacks
    await bcrypt.compare(password, "$2b$12$invalidsaltthatisusedtofailfast");
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const session = await issueAuthSession({
    id: user.id,
    username: user.username,
    role: user.role as Role,
  });
  return NextResponse.json(session);
}
