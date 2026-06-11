import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe NextAuth config. Contains ONLY what the middleware needs:
 * route-protection logic and edge-compatible providers (Google).
 *
 * The Credentials provider and the MongoDB adapter live in `auth.ts` because
 * they pull in bcrypt / the Mongo driver, which cannot run in the edge runtime
 * that Next.js middleware uses.
 */
const protectedMatchers: RegExp[] = [
  /^\/dashboard(?:\/|$)/,
  /^\/my-resume\/[^/]+\/edit(?:\/|$)/,
];

export default {
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    // Auto-linking is ON for UX (one identity per email). The classic risk —
    // attacker pre-registers a victim's email as an unverified credentials
    // account, then the victim's Google login merges into it and the attacker's
    // password unlocks the account — is neutralized in auth.ts: the first time
    // a Google sign-in verifies a previously-unverified account, any
    // pre-existing password is dropped. So a planted password never survives.
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = protectedMatchers.some((re) =>
        re.test(nextUrl.pathname)
      );
      if (isProtected) {
        return isLoggedIn; // false -> redirect to signIn page
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
