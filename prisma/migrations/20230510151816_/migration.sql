/*
  Warnings:

  - Added the required column `senderId` to the `Complaint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "senderId" INTEGER NOT NULL;
