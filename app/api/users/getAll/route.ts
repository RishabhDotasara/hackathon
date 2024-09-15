import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest)
{
    try 
    {
        const prisma = new PrismaClient();
        const users = await prisma.user.findMany({})

        return NextResponse.json({message:"Successfully got the users!", users})
    }
    catch(err)
    {
        console.log("Error:", err);
        return NextResponse.json({message:"error on server."}, {status:500})
    }
}