import React, { useEffect, useState } from "react";
import { apiGet } from "../utils/api";

const wrap = { maxWidth: 900, margin: "24px auto", padding: "0 16px" };
const item = {
  border: "1px solid #eee",
  background: "#fff",
  padding: 14,
  borderRadius: 14,
  marginBottom: 10,
  boxShadow: "0 6px 18px rgba(166, 107, 255, 0.49)",
};

export default function HistoryPage() {
  const [allItems, setAllItems] = useState([]); // full history
  const [items, setItems] = useState([]); // filtered results
  const [status, setStatus] = useState("Loading...");
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet("/history");
        const data = await res.json();
        if (!res.ok) {
          setStatus(data?.message || "Failed to load history");
          return;
        }
        setAllItems(data);
        setItems(data);
        setStatus("");
      } catch (err) {
        console.error(err);
        setStatus("Network error");
      }
    })();
  }, []);

  // handle search filter
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (!value.trim()) {
      setItems(allItems); // reset to full history if cleared
      return;
    }

    const filtered = allItems.filter((it) => {
      const wordMatch = it.word.toLowerCase().includes(value);
      const dateMatch = new Date(it.createdAt)
        .toLocaleDateString()
        .toLowerCase()
        .includes(value);
      return wordMatch || dateMatch;
    });

    setItems(filtered);
  };

  return (
    <div style={wrap}>
      <h2 style={{ margin: "8px 0 16px" }}>Your History</h2>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search by word or date..."
        value={query}
        onChange={handleSearch}
        style={{
          width: "100%",
          padding: "10px 12px",
          marginBottom: "16px",
          borderRadius: 12,
          border: "1px solid #ccc",
          fontSize: 14,
        }}
      />

      {status && <p>{status}</p>}
      {!status && allItems.length === 0 && (
        <p>No history yet. Try searching a word on the Search page.</p>
      )}
      {!status && allItems.length > 0 && items.length === 0 && (
        <p>No matching records found.</p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((it) => (
          <li key={it._id} style={item}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <strong style={{ textTransform: "capitalize", fontSize: 18 }}>
                {it.word}
              </strong>
              <small style={{ color: "#777" }}>
                {new Date(it.createdAt).toLocaleString()}
              </small>
            </div>
            {it.definition ? (
              <p style={{ margin: "6px 0 0", lineHeight: 1.5 }}>{it.definition}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
