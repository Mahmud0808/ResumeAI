import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectToDB = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not set");
  }

  // Already connected.
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Reuse an in-flight connection attempt instead of opening duplicates.
  if (!connectionPromise) {
    mongoose.set("strictQuery", true);

    connectionPromise = mongoose
      .connect(process.env.MONGODB_URL, {
        // Fail fast and surface the real error instead of mongoose silently
        // buffering operations for 10s and throwing a confusing timeout.
        serverSelectionTimeoutMS: 10000,
        bufferCommands: false,
      })
      .then((m) => {
        console.log("MongoDB connected");
        return m;
      })
      .catch((error: any) => {
        connectionPromise = null; // allow a retry on the next call
        throw new Error(
          `Failed to connect to MongoDB: ${error?.message ?? error}`
        );
      });
  }

  await connectionPromise;
};
