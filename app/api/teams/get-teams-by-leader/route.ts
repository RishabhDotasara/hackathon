import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest)
{
    try 
    {
        const prisma  = new PrismaClient();
        const {searchParams} = new URL(req.url)
        const leaderId = searchParams.get('leaderId')
        console.log("Teams requested for leaderId: "+leaderId)
        const teams = await prisma.team.findMany({
            where:{
                leaderId:leaderId
            },
            include: {
                leaders:true,
                members:true
              },
        })
        return NextResponse.json({teams, message:'Teams Fetched by LeaderId '+leaderId}, {status:200})
    }
    catch(err)
    {
        console.error(`[ERROR] Get Team By Leader Endpoint: ${err}`)
        return NextResponse.json({error: "Failed to get teams by leader"}, {status: 500})
    }
}