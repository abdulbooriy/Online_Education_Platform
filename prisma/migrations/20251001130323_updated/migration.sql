-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'INACTIVE';
