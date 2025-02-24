/*
  Warnings:

  - Made the column `updatedAt` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "address" TEXT,
ALTER COLUMN "restaurantPhone" DROP NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
