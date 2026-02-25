const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const errorMessage =
      payload?.error?.message ||
      `Request failed with status ${response.status}.`;
    throw new Error(errorMessage);
  }

  return payload;
}

export async function healthCheck() {
  return request("/api/health", { method: "GET" });
}

export async function fetchItems() {
  const payload = await request("/api/items", { method: "GET" });
  return payload.data.items;
}

export async function createItem(body) {
  const payload = await request("/api/items", {
    method: "POST",
    body: JSON.stringify(body)
  });
  return payload.data.item;
}

export async function updateItem(itemId, body) {
  const payload = await request(`/api/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });
  return payload.data.item;
}

export async function deleteItemById(itemId) {
  await request(`/api/items/${itemId}`, {
    method: "DELETE"
  });
}

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Encapsulates all frontend-to-backend HTTP calls for the item API.

2. Why this file exists:
- Keeps network logic separate from UI components for cleaner React code.

3. Why this syntax is used (key lines only):
- `fetch(base + path, options)` is the browser-native HTTP client.
- `import.meta.env.VITE_API_BASE_URL` reads Vite environment variables at build/runtime.
- `if (!response.ok) throw new Error(...)` normalizes backend failures for UI handling.

4. Common mistakes in this file:
- Hardcoding URLs in multiple components.
- Ignoring non-2xx responses.
- Forgetting `JSON.stringify` for POST/PUT bodies.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why build a shared `request` helper?

Answer:
- It centralizes error handling and headers so API functions stay small and consistent.

2. Question:
- Why not call `fetch` directly inside `App.jsx`?

Answer:
- Separation of concerns: UI handles state/rendering, service layer handles HTTP.

3. Question:
- Why throw `Error` on `!response.ok`?

Answer:
- It lets React code use standard `try/catch` flow with meaningful messages.
*/
