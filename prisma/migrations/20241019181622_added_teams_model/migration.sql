-- CreateTable
CREATE TABLE "Team" (
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leaderId" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("teamId")
);

-- CreateTable
CREATE TABLE "_team-leaders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_teamMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_team-leaders_AB_unique" ON "_team-leaders"("A", "B");

-- CreateIndex
CREATE INDEX "_team-leaders_B_index" ON "_team-leaders"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_teamMembers_AB_unique" ON "_teamMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_teamMembers_B_index" ON "_teamMembers"("B");

-- AddForeignKey
ALTER TABLE "_team-leaders" ADD CONSTRAINT "_team-leaders_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_team-leaders" ADD CONSTRAINT "_team-leaders_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teamMembers" ADD CONSTRAINT "_teamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teamMembers" ADD CONSTRAINT "_teamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
