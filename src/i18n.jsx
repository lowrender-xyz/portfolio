import { createContext, useContext, useEffect, useState } from "react";

const dict = {
  pt: {
    enter: "Entrar",
    role: "dev, design & motion",
    takes: ["Código", "Design", "Motion", "Produto"],
    nav: { home: "Início", projects: "Projetos", skills: "Skills" },
    landingNav: [
      ["#jogos", "Jogos"],
      ["#tela", "Filmes e séries"],
      ["#musica", "Música"],
      ["#projetos", "Projetos"],
      ["#sobre", "Sobre"],
    ],
    talk: "Falar comigo",
    landing: {
      marqueeAi: "Projetos com IA",
      hero: {
        kicker: "Keven · dev, design & motion",
        title: ["Oi, eu sou o\n", { em: "sorry." }],
        lead: "Me chamo Keven. Programo, desenho e animo. Entre uma partida de Valorant e um filme do Nolan, crio ferramentas com IA para deixar o meu dia mais rápido.",
        cta: "O que eu curto",
        cta2: "Meus projetos",
        fig: "AO VIVO",
        idle: "NENHUM JOGO ABERTO",
        scroll: "ROLE",
      },
      games: {
        kicker: "Jogos",
        title: ["O que eu\n", { em: "jogo." }],
        lead: "Do tático ao mundo aberto. Quando eu abro um desses, o cartão acende sozinho: o site lê o meu Discord ao vivo.",
        now: "jogando agora",
      },
      screen: {
        kicker: "Filmes e séries",
        title: ["O que eu\n", { em: "assisto." }],
        lead: "Herói, máfia, tribunal e espaço. Ficção científica e viagem espacial sempre ganham.",
        tabs: { films: "Filmes", series: "Séries" },
        note: "A lista cresce: sempre aparece um filme novo para entrar aqui.",
      },
      music: {
        kicker: "Música",
        title: ["O que eu\n", { em: "ouço." }],
        lead: "Os artistas que mais tocam no meu Spotify. Se um deles estiver tocando agora, ele acende.",
        now: "tocando",
        nowKicker: "Tocando agora no meu Spotify",
        idle: "Nada tocando agora. Volte daqui a pouco.",
      },
      lab: {
        kicker: "IA e projetos",
        title: ["Eu automatizo\no ", { em: "meu dia." }],
        lead: "Curto mexer com IA e criar projetos pessoais que resolvem coisas reais do dia a dia. O maior deles virou um sistema completo.",
        projectKicker: "Projeto em destaque",
        projectLine: "ERP multiloja para varejo: frente de caixa, nota fiscal, estoque, financeiro e relatórios. Feito do banco de dados ao app instalável.",
        explore: "Explorar os módulos",
        screen: "visão geral",
        demo: "TELA REAL · DADOS DE DEMONSTRAÇÃO",
      },
      about: {
        kicker: "Quem eu sou",
        title: ["Três ofícios,\num ", { em: "cuidado." }],
        lead: "Funcionar bem e parecer certo. Este site é a prova: o código, o design e o reel da abertura são meus.",
        crafts: [
          { name: "Dev", text: "Sistemas completos em TypeScript, React, Node e PostgreSQL, além de Python, com a IA como parceira de código." },
          { name: "Design", text: "Interfaces e peças em Photoshop com hierarquia clara: cada elemento no lugar por um motivo." },
          { name: "Motion", text: "Movimento escrito em código, com física de mola e ritmo de corte, como o reel que abre este site." },
        ],
      },
      catalog: {
        kicker: "Módulos do Smart7",
        aria: "Módulos do Smart7. Use as setas para girar e Enter para abrir.",
        screens: "TELAS",
        open: "Abrir módulo",
        prev: "Módulo anterior",
        next: "Próximo módulo",
        hint: "ARRASTE O ANEL · ← → NO TECLADO · ENTER ABRE",
        close: "Fechar",
        enlarge: "Ampliar",
        demo: "Telas reais do Smart7 rodando num ambiente local com dados de demonstração fictícios.",
      },
      contact: {
        kicker: "Contato",
        title: ["Bora trocar\n", { em: "uma ideia?" }],
      },
    },
    heroKicker: "Keven · dev, design & motion",
    heroLine: "Construo sistemas que rodam negócio de verdade e cuido de como eles parecem e se movem.",
    seeProjects: "Ver projetos",
    tools: "Ferramentas",
    featured: "Em destaque",
    moreProjects: "Outros projetos",
    allProjects: "Todos os projetos",
    openProject: "Abrir projeto",
    privateCode: "Código privado",
    viewCode: "Ver código",
    soon: "Em breve",
    back: "Voltar aos projetos",
    stack: "Stack",
    whatItDoes: "O que faz",
    projectsTitle: "Projetos",
    projectsLead: "Um sistema que roda loja de verdade, do caixa à nota fiscal.",
    skillsTitle: "O que eu faço",
    skillsLead: "Três ofícios, um mesmo cuidado: funcionar bem e parecer certo.",
    kinds: { dev: "Dev", design: "Design", motion: "Motion" },
    discord: {
      online: "Online",
      idle: "Ausente",
      dnd: "Não perturbe",
      offline: "Offline",
      loading: "Conectando…",
      playing: "Jogando",
      listening: "Ouvindo no Spotify",
      watching: "Assistindo",
      streaming: "Em live",
      noActivity: "Sem atividade agora",
      live: "Ao vivo",
      for: "há",
      by: "de",
      profile: "Ver perfil",
    },
    footer: "Feito em código, quadro a quadro.",
    notFound: "Essa cena não existe.",
  },
  en: {
    enter: "Enter",
    role: "dev, design & motion",
    takes: ["Code", "Design", "Motion", "Product"],
    nav: { home: "Home", projects: "Projects", skills: "Skills" },
    landingNav: [
      ["#jogos", "Games"],
      ["#tela", "Movies & series"],
      ["#musica", "Music"],
      ["#projetos", "Projects"],
      ["#sobre", "About"],
    ],
    talk: "Talk to me",
    landing: {
      marqueeAi: "AI projects",
      hero: {
        kicker: "Keven · dev, design & motion",
        title: ["Hi, I'm\n", { em: "sorry." }],
        lead: "My name is Keven. I code, design and animate. Between a Valorant match and a Nolan film, I build AI tools that make my day faster.",
        cta: "What I'm into",
        cta2: "My projects",
        fig: "LIVE",
        idle: "NO GAME RUNNING",
        scroll: "SCROLL",
      },
      games: {
        kicker: "Games",
        title: ["What I\n", { em: "play." }],
        lead: "From tactical to open world. When I launch one of these, its card lights up on its own: the site reads my Discord live.",
        now: "playing now",
      },
      screen: {
        kicker: "Movies & series",
        title: ["What I\n", { em: "watch." }],
        lead: "Heroes, mafia, courtrooms and space. Science fiction and space travel always win.",
        tabs: { films: "Movies", series: "Series" },
        note: "The list keeps growing: there's always a new film to add here.",
      },
      music: {
        kicker: "Music",
        title: ["What I\n", { em: "listen to." }],
        lead: "The artists that play the most on my Spotify. If one of them is playing right now, it lights up.",
        now: "playing",
        nowKicker: "Playing now on my Spotify",
        idle: "Nothing playing right now. Check back soon.",
      },
      lab: {
        kicker: "AI & projects",
        title: ["I automate\n", { em: "my day." }],
        lead: "I love tinkering with AI and building personal projects that solve real everyday things. The biggest one became a full system.",
        projectKicker: "Featured project",
        projectLine: "Multi-store retail ERP: point of sale, tax invoicing, stock, finance and reports. Built from the database to the installable app.",
        explore: "Explore the modules",
        screen: "overview",
        demo: "REAL SCREEN · DEMO DATA",
      },
      about: {
        kicker: "Who I am",
        title: ["Three crafts,\none ", { em: "standard." }],
        lead: "Work well and look right. This site is the proof: the code, the design and the opening reel are mine.",
        crafts: [
          { name: "Dev", text: "Complete systems in TypeScript, React, Node and PostgreSQL, plus Python, with AI as a coding partner." },
          { name: "Design", text: "Interfaces and Photoshop pieces with a clear hierarchy: every element placed for a reason." },
          { name: "Motion", text: "Motion written in code, with spring physics and cut rhythm, like the reel that opens this site." },
        ],
      },
      catalog: {
        kicker: "Smart7 modules",
        aria: "Smart7 modules. Use the arrows to rotate and Enter to open.",
        screens: "SCREENS",
        open: "Open module",
        prev: "Previous module",
        next: "Next module",
        hint: "DRAG THE RING · ← → ON KEYBOARD · ENTER OPENS",
        close: "Close",
        enlarge: "Enlarge",
        demo: "Real Smart7 screens running locally with fictional demo data.",
      },
      contact: {
        kicker: "Contact",
        title: ["Let's swap\n", { em: "ideas?" }],
      },
    },
    heroKicker: "Keven · dev, design & motion",
    heroLine: "I build systems that run real businesses, and I care about how they look and move.",
    seeProjects: "See projects",
    tools: "Tools",
    featured: "Featured",
    moreProjects: "More projects",
    allProjects: "All projects",
    openProject: "Open project",
    privateCode: "Private code",
    viewCode: "View code",
    soon: "Coming soon",
    back: "Back to projects",
    stack: "Stack",
    whatItDoes: "What it does",
    projectsTitle: "Projects",
    projectsLead: "A system that runs real stores, from the register to the tax invoice.",
    skillsTitle: "What I do",
    skillsLead: "Three crafts, one standard: work well and look right.",
    kinds: { dev: "Dev", design: "Design", motion: "Motion" },
    discord: {
      online: "Online",
      idle: "Idle",
      dnd: "Do not disturb",
      offline: "Offline",
      loading: "Connecting…",
      playing: "Playing",
      listening: "Listening on Spotify",
      watching: "Watching",
      streaming: "Streaming",
      noActivity: "Nothing going on right now",
      live: "Live",
      for: "for",
      by: "by",
      profile: "View profile",
    },
    footer: "Made in code, frame by frame.",
    notFound: "This scene doesn't exist.",
  },
};

const Ctx = createContext(null);

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "pt" || saved === "en") return saved;
    } catch (e) {}
    return navigator.language?.startsWith("pt") ? "pt" : "en";
  });
  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    try {
      localStorage.setItem("lang", lang);
    } catch (e) {}
  }, [lang]);
  // pick(): escolhe a versão do idioma quando o valor é {pt, en}
  const pick = (v) => (v && typeof v === "object" && "pt" in v ? v[lang] : v);
  return <Ctx.Provider value={{ lang, setLang, t: dict[lang], pick }}>{children}</Ctx.Provider>;
}

export const useLocale = () => useContext(Ctx);
