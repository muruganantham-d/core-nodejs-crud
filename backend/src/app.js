import { handleApiRoutes } from "./routes/item.routes.js";
import { applyCors, handlePreflight } from "./utils/cors.js";
import { handleError } from "./utils/errorHandler.js";
import { notFound } from "./utils/notFound.js";

export function createApp() {
  return async function app(req, res) {
    applyCors(req, res);

    if (req.method === "OPTIONS") {
      handlePreflight(req, res);
      return;
    }

    try {
      const handled = await handleApiRoutes(req, res);

      if (!handled) {
        notFound(res, req.method, req.url);
      }
    } catch (error) {
      handleError(error, res);
    }
  };
}

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Creates the request handler used by `node:http` server.
- Applies CORS, handles preflight, delegates routes, and centralizes top-level error handling.

2. Why this file exists:
- Keeps `server.js` focused on startup logic and keeps request flow logic in one place.

3. Why this syntax is used (key lines only):
- The returned function `app(req, res)` is the callback used by `createServer((req, res) => {})`.
- `req.method` is checked to short-circuit `OPTIONS` preflight requests.
- `await handleApiRoutes(req, res)` is manual routing because no Express router exists.
- `notFound(res, req.method, req.url)` returns a 404 JSON response for unknown paths.

4. Common mistakes in this file:
- Forgetting preflight handling, causing browser CORS failures.
- Throwing uncaught errors from route logic.
- Mixing startup concerns with request concerns.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- What replaces Express middleware chaining in core Node?

Answer:
- A single request handler manually calls helper modules in a specific order.

2. Question:
- Why check `OPTIONS` before route matching?

Answer:
- Browsers send preflight requests first; if unhandled, real API calls can be blocked.

3. Question:
- Why have one error handler at app level?

Answer:
- It ensures consistent error responses and avoids duplicating try/catch in each route matcher.
*/
