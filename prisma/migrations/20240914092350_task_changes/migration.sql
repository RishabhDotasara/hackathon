/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Task` table. All the data in the column will be lost.
  - Added the required column `assigneeId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "createdBy",
ADD COLUMN     "assigneeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
