// Conteúdo do Smart7 tirado do README do repositório privado 77sorryz/Smart-Site, de backend/src/config/permissions.ts
// (82 permissões) e das telas capturadas (scripts/capture-smartloja.mjs, dados de demonstração fictícios).
const shot = (name, pt, en) => ({ src: `/projects/smart-loja/${name}.jpg`, alt: { pt, en } });

export const SHOTS = {
  dashboard: shot("dashboard", "Visão geral: faturamento, pedidos, ticket médio e estoque crítico", "Overview: revenue, orders, average ticket and critical stock"),
  pdv: shot("pdv", "Frente de caixa com leitor de código de barras", "Point of sale with barcode reader"),
  vendas: shot("vendas", "Pedidos de venda com filtros por documento, pagamento e período", "Sales orders filtered by document, payment and period"),
  caixas: shot("caixas", "Caixas com conferência cega no fechamento", "Registers with blind reconciliation at closing"),
  produtos: shot("produtos", "Catálogo de produtos compartilhado entre as lojas", "Product catalog shared across stores"),
  estoque: shot("estoque", "Saldos por depósito e situação de cada produto", "Balances per warehouse and status of each product"),
  financeiro: shot("financeiro", "Contas a receber geradas das vendas parceladas", "Receivables generated from instalment sales"),
  relatorios: shot("relatorios", "30 relatórios por área, com envios agendados", "30 reports by area, with scheduled delivery"),
};

export const STATS = [
  { value: "82", label: { pt: "permissões granulares", en: "granular permissions" } },
  { value: "5", label: { pt: "perfis de acesso", en: "access roles" } },
  { value: "30", label: { pt: "relatórios", en: "reports" } },
  { value: "24 h", label: { pt: "contingência da NFC-e", en: "NFC-e contingency" } },
];

// Destaques (A–D), no ritmo da referência: uma ideia por cartão
export const HIGHLIGHTS = [
  {
    letter: "A",
    tag: { pt: "Frente de caixa", en: "Point of sale" },
    title: { pt: "Vender sem esperar.", en: "Sell without waiting." },
    text: {
      pt: "Busca por nome, código ou leitor de código de barras, desconto por item, pagamento dividido com troco, orçamento e cupom em PDF. Impressão térmica ESC/POS de 58 e 80 mm direto do navegador.",
      en: "Search by name, code or barcode reader, per-item discounts, split payment with change, quotes and PDF receipts. ESC/POS thermal printing at 58 and 80 mm straight from the browser.",
    },
    chips: ["F2 · F4 · F10", "Web Serial", "ESC/POS 58/80 mm"],
    shot: "pdv",
  },
  {
    letter: "B",
    tag: { pt: "Fiscal", en: "Tax" },
    title: { pt: "A nota sai junto com a venda.", en: "The invoice leaves with the sale." },
    text: {
      pt: "NF-e e NFC-e com série, chave de 44 dígitos, DANFE e XML, cancelamento e carta de correção pela Focus NFe. Se a SEFAZ cair, a venda segue: a nota fica reservada com o mesmo número e uma fila retransmite sozinha.",
      en: "NF-e and NFC-e with series, 44-digit key, DANFE and XML, cancellation and correction letters through Focus NFe. If the tax authority goes down, the sale goes on: the invoice keeps its number and a queue resends it on its own.",
    },
    flow: ["venda", "nota reservada", "fila", "autorizada"],
    flowEn: ["sale", "invoice reserved", "queue", "authorized"],
  },
  {
    letter: "C",
    tag: { pt: "Estoque", en: "Stock" },
    title: { pt: "Tudo ou nada.", en: "All or nothing." },
    text: {
      pt: "Baixa na venda, devolução no cancelamento e estoque negativo bloqueado por loja. Uma lista colada do Excel vira movimentação em lote, conferida antes e aplicada numa única transação.",
      en: "Deducted on sale, returned on cancellation, negative stock blocked per store. A list pasted from Excel becomes a batch movement, reviewed first and applied in a single transaction.",
    },
    chips: ["depósitos", "transferências", "inventário"],
    shot: "estoque",
  },
  {
    letter: "D",
    tag: { pt: "Permissões", en: "Permissions" },
    title: { pt: "Cada um vê o que deve.", en: "Everyone sees what they should." },
    text: {
      pt: "82 permissões e 5 perfis. Cada vínculo usuário × loja herda o perfil e pode ganhar ou perder chaves só naquela loja, e ninguém concede o que não tem. 2FA, sessões revogáveis e auditoria completa.",
      en: "82 permissions and 5 roles. Each user × store link inherits a role and can gain or lose keys in that store only, and nobody grants what they don't have. 2FA, revocable sessions and a full audit trail.",
    },
    // perfil vendedor: o README diz que ele não reabre nem exclui caixas
    perms: [
      ["venda_criar", true],
      ["caixa_abrir", true],
      ["caixa_fechar", true],
      ["caixa_reabrir", false],
      ["nota_cancelar", false],
      ["relatorio_custo_margem", false],
    ],
  },
];

