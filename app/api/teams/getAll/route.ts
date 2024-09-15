import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");

  const prisma = new PrismaClient();

  try {
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { teamId },
        include: { members: true, tasks: true },
      });
      await prisma.$disconnect();
      return team
        ? NextResponse.json(team, { status: 200 })
        : NextResponse.json({ message: "Team not found" }, { status: 404 });
    } else {
      const teams = await prisma.team.findMany({ include: { members: true, tasks: true } });
      await prisma.$disconnect();
      return NextResponse.json(teams, { status: 200 });
    }
  } catch (err) {
    console.error("ERROR fetching teams:", err);
    await prisma.$disconnect();
    return NextResponse.json({ message: "Error fetching teams" }, { status: 500 });
  }
}
