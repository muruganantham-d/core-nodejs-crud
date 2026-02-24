import { createServer } from "node:http";
import mongoose from "mongoose";
import "dotenv/config";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = Number(process.env.PORT) || 5001;
const MONGO_URI = process.env.MONGO_URI;

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function startServer() {
  if (!MONGO_URI) {
    console.error("MONGO_URI is missing. Add it in backend/.env.");
    process.exit(1);
  }

  await connectDB(MONGO_URI);

  const app = createApp();
  const server = createServer(app);
  server.on("error", (error) => {
    // EADDRINUSE happens when another app is already using the same port.
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Change PORT in .env or stop the other process.`
      );
      process.exit(1);
      return;
    }

    console.error("Server startup error:", error);
    process.exit(1);
  });

  server.listen(PORT, () => {
    console.log(`API server is running at http://localhost:${PORT}`);
  });

  async function shutdown(signal) {
    console.log(`${signal} received. Closing server...`);

    try {
      await closeServer(server);
      await mongoose.connection.close();
      console.log("Server and database connections are closed.");
      process.exit(0);
    } catch (error) {
      console.error("Graceful shutdown failed:", error);
      process.exit(1);
    }
  }

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

startServer().catch((error) => {
  console.error("Failed to start the server:", error);
  process.exit(1);
});

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Starts the backend server and bootstraps database connectivity before serving requests.

2. Why this file exists:
- It is the single runtime entry point that controls startup order and graceful shutdown.

3. Why this syntax is used (key lines only):
- `createServer(app)` from `node:http` creates a raw HTTP server without Express.
- `server.listen(PORT, callback)` binds the server to a TCP port.
- `process.on("SIGINT", ...)` and `process.on("SIGTERM", ...)` catch stop signals for clean shutdown.
- `res` is not used here because this file only bootstraps infrastructure, not per-request logic.

4. Common mistakes in this file:
- Starting the server before `connectDB`, which can cause API calls to fail early.
- Forgetting to handle missing `MONGO_URI`.
- Ignoring `EADDRINUSE`, which means the selected port is already occupied.
- Not closing MongoDB connection on shutdown.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why call `createServer` directly instead of using Express?

Answer:
- This project intentionally teaches Node core HTTP flow, so routing/middleware are implemented manually.

2. Question:
- Why use `process.on("SIGINT")` in backend apps?

Answer:
- To close open resources (HTTP server, DB) gracefully and avoid abrupt process termination.

3. Question:
- Why wrap `server.close` inside a Promise?

Answer:
- It exposes callback-based shutdown as `await`-friendly async code.
*/
