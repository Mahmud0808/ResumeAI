import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// In-memory stand-in for the Mongo `rate_limits` collection.
const { store, fakeCollection } = vi.hoisted(() => {
  const store = new Map<string, any>();
  const fakeCollection = {
    createIndex: async () => {},
    // Return a copy — real Mongo doesn't hand back a live reference that later
    // writes would mutate.
    findOne: async ({ key }: any) => {
      const doc = store.get(key);
      return doc ? { ...doc } : null;
    },
    updateOne: async (filter: any, update: any, opts: any) => {
      const key = filter.key;
      let doc = store.get(key);
      if (update.$set) {
        doc = { ...(doc || {}), ...update.$set };
        store.set(key, doc);
      }
      if (update.$inc) {
        if (!doc && opts?.upsert) doc = { key };
        if (doc) {
          for (const [k, v] of Object.entries(update.$inc)) {
            doc[k] = (doc[k] || 0) + (v as number);
          }
          store.set(key, doc);
        }
      }
    },
    deleteOne: async ({ key }: any) => {
      store.delete(key);
    },
  };
  return { store, fakeCollection };
});

vi.mock("../lib/mongodb", () => ({
  getCollection: async () => fakeCollection,
  getDb: async () => ({}),
  default: Promise.resolve({}),
}));

import { rateLimit, resetRateLimit } from "../lib/rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    store.clear();
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows up to max hits, then blocks", async () => {
    expect((await rateLimit("k", 3, 1000)).allowed).toBe(true); // 1
    expect((await rateLimit("k", 3, 1000)).allowed).toBe(true); // 2
    expect((await rateLimit("k", 3, 1000)).allowed).toBe(true); // 3
    const blocked = await rateLimit("k", 3, 1000); // 4
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("reports decreasing remaining within a window", async () => {
    expect((await rateLimit("k", 3, 1000)).remaining).toBe(2);
    expect((await rateLimit("k", 3, 1000)).remaining).toBe(1);
    expect((await rateLimit("k", 3, 1000)).remaining).toBe(0);
  });

  it("resets after the window expires", async () => {
    await rateLimit("k", 1, 1000); // uses the only slot
    expect((await rateLimit("k", 1, 1000)).allowed).toBe(false);

    vi.setSystemTime(1500); // past the 1000ms window
    expect((await rateLimit("k", 1, 1000)).allowed).toBe(true);
  });

  it("isolates different keys", async () => {
    await rateLimit("a", 1, 1000);
    expect((await rateLimit("a", 1, 1000)).allowed).toBe(false);
    expect((await rateLimit("b", 1, 1000)).allowed).toBe(true);
  });

  it("resetRateLimit clears the counter", async () => {
    await rateLimit("k", 1, 1000);
    expect((await rateLimit("k", 1, 1000)).allowed).toBe(false);
    await resetRateLimit("k");
    expect((await rateLimit("k", 1, 1000)).allowed).toBe(true);
  });
});
