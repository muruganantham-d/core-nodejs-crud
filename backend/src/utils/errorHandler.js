import mongoose from "mongoose";
import { HttpError } from "./httpError.js";
import { sendJson } from "./sendJson.js";

export function handleError(error, res) {
  if (error instanceof HttpError) {
    sendJson(res, error.statusCode, {
      success: false,
      error: {
        message: error.message
      }
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    sendJson(res, 400, {
      success: false,
      error: {
        message: error.message
      }
    });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    sendJson(res, 400, {
      success: false,
      error: {
        message: "Invalid resource id format."
      }
    });
    return;
  }

  console.error("Unexpected error:", error);

  sendJson(res, 500, {
    success: false,
    error: {
      message: "Internal server error."
    }
  });
}

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Converts thrown errors into consistent JSON HTTP responses.

2. Why this file exists:
- Prevents duplicated try/catch response code in every controller.

3. Why this syntax is used (key lines only):
- `instanceof HttpError` maps known business errors to exact status codes.
- Mongoose error checks map DB errors to client-friendly 400 responses.
- Fallback sends 500 for unknown failures.
- Actual `res.writeHead` and `res.end` are handled by `sendJson`.

4. Common mistakes in this file:
- Sending raw stack traces to clients.
- Returning 500 for all errors, even validation errors.
- Not logging unexpected errors on server side.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why centralize error handling?

Answer:
- It guarantees a uniform response structure and reduces boilerplate in handlers.

2. Question:
- Why not expose raw error details to the client?

Answer:
- Raw internals can leak sensitive implementation details and are hard for users to act on.

3. Question:
- How do custom errors improve API quality?

Answer:
- They make expected client failures explicit and easy to map to proper HTTP status codes.
*/
