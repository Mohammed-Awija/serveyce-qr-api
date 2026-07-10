-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "assignedStaffId" TEXT,
ADD COLUMN     "itemName" TEXT,
ADD COLUMN     "offeringNodeId" TEXT,
ADD COLUMN     "selections" JSONB,
ALTER COLUMN "offeringTypeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_offeringNodeId_fkey" FOREIGN KEY ("offeringNodeId") REFERENCES "OfferingNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
