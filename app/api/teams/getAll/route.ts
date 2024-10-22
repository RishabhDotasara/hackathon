import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const prisma = new PrismaClient();

    const teams = await prisma.team.findMany({
      include: {
        leaders:true,
        members:true
      },
    });
    prisma.$disconnect();
    return NextResponse.json(
      { message: "Teams Fetched", data: teams },
      { status: 200 }
    );
  } catch (er) {
    console.log(er);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
