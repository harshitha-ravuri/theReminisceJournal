import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const wrap = { maxWidth: 720, margin: "24px auto", padding: "0 16px" };
const card = {
  padding: 16,
  border: "1px solid #eee",
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  background: "#fff",
};
const row = { display: "grid", gap: 10, gridTemplateColumns: "140px 1fr", alignItems: "center", marginBottom: 10 };
const label = { fontSize: 13, color: "#555", fontWeight: 700 };
const input = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};
const textarea = { ...input, minHeight: 90, resize: "vertical" };
const actions = { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" };
const btnPrimary = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "none",
  fontWeight: 700,
  background: "linear-gradient(135deg,#6C5CE7,#A66BFF)",
  color: "#fff",
  cursor: "pointer",
};
const btnGhost = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

export default function ProfilePage() {
  const navigate = useNavigate();

  // read user saved at login: { id, name, email }
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);
  const userId = user?.id || user?._id || "me";
  const storageKey = `profileExtras:${userId}`;

  const [birthdate, setBirthdate] = useState("");
  const [about, setAbout] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        setBirthdate(data.birthdate || "");
        setAbout(data.about || "");
      }
    } catch {
      // ignore parse errors
    }
  }, [storageKey]);

  const saveExtras = (e) => {
    e.preventDefault();
    localStorage.setItem(storageKey, JSON.stringify({ birthdate, about }));
    setSaved("Saved ✓");
    setTimeout(() => setSaved(""), 1500);
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <h2 style={{ margin: "0 0 12px" }}>My Profile</h2>

        <div style={row}>
          <div style={label}>Name</div>
          <div style={{ fontWeight: 700 }}>{user?.name || "—"}</div>
        </div>
        <div style={row}>
          <div style={label}>Email</div>
          <div style={{ opacity: 0.85 }}>{user?.email || "—"}</div>
        </div>

        <form onSubmit={saveExtras} style={{ marginTop: 16 }}>
          <div style={row}>
            <label style={label} htmlFor="birthdate">Birthdate</label>
            <input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              style={input}
            />
          </div>

          <div style={{ ...row, gridTemplateColumns: "140px 1fr" }}>
            <label style={label} htmlFor="about">Additional info</label>
            <textarea
              id="about"
              placeholder="Tell us anything you'd like to add…"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              style={textarea}
            />
          </div>

          <div style={actions}>
            <button type="submit" style={btnPrimary}>Save</button>
            <button type="button" style={btnGhost} onClick={() => navigate("/")}>
              ← Back to Home
            </button>
            {saved && <span style={{ alignSelf: "center", fontSize: 12, color: "#5c5cd6" }}>{saved}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
