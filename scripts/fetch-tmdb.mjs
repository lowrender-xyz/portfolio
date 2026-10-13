// Monta src/data/screen.json com os títulos e os caminhos dos pôsteres do TMDB (themoviedb.org).
// A chave fica no .env (TMDB_API_KEY) e só este script a usa: o site recebe apenas os caminhos públicos
// das imagens, servidas pela CDN do TMDB. Uso: node scripts/fetch-tmdb.mjs
import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(".env", "utf8").split(/\r?\n/).filter((l) => l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const KEY = env.TMDB_API_KEY;
if (!KEY) throw new Error("TMDB_API_KEY ausente no .env");
const TODAY = new Date().toISOString().slice(0, 10);

async function tmdb(path, params = {}) {
  const q = new URLSearchParams({ api_key: KEY, language: "pt-BR", ...params });
  const r = await fetch(`https://api.themoviedb.org/3${path}?${q}`);
  if (!r.ok) throw new Error(`${path} → ${r.status}`);
  return r.json();
}

// título em PT e EN, ano, pôster e fundo
async function pack(kind, item) {
  const en = await tmdb(`/${kind}/${item.id}`, { language: "en-US" });
  const date = item.release_date || item.first_air_date || "";
  return {
    id: item.id,
    kind,
    pt: item.title || item.name,
    en: en.title || en.name,
    year: date.slice(0, 4),
    poster: item.poster_path || en.poster_path,
    backdrop: item.backdrop_path || en.backdrop_path,
    // usados só para filtrar (curtas, especiais, documentários), não vão para o site
    _runtime: en.runtime ?? null,
    _genres: (en.genres || []).map((g) => g.id),
  };
}

async function find(kind, query, year) {
  const params = { query, language: "en-US" };
  if (year) params[kind === "movie" ? "primary_release_year" : "first_air_date_year"] = year;
  const { results } = await tmdb(`/search/${kind}`, params);
  if (!results.length) throw new Error(`não achei: ${query}`);
  const pt = await tmdb(`/${kind}/${results[0].id}`);
  return pack(kind, { ...results[0], ...pt, title: pt.title, name: pt.name });
}

async function discover(kind, params, limit = 60) {
  const out = [];
  for (let page = 1; page <= 5 && out.length < limit; page++) {
    const d = await tmdb(`/discover/${kind}`, { page, "vote_count.gte": 80, ...params });
    out.push(...d.results);
    if (page >= d.total_pages) break;
  }
  const seen = new Set();
  return Promise.all(out.filter((x) => x.poster_path && !seen.has(x.id) && seen.add(x.id)).slice(0, limit).map((x) => pack(kind, x)));
}

// sem documentários (99); filmes só de longa-metragem (70 min ou mais)
const feature = (list) => list.filter((x) => !x._genres.includes(99) && (x.kind !== "movie" || (x._runtime ?? 0) >= 70));
const byDate = (list) => [...new Map(list.map((x) => [x.id, x])).values()].sort((a, b) => a.year.localeCompare(b.year));
const clean = (list) => list.map(({ _runtime, _genres, ...x }) => x);

const NOLAN = [["Memento", 2000], ["Batman Begins", 2005], ["The Prestige", 2006], ["The Dark Knight", 2008], ["Inception", 2010], ["Interstellar", 2014], ["Dunkirk", 2017], ["Tenet", 2020], ["Oppenheimer", 2023]];

const rows = {
  films: [
    { id: "favoritos", items: [await find("movie", "Jumper", 2008)] },
    { id: "nolan", items: await Promise.all(NOLAN.map(([t, y]) => find("movie", t, y))) },
    // Marvel: palavra-chave "marvel cinematic universe (mcu)" (180547). DC: estúdios DC Entertainment (9993),
    // DC Films (128064) e DC Studios (184898), sem animações. Só lançados, em ordem de estreia.
    { id: "marvel", items: feature(await discover("movie", { with_keywords: "180547", sort_by: "primary_release_date.asc", "primary_release_date.lte": TODAY }, 80)) },
    {
      id: "dc",
      items: feature(
        byDate([
          ...(await discover("movie", { with_companies: "9993|128064|184898", without_genres: "16", sort_by: "primary_release_date.asc", "primary_release_date.lte": TODAY }, 80)),
          ...(await discover("movie", { with_keywords: "229266|312528", sort_by: "primary_release_date.asc", "primary_release_date.lte": TODAY }, 40)),
        ]),
      ),
    },
  ],
  series: [
    { id: "favoritas", items: [await find("tv", "Suits", 2011), await find("tv", "MobLand")] },
    // HBO (rede 49): séries que estrearam de 2023 para cá, as mais populares
    { id: "hbo", items: await discover("tv", { with_networks: "49", "first_air_date.gte": "2023-01-01", sort_by: "popularity.desc", "first_air_date.lte": TODAY }, 16) },
    // séries do MCU (180547), do DCEU (229266) e do novo DCU (312528), das mais novas para as mais antigas
    { id: "herois", items: feature(await discover("tv", { with_keywords: "180547|229266|312528", "vote_count.gte": 30, sort_by: "first_air_date.desc", "first_air_date.lte": TODAY }, 24)) },
  ],
};

for (const list of Object.values(rows)) for (const r of list) r.items = clean(r.items);
fs.writeFileSync("src/data/screen.json", JSON.stringify({ updated: TODAY, rows }, null, 1));
for (const [k, list] of Object.entries(rows)) for (const r of list) console.log(k, r.id, r.items.length, "·", r.items.slice(0, 4).map((x) => `${x.pt} (${x.year})`).join(", "));
