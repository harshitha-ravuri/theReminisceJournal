import React, { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import HistoryPage from "./pages/HistoryPage";
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import NotesPage from "./pages/NotesPage";   // 👈 NEW
import Sidebar from "./components/Sidebar";  // 👈 NEW

const shell = { maxWidth: 1100, margin: "0 auto", padding: "0 16px" };
const header = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  background: "#ffffffcc",
  backdropFilter: "saturate(180%) blur(8px)",
  borderBottom: "1px solid #eee",
};
const navRow = {
  ...shell,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: 64,
};
const brand = { fontWeight: 900, letterSpacing: 0.3 };
const navLinks = { display: "flex", gap: 14, alignItems: "center" };
const link = { textDecoration: "none", color: "#333", fontWeight: 600, fontSize: 14 };
const primary = {
  ...link,
  padding: "8px 12px",
  borderRadius: 10,
  background: "linear-gradient(135deg,#6C5CE7,#A66BFF)",
  color: "#fff",
};
const avatar = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "#6C5CE7",
  color: "#fff",
  display: "grid",
  placeItems: "center",
  fontWeight: 800,
};

function Header() {
  const navigate = useNavigate();
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const isAuthed = Boolean(localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header style={header}>
      
      <div style={navRow}>
        <Link to="/" style={{ ...link, ...brand }}>
          Reminisce<span style={{ color: "#6C5CE7" }}>Journal</span>
        </Link>

        {!isAuthed ? (
          <div style={navLinks}>
            <Link to="/login" style={link}>Login</Link>
            <Link to="/register" style={primary}>Sign up</Link>
          </div>
        ) : (
          <div style={navLinks}>
            <Link to="/search" style={link}>Search</Link>
            <Link to="/history" style={link}>History</Link>
            {/* <Link to="/profile" style={link}>Profile</Link> */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ ...avatar, cursor: "pointer" }} onClick={() => navigate("/profile")}>
                {(user?.name || "U").trim().charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                {user?.name || "User"}
              </span>
              <button
                onClick={logout}
                style={{
                  border: "1px solid #ddd",
                  background: "#fff",
                  borderRadius: 10,
                  padding: "6px 10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <Sidebar />
      <div style={shell}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <HistoryPage />
              </PrivateRoute>
            }
          />

          <Route
           path="/profile"
           element={
             <PrivateRoute>
               <ProfilePage />
            </PrivateRoute>
           }
        />
        <Route
        path="/notes"   // 👈 NEW
        element={
          <PrivateRoute>
            <NotesPage />
          </PrivateRoute>
        }
      />

          {/* default: if authed go to search, else to login */}
          <Route
            path="/"
            element={
              localStorage.getItem("token") ? (
                <SearchPage />
              ) : (
                <LoginPage />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
