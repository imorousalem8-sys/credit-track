export interface AfricanCountry {
  code: string;
  nameFr: string;
  nameEn: string;
  flag: string; // Clean ISO alpha-2 badge (no emojis)
  currency: string;
  system: string;
  vatRate: number;
}

export interface AccountingAccount {
  code: string;
  labelFr: string;
  labelEn: string;
  category: 'revenue' | 'expense' | 'asset' | 'liability' | 'tax' | 'cash';
}

export const AFRICAN_COUNTRIES: AfricanCountry[] = [
  { code: "BJ", nameFr: "Bénin", nameEn: "Benin", flag: "BJ", currency: "XOF", system: "SYSCOHADA", vatRate: 18 },
  { code: "CI", nameFr: "Côte d’Ivoire", nameEn: "Ivory Coast", flag: "CI", currency: "XOF", system: "SYSCOHADA", vatRate: 18 },
  { code: "SN", nameFr: "Sénégal", nameEn: "Senegal", flag: "SN", currency: "XOF", system: "SYSCOHADA", vatRate: 18 },
  { code: "CM", nameFr: "Cameroun", nameEn: "Cameroon", flag: "CM", currency: "XAF", system: "SYSCOHADA CEMAC", vatRate: 19.25 },
  { code: "GA", nameFr: "Gabon", nameEn: "Gabon", flag: "GA", currency: "XAF", system: "SYSCOHADA CEMAC", vatRate: 18 },
  { code: "CD", nameFr: "Congo (RDC)", nameEn: "DR Congo", flag: "CD", currency: "CDF", system: "OHADA / RDC", vatRate: 16 },
  { code: "CG", nameFr: "Congo (Brazzaville)", nameEn: "Congo", flag: "CG", currency: "XAF", system: "SYSCOHADA CEMAC", vatRate: 18 },
  { code: "BF", nameFr: "Burkina Faso", nameEn: "Burkina Faso", flag: "BF", currency: "XOF", system: "SYSCOHADA", vatRate: 18 },
  { code: "ML", nameFr: "Mali", nameEn: "Mali", flag: "ML", currency: "XOF", system: "SYSCOHADA", vatRate: 18 },
  { code: "TG", nameFr: "Togo", nameEn: "Togo", flag: "TG", currency: "XOF", system: "SYSCOHADA", vatRate: 18 },
  { code: "NE", nameFr: "Niger", nameEn: "Niger", flag: "NE", currency: "XOF", system: "SYSCOHADA", vatRate: 19 },
  { code: "GN", nameFr: "Guinée", nameEn: "Guinea", flag: "GN", currency: "GNF", system: "SYSCOHADA", vatRate: 18 },
  { code: "TD", nameFr: "Tchad", nameEn: "Chad", flag: "TD", currency: "XAF", system: "SYSCOHADA CEMAC", vatRate: 18 },
  { code: "CF", nameFr: "Centrafrique", nameEn: "Central African Republic", flag: "CF", currency: "XAF", system: "SYSCOHADA CEMAC", vatRate: 19 },
  { code: "GH", nameFr: "Ghana", nameEn: "Ghana", flag: "GH", currency: "GHS", system: "GRA / IFRS", vatRate: 21.9 },
  { code: "NG", nameFr: "Nigeria", nameEn: "Nigeria", flag: "NG", currency: "NGN", system: "FIRS / IFRS", vatRate: 7.5 },
  { code: "KE", nameFr: "Kenya", nameEn: "Kenya", flag: "KE", currency: "KES", system: "KRA / IFRS", vatRate: 16 },
  { code: "ZA", nameFr: "Afrique du Sud", nameEn: "South Africa", flag: "ZA", currency: "ZAR", system: "SARS / IFRS", vatRate: 15 },
  { code: "MA", nameFr: "Maroc", nameEn: "Morocco", flag: "MA", currency: "MAD", system: "Code Général Marocain", vatRate: 20 },
  { code: "DZ", nameFr: "Algérie", nameEn: "Algeria", flag: "DZ", currency: "DZD", system: "NSC Algérie", vatRate: 19 },
  { code: "TN", nameFr: "Tunisie", nameEn: "Tunisia", flag: "TN", currency: "TND", system: "Comptabilité Tunisienne", vatRate: 19 },
  { code: "EG", nameFr: "Égypte", nameEn: "Egypt", flag: "EG", currency: "EGP", system: "Egyptian Accounting Code", vatRate: 14 },
  { code: "AO", nameFr: "Angola", nameEn: "Angola", flag: "AO", currency: "AOA", system: "PGC Angola / IFRS", vatRate: 14 },
  { code: "RW", nameFr: "Rwanda", nameEn: "Rwanda", flag: "RW", currency: "RWF", system: "RRA Rwanda", vatRate: 18 },
  { code: "TZ", nameFr: "Tanzanie", nameEn: "Tanzania", flag: "TZ", currency: "TZS", system: "TRA Tanzania", vatRate: 18 },
  { code: "UG", nameFr: "Ouganda", nameEn: "Uganda", flag: "UG", currency: "UGX", system: "URA Uganda", vatRate: 18 },
  { code: "ZM", nameFr: "Zambie", nameEn: "Zambia", flag: "ZM", currency: "ZMW", system: "ZRA Zambia", vatRate: 16 },
  { code: "ZW", nameFr: "Zimbabwe", nameEn: "Zimbabwe", flag: "ZW", currency: "ZWL", system: "ZIMRA Zimbabwe", vatRate: 15 },
  { code: "MG", nameFr: "Madagascar", nameEn: "Madagascar", flag: "MG", currency: "MGA", system: "PCG 2005 Madagascar", vatRate: 20 },
  { code: "MU", nameFr: "Maurice", nameEn: "Mauritius", flag: "MU", currency: "MUR", system: "MRA / IFRS", vatRate: 15 }
];

