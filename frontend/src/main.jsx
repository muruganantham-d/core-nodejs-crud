import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Bootstraps the React application into the DOM element with id `root`.

2. Why this file exists:
- Vite uses this as the frontend entry point to load components and global styles.

3. Why this syntax is used (key lines only):
- `ReactDOM.createRoot(...)` enables modern concurrent rendering behavior in React 18.
- `<React.StrictMode>` helps catch side-effect issues during development.
- Imports `App.css` once for global app styling.

4. Common mistakes in this file:
- Using the wrong DOM id that does not match `index.html`.
- Forgetting to import base styles.
- Keeping multiple root render calls.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why use `createRoot` instead of older `ReactDOM.render`?

Answer:
- `createRoot` is the React 18 API and supports modern rendering features.

2. Question:
- What does `StrictMode` do?

Answer:
- It intentionally re-runs certain logic in development to reveal unsafe side effects.
*/
