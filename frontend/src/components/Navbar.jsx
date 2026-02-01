import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("loggedIn");

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  return (
    <div
      style={{
        padding: "15px 30px",
        background: "#1677ff",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h3 style={{ margin: 0 }}>Job Tracker</h3>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {isLoggedIn ? (
          <>
            <Link to="/" style={linkStyle}>Dashboard</Link>
            <Link to="/add" style={linkStyle}>Add Job</Link>
            <button onClick={handleLogout} style={btnStyle}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={linkStyle}>Login</Link>
        )}
      </div>
    </div>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "500",
};

const btnStyle = {
  background: "#ff4d4f",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};
