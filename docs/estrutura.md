# sorry — estrutura do site

Stack: **Vite + React**, sem framework de CSS. Deploy no **Netlify** (grátis). PT/EN com seletor.

## 0. Abertura `/` (showreel em loop)
- Tela cheia, letterbox 2.39:1, timecode mono no canto (`REEL 01 · 00:00:07:12`).
- O reel é **gerado em canvas por código**, com 4 "takes" de ~3 s cada, em loop perfeito:
  1. **Código:** linhas de Python e TypeScript sendo digitadas, com o cursor volt piscando.
  2. **Design:** camadas de Photoshop deslizando e se alinhando num grid.
  3. **Motion:** curvas de easing desenhando trajetórias, keyframes estalando numa timeline.
  4. **Produto:** o logo Smart7 se monta e vira o primeiro cartão do PDV.
- Por cima, o nome **SORRY** em display gigante e a linha "Keven · dev, design & motion".
- Botão **Entrar →**: ao clicar, a transição herói (ver guia) leva para o início.
- Depois, quando você tiver seus vídeos, o reel em canvas é trocado por um `<video>` em loop, sem mexer no resto.

## 1. Início `/inicio`
- **Hero:** "sorry" em display + frase de apresentação + cartão do **Discord ao vivo** à direita (avatar, status,
  atividade, Spotify, jogo) via **Lanyard** (`api.lanyard.rest` + WebSocket).
- **Faixa de ferramentas:** VS Code · Photoshop · Python · Claude, em uma linha mono com ícones monocromáticos.
- **Projeto em destaque:** Smart Loja ERP com prints reais.
- Rodapé com redes: GitHub `77sorryz`, TikTok `@keven.yz`, Discord `@xsxry`.

## 2. Projetos `/projetos` e `/projetos/:slug`
| Projeto | Fonte | Tipo |
|---|---|---|
| **Smart Loja ERP** ★ | repo privado `Smart-Site` | Dev: SaaS multiloja, PDV, NF-e/NFC-e, RBAC com 80 permissões, PWA |
| Bot de setagem Discord | repo público `bot-setagem-discord` | Dev: painel, fichas e aprovação pela staff |
| Bot de formulário VIP | repo privado `vip-form-discord-bot` | Dev |
| Sistema de precificação | repo privado `sistema-precificacao` | Dev: Flask, preparado para Square Cloud |
| *Design · em breve* | placeholder marcado | Design |
| *Motion · em breve* | placeholder marcado | Motion |

A página de detalhe tem capa (match cut do cartão), problema → solução, stack, capturas e links. Repositório privado
aparece como "código privado", sem link quebrado.

**Prints do Smart Loja:** capturados com Playwright num clone local em portas próprias (nunca 5173/3333), entrando
direto na loja demo, sem mostrar seletor de empresas nem CNPJ. Antes de capturar, peço sua confirmação.

## 3. Skills `/skills`
Três colunas, **Dev · Design · Motion**, cada uma com ferramentas e o que você entrega. A lista de ferramentas (VS Code,
Photoshop, Python, Claude) vem de você; o resto sai do código dos projetos (TypeScript, React, Node, SQL, Flask,
discord.js), sempre citando a origem.
