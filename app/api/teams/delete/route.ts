import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export const dynamic = 'force-dynamic'
export async function DELETE(req:NextRequest)
{
    try 
    {
        const prisma = new PrismaClient();
        const url = new URL(req.url)
        const teamId = url.searchParams.get("teamId") || "";
        
        await prisma.team.delete({
            where:{
                teamId:teamId
            }
        })

        return NextResponse.json({message:"Team Deleted"},{status:200})
    }
    catch(err)
    {
        console.error(err)
        return NextResponse.json({message:"Internal Server Error"},{status:500})
    }
}