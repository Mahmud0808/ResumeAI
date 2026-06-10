import "./dns-setup";
import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not set");
  }

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error: any) {
    // Surface the failure instead of swallowing it — callers otherwise hit
    // confusing "no document" errors against a dead connection.
    throw new Error(`Failed to connect to MongoDB: ${error?.message ?? error}`);
  }
};
