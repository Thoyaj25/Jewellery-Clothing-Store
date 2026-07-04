import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface AdminUser {
  id: string;
  name: string;
  username: string;
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
        };

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = true;
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