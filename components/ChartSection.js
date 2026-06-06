"use client";
import { useEffect, useRef } from "react";

export default function ChartSection({ history, dark }) {
  const canvasRef = useRef(null);
  const bg        = dark ? "#0f1117" : "#ffffff";
  const border    = dark ? "#1e2130" : "#e8eaf0";
  const textMuted = dark ? "#64748b" : "#94a3b8";
  const gridColor = dark ? "#1e2130" : "#f1f5f9";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.length < 2) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth   = 1;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (H / 4) * i);
      ctx.lineTo(W, (H / 4) * i);
      ctx.stroke();
    }

    const drawLine = (data, color, maxVal, filled) => {
      if (data.length < 2) return;
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - (v / maxVal) * H * 0.85 - 8;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      if (filled) {
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fillStyle = color + "22";
        ctx.fill();
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth   = 2;
        ctx.lineJoin    = "round";
        ctx.stroke();
      }
    };

    const temps = history.map(d => d.suhu);
    const gases = history.map(d => d.gasPpm / 2);   // scale ke 0-50 agar visible
    const flames = history.map(d => (4095 - d.flameRaw) / 4095 * 100); // invert: makin rendah = makin ada api

    drawLine(temps,  "#ef4444", 80,  true);
    drawLine(temps,  "#ef4444", 80,  false);
    drawLine(gases,  "#f59e0b", 100, true);
    drawLine(gases,  "#f59e0b", 100, false);
    drawLine(flames, "#a855f7", 100, false);
  }, [history, dark]);

  const latest = history[history.length - 1];

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 20, padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          📈 Realtime Chart — {history.length} data points
        </span>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            ["#ef4444", "Suhu (°C)",   latest ? latest.suhu.toFixed(1) + "°C" : "—"],
            ["#f59e0b", "Gas (ppm)",   latest ? latest.gasPpm + " ppm"        : "—"],
            ["#a855f7", "Api (inv.)",  latest ? latest.flameRaw               : "—"],
          ].map(([c, l, v]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: textMuted }}>
              <div style={{ width: 14, height: 3, background: c, borderRadius: 2 }} />
              <span>{l}</span>
              {v && <span style={{ fontWeight: 600, color: c }}>{v}</span>}
            </div>
          ))}
        </div>
      </div>

      {history.length < 2 ? (
        <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: textMuted, fontSize: 13 }}>
          Menunggu data dari ESP32...
        </div>
      ) : (
        <canvas ref={canvasRef} style={{ width: "100%", height: 120, display: "block" }} />
      )}
    </div>
  );
}