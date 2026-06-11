import { createHash, randomBytes } from "crypto";
import { getCollection } from "./mongodb";

/**
 * Single-use, expiring tokens for email verification and password reset.
 *
 * Only a SHA-256 hash of the token is stored, never the token itself — so a
 * read of the DB cannot be replayed to verify an email or reset a password.
 * The raw token travels only in the emailed link. A TTL index purges expired
 * rows, and consume() deletes the row so a token works exactly once.
 */

export type TokenType = "verify-email" | "password-reset";

interface TokenDoc {
  type: TokenType;
  identifier: string; // email the token is bound to
  tokenHash: string;
  expiresAt: Date;
}

let ttlIndexEnsured = false;

async function getTokenCollection() {
  const col = await getCollection<TokenDoc>("auth_tokens");
  if (!ttlIndexEnsured) {
    await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await col.createIndex({ tokenHash: 1, type: 1 });
    ttlIndexEnsured = true;
  }
  return col;
}

function hash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a token of `type` bound to `identifier`, valid for `ttlMs`. Any
 * existing tokens of the same type for that identifier are invalidated first
 * (a new request supersedes old links). Returns the RAW token for the email.
 */
export async function createToken(
  type: TokenType,
  identifier: string,
  ttlMs: number
): Promise<string> {
  const col = await getTokenCollection();
  await col.deleteMany({ type, identifier });

  const token = randomBytes(32).toString("hex");
  await col.insertOne({
    type,
    identifier,
    tokenHash: hash(token),
    expiresAt: new Date(Date.now() + ttlMs),
  });
  return token;
}

/**
 * Atomically validates and consumes a token. Returns the bound identifier on
 * success, or null if the token is unknown/expired/already used. The delete is
 * what enforces single use; the expiry filter rejects stale tokens even before
 * the TTL sweep runs.
 */
export async function consumeToken(
  type: TokenType,
  rawToken: string
): Promise<string | null> {
  if (!rawToken) return null;
  const col = await getTokenCollection();
  const doc = await col.findOneAndDelete({
    type,
    tokenHash: hash(rawToken),
    expiresAt: { $gt: new Date() },
  });
  return doc?.identifier ?? null;
}

export const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24h
export const RESET_TTL_MS = 60 * 60 * 1000; // 1h
