-- CreateTable
CREATE TABLE "_StickerToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StickerToUser_AB_unique" ON "_StickerToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_StickerToUser_B_index" ON "_StickerToUser"("B");

-- AddForeignKey
ALTER TABLE "_StickerToUser" ADD CONSTRAINT "_StickerToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Sticker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StickerToUser" ADD CONSTRAINT "_StickerToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
