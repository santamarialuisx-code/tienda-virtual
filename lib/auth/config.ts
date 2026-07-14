import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { client } from "@/lib/sanity/client";
import "./types"; // Import type augmentation

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Query Sanity for user by email
        const query = `*[_type == "user" && email == $email][0] {
          _id,
          email,
          name,
          passwordHash,
          role,
          emailVerified,
          createdAt
        }`;

        const user = await client.fetch<{
          _id: string;
          email: string;
          name: string;
          passwordHash: string;
          role: string;
          emailVerified: string | null;
          createdAt: string;
        }>(query, { email });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Compare password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
          return null;
        }

        // Return user object (id will be used in JWT)
        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
});