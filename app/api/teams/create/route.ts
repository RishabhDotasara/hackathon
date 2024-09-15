import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  const { teamName, createdBy, memberIds } = await request.json();

  try {
    const team = await prisma.team.create({
      data: {
        teamName,
        createdBy,
        members: {
          connect: memberIds.map((id: string) => ({ userId: id })),
        },
      },
    });

    await prisma.$disconnect();

    return NextResponse.json(team, { status: 201 });
  } catch (err) {
    console.error("ERROR creating team:", err);
    return NextResponse.json({ message: "Error creating team" }, { status: 500 });
  }
}
