/*
  Warnings:

  - You are about to drop the column `img` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `type` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2Id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "img",
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "user2Id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "badHabits" BOOLEAN,
ADD COLUMN     "education" BOOLEAN,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "moneyCondition" BOOLEAN,
ADD COLUMN     "orientation" BOOLEAN,
ADD COLUMN     "ownAparts" BOOLEAN,
ADD COLUMN     "ownCar" BOOLEAN,
ADD COLUMN     "weight" INTEGER;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
