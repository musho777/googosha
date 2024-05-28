/*
  Warnings:

  - You are about to drop the column `seen` on the `SupportMessage` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `SupportMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SupportMessage" DROP COLUMN "seen",
DROP COLUMN "time";
