-- CreateEnum
CREATE TYPE "Season" AS ENUM ('SUMMER', 'WINTER', 'ALL');

-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "currencyCode" TEXT;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "bestSeason" "Season" NOT NULL DEFAULT 'ALL';

