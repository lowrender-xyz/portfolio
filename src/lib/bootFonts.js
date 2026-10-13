// Fontes que a abertura pode sortear para montar "sorry." em pontos. Todas do Google Fonts e todas pesadas o
// bastante para a trama de pontos ler bem (fontes finas viram poeira na amostragem).
export const DEFAULT_FONT = { name: "Space Grotesk", family: "Space Grotesk", weight: 700, css: null };

export const BOOT_FONTS = [
  { name: "Bebas Neue", family: "Bebas Neue", weight: 400, css: "Bebas+Neue", scale: 1.25 },
  { name: "Press Start 2P", family: "Press Start 2P", weight: 400, css: "Press+Start+2P", scale: 0.78 },
  { name: "Bungee", family: "Bungee", weight: 400, css: "Bungee" },
  { name: "Rubik Mono One", family: "Rubik Mono One", weight: 400, css: "Rubik+Mono+One", scale: 0.85 },
  { name: "Orbitron", family: "Orbitron", weight: 900, css: "Orbitron:wght@900" },
  { name: "Unbounded", family: "Unbounded", weight: 900, css: "Unbounded:wght@900" },
  { name: "Syne", family: "Syne", weight: 800, css: "Syne:wght@800" },
  { name: "Archivo Black", family: "Archivo Black", weight: 400, css: "Archivo+Black" },
  { name: "Instrument Serif", family: "Instrument Serif", weight: 400, css: "Instrument+Serif:ital@1", style: "italic", scale: 1.15 },
  { name: "Silkscreen", family: "Silkscreen", weight: 700, css: "Silkscreen:wght@700" },
  { name: "Righteous", family: "Righteous", weight: 400, css: "Righteous" },
  { name: "Black Ops One", family: "Black Ops One", weight: 400, css: "Black+Ops+One" },
];

// chance de uma visita abrir com fonte sorteada (no resto, a fonte padrão do site)
export const RANDOM_CHANCE = 0.7;

export const fontString = (f, px) => `${f.style ?? "normal"} ${f.weight} ${px}px "${f.family}"`;

const loaded = new Set();
// carrega a fonte do Google Fonts e espera ela estar pronta para o canvas
export async function loadFont(f) {
  if (loaded.has(f.name)) return f;
  // a fonte padrão já vem no CSS da página, mas o navegador só a baixa quando algo a usa: pede explicitamente
  if (!f.css) {
    try {
      await document.fonts.load(fontString(f, 64), "sorry.");
    } catch (e) {}
    loaded.add(f.name);
    return f;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${f.css}&display=block&text=${encodeURIComponent("sorry.")}`;
  document.head.appendChild(link);
  await new Promise((ok) => ((link.onload = ok), (link.onerror = ok)));
  try {
    await document.fonts.load(fontString(f, 64), "sorry.");
  } catch (e) {}
  loaded.add(f.name);
  return f;
}

// sorteia uma fonte diferente da atual
export function pickFont(except) {
  const pool = BOOT_FONTS.filter((f) => f.name !== except?.name);
  return pool[Math.floor(Math.random() * pool.length)];
}
