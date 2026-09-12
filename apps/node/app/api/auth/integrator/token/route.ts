import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import {
  INTEGRATOR_TOKEN_TTL,
  INTEGRATOR_TOKEN_TTL_SECONDS,
  verifyIntegratorCredentials,
} from "@/lib/integratorAuth";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/integrator/token
 * Body: { clientId, clientSecret }
 * Returns short-lived integrator_read JWT (aud=sdk) for partner BFFs (RFC-0003).
 */
export async function POST(req: NextRequest) {
  let body: { clientId?: string; clientSecret?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const clientId = body.clientId?.trim();
  const clientSecret = body.clientSecret;
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { message: "clientId and clientSecret required" },
      { status: 400 }
    );
  }

  const client = await verifyIntegratorCredentials(clientId, clientSecret);
  if (!client) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const accessToken = signToken(
    {
      sub: client.clientId,
      role: "integrator_read",
      aud: "sdk",
      scopes: client.scopes,
      clientName: client.name,
    },
    INTEGRATOR_TOKEN_TTL
  );

  return NextResponse.json({
    accessToken,
    tokenType: "Bearer",
    expiresIn: INTEGRATOR_TOKEN_TTL_SECONDS,
  });
}
