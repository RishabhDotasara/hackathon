import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
          const user = await prisma.user.findUnique({
            where: {
              employeeId: id,
            },
          });

          if (!user) {
            return null;
          }
          prisma.$disconnect();

          const passwordCheck = await bcrypt.compare(
            credentials?.password as string,
            user?.password as string
          );
          if (passwordCheck) {
            return { id: user?.userId as string, user };
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
      // Add userId to the session object
      if (token?.id) {
        session.userId = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add userId to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
