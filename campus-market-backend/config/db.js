const mongoose = require("mongoose");

const RETRY_INTERVAL_MS = 5000; // retry every 5 seconds on failure

const connectDB = async () => {
  const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // timeout per attempt
        socketTimeoutMS: 45000,
        heartbeatFrequencyMS: 10000,    // ping every 10s to keep alive
      });
      console.log("✅ MongoDB connected successfully");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
      console.log(`🔄 Retrying MongoDB connection in ${RETRY_INTERVAL_MS / 1000}s...`);
      setTimeout(connect, RETRY_INTERVAL_MS);
    }
  };

  // Event listeners for ongoing connection health
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected! Attempting to reconnect...");
    setTimeout(connect, RETRY_INTERVAL_MS);
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err.message);
  });

  mongoose.connection.on("reconnected", () => {
    console.log("✅ MongoDB reconnected successfully");
  });

  await connect();
};

module.exports = connectDB;