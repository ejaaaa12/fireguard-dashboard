"use client";
import { useState } from "react";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 32px",
      background: darkMode ? "#0f1117" : "#ffffff",
      borderBottom: darkMode ? "1px solid #1e2130" : "1px solid #e8eaf0",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>🔥</span>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: darkMode ? "#ffffff" : "#0f1117",
          letterSpacing: "-0.3px"
        }}>
          Fireguard <span style={{ color: "#3b82f6" }}>Dashboard</span>
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          background: darkMode ? "#0d2e1a" : "#f0fdf4",
          border: "1px solid #86efac",
          borderRadius: 20,
          padding: "5px 12px",
          fontSize: 12,
          color: "#16a34a",
          fontWeight: 500,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 6px #22c55e",
            animation: "blink 2s infinite"
          }} />
          Connected (MQTT)
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: darkMode ? "#1e2130" : "#f1f5f9",
            border: "none",
            borderRadius: 20,
            padding: "6px 14px",
            fontSize: 12,
            color: darkMode ? "#94a3b8" : "#475569",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </nav>
  );
}