import NextAuth, { type NextAuthOptions } from "next-auth";
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
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        const adminUser = process.env.ADMIN_USER ?? "admin";
        const adminPass = process.env.ADMIN_PASS ?? "admin123";

        console.log("DEBUG AUTH:", {
          username,
          password: password ? "[REDACTED]" : undefined,
          envUser: process.env.ADMIN_USER,
          envPass: process.env.ADMIN_PASS ? "[REDACTED]" : undefined,
          fallbackUsed: !(process.env.ADMIN_USER && process.env.ADMIN_PASS),
        });

        if (!username || !password) return null;

        const isValid = username === adminUser && password === adminPass;

        if (!isValid) return null;

        const user: AdminUser = {
          id: "1",
          name: adminUser,
          username: adminUser,
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

      token.isAdmin = token.isAdmin ?? false;
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };