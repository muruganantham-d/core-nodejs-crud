import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()]
});

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Configures Vite to compile and run a React application.

2. Why this file exists:
- Keeps build/dev-server behavior explicit and framework plugin setup centralized.

3. Why this syntax is used (key lines only):
- `defineConfig(...)` gives editor autocomplete and clean config structure.
- `plugins: [react()]` enables JSX transform and React Fast Refresh support.

4. Common mistakes in this file:
- Forgetting the React plugin, which breaks JSX handling.
- Mixing CommonJS syntax with ESM in Vite config.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why use `defineConfig` in Vite?

Answer:
- It improves readability and type hints, especially in editor tooling.

2. Question:
- What does `@vitejs/plugin-react` provide?

Answer:
- React-specific compilation behavior and fast refresh during development.
*/
