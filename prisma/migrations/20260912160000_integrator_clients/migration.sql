-- CreateTable
CREATE TABLE "IntegratorClient" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "scopes" TEXT[] DEFAULT ARRAY['read:accessibility', 'read:resolve']::TEXT[],
    "revokedAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegratorClient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IntegratorClient_clientId_key" ON "IntegratorClient"("clientId");

-- CreateIndex
CREATE INDEX "IntegratorClient_revokedAt_idx" ON "IntegratorClient"("revokedAt");
