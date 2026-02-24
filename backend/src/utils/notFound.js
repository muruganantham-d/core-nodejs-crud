import { sendJson } from "./sendJson.js";

export function notFound(res, method, url) {
  sendJson(res, 404, {
    success: false,
    error: {
      message: `Route ${method} ${url} was not found.`
    }
  });
}

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Returns a consistent 404 JSON response for unmatched routes.

2. Why this file exists:
- Keeps unknown-route handling centralized and reusable.

3. Why this syntax is used (key lines only):
- Uses `sendJson` so 404 response format matches other API responses.
- Includes `method` and `url` in message to speed up debugging.
- Core Node `res.writeHead`/`res.end` is abstracted through `sendJson`.

4. Common mistakes in this file:
- Returning plain text when API is JSON-based.
- Forgetting to include 404 handling at all.
- Leaking too much internal debug data in production messages.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why should 404 responses follow the same JSON format?

Answer:
- Clients can parse errors consistently without special-case logic.

2. Question:
- Where should unknown route handling happen in core Node apps?

Answer:
- After route matching fails, usually in app-level request flow.
*/
