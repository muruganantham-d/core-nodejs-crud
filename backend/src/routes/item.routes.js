import { URL } from "node:url";
import {
  createItem,
  deleteItem,
  getHealth,
  getItems,
  updateItem
} from "../controllers/item.controller.js";
import { sendJson } from "../utils/sendJson.js";

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function methodNotAllowed(res, allowedMethods) {
  res.setHeader("Allow", allowedMethods.join(", "));

  sendJson(res, 405, {
    success: false,
    error: {
      message: "Method not allowed."
    }
  });
}

export async function handleApiRoutes(req, res) {
  const baseUrl = `http://${req.headers.host || "localhost"}`;
  const url = new URL(req.url, baseUrl);
  const pathname = normalizePath(url.pathname);

  if (pathname === "/api/health") {
    if (req.method === "GET") {
      await getHealth(req, res);
      return true;
    }

    methodNotAllowed(res, ["GET"]);
    return true;
  }

  if (pathname === "/api/items") {
    if (req.method === "GET") {
      await getItems(req, res);
      return true;
    }

    if (req.method === "POST") {
      await createItem(req, res);
      return true;
    }

    methodNotAllowed(res, ["GET", "POST"]);
    return true;
  }

  const itemIdMatch = pathname.match(/^\/api\/items\/([a-fA-F0-9]{24})$/);

  if (itemIdMatch) {
    const itemId = itemIdMatch[1];

    if (req.method === "PUT") {
      await updateItem(req, res, itemId);
      return true;
    }

    if (req.method === "DELETE") {
      await deleteItem(req, res, itemId);
      return true;
    }

    methodNotAllowed(res, ["PUT", "DELETE"]);
    return true;
  }

  if (pathname.startsWith("/api/items/")) {
    sendJson(res, 400, {
      success: false,
      error: {
        message: "Invalid item id format. Use a 24-character MongoDB ObjectId."
      }
    });
    return true;
  }

  return false;
}

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Performs manual route matching for all required API endpoints.

2. Why this file exists:
- Without Express, we must manually parse URL + method and call the right controller.

3. Why this syntax is used (key lines only):
- `new URL(req.url, baseUrl)` from `node:url` safely parses the request path.
- `req.method` decides which CRUD action is allowed on a route.
- Regex `^/api/items/([a-fA-F0-9]{24})$` extracts and validates dynamic `:id`.
- `res.setHeader("Allow", "...")` communicates valid methods for 405 responses.

4. Common mistakes in this file:
- String-splitting URL manually without proper parsing.
- Forgetting 405 handling for unsupported methods.
- Accepting invalid IDs and then leaking DB cast errors.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why use `new URL(req.url, baseUrl)` in Node core routing?

Answer:
- `req.url` can be relative; `new URL` provides reliable parsing for pathname/query extraction.

2. Question:
- How do you implement dynamic routes without Express?

Answer:
- Match the pathname using regex and pass captured params to controllers.

3. Question:
- Why return `true/false` from route handler?

Answer:
- It tells `app.js` whether a route was handled, enabling centralized 404 behavior.

4. Question:
- Why return 400 for invalid `/api/items/:id` format?

Answer:
- The path matches expected resource intent, but the parameter itself is malformed.
*/
