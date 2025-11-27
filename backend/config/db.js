// ...existing code...
import mongoose from "mongoose";

export const connectDB = async () => {
  const user = "full_stack";
  const pass = "full_stack_123";
  const dbName = "Todo-App";

  // If you have a full MONGO_URI in env, prefer it.
  const uri =
    process.env.MONGO_URI ||
    `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(
      pass
    )}@cluster0.nojqt8f.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri);
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
};
// ...existing code...