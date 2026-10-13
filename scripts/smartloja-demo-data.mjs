// Dados de demonstração para filmar/capturar o Smart Loja, SÓ num clone local com banco próprio.
// Uso (dentro de <clone>/backend, com a API rodando em :3344 e DB_FILENAME=./data/portfolio-demo.sqlite):
//   node <este arquivo> <clone>/backend
// Cria categorias, produtos de uma loja de acessórios para celular, clientes fictícios e 14 dias de caixa
// com vendas feitas pela API real (totais, estoque e auditoria calculados pelo próprio sistema).
// Depois põe cada venda num horário comercial do seu dia, para o dashboard ter histórico.
import { createRequire } from "node:module";
import path from "node:path";
import crypto from "node:crypto";

const backend = path.resolve(process.argv[2] || ".");
const require = createRequire(path.join(backend, "package.json"));
const knex = require("knex");

const API = "http://localhost:3344/api";
const DB = path.join(backend, "data", "portfolio-demo.sqlite");
if (!DB.endsWith("portfolio-demo.sqlite")) throw new Error("banco inesperado");
const db = knex({ client: "sqlite3", connection: { filename: DB }, useNullAsDefault: true });

// mulberry32: tudo reproduzível
let seed = 7;
const rnd = () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (a) => a[Math.floor(rnd() * a.length)];
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));

const CATEGORIAS = ["Carregadores", "Cabos", "Películas", "Capas", "Áudio", "Acessórios"];
// [categoria, descrição, custo, venda, ncm, estoque, mínimo]
const PRODUTOS = [
  ["Carregadores", "Carregador turbo USB-C 20W", 22.9, 59.9, "85044010", 34, 8],
  ["Carregadores", "Carregador veicular duplo USB 3.1A", 14.5, 39.9, "85044010", 18, 5],
  ["Carregadores", "Power bank 10.000 mAh", 48, 119.9, "85076000", 12, 4],
  ["Cabos", "Cabo USB-C para USB-C 1 m", 8.4, 29.9, "85444200", 52, 10],
  ["Cabos", "Cabo Lightning reforçado 1 m", 9.9, 34.9, "85444200", 40, 10],
  ["Cabos", "Adaptador USB-C para P2", 6.2, 24.9, "85366990", 3, 6],
  ["Películas", "Película de vidro 3D", 3.1, 29.9, "39199090", 120, 20],
  ["Películas", "Película hidrogel fosca", 4.8, 39.9, "39199090", 64, 15],
  ["Capas", "Capa silicone aveludada", 7.5, 39.9, "42029200", 86, 15],
  ["Capas", "Capa anti-impacto transparente", 6.9, 34.9, "42029200", 72, 15],
  ["Capas", "Capa carteira com porta-cartão", 12.4, 49.9, "42029200", 4, 6],
  ["Áudio", "Fone Bluetooth TWS com estojo", 38, 99.9, "85183000", 26, 6],
  ["Áudio", "Fone com fio P2 e microfone", 7.9, 24.9, "85183000", 30, 8],
  ["Áudio", "Caixa de som Bluetooth 10W", 54, 139.9, "85182200", 9, 3],
  ["Acessórios", "Suporte veicular magnético", 11.2, 44.9, "39269090", 22, 5],
  ["Acessórios", "Smartwatch esportivo", 89, 219.9, "85176299", 7, 3],
  ["Acessórios", "Cartão de memória 64 GB", 19.5, 54.9, "85235190", 28, 6],
  ["Acessórios", "Anel de LED para selfie", 15, 49.9, "94054090", 11, 4],
];
const CLIENTES = [
  "Mariana Souza", "Rafael Lima", "Juliana Ferreira", "Bruno Carvalho", "Camila Rocha",
  "Diego Martins", "Larissa Gomes", "Thiago Alves", "Beatriz Ribeiro", "Lucas Pereira",
];

function cpf() {
  const n = Array.from({ length: 9 }, () => int(0, 9));
  for (const len of [9, 10]) {
    let s = 0;
    for (let i = 0; i < len; i++) s += n[i] * (len + 1 - i);
    const d = (s * 10) % 11;
    n.push(d === 10 ? 0 : d);
  }
  return n.join("");
}

