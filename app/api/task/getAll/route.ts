import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assigneeId = searchParams.get("assigneeId");

  if (!assigneeId) {
    return NextResponse.json({ message: "Assignee ID is required" }, { status: 400 });
  }

  try {
    const prisma = new PrismaClient();
    
    // Fetch tasks assigned to the specified assignee
    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: assigneeId,
      },
      include: {
        user: true, 
        assignee: true, 
      },
    });

    await prisma.$disconnect();

    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.log("ERROR fetching tasks:", err);
    return NextResponse.json({ message: "Error fetching tasks" }, { status: 500 });
  }
}
