import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { query } from "@/src/lib/db";

interface AdminUser {
  id: string;
  name: string;
  username: string;
  role: "admin";
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      isAdmin: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
    name?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Admin Login",

      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (!username || !password) {
          return null;
        }

        const adminUser = process.env.ADMIN_USER;
        const adminPass = process.env.ADMIN_PASS;


        if (!adminUser || !adminPass) {
          throw new Error(
            "ADMIN_USER and ADMIN_PASS environment variables are not configured."
          );
        }

        if (username !== adminUser || password !== adminPass) {
          return null;
        }

        const user: AdminUser = {
          id: "1",
          name: adminUser,
          username,
          role: "admin",
        };

        return user;
      },
    }),
    CredentialsProvider({
      id: "customer",
      name: "Customer Login",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Keep customer authentication disabled until V2.0 is launched.
        if (
          process.env.NODE_ENV === "production" &&
          process.env.CUSTOMER_REGISTRATION_ENABLED !== "true"
        ) {
          return null;
        }

        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const result = await query<{
          id: string;
          full_name: string;
          email: string;
          password_hash: string;
          email_verified_at: Date | null;
        }>(
          `SELECT id::text AS id, full_name, email,
                  password_hash, email_verified_at
           FROM public.customers
           WHERE lower(email) = $1
           LIMIT 1`,
          [email]
        );

        const customer = result.rows[0];

        if (!customer) {
          return null;
        }

        const validPassword = await compare(
          password,
          customer.password_hash
        );

        if (!validPassword || !customer.email_verified_at) {
          return null;
        }

        return {
          id: `customer:${customer.id}`,
          name: customer.full_name,
          email: customer.email,
          role: "customer",
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
        // Only the existing admin credentials provider grants admin access.
        token.isAdmin = user.role === "admin";
        token.name = user.name;
      }

      token.isAdmin = Boolean(token.isAdmin);

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name ?? session.user.name;
        session.user.isAdmin = Boolean(token.isAdmin);
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};