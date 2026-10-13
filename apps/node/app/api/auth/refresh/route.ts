import { NextResponse } from "next/server";
import { rotateRefreshSession } from "@/lib/refreshSession";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/refresh
 * Home-node only: exchange opaque refreshToken for a new access JWT + rotated refresh.
 */
export async function POST(req: Request) {
  let body: { refreshToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const refreshToken = body.refreshToken?.trim();
  if (!refreshToken) {
    return NextResponse.json({ message: "refreshToken is required" }, { status: 422 });
  }

  const session = await rotateRefreshSession(refreshToken);
  if (!session) {
    return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
  }

  return NextResponse.json(session);
}
