import React, { useEffect, useState, useMemo } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";

const wrap = { maxWidth: 900, margin: "24px auto", padding: "0 16px" };
const h2 = { color: "#6C5CE7", margin: "0 0 16px", fontWeight: 900 };
const grid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 12,
};
const card = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  padding: 16,
};
const row = { display: "grid", gap: 10 };
const input = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};
const textarea = { ...input, minHeight: 90, resize: "vertical" };
const actions = { display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" };
const btnPrimary = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "none",
  fontWeight: 800,
  background: "linear-gradient(135deg,#6C5CE7,#A66BFF)",
  color: "#fff",
  cursor: "pointer",
};
const btnGhost = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
const badge = {
  fontSize: 12,
  padding: "4px 8px",
  borderRadius: 999,
  background: "#f3f1ff",
  color: "#6C5CE7",
  fontWeight: 800,
  border: "1px solid #e9e6ff",
};

function NoteItem({ note, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // sync when the card is reused with new data
    setTitle(note.title || "");
    setContent(note.content || "");
  }, [note._id]);

  const saveEdit = async () => {
    setSaving(true);
    const res = await onUpdate(note._id, { title, content });
    setSaving(false);
    if (res) setEditing(false);
  };

  const togglePin = async () => {
    setSaving(true);
    await onUpdate(note._id, { pinned: !note.pinned });
    setSaving(false);
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        {editing ? (
          <input
            style={{ ...input, fontWeight: 800 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <strong style={{ fontSize: 16 }}>{note.title || "Untitled"}</strong>
            {note.pinned && <span style={badge}>Pinned</span>}
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button
            title={note.pinned ? "Unpin" : "Pin"}
            onClick={togglePin}
            style={btnGhost}
            disabled={saving}
          >
            {note.pinned ? "⭐ Unpin" : "☆ Pin"}
          </button>
          {editing ? (
            <>
              <button onClick={saveEdit} style={btnPrimary} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setEditing(false)} style={btnGhost} disabled={saving}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} style={btnGhost}>
                Edit
              </button>
              <button
                onClick={() => onDelete(note._id)}
                style={{ ...btnGhost, borderColor: "#ffd7d7", color: "#b10000" }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        {editing ? (
          <textarea
            style={textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
          />
        ) : (
          <p style={{ whiteSpace: "pre-wrap", margin: 0, opacity: 0.95 }}>{note.content || "—"}</p>
        )}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
        Updated {new Date(note.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState("");

  const loadNotes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiGet("/notes");
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data || []);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const createNote = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() && !newContent.trim()) return; // nothing to save
    setCreating(true);
    setError("");
    try {
      const res = await apiPost("/notes", {
        title: newTitle.trim(),
        content: newContent.trim(),
      });
      if (!res.ok) throw new Error("Failed to create note");
      const created = await res.json();
      setNotes((prev) => [created, ...prev]);
      setNewTitle("");
      setNewContent("");
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setCreating(false);
    }
  };

  const updateNote = async (id, fields) => {
    setError("");
    try {
      const res = await apiPut(`/notes/${id}`, fields);
      if (!res.ok) throw new Error("Failed to update note");
      const updated = await res.json();
      setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
      return true;
    } catch (e) {
      setError(e.message || "Error");
      return false;
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    setError("");
    try {
      const res = await apiDelete(`/notes/${id}`);
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (e) {
      setError(e.message || "Error");
    }
  };

  return (
    <div style={wrap}>
      <h2 style={h2}>📝 My Notes</h2>

      {/* Create new note */}
      <form onSubmit={createNote} style={{ ...card, marginBottom: 12 }}>
        <div style={row}>
          <input
            style={input}
            placeholder="Title (optional)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            style={textarea}
            placeholder="Write something you want to remember…"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
        </div>
        <div style={actions}>
          <button type="submit" style={btnPrimary} disabled={creating}>
            {creating ? "Saving…" : "Add Note"}
          </button>
          <button
            type="button"
            style={btnGhost}
            onClick={() => {
              setNewTitle("");
              setNewContent("");
            }}
            disabled={creating}
          >
            Clear
          </button>
          {error && (
            <span style={{ alignSelf: "center", color: "#b10000", fontSize: 12 }}>
              {error}
            </span>
          )}
        </div>
      </form>

      {/* Notes list */}
      {loading ? (
        <div style={card}>Loading…</div>
      ) : notes.length === 0 ? (
        <div style={card}>No notes yet. Create your first one above.</div>
      ) : (
        <div style={grid}>
          {notes.map((note) => (
            <NoteItem
              key={note._id}
              note={note}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
