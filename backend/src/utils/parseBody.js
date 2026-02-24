import { HttpError } from "./httpError.js";

const DEFAULT_MAX_BODY_SIZE = Number(process.env.MAX_BODY_SIZE) || 1024 * 1024;

export function parseBody(req, maxBodySize = DEFAULT_MAX_BODY_SIZE) {
  return new Promise((resolve, reject) => {
    let receivedBytes = 0;
    let rawBody = "";

    req.on("data", (chunk) => {
      receivedBytes += chunk.length;

      if (receivedBytes > maxBodySize) {
        reject(
          new HttpError(
            413,
            `Request body too large. Max allowed size is ${maxBodySize} bytes.`
          )
        );
        req.destroy();
        return;
      }

      rawBody += chunk.toString("utf8");
    });

    req.on("end", () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        const parsed = JSON.parse(rawBody);
        resolve(parsed);
      } catch {
        reject(new HttpError(400, "Invalid JSON body."));
      }
    });

    req.on("error", () => {
      reject(new HttpError(400, "Could not read request body."));
    });
  });
}

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Reads and parses JSON body from raw Node request streams with a safety size limit.

2. Why this file exists:
- In core Node, `req.body` does not exist by default, so parsing must be manual.

3. Why this syntax is used (key lines only):
- `req.on("data", chunk => {})` receives streamed body chunks.
- `req.on("end", () => {})` runs when all body chunks are received.
- `req.destroy()` immediately stops reading when payload exceeds safe size.
- `JSON.parse(rawBody)` converts incoming JSON text to a JS object.

4. Common mistakes in this file:
- Assuming body arrives in one chunk.
- Forgetting size checks (risk: memory abuse).
- Not handling invalid JSON parse errors.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why is body parsing manual in this project?

Answer:
- Because Express/body-parser are intentionally not used; this demonstrates Node core stream handling.

2. Question:
- Why return `{}` for empty body?

Answer:
- It avoids null checks in controllers and keeps request handling predictable.

3. Question:
- Why send status `413` for large payloads?

Answer:
- `413 Payload Too Large` is the standard HTTP response for body size overflow.
*/
