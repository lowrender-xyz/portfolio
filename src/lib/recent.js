import { useEffect, useState } from "react";

// "Ouvidas recentemente": junta o histórico gravado pela automação do perfil no GitHub (a cada ~10 min,
// em recent.json no branch output) com o que este navegador viu tocar ao vivo pelo Lanyard.
const URL = "https://raw.githubusercontent.com/77sorryz/77sorryz/output/recent.json";
const KEY = "sorry:recent-tracks";
const MAX = 12;

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch (e) {
    return [];
  }
};
const merge = (...lists) => {
  const seen = new Map();
  for (const x of lists.flat()) if (x?.id && (!seen.has(x.id) || seen.get(x.id).at < x.at)) seen.set(x.id, x);
  return [...seen.values()].sort((a, b) => b.at - a.at).slice(0, MAX);
};

export function useRecent(spotify) {
  const [remote, setRemote] = useState([]);
  const [local, setLocal] = useState(read);

  useEffect(() => {
    let alive = true;
    fetch(URL)
      .then((r) => (r.ok ? r.json() : { tracks: [] }))
      .then((j) => alive && setRemote(j.tracks ?? []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // guarda a música atual quando ela aparece
  const id = spotify?.track_id;
  useEffect(() => {
    if (!id) return;
    const s = spotify;
    const next = merge([{ id, song: s.song, artist: s.artist.replace(/;\s*/g, ", "), album: s.album, art: s.album_art_url, at: Date.now() }], read());
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (e) {}
    setLocal(next);
  }, [id]);

  // a que está tocando agora já aparece no player
  return merge(remote, local).filter((x) => x.id !== id);
}

export function ago(ms, lang) {
  const m = Math.max(1, Math.round((Date.now() - ms) / 60000));
  const rtf = new Intl.RelativeTimeFormat(lang === "pt" ? "pt-BR" : "en", { numeric: "auto" });
  if (m < 60) return rtf.format(-m, "minute");
  const h = Math.round(m / 60);
  if (h < 24) return rtf.format(-h, "hour");
  return rtf.format(-Math.round(h / 24), "day");
}
