# sorry — estrutura do site

Stack: **Vite + React**. Deploy previsto no **Netlify** (ainda não publicado). PT/EN e tema claro/escuro.
Referência de gramática: landing de produto com seções numeradas, título com palavra de destaque em itálico
serifado, cartões A–D e catálogo em anel (velmax.llc). Só os princípios; conteúdo e marca são do Keven.

## `/` Abertura
Showreel em canvas (`src/lib/reel.js`), 12 s em loop, 4 takes: Código, Design, Motion, Produto (Smart7).
Botão **Entrar** vira a moldura do cabeçalho (View Transitions).

## `/inicio` Landing (uma página só)
| # | Âncora | Conteúdo |
|---|---|---|
| — | `#inicio` | "Do código / ao *balcão*." · meio-tom do "s." que reage ao cursor · faixa com o status do Discord ao vivo |
| — | — | faixa rolando com os módulos do Smart7 |
| 01 | `#smart7` | O produto: dashboard real em moldura + 82 permissões · 5 perfis · 30 relatórios · 24 h de contingência |
| 02 | `#destaques` | A PDV · B Fiscal (fluxo da contingência) · C Estoque · D Permissões (chaves reais do perfil vendedor) |
| 03 | `#metodo` | Banco → API → App → Balcão |
| 04 | `#sobre` | Dev · Design · Motion + cartão do Discord (Lanyard) + ferramentas |
| 05 | `#catalogo` | **Anel de 8 módulos** (arrasta, ← →, Enter). Cada cartão abre um painel com funções e telas reais |
| 06 | `#contato` | GitHub, TikTok, Discord |

`/projetos/*` e `/skills` (endereços antigos) redirecionam para as âncoras.

## Conteúdo
- Textos do Smart7: `src/data/smart7.js`, tirados do README do repositório privado e de `permissions.ts`.
- Textos da interface: `src/i18n.jsx` (`landing`).
- Telas: `public/projects/smart-loja/*.jpg`, capturadas por `scripts/capture-smartloja.mjs` num clone local
  com banco próprio e dados fictícios (`scripts/smartloja-demo-data.mjs`). Nunca do banco real.
