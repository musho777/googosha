-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "stickerId" INTEGER;

-- CreateTable
CREATE TABLE "Sticker" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT NOT NULL,

    CONSTRAINT "Sticker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_stickerId_fkey" FOREIGN KEY ("stickerId") REFERENCES "Sticker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
