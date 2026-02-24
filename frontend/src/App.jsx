import { useEffect, useState } from "react";
import {
  createItem,
  deleteItemById,
  fetchItems,
  healthCheck,
  updateItem
} from "./services/itemApi.js";

function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    void initialize();
  }, []);

  async function initialize() {
    setIsLoading(true);
    setError("");

    try {
      await healthCheck();
      setApiStatus("online");

      const initialItems = await fetchItems();
      setItems(initialItems);
    } catch (err) {
      setApiStatus("offline");
      setError(err.message || "Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setTitle("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanedTitle = title.trim();

    if (!cleanedTitle) {
      setError("Title is required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      if (editingId) {
        const updatedItem = await updateItem(editingId, { title: cleanedTitle });

        setItems((currentItems) =>
          currentItems.map((item) =>
            item._id === editingId ? updatedItem : item
          )
        );
      } else {
        const createdItem = await createItem({ title: cleanedTitle });
        setItems((currentItems) => [createdItem, ...currentItems]);
      }

      resetForm();
    } catch (err) {
      setError(err.message || "Save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEditClick(item) {
    setEditingId(item._id);
    setTitle(item.title);
    setError("");
  }

  async function handleDeleteClick(itemId) {
    setError("");

    try {
      await deleteItemById(itemId);
      setItems((currentItems) =>
        currentItems.filter((item) => item._id !== itemId)
      );

      if (editingId === itemId) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Delete failed.");
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Core Node CRUD</h1>
        <p className="subtitle">
          Backend status: <strong>{apiStatus}</strong>
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={isSaving}
            maxLength={120}
          />
          <button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : editingId ? "Update" : "Add"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="ghost"
              onClick={resetForm}
              disabled={isSaving}
            >
              Cancel Edit
            </button>
          ) : null}
        </form>

        {error ? <p className="error">{error}</p> : null}

        {isLoading ? (
          <p>Loading items...</p>
        ) : (
          <ul className="list">
            {items.map((item) => (
              <li key={item._id}>
                <span>{item.title}</span>
                <div className="actions">
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => handleEditClick(item)}
                    disabled={isSaving}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDeleteClick(item._id)}
                    disabled={isSaving}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;

/*
FILE EXPLANATION (for learning)

1. What this file does:
- Renders the full CRUD UI and manages frontend state for load/create/update/delete flows.

2. Why this file exists:
- It is the main React component that connects form actions to API service functions.

3. Why this syntax is used (key lines only):
- `useState(...)` stores UI and data states (items, loading, error, edit mode).
- `useEffect(() => { void initialize(); }, [])` loads initial data once after first render.
- `event.preventDefault()` stops browser form submit reload.
- `setItems(current => ...)` uses functional updates to avoid stale state bugs.

4. Common mistakes in this file:
- Mutating state arrays directly instead of creating new arrays.
- Not handling loading and error states.
- Mixing API call code everywhere instead of using service layer.
*/

/*
INTERVIEW PERSPECTIVE

1. Question:
- Why use one input for both create and update?

Answer:
- It keeps UI minimal and demonstrates mode-switching using `editingId`.

2. Question:
- Why use functional state updates like `setItems(current => ...)`?

Answer:
- It guarantees updates are based on the latest state snapshot.

3. Question:
- Why call `initialize` inside `useEffect` with empty dependency array?

Answer:
- To run startup data fetch once on component mount.

4. Question:
- Why keep `isLoading` and `isSaving` separately?

Answer:
- Loading the initial list and submitting form actions are different async states.
*/
