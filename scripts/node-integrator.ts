/**
 * Manage issuer integrator clients (RFC-0003 M1).
 *
 * Usage:
 *   pnpm node:integrator create --name "Acme Travel"
 *   pnpm node:integrator list
 *   pnpm node:integrator revoke --client-id wt_ic_...
 */

import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  if (i === -1) return undefined;
  return process.argv[i + 1];
}

async function create(name: string) {
  const clientId = `wt_ic_${randomBytes(8).toString("hex")}`;
  const clientSecret = randomBytes(32).toString("base64url");
  const scopes = ["read:accessibility", "read:resolve"];
  const secretHash = await hash(clientSecret, 12);

  await prisma.integratorClient.create({
    data: { clientId, name, secretHash, scopes },
  });

  console.log(JSON.stringify({ clientId, clientSecret, name, scopes }, null, 2));
  console.error("Store clientSecret now — it will not be shown again.");
}

async function list() {
  const clients = await prisma.integratorClient.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      clientId: true,
      name: true,
      scopes: true,
      revokedAt: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });
  console.log(JSON.stringify({ clients }, null, 2));
}

async function revoke(clientId: string) {
  const existing = await prisma.integratorClient.findUnique({ where: { clientId } });
  if (!existing) {
    console.error(`Not found: ${clientId}`);
    process.exitCode = 1;
    return;
  }
  const row = existing.revokedAt
    ? existing
    : await prisma.integratorClient.update({
        where: { clientId },
        data: { revokedAt: new Date() },
      });
  console.log(JSON.stringify({ ok: true, clientId: row.clientId, revokedAt: row.revokedAt }, null, 2));
}

async function main() {
  const cmd = process.argv[2];
  if (cmd === "create") {
    const name = argValue("--name");
    if (!name?.trim()) throw new Error("Usage: pnpm node:integrator create --name \"Partner\"");
    await create(name.trim());
    return;
  }
  if (cmd === "list") {
    await list();
    return;
  }
  if (cmd === "revoke") {
    const clientId = argValue("--client-id");
    if (!clientId?.trim()) throw new Error("Usage: pnpm node:integrator revoke --client-id wt_ic_...");
    await revoke(clientId.trim());
    return;
  }
  throw new Error("Usage: pnpm node:integrator <create|list|revoke> …");
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
