// Conteúdo tirado dos READMEs de cada repositório (github.com/77sorryz). Nada inventado:
// o que ainda não existe aparece como "em breve".

export const projects = [
  {
    slug: "smart-loja",
    kind: "dev",
    year: 2026,
    title: "Smart Loja ERP",
    private: true,
    mark: "/brand/smart7-mark.png",
    tagline: {
      pt: "SaaS multiloja para varejo: do caixa à nota fiscal.",
      en: "Multi-store retail SaaS: from the register to the tax invoice.",
    },
    summary: {
      pt: "Sistema web responsivo (SPA/PWA) para gestão comercial de várias lojas: usuários com permissões, clientes, produtos, estoque, frente de caixa, emissão fiscal e relatórios. Cada loja tem os próprios dados, isolados.",
      en: "Responsive web system (SPA/PWA) for running several stores: users with permissions, customers, products, stock, point of sale, tax invoicing and reports. Each store's data is isolated.",
    },
    stats: [
      { value: "80", label: { pt: "permissões granulares", en: "granular permissions" } },
      { value: "5", label: { pt: "perfis de acesso", en: "access roles" } },
      { value: "NF-e · NFC-e", label: { pt: "emissão fiscal", en: "tax invoicing" } },
    ],
    features: [
      {
        title: { pt: "Frente de caixa (PDV)", en: "Point of sale" },
        text: {
          pt: "Busca por nome, código ou código de barras, desconto por item, pagamento dividido com troco, orçamentos e cupom em PDF. Só vende com caixa aberto.",
          en: "Search by name, code or barcode, per-item discounts, split payment with change, quotes and PDF receipts. Sales only with an open register.",
        },
      },
      {
        title: { pt: "Caixas", en: "Registers" },
        text: {
          pt: "Abertura, sangria, suprimento e fechamento com conferência entre o esperado e o informado.",
          en: "Opening, cash drops, top-ups and closing with expected × counted reconciliation.",
        },
      },
      {
        title: { pt: "Fiscal", en: "Tax" },
        text: {
          pt: "NF-e e NFC-e com série, chave de acesso de 44 dígitos, DANFE em PDF, XML, cancelamento e carta de correção. Integração real com Focus NFe.",
          en: "NF-e and NFC-e with series, 44-digit access key, PDF DANFE, XML, cancellation and correction letters. Real Focus NFe integration.",
        },
      },
      {
        title: { pt: "Estoque transacional", en: "Transactional stock" },
        text: {
          pt: "Baixa automática na venda, devolução no cancelamento e importação de listas coladas do Excel, aplicadas em lote, tudo ou nada.",
          en: "Automatic deduction on sale, return on cancellation and pasted Excel lists applied as an all-or-nothing batch.",
        },
      },
      {
        title: { pt: "Permissões por loja", en: "Per-store permissions" },
        text: {
          pt: "Cada vínculo usuário × loja herda o perfil e pode ganhar ou perder permissões só naquela loja. Ninguém concede o que não tem.",
          en: "Each user × store link inherits a role and can gain or lose permissions in that store only. Nobody grants what they don't have.",
        },
      },
      {
        title: { pt: "Relatórios", en: "Reports" },
        text: {
          pt: "Relatórios gerenciais exportados em PDF e XLSX, com auditoria das operações.",
          en: "Management reports exported to PDF and XLSX, with an audit log of operations.",
        },
      },
    ],
    stack: ["TypeScript", "React", "Vite", "Tailwind", "TanStack Query", "Node.js", "Express", "Knex", "PostgreSQL", "PWA"],
    shots: [],
  },
  {
    slug: "bot-setagem",
    kind: "dev",
    year: 2026,
    title: "Bot de setagem",
    repo: "https://github.com/77sorryz/bot-setagem-discord",
    tagline: {
      pt: "Fichas de cargo no Discord, da inscrição à aprovação da staff.",
      en: "Discord role applications, from sign-up to staff approval.",
    },
    summary: {
      pt: "O jogador clica em Iniciar setagem, escolhe a facção e o cargo, informa nome e ID. A ficha vai para um canal privado, onde a staff aprova como Líder, como Padrão ou recusa. O resultado cai no canal de fichas finalizadas.",
      en: "The player clicks Start, picks a faction and role, and enters name and ID. The form goes to a private channel where staff approve as Leader, as Standard or reject it. The result lands in the finished-forms channel.",
    },
    features: [],
    stack: ["JavaScript", "Node.js", "discord.js"],
    shots: [],
  },
  {
    slug: "vip-form",
    kind: "dev",
    year: 2026,
    title: "Formulário VIP",
    private: true,
    tagline: {
      pt: "Pedidos de VIP com comprovantes e painel de status ao vivo.",
      en: "VIP requests with receipts and a live status board.",
    },
    summary: {
      pt: "Painel fixado com formulário: o jogador envia IDs, e-mail, data da compra e até 10 comprovantes. A equipe aprova, recusa, marca em andamento ou envia o cupom por DM, e um embed se atualiza sozinho com o estado de cada pedido.",
      en: "A pinned panel with a form: players send IDs, e-mail, purchase date and up to 10 receipts. Staff approve, reject, mark in progress or DM the coupon, and a self-updating embed tracks every request.",
    },
    features: [],
    stack: ["JavaScript", "Node.js", "discord.js"],
    shots: [],
  },
  {
    slug: "precificacao",
    kind: "dev",
    year: 2026,
    title: "Precificação automática",
    private: true,
    tagline: {
      pt: "Preço de venda calculado do custo, por grupo e forma de pagamento.",
      en: "Sale prices computed from cost, per group and payment method.",
    },
    summary: {
      pt: "Cada grupo de produtos tem coeficientes à vista, cartão e parcelado. O preço sai de custo ÷ coeficiente, e a consulta pelo código já devolve tudo calculado. Mudar um grupo reprecifica todos os produtos dele.",
      en: "Each product group has cash, card and instalment coefficients. Price = cost ÷ coefficient, and a lookup by code returns everything computed. Changing a group reprices all its products.",
    },
    features: [],
    stack: ["Python", "Flask"],
    shots: [],
  },
  {
    slug: "design",
    kind: "design",
    soon: true,
    title: { pt: "Design", en: "Design" },
    tagline: { pt: "Peças em Photoshop chegando aqui.", en: "Photoshop pieces landing here." },
  },
  {
    slug: "motion",
    kind: "motion",
    soon: true,
    title: { pt: "Motion", en: "Motion" },
    tagline: { pt: "Vídeos e animações chegando aqui.", en: "Videos and animations landing here." },
  },
];

export const projectBySlug = (slug) => projects.find((p) => p.slug === slug && !p.soon);
