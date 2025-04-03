import mongoose from "mongoose";
import config from "./index";

export const connectDB = async (): Promise<void> => {
  try {
    // Suppress deprecation warnings
    mongoose.set("strictQuery", false);

    await mongoose.connect(
      "mongodb+srv://admin:184321449@database-v1.txezs4v.mongodb.net/flower?retryWrites=true&w=majority&appName=database-v1",
      {
        serverSelectionTimeoutMS: 30000, // Timeout sau 30 giây
        socketTimeoutMS: 45000, // Socket timeout
        connectTimeoutMS: 30000,
        maxPoolSize: 50, // Tăng pool size
      },
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.log(
      "Continuing without MongoDB connection. Some features might not work correctly.",
    );
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});
