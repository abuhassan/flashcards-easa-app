import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("❌ Missing email or password");
          throw new Error("Email and password are required");
        }

        console.log(`🔍 Searching for user with email: ${credentials.email}`);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.error(`❌ User not found: ${credentials.email}`);
          throw new Error("Invalid credentials");
        }

        console.log("✅ User found. Checking password...");

        if (!user.password) {
          console.error(`⚠️ User exists but has no password set.`);
          throw new Error("No password set for this account. Please reset your password.");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          console.error("❌ Password does not match");
          throw new Error("Invalid credentials");
        }

        console.log("✅ Password match! Returning user.");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Customize sign-in page if needed
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
