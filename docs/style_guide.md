# sorry — guia de estilo

## Conceito
**"A sala de projeção."** O site é um cinema escuro onde os trabalhos do sorry são o filme. Antes do conteúdo, a tela
mostra um reel; depois as luzes acendem só o bastante para ler. O azul elétrico é a luz do projetor: aparece onde há
ação (cursor, foco, status ao vivo, link), nunca como decoração.

## Paleta (uma função por cor)
| Token | Valor | Função |
|---|---|---|
| `--ink` | `#07080B` | Fundo. Preto azulado, nunca #000 puro |
| `--panel` | `#0E1015` | Cartões, superfícies elevadas |
| `--line` | `#1C2029` | Divisórias e bordas finas de 1px |
| `--mute` | `#7A8394` | Texto secundário, metadados |
| `--paper` | `#ECEEF2` | Texto principal |
| `--volt` | `#3D7BFF` | **Único destaque**: ação, foco, "ao vivo", seleção |
| `--volt-dim` | `#3D7BFF22` | Halo do cursor e da seleção |

Tema claro: inverte tinta e papel (`#F3F4F6` / `#0B0D12`); o volt continua igual.

## Tipografia
- **Display:** *Space Grotesk* 600–700, tracking -0,04em, em tamanhos grandes (até 16vw no nome).
- **UI e texto:** *Inter* 400–500.
- **Mono (metadados, timecodes, terminal):** *JetBrains Mono* 400. Ex.: `00:14:22 · PDV · 2026`.
- Tudo em Google Fonts, com `font-display: swap`.

## Materiais e luz
- Grão de filme muito sutil (canvas com ruído determinístico, 3% de opacidade) sobre todo o site.
- Luz vem de um ponto: o cursor projeta um halo volt de baixa opacidade. Sem glow em botões ou cartões.
- Barras de *letterbox* (2.39:1) aparecem só na abertura e somem ao entrar.

## Câmera e movimento
- Seções entram com **reveal por máscara** (o texto sobe de dentro da própria linha), não com fade.
- Springs: botões 320/30; cartões 170/26; tipografia grande 120/24, sem overshoot.
- Hover em projeto: o cartão "acende" (borda volt de 1px e imagem passa de 60% para 100% de brilho).
- `prefers-reduced-motion`: reel vira um still e reveals ficam instantâneos.

## Gramática de transições
- **Abertura → site:** o botão "Entrar" é o objeto-herói. Ele se expande até virar a moldura do cabeçalho, e o reel
  encolhe para o card do hero.
- **Lista → projeto:** o cartão clicado cresce até ocupar a tela e vira a capa da página do projeto (match cut).

## Proibidos
Gradiente roxo/rosa genérico · glassmorphism · partículas decorativas · tudo entrando com fade · emojis como ícones ·
mais de uma cor de destaque · overshoot em tipografia/logo · prints inventados do Smart Loja (só capturas reais) ·
dados reais de clientes ou CNPJs.
