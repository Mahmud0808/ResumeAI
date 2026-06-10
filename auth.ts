import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import authConfig from "./auth.config";
import clientPromise, { getCollection } from "./lib/mongodb";
import { checkLoginAllowed, clearLoginAttempts } from "./lib/rateLimit";

interface UserDoc {
  email: string;
  password?: string;
  name?: string | null;
  image?: string | null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  // Credentials provider requires JWT sessions (database sessions are not
  // supported for it). OAuth users also ride on the same JWT strategy.
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const email = (credentials?.email as string | undefined)
          ?.toLowerCase()
          .trim();
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          return null;
        }

        // Brute-force protection: throttle by email + client IP.
        const ip =
          request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "unknown";

        const allowed = await checkLoginAllowed(email, ip);
        if (!allowed) {
          // Surfaces as a generic sign-in error to the client.
          throw new Error("Too many attempts. Try again in 15 minutes.");
        }

        const users = await getCollection<UserDoc>("users");
        const user = await users.findOne({ email });

        // No account, or account created via OAuth only (no password set).
        if (!user || !user.password) {
          return null;
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return null;
        }

        await clearLoginAttempts(email, ip);

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
