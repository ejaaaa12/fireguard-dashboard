"use client";
import { useEffect, useRef } from "react";

export default function ChartSection({ history, dark }) {
  const canvasRef = useRef(null);
  const bg = dark ? "#0f1117" : "#ffffff";
  const border = dark ? "#1e2130" : "#e8eaf0";
  const textMuted = dark ? "#64748b" : "#94a3b8";
  const gridColor = dark ? "#1e2130" : "#f1f5f9";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.length < 2) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
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
        const lastX = W;
        const lastY = H - (data[data.length - 1] / maxVal) * H * 0.85 - 8;
        ctx.lineTo(lastX, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fillStyle = color + "22";
        ctx.fill();
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.stroke();
      }
    };

    const temps = history.map(d => parseFloat(d.temp));
    const hums = history.map(d => parseFloat(d.humidity));
    const gases = history.map(d => d.gas / 5);

    drawLine(temps, "#ef4444", 50, true);
    drawLine(temps, "#ef4444", 50, false);
    drawLine(hums, "#3b82f6", 100, true);
    drawLine(hums, "#3b82f6", 100, false);
    drawLine(gases, "#f59e0b", 100, false);
  }, [history, dark]);

  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 20,
      padding: "22px 24px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          📈 Realtime Chart
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          {[["#ef4444", "Temp"], ["#3b82f6", "Humidity"], ["#f59e0b", "Gas"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: textMuted }}>
              <div style={{ width: 14, height: 3, background: c, borderRadius: 2 }} />
              {l}
            </div>
          ))}
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 120, display: "block" }} />
    </div>
  );
}