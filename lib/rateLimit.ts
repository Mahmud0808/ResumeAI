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

  const existing = await col.findOne({ key });

  if (!existing || existing.expiresAt.getTime() <= now) {
    // Start a fresh window.
    await col.updateOne(
      { key },
      { $set: { key, count: 1, expiresAt: new Date(now + windowMs) } },
      { upsert: true }
    );
    return { allowed: true, remaining: max - 1, retryAfterMs: windowMs };
  }

  const retryAfterMs = existing.expiresAt.getTime() - now;

  if (existing.count >= max) {
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  await col.updateOne({ key }, { $inc: { count: 1 } });
  return { allowed: true, remaining: max - existing.count - 1, retryAfterMs };
}

/** Clears the window for `key` (e.g. after a successful login). */
export async function resetRateLimit(key: string): Promise<void> {
  const col = await getRateLimitCollection();
  await col.deleteOne({ key });
}

// ---- Login brute-force protection -------------------------------------------

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

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
