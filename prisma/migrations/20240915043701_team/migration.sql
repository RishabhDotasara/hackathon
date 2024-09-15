-- CreateTable
CREATE TABLE "Team" (
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("teamId")
);

-- CreateTable
CREATE TABLE "_TeamToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TeamToUser_AB_unique" ON "_TeamToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamToUser_B_index" ON "_TeamToUser"("B");

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
