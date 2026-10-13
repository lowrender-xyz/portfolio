// Gostos do Keven, como ele mesmo listou. Estúdio, ano e gênero são fatos públicos de cada título;
// quando não há certeza (lançamento recente), o campo fica de fora.
// `cover`: capa vertical oficial (2:3), carregada direto da CDN das lojas (nada é copiado para o site):
// biblioteca da Steam e pôster da Microsoft Store (Valorant e Minecraft). FiveM roda dentro do GTA V,
// então usa a capa do GTA V na Steam.

// `match` é comparado com o nome da atividade do Discord para acender o cartão "jogando agora"
export const GAMES = [
  { title: "Valorant", cover: "https://store-images.s-microsoft.com/image/apps.24285.13663857844271189.42ac3116-ce9d-40e2-939f-ca94e72c04a8.bc2c8a77-f251-47c2-908a-6b9d61b7f479?w=600", by: "Riot Games", year: 2020, genre: { pt: "FPS tático", en: "Tactical FPS" }, match: ["valorant"] },
  { title: "Minecraft", cover: "https://store-images.s-microsoft.com/image/apps.808.14492077886571533.be42f4bd-887b-4430-8ed0-622341b4d2b0.c8274c53-105e-478b-9f4b-41b8088210a3?w=600", by: "Mojang", year: 2011, genre: { pt: "Sandbox", en: "Sandbox" }, match: ["minecraft"] },
  { title: "FiveM", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg", by: "Cfx.re", genre: { pt: "Roleplay em GTA V", en: "GTA V roleplay" }, match: ["fivem", "grand theft auto"] },
  { title: "Forza Horizon", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2483190/711e39803402def82a90e1f31578c64744f952f3/library_capsule_2x.jpg", sub: "4 · 5 · 6", by: "Playground Games", genre: { pt: "Corrida em mundo aberto", en: "Open-world racing" }, match: ["forza horizon"] },
  { title: "Elden Ring", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900_2x.jpg", by: "FromSoftware", year: 2022, genre: { pt: "RPG de ação", en: "Action RPG" }, match: ["elden ring"] },
  { title: "Cyberpunk 2077", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg", by: "CD Projekt Red", year: 2020, genre: { pt: "RPG em mundo aberto", en: "Open-world RPG" }, match: ["cyberpunk"] },
  { title: "Aion 2", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3393110/145d58f9f8ffa48e6333b1dc3dd2ad7e9bf2b2b4/library_capsule_2x.jpg", by: "NCSOFT", genre: { pt: "MMORPG", en: "MMORPG" }, match: ["aion"] },
  { title: "New World", cover: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1063730/library_600x900_2x.jpg", by: "Amazon Games", year: 2021, genre: { pt: "MMO", en: "MMO" }, match: ["new world"] },
];

// Filmes e séries vêm do TMDB (src/data/screen.json, gerado por scripts/fetch-tmdb.mjs)
export const SCREEN = {
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
