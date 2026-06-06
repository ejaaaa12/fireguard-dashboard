"use client";
import { useEffect, useRef, useState } from "react";

// ── Kredensial HiveMQ Cloud Baru Kamu ─────────────────────────────
const BROKER_URL = "wss://2f77e302643340f8b63d38c051743935.s1.eu.hivemq.cloud:8884/mqtt";
const MQTT_USER  = "ejaaa123";
const MQTT_PASS  = "Admin1234";
// ───────────────────────────────────────────────────────────────

const TOPICS = [
  "fireguard/flame/nilai",
  "fireguard/flame/status",
  "fireguard/suhu/nilai",
  "fireguard/suhu/status",
  "fireguard/gas/ppm",
  "fireguard/gas/status",
  "fireguard/pir/status",
  "fireguard/pompa/status",
  "fireguard/kipas/status",
  "fireguard/servo_pintu/posisi",
  "fireguard/servo_pir/posisi",
  "fireguard/system/status",
];

export default function useMqtt() {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState({
    flameRaw: 0,
    flameStatus: "AMAN",
    suhu: 0,
    suhuStatus: "NORMAL",
    gasPpm: 0,
    gasStatus: "AMAN",
    pirStatus: "KOSONG",
    pompa: "OFF",
    kipas: "OFF",
    servoPintu: 0,
    servoPir: 0,
    systemStatus: "NORMAL",
  });
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("id-ID");
    setLogs((prev) => [{ time, msg }, ...prev].slice(0, 50));
  };

  // Publish ke ESP32 (kontrol aktuator dari website)
  const publish = (topic, value) => {
    if (clientRef.current && connected) {
      clientRef.current.publish(topic, String(value));
    }
  };

  useEffect(() => {
    let mqttClient;

    // Membuka library mqtt versi terbaru secara dinamis di sisi client
    import("mqtt")
      .then(({ default: mqtt }) => {
        mqttClient = mqtt.connect(BROKER_URL, {
          username: MQTT_USER,
          password: MQTT_PASS,
          clientId: "web_fg_" + Math.random().toString(16).slice(2, 8),
        });

        clientRef.current = mqttClient;

        mqttClient.on("connect", () => {
          setConnected(true);
          addLog("✅ MQTT terhubung ke HiveMQ Cloud");
          TOPICS.forEach((t) => mqttClient.subscribe(t));
        });

        mqttClient.on("error", (err) => {
          setConnected(false);
          addLog("❌ Error: " + err.message);
        });

        mqttClient.on("reconnect", () => {
          setConnected(false);
          addLog("🔄 Mencoba reconnect...");
        });

        mqttClient.on("close", () => setConnected(false));

        mqttClient.on("message", (topic, payload) => {
          const v = payload.toString();

          setData((prev) => {
            const next = { ...prev };
            switch (topic) {
              case "fireguard/flame/nilai":    next.flameRaw    = parseInt(v) || 0; break;
              case "fireguard/flame/status":   next.flameStatus = v; break;
              case "fireguard/suhu/nilai":     next.suhu        = parseFloat(v) || 0; break;
              case "fireguard/suhu/status":    next.suhuStatus  = v; break;
              case "fireguard/gas/ppm":        next.gasPpm      = parseInt(v) || 0; break;
              case "fireguard/gas/status":     next.gasStatus   = v; break;
              case "fireguard/pir/status":     next.pirStatus   = v; break;
              case "fireguard/pompa/status":   next.pompa       = v; break;
              case "fireguard/kipas/status":   next.kipas       = v; break;
              case "fireguard/servo_pintu/posisi": next.servoPintu = parseInt(v) || 0; break;
              case "fireguard/servo_pir/posisi":   next.servoPir   = parseInt(v) || 0; break;
              case "fireguard/system/status":  next.systemStatus = v; break;
            }
            return next;
          });

          // Update data grafik histori
          setData((current) => {
            setHistory((prev) => {
              const point = {
                suhu:    current.suhu,
                gasPpm:  current.gasPpm,
                flameRaw: current.flameRaw,
                time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              };
              return [...prev.slice(-59), point];
            });
            return current;
          });

          // Log event penting pada dashboard
          if (topic === "fireguard/flame/status" && v === "BAHAYA")
            addLog("🔥 Api terdeteksi! Flame sensor BAHAYA");
          if (topic === "fireguard/gas/status" && v === "BAHAYA")
            addLog("⚠️ Gas berbahaya! PPM melebihi batas");
          if (topic === "fireguard/pompa/status" && v === "ON")
            addLog("💧 Pompa air diaktifkan");
          if (topic === "fireguard/kipas/status" && v === "ON")
            addLog("🌀 Kipas ventilasi aktif");
          if (topic === "fireguard/servo_pintu/posisi" && parseInt(v) >= 90)
            addLog("🚪 Pintu darurat dibuka (" + v + "°)");
        });
      })
      .catch((err) => {
        addLog("❌ Gagal load library MQTT: " + err.message);
      });

    return () => {
      if (mqttClient) mqttClient.end();
    };
  }, []);

  return { connected, data, history, logs, publish };
}