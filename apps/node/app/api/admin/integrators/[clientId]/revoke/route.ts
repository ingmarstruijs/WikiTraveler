import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { revokeIntegratorClient } from "@/lib/integratorAuth";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/integrators/:clientId/revoke — soft-revoke (mint fails afterwards).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const authError = await requireRole(req, "ADMIN");
  if (authError) return authError;

  const { clientId } = await params;
  if (!clientId?.trim()) {
    return NextResponse.json({ message: "clientId required" }, { status: 400 });
  }

  const row = await revokeIntegratorClient(clientId.trim());
  if (!row) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    client: {
      clientId: row.clientId,
      name: row.name,
      revokedAt: row.revokedAt,
    },
  });
}
