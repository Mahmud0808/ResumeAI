import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    return console.error("MongoDB URL not found");
  }

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
  }
};
