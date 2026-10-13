# sorry — estrutura do site

Stack: **Vite + React**. Deploy previsto no **Netlify** (ainda não publicado). PT/EN e tema claro/escuro.
Referência de gramática: landing de produto com seções numeradas, título com palavra de destaque em itálico
serifado, cartões A–D e catálogo em anel (velmax.llc). Só os princípios; conteúdo e marca são do Keven.

## `/` Abertura
Showreel em canvas (`src/lib/reel.js`), 12 s em loop, 4 takes: Código, Design, Motion, Produto (Smart7).
Botão **Entrar** vira a moldura do cabeçalho (View Transitions).

## `/inicio` Landing (uma página só, centrada no Keven)
| # | Âncora | Conteúdo |
|---|---|---|
| — | `#inicio` | "Oi, eu sou o *sorry.*" · meio-tom do "s." · cartão do Discord ao vivo · faixa com status e jogo aberto |
| — | — | faixa rolando com jogos, filmes, artistas e interesses |
| 01 | `#jogos` | 8 jogos; o cartão acende sozinho quando o Discord mostra o jogo aberto |
| 02 | `#tela` | Filmes (Jumper, Nolan com a filmografia, Marvel, DC) e séries (Suits, Território da Máfia, HBO, Marvel & DC) |
| 03 | `#musica` | 7 artistas favoritos; o artista acende quando está tocando no Spotify |
| 04 | `#projetos` | IA e projetos pessoais · Smart7 (tela real que segue o tema) · 8 módulos em abas com temporizador e a tela real de cada um (`#catalogo`) |
| 05 | `#sobre` | Dev · Design · Motion + ferramentas |
| 06 | `#contato` | GitHub, TikTok, Discord |

Gostos em `src/data/me.js`, na grafia do Keven. Artes dos jogos: Steam e Microsoft Store (CDN delas). Filmes e séries: TMDB (`scripts/fetch-tmdb.mjs`).

**Fluxo:** rolagem suave (Lenis) e cada seção animada pelo scroll.
**Linguagem de interface** (princípios de kprverse.com, não o conteúdo): moldura fixa com trilho lateral (mira que
gira com a rolagem e um marcador por seção), bloco de progresso na barra de cima, cabeçalhos em ficha técnica
(■ 001, régua, numeral gigante na vertical), cantos chanfrados, linha de terminal com dados reais do Discord e
tela de carregamento com progresso real.

`/projetos/*` e `/skills` (endereços antigos) redirecionam para as âncoras.

## Conteúdo
- Textos do Smart7: `src/data/smart7.js`, tirados do README do repositório privado e de `permissions.ts`.
- Textos da interface: `src/i18n.jsx` (`landing`).
- Telas: `public/projects/smart-loja/*.jpg`, capturadas por `scripts/capture-smartloja.mjs` num clone local
  com banco próprio e dados fictícios (`scripts/smartloja-demo-data.mjs`). Nunca do banco real.
