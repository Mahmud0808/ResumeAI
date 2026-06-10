import {
  MongoClient,
  type Collection,
  type Db,
  type Document,
} from "mongodb";

/**
 * Native MongoClient promise, shared across hot reloads in dev.
 *
 * mongoose (lib/mongoose.ts) is still used by the resume models, but the
 * NextAuth MongoDB adapter and the credentials/rate-limit logic need a raw
 * MongoClient. Both connect to the same database defined in MONGODB_URL.
 */
if (!process.env.MONGODB_URL) {
  throw new Error("MONGODB_URL is not set");
}

const uri = process.env.MONGODB_URL;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function connect(): Promise<MongoClient> {
  const promise = new MongoClient(uri).connect();
  // Prevent a failed/slow connection from crashing the process via an
  // unhandledRejection. Callers still receive the rejection when they await.
  // On failure, drop the cached promise so the next call retries instead of
  // being stuck on a permanently-rejected promise.
  promise.catch((error) => {
    console.error("MongoDB connection failed:", error?.message ?? error);
    if (global._mongoClientPromise === promise) {
      global._mongoClientPromise = undefined;
    }
  });
  return promise;
}

const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise ?? connect();

global._mongoClientPromise = clientPromise;

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await (global._mongoClientPromise ?? connect());
  return client.db();
}

export async function getCollection<T extends Document = Document>(
  name: string
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}
