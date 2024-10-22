import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const body = await request.json();

    const team = await prisma.team.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json({ message: "Team Created" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error Creating Team" },
      { status: 500 }
    );
  }
}
