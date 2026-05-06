"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SensorCard from "../components/SensorCard";
import ControlPanel from "../components/ControlPanel";
import ChartSection from "../components/ChartSection";

export default function Home() {
  const [dark, setDark] = useState(true);
  const [data, setData] = useState({ temp: 28.4, humidity: 72, gas: 248, fire: false });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = {
        temp: parseFloat((20 + Math.random() * 20).toFixed(1)),
        humidity: parseFloat((50 + Math.random() * 50).toFixed(1)),
        gas: Math.floor(50 + Math.random() * 450),
        fire: Math.random() > 0.88,
      };
      setData(newData);
      setHistory(prev => [...prev.slice(-29), newData]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleControl = (device, value) => {
    console.log(`Device: ${device}, Value: ${value}`);
  };

  const bg = dark ? "#060912" : "#f8faff";
  const textPrimary = dark ? "#f1f5f9" : "#0f1117";
  const textMuted = dark ? "#475569" : "#94a3b8";

  const gasPercent = Math.round((data.gas / 500) * 100);
  const gasBadge = data.gas < 150 ? "Good" : data.gas < 300 ? "Warning" : "Danger";
  const gasBadgeColor = data.gas < 150 ? "good" : data.gas < 300 ? "warn" : "danger";
  const gasBarColor = data.gas < 150 ? "#22c55e" : data.gas < 300 ? "#f59e0b" : "#ef4444";
  const tempPercent = Math.round((data.temp / 40) * 100);
  const tempBarColor = data.temp < 25 ? "#3b82f6" : data.temp < 35 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ minHeight: "100vh", background: bg, transition: "background 0.3s" }}>
      <Navbar darkMode={dark} setDarkMode={setDark} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Hero */}
        <div style={{
          background: dark ? "#0d1e3b" : "#1d4ed8",
          borderRadius: 24,
          padding: "32px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 26, fontWeight: 700, color: "#ffffff",
              marginBottom: 8, letterSpacing: "-0.5px"
            }}>
              Smart Environment Monitoring
            </h1>
            <p style={{ fontSize: 14, color: "#93c5fd", maxWidth: 480, lineHeight: 1.6 }}>
              Monitoring gas, temperature, humidity, and fire detection in realtime via ESP32 + MQTT.
            </p>
          </div>
          <button style={{
            background: "#ffffff", color: "#1d4ed8",
            border: "none", borderRadius: 12,
            padding: "10px 22px", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Syne', sans-serif",
          }}>
            Open Dashboard →
          </button>
        </div>

        {/* Fire alert */}
        {data.fire && (
          <div style={{
            background: dark ? "#2d0f0f" : "#fef2f2",
            border: "1.5px solid #ef4444",
            borderRadius: 16, padding: "14px 20px",
            display: "flex", alignItems: "center", gap: 12,
            animation: "shake 0.3s ease"
          }}>
            <span style={{ fontSize: 22 }}>🚨</span>
            <div>
              <div style={{ fontWeight: 700, color: "#ef4444", fontSize: 15 }}>FIRE DETECTED!</div>
              <div style={{ fontSize: 13, color: dark ? "#f87171" : "#dc2626" }}>Flame sensor triggered — check immediately.</div>
            </div>
          </div>
        )}

        {/* Sensor Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          <SensorCard
            title="Air Quality (MQ135)" icon="💨"
            value={data.gas} unit="ppm"
            subtitle="CO2, NH3, Smoke"
            percent={gasPercent} barColor={gasBarColor}
            badge={gasBadge} badgeColor={gasBadgeColor}
            dark={dark}
          />
          <SensorCard
            title="Temperature" icon="🌡️"
            value={data.temp} unit="°C"
            subtitle="DHT11 Sensor"
            percent={tempPercent} barColor={tempBarColor}
            dark={dark}
          />
          <SensorCard
            title="Humidity" icon="💧"
            value={data.humidity} unit="%"
            subtitle="Relative Humidity"
            percent={Math.round(data.humidity)} barColor="#3b82f6"
            dark={dark}
          />
          <SensorCard
            title="Fire Sensor" icon="🔥"
            value={data.fire ? "ALERT" : "Safe"}
            subtitle="Flame Detector"
            badge={data.fire ? "Danger" : "Normal"}
            badgeColor={data.fire ? "danger" : "good"}
            dark={dark}
          />
        </div>

        {/* Chart */}
        <ChartSection history={history} dark={dark} />

        {/* Control + Rules */}
        <ControlPanel onControl={handleControl} dark={dark} />

        {/* Footer */}
        <div style={{ textAlign: "center", fontSize: 12, color: textMuted, padding: "8px 0 4px" }}>
          Powered by ESP32 + MQTT + IoT
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