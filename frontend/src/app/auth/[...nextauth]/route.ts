import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@mail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Dummy user login
        const dummyUser = {
          id: "1",
          name: "Irawan Aji Pangestu",
          email: "irawan@mail.com",
        };

        if (
          credentials?.email === dummyUser.email &&
          credentials?.password === "123456"
        ) {
          return dummyUser;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      const user = token.user as {
        name?: string;
        email?: string;
      };

      session.user = {
        name: user?.name ?? null,
        email: user?.email ?? null,
        image: null,
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/app/create`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
