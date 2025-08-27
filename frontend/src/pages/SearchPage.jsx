import React, { useMemo, useState } from "react";
import { apiPost } from "../utils/api";

const wrap = { maxWidth: 960, margin: "24px auto", padding: "0 16px" };
const topRow = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  marginBottom: 16,
  flexWrap: "wrap",
};
const searchCard = {
  padding: 16,
  border: "1px solid #eee",
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  background: "#fff",
};
const input = {
  flex: 1,
  minWidth: 260,
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  fontSize: 15,
};
const btn = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "none",
  fontWeight: 700,
  background: "linear-gradient(135deg,#6C5CE7,#A66BFF)",
  color: "#fff",
  cursor: "pointer",
};
const pill = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "#f3f3ff",
  border: "1px solid #e5e5ff",
  fontSize: 12,
  color: "#5c5cd6",
};
const card = {
  marginTop: 16,
  padding: 16,
  border: "1px solid #eee",
  borderRadius: 14,
  background: "#fff",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
};

export default function SearchPage() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const searchWord = async (e) => {
    e?.preventDefault?.();
    if (!word.trim()) return;

    setStatus("Searching...");
    setResult(null);

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
          word.trim()
        )}`
      );
      const data = await res.json();

      if (!res.ok) {
        setStatus(data?.title || "No Definitions Found");
        return;
      }

      setResult(data);

      const firstMeaning =
        data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition || "";
      const brief = firstMeaning.toString().slice(0, 220);

      // save to user history if logged in
      await apiPost("/history", { word: word.trim(), definition: brief });
      setStatus("Saved to your history ✓");
    } catch (err) {
      console.error(err);
      setStatus("Network error");
    }
  };

  return (
    <div style={wrap}>
      <div style={{ ...searchCard }}>
        <form onSubmit={searchWord} style={topRow}>
          <input
            style={input}
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Search a word, idiom, or phrase…"
            autoFocus
          />
          <button style={btn} type="submit">Search</button>
          {status && <span style={pill}>{status}</span>}
        </form>
      </div>

      {Array.isArray(result) &&
        result.map((entry, i) => (
          <div key={i} style={card}>
            <h2 style={{ margin: "0 0 6px" }}>{entry.word}</h2>
            {entry.phonetic && (
              <div style={{ opacity: 0.7, marginBottom: 8 }}>/ {entry.phonetic} /</div>
            )}
            {entry.meanings?.map((m, idx) => (
              <div key={idx} style={{ marginTop: 10 }}>
                <strong style={{ textTransform: "capitalize" }}>
                  {m.partOfSpeech}
                </strong>
                <ul style={{ margin: "6px 0 0 18px" }}>
                  {m.definitions?.slice(0, 3).map((d, j) => (
                    <li key={j}>
                      {d.definition}
                      {d.example ? <em> — “{d.example}”</em> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
