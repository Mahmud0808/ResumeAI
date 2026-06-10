import { auth } from "@/auth";

/**
 * Returns the authenticated user's id, or null if not signed in.
 *
 * This is the single source of truth for "who is the caller" on the server.
 * Server actions MUST derive the user id from here instead of trusting a
 * client-supplied value. Swapping the auth provider only requires changing
 * this file.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/**
 * Like getCurrentUserId but throws when there is no authenticated user.
 * Use in server actions that must never run anonymously.
 */
export async function requireUserId(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}
