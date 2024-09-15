import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");

  const prisma = new PrismaClient();

  try {
    if (!teamId) {
      return NextResponse.json({ message: "teamId is required" }, { status: 400 });
    }

    await prisma.team.delete({
      where: { teamId },
    });

    await prisma.$disconnect();
    return NextResponse.json({ message: "Team deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("ERROR deleting team:", err);
    await prisma.$disconnect();
    return NextResponse.json({ message: "Error deleting team" }, { status: 500 });
  }
}
