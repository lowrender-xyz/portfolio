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
| Projetos (textos PT/EN, stack, prints) | `src/data/projects.js` |
| Textos da interface PT/EN | `src/i18n.jsx` |
| Reel da abertura (canvas) | `src/lib/reel.js` |
| Abertura (título, botão Entrar) | `src/components/Opening.jsx` |
| Cartão do Discord ao vivo | `src/components/DiscordCard.jsx` |
| Skills | `src/pages/Skills.jsx` |
| Cores, fontes, layout | `src/styles.css` (tokens no topo) |
| Direção de arte | `docs/style_guide.md` · `docs/estrutura.md` |

## Notas

- **Reel:** `drawReel(t)` é função pura do tempo (loop de 12 s, 4 takes). `/?t=8.5` congela um quadro;
  `window.seek(t)` pinta qualquer instante. Com "reduzir movimento" ativo, mostra um still.
- **Discord:** presença via [Lanyard](https://github.com/Phineas/lanyard). Precisa continuar no servidor
  `discord.gg/lanyard` para o status funcionar.
- **Prints de projeto:** coloque em `public/projects/<slug>/` e liste em `shots` no `projects.js`
  (o primeiro vira a capa). Só telas reais, sem dados de clientes.
- **Design e Motion** aparecem como "Em breve" até ganharem conteúdo (`soon: true`).
