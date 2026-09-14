import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireReadAccess } from "@/lib/auth";
import { inspectStoredPhoto, MAX_PROXIED_PHOTO_BYTES } from "@/lib/photoStorage";
import { parseLegacyPhotoId, verifyPhotoAccess } from "@/lib/photoUrlAuth";

export const dynamic = "force-dynamic";

const PHOTO_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "private, max-age=300",
} as const;

async function authorizePhoto(req: NextRequest, photoId: string): Promise<NextResponse | null> {
  const exp = req.nextUrl.searchParams.get("exp");
  const sig = req.nextUrl.searchParams.get("sig");
  if (verifyPhotoAccess(photoId, exp, sig)) return null;
  // Signed query is the <img src> path. Bearer is for SDK/debug fetch — not public GET.
  return requireReadAccess(req, "read:accessibility");
}

async function storedPhotoUrl(photoId: string): Promise<string | null> {
  const legacy = parseLegacyPhotoId(photoId);
  if (legacy) {
    const submission = await prisma.auditSubmission.findUnique({
      where: { id: legacy.submissionId },
      select: { photoUrls: true },
    });
    if (!submission || !Array.isArray(submission.photoUrls)) return null;
    const url = submission.photoUrls[legacy.index];
    return typeof url === "string" && url.length > 0 ? url : null;
  }

  const photo = await prisma.auditPhoto.findUnique({
    where: { id: photoId },
    select: { url: true },
  });
  return photo?.url ?? null;
}

async function proxyRemotePhoto(url: string): Promise<NextResponse> {
  let upstream: Response;
  try {
    upstream = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(15_000) });
  } catch {
    return NextResponse.json({ message: "Photo upstream failed" }, { status: 502 });
  }
  if (!upstream.ok) {
    return NextResponse.json({ message: "Photo upstream failed" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  if (!contentType.toLowerCase().startsWith("image/")) {
    return NextResponse.json({ message: "Unsupported photo type" }, { status: 502 });
  }

  const declared = Number(upstream.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_PROXIED_PHOTO_BYTES) {
    return NextResponse.json({ message: "Photo too large" }, { status: 413 });
  }

  const buf = Buffer.from(await upstream.arrayBuffer());
  if (buf.length > MAX_PROXIED_PHOTO_BYTES) {
    return NextResponse.json({ message: "Photo too large" }, { status: 413 });
  }

  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: { ...PHOTO_HEADERS, "Content-Type": contentType.split(";")[0]!.trim() },
  });
}

/** GET /api/photos/:id — bytes for a signed photo URL (or Bearer read JWT). */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const authError = await authorizePhoto(req, id);
  if (authError) return authError;

  const stored = await storedPhotoUrl(id);
  if (!stored) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const parsed = inspectStoredPhoto(stored);
  if (!parsed) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  if (parsed.kind === "inline") {
    return new NextResponse(new Uint8Array(parsed.body), {
      status: 200,
      headers: { ...PHOTO_HEADERS, "Content-Type": parsed.contentType },
    });
  }
  return proxyRemotePhoto(parsed.url);
}
