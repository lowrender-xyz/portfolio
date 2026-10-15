// Captura telas REAIS do sorry hub (app desktop em D:\Projetos\A MECH) para o portfólio, pela prévia web do app.
// Uso: PW=<pasta com @playwright/test> [TEMA=claro] node scripts/capture-sorryhub.mjs [nome...]
// Requer: Vite do app em :5181 (`vite --host 127.0.0.1 --port 5181 --strictPort`), nunca a porta padrão 5173.
//
// Dados de demonstração (só nesta captura, no localStorage do navegador do Playwright):
//  - config: a config real do app (%APPDATA%\sorry\config.json: teclado escolhido, blocos do Início), com
//    histórico, tempo por app e ideias de demonstração por cima;
//  - histórico: 120 dias fictícios gerados com semente fixa (mulberry32), só contagens, como o app grava;
//  - apps em foco: os apps reais já vistos pelo app (%APPDATA%\sorry\apps.json, com o ícone do .exe),
//    enviados pelo evento de prévia `sorry:focus` que o próprio app oferece;
//  - ideias: itens reais de docs/proximos-passos.md do app;
//  - a sessão ao vivo (WPM, sinal, mapa de calor) vem de digitação de verdade feita pelo Playwright.
// O rótulo "prévia web" da barra de cima é trocado por "desktop", que é o que o app instalado mostra.
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

const require = createRequire(path.join(path.resolve(process.env.PW ?? "."), "package.json"));
const { chromium } = require("@playwright/test");

const BASE = "http://127.0.0.1:5181";
if (!/:5181$/.test(BASE)) throw new Error("recuso capturar fora da porta própria");
const LIGHT = process.env.TEMA === "claro";
const OUT = path.resolve("public/projects/sorry-hub");
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);

const DATA = path.join(process.env.APPDATA, "sorry");
const realConfig = JSON.parse(fs.readFileSync(path.join(DATA, "config.json"), "utf8"));
const realApps = JSON.parse(fs.readFileSync(path.join(DATA, "apps.json"), "utf8"));

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// histórico: dias úteis mais cheios, fins de semana mais leves, alguns dias sem uso
const rnd = mulberry32(77);
const KEYS = "KeyE KeyA KeyO KeyS KeyR KeyI KeyN KeyD KeyM KeyU KeyT KeyC KeyL KeyP KeyV KeyG KeyH KeyQ KeyB KeyF KeyZ KeyJ KeyX KeyK KeyW KeyY Space Backspace Enter ShiftLeft ControlLeft Comma Period Digit1 Digit2 Tab".split(" ");
const history = {};
const now = new Date();
for (let i = 120; i >= 1; i--) {
  const d = new Date(now); d.setDate(now.getDate() - i);
  const weekend = d.getDay() === 0 || d.getDay() === 6;
  if (rnd() < (weekend ? 0.3 : 0.08)) continue;
  const keys = Math.round((weekend ? 3500 : 9000) * (0.4 + rnd() * 1.2));
  const counts = {};
  let left = keys;
  KEYS.forEach((k, j) => {
    const share = j === KEYS.length - 1 ? left : Math.round(keys * (0.16 / (1 + j * 0.35)) * (0.7 + rnd() * 0.6));
    const c = Math.max(0, Math.min(left, share));
    if (c) counts[k] = c;
    left -= c;
  });
  history[dayKey(d)] = { keys, clicks: Math.round(keys * (0.25 + rnd() * 0.3)), peakWpm: Math.round(62 + rnd() * 38), typingSeconds: Math.round(keys / (3.2 + rnd())), counts };
}

// tempo por app (segundos) nos últimos 7 dias, só com apps reais do apps.json
const SPLIT = { fivem: 5400, claude: 4200, chrome: 3600, discord: 2400, spotify: 1500, vlc: 600 };
const gameTime = { ...realConfig.gameTime };
for (let i = 7; i >= 1; i--) {
  const d = new Date(now); d.setDate(now.getDate() - i);
  gameTime[dayKey(d)] = Object.fromEntries(Object.entries(SPLIT).map(([id, s]) => [id, Math.round(s * (0.3 + rnd() * 1.1))]));
}

