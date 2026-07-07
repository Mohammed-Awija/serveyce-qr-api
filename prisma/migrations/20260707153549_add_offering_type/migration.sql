-- CreateTable
CREATE TABLE "OfferingType" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'bell',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferingType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OfferingType_organizationId_idx" ON "OfferingType"("organizationId");

-- AddForeignKey
ALTER TABLE "OfferingType" ADD CONSTRAINT "OfferingType_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
