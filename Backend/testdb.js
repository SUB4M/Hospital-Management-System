import mongoose from "mongoose";

try {
  await mongoose.connect("mongodb+srv://subhamsinhaprof_db_user:RlYpBceOZlzPmVcM@cluster0.wvhjjg2.mongodb.net/Medicare");
  console.log("MongoDB connected successfully");
} catch (error) {
  console.error("MongoDB connection failed:", error);
}