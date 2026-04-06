-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "manche" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "terrain" TEXT;

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL DEFAULT 'current',
    "isMaintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "tournamentDate" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
