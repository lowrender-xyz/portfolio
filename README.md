# sorry · portfólio do Keven

Site pessoal: dev, design & motion. Vite + React, publicado no Netlify.

## Rodar

```bash
npm install
npm run dev        # http://127.0.0.1:4300
npm run build      # gera dist/
npm run preview    # http://127.0.0.1:4301 (versão de produção)
```

## Onde editar

| Parte | Arquivo |
|---|---|
| Nome, Discord, redes | `src/data/site.js` |
| Jogos, filmes, séries, artistas, ferramentas | `src/data/me.js` |
| Smart7: números, telas e módulos do catálogo | `src/data/smart7.js` |
| Textos da landing e da interface PT/EN | `src/i18n.jsx` |
| Landing (seções) | `src/pages/Landing.jsx` |
| Módulos do Smart7 (abas com temporizador + tela real) | `src/components/ModuleExplorer.jsx` |
| Meio-tom do hero | `src/components/Halftone.jsx` |
| Reel da abertura (canvas) | `src/lib/reel.js` · `src/components/Opening.jsx` |
| Cartão do Discord ao vivo | `src/components/DiscordCard.jsx` · `src/lib/lanyard.js` |
| Rolagem de filme (efeitos amarrados ao scroll) | `src/lib/film.js` (lista `FX`) |
| Moldura de interface (trilho, mira, progresso) | `src/components/Hud.jsx` |
| Linha de terminal ao vivo · tela de carregamento | `src/components/Ticker.jsx` · `src/components/Loader.jsx` |
| Cores, fontes, layout | `src/styles.css` (tokens no topo) |
| Direção de arte e estrutura | `docs/style_guide.md` · `docs/estrutura.md` |

## Telas do Smart7

As prints em `public/projects/smart-loja/` são telas reais do Smart7 rodando num **clone local isolado**, com banco
próprio (`portfolio-demo.sqlite`) e dados fictícios. O banco real do projeto nunca é usado.

```bash
git clone "D:/Projeto Smart Loja/Projeto Smart Loja" <pasta>/smartloja   # e npm ci em backend/ e frontend/
bash scripts/smartloja-demo-reset.sh <pasta>/smartloja/backend          # banco novo + 18 produtos, 10 clientes, 14 dias de vendas
# API do clone em :3344 e o front em :5180 (API_PROXY_TARGET=http://localhost:3344), nunca 3333/5173
node scripts/capture-smartloja.mjs <pasta>/smartloja/frontend           # 8 telas, valida rota e tela de login em cada uma
```

O gerador respeita o limite de requisições da API (100/min), por isso leva alguns minutos.

## Notas

- **Rolagem de filme:** [Lenis](https://github.com/darkroomengineering/lenis) dá a inércia; `src/lib/film.js` calcula, a cada quadro,
  o progresso de cada cena e escreve `transform`/`opacity` só nos elementos que se movem. Para um efeito novo,
  acrescente uma linha em `FX` (cena, alvo, função do progresso). Com "reduzir movimento", tudo fica parado.

- **Reel:** `drawReel(t)` é função pura do tempo (loop de 12 s, 4 takes). `/?t=8.5` congela um quadro;
  `window.seek(t)` pinta qualquer instante. Com "reduzir movimento" ativo, mostra um still.
- **Discord:** presença via [Lanyard](https://github.com/Phineas/lanyard). Precisa continuar no servidor
  `discord.gg/lanyard` para o status funcionar.
- **Novas telas no catálogo:** acrescente em `SHOTS` e no `shots` do módulo em `src/data/smart7.js`.
