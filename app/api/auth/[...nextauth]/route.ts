import { PrismaClient, User } from "@prisma/client";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Session } from "next-auth";


const handler = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      type: "credentials",
      credentials: {
        employeeId: {
          label: "EmployeeId",
          type: "text",
          placeholder: "EmployeeId",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },

      async authorize(credentials, req) {
        try {
          const prisma = new PrismaClient();
          const id = credentials?.employeeId.toLowerCase();
          const user:User | null = await prisma.user.findUnique({
            where: {
              employeeId: id,
            },
          });

          if (!user) {
            return null;
          }

          const passwordCheck = await bcrypt.compare(credentials?.password as string, user?.password as string);
          prisma.$disconnect();
          
          if (passwordCheck) {
            return { id: user.userId, role:user.role, user }; // Include isAdmin in returned user data
          } else {
            return null;
          }
        } catch (err) {
          console.log("Error in nextauth config.", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 24 * 60 * 60, // update session every 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // Add userId and isAdmin to the session object
      if (token?.id) {
        session.userId = token.id;
        session.role = token.role;
        session.username = token.username
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add userId and isAdmin to the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
