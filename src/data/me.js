// Gostos do Keven, como ele mesmo listou. Estúdio, ano e gênero são fatos públicos de cada título;
// quando não há certeza (lançamento recente), o campo fica de fora. Sem capas oficiais: os cartões são
// desenhados pelo próprio site.

// `match` é comparado com o nome da atividade do Discord para acender o cartão "jogando agora"
export const GAMES = [
  { title: "Valorant", by: "Riot Games", year: 2020, genre: { pt: "FPS tático", en: "Tactical FPS" }, match: ["valorant"] },
  { title: "Minecraft", by: "Mojang", year: 2011, genre: { pt: "Sandbox", en: "Sandbox" }, match: ["minecraft"] },
  { title: "FiveM", by: "Cfx.re", genre: { pt: "Roleplay em GTA V", en: "GTA V roleplay" }, match: ["fivem", "grand theft auto"] },
  { title: "Forza Horizon", sub: "4 · 5 · 6", by: "Playground Games", genre: { pt: "Corrida em mundo aberto", en: "Open-world racing" }, match: ["forza horizon"] },
  { title: "Elden Ring", by: "FromSoftware", year: 2022, genre: { pt: "RPG de ação", en: "Action RPG" }, match: ["elden ring"] },
  { title: "Cyberpunk 2077", by: "CD Projekt Red", year: 2020, genre: { pt: "RPG em mundo aberto", en: "Open-world RPG" }, match: ["cyberpunk"] },
  { title: "Aion 2", by: "NCSOFT", genre: { pt: "MMORPG", en: "MMORPG" }, match: ["aion"] },
  { title: "New World", by: "Amazon Games", year: 2021, genre: { pt: "MMO", en: "MMO" }, match: ["new world"] },
];

export const NOLAN = [
  ["Amnésia", "Memento", 2000],
  ["Batman Begins", "Batman Begins", 2005],
  ["O Grande Truque", "The Prestige", 2006],
  ["O Cavaleiro das Trevas", "The Dark Knight", 2008],
  ["A Origem", "Inception", 2010],
  ["Interestelar", "Interstellar", 2014],
  ["Dunkirk", "Dunkirk", 2017],
  ["Tenet", "Tenet", 2020],
  ["Oppenheimer", "Oppenheimer", 2023],
];

export const SCREEN = {
  films: [
    { title: "Jumper", meta: "Doug Liman · 2008", tag: { pt: "Favorito", en: "Favorite" } },
    { title: "Christopher Nolan", meta: { pt: "todos os filmes", en: "every film" }, list: "nolan", wide: true },
    { title: "Marvel", meta: { pt: "todos os filmes", en: "every film" }, tag: { pt: "Universo", en: "Universe" } },
    { title: "DC", meta: { pt: "todos os filmes", en: "every film" }, tag: { pt: "Universo", en: "Universe" } },
  ],
  series: [
    { title: "Suits", meta: "USA Network · 2011–2019" },
    { title: { pt: "Território da Máfia", en: "Território da Máfia" }, meta: { pt: "série", en: "series" } },
    { title: "HBO", meta: { pt: "as séries novas", en: "the new series" }, tag: { pt: "Canal", en: "Network" } },
    { title: { pt: "Marvel & DC", en: "Marvel & DC" }, meta: { pt: "as séries também", en: "the series too" }, tag: { pt: "Universo", en: "Universe" } },
  ],
  genres: [
    { pt: "Ficção científica", en: "Science fiction" },
    { pt: "Viagens espaciais", en: "Space travel" },
  ],
};

// O que o Keven faz com IA, nas palavras dele: "criar projetos pessoais para agilizar meu dia a dia"
export const TOOLS = ["Claude", "Python", "VS Code", "Photoshop", "TypeScript", "React", "Node.js"];

// Artistas favoritos no Spotify, na grafia que o Keven usou
export const ARTISTS = ["Yunkvino", "Veigh", "Niink", "G.A", "LH Chucro", "AK Lipe", "Ghard"];
// compara ignorando espaços, pontos e caixa ("Yunk Vino" = "Yunkvino")
export const sameArtist = (a, b) => {
  const n = (s) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "");
  return n(a) === n(b);
};
