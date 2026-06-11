"use server";

import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getCollection } from "../mongodb";
import { requireUserId } from "../auth";
import { headers } from "next/headers";
import {
  consumeToken,
  createToken,
  RESET_TTL_MS,
  VERIFY_TTL_MS,
} from "../tokens";
import { peekLoginLimited } from "../rateLimit";
import { sendPasswordResetEmail, sendVerificationEmail } from "../email";

interface UserDoc {
  name?: string | null;
  email: string;
  password?: string;
  emailVerified?: Date | null;
  image?: string | null;
}

// bcrypt cost factor for new hashes. 12 is the current sane default; existing
// cost-10 hashes still verify fine, they are just re-cost on next change.
const BCRYPT_ROUNDS = 12;
// bcrypt ignores bytes past 72; cap so a long password is not silently
// truncated (which would make distinct passwords collide).
const MIN_PASSWORD = 8;
const MAX_PASSWORD = 72;

function validatePassword(password: string): string | null {
  if (!password || password.length < MIN_PASSWORD) {
    return `Password must be at least ${MIN_PASSWORD} characters.`;
  }
  if (password.length > MAX_PASSWORD) {
    return `Password must be at most ${MAX_PASSWORD} characters.`;
  }
  return null;
}

/**
 * Creates an email+password account in the same `users` collection the
 * NextAuth adapter uses, so OAuth and credentials accounts share one identity
 * (linked by email).
 */
export async function signUpWithCredentials({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    const pwError = validatePassword(password);
    if (!normalizedEmail || pwError) {
      return {
        success: false,
        error: pwError ?? "A valid email is required.",
      };
    }

    const users = await getCollection<UserDoc>("users");
    const existing = await users.findOne({ email: normalizedEmail });

    if (existing) {
      if (existing.password) {
        return { success: false, error: "Email is already registered." };
      }
      // Account exists from OAuth with no password yet: set one. The email is
      // already verified by the OAuth provider, so no verification needed.
      const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      await users.updateOne(
        { _id: existing._id },
        { $set: { password: hash, name: existing.name ?? name } }
      );
      return { success: true, requiresVerification: false };
    }

    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await users.insertOne({
      name,
      email: normalizedEmail,
      password: hash,
      emailVerified: null,
      image: null,
    });

    // Send the verification email. A failure here must not roll back the
    // account (the user can request a resend), so swallow and log.
    try {
      const token = await createToken(
        "verify-email",
        normalizedEmail,
        VERIFY_TTL_MS
      );
      await sendVerificationEmail(normalizedEmail, token);
    } catch (e: any) {
      console.error(`Verification email failed: ${e?.message ?? e}`);
    }

    return { success: true, requiresVerification: true };
  } catch (error: any) {
    console.error(`Failed to sign up: ${error.message}`);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Verifies an email-verification token and marks the account verified.
 * Idempotent-ish: a valid token sets emailVerified; an unknown/expired token
 * returns a failure the page can surface with a "resend" option.
 */
export async function verifyEmailToken(
  token: string
): Promise<{ success: boolean; error?: string }> {
  const email = await consumeToken("verify-email", token);
  if (!email) {
    return { success: false, error: "This link is invalid or has expired." };
  }
  const users = await getCollection<UserDoc>("users");
  await users.updateOne(
    { email },
    { $set: { emailVerified: new Date() } }
  );
  return { success: true };
}

/**
 * Called by the sign-in page after a failed credential attempt to decide how to
 * present the failure. If the email maps to a credential account that exists but
 * is unverified, it (re)sends a verification email and reports `unverified:true`
 * so the UI can route to the "check your email" page instead of showing a
 * misleading "wrong password" message. Sign-up already discloses email
 * existence, so this adds no new enumeration surface.
 */
export async function resolveSignInIssue(email: string): Promise<{
  unverified: boolean;
  rateLimited: boolean;
  retryAfterMinutes: number;
}> {
  const none = { unverified: false, rateLimited: false, retryAfterMinutes: 0 };
  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Same email+IP key the authorize() limiter uses. Read-only peek.
    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const { limited, retryAfterMs } = await peekLoginLimited(
      normalizedEmail,
      ip
    );
    if (limited) {
      return {
        unverified: false,
        rateLimited: true,
        retryAfterMinutes: Math.max(1, Math.ceil(retryAfterMs / 60000)),
      };
    }

    const users = await getCollection<UserDoc>("users");
    const user = await users.findOne({ email: normalizedEmail });

    if (user && user.password && !user.emailVerified) {
      const token = await createToken(
        "verify-email",
        normalizedEmail,
        VERIFY_TTL_MS
      );
      await sendVerificationEmail(normalizedEmail, token);
      return { ...none, unverified: true };
    }
  } catch (e: any) {
    console.error(`resolveSignInIssue failed: ${e?.message ?? e}`);
  }
  return none;
}

/**
 * Re-sends a verification email. Always reports success (never reveals whether
 * the email exists or is already verified) to avoid account enumeration.
 */
export async function resendVerification(
  email: string
): Promise<{ success: boolean }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const users = await getCollection<UserDoc>("users");
    const user = await users.findOne({ email: normalizedEmail });

    if (user && user.password && !user.emailVerified) {
      const token = await createToken(
        "verify-email",
        normalizedEmail,
        VERIFY_TTL_MS
      );
      await sendVerificationEmail(normalizedEmail, token);
    }
  } catch (e: any) {
    console.error(`Resend verification failed: ${e?.message ?? e}`);
  }
  return { success: true };
}

