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
  emailVerified?: Date | null;
}

// A real bcrypt hash of a random throwaway string. When no account exists (or
// it has no password), we still run bcrypt.compare against this so the response
// time matches the "wrong password" path — closes a user-enumeration timing
// oracle. The compare always fails.
const DUMMY_PASSWORD_HASH =
  "$2b$12$F58VvqYfv5XOD7cdYWpCvOo/5HSu8.Xup2SQXIFBZTnTJn8uyVsSG";

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
          console.warn(`[signin] rate-limited: ${email}`);
          // Surfaces as a generic sign-in error to the client.
          throw new Error("Too many attempts. Try again in 15 minutes.");
        }

        const users = await getCollection<UserDoc>("users");
        const user = await users.findOne({ email });

        // No account, or account created via OAuth only / password dropped on
        // account linking (no password set). Run a dummy compare anyway so
        // timing does not leak which emails exist.
        if (!user || !user.password) {
          await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
          console.warn(
            `[signin] no password on account (OAuth-only or password dropped on link): ${email}`
          );
          return null;
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          console.warn(`[signin] wrong password: ${email}`);
          return null;
        }

        // Password is correct, so this is not a brute-force guess — clear the
        // counter now (even if the email turns out unverified) so failed
        // verification attempts cannot accumulate into a lockout.
        await clearLoginAttempts(email, ip);

        // Credential accounts must confirm their email before signing in.
        // (OAuth accounts are verified by the provider; see auth.config events.)
        if (!user.emailVerified) {
          console.warn(`[signin] email not verified: ${email}`);
          throw new Error("Please verify your email before signing in.");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        };
      },
    }),
  ],
  events: {
    // OAuth providers verify the email out of band, but the adapter may store
    // emailVerified as null. Stamp it so these accounts satisfy the
    // verified-email gate the credentials login enforces.
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        const users = await getCollection<UserDoc>("users");
        // Stamp emailVerified (Google proved ownership). Crucially, if this
        // account was NOT yet verified, drop any password on it: that password
        // was set by a party who never proved inbox ownership and could be a
        // pre-hijack plant. Already-verified accounts (filter excludes them)
        // keep their password, so legitimate credential+Google users are fine.
        await users.updateOne(
          { email: user.email, emailVerified: null },
          { $set: { emailVerified: new Date() }, $unset: { password: "" } }
        );
      }
    },
  },
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
