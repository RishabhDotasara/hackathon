import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest)
{
    try 
    {
        const prisma = new PrismaClient();
        const body = await request.json();
        const task = prisma.task.create({
            data:{
                title:body.title,
                description:body.description,
                createdById:body.userId,
                assigneeId:body.assigneeId,
                deadline: body.deadline,
                status:"PENDING",
            }
        })

        return NextResponse.json({message:"Task created and assigned!"},  {status:200})
    }
    catch(err)
    {
        console.log(`ERROR in task creation.`, err);
        return NextResponse.json({message:"Error"}, {status:500})
    }
}