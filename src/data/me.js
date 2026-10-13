// Gostos do Keven, como ele mesmo listou. Estúdio, ano e gênero são fatos públicos de cada título;
// quando não há certeza (lançamento recente), o campo fica de fora.
// `art`: arte oficial da Steam (library_hero, sem logo; o cabeçalho quando não existe), carregada direto da
// CDN da Steam (nada é copiado para o site).
// Jogos fora da Steam ficam com o cartão tipográfico até termos uma fonte licenciada (RAWG).

// `match` é comparado com o nome da atividade do Discord para acender o cartão "jogando agora"
export const GAMES = [
  { title: "Valorant", by: "Riot Games", year: 2020, genre: { pt: "FPS tático", en: "Tactical FPS" }, match: ["valorant"] },
  { title: "Minecraft", by: "Mojang", year: 2011, genre: { pt: "Sandbox", en: "Sandbox" }, match: ["minecraft"] },
  { title: "FiveM", by: "Cfx.re", genre: { pt: "Roleplay em GTA V", en: "GTA V roleplay" }, match: ["fivem", "grand theft auto"] },
  { title: "Forza Horizon", art: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2483190/library_hero.jpg", sub: "4 · 5 · 6", by: "Playground Games", genre: { pt: "Corrida em mundo aberto", en: "Open-world racing" }, match: ["forza horizon"] },
  { title: "Elden Ring", art: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_hero.jpg", by: "FromSoftware", year: 2022, genre: { pt: "RPG de ação", en: "Action RPG" }, match: ["elden ring"] },
  { title: "Cyberpunk 2077", art: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_hero.jpg", by: "CD Projekt Red", year: 2020, genre: { pt: "RPG em mundo aberto", en: "Open-world RPG" }, match: ["cyberpunk"] },
  { title: "Aion 2", art: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3393110/10aa4b096ebe6af0d1dd7882e5ba004271aef6f7/header.jpg", by: "NCSOFT", genre: { pt: "MMORPG", en: "MMORPG" }, match: ["aion"] },
  { title: "New World", art: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1063730/library_hero.jpg", by: "Amazon Games", year: 2021, genre: { pt: "MMO", en: "MMO" }, match: ["new world"] },
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
