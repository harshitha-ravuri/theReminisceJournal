import React, { useState } from "react";

const card = {
  maxWidth: 420,
  margin: "40px auto",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  background: "#fff",
  border: "1px solid #eee",
};
const title = { margin: "0 0 16px", fontSize: 24, fontWeight: 700 };
const field = { display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 };
const label = { fontSize: 13, color: "#555", fontWeight: 600 };
const input = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};
const btn = {
  marginTop: 8,
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "none",
  fontWeight: 700,
  fontSize: 15,
  background: "linear-gradient(135deg,#6C5CE7,#A66BFF)",
  color: "#fff",
  cursor: "pointer",
};

function AuthForm({ isLogin = false, onSubmit }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={card}>
      <h2 style={title}>{isLogin ? "Welcome back" : "Create your account"}</h2>
      <form onSubmit={submitHandler}>
        {!isLogin && (
          <div style={field}>
            <label style={label}>Name</label>
            <input
              style={input}
              name="name"
              type="text"
              placeholder="e.g., Alex Carter"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
            />
          </div>
        )}
        <div style={field}>
          <label style={label}>Email</label>
          <input
            style={input}
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div style={field}>
          <label style={label}>Password</label>
          <input
            style={input}
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button style={btn} type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;