/**
 * Starts a password reset. Always returns success regardless of whether the
 * email maps to a credential account, so the response cannot be used to
 * enumerate registered users.
 */
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const users = await getCollection<UserDoc>("users");
    const user = await users.findOne({ email: normalizedEmail });

    // Only accounts that actually have a password can reset one.
    if (user && user.password) {
      const token = await createToken(
        "password-reset",
        normalizedEmail,
        RESET_TTL_MS
      );
      await sendPasswordResetEmail(normalizedEmail, token);
    }
  } catch (e: any) {
    console.error(`Password reset request failed: ${e?.message ?? e}`);
  }
  return { success: true };
}

/**
 * Completes a password reset: validates the token, sets the new password, and
 * (since possession of the emailed token proves control of the inbox) marks the
 * email verified as a side effect.
 */
export async function resetPassword({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const pwError = validatePassword(newPassword);
    if (pwError) {
      return { success: false, error: pwError };
    }

    const email = await consumeToken("password-reset", token);
    if (!email) {
      return { success: false, error: "This link is invalid or has expired." };
    }

    const users = await getCollection<UserDoc>("users");
    const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await users.updateOne(
      { email },
      { $set: { password: hash, emailVerified: new Date() } }
    );

    return { success: true };
  } catch (e: any) {
    console.error(`Password reset failed: ${e?.message ?? e}`);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Reports whether the signed-in user already has a password set. Lets the UI
 * show "Change password" (needs current password) vs "Set password" (OAuth-only
 * account adding its first credential) without leaking anything sensitive.
 */
export async function getPasswordStatus(): Promise<{ hasPassword: boolean }> {
  const userId = await requireUserId();
  const users = await getCollection<UserDoc>("users");
  const user = await users.findOne(
    { _id: new ObjectId(userId) },
    { projection: { password: 1 } }
  );
  return { hasPassword: !!user?.password };
}

/**
 * Changes (or, for OAuth-only accounts, sets) the signed-in user's password.
 * The user id comes from the server session — never from the client — so a
 * caller can only ever change their own password. When a password already
 * exists, the current one must be supplied and verified first.
 */
export async function changePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword?: string;
  newPassword: string;
}) {
  try {
    const userId = await requireUserId();

    const pwError = validatePassword(newPassword);
    if (pwError) {
      return { success: false, error: pwError };
    }

    const users = await getCollection<UserDoc>("users");
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return { success: false, error: "Account not found." };
    }

    if (user.password) {
      // Existing credential account: verify the current password first.
      if (!currentPassword) {
        return { success: false, error: "Current password is required." };
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return { success: false, error: "Current password is incorrect." };
      }
      if (currentPassword === newPassword) {
        return {
          success: false,
          error: "New password must differ from the current one.",
        };
      }
    }

    const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await users.updateOne(
      { _id: user._id },
      { $set: { password: hash } }
    );

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to change password: ${error.message}`);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
