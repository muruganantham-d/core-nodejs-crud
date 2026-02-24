export function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);

  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(body);
}

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Sends JSON responses with proper status code and content type.

2. Why this file exists:
- Avoids repeating `writeHead` and `end` logic in every controller.

3. Why this syntax is used (key lines only):
- `res.writeHead(statusCode, headers)` sets status + headers in core Node HTTP.
- `res.end(body)` completes the response stream to the client.
- `JSON.stringify(payload)` converts JS object to JSON string for transmission.

4. Common mistakes in this file:
- Forgetting `Content-Type: application/json`.
- Calling `res.end` without serializing object payloads.
- Writing multiple responses for one request.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why centralize response sending in a helper?

Answer:
- It ensures a consistent response format and reduces duplicate code.

2. Question:
- What happens if `res.end` is not called?

Answer:
- The HTTP connection may hang because the response is never finalized.

3. Question:
- Why set charset in Content-Type?

Answer:
- It declares UTF-8 encoding explicitly for predictable client parsing.
*/
