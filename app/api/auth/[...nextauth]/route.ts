import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

interface AdminUser {
  id: string;
  name: string;
  username: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
        if (!credentials) {
          return null;
        }

        const adminUser = process.env.ADMIN_USER;
        const adminPass = process.env.ADMIN_PASS;

        if (
          credentials.username === adminUser &&
          credentials.password === adminPass
        ) {
          const user: AdminUser = {
            id: "1",
            name: adminUser ?? "admin",
            username: adminUser ?? "admin",
          };

          return user;
        }

        return null;
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

      if (token.isAdmin === undefined) {
        token.isAdmin = false;
      }

      return token;
    },

    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      session.user = {
        ...session.user,
        name: token.name ?? session.user.name,
        isAdmin: token.isAdmin ?? false,
      };

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };