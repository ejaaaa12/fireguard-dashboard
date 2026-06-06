"use client";

"use client";

import { useState, useEffect } from "react";
import Navbar       from "@/components/Navbar";
import SensorCard   from "@/components/SensorCard";
import ControlPanel from "@/components/ControlPanel";
import ChartSection from "@/components/ChartSection";
import useMqtt      from "@/app/hooks/useMqtt";

export default function Home() {
  const [dark, setDark]         = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const { connected, data, history, logs, publish } = useMqtt();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const bg          = dark ? "#060912" : "#f8faff";
  const textMuted   = dark ? "#475569" : "#94a3b8";

  // ── Derived sensor values ──────────────────────────────────────
  const gasPercent    = Math.min(100, Math.round((data.gasPpm / 100) * 100));
  const gasBadge      = data.gasStatus === "BAHAYA" ? "Danger" : data.gasStatus === "WASPADA" ? "Warning" : "Good";
  const gasBadgeColor = data.gasStatus === "BAHAYA" ? "danger" : data.gasStatus === "WASPADA" ? "warn"   : "good";
  const gasBarColor   = data.gasStatus === "BAHAYA" ? "#ef4444" : data.gasStatus === "WASPADA" ? "#f59e0b" : "#22c55e";

  const tempPercent  = Math.min(100, Math.round((data.suhu / 80) * 100));
  const tempBarColor = data.suhu < 25 ? "#3b82f6" : data.suhu < 50 ? "#f59e0b" : "#ef4444";

  const flamePercent  = Math.min(100, Math.round(((4095 - data.flameRaw) / 4095) * 100));
  const isFireAlert   = data.flameStatus === "BAHAYA";
  const isSystemAlert = data.systemStatus !== "NORMAL";

  return (
    <div style={{ minHeight: "100vh", background: bg, transition: "background 0.3s" }}>
      <Navbar
        darkMode={dark}
        setDarkMode={setDark}
        isMobile={isMobile}
        connected={connected}
        systemStatus={data.systemStatus}
      />

      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: isMobile ? "16px 12px" : "28px 24px",
        display: "flex", flexDirection: "column",
        gap: isMobile ? 12 : 16,
      }}>

        {/* ── Hero ── */}
        <div style={{
          background: dark ? "#0d1e3b" : "#1d4ed8",
          borderRadius: isMobile ? 16 : 24,
          padding: isMobile ? "20px 18px" : "32px 36px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 14,
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? 20 : 26, fontWeight: 700, color: "#ffffff",
              marginBottom: 8, letterSpacing: "-0.5px", lineHeight: 1.3,
            }}>
              FireGuard+ Monitoring
            </h1>
            <p style={{ fontSize: isMobile ? 13 : 14, color: "#93c5fd", lineHeight: 1.6 }}>
              Monitoring gas, suhu, dan deteksi api secara realtime via ESP32 + MQTT HiveMQ.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignSelf: isMobile ? "flex-start" : "center" }}>
            <div style={{
              background: connected ? "#22c55e" : "#94a3b8",
              color: "#fff", borderRadius: 10, padding: "6px 16px",
              fontSize: 12, fontWeight: 700, textAlign: "center",
            }}>
              {connected ? "🟢 Live" : "⚫ Offline"}
            </div>
            <div style={{ fontSize: 11, color: "#93c5fd", textAlign: "center" }}>
              {history.length} data pts
            </div>
          </div>
        </div>

        {/* ── Fire / System Alert banner ── */}
        {isSystemAlert && (
          <div style={{
            background: dark ? "#2d0f0f" : "#fef2f2",
            border: "1.5px solid #ef4444",
            borderRadius: 16, padding: "14px 20px",
            display: "flex", alignItems: "center", gap: 12,
            animation: "shake 0.3s ease",
          }}>
            <span style={{ fontSize: 22 }}>🚨</span>
            <div>
              <div style={{ fontWeight: 700, color: "#ef4444", fontSize: 15 }}>
                {isFireAlert ? "API TERDETEKSI!" : data.systemStatus}
              </div>
              <div style={{ fontSize: 13, color: dark ? "#f87171" : "#dc2626" }}>
                {isFireAlert
                  ? "Flame sensor aktif — pompa dan pintu darurat diaktifkan."
                  : "Periksa kondisi segera."}
              </div>
            </div>
          </div>
        )}

        {/* ── Sensor Cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(220px, 1fr))",
          gap: isMobile ? 10 : 14,
        }}>
          <SensorCard
            title="Kadar Gas (MQ2)" icon="💨"
            value={data.gasPpm} unit="ppm"
            subtitle="Threshold: 23 waspada / 35 bahaya"
            percent={gasPercent} barColor={gasBarColor}
            badge={gasBadge} badgeColor={gasBadgeColor}
            dark={dark} isMobile={isMobile}
          />
          <SensorCard
            title="Suhu" icon="🌡️"
            value={data.suhu.toFixed(1)} unit="°C"
            subtitle="DHT11 — Threshold > 50°C"
            percent={tempPercent} barColor={tempBarColor}
            badge={data.suhuStatus === "TINGGI" ? "Danger" : "Normal"}
            badgeColor={data.suhuStatus === "TINGGI" ? "danger" : "good"}
            dark={dark} isMobile={isMobile}
          />
          <SensorCard
            title="Flame Sensor" icon="🔥"
            value={isFireAlert ? "BAHAYA" : "Aman"}
            unit="" subtitle={`ADC raw: ${data.flameRaw} (< 2000 = api)`}
            percent={flamePercent} barColor={isFireAlert ? "#ef4444" : "#22c55e"}
            badge={isFireAlert ? "Danger" : "Safe"}
            badgeColor={isFireAlert ? "danger" : "good"}
            dark={dark} isMobile={isMobile}
          />
          <SensorCard
            title="Deteksi Gerak (PIR)" icon="👁️"
            value={data.pirStatus === "ADA_ORANG" ? "Ada" : "Kosong"}
            subtitle={`Servo PIR: ${data.servoPir}° | Pintu: ${data.servoPintu}°`}
            badge={data.pirStatus === "ADA_ORANG" ? "Motion!" : "Clear"}
            badgeColor={data.pirStatus === "ADA_ORANG" ? "warn" : "good"}
            dark={dark} isMobile={isMobile}
          />
        </div>

        {/* ── Chart ── */}
        <ChartSection history={history} dark={dark} />

        {/* ── Control + Rules ── */}
        <ControlPanel
          publish={publish}
          dark={dark}
          isMobile={isMobile}
          mqttData={data}
        />

        {/* ── Activity Log ── */}
        <div style={{
          background: dark ? "#0f1117" : "#ffffff",
          border: `1px solid ${dark ? "#1e2130" : "#e8eaf0"}`,
          borderRadius: 16, padding: "16px 20px",
        }}>
          <div style={{ fontSize: 12, color: textMuted, fontWeight: 600, marginBottom: 10 }}>
            📋 Log Aktivitas
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 140, overflowY: "auto" }}>
            {logs.length === 0 ? (
              <div style={{ fontSize: 12, color: textMuted }}>Menunggu data MQTT...</div>
            ) : logs.map((l, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, fontSize: 12,
                color: dark ? "#94a3b8" : "#475569",
                padding: "4px 8px", borderRadius: 6,
                background: dark ? "#0d1520" : "#f8faff",
              }}>
                <span style={{ color: textMuted, flexShrink: 0 }}>{l.time}</span>
                <span>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ textAlign: "center", fontSize: 12, color: textMuted, padding: "8px 0 4px" }}>
          Powered by ESP32 + HiveMQ MQTT + Next.js
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        @keyframes shake {
          0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)}
        }
      `}</style>
    </div>
  );
}