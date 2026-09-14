import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { signPhotoAccess } from "@/lib/photoUrlAuth";

const { prismaMock, requireReadAccess } = vi.hoisted(() => ({
  prismaMock: {
    auditPhoto: { findUnique: vi.fn() },
    auditSubmission: { findUnique: vi.fn() },
  },
  requireReadAccess: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/auth", () => ({ requireReadAccess }));

import { GET } from "./route";

const JPEG_URI = `data:image/jpeg;base64,${Buffer.from("jpeg-bytes").toString("base64")}`;

function photoReq(id: string, query = "") {
  return new NextRequest(`http://localhost/api/photos/${id}${query}`);
}

describe("GET /api/photos/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "photo-route-secret";
    delete process.env.NODE_PRIVATE_KEY;
    requireReadAccess.mockResolvedValue(
      NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    );
    prismaMock.auditPhoto.findUnique.mockResolvedValue(null);
    prismaMock.auditSubmission.findUnique.mockResolvedValue(null);
  });

  it("returns 401 without a signed token or bearer", async () => {
    const res = await GET(photoReq("photo-1"), { params: Promise.resolve({ id: "photo-1" }) });
    expect(res.status).toBe(401);
    expect(prismaMock.auditPhoto.findUnique).not.toHaveBeenCalled();
  });

  it("serves a data-URI photo with a valid signed token", async () => {
    const { exp, sig } = signPhotoAccess("photo-1");
    prismaMock.auditPhoto.findUnique.mockResolvedValue({ url: JPEG_URI });
    const res = await GET(photoReq("photo-1", `?exp=${exp}&sig=${encodeURIComponent(sig)}`), {
      params: Promise.resolve({ id: "photo-1" }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/jpeg");
    expect(Buffer.from(await res.arrayBuffer()).toString()).toBe("jpeg-bytes");
    expect(requireReadAccess).not.toHaveBeenCalled();
  });

  it("serves legacy photoUrls with a signed token", async () => {
    const id = "legacy-sub1-0";
    const { exp, sig } = signPhotoAccess(id);
    prismaMock.auditSubmission.findUnique.mockResolvedValue({ photoUrls: [JPEG_URI] });
    const res = await GET(photoReq(id, `?exp=${exp}&sig=${encodeURIComponent(sig)}`), {
      params: Promise.resolve({ id }),
    });
    expect(res.status).toBe(200);
    expect(prismaMock.auditSubmission.findUnique).toHaveBeenCalledWith({
      where: { id: "sub1" },
      select: { photoUrls: true },
    });
  });

  it("returns 404 for an unknown photo when authorized", async () => {
    const { exp, sig } = signPhotoAccess("missing");
    const res = await GET(photoReq("missing", `?exp=${exp}&sig=${encodeURIComponent(sig)}`), {
      params: Promise.resolve({ id: "missing" }),
    });
    expect(res.status).toBe(404);
  });

  it("allows Bearer read access without a signed query token", async () => {
    requireReadAccess.mockResolvedValue(null);
    prismaMock.auditPhoto.findUnique.mockResolvedValue({ url: JPEG_URI });
    const res = await GET(
      new NextRequest("http://localhost/api/photos/photo-1", {
        headers: { Authorization: "Bearer test" },
      }),
      { params: Promise.resolve({ id: "photo-1" }) }
    );
    expect(res.status).toBe(200);
    expect(requireReadAccess).toHaveBeenCalled();
  });
});
