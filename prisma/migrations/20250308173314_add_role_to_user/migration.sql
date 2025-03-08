-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'RESTAURANT', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENT';
