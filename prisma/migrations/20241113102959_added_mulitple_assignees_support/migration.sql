/*
  Warnings:

  - You are about to drop the column `assigneeId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assigneeId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assigneeId";

-- CreateTable
CREATE TABLE "_assignedTasks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_assignedTasks_AB_unique" ON "_assignedTasks"("A", "B");

-- CreateIndex
CREATE INDEX "_assignedTasks_B_index" ON "_assignedTasks"("B");

-- AddForeignKey
ALTER TABLE "_assignedTasks" ADD CONSTRAINT "_assignedTasks_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("taskId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_assignedTasks" ADD CONSTRAINT "_assignedTasks_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
