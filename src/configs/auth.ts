import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const authConfig: AuthOptions = {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", required: true },
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials.password ||
          !credentials.username
        ) {
          return null;
        }

        return null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
};
