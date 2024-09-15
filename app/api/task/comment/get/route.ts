import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request:NextRequest)
{
    try 
    {
        const prisma = new PrismaClient();
        const body = await request.json();
        const comments = await prisma.comment.findMany({
            where:{
                taskId:body.taskId
            }
        })

        prisma.$disconnect();
        return NextResponse.json({message:"Commecnts extracted successfully!"}, {status:200});
    }
    catch(err)
    {
        console.log(`ERROR while fetching comments`, err);
        return NextResponse.json({message:"Error on server!"}, {status:500});
    }
}