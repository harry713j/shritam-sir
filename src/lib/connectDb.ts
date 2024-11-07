import mongoose, { Mongoose } from "mongoose";

export default async function connectDb(): Promise<void> {
  try {
    const db: Mongoose = await mongoose.connect(process.env.MONGODB_URI!);

    console.log("MongoDb connection successful ✅", db.connection.host);
  } catch (error) {
    console.log("MongoDb connection failed ❌", error);
    // exit the program gracefully
    process.exit(1);
  }
}