const ideas = [
  ["Notas da versão dentro do app", "doing"],
  ["Testes e CI no GitHub Actions", "idea"],
  ["APM e cliques por minuto nos jogos", "idea"],
  ["Modo foco com pomodoro", "idea"],
  ["Hub ao vivo no portfólio", "idea"],
  ["Overlay por cima do jogo", "done"],
].map(([text, status], i) => ({ id: `demo-${i}`, text, status, createdAt: new Date(now - i * 864e5).toISOString() }));

// o Klippe-T (som real do app) não decodifica no Chromium da captura; usa o outro Wooting 60HE da biblioteca
const config = { ...realConfig, keyboardSwitchId: "custom_wooting_60he_wooting_lekker_by_actavius_f98c841b", theme: LIGHT ? "light" : "dark", onboardingComplete: true, uiSounds: false, gameTime, ideas };
const focusOf = (id) => ({ ...realApps[id] });

// nome, aba, preparo
const SHOTS = [
  { name: "inicio", tab: "Início", prep: "type" },
  { name: "jogos", tab: "Jogos" },
  { name: "historico", tab: "Histórico" },
  { name: "teclado", tab: "Teclado" },
  { name: "ajustes", tab: "Ajustes" },
];
const TEXT = "o sorry toca o som de um teclado mecanico a cada tecla, conta o ritmo e acende o mapa de calor em tempo real. ";

// sem o gesto do usuário o Chromium headless não decodifica os sons e o app mostra erro de pacote
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "no-preference" });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.addInitScript(([c, h]) => {
  localStorage.setItem("sorry.config", c);
  localStorage.setItem("sorry.history", h);
}, [JSON.stringify(config), JSON.stringify({ version: 1, days: history })]);
await page.goto(BASE + "/");
await page.waitForSelector("nav button", { timeout: 15000 });
await page.evaluate(() => document.fonts.ready);
// apps reais em foco: o último fica na frente
for (const id of ["spotify", "chrome", "discord", "claude", "fivem"]) {
  await page.evaluate((info) => window.dispatchEvent(new CustomEvent("sorry:focus", { detail: info })), focusOf(id));
  await page.waitForTimeout(150);
}
// espera o Discord (Lanyard) responder
await page.waitForFunction(() => !document.body.innerText.includes("sem conexão"), null, { timeout: 15000 }).catch(() => console.warn("Lanyard sem resposta"));

const mask = () => page.evaluate(() => {
  for (const b of document.querySelectorAll("header b")) if (b.textContent === "prévia web") b.textContent = "desktop";
});

for (const s of SHOTS) {
  if (only.length && !only.includes(s.name)) continue;
  await page.locator("nav button", { hasText: s.tab }).first().click();
  await page.waitForTimeout(900);
  if (s.prep === "type") {
    await page.mouse.click(700, 160);
    await page.keyboard.type(TEXT + TEXT, { delay: 55 });
    await page.waitForTimeout(400);
  }
  // espera as animações de entrada (as em loop infinito nunca terminam)
  await page.evaluate(() => Promise.race([
    Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime !== Infinity).map((a) => a.finished.catch(() => {}))),
    new Promise((r) => setTimeout(r, 3000)),
  ]));
  // fecha os avisos (ex.: "Novo recorde") para não cobrir a tela
  for (const b of await page.locator('[role=alert] button[aria-label="Fechar"]').all()) await b.click().catch(() => {});
  await page.waitForTimeout(400);
  await mask();
  if (await page.getByText("não pôde ser carregado").count()) throw new Error(`erro de pacote em ${s.name}`);
  // validação: a aba certa está ativa e nada de onboarding por cima
  const active = await page.locator("nav button[aria-current], nav button.is-active, nav button[aria-selected=true]").first().innerText().catch(() => "");
  if (active && !active.includes(s.tab)) throw new Error(`aba errada em ${s.name}: ${active}`);
  if (await page.getByText("ABERTURA · 1 DE 4").count()) throw new Error("onboarding aberto");
  const file = path.join(OUT, `${s.name}${LIGHT ? "-claro" : ""}.jpg`);
  await page.screenshot({ path: file, type: "jpeg", quality: 88 });
  console.log("ok", path.basename(file));
}
if (errors.length) console.warn("erros na página:", errors);
await browser.close();
