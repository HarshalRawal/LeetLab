import app from "./app.js";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./db/index.js";
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await disconnectDB();
  console.log("Server closed");
  process.exit(0);
});