async function api(method, url, body, token) {
  // respeita o limite da API (100 req/min): ritmo de ~1,4 req/s e, se mesmo assim bater no 429, espera
  await new Promise((ok) => setTimeout(ok, 700));
  const r = await fetch(API + url, {
    method,
    headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (r.status === 429) {
    await new Promise((ok) => setTimeout(ok, 61000));
    return api(method, url, body, token);
  }
  if (!r.ok) throw new Error(`${method} ${url} → ${r.status} ${JSON.stringify(j).slice(0, 300)}`);
  return j;
}

// leva um timestamp para o instante absoluto `ms`, mantendo o formato original
function at(v, ms) {
  if (v == null) return v;
  if (typeof v === "number") return ms;
  const out = new Date(ms).toISOString();
  return /T/.test(v) ? out : out.replace("T", " ").slice(0, 19);
}
async function setRows(table, where, cols, ms) {
  const have = (await db.raw(`pragma table_info(${table})`)).map((c) => c.name);
  const use = cols.filter((c) => have.includes(c));
  if (!use.length) return;
  for (const row of await where(db(table)).select("id", ...use)) {
    const upd = {};
    for (const c of use) upd[c] = at(row[c], ms);
    await db(table).where({ id: row.id }).update(upd);
  }
}
// horário de Brasília (UTC−3) do dia d dias atrás
const NOW = Date.now();
function brt(d, h, m) {
  const local = new Date(NOW - 3 * 3600000);
  return Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() - d, h + 3, m);
}

const loja = await db("empresas").first("id");
if ((await db("produtos").where({ loja_id: loja.id }).count({ n: "*" }))[0].n > 0) {
  console.log("Banco já tem produtos; nada a fazer.");
  process.exit(0);
}
const deposito = await db("depositos").where({ loja_id: loja.id, padrao: true }).first("id");

const catIds = {};
for (const nome of CATEGORIAS) {
  catIds[nome] = crypto.randomUUID();
  await db("categorias").insert({ id: catIds[nome], loja_id: loja.id, nome, ativo: true });
}
const produtos = [];
for (const [i, [cat, descricao, custo, venda, ncm, estoque, minimo]] of PRODUTOS.entries()) {
  const codigo = `AC-${String(i + 1).padStart(3, "0")}`;
  const barras = `789${String(1000000000 + i * 7919).slice(0, 10)}`;
  const gid = crypto.randomUUID(), id = crypto.randomUUID();
  const base = { codigo_interno: codigo, codigo_barras: barras, descricao, unidade: "UN", preco_custo: custo, preco_venda: venda, ncm, garantia_meses: 3, ativo: true };
  await db("produtos_globais").insert({ id: gid, ...base, categoria_id: catIds[cat] });
  await db("produtos").insert({
    id, loja_id: loja.id, produto_global_id: gid, categoria_id: catIds[cat], ...base,
    estoque_atual: estoque, estoque_minimo: minimo, controla_estoque: true, icms_origem: "0", icms_csosn: "102", cfop_padrao: "5102",
  });
  await db("estoques_depositos").insert({ id: crypto.randomUUID(), loja_id: loja.id, deposito_id: deposito.id, produto_id: id, quantidade: estoque, estoque_minimo: minimo });
  produtos.push({ id, venda, saldo: estoque, peso: cat === "Películas" || cat === "Capas" ? 3 : cat === "Cabos" ? 2 : 1 });
}
const clientes = [];
for (const nome of CLIENTES) {
  const id = crypto.randomUUID();
  const user = nome.toLowerCase().normalize("NFD").replace(/[^a-z ]/g, "").replace(" ", ".");
  await db("clientes").insert({ id, loja_id: loja.id, tipo: "fisica", nome, documento: cpf(), email: `${user}@exemplo.com`, telefone: `1198${int(1000000, 9999999)}`, limite_credito: 0, ativo: true });
  clientes.push(id);
}
const pesados = produtos.flatMap((p) => Array(p.peso).fill(p));

// um único login por execução (o produto limita tentativas por minuto)
const login = await api("POST", "/auth/login", { email: "admin@smartloja.com", senha: "admin123" });
let token = login.data?.accessToken ?? login.accessToken ?? login.data?.access_token ?? login.access_token;
const sel = await api("POST", "/auth/selecionar-loja", { loja_id: loja.id }, token);
token = sel.data?.accessToken ?? sel.accessToken ?? sel.data?.access_token ?? sel.access_token ?? token;

let vendasCriadas = 0;
for (let d = 13; d >= 0; d--) {
  const caixa = (await api("POST", "/caixas", { valor_abertura: 150 }, token)).data;
  const vendasDoDia = [];
  const totais = { dinheiro: 150 };
  // a loja cresce ao longo das duas semanas (a semana atual vende mais que a anterior)
  const n = 3 + Math.round((13 - d) * 0.4) + int(0, 2);
  for (let k = 0; k < n; k++) {
    const items = [];
    for (let m = 0, q = int(1, 3) + (d < 7 && rnd() < 0.35 ? 1 : 0); m < q; m++) {
      const p = pick(pesados);
      const quantidade = rnd() < 0.15 ? 2 : 1;
      if (p.saldo < quantidade || items.find((it) => it.produto_id === p.id)) continue;
      p.saldo -= quantidade;
      items.push({ produto_id: p.id, quantidade, preco: p.venda });
    }
    if (!items.length) continue;
    const total = Math.round(items.reduce((s, it) => s + it.preco * it.quantidade, 0) * 100) / 100;
    const r = rnd();
    const forma = r < 0.42 ? "pix" : r < 0.72 ? "cartao_credito" : r < 0.86 ? "cartao_debito" : "dinheiro";
    const pago = forma === "dinheiro" ? Math.ceil(total / 10) * 10 + (rnd() < 0.5 ? 0 : 10) : total;
    const pagamento = { forma_pagamento: forma, valor: pago, ...(forma === "cartao_credito" && total > 90 ? { parcelas: int(1, 3) } : {}) };
    await api("POST", "/vendas", {
      caixa_id: caixa.id,
      cliente_id: rnd() < 0.55 ? pick(clientes) : null,
      items: items.map(({ produto_id, quantidade }) => ({ produto_id, quantidade })),
      pagamentos: [pagamento],
    }, token);
    totais[forma] = Math.round(((totais[forma] || 0) + total) * 100) / 100;
    vendasCriadas++;
  }
  if (d > 0) {
    await api("POST", `/caixas/${caixa.id}/fechar`, {
      conferencias: Object.entries(totais).map(([forma_pagamento, valor_informado]) => ({ forma_pagamento, valor_informado })),
    }, token);
  }
  // as vendas do dia vêm do próprio banco (pelo caixa), na ordem do número da venda
  vendasDoDia.length = 0;
  vendasDoDia.push(...(await db("vendas").where({ caixa_id: caixa.id }).orderBy("numero_venda").pluck("id")));
  // espalha as vendas no horário comercial (hoje, só até alguns minutos atrás)
  const ultimoMin = d === 0 ? Math.max(9 * 60 + 30, Math.floor((NOW - brt(0, 0, 0)) / 60000) - 15) : 19 * 60;
  const horarios = vendasDoDia.map(() => int(9 * 60 + 10, ultimoMin)).sort((x, y) => x - y);
  // nada de duas vendas no mesmo minuto: pelo menos 2 min entre uma e outra, sem passar do último horário
  for (let k = 1; k < horarios.length; k++) horarios[k] = Math.max(horarios[k], horarios[k - 1] + 2);
  for (let k = horarios.length - 1, lim = ultimoMin; k >= 0; k--, lim -= 2) horarios[k] = Math.min(horarios[k], lim);
  for (const [k, id] of vendasDoDia.entries()) {
    const ms = brt(d, 0, horarios[k]);
    await setRows("vendas", (q) => q.where({ id }), ["criado_em", "finalizada_em"], ms);
    for (const t of ["venda_pagamentos", "venda_itens"]) await setRows(t, (q) => q.where({ venda_id: id }), ["criado_em"], ms).catch(() => {});
    await setRows("movimentacoes_estoque", (q) => q.where({ referencia_id: id }), ["criado_em"], ms).catch(() => {});
  }
  await setRows("caixas", (q) => q.where({ id: caixa.id }), ["data_abertura", "criado_em"], brt(d, 8, 45));
  if (d > 0) await setRows("caixas", (q) => q.where({ id: caixa.id }), ["data_fechamento", "atualizado_em"], brt(d, 19, 15));
  await setRows("caixa_movimentacoes", (q) => q.where({ caixa_id: caixa.id }), ["criado_em"], brt(d, 8, 45)).catch(() => {});
}
console.log(`OK: ${PRODUTOS.length} produtos, ${CLIENTES.length} clientes, ${vendasCriadas} vendas em 14 dias (caixa de hoje aberto).`);
await db.destroy();
