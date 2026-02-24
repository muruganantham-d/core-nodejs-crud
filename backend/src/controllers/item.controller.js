import { Item } from "../models/item.model.js";
import { HttpError } from "../utils/httpError.js";
import { parseBody } from "../utils/parseBody.js";
import { sendJson } from "../utils/sendJson.js";

function validateTitle(title) {
  if (typeof title !== "string" || !title.trim()) {
    throw new HttpError(400, "title is required and must be a non-empty string.");
  }

  return title.trim();
}

export async function getHealth(req, res) {
  sendJson(res, 200, {
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString()
    }
  });
}

export async function getItems(req, res) {
  const items = await Item.find().sort({ createdAt: -1 });

  sendJson(res, 200, {
    success: true,
    data: {
      items
    }
  });
}

export async function createItem(req, res) {
  const body = await parseBody(req);
  const title = validateTitle(body.title);

  const item = await Item.create({ title });

  sendJson(res, 201, {
    success: true,
    message: "Item created successfully.",
    data: {
      item
    }
  });
}

export async function updateItem(req, res, itemId) {
  const body = await parseBody(req);
  const title = validateTitle(body.title);

  const item = await Item.findByIdAndUpdate(
    itemId,
    { title },
    {
      new: true,
      runValidators: true
    }
  );

  if (!item) {
    throw new HttpError(404, "Item not found.");
  }

  sendJson(res, 200, {
    success: true,
    message: "Item updated successfully.",
    data: {
      item
    }
  });
}

export async function deleteItem(req, res, itemId) {
  const item = await Item.findByIdAndDelete(itemId);

  if (!item) {
    throw new HttpError(404, "Item not found.");
  }

  sendJson(res, 200, {
    success: true,
    message: "Item deleted successfully.",
    data: {
      itemId
    }
  });
}

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Implements API business logic for health check and CRUD actions.

2. Why this file exists:
- Keeps route matching separate from actual CRUD operations and validations.

3. Why this syntax is used (key lines only):
- `await parseBody(req)` reads request payload manually from Node stream events.
- `sendJson(res, statusCode, payload)` standardizes JSON responses.
- `findByIdAndUpdate(..., { new: true, runValidators: true })` returns updated doc and enforces schema rules.
- Direct Node `res.end` is abstracted in `sendJson` so controller code stays clean.

4. Common mistakes in this file:
- Not trimming `title`, causing whitespace-only values.
- Returning inconsistent response formats across handlers.
- Forgetting 404 checks when update/delete target is missing.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why validate `title` in controller if schema already has required rules?

Answer:
- Controller validation gives immediate and clearer API-level error messages.

2. Question:
- Why use `runValidators: true` in `findByIdAndUpdate`?

Answer:
- Mongoose update operations can skip validators unless explicitly enabled.

3. Question:
- Why is `parseBody` awaited inside controller functions?

Answer:
- The request body arrives as async stream chunks in core Node, not as a ready object.

4. Question:
- Why do these handlers not directly parse URL params?

Answer:
- Route parsing belongs to routing layer; controllers should receive already-extracted IDs.
*/
