import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prisma = new PrismaClient();
    
    // Fetch all tasks
    const tasks = await prisma.task.findMany({
      include: {
        user: true, 
        assignee: true, 
      },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.log("ERROR fetching tasks:", err);
    return NextResponse.json({ message: "Error fetching tasks" }, { status: 500 });
  }
}
