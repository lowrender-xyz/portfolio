// Conteúdo do Smart7 tirado do README do repositório privado 77sorryz/Smart-Site, de backend/src/config/permissions.ts
// (82 permissões) e das telas capturadas (scripts/capture-smartloja.mjs, dados de demonstração fictícios).
const shot = (name, pt, en) => ({
  src: `${import.meta.env.BASE_URL}projects/smart-loja/${name}.jpg`,
  srcLight: `${import.meta.env.BASE_URL}projects/smart-loja/${name}-claro.jpg`, // mesma tela no tema claro do app
  alt: { pt, en },
});

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

// Catálogo de módulos (seção de projetos): uma área do app por cartão
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
