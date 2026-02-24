import mongoose from "mongoose";

export async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error("MONGO_URI is required.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully.");
}

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Connects Mongoose to MongoDB using the URI from environment variables.

2. Why this file exists:
- Separates database setup from server startup so DB concerns stay isolated.

3. Why this syntax is used (key lines only):
- `await mongoose.connect(mongoUri)` opens the database connection before serving requests.
- `mongoose.set("strictQuery", true)` keeps query behavior explicit and predictable.
- No `req`/`res` syntax is used here because this module is not part of request handling.

4. Common mistakes in this file:
- Hardcoding DB credentials in source code.
- Ignoring failed connection attempts.
- Starting API routes without ensuring DB connection is ready.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why isolate DB connection in a dedicated module?

Answer:
- It improves testability and keeps startup code clean.

2. Question:
- Why use async/await for DB connection?

Answer:
- Database connection is asynchronous; startup should wait for it before accepting requests.

3. Question:
- What happens if DB connection fails?

Answer:
- Startup should fail fast so the app does not run in a partially broken state.
*/
