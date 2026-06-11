import { getCollection } from "./mongodb";

/**
 * Mongo-backed fixed-window rate limiter. Works on serverless (Vercel) where
 * in-memory counters do not, and needs no extra infrastructure.
 *
 * A document per key holds the hit count and the window expiry. A TTL index on
 * `expiresAt` lets Mongo purge stale windows automatically.
 */

interface RateLimitDoc {
  key: string;
  count: number;
  expiresAt: Date;
}

let ttlIndexEnsured = false;

async function getRateLimitCollection() {
  const col = await getCollection<RateLimitDoc>("rate_limits");
  if (!ttlIndexEnsured) {
    // expireAfterSeconds: 0 -> delete once the date in expiresAt passes.
    await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await col.createIndex({ key: 1 }, { unique: true });
    ttlIndexEnsured = true;
  }
  return col;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Milliseconds until the current window resets. */
  retryAfterMs: number;
}

/**
 * Increments the counter for `key` and reports whether the caller is within
 * `max` hits per `windowMs`. The first hit of a new window (re)sets the expiry.
 */
export async function rateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitResult> {
  const col = await getRateLimitCollection();
  const now = Date.now();

  // Atomically increment the counter only while the window is still live. Doing
  // the read+increment in one operation closes the TOCTOU race where parallel
  // requests each read count<max and slip past the limit together.
  const live = await col.findOneAndUpdate(
    { key, expiresAt: { $gt: new Date(now) } },
    { $inc: { count: 1 } },
    { returnDocument: "after" }
  );

  if (live) {
    const retryAfterMs = live.expiresAt.getTime() - now;
    if (live.count > max) {
      return { allowed: false, remaining: 0, retryAfterMs };
    }
    return { allowed: true, remaining: max - live.count, retryAfterMs };
  }

  // No live window (missing or expired): start a fresh one. The filter on
  // expiresAt prevents a concurrent live request from being clobbered here.
  await col.updateOne(
    { key },
    { $set: { key, count: 1, expiresAt: new Date(now + windowMs) } },
    { upsert: true }
  );
  return { allowed: true, remaining: max - 1, retryAfterMs: windowMs };
}

/** Clears the window for `key` (e.g. after a successful login). */
export async function resetRateLimit(key: string): Promise<void> {
  const col = await getRateLimitCollection();
  await col.deleteOne({ key });
}

// ---- Login brute-force protection -------------------------------------------

// Loosened in development so iterating on the auth flow doesn't lock you out.
// Production stays strict for brute-force protection.
const isDev = process.env.NODE_ENV === "development";
const LOGIN_MAX_ATTEMPTS = isDev ? 1000 : 5;
const LOGIN_WINDOW_MS = (isDev ? 1 : 15) * 60 * 1000; // dev: 1 min, prod: 15 min

function loginKey(email: string, ip: string) {
  return `login:${email.toLowerCase()}:${ip}`;
}

/** Returns true if another login attempt is allowed for this email+IP. */
export async function checkLoginAllowed(
  email: string,
  ip: string
): Promise<boolean> {
  const { allowed } = await rateLimit(
    loginKey(email, ip),
    LOGIN_MAX_ATTEMPTS,
    LOGIN_WINDOW_MS
  );
  return allowed;
}

/**
 * Read-only check of the current login lock for an email+IP — does NOT count as
 * an attempt. Lets the sign-in page surface an accurate "too many attempts"
 * message after Auth.js has swallowed the throw reason.
 */
export async function peekLoginLimited(
  email: string,
  ip: string
): Promise<{ limited: boolean; retryAfterMs: number }> {
  const col = await getRateLimitCollection();
  const now = Date.now();
  const doc = await col.findOne({ key: loginKey(email, ip) });

  if (!doc || doc.expiresAt.getTime() <= now) {
    return { limited: false, retryAfterMs: 0 };
  }
  return {
    limited: doc.count >= LOGIN_MAX_ATTEMPTS,
    retryAfterMs: doc.expiresAt.getTime() - now,
  };
}

/** Clears the brute-force counter after a successful login. */
export async function clearLoginAttempts(
  email: string,
  ip: string
): Promise<void> {
  await resetRateLimit(loginKey(email, ip));
}

// ---- AI generation quota -----------------------------------------------------

const AI_MAX_PER_WINDOW = 30;
const AI_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/** Throttles AI generation per user to contain Gemini cost / abuse. */
export async function checkAiGenerationAllowed(
  userId: string
): Promise<RateLimitResult> {
  return rateLimit(`gemini:${userId}`, AI_MAX_PER_WINDOW, AI_WINDOW_MS);
}
