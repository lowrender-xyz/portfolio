// Conteúdo do sorry hub tirado do README e de docs/plano-hub.md do repositório privado 77sorryz/sorry-mech
// (D:\Projetos\A MECH) e das telas capturadas (scripts/capture-sorryhub.mjs, dados de demonstração).
const shot = (name, pt, en) => ({
  src: `${import.meta.env.BASE_URL}projects/sorry-hub/${name}.jpg`,
  srcLight: `${import.meta.env.BASE_URL}projects/sorry-hub/${name}-claro.jpg`, // mesma tela no tema claro do app
  alt: { pt, en },
});

export const SHOTS = {
  inicio: shot("inicio", "Início do sorry hub: WPM ao vivo, sinal dos últimos 60 s, mapa de calor, Discord e ideias", "sorry hub home: live WPM, last 60 s signal, heatmap, Discord and ideas"),
  jogos: shot("jogos", "Sala de jogo: app em foco com o ícone do .exe, tempo jogado e teclas por jogo", "Game room: focused app with its .exe icon, play time and keys per game"),
  historico: shot("historico", "Diário: recordes, calendário do último ano e os últimos 30 dias", "Journal: records, last year calendar and the last 30 days"),
  teclado: shot("teclado", "Galeria com 54 pacotes de som de teclados reais", "Gallery with 54 sound packs from real keyboards"),
  ajustes: shot("ajustes", "Ajustes: assinatura sonora, overlay, descanso, Discord e backup", "Settings: sound signature, overlay, rest screen, Discord and backup"),
};

export const STATS = [
  { value: "54", label: { pt: "pacotes de som", en: "sound packs" } },
  { value: "8", label: { pt: "abas", en: "tabs" } },
  { value: "12", label: { pt: "versões publicadas", en: "published versions" } },
  { value: "0", label: { pt: "texto gravado", en: "text recorded" } },
];

export const MODULES = [
  {
    code: "HUB-01",
    tag: { pt: "Início", en: "Home" },
    title: { pt: "Hub do dia", en: "Daily hub" },
    line: { pt: "Cada tecla vira som e número.", en: "Every key becomes sound and data." },
    shots: ["inicio"],
    features: {
      pt: ["Som de teclado mecânico em tempo real, no Windows inteiro", "WPM ao vivo, sinal dos últimos 60 s e mapa de calor", "Blocos que você liga, desliga e reordena", "Ctrl+K para comandos e Ctrl+Alt+Espaço para anotar uma ideia"],
      en: ["Mechanical keyboard sound in real time, across Windows", "Live WPM, last 60 s signal and heatmap", "Blocks you toggle and reorder", "Ctrl+K for commands and Ctrl+Alt+Space to jot an idea"],
    },
  },
  {
    code: "HUB-02",
    tag: { pt: "Jogos", en: "Games" },
    title: { pt: "Sala de jogo", en: "Game room" },
    line: { pt: "Sabe o que está na frente.", en: "Knows what's in front." },
    shots: ["jogos"],
    features: {
      pt: ["App em foco com o ícone do próprio .exe", "Jogo reconhecido pela pasta, corrigível", "Tempo hoje, em 7 dias e no total", "Perfis automáticos: app em foco → som, volume, mudo"],
      en: ["Focused app with its own .exe icon", "Games recognized by folder, correctable", "Time today, in 7 days and overall", "Auto profiles: focused app → sound, volume, mute"],
    },
  },
  {
    code: "HUB-03",
    tag: { pt: "Histórico", en: "History" },
    title: { pt: "Diário", en: "Journal" },
    line: { pt: "Só contagens. Nunca texto.", en: "Only counts. Never text." },
    shots: ["historico"],
    features: {
      pt: ["Teclas, cliques, pico de WPM e tempo digitando por dia", "Calendário de um ano: teclas, digitando ou jogando", "Recordes, melhor dia e sequência", "Tudo no PC, com botão para apagar"],
      en: ["Keys, clicks, peak WPM and typing time per day", "One-year calendar: keys, typing or playing", "Records, best day and streak", "All on the PC, with a delete button"],
    },
  },
  {
    code: "HUB-04",
    tag: { pt: "Teclado", en: "Keyboard" },
    title: { pt: "Galeria de sons", en: "Sound gallery" },
    line: { pt: "54 teclados para escolher.", en: "54 keyboards to choose from." },
    shots: ["teclado"],
    features: {
      pt: ["54 pacotes de som de teclados reais", "Favoritos, recentes e coleções", "Comparação lado a lado", "Importação de pastas de som"],
      en: ["54 sound packs from real keyboards", "Favorites, recents and collections", "Side-by-side comparison", "Sound folder import"],
    },
  },
  {
    code: "HUB-05",
    tag: { pt: "Ajustes", en: "Settings" },
    title: { pt: "Sala de controle", en: "Control room" },
    line: { pt: "Overlay, Discord e atualização sozinha.", en: "Overlay, Discord and self-updating." },
    shots: ["ajustes"],
    features: {
      pt: ["Overlay por cima do jogo, sem roubar cliques", "Rich Presence no Discord", "Atualização automática pelos GitHub Releases", "Tema claro, tela de descanso e backup"],
      en: ["Overlay on top of the game, click-through", "Discord Rich Presence", "Automatic updates via GitHub Releases", "Light theme, rest screen and backup"],
    },
  },
];
