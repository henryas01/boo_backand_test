import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import config from "../config";

let mongoServer: MongoMemoryServer | null = null;
let isConnected = false;

/**
 * Connect to in-memory MongoDB database.
 */
export async function connectDB(): Promise<void> {
  if (isConnected) return;

  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, { dbName: config.DB_NAME });
    isConnected = true;

    console.log(`Connected to in-memory MongoDB`);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}

/**
 * Disconnect from MongoDB and stop the memory server.
 */
export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }
    isConnected = false;
    console.log("🧹 Disconnected MongoMemoryServer");
  } catch (err) {
    console.error("⚠️ Error disconnecting MongoDB:", err);
  }
}
