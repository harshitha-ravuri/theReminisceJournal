// frontend/src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Icon */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: 18,
          left: 14,
          zIndex: 1100,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 28,
          color: "#999090ff",
          
        }}
      >
        ☰
      </button>

      {/* Overlay (click to close) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.31)",
            zIndex: 999,
            
          }}
        ></div>
      )}

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : "-550px",
          width: "150px",
          height: "100%",
          background: "#ffffffff",
          color: "#fff",
          padding: "20px",
          transition: "left 0.3s ease",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          
        }}
      >
        <h2 style={{ marginTop: 20 }}></h2>
        <Link to="/search" onClick={handleLinkClick} style={linkStyle}>
          Search
        </Link>
        <Link to="/history" onClick={handleLinkClick} style={linkStyle}>
          History
        </Link>
        <Link to="/notes" onClick={handleLinkClick} style={linkStyle}>
          Notes
        </Link>
        <Link to="/profile" onClick={handleLinkClick} style={linkStyle}>
          Profile
        </Link>
      </div>
    </>
  );
};

const linkStyle = {
  color: "#212121ff",
  textDecoration: "none",
  fontSize: 16,
  
};

export default Sidebar;
