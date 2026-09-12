import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getNodeSettings, updateNodeSettings } from "@/lib/nodeSettings";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/** GET /api/admin/settings — node settings (registration, public reads, etc.) */
export async function GET(req: NextRequest) {
  const authError = await requireRole(req, "ADMIN");
  if (authError) return authError;

  const settings = await getNodeSettings();
  return NextResponse.json({
    openRegistration: settings.openRegistration,
    publicAccessibilityReads: settings.publicAccessibilityReads,
  });
}

/** PATCH /api/admin/settings — update node settings */
export async function PATCH(req: NextRequest) {
  const authError = await requireRole(req, "ADMIN");
  if (authError) return authError;

  let body: { openRegistration?: boolean; publicAccessibilityReads?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (body.openRegistration === undefined && body.publicAccessibilityReads === undefined) {
    return NextResponse.json({ message: "No settings to update" }, { status: 400 });
  }

  const settings = await updateNodeSettings({
    ...(body.openRegistration !== undefined
      ? { openRegistration: Boolean(body.openRegistration) }
      : {}),
    ...(body.publicAccessibilityReads !== undefined
      ? { publicAccessibilityReads: Boolean(body.publicAccessibilityReads) }
      : {}),
  });

  return NextResponse.json({
    openRegistration: settings.openRegistration,
    publicAccessibilityReads: settings.publicAccessibilityReads,
  });
}
