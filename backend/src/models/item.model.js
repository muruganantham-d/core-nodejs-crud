import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      minlength: [1, "Title cannot be empty."]
    }
  },
  {
    timestamps: true
  }
);

export const Item = mongoose.model("Item", itemSchema);

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Defines the MongoDB data shape for items (only one field: `title`).

2. Why this file exists:
- Keeps data validation and schema rules in one reusable model module.

3. Why this syntax is used (key lines only):
- `new mongoose.Schema({...})` defines field constraints and metadata.
- `trim: true` removes leading/trailing spaces automatically.
- `timestamps: true` adds `createdAt` and `updatedAt`.
- No Node `req`/`res` syntax is used here; this is persistence logic only.

4. Common mistakes in this file:
- Forgetting `required`, which allows empty documents.
- Not trimming string input.
- Duplicating schema rules in multiple places.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why validate both in schema and controller?

Answer:
- Controller gives friendly API-level messages; schema guarantees DB-level safety.

2. Question:
- What does `timestamps: true` add?

Answer:
- Mongoose auto-manages `createdAt` and `updatedAt` fields.

3. Question:
- Why keep only one field in this schema?

Answer:
- This project intentionally focuses on the CRUD API flow with minimal complexity.
*/
