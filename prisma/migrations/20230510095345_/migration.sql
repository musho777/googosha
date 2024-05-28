-- AlterTable
ALTER TABLE "users" ADD COLUMN     "eastYear" TEXT,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "religion" TEXT,
ADD COLUMN     "typeOfAppearance" TEXT,
ADD COLUMN     "zodiac" TEXT,
ALTER COLUMN "children" SET DEFAULT '',
ALTER COLUMN "children" SET DATA TYPE TEXT,
ALTER COLUMN "education" SET DATA TYPE TEXT;
