import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.join(appRoot, "..", "..");
const fromDir = path.join(repoRoot, "docs", "assets", "screenshots");
const toDir = path.join(appRoot, "public", "screenshots");

if (existsSync(fromDir)) {
  mkdirSync(toDir, { recursive: true });
  for (const name of readdirSync(fromDir)) {
    cpSync(path.join(fromDir, name), path.join(toDir, name));
  }
  console.log(`[www] copied ${readdirSync(toDir).length} screenshots → public/screenshots`);
} else {
  console.warn(`[www] screenshot source missing: ${fromDir}`);
}
