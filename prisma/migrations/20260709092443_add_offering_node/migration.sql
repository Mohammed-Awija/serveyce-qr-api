-- CreateEnum
CREATE TYPE "OfferingNodeType" AS ENUM ('CATEGORY', 'ITEM');

-- CreateTable
CREATE TABLE "OfferingNode" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "type" "OfferingNodeType" NOT NULL DEFAULT 'ITEM',
    "icon" TEXT NOT NULL DEFAULT 'bell',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferingNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OfferingNode_organizationId_idx" ON "OfferingNode"("organizationId");

-- CreateIndex
CREATE INDEX "OfferingNode_parentId_idx" ON "OfferingNode"("parentId");

-- AddForeignKey
ALTER TABLE "OfferingNode" ADD CONSTRAINT "OfferingNode_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingNode" ADD CONSTRAINT "OfferingNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "OfferingNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
