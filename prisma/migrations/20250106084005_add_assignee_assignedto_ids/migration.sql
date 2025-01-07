/*
  Warnings:

  - Added the required column `assigneeId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "assignedToId" INTEGER,
ADD COLUMN     "assigneeId" INTEGER NOT NULL;
