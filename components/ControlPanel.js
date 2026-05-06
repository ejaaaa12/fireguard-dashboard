"use client";
import { useState } from "react";

function CtrlBtn({ label, active, color, onClick, dark }) {
  const base = {
    padding: "6px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
    cursor: "pointer", border: "none", transition: "all 0.15s",
  };
  const activeStyle = {
    background: color === "green" ? "#16a34a" : color === "red" ? "#dc2626" : "#2563eb",
    color: "#fff",
  };
  const inactiveStyle = {
    background: dark ? "#1e2130" : "#f1f5f9",
    color: dark ? "#64748b" : "#94a3b8",
  };
  return (
    <button style={{ ...base, ...(active ? activeStyle : inactiveStyle) }} onClick={onClick}>
      {label}
    </button>
  );
}

export default function ControlPanel({ onControl, dark }) {
  const [mode, setMode] = useState("manual");
  const [fan, setFan] = useState(false);
  const [spray, setSpray] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [servo, setServo] = useState(90);

  const bg = dark ? "#0f1117" : "#ffffff";
  const border = dark ? "#1e2130" : "#e8eaf0";
  const textPrimary = dark ? "#f1f5f9" : "#0f1117";
  const textMuted = dark ? "#64748b" : "#94a3b8";
  const rowBorder = dark ? "#1e2130" : "#f1f5f9";
  const trackBg = dark ? "#1e2130" : "#e2e8f0";

  const rules = [
    { icon: "💨", text: "Gas detected → Water spray ON" },
    { icon: "🌡️", text: "High temperature → Fan ON" },
    { icon: "🔥", text: "Fire detected → Alarm ON" },
    { icon: "👁️", text: "Motion detected → Alert sent" },
  ];

  const row = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 0", borderBottom: `1px solid ${rowBorder}`,
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 20, padding: "22px 24px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }}>
          🎛️ Control Panel
        </div>

        <div style={row}>
          <span style={{ fontSize: 14, color: textPrimary, fontWeight: 500 }}>⚙️ Mode</span>
          <div style={{ display: "flex", background: dark ? "#1e2130" : "#f1f5f9", borderRadius: 10, padding: 3 }}>
            {["manual", "auto"].map(m => (
              <button key={m} onClick={() => { setMode(m); onControl("mode", m); }}
                style={{
                  padding: "4px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", textTransform: "capitalize", transition: "all 0.15s",
                  background: mode === m ? (dark ? "#3b82f6" : "#2563eb") : "transparent",
                  color: mode === m ? "#fff" : textMuted,
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={row}>
          <span style={{ fontSize: 14, color: textPrimary, fontWeight: 500 }}>🌀 Fan</span>
          <div style={{ display: "flex", gap: 8 }}>
            <CtrlBtn label="ON" active={fan} color="green" dark={dark} onClick={() => { setFan(true); onControl("fan", 1); }} />
            <CtrlBtn label="OFF" active={!fan} color="gray" dark={dark} onClick={() => { setFan(false); onControl("fan", 0); }} />
          </div>
        </div>

        <div style={row}>
          <span style={{ fontSize: 14, color: textPrimary, fontWeight: 500 }}>💧 Water Spray</span>
          <div style={{ display: "flex", gap: 8 }}>
            <CtrlBtn label="ON" active={spray} color="green" dark={dark} onClick={() => { setSpray(true); onControl("spray", 1); }} />
            <CtrlBtn label="OFF" active={!spray} color="gray" dark={dark} onClick={() => { setSpray(false); onControl("spray", 0); }} />
          </div>
        </div>

        <div style={row}>
          <span style={{ fontSize: 14, color: textPrimary, fontWeight: 500 }}>🔔 Alarm</span>
          <div style={{ display: "flex", gap: 8 }}>
            <CtrlBtn label="ON" active={alarm} color="red" dark={dark} onClick={() => { setAlarm(true); onControl("buzzer", 1); }} />
            <CtrlBtn label="OFF" active={!alarm} color="gray" dark={dark} onClick={() => { setAlarm(false); onControl("buzzer", 0); }} />
          </div>
        </div>

        <div style={{ ...row, flexDirection: "column", alignItems: "flex-start", gap: 10, borderBottom: "none" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontSize: 14, color: textPrimary, fontWeight: 500 }}>🔧 Servo</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6" }}>{servo}°</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
            <button onClick={() => { setServo(0); onControl("servo", 0); }}
              style={{ fontSize: 12, padding: "4px 10px", borderRadius: 8, border: `1px solid ${border}`, background: "transparent", color: textMuted, cursor: "pointer" }}>
              Close
            </button>
            <input type="range" min="0" max="180" step="1" value={servo}
              onChange={e => { setServo(Number(e.target.value)); onControl("servo", Number(e.target.value)); }}
              style={{ flex: 1, accentColor: "#3b82f6" }} />
            <button onClick={() => { setServo(180); onControl("servo", 180); }}
              style={{ fontSize: 12, padding: "4px 10px", borderRadius: 8, border: `1px solid ${border}`, background: "#2563eb", color: "#fff", cursor: "pointer" }}>
              Open
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 20, padding: "22px 24px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }}>
          🤖 Automation Rules
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rules.map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: dark ? "#0d1520" : "#f8faff",
              border: `1px solid ${dark ? "#1e2130" : "#e0e8ff"}`,
              borderRadius: 12, padding: "12px 14px",
            }}>
              <span style={{ fontSize: 18 }}>{r.icon}</span>
              <span style={{ fontSize: 13, color: dark ? "#94a3b8" : "#475569", lineHeight: 1.4 }}>{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}