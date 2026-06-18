-- CreateEnum
CREATE TYPE "OrganizationKind" AS ENUM ('HOTEL', 'HOSTEL', 'SHORT_TERM_RENTAL', 'RESTAURANT', 'CAFE', 'BAR', 'OTHER');

-- CreateEnum
CREATE TYPE "LocationKind" AS ENUM ('ROOM', 'TABLE', 'AREA', 'OTHER');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "OrganizationKind" NOT NULL DEFAULT 'HOTEL',
    "address" TEXT,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Istanbul',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");
