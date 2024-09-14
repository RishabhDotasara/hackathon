import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"

const handler = NextAuth({
    providers:[
        Credentials({
            name:"credentials",
            type:"credentials",
            credentials:{
                employeeId:{label:"EmployeeId",type:"text", placeholder:"EmployeeId" },
                password:{label:"Password", type:"password", placeholder:"Password"}
            },

            async authorize(credentials, req)
            {
                try 
                {
                    const prisma = new PrismaClient();
                    const id = credentials?.employeeId.toLowerCase()
                    const user = await prisma.user.findUnique({
                        where:{
                            employeeId:id
                        }
                    })

                    prisma.$disconnect();

                    const passwordCheck = await bcrypt.compare(credentials?.password as string, user?.password as string)
                    if (passwordCheck)
                    {
                        return {id:user?.userId as string, user}
                    }
                    else 
                    {
                        return null
                    }

                }
                catch(err)
                {
                    console.log("Error in nextauth config.",err)
                    return null;
                }
            }

        })
    ]
})

export {handler as GET, handler as POST}