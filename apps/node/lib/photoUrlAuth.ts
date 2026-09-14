import { createHmac, timingSafeEqual } from "node:crypto";
import { NODE_URL } from "@/lib/nodeInfo";

/** Short-lived capability token so `<img src>` can load photos without a Bearer header. */
export const PHOTO_URL_TTL_SECONDS = 60 * 60;

export function photoSigningSecret(): string {
  const pem = process.env.NODE_PRIVATE_KEY?.trim();
  if (pem) return pem;
  return process.env.JWT_SECRET ?? "change-me-in-production";
}

function hmacPhotoToken(photoId: string, exp: number): string {
  return createHmac("sha256", photoSigningSecret())
    .update(`v1.${photoId}.${exp}`)
    .digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function signPhotoAccess(
  photoId: string,
  ttlSeconds = PHOTO_URL_TTL_SECONDS
): { exp: number; sig: string } {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  return { exp, sig: hmacPhotoToken(photoId, exp) };
}

export function verifyPhotoAccess(
  photoId: string,
  exp: string | null,
  sig: string | null
): boolean {
  if (!exp || !sig) return false;
  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || expNum < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(hmacPhotoToken(photoId, expNum), sig);
}

export function authenticatedPhotoUrl(
  photoId: string,
  baseUrl: string = NODE_URL
): string {
  const { exp, sig } = signPhotoAccess(photoId);
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/api/photos/${encodeURIComponent(photoId)}?exp=${exp}&sig=${encodeURIComponent(sig)}`;
}

export function legacyPhotoId(submissionId: string, index: number): string {
  return `legacy-${submissionId}-${index}`;
}

export function parseLegacyPhotoId(
  photoId: string
): { submissionId: string; index: number } | null {
  const match = /^legacy-(.+)-(\d+)$/.exec(photoId);
  if (!match) return null;
  return { submissionId: match[1], index: Number(match[2]) };
}