export const ACCOUNTING_CHARTS: Record<string, AccountingAccount[]> = {
  SYSCOHADA: [
    { code: "701", labelFr: "Ventes de marchandises", labelEn: "Sales of Goods", category: "revenue" },
    { code: "706", labelFr: "Services vendus", labelEn: "Services Rendered", category: "revenue" },
    { code: "601", labelFr: "Achats de marchandises", labelEn: "Purchases of Goods", category: "expense" },
    { code: "622", labelFr: "Frais de transport & livraison", labelEn: "Freight & Delivery", category: "expense" },
    { code: "631", labelFr: "Frais bancaires & commissions", labelEn: "Bank & Transaction Fees", category: "expense" },
    { code: "411", labelFr: "Clients - Créances", labelEn: "Accounts Receivable", category: "asset" },
    { code: "401", labelFr: "Fournisseurs - Dettes", labelEn: "Accounts Payable", category: "liability" },
    { code: "443", labelFr: "TVA Facturée sur Ventes", labelEn: "Output VAT", category: "tax" },
    { code: "521", labelFr: "Banque locale / Mobile Money", labelEn: "Bank / Mobile Wallet", category: "cash" }
  ],
  IFRS: [
    { code: "4000", labelFr: "Chiffre d'affaires Ventes", labelEn: "Sales Revenue", category: "revenue" },
    { code: "5000", labelFr: "Coût des marchandises vendues", labelEn: "Cost of Goods Sold", category: "expense" },
    { code: "6100", labelFr: "Frais généraux & d'exploitation", labelEn: "Operating Expenses", category: "expense" },
    { code: "1100", labelFr: "Créances clients", labelEn: "Trade Debtors", category: "asset" },
    { code: "2100", labelFr: "Dettes fournisseurs", labelEn: "Trade Creditors", category: "liability" },
    { code: "2200", labelFr: "TVA à payer", labelEn: "VAT Payable", category: "tax" },
    { code: "1010", labelFr: "Caisse & Mobile Money", labelEn: "Cash & MoMo", category: "cash" }
  ]
};

export function getCountryConfig(code: string): AfricanCountry & { chart: AccountingAccount[] } {
  const country = AFRICAN_COUNTRIES.find(c => c.code === code) || AFRICAN_COUNTRIES[0];
  const chart = (country.system && country.system.includes("SYSCOHADA")) ? ACCOUNTING_CHARTS.SYSCOHADA : ACCOUNTING_CHARTS.IFRS;
  return { ...country, chart };
}

export interface CurrencyOption {
  code: string;
  label: string;
  symbol: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'XOF', label: 'Franc CFA UEMOA (FCFA)', symbol: 'FCFA' },
  { code: 'XAF', label: 'Franc CFA CEMAC (FCFA)', symbol: 'FCFA' },
  { code: 'GHS', label: 'Ghana Cedi (₵)', symbol: '₵' },
  { code: 'NGN', label: 'Naira Nigérian (₦)', symbol: '₦' },
  { code: 'GNF', label: 'Franc Guinéen (GNF)', symbol: 'GNF' },
  { code: 'CDF', label: 'Franc Congolais (CDF)', symbol: 'CDF' },
  { code: 'KES', label: 'Shilling Kenyan (KES)', symbol: 'KES' },
  { code: 'ZAR', label: 'Rand Sud-Africain (ZAR)', symbol: 'R' },
  { code: 'MAD', label: 'Dirham Marocain (MAD)', symbol: 'MAD' },
  { code: 'DZD', label: 'Dinar Algérien (DZD)', symbol: 'DZD' },
  { code: 'TND', label: 'Dinar Tunisien (TND)', symbol: 'DT' },
  { code: 'EGP', label: 'Livre Égyptienne (EGP)', symbol: 'E£' },
  { code: 'EUR', label: 'Euro (€)', symbol: '€' },
  { code: 'USD', label: 'Dollar Américain ($)', symbol: '$' },
  { code: 'GBP', label: 'Livre Sterling (£)', symbol: '£' },
  { code: 'CAD', label: 'Dollar Canadien (CAD)', symbol: 'CA$' },
];

export function getCurrencySymbol(code: string = 'XOF'): string {
  const found = CURRENCY_OPTIONS.find(c => c.code === code);
  return found ? found.symbol : code;
}

export function formatAfricanCurrency(amount: number, currencyCode: string = 'XOF'): string {
  const numStr = Math.round(amount || 0).toLocaleString('fr-FR');
  if (currencyCode === 'XOF' || currencyCode === 'XAF' || currencyCode === 'FCFA') return `${numStr} FCFA`;
  if (currencyCode === 'GHS') return `₵ ${numStr}`;
  if (currencyCode === 'NGN') return `₦ ${numStr}`;
  if (currencyCode === 'EUR') return `${numStr} €`;
  if (currencyCode === 'USD') return `$ ${numStr}`;
  if (currencyCode === 'GBP') return `£ ${numStr}`;
  if (currencyCode === 'KES') return `KES ${numStr}`;
  if (currencyCode === 'ZAR') return `R ${numStr}`;
  if (currencyCode === 'MAD') return `${numStr} MAD`;
  if (currencyCode === 'GNF') return `${numStr} GNF`;
  if (currencyCode === 'CDF') return `${numStr} CDF`;
  return `${numStr} ${currencyCode}`;
}

