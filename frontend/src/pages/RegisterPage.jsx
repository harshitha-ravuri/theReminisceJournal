import React from "react";
import AuthForm from "../components/AuthForm";

const BASE = process.env.REACT_APP_API_URL;

function RegisterPage() {
  const handleRegister = async (formData) => {
    const res = await fetch(`${BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Registration successful! Please log in.");
    window.location.href = "/login";
  };

  return <AuthForm isLogin={false} onSubmit={handleRegister} />;
}

export default RegisterPage;
