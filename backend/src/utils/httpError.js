export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Provides a custom error type that carries HTTP status code + message.

2. Why this file exists:
- Lets controllers throw typed errors and lets one central handler format output.

3. Why this syntax is used (key lines only):
- `class HttpError extends Error` preserves normal error behavior plus `statusCode`.
- No Node core `req`/`res` syntax is used here because this is a generic utility class.

4. Common mistakes in this file:
- Throwing plain `Error` for every case, making status mapping harder.
- Forgetting to set `this.name`, which can reduce debugging clarity.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why define a custom HTTP error class?

Answer:
- It separates expected client errors (400/404) from unexpected server errors (500).

2. Question:
- Could you avoid this class?

Answer:
- Yes, but custom classes make centralized error handling cleaner and less repetitive.
*/
