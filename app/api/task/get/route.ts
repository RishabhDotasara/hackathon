import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const prisma = new PrismaClient();
    
    // Extract taskId from the query params
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    // If taskId is not provided
    if (!taskId) {
      return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
    }

    // Fetch the specific task
    const task = await prisma.task.findUnique({
      where: {
        taskId,
      },
      include: {
        user: true, // Include the user who created the task
        assignee: true, // Include the user who is assigned to the task
        comments: true, // Include task comments if needed
      },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (err) {
    console.log("ERROR fetching task:", err);
    return NextResponse.json({ message: "Error fetching task" }, { status: 500 });
  }
}
