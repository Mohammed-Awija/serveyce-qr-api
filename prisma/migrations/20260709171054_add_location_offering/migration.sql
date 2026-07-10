-- CreateTable
CREATE TABLE "LocationOffering" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "offeringNodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationOffering_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LocationOffering_organizationId_idx" ON "LocationOffering"("organizationId");

-- CreateIndex
CREATE INDEX "LocationOffering_locationId_idx" ON "LocationOffering"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationOffering_locationId_offeringNodeId_key" ON "LocationOffering"("locationId", "offeringNodeId");

-- AddForeignKey
ALTER TABLE "LocationOffering" ADD CONSTRAINT "LocationOffering_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationOffering" ADD CONSTRAINT "LocationOffering_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationOffering" ADD CONSTRAINT "LocationOffering_offeringNodeId_fkey" FOREIGN KEY ("offeringNodeId") REFERENCES "OfferingNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
