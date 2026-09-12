import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import {
  createIntegratorClient,
  listIntegratorClients,
} from "@/lib/integratorAuth";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/integrators — list clients (no secrets).
 * POST /api/admin/integrators — create client; returns plaintext secret once.
 */
export async function GET(req: NextRequest) {
  const authError = await requireRole(req, "ADMIN");
  if (authError) return authError;

  const clients = await listIntegratorClients();
  return NextResponse.json({ clients });
}

export async function POST(req: NextRequest) {
  const authError = await requireRole(req, "ADMIN");
  if (authError) return authError;

  let body: { name?: string; scopes?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ message: "name required" }, { status: 400 });
  }

  try {
    const created = await createIntegratorClient({
      name,
      scopes: body.scopes,
    });
    return NextResponse.json(
      {
        ok: true,
        client: {
          id: created.id,
          clientId: created.clientId,
          name: created.name,
          scopes: created.scopes,
          createdAt: created.createdAt,
        },
        /** Shown once — store server-side; never put in browser JS. */
        clientSecret: created.clientSecret,
      },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Create failed" },
      { status: 400 }
    );
  }
}
