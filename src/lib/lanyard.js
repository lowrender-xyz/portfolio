import { useEffect, useState } from "react";
import { site } from "../data/site.js";

// Presença ao vivo pelo Lanyard (https://github.com/Phineas/lanyard): REST na carga e WebSocket depois.
const API = `https://api.lanyard.rest/v1/users/${site.discord.id}`;
const WS = "wss://api.lanyard.rest/socket";

export function useLanyard(enabled = true) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!enabled) return;
    let ws, beat, retry, alive = true;
    fetch(API)
      .then((r) => r.json())
      .then((j) => alive && j.success && setData(j.data))
      .catch(() => {});
    const connect = () => {
      ws = new WebSocket(WS);
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.op === 1) {
          ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: site.discord.id } }));
          beat = setInterval(() => ws.readyState === 1 && ws.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval);
        } else if (msg.op === 0 && alive) setData(msg.d);
      };
      ws.onclose = () => {
        clearInterval(beat);
        if (alive) retry = setTimeout(connect, 5000);
      };
    };
    connect();
    return () => {
      alive = false;
      clearInterval(beat);
      clearTimeout(retry);
      ws?.close();
    };
  }, [enabled]);
  return data;
}

// relógio que avança a cada segundo enquanto algo está tocando/rodando
export function useNow(active) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

export const fmt = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  const p = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${p(m)}:${p(r)}` : `${m}:${p(r)}`;
};
