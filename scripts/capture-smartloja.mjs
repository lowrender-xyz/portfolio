// Captura telas REAIS do Smart Loja (clone isolado, dados de demonstração) para o portfólio.
// Uso: node scripts/capture-smartloja.mjs <clone>/frontend [nome...]
// Requer: API do clone em :3344 e Vite do clone em :5180 (nunca as portas padrão 5173/3333).
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

const frontend = path.resolve(process.argv[2]);
const only = process.argv.slice(3);
const require = createRequire(path.join(frontend, "package.json"));
const { chromium } = require("@playwright/test");

const BASE = "http://localhost:5180";
if (!/:5180$/.test(BASE)) throw new Error("recuso capturar fora da porta do clone");
const OUT = path.resolve("public/projects/smart-loja");
fs.mkdirSync(OUT, { recursive: true });

// nome, rota, seletor que prova que a tela certa abriu, preparo opcional
export const SHOTS = [
  { name: "dashboard", route: "/", expect: "main" },
  { name: "pdv", route: "/pdv", expect: "main", prep: "pdv" },
  { name: "produtos", route: "/produtos", expect: "main" },
  { name: "estoque", route: "/estoque", expect: "main" },
  { name: "vendas", route: "/vendas", expect: "main" },
  { name: "caixas", route: "/caixas", expect: "main" },
  { name: "relatorios", route: "/relatorios", expect: "main" },
  { name: "financeiro", route: "/financeiro", expect: "main" },
];

const browser = await chromium.launch();
const ctxOpts = {
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  reducedMotion: "no-preference",
  locale: "pt-BR",
  timezoneId: "America/Sao_Paulo",
};

// Um login por execução, no mesmo contexto da captura: o produto gira o token de renovação a cada uso
// (uma sessão salva fica velha) e limita tentativas de login por minuto.
async function login(page) {
  await page.goto(`${BASE}/login`);
  await page.fill("#email", "admin@smartloja.com");
  await page.fill("#senha", "admin123");
  await page.click('button[type="submit"]');
  await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 20000 });
  if (new URL(page.url()).pathname.startsWith("/selecionar-loja")) {
    await page.getByRole("button", { name: /Smart Loja Matriz/ }).first().click();
    await page.waitForURL((u) => !u.pathname.startsWith("/selecionar-loja"), { timeout: 20000 });
  }
}

async function settle(page) {
  await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
  await page.evaluate(async () => {
    await document.fonts.ready;
    // só animações finitas (as infinitas, como pulsos de status, nunca terminam)
    const finitas = document.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime !== Infinity);
    await Promise.race([Promise.all(finitas.map((a) => a.finished.catch(() => {}))), new Promise((ok) => setTimeout(ok, 3000))]);
  });
  await page.waitForTimeout(400);
}

const PREP = {
  async pdv(page) {
    // códigos internos do gerador: capa silicone, película de vidro, carregador 20W
    for (const codigo of ["AC-009", "AC-007", "AC-001"]) {
      const campo = page.locator("#pdv-busca-produto");
      if (!(await campo.count())) await page.keyboard.press("F2");
      await campo.waitFor({ timeout: 5000 });
      await campo.fill(codigo);
      await campo.press("Enter");
      await page.waitForTimeout(700);
    }
    if (await page.locator("#pdv-busca-produto").count()) await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  },
};

const ctx = await browser.newContext(ctxOpts);
// tema escuro do próprio produto (o mesmo que o usuário liga no app)
await ctx.addInitScript(() => localStorage.setItem("smartloja-tema", "escuro"));
const page = await ctx.newPage();
await login(page);
const report = [];
for (const shot of SHOTS.filter((s) => !only.length || only.includes(s.name))) {
  await page.goto(BASE + shot.route);
  await settle(page);
  const url = new URL(page.url());
  if (url.pathname !== shot.route) throw new Error(`${shot.name}: abriu ${url.pathname} em vez de ${shot.route} (sessão perdida?)`);
  if (await page.locator("#senha").count()) throw new Error(`${shot.name}: tela de login no lugar da tela`);
  await page.locator(shot.expect).first().waitFor({ timeout: 10000 });
  if (shot.prep && !process.env.SEM_PREPARO) {
    await PREP[shot.prep](page);
    await settle(page);
  }
  const file = path.join(OUT, `${shot.name}.jpg`);
  await page.screenshot({ path: file, type: "jpeg", quality: 88 });
  report.push(`${shot.name}: ${url.pathname} → ${path.relative(process.cwd(), file)} (${await page.title()})`);
}
console.log(report.join("\n"));
await browser.close();
