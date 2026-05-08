"use client";

export default function SensorCard({ title, icon, value, unit, subtitle, percent, barColor, badge, badgeColor, dark, isMobile }) {
  const bg = dark ? "#0f1117" : "#ffffff";
  const border = dark ? "#1e2130" : "#e8eaf0";
  const textPrimary = dark ? "#f1f5f9" : "#0f1117";
  const textMuted = dark ? "#64748b" : "#94a3b8";
  const trackBg = dark ? "#1e2130" : "#f1f5f9";

  const badgeStyles = {
    good: { bg: dark ? "#0d2e1a" : "#f0fdf4", color: "#16a34a", border: "#86efac" },
    warn: { bg: dark ? "#2d1f00" : "#fffbeb", color: "#d97706", border: "#fcd34d" },
    danger: { bg: dark ? "#2d0f0f" : "#fef2f2", color: "#dc2626", border: "#fca5a5" },
  };
  const bs = badgeStyles[badgeColor] || badgeStyles.good;

  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: isMobile ? 14 : 20,
      padding: isMobile ? "14px 14px" : "22px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = dark ? "0 8px 32px #0006" : "0 8px 32px #0001"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{ fontSize: 12, color: textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</span>
        </div>
        {badge && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            background: bs.bg, color: bs.color,
            border: `1px solid ${bs.border}`,
            borderRadius: 20, padding: "3px 9px"
          }}>{badge}</span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: isMobile ? 26 : 36, fontWeight: 700, color: textPrimary, fontFamily: "'Syne', sans-serif" }}>{value}</span>
        {unit && <span style={{ fontSize: isMobile ? 12 : 14, color: textMuted }}>{unit}</span>}
      </div>

      {subtitle && <div style={{ fontSize: 12, color: textMuted }}>{subtitle}</div>}

      {percent !== undefined && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: textMuted, marginBottom: 5 }}>
            <span>Level</span><span>{percent}%</span>
          </div>
          <div style={{ height: 6, background: trackBg, borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 4,
              width: `${percent}%`,
              background: barColor || "#3b82f6",
              transition: "width 0.6s ease"
            }} />
          </div>
        </div>
      )}
    </div>
  );
}