export const METHOD = [
  {
    n: "01",
    title: { pt: "Banco", en: "Database" },
    text: { pt: "PostgreSQL 16 em produção, migrations Knex e cada loja isolada por loja_id.", en: "PostgreSQL 16 in production, Knex migrations and every store isolated by loja_id." },
    tags: ["PostgreSQL", "Knex", "multitenant"],
  },
  {
    n: "02",
    title: { pt: "API", en: "API" },
    text: { pt: "Express em TypeScript, JWT de 15 min com renovação revogável e webhooks assinados com HMAC.", en: "Express in TypeScript, 15-min JWT with revocable refresh and HMAC-signed webhooks." },
    tags: ["Express", "TypeScript", "JWT"],
  },
  {
    n: "03",
    title: { pt: "App", en: "App" },
    text: { pt: "React com Vite e TanStack Query, instalável como PWA e navegável por teclado (WCAG 2.1 AA no E2E).", en: "React with Vite and TanStack Query, installable as a PWA and keyboard-navigable (WCAG 2.1 AA in E2E)." },
    tags: ["React", "PWA", "WCAG"],
  },
  {
    n: "04",
    title: { pt: "Balcão", en: "Counter" },
    text: { pt: "Leitor de código de barras, impressora térmica, gaveta e cupom: o sistema chega até o caixa da loja.", en: "Barcode reader, thermal printer, cash drawer and receipt: the system reaches the store's register." },
    tags: ["Web Serial", "ESC/POS", "PDF"],
  },
];

