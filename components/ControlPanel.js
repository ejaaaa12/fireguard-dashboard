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

export default function ControlPanel({ publish, dark, isMobile, mqttData }) {
  const [mode, setMode]   = useState("manual");
  const [fan, setFan]     = useState(false);
  const [spray, setSpray] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [servo, setServo] = useState(0);

  const bg         = dark ? "#0f1117" : "#ffffff";
  const border     = dark ? "#1e2130" : "#e8eaf0";
  const textPrimary = dark ? "#f1f5f9" : "#0f1117";
  const textMuted  = dark ? "#64748b" : "#94a3b8";
  const rowBorder  = dark ? "#1e2130" : "#f1f5f9";

  // Sync state dengan data MQTT yang masuk dari ESP32
  const pompaOn  = mqttData?.pompa  === "ON";
  const kipasOn  = mqttData?.kipas  === "ON";

  const rules = [
    { icon: "💨", text: "Gas ≥ 23 ppm → Kipas ON otomatis" },
    { icon: "🌡️", text: "Suhu > 50°C → Buzzer ON" },
    { icon: "🔥", text: "Api terdeteksi → Pompa ON + Pintu buka" },
    { icon: "👁️", text: "Gerak terdeteksi → Servo PIR tracking" },
  ];

  const row = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 0", borderBottom: `1px solid ${rowBorder}`,
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>

      {/* ── Control Panel ── */}
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 20, padding: "22px 24px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }}>
          🎛️ Control Panel
          {mode === "manual" && (
            <span style={{ marginLeft: 8, fontSize: 10, color: "#f59e0b", fontWeight: 500 }}>
              (manual override)
            </span>
          )}
        </div>

        {/* Mode */}
        <div style={row}>
          <span style={{ fontSize: 14, color: textPrimary, fontWeight: 500 }}>⚙️ Mode</span>
          <div style={{ display: "flex", background: dark ? "#1e2130" : "#f1f5f9", borderRadius: 10, padding: 3 }}>
            {["manual", "auto"].map(m => (
              <button key={m} onClick={() => {
                setMode(m);
                publish("fireguard/web/mode", m);
              }}
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

        {/* Fan (Kipas) */}
        <div style={row}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, color: textPrimary, fontWeight: 500 }}>🌀 Kipas</span>
            {kipasOn && <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>• ACTIVE (auto)</span>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <CtrlBtn label="ON"  active={fan || kipasOn} color="green" dark={dark}
              onClick={() => { setFan(true);  publish("fireguard/web/kipas", "ON"); }} />
            <CtrlBtn label="OFF" active={!fan && !kipasOn} color="gray" dark={dark}
              onClick={() => { setFan(false); publish("fireguard/web/kipas", "OFF"); }} />
          </div>
        </div>

        {/* Water Spray (Pompa) */}
        <div style={row}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, color: textPrimary, fontWeight: 500 }}>💧 Pompa Air</span>
            {pompaOn && <span style={{ fontSize: 10, color: "#3b82f6", fontWeight: 600 }}>• ACTIVE (auto)</span>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <CtrlBtn label="ON"  active={spray || pompaOn} color="green" dark={dark}
              onClick={() => { setSpray(true);  publish("fireguard/web/pompa", "ON"); }} />
            <CtrlBtn label="OFF" active={!spray && !pompaOn} color="gray" dark={dark}
              onClick={() => { setSpray(false); publish("fireguard/web/pompa", "OFF"); }} />
          </div>
        </div>

        {/* Alarm (Buzzer) */}
        <div style={row}>
          <span style={{ fontSize: 14, color: textPrimary, fontWeight: 500 }}>🔔 Buzzer</span>
          <div style={{ display: "flex", gap: 8 }}>
            <CtrlBtn label="ON"  active={alarm} color="red" dark={dark}
              onClick={() => { setAlarm(true);  publish("fireguard/web/buzzer", "ON"); }} />
            <CtrlBtn label="OFF" active={!alarm} color="gray" dark={dark}
              onClick={() => { setAlarm(false); publish("fireguard/web/buzzer", "OFF"); }} />
          </div>
        </div>

        {/* Servo Pintu */}
        <div style={{ ...row, flexDirection: "column", alignItems: "flex-start", gap: 10, borderBottom: "none" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontSize: 14, color: textPrimary, fontWeight: 500 }}>🚪 Servo Pintu</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6" }}>
              {mqttData?.servoPintu ?? servo}°
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
            <button onClick={() => { setServo(0);   publish("fireguard/web/servo_pintu", "0"); }}
              style={{ fontSize: 12, padding: "4px 10px", borderRadius: 8, border: `1px solid ${border}`, background: "transparent", color: textMuted, cursor: "pointer" }}>
              Tutup
            </button>
            <input type="range" min="0" max="180" step="1" value={servo}
              onChange={e => {
                setServo(Number(e.target.value));
                publish("fireguard/web/servo_pintu", e.target.value);
              }}
              style={{ flex: 1, accentColor: "#3b82f6" }} />
            <button onClick={() => { setServo(180); publish("fireguard/web/servo_pintu", "180"); }}
              style={{ fontSize: 12, padding: "4px 10px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer" }}>
              Buka
            </button>
          </div>
        </div>
      </div>

      {/* ── Automation Rules ── */}
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 20, padding: "22px 24px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }}>
          🤖 Automation Rules (ESP32)
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

        {/* Log ringkas */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: textMuted, fontWeight: 600, marginBottom: 8 }}>📋 Status Aktuator</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["💧 Pompa",  mqttData?.pompa  === "ON"],
              ["🌀 Kipas",  mqttData?.kipas  === "ON"],
              ["🚪 Pintu",  (mqttData?.servoPintu ?? 0) >= 90],
              ["📡 PIR",    mqttData?.pirStatus === "ADA_ORANG"],
            ].map(([label, active]) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: active ? (dark ? "#0d2e1a" : "#f0fdf4") : (dark ? "#1e2130" : "#f8fafc"),
                border: `1px solid ${active ? "#86efac" : (dark ? "#1e2130" : "#e8eaf0")}`,
                borderRadius: 10, padding: "8px 12px",
                fontSize: 12, fontWeight: 500,
                color: active ? "#16a34a" : textMuted,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? "#22c55e" : "#94a3b8", flexShrink: 0 }} />
                {label}: <strong>{active ? "ON" : "OFF"}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}