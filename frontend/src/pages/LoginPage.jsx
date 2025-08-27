import React from "react";
import AuthForm from "../components/AuthForm";

const BASE = process.env.REACT_APP_API_URL;

function LoginPage() {
  const handleLogin = async (formData) => {
    const res = await fetch(`${BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // backend returns {_id, name, email, token}
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({ id: data._id, name: data.name, email: data.email })
    );

    window.location.href = "/search";
  };

  return <AuthForm isLogin={true} onSubmit={handleLogin} />;
}

export default LoginPage;