// Catálogo do fim da página: uma área do app por cartão
export const MODULES = [
  {
    code: "MOD-01",
    tag: { pt: "Meu negócio", en: "My business" },
    title: { pt: "Visão geral", en: "Overview" },
    line: { pt: "O dia da loja numa tela.", en: "The store's day on one screen." },
    shots: ["dashboard"],
    features: {
      pt: ["Faturamento, pedidos e ticket médio de 7 dias a 12 meses", "Comparação com o período anterior", "Margem do mês e estoque crítico", "Consolidado de todas as empresas"],
      en: ["Revenue, orders and average ticket from 7 days to 12 months", "Comparison with the previous period", "Monthly margin and critical stock", "Consolidated view of every company"],
    },
  },
  {
    code: "MOD-02",
    tag: { pt: "Vendas", en: "Sales" },
    title: { pt: "Frente de caixa", en: "Point of sale" },
    line: { pt: "Do código de barras ao cupom.", en: "From barcode to receipt." },
    shots: ["pdv", "vendas"],
    features: {
      pt: ["Busca por nome, código ou leitor", "Desconto por item, valor ou percentual", "Pagamento dividido com troco", "Orçamentos que viram venda", "Cupom em PDF e impressão térmica", "Cancelamento com estorno e devolução ao estoque"],
      en: ["Search by name, code or reader", "Discount per item, amount or percentage", "Split payment with change", "Quotes that become sales", "PDF receipt and thermal printing", "Cancellation with refund and stock return"],
    },
  },
  {
    code: "MOD-03",
    tag: { pt: "Vendas", en: "Sales" },
    title: { pt: "Caixas", en: "Registers" },
    line: { pt: "Abre, movimenta, confere.", en: "Open, move, reconcile." },
    shots: ["caixas"],
    features: {
      pt: ["Abertura com troco inicial", "Sangria e suprimento", "Conferência cega: o esperado só aparece na revisão", "Fechamento com diferença por forma de pagamento", "Reabertura só com permissão"],
      en: ["Opening with starting change", "Cash drops and top-ups", "Blind count: expected amount only shows at review", "Closing with difference per payment method", "Reopening only with permission"],
    },
  },
  {
    code: "MOD-04",
    tag: { pt: "Fiscal", en: "Tax" },
    title: { pt: "Notas fiscais", en: "Tax invoices" },
    line: { pt: "NF-e e NFC-e, com contingência.", en: "NF-e and NFC-e, with contingency." },
    shots: [],
    features: {
      pt: ["Número por série e chave de 44 dígitos", "DANFE em PDF e XML", "Cancelamento e carta de correção", "Integração Focus NFe com credenciais criptografadas", "Contingência da NFC-e com fila de retransmissão", "Certificado A1 criptografado"],
      en: ["Number per series and 44-digit key", "PDF DANFE and XML", "Cancellation and correction letter", "Focus NFe integration with encrypted credentials", "NFC-e contingency with a resend queue", "Encrypted A1 certificate"],
    },
    note: {
      pt: "As telas fiscais ficam fora da galeria: a demonstração roda sem certificado e sem SEFAZ.",
      en: "Tax screens stay out of the gallery: the demo runs without a certificate or tax authority.",
    },
  },
  {
    code: "MOD-05",
    tag: { pt: "Cadastros", en: "Records" },
    title: { pt: "Produtos e clientes", en: "Products and customers" },
    line: { pt: "Um catálogo para todas as lojas.", en: "One catalog for every store." },
    shots: ["produtos"], // sem a tela de clientes: os CPFs sorteados poderiam existir de verdade
    features: {
      pt: ["Catálogo compartilhado, com saldo e preço por loja", "Código de barras, NCM e CSTs", "Importação e exportação", "Serviços cadastrados como produto sem estoque", "Clientes isolados por loja"],
      en: ["Shared catalog, with balance and price per store", "Barcode, NCM and tax codes", "Import and export", "Services registered as stockless products", "Customers isolated per store"],
    },
  },
  {
    code: "MOD-06",
    tag: { pt: "Estoque", en: "Stock" },
    title: { pt: "Estoque", en: "Stock" },
    line: { pt: "Saldo certo em cada depósito.", en: "The right balance in every warehouse." },
    shots: ["estoque"],
    features: {
      pt: ["Saldos por depósito", "Transferência entre lojas", "Pedidos de compra com recebimento parcial", "Inventário", "Importação de lista colada, aplicada em lote"],
      en: ["Balances per warehouse", "Transfers between stores", "Purchase orders with partial receipt", "Inventory counts", "Pasted lists applied as a batch"],
    },
  },
  {
    code: "MOD-07",
    tag: { pt: "Financeiro", en: "Finance" },
    title: { pt: "Financeiro", en: "Finance" },
    line: { pt: "Do título ao DRE.", en: "From bill to income statement." },
    shots: ["financeiro"],
    features: {
      pt: ["Plano de contas e centros de custo", "Baixas parciais, estorno justificado e renegociação", "Transferências e fechamento", "DRE e previsão", "Conciliação OFX"],
      en: ["Chart of accounts and cost centers", "Partial payments, justified reversals and renegotiation", "Transfers and closing", "Income statement and forecast", "OFX reconciliation"],
    },
  },
  {
    code: "MOD-08",
    tag: { pt: "Relatórios", en: "Reports" },
    title: { pt: "Relatórios", en: "Reports" },
    line: { pt: "30 análises, também por e-mail.", en: "30 analyses, also by e-mail." },
    shots: ["relatorios"],
    features: {
      pt: ["Visão executiva, DRE gerencial e comparativo de períodos", "Curva ABC, giro e produtos sem movimentação", "Conferência vendas × caixa × financeiro", "Exportação em PDF e XLSX", "Envios agendados por e-mail"],
      en: ["Executive view, management income statement and period comparison", "ABC curve, turnover and idle products", "Sales × register × finance reconciliation", "PDF and XLSX export", "Scheduled e-mail delivery"],
    },
  },
];
