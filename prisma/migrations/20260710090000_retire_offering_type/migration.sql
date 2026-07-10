/*
  Warnings:

  - You are about to drop the column `offeringTypeId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the `OfferingType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_offeringTypeId_fkey";

-- DropForeignKey
ALTER TABLE "OfferingType" DROP CONSTRAINT "OfferingType_organizationId_fkey";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "offeringTypeId";

-- DropTable
DROP TABLE "OfferingType";
