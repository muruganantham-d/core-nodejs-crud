const DEFAULT_CLIENT_ORIGIN = "http://localhost:5173";

export function applyCors(req, res) {
  const allowedOrigin = process.env.CORS_ORIGIN || DEFAULT_CLIENT_ORIGIN;

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");
  res.setHeader("Vary", "Origin");
}

export function handlePreflight(req, res) {
  res.writeHead(204);
  res.end();
}

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Adds CORS headers and handles browser preflight (`OPTIONS`) requests.

2. Why this file exists:
- Frontend and backend run on different ports, so browser cross-origin rules must be handled.

3. Why this syntax is used (key lines only):
- `res.setHeader(...)` adds CORS headers on every API response.
- `req.method === "OPTIONS"` is checked in `app.js` to run `handlePreflight`.
- `res.writeHead(204)` sends "No Content" for successful preflight.
- `res.end()` finalizes the preflight response immediately.

4. Common mistakes in this file:
- Missing `OPTIONS` support.
- Forgetting allowed headers like `Content-Type`.
- Hardcoding wrong frontend origin.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why do browsers send `OPTIONS` before some API calls?

Answer:
- For non-simple cross-origin requests, browsers perform preflight checks to verify server CORS policy.

2. Question:
- Why return status 204 for preflight?

Answer:
- Preflight has no body; `204 No Content` is a standard lightweight response.

3. Question:
- Should CORS be applied only on successful routes?

Answer:
- No, CORS headers should exist on error responses too, so frontend can read them.
*/
