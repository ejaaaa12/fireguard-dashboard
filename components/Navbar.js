"use client";
import { useState } from "react";

export default function Navbar({ darkMode, setDarkMode, isMobile, connected, systemStatus }) {
  const isAlert = systemStatus && systemStatus !== "NORMAL";

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: isMobile ? "12px 16px" : "14px 32px",
      background: darkMode ? "#0f1117" : "#ffffff",
      borderBottom: darkMode ? "1px solid #1e2130" : "1px solid #e8eaf0",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>🔥</span>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: isMobile ? 15 : 18,
          color: darkMode ? "#ffffff" : "#0f1117",
          letterSpacing: "-0.3px",
        }}>
          FireGuard <span style={{ color: "#3b82f6" }}>+</span>
        </span>
      </div>

      {/* Status pills */}
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 14 }}>

        {/* System status */}
        {isAlert && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: darkMode ? "#2d0f0f" : "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: 20,
            padding: isMobile ? "4px 8px" : "5px 12px",
            fontSize: 12,
            color: "#dc2626",
            fontWeight: 600,
            animation: "blink 1s infinite",
          }}>
            🚨 {isMobile ? "" : systemStatus}
          </div>
        )}

        {/* MQTT connection */}
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          background: connected
            ? (darkMode ? "#0d2e1a" : "#f0fdf4")
            : (darkMode ? "#1e2130" : "#f8fafc"),
          border: connected ? "1px solid #86efac" : "1px solid #cbd5e1",
          borderRadius: 20,
          padding: isMobile ? "5px 8px" : "5px 12px",
          fontSize: 12,
          color: connected ? "#16a34a" : "#94a3b8",
          fontWeight: 500,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: connected ? "#22c55e" : "#94a3b8",
            boxShadow: connected ? "0 0 6px #22c55e" : "none",
            animation: connected ? "blink 2s infinite" : "none",
          }} />
          {!isMobile && (connected ? "Connected (MQTT)" : "Disconnected")}
        </div>

        {/* Dark mode toggle */}
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