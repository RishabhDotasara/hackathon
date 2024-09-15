import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");

  const prisma = new PrismaClient();

  try {
    if (teamId) {
      // Fetch a specific team by ID with members and their tasks
      const team = await prisma.team.findUnique({
        where: { teamId },
        include: {
          members: {
            include: {
              tasks: true, // Include tasks for each member
            },
          },
          tasks: true, // Include tasks for the team
        },
      });
      return team
        ? NextResponse.json(team, { status: 200 })
        : NextResponse.json({ message: "Team not found" }, { status: 404 });
    } else {
      // Fetch all teams with members and their tasks
      const teams = await prisma.team.findMany({
        include: {
          members: {
            include: {
              tasks: true, // Include tasks for each member
            },
          },
          tasks: true, // Include tasks for the team
        },
      });
      return NextResponse.json(teams, { status: 200 });
    }
  } catch (err) {
    console.error("ERROR fetching teams:", err);
    return NextResponse.json(
      { message: "Error fetching teams" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
