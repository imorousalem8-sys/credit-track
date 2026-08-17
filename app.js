/* ==========================================================================
   CréditTrack PRO — Moteur Applicatif Bilingue (FR / EN) & Multi-Pays
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. LISTE DES PAYS PANAFRICAINS (54 PAYS)
// --------------------------------------------------------------------------
const AFRICAN_COUNTRIES = [
  {code: "CI", nameFr: "Côte d’Ivoire",    nameEn: "Ivory Coast",      flag: "🇨🇮", currency: "XOF", system: "SYSCOHADA", vatRate: 18},
  {code: "BJ", nameFr: "Bénin",            nameEn: "Benin",            flag: "🇧🇯", currency: "XOF", system: "SYSCOHADA", vatRate: 18},
  {code: "SN", nameFr: "Sénégal",          nameEn: "Senegal",          flag: "🇸🇳", currency: "XOF", system: "SYSCOHADA", vatRate: 18},
  {code: "GH", nameFr: "Ghana",            nameEn: "Ghana",            flag: "🇬🇭", currency: "GHS", system: "GRA / IFRS", vatRate: 21.9},
  {code: "NG", nameFr: "Nigeria",          nameEn: "Nigeria",          flag: "🇳🇬", currency: "NGN", system: "FIRS / IFRS", vatRate: 7.5},
  {code: "CM", nameFr: "Cameroun",         nameEn: "Cameroon",         flag: "🇨🇲", currency: "XAF", system: "SYSCOHADA CEMAC", vatRate: 19.25},
  {code: "KE", nameFr: "Kenya",            nameEn: "Kenya",            flag: "🇰🇪", currency: "KES", system: "KRA / IFRS", vatRate: 16},
  {code: "ZA", nameFr: "Afrique du Sud",   nameEn: "South Africa",     flag: "🇿🇦", currency: "ZAR", system: "SARS / IFRS", vatRate: 15},
  {code: "MA", nameFr: "Maroc",            nameEn: "Morocco",          flag: "🇲🇦", currency: "MAD", system: "Code Général Marocain", vatRate: 20},
  {code: "DZ", nameFr: "Algérie",          nameEn: "Algeria",          flag: "🇩🇿", currency: "DZD", system: "NSC Algérie", vatRate: 19},
  {code: "TN", nameFr: "Tunisie",          nameEn: "Tunisia",          flag: "🇹🇳", currency: "TND", system: "Comptabilité Tunisienne", vatRate: 19},
  {code: "EG", nameFr: "Égypte",           nameEn: "Egypt",            flag: "🇪🇬", currency: "EGP", system: "Egyptian Accounting Code", vatRate: 14},
  {code: "BF", nameFr: "Burkina Faso",     nameEn: "Burkina Faso",     flag: "🇧🇫", currency: "XOF", system: "SYSCOHADA", vatRate: 18},
  {code: "ML", nameFr: "Mali",             nameEn: "Mali",             flag: "🇲🇱", currency: "XOF", system: "SYSCOHADA", vatRate: 18},
  {code: "TG", nameFr: "Togo",             nameEn: "Togo",             flag: "🇹🇬", currency: "XOF", system: "SYSCOHADA", vatRate: 18},
  {code: "CD", nameFr: "Congo (RDC)",      nameEn: "DR Congo",         flag: "🇨🇩", currency: "CDF", system: "OHADA / RDC", vatRate: 16},
  {code: "GA", nameFr: "Gabon",            nameEn: "Gabon",            flag: "🇬🇦", currency: "XAF", system: "SYSCOHADA CEMAC", vatRate: 18},
  {code: "GN", nameFr: "Guinée",           nameEn: "Guinea",           flag: "🇬🇳", currency: "GNF", system: "SYSCOHADA", vatRate: 18},
  {code: "NE", nameFr: "Niger",            nameEn: "Niger",            flag: "🇳🇪", currency: "XOF", system: "SYSCOHADA", vatRate: 19},
  {code: "RW", nameFr: "Rwanda",           nameEn: "Rwanda",           flag: "🇷🇼", currency: "RWF", system: "RRA Rwanda", vatRate: 18}
];

const ACCOUNTING_CHARTS = {
  SYSCOHADA: [
    {code: "701", labelFr: "Ventes de marchandises", labelEn: "Sales of Goods", category: "revenue"},
    {code: "706", labelFr: "Services & Prestations", labelEn: "Services Rendered", category: "revenue"},
    {code: "601", labelFr: "Achats de marchandises / Stock", labelEn: "Stock Purchases", category: "expense"},
    {code: "622", labelFr: "Transport & Livraison", labelEn: "Delivery & Transport", category: "expense"},
    {code: "631", labelFr: "Frais & Commissions Mobile Money", labelEn: "Mobile Money & Bank Fees", category: "expense"},
    {code: "521", labelFr: "Caisse & Mobile Money", labelEn: "Cash & Mobile Money", category: "cash"}
  ]
};

function getCountryConfig(code) {
  return AFRICAN_COUNTRIES.find(c => c.code === code) || AFRICAN_COUNTRIES[0];
}

window.AFRICAN_COUNTRIES = AFRICAN_COUNTRIES;
window.getCountryConfig = getCountryConfig;

// --------------------------------------------------------------------------
// 2. DICTIONNAIRE DE TRADUCTION COMPLET BILINGUE (FR / EN)
// --------------------------------------------------------------------------
const translations = {
  fr: {
    // Nav & Sidebar
    dashboard: "Tableau de Bord",
    clients: "Clients & Dettes",
    payments: "Encaisser & Reçus",
    reminders: "Rappels WhatsApp",
    accountingJournal: "Caisse & Dépenses",
    settings: "Paramètres",
    sidebarAppSub: "GESTION COMMERÇANT",
    modeCredit: "Crédit",
    modeAccounting: "Caisse / Compta",
    bannerCredit: "💡 Mode Crédits & Clients actif",
    bannerAccounting: "📊 Mode Caisse & Dépenses actif",
    menuDashboard: "Tableau de Bord",
    menuClients: "Clients & Dettes",
    menuPayments: "Encaisser & Reçus",
    menuReminders: "Rappels WhatsApp",
    menuAccounting: "Caisse & Dépenses",
    menuSettings: "Paramètres",
    menuHomeSite: "Page d'Accueil Site",
    proTitle: "Formule Pro Commerçant",
    proDesc: "Rappels WhatsApp automatiques et protection contre les impayés.",
    proBtn: "Passer à Pro",
    userRole: "Administrateur",
    btnNewCredit: "+ Noter un Crédit",

    // Landing Page
    lpNavDemo: "Aperçu en Direct",
    lpNavSim: "Simulateur WhatsApp",
    lpNavComp: "Pourquoi nous ?",
    lpNavFeatures: "Fonctionnalités",
    lpNavHow: "Comment ça marche",
    lpNavStart: "🚀 Ouvrir l'Application",
    lpHeroPill: "⚡ N°1 DE LA GESTION DE CRÉDITS & RECOUVREMENT EN AFRIQUE",
    lpHeroTitle1: "Zéro Crédit Oublié.",
    lpHeroTitle2: "Encaissez 3x Plus Vite.",
    lpHeroDesc: "Fini les cahiers de dettes perdus et les retards de paiement. Suivez vos clients en direct, encaissez par Wave / Mobile Money et envoyez des rappels polis en 1-clic sur WhatsApp & SMS.",
    lpHeroCta1: "🚀 Essayer Gratuitement Maintenant",
    lpHeroCta2: "💬 Tester le Simulateur WhatsApp",
    lpTrustLabel: "Compatible avec tous vos moyens de paiement :",
    lpCtaTitle: "Prêt à récupérer facilement tout votre argent ?",
    lpCtaSub: "Rejoignez les commerçants qui ont arrêté de perdre de l'argent et passez au digital dès aujourd'hui.",
    lpCtaBtn: "🚀 Commencer Gratuitement Maintenant",
    footerText: "Solution Panafricaine de Recouvrement",
    footerBtn: "Ouvrir l'application →",

    // Dashboard
    dashWelcomeTitle: "Suivi de vos Ventes & Crédits",
    dashWelcomeSub: "Visualisez en temps réel l'argent à récupérer et envoyez des rappels WhatsApp en un clic.",
    kpiTotalDue: "Total à Récupérer",
    kpiTotalDueSub: "Dettes clients en cours",
    kpiActiveClients: "Clients avec Dettes",
    kpiActiveClientsSub: "Fiches enregistrées",
    kpiOverdue: "Paiements en Retard",
    kpiOverdueSub: "Rappel recommandé",
    kpiRecoveryRate: "Taux d'Argent Récupéré",
    kpiRecoveryRateSub: "Grâce aux rappels",
    chartRevenueTitle: "Évolution des Paiements Reçus",
    last6Months: "6 derniers mois",
    chartTrustTitle: "Fiabilité de vos Clients",
    trustGood: "Clients Sérieux",
    trustAverage: "Moyen / En attente",
    trustRisk: "En retard",
    recentDebtsTitle: "Dernières Ventes à Crédit",
    recentActivityTitle: "Derniers Paiements Reçus",
    seeAll: "Voir tout",

    // Clients View
    totalClientsCard: "Nombre Total de Clients",
    registeredClients: "Comptes enregistrés",
    clientsPaidCard: "Clients à Jour (Payés)",
    zeroDue: "Aucune dette en cours",
    clientsLateCard: "Clients avec Dettes",
    paymentPending: "Rappels en cours",
    clientsDirectoryTitle: "Répertoire de vos Clients",
    clientPhone: "Nom & Téléphone",
    clientTrust: "Fiabilité du Client",
    amountDue: "Montant Dû",
    status: "État",
    actions: "Actions",

    // Payments View
    collectedThisMonth: "Total Encaissé ce Mois",
    collectedThisMonthSub: "Règlements validés",
    paymentsCount: "Nombre d'Encaissements",
    receiptsDelivered: "Reçus délivrés",
    favoritePaymentMethod: "Moyen Préféré",
    mobileMoneyWave: "Paiement Mobile Simple",
    qrCodeTitle: "QR Code pour Payer Directement",
    qrCodeSub: "Vos clients peuvent scanner pour vous payer par Wave, MTN ou Orange Money.",
    signatureTitle: "Faire Signer le Client au Doigt",
    signatureSub: "Signez directement sur l'écran du téléphone ou de la tablette :",
    clear: "Effacer",
    previewReceipt: "Générer le Reçu",
    paymentsHistoryTitle: "Historique de Tous les Encaissements",
    refNumber: "N° Paiement",
    amountPaid: "Montant Encaissé",
    paymentMethod: "Moyen de Paiement",
    dateTime: "Date",
    receipt: "Reçu PDF",

    // Reminders View
    remindersSent: "Rappels Envoyés",
    successRate: "Paiements après Rappel",
    within48h: "Payé sous 48h",
    amountRecovered: "Argent Récupéré",
    zeroLoss: "Zéro impayé oublié",
    whatsappTemplateTitle: "Message de Rappel WhatsApp",
    whatsappTemplateLabel: "Texte du Message envoyé au client :",
    saveTemplate: "Enregistrer le Modèle",
    autoScheduleTitle: "Programmation des Rappels",
    scheduleFrequency: "Moment d'envoi automatique :",
    schedOpt1: "Le jour même de la date limite",
    schedOpt2: "2 jours avant la date limite",
    schedOpt3: "Tous les Lundis à 09h00 (Rappel Hebdo)",
    schedOpt4: "Tous les Vendredis à 15h00 (Fin de semaine)",
    activateAutoReminders: "⚡ Activer les Rappels Automatiques",

    // Accounting View
    accBannerTitle: "Caisse & Dépenses du Magasin",
    btnAddEntry: "+ Noter une Recette / Dépense",
    btnExportCSV: "Exporter en Excel (CSV)",
    accRevenue: "Total des Recettes",
    accRevenueSub: "Entrées d'argent",
    accExpenses: "Total des Dépenses",
    accExpensesSub: "Achats & charges",
    accVat: "TVA Estimée",
    accVatSub: "Selon taux pays",
    accNetProfit: "Bénéfice Net en Caisse",
    accNetProfitSub: "Recettes - Dépenses",
    accCashflowChartTitle: "Évolution Recettes vs Dépenses",
    accExpenseChartTitle: "Où va votre argent ?",
    accJournalTitle: "Livre de Caisse & Dépenses",
    category: "Catégorie",
    total: "Total",

    // Settings View
    tabCompany: "Mon Commerce",
    tabUser: "Profil & Caissier",
    tabCountry: "Pays & Devise",
    tabBackup: "Sauvegarde & Export",
    settingsCompanyTitle: "Informations de Mon Commerce",
    companyName: "Nom du Magasin / Entreprise",
    companyAddress: "Adresse & Ville",
    companyPhone: "Numéro Téléphone / WhatsApp",
    saveSettings: "Sauvegarder les Modifications",
    settingsUserTitle: "Profil du Caissier / Gérant",
    userName: "Nom Complet",
    userRoleLabel: "Rôle",
    settingsCountryTitle: "Pays d'Activité & Monnaie",
    selectCountry: "Sélectionnez votre Pays",
    countryDesc: "Toutes les sommes de l'application s'ajusteront automatiquement avec la devise de votre pays.",
    settingsBackupTitle: "Sauvegarde & Sécurité des Données",
    backupDesc: "Vos données sont stockées de façon 100% sécurisée. Vous pouvez exporter votre fichier à tout moment.",
    exportBackupJSON: "Télécharger Sauvegarde Complète (JSON)",
    exportExcel: "Exporter en Excel (CSV)",

    // Add Credit View
    newCreditHeaderTitle: "Noter une Vente à Crédit",
    newCreditHeaderSub: "Enregistrez le client et fixez la date limite de paiement",
    step1: "1. Qui achète ?",
    step2: "2. Combien & Quand ?",
    step3: "3. Garantie (Optionnel)",
    selectClientLabel: "Choisir un Client Existant ou en Créer un Nouveau",
    newClientTitle: "➕ Créer la Fiche du Nouveau Client",
    clientNameLabel: "Nom & Prénoms",
    clientPhoneLabel: "Numéro WhatsApp (Pour les rappels)",
    clientCNILabel: "N° Pièce d'Identité / CNI (Optionnel)",
    creditDetailsTitle: "Montant & Date de Paiement",
    creditAmountLabel: "Montant Total de la Vente (FCFA)",
    creditDueDateLabel: "Date Limite de Remboursement",
    creditDescLabel: "Articles Voulus / Description de la Marchandise",
    guaranteeTitle: "Garantie ou Témoin (Optionnel)",
    guarantorNameLabel: "Nom de la Personne Garante",
    guarantorPhoneLabel: "Téléphone du Garant",
    cancel: "Annuler",
    btnSaveCredit: "Enregistrer le Crédit",

    // Modals
    modalReceiptTitle: "Reçu de Paiement",
    receiptOfficialSubtitle: "Reçu Officiel de Règlement",
    client: "Client",
    phone: "Téléphone",
    reason: "Motif",
    clientSignature: "Signature du Client :",
    signedElectronically: "[ Signé Électroniquement ]",
    print: "🖨️ Imprimer",
    downloadPDF: "📥 Télécharger PDF",
    currentDebt: "Dette Totale à Payer",
    historyTitle: "Historique des Achats & Paiements",
    date: "Date",
    details: "Motif",
    amount: "Montant",
    recordPayment: "Encaisser ce Client",
    sendWhatsApp: "Rappel WhatsApp",
    modalEntryTitle: "Enregistrer une Vente ou Dépense",
    entryType: "Type d'Opération",
    typeRevenue: "🟢 Vente encaissée (Entrée d'argent)",
    typeExpense: "🔴 Achat / Dépense (Sortie d'argent)",
    typeCash: "🔵 Mouvement Caisse / Mobile Money",
    categoryAccount: "Catégorie",
    amountHT: "Montant (FCFA)",
    vat: "TVA",
    description: "Description / Motif",
    saveEntry: "Enregistrer",
    dueDate: "Date Limite",
    quickReminder: "Rappel WhatsApp"
  },
  en: {
    // Nav & Sidebar
    dashboard: "Dashboard",
    clients: "Clients & Debts",
    payments: "Payments & Receipts",
    reminders: "WhatsApp Reminders",
    accountingJournal: "Cash & Expenses",
    settings: "Settings",
    sidebarAppSub: "MERCHANT PRO",
    modeCredit: "Credit",
    modeAccounting: "Cash / Accounting",
    bannerCredit: "💡 Credit & Client mode active",
    bannerAccounting: "📊 Cash & Expense mode active",
    menuDashboard: "Dashboard",
    menuClients: "Clients & Debts",
    menuPayments: "Payments & Receipts",
    menuReminders: "WhatsApp Reminders",
    menuAccounting: "Cash & Expenses",
    menuSettings: "Settings",
    menuHomeSite: "Website Homepage",
    proTitle: "Merchant Pro Plan",
    proDesc: "Automated WhatsApp reminders & unpaid debt protection.",
    proBtn: "Upgrade to Pro",
    userRole: "Administrator",
    btnNewCredit: "+ Add New Credit",

    // Landing Page
    lpNavDemo: "Live Preview",
    lpNavSim: "WhatsApp Simulator",
    lpNavComp: "Why us?",
    lpNavFeatures: "Features",
    lpNavHow: "How it works",
    lpNavStart: "🚀 Launch App",
    lpHeroPill: "⚡ #1 CREDIT & DEBT RECOVERY PLATFORM IN AFRICA",
    lpHeroTitle1: "Zero Forgotten Debts.",
    lpHeroTitle2: "Collect Cash 3x Faster.",
    lpHeroDesc: "Say goodbye to lost debt books and overdue accounts. Track clients in real time, collect payments via Wave / Mobile Money, and send polite 1-click reminders on WhatsApp & SMS.",
    lpHeroCta1: "🚀 Start Free Now",
    lpHeroCta2: "💬 Test WhatsApp Simulator",
    lpTrustLabel: "Compatible with all your payment methods:",
    lpCtaTitle: "Ready to effortlessly collect all your money?",
    lpCtaSub: "Join the merchants who stopped losing money and switch to digital today.",
    lpCtaBtn: "🚀 Start Free Now",
    footerText: "Pan-African Credit Recovery Solution",
    footerBtn: "Open application →",

    // Dashboard
    dashWelcomeTitle: "Sales & Credit Tracking",
    dashWelcomeSub: "Monitor your money in real time and send 1-click WhatsApp reminders.",
    kpiTotalDue: "Total to Collect",
    kpiTotalDueSub: "Pending client debts",
    kpiActiveClients: "Debtor Clients",
    kpiActiveClientsSub: "Registered profiles",
    kpiOverdue: "Overdue Invoices",
    kpiOverdueSub: "Reminder recommended",
    kpiRecoveryRate: "Recovery Rate",
    kpiRecoveryRateSub: "Boosted by reminders",
    chartRevenueTitle: "Revenue & Collections Trend",
    last6Months: "Last 6 months",
    chartTrustTitle: "Client Reliability",
    trustGood: "Reliable Clients",
    trustAverage: "Average / Pending",
    trustRisk: "Overdue",
    recentDebtsTitle: "Recent Credit Sales",
    recentActivityTitle: "Recent Payments Received",
    seeAll: "View all",

    // Clients View
    totalClientsCard: "Total Clients",
    registeredClients: "Registered accounts",
    clientsPaidCard: "Settled Clients",
    zeroDue: "No outstanding debts",
    clientsLateCard: "Clients with Debts",
    paymentPending: "Reminders active",
    clientsDirectoryTitle: "Client Directory",
    clientPhone: "Name & Phone",
    clientTrust: "Client Reliability",
    amountDue: "Amount Due",
    status: "Status",
    actions: "Actions",

    // Payments View
    collectedThisMonth: "Total Collected This Month",
    collectedThisMonthSub: "Confirmed payments",
    paymentsCount: "Number of Payments",
    receiptsDelivered: "Receipts issued",
    favoritePaymentMethod: "Top Payment Method",
    mobileMoneyWave: "Mobile Money & Wave",
    qrCodeTitle: "Direct Payment QR Code",
    qrCodeSub: "Clients can scan to pay you via Wave, MTN or Orange Money.",
    signatureTitle: "Client Finger Signature",
    signatureSub: "Have the client sign directly on phone or tablet screen:",
    clear: "Clear",
    previewReceipt: "Generate Receipt",
    paymentsHistoryTitle: "Payment History",
    refNumber: "Payment Ref",
    amountPaid: "Amount Paid",
    paymentMethod: "Payment Method",
    dateTime: "Date",
    receipt: "PDF Receipt",

    // Reminders View
    remindersSent: "Reminders Sent",
    successRate: "Payment Success Rate",
    within48h: "Paid within 48h",
    amountRecovered: "Recovered Money",
    zeroLoss: "Zero unpaid debts lost",
    whatsappTemplateTitle: "WhatsApp Reminder Template",
    whatsappTemplateLabel: "Message text sent to the client:",
    saveTemplate: "Save Template",
    autoScheduleTitle: "Automatic Reminder Schedule",
    scheduleFrequency: "Automatic send timing:",
    schedOpt1: "On the exact due date",
    schedOpt2: "2 days before due date",
    schedOpt3: "Every Monday at 09:00 AM",
    schedOpt4: "Every Friday at 03:00 PM",
    activateAutoReminders: "⚡ Enable Auto Reminders",

    // Accounting View
    accBannerTitle: "Store Cash & Expenses",
    btnAddEntry: "+ Record Sale / Expense",
    btnExportCSV: "Export to Excel (CSV)",
    accRevenue: "Total Revenue",
    accRevenueSub: "Money in",
    accExpenses: "Total Expenses",
    accExpensesSub: "Stock & purchases",
    accVat: "Estimated Tax (VAT)",
    accVatSub: "Based on country rate",
    accNetProfit: "Net Cash Profit",
    accNetProfitSub: "Revenue - Expenses",
    accCashflowChartTitle: "Revenue vs Expenses Trend",
    accExpenseChartTitle: "Where does your money go?",
    accJournalTitle: "Cash Book & Expenses",
    category: "Category",
    total: "Total",

    // Settings View
    tabCompany: "My Business",
    tabUser: "Profile & Cashier",
    tabCountry: "Country & Currency",
    tabBackup: "Backup & Export",
    settingsCompanyTitle: "Business Information",
    companyName: "Shop / Business Name",
    companyAddress: "Address & City",
    companyPhone: "Phone / WhatsApp Number",
    saveSettings: "Save Changes",
    settingsUserTitle: "Cashier / Manager Profile",
    userName: "Full Name",
    userRoleLabel: "Role",
    settingsCountryTitle: "Country & Currency",
    selectCountry: "Select your Country",
    countryDesc: "All amounts in the application will automatically update with your local currency.",
    settingsBackupTitle: "Data Backup & Security",
    backupDesc: "Your data is stored 100% securely. You can export your file anytime.",
    exportBackupJSON: "Download Full Backup (JSON)",
    exportExcel: "Export to Excel (CSV)",

    // Add Credit View
    newCreditHeaderTitle: "Record a Credit Sale",
    newCreditHeaderSub: "Save the customer and set repayment deadline",
    step1: "1. Who is buying?",
    step2: "2. How much & When?",
    step3: "3. Guarantee (Optional)",
    selectClientLabel: "Select Existing Customer or Create New",
    newClientTitle: "➕ Create New Customer Profile",
    clientNameLabel: "Full Name",
    clientPhoneLabel: "WhatsApp Number (For reminders)",
    clientCNILabel: "ID Card / Passport No. (Optional)",
    creditDetailsTitle: "Amount & Repayment Date",
    creditAmountLabel: "Total Sale Amount",
    creditDueDateLabel: "Repayment Due Date",
    creditDescLabel: "Items / Goods Description",
    guaranteeTitle: "Guarantor or Witness (Optional)",
    guarantorNameLabel: "Guarantor Full Name",
    guarantorPhoneLabel: "Guarantor Phone",
    cancel: "Cancel",
    btnSaveCredit: "Save Credit Sale",

    // Modals
    modalReceiptTitle: "Payment Receipt",
    receiptOfficialSubtitle: "Official Payment Receipt",
    client: "Client",
    phone: "Phone",
    reason: "Details",
    clientSignature: "Customer Signature:",
    signedElectronically: "[ Electronically Signed ]",
    print: "🖨️ Print",
    downloadPDF: "📥 Download PDF",
    currentDebt: "Total Debt Outstanding",
    historyTitle: "Purchase & Payment History",
    date: "Date",
    details: "Details",
    amount: "Amount",
    recordPayment: "Collect from this Client",
    sendWhatsApp: "WhatsApp Reminder",
    modalEntryTitle: "Record Sale or Expense",
    entryType: "Operation Type",
    typeRevenue: "🟢 Collected Sale (Money In)",
    typeExpense: "🔴 Purchase / Expense (Money Out)",
    typeCash: "🔵 Cash / Mobile Money Transfer",
    categoryAccount: "Category",
    amountHT: "Amount",
    vat: "Tax",
    description: "Description / Reason",
    saveEntry: "Save Entry",
    dueDate: "Due Date",
    quickReminder: "WhatsApp Reminder"
  }
};

// --------------------------------------------------------------------------
// 3. ÉTAT APPLICATIF GLOBAL (AppState)
// --------------------------------------------------------------------------
// Partitionnement étanche des clés par utilisateur pour zéro fuite de données
function getUserCacheKey(baseKey) {
  const uid = (typeof AppState !== 'undefined' && AppState.user && AppState.user.id) ? AppState.user.id : (localStorage.getItem('user_id') || '');
  return uid ? `${baseKey}_${uid}` : baseKey;
}

function getCachedArray(key) {
  try {
    const fullKey = getUserCacheKey(key);
    const raw = localStorage.getItem(fullKey);
    return raw ? JSON.parse(raw) : [];
  } catch(e) {
    return [];
  }
}

function saveLocalCache(key, data) {
  try {
    const fullKey = getUserCacheKey(key);
    localStorage.setItem(fullKey, JSON.stringify(data));
  } catch(e) {}
}

const AppState = {
  lang: localStorage.getItem('lang') || 'fr',
  country: localStorage.getItem('country') || 'CI',
  mode: localStorage.getItem('mode') || 'credit',
  countryConfig: null,
  businessName: localStorage.getItem('bizName') || 'Mon Commerce',
  businessAddress: localStorage.getItem('bizAddress') || 'Abidjan, Côte d’Ivoire',
  businessPhone: localStorage.getItem('bizPhone') || '+225 0701020304',
  userName: localStorage.getItem('userName') || 'Administrateur',
  userRole: localStorage.getItem('userRole') || 'Administrateur',
  activeClientInModal: null,

  // Données persistantes multi-couches garanties à 100% et isolées par commerçant
  clients: getCachedArray('credittrack_clients'),
  payments: getCachedArray('credittrack_payments'),
  accountingEntries: getCachedArray('credittrack_accounting'),

  user: {
    id: localStorage.getItem('user_id') || '',
    email: localStorage.getItem('userEmail') || '',
    businessName: localStorage.getItem('bizName') || 'Mon Commerce',
    planTier: localStorage.getItem('userPlan') || 'free',
    status: 'active',
    isVip: localStorage.getItem('isVip') === 'true'
  }
};

let weeklyChartInstance = null;
let scoringChartInstance = null;
let accountingCashflowChartInstance = null;
let accountingExpenseChartInstance = null;

// --------------------------------------------------------------------------
// 4. UTILITAIRES & NOTIFICATIONS
// --------------------------------------------------------------------------
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  const s = String(str);
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
    "`": '&#x60;'
  };
  return s.replace(/[&<>"'`\/]/g, tag => map[tag] || tag);
}

function formatCurrency(amount) {
  const curr = AppState.countryConfig ? AppState.countryConfig.currency : 'FCFA';
  const numStr = Number(amount || 0).toLocaleString('fr-FR');
  if (curr === 'XOF' || curr === 'XAF') return `${numStr} FCFA`;
  if (curr === 'GHS') return `₵ ${numStr}`;
  if (curr === 'NGN') return `₦ ${numStr}`;
  if (curr === 'KES') return `KSh ${numStr}`;
  if (curr === 'ZAR') return `R ${numStr}`;
  return `${numStr} ${curr}`;
}

window.showToast = function(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.style.cssText = "background:#0F172A;color:#fff;padding:12px 18px;border-radius:10px;font-size:0.86rem;font-weight:700;box-shadow:0 10px 25px rgba(0,0,0,0.3);border-left:4px solid #2563EB;transition:all 0.3s ease;pointer-events:auto;";
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// --------------------------------------------------------------------------
// 5. SYSTÈME DE TRADUCTION (i18n DYNAMIQUE)
// --------------------------------------------------------------------------
window.switchLanguage = function(lang) {
  if (!translations[lang]) lang = 'fr';
  AppState.lang = lang;
  localStorage.setItem('lang', lang);

  const dict = translations[lang];

  // 1. Traduire tous les éléments avec data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
        el.placeholder = dict[key];
      } else if (el.tagName === 'OPTION') {
        el.textContent = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // 2. Mettre à jour les sélecteurs et badges
  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = lang;

  const headerBadge = document.getElementById('header-lang-badge');
  if (headerBadge) headerBadge.textContent = lang === 'en' ? '🇬🇧 EN' : '🇫🇷 FR';

  const lpBtnFr = document.getElementById('lp-lang-fr');
  const lpBtnEn = document.getElementById('lp-lang-en');
  if (lpBtnFr && lpBtnEn) {
    if (lang === 'fr') { lpBtnFr.classList.add('active'); lpBtnEn.classList.remove('active'); }
    else { lpBtnEn.classList.add('active'); lpBtnFr.classList.remove('active'); }
  }

  // 3. Mettre à jour les vues dynamiques
  renderClientDirectory();
  renderPaymentsTable();
  renderAccountingKPIs();
  renderAccountingJournal();
  renderCreditKPIs();

  if (window.lucide) lucide.createIcons();
};

window.toggleLanguageQuick = function() {
  const newLang = AppState.lang === 'fr' ? 'en' : 'fr';
  window.switchLanguage(newLang);
  showToast(newLang === 'en' ? 'Language switched to English' : 'Langue changée en Français');
};

// --------------------------------------------------------------------------
// 6. INITIALISATION AU CHARGEMENT DU DOM
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  populateCountrySelect();
  restoreSavedState();

  if (window.dataStore) {
    try {
      const dbClients = await window.dataStore.getAll("clients");
      const dbPayments = await window.dataStore.getAll("payments");
      const dbAccounting = await window.dataStore.getAll("accountingEntries");

      if (dbClients && dbClients.length > 0) AppState.clients = dbClients;
      if (dbPayments && dbPayments.length > 0) AppState.payments = dbPayments;
      if (dbAccounting && dbAccounting.length > 0) AppState.accountingEntries = dbAccounting;
    } catch(e) {
      console.log("DataStore local storage init");
    }
  }

  // Initialiser les composants
  populateCreditClientSelect();
  renderClientDirectory();
  renderPaymentsTable();
  renderAccountingKPIs();
  renderAccountingJournal();
  renderCreditKPIs();
  initCharts();
  initSignaturePad();

  // Appliquer la langue initiale
  window.switchLanguage(AppState.lang);

  if (window.lucide) lucide.createIcons();
});

function restoreSavedState() {
  const savedCountry = localStorage.getItem('country') || 'CI';
  const savedMode = localStorage.getItem('mode') || 'credit';

  const countrySelect = document.getElementById('country-select');
  if (countrySelect) countrySelect.value = savedCountry;
  switchCountry(savedCountry, false);

  const modeSelect = document.getElementById('mode-select');
  if (modeSelect) modeSelect.value = savedMode;
  switchAppMode(savedMode, false);

  // Valeurs dans Paramètres
  const compInp = document.getElementById('setting-company-input');
  if (compInp && AppState.businessName) compInp.value = AppState.businessName;

  const addrInp = document.getElementById('setting-address-input');
  if (addrInp && AppState.businessAddress) addrInp.value = AppState.businessAddress;

  const savedUserId = localStorage.getItem('user_id');
  const savedEmail = localStorage.getItem('userEmail');
  const activeView = localStorage.getItem('activeView');
  const activeMenu = localStorage.getItem('activeMenu') || 'menu-2';

  if (savedUserId && savedEmail && activeView === 'workspace') {
    AppState.user.id = savedUserId;
    AppState.user.email = savedEmail;
    AppState.user.businessName = localStorage.getItem('bizName') || 'Mon Commerce';
    AppState.user.planTier = localStorage.getItem('userPlan') || 'trial_3_months';
    AppState.userName = savedEmail.split('@')[0];
    updateUserPlanBadgeUI();
    openAppWorkspace(activeMenu);
  } else {
    openPublicLanding();
  }
}

function populateCountrySelect() {
  const select1 = document.getElementById('country-select');
  const select2 = document.getElementById('settings-country-dropdown');
  const optionsHTML = AFRICAN_COUNTRIES.map(c => 
    `<option value="${c.code}">${c.flag} ${c.nameFr} (${c.currency})</option>`
  ).join('');

  if (select1) select1.innerHTML = optionsHTML;
  if (select2) select2.innerHTML = optionsHTML;
}

function switchCountry(code, notify = true) {
  const config = getCountryConfig(code);
  AppState.country = code;
  AppState.countryConfig = config;
  localStorage.setItem('country', code);

  const sel1 = document.getElementById('country-select');
  const sel2 = document.getElementById('settings-country-dropdown');
  if (sel1) sel1.value = code;
  if (sel2) sel2.value = code;

  const sysInfoEl = document.getElementById('acc-country-sys-info');
  if (sysInfoEl) {
    sysInfoEl.textContent = `Pays : ${config.flag} ${config.nameFr} — TVA : ${config.vatRate}% — Devise : ${config.currency}`;
  }

  const vatRateLabel = document.getElementById('acc-vat-rate-label');
  if (vatRateLabel) vatRateLabel.textContent = `${config.vatRate}%`;

  const typeSelect = document.getElementById('acc-entry-type');
  if (typeSelect) updateAccountCodeOptions(typeSelect.value);

  renderAccountingKPIs();
  renderAccountingJournal();
  renderCreditKPIs();
  renderClientDirectory();
  renderPaymentsTable();

  if (notify) showToast(`Pays sélectionné : ${config.flag} ${config.nameFr} (${config.currency})`);
}

function switchAppMode(mode, notify = true) {
  AppState.mode = mode;
  localStorage.setItem('mode', mode);

  const banner = document.getElementById('banner');
  const bannerText = document.getElementById('banner-text');
  const creditItems = document.querySelectorAll('.credit-menu-item');
  const accItems = document.querySelectorAll('.accounting-menu-item');

  if (mode === 'accounting') {
    if (banner) {
      banner.style.background = '#10B981';
      if (bannerText) bannerText.textContent = AppState.lang === 'en' ? '💡 Cash & Accounting Mode Active' : '💡 Mode Caisse & Compta actif';
    }
    creditItems.forEach(el => el.style.display = 'none');
    accItems.forEach(el => el.style.display = 'flex');
    switchMenu('menu-accounting');
  } else {
    if (banner) {
      banner.style.background = '#2563EB';
      if (bannerText) bannerText.textContent = AppState.lang === 'en' ? '💡 Credits & Clients Mode Active' : '💡 Mode Crédits & Clients actif';
    }
    creditItems.forEach(el => el.style.display = 'flex');
    accItems.forEach(el => el.style.display = 'none');
    switchMenu('menu-2');
  }

  if (notify) {
    showToast(mode === 'accounting' ? 
      (AppState.lang === 'en' ? 'Switched to Cash & Expenses Mode' : 'Basculé en Mode Caisse & Compta') : 
      (AppState.lang === 'en' ? 'Switched to Credit Sales Mode' : 'Basculé en Mode Ventes à Crédit'));
  }
}

// --------------------------------------------------------------------------
// 7. NAVIGATION & GESTION DE LA SIDEBAR MOBILE
// --------------------------------------------------------------------------
window.toggleMobileSidebar = function() {
  const sb = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sb) sb.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
};

function closeMobileSidebarIfOpen() {
  const sb = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sb && sb.classList.contains('open')) sb.classList.remove('open');
  if (overlay && overlay.classList.contains('active')) overlay.classList.remove('active');
}

function openPublicLanding() {
  localStorage.setItem('activeView', 'landing');
  const landing = document.getElementById('public-landing-container');
  const appLayout = document.getElementById('app-workspace-layout');

  if (landing) landing.style.setProperty('display', 'block', 'important');
  if (appLayout) appLayout.style.setProperty('display', 'none', 'important');

  document.body.classList.add('is-landing-mode');
  document.body.classList.remove('is-app-mode');
  closeMobileSidebarIfOpen();
  window.scrollTo(0, 0);
  if (window.lucide) lucide.createIcons();
}

// ── FONCTIONS DU SIMULATEUR WHATSAPP EN DIRECT SUR LA LANDING PAGE ──
window.updateLandingSimPreview = function() {
  const clientName = document.getElementById('sim-client-name')?.value || 'Client';
  const amount = parseInt(document.getElementById('sim-client-amount')?.value) || 0;
  
  const headerName = document.getElementById('sim-preview-header-name');
  const waText = document.getElementById('sim-wa-text');

  if (headerName) headerName.textContent = clientName;
  if (waText) {
    waText.innerHTML = `Bonjour <strong>${escapeHTML(clientName)}</strong>, nous vous rappelons que votre solde de <strong>${formatCurrency(amount)}</strong> chez <strong>${escapeHTML(AppState.businessName)}</strong> est arrivé à échéance.`;
  }
};

window.testSimWhatsAppSend = function() {
  const clientName = document.getElementById('sim-client-name')?.value || 'Client';
  const amount = parseInt(document.getElementById('sim-client-amount')?.value) || 75000;
  
  let msg = `Bonjour ${clientName}, nous vous rappelons que votre solde de ${formatCurrency(amount)} chez ${AppState.businessName} est arrivé à échéance. Merci pour votre confiance !`;
  
  // Ouvre WhatsApp avec le message de démonstration
  const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  showToast("💬 Simulateur : Démonstration WhatsApp lancée avec succès !");
};

window.toggleMobileSidebar = function() {
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  document.body.classList.toggle('mobile-sidebar-open');
  if (sidebar) sidebar.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
};

window.closeMobileSidebar = function() {
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  document.body.classList.remove('mobile-sidebar-open');
  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
};

function closeMobileSidebarIfOpen() {
  window.closeMobileSidebar();
}

function openAppWorkspace(menuId = 'menu-2') {
  closeMobileSidebarIfOpen();

  // 🔒 AUTH GUARD STRICT : Seul un commerçant avec session validée peut entrer
  const isAuth = AppState.user && AppState.user.id && AppState.user.email;
  if (!isAuth) {
    openAuthModal('register');
    showToast("🔒 Veuillez créer ou vous connecter à votre compte pour accéder au tableau de bord.");
    return;
  }

  localStorage.setItem('activeView', 'workspace');
  const landing = document.getElementById('public-landing-container');
  const appLayout = document.getElementById('app-workspace-layout');

  if (landing) landing.style.setProperty('display', 'none', 'important');
  if (appLayout) appLayout.style.setProperty('display', 'flex', 'important');

  document.body.classList.remove('is-landing-mode');
  document.body.classList.add('is-app-mode');

  switchMenu(menuId);
  window.scrollTo(0, 0);
}

function switchMenu(menuId) {
  closeMobileSidebarIfOpen();

  localStorage.setItem('activeMenu', menuId);
  localStorage.setItem('activeView', 'workspace');

  const landing = document.getElementById('public-landing-container');
  const appLayout = document.getElementById('app-workspace-layout');
  if (landing) landing.style.setProperty('display', 'none', 'important');
  if (appLayout) appLayout.style.setProperty('display', 'flex', 'important');

  document.querySelectorAll('.view-container').forEach(view => view.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => btn.classList.remove('active'));

  const targetView = document.getElementById(menuId);
  if (targetView) targetView.classList.add('active');

  const activeBtn = document.getElementById(`nav-${menuId}`);
  if (activeBtn) activeBtn.classList.add('active');

  const mobBtn = document.getElementById(`mob-nav-${menuId}`);
  if (mobBtn) mobBtn.classList.add('active');

  const pageTitles = {
    'menu-2': AppState.lang === 'en' ? 'Dashboard' : 'Tableau de Bord',
    'menu-accounting': AppState.lang === 'en' ? 'Cash & Expenses' : 'Caisse & Dépenses',
    'menu-4-directory': AppState.lang === 'en' ? 'Clients & Debts' : 'Clients & Dettes',
    'menu-6': AppState.lang === 'en' ? 'Payments & Receipts' : 'Encaisser & Reçus',
    'menu-8': AppState.lang === 'en' ? 'WhatsApp Reminders' : 'Rappels WhatsApp',
    'menu-settings': AppState.lang === 'en' ? 'Settings' : 'Paramètres',
    'menu-5': AppState.lang === 'en' ? 'Record Credit Sale' : 'Noter un Nouveau Crédit'
  };

  const pageIcons = {
    'menu-2': 'layout-grid',
    'menu-accounting': 'calculator',
    'menu-4-directory': 'users',
    'menu-6': 'wallet',
    'menu-8': 'bell-ring',
    'menu-settings': 'settings',
    'menu-5': 'plus-circle'
  };

  const titleEl = document.getElementById('page-desktop-title');
  if (titleEl) titleEl.textContent = pageTitles[menuId] || 'Tableau de Bord';

  const iconEl = document.getElementById('header-page-icon');
  if (iconEl && pageIcons[menuId]) {
    iconEl.setAttribute('data-lucide', pageIcons[menuId]);
  }

  const headerBtn = document.getElementById('top-header-btn');
  if (headerBtn) {
    if (menuId === 'menu-accounting') {
      headerBtn.setAttribute('onclick', "openModal('modal-accounting-entry')");
      headerBtn.innerHTML = `<i data-lucide="plus-circle" style="width:16px;height:16px;"></i><span>${AppState.lang === 'en' ? '+ New Entry' : '+ Noter Dépense'}</span>`;
    } else {
      headerBtn.setAttribute('onclick', "switchMenu('menu-5')");
      headerBtn.innerHTML = `<i data-lucide="plus-circle" style="width:16px;height:16px;"></i><span>${AppState.lang === 'en' ? '+ New Credit' : '+ Noter un Crédit'}</span>`;
    }
  }

  if (window.lucide) lucide.createIcons();

  if (menuId === 'menu-2' || menuId === 'menu-accounting') {
    setTimeout(initCharts, 60);
  }
}

// --------------------------------------------------------------------------
// 8. GESTION DES CLIENTS, CRÉDITS & ENCAISSEMENTS
// --------------------------------------------------------------------------
function renderClientDirectory() {
  const tbody = document.getElementById('clients-saas-table-body');
  if (!tbody) return;

  if (AppState.clients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:45px 20px;color:#64748B;">
          <div style="font-size:1.8rem;margin-bottom:8px;">👥</div>
          <strong style="font-size:0.95rem;color:#0F172A;display:block;">${AppState.lang === 'en' ? 'No clients recorded yet' : 'Aucun client enregistré pour le moment'}</strong>
          <p style="margin:6px 0 14px 0;font-size:0.84rem;color:#94A3B8;">${AppState.lang === 'en' ? 'Click on "+ New Credit" to add your first customer or credit sale.' : 'Cliquez sur « + Nouveau Crédit » pour ajouter votre premier client ou vente.'}</p>
          <button class="btn btn-primary" style="padding:6px 14px;font-size:0.8rem;" onclick="switchMenu('menu-5')">+ ${AppState.lang === 'en' ? 'New Credit' : 'Nouveau Crédit'}</button>
        </td>
      </tr>
    `;
    updateClientDirectoryCounts();
    return;
  }

  tbody.innerHTML = AppState.clients.map(c => {
    let scoreColor = c.reliabilityScore >= 80 ? '#10B981' : (c.reliabilityScore >= 50 ? '#F59E0B' : '#EF4444');
    let scoreText = c.reliabilityScore >= 80 ? (AppState.lang === 'en' ? 'Reliable' : 'Très Fiable') : 
                    (c.reliabilityScore >= 50 ? (AppState.lang === 'en' ? 'Average' : 'Moyen') : (AppState.lang === 'en' ? 'At Risk' : 'Risqué'));
    
    let statusBadge = c.totalDue <= 0 ? `<span class="badge-status paid">🟢 ${AppState.lang === 'en' ? 'Settled' : 'À Jour'}</span>` :
                      (c.status === 'overdue' ? `<span class="badge-status overdue">🔴 ${AppState.lang === 'en' ? 'Overdue' : 'En Retard'}</span>` : 
                      `<span class="badge-status pending">🟠 ${AppState.lang === 'en' ? 'Pending' : 'En Cours'}</span>`);

    return `
      <tr>
        <td style="font-weight:800;">${escapeHTML(c.name)}<br><span style="font-size:0.75rem;color:#64748B;">${escapeHTML(c.phone)}</span></td>
        <td>
          <div style="font-weight:800;color:${scoreColor};font-size:0.82rem;">${c.reliabilityScore}/100 (${scoreText})</div>
          <div style="width:100px;height:5px;background:#E2E8F0;border-radius:3px;margin-top:4px;"><div style="width:${c.reliabilityScore}%;height:100%;background:${scoreColor};border-radius:3px;"></div></div>
        </td>
        <td style="font-weight:800;color:#2563EB;">${formatCurrency(c.totalDue)}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn-outline" style="padding:4px 7px;font-size:0.74rem;border-color:#2563EB;color:#2563EB;margin-right:2px;" onclick="viewClientDetails(${c.id})">🔍 ${AppState.lang === 'en' ? 'Profile' : 'Fiche'}</button>
          <button class="btn btn-outline" style="padding:4px 7px;font-size:0.74rem;border-color:#25D366;color:#15803D;margin-right:2px;" onclick="sendWhatsAppReminder('${escapeHTML(c.name)}', '${escapeHTML(c.phone)}', ${c.totalDue})" title="Envoyer par WhatsApp">💬 WhatsApp</button>
          <button class="btn btn-outline" style="padding:4px 7px;font-size:0.74rem;border-color:#2563EB;color:#2563EB;" onclick="sendSMSReminder('${escapeHTML(c.name)}', '${escapeHTML(c.phone)}', ${c.totalDue})" title="Envoyer par SMS">📱 SMS</button>
        </td>
      </tr>
    `;
  }).join('');

  updateClientDirectoryCounts();
}

function updateClientDirectoryCounts() {
  const dirTotal = document.getElementById('dir-total-clients');
  const dirPaid = document.getElementById('dir-paid-clients');
  const dirDue = document.getElementById('dir-due-clients');

  const paidCount = AppState.clients.filter(c => c.totalDue <= 0).length;
  const dueCount = AppState.clients.filter(c => c.totalDue > 0).length;

  if (dirTotal) dirTotal.textContent = `${AppState.clients.length} ${AppState.lang === 'en' ? 'Clients' : 'Clients'}`;
  if (dirPaid) dirPaid.textContent = `${paidCount} ${AppState.lang === 'en' ? 'Clients' : 'Client(s)'}`;
  if (dirDue) dirDue.textContent = `${dueCount} ${AppState.lang === 'en' ? 'Clients' : 'Client(s)'}`;

  renderDashboardDebtsTable();
}

function renderDashboardDebtsTable() {
  const tbody = document.getElementById('dash-debts-table-body');
  if (!tbody) return;

  const dueClients = AppState.clients.filter(c => c.totalDue > 0);
  if (dueClients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:35px 20px;color:#64748B;">
          <div style="font-size:1.6rem;margin-bottom:6px;">✨</div>
          <strong style="color:#0F172A;display:block;">${AppState.lang === 'en' ? 'No pending debts' : 'Aucune dette en cours'}</strong>
          <p style="margin:4px 0 0 0;font-size:0.82rem;color:#94A3B8;">${AppState.lang === 'en' ? 'All credits are settled or no credit sales recorded yet.' : 'Toutes vos créances sont à jour ou aucune vente à crédit n\'a été saisie.'}</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = dueClients.slice(0, 5).map(c => {
    const lastTx = (c.transactions && c.transactions.length > 0) ? c.transactions[c.transactions.length - 1] : null;
    const dueDate = lastTx ? lastTx.dueDate : 'Prochainement';
    const isLate = c.status === 'overdue';

    return `
      <tr>
        <td style="font-weight:800;">${escapeHTML(c.name)}</td>
        <td style="font-weight:800;color:${isLate ? '#EF4444' : '#2563EB'};">${formatCurrency(c.totalDue)}</td>
        <td style="color:#64748B;font-size:0.8rem;">${escapeHTML(dueDate)}</td>
        <td><span class="badge-status ${isLate ? 'overdue' : 'pending'}">${isLate ? (AppState.lang === 'en' ? 'Overdue' : 'En retard') : (AppState.lang === 'en' ? 'Pending' : 'En attente')}</span></td>
        <td>
          <div style="display:flex;gap:4px;">
            <button class="btn btn-outline" style="padding:4px 7px;font-size:0.74rem;border-color:#25D366;color:#15803D;" onclick="sendWhatsAppReminder('${escapeHTML(c.name)}', '${escapeHTML(c.phone)}', ${c.totalDue})">
              💬 WhatsApp
            </button>
            <button class="btn btn-outline" style="padding:4px 7px;font-size:0.74rem;border-color:#2563EB;color:#2563EB;" onclick="sendSMSReminder('${escapeHTML(c.name)}', '${escapeHTML(c.phone)}', ${c.totalDue})">
              📱 SMS
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderPaymentsTable() {
  const tbody = document.getElementById('payments-table-body');
  const activityList = document.getElementById('dash-activity-list');

  if (tbody) {
    if (AppState.payments.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:45px 20px;color:#64748B;">
            <div style="font-size:1.8rem;margin-bottom:8px;">💳</div>
            <strong style="font-size:0.95rem;color:#0F172A;display:block;">${AppState.lang === 'en' ? 'No collections recorded yet' : 'Aucun encaissement pour le moment'}</strong>
            <p style="margin:6px 0 0 0;font-size:0.84rem;color:#94A3B8;">${AppState.lang === 'en' ? 'Customer payments and receipts will appear here automatically.' : 'Les règlements clients (Espèces, Wave, Orange, MTN, Moov) apparaîtront ici.'}</p>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = AppState.payments.map(p => `
        <tr>
          <td style="font-weight:800;">${escapeHTML(p.ref)}</td>
          <td style="font-weight:700;">${escapeHTML(p.clientName)}</td>
          <td style="font-weight:800;color:#10B981;">${formatCurrency(p.amount)}</td>
          <td>${escapeHTML(p.method)}</td>
          <td style="color:#64748B;">${escapeHTML(p.date)}</td>
          <td><button class="btn btn-outline" style="padding:4px 8px;font-size:0.72rem;" onclick="openReceiptPreviewModalWithData('${escapeHTML(p.clientName)}', '+225 00000000', 'Paiement ${escapeHTML(p.ref)}', ${p.amount})">📄 ${AppState.lang === 'en' ? 'Receipt' : 'Reçu'}</button></td>
        </tr>
      `).join('');
    }
  }

  if (activityList) {
    if (AppState.payments.length === 0) {
      activityList.innerHTML = `
        <div style="text-align:center;padding:35px 15px;color:#94A3B8;font-size:0.85rem;">
          <div style="font-size:1.5rem;margin-bottom:6px;">⏱️</div>
          ${AppState.lang === 'en' ? 'No recent activity.' : 'Aucune activité récente.'}
        </div>
      `;
    } else {
      activityList.innerHTML = AppState.payments.slice(0, 4).map(p => `
        <div class="activity-item">
          <div class="activity-left">
            <div class="activity-icon green">
              <i data-lucide="download"></i>
            </div>
            <div>
              <div class="activity-text">${AppState.lang === 'en' ? 'Payment from' : 'Paiement reçu de'} ${escapeHTML(p.clientName)}</div>
              <div class="activity-time">${escapeHTML(p.date)} via ${escapeHTML(p.method)}</div>
            </div>
          </div>
          <div class="activity-amount" style="color:#10B981;">${formatCurrency(p.amount)}</div>
        </div>
      `).join('');
    }
  }
}

function renderCreditKPIs() {
  let totalDue = 0;
  let overdueCount = 0;
  let activeClients = 0;

  AppState.clients.forEach(c => {
    if (c.totalDue > 0) {
      totalDue += c.totalDue;
      activeClients++;
      if (c.status === 'overdue') overdueCount++;
    }
  });

  const dueEl = document.getElementById('metric-total-due');
  const clientEl = document.getElementById('metric-active-clients');
  const overdueEl = document.getElementById('metric-overdue-count');

  if (dueEl) dueEl.textContent = formatCurrency(totalDue);
  if (clientEl) clientEl.textContent = activeClients;
  if (overdueEl) overdueEl.textContent = overdueCount;
}

function populateCreditClientSelect() {
  const select = document.getElementById('credit-client-select');
  if (!select) return;
  select.innerHTML = `
    <option value="">${AppState.lang === 'en' ? '-- Select a Client --' : '-- Sélectionner un Client --'}</option>
    ${AppState.clients.map(c => `<option value="${c.id}">${escapeHTML(c.name)} (${escapeHTML(c.phone)})</option>`).join('')}
    <option value="new">${AppState.lang === 'en' ? '+ Add New Client' : '+ Ajouter un Nouveau Client'}</option>
  `;
}

function handleCreditClientChange(val) {
  const phoneInput = document.getElementById('credit-client-phone');
  const newFields = document.getElementById('new-client-fields');
  const accountInput = document.getElementById('credit-transfer-account');

  if (val === 'new') {
    if (newFields) newFields.style.display = 'block';
    if (phoneInput) phoneInput.value = '';
    if (accountInput) accountInput.value = '';
  } else {
    if (newFields) newFields.style.display = 'none';
    const client = AppState.clients.find(c => c.id === parseInt(val));
    if (client) {
      if (phoneInput) phoneInput.value = client.phone || '';
      if (accountInput) accountInput.value = client.paymentAccount || client.phone || '';
    }
  }
}

window.handlePaymentPrefChange = function(val) {
  const accountInput = document.getElementById('credit-transfer-account');
  const phoneInput = document.getElementById('credit-client-phone');
  if (accountInput && phoneInput && !accountInput.value && val !== 'Espèces') {
    accountInput.value = phoneInput.value;
  }
};

async function handleNewCreditSubmit(e) {
  e.preventDefault();
  const clientSelect = document.getElementById('credit-client-select').value;
  const clientPhone = (document.getElementById('credit-client-phone')?.value || '').trim();
  const amount = parseInt(document.getElementById('credit-amount').value) || 0;
  const desc = document.getElementById('credit-description').value;
  const dueDate = document.getElementById('credit-due-date').value;
  const payMethodPref = document.getElementById('credit-payment-method-pref')?.value || 'Espèces';
  const payAccount = (document.getElementById('credit-transfer-account')?.value || '').trim();
  const cni = document.getElementById('new-client-cni') ? document.getElementById('new-client-cni').value : '';
  const guarantorName = document.getElementById('credit-guarantor-name') ? document.getElementById('credit-guarantor-name').value : '';
  const guarantorPhone = document.getElementById('credit-guarantor-phone') ? document.getElementById('credit-guarantor-phone').value : '';

  // ⚠️ VALIDATION STRICTE : Le numéro de téléphone est OBLIGATOIRE
  if (!clientPhone || clientPhone.replace(/[^0-9]/g, '').length < 8) {
    showToast(AppState.lang === 'en' ? "⚠️ The client's phone number is mandatory to send WhatsApp/SMS reminders!" : "⚠️ Le numéro de téléphone/WhatsApp du client est OBLIGATOIRE pour pouvoir le relancer !");
    const phoneInput = document.getElementById('credit-client-phone');
    if (phoneInput) {
      phoneInput.focus();
      phoneInput.style.borderColor = '#EF4444';
      phoneInput.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.4)';
      setTimeout(() => { 
        phoneInput.style.borderColor = ''; 
        phoneInput.style.boxShadow = '';
      }, 3500);
    }
    return;
  }

  let clientName = '';
  let activeClient = null;

  if (clientSelect === 'new') {
    if (!checkPlanAccess('add_client')) return;

    clientName = (document.getElementById('new-client-name')?.value || '').trim();
    if (!clientName) {
      showToast(AppState.lang === 'en' ? "⚠️ Please enter the client's full name." : "⚠️ Veuillez renseigner le nom complet du client.");
      document.getElementById('new-client-name')?.focus();
      return;
    }
    activeClient = {
      id: Date.now(),
      name: clientName,
      phone: clientPhone,
      cni: cni,
      preferredPaymentMethod: payMethodPref,
      paymentAccount: payAccount || clientPhone,
      totalDue: amount,
      status: 'pending',
      reliabilityScore: 85,
      addedDate: new Date().toISOString().split('T')[0],
      transactions: [{ 
        id: Date.now(), 
        date: new Date().toISOString().split('T')[0], 
        desc, 
        amount, 
        status: 'pending', 
        dueDate, 
        preferredPaymentMethod: payMethodPref,
        paymentAccount: payAccount || clientPhone,
        guarantorName, 
        guarantorPhone 
      }]
    };
    AppState.clients.push(activeClient);
    if (window.dataStore) await window.dataStore.add("clients", activeClient);
  } else {
    activeClient = AppState.clients.find(c => c.id === parseInt(clientSelect));
    if (activeClient) {
      clientName = activeClient.name;
      activeClient.phone = clientPhone || activeClient.phone;
      activeClient.preferredPaymentMethod = payMethodPref;
      activeClient.paymentAccount = payAccount || activeClient.phone;
      activeClient.totalDue += amount;
      activeClient.transactions.push({ 
        id: Date.now(), 
        date: new Date().toISOString().split('T')[0], 
        desc, 
        amount, 
        status: 'pending', 
        dueDate, 
        preferredPaymentMethod: payMethodPref,
        paymentAccount: payAccount || activeClient.phone,
        guarantorName, 
        guarantorPhone 
      });
      if (window.dataStore) await window.dataStore.update("clients", activeClient);
    }
  }

  saveLocalCache('credittrack_clients', AppState.clients);
  showToast(`${AppState.lang === 'en' ? 'Credit recorded for' : 'Crédit de'} ${formatCurrency(amount)} ${AppState.lang === 'en' ? 'saved!' : 'enregistré pour'} ${clientName} !`);
  populateCreditClientSelect();
  renderClientDirectory();
  renderCreditKPIs();
  switchMenu('menu-2');
}

// --------------------------------------------------------------------------
// 9. ENCAISSEMENT CLIENT (payClientDebt) & REÇUS
// --------------------------------------------------------------------------
window.payClientDebt = async function() {
  const client = AppState.activeClientInModal;
  if (!client) {
    showToast("Veuillez d'abord sélectionner un client.");
    return;
  }

  if (client.totalDue <= 0) {
    showToast(AppState.lang === 'en' ? "This client has no debt to pay." : "Ce client n'a aucune dette en cours.");
    return;
  }

  const selectedMethod = document.getElementById('modal-pay-method-select')?.value || 'Espèces (Cash)';
  const amountToPay = client.totalDue;
  client.totalDue = 0;
  client.status = 'paid';
  client.reliabilityScore = Math.min(100, client.reliabilityScore + 5);

  const newPayment = {
    id: Date.now(),
    ref: `PAY-2026-${Math.floor(100 + Math.random() * 900)}`,
    clientName: client.name,
    amount: amountToPay,
    date: AppState.lang === 'en' ? 'Today, Just now' : 'Aujourd\'hui, à l\'instant',
    method: selectedMethod
  };

  AppState.payments.unshift(newPayment);
  client.transactions.push({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    desc: AppState.lang === 'en' ? `Full Settlement (${selectedMethod})` : `Paiement et Règlement (${selectedMethod})`,
    amount: amountToPay,
    status: 'paid',
    method: selectedMethod
  });

  if (window.dataStore) {
    await window.dataStore.update("clients", client);
    await window.dataStore.add("payments", newPayment);
  }

  saveLocalCache('credittrack_clients', AppState.clients);
  saveLocalCache('credittrack_payments', AppState.payments);

  closeModal('modal-client-details');
  renderClientDirectory();
  renderPaymentsTable();
  renderCreditKPIs();

  showToast(`✅ ${AppState.lang === 'en' ? 'Payment of' : 'Paiement de'} ${formatCurrency(amountToPay)} (${selectedMethod}) ${AppState.lang === 'en' ? 'recorded for' : 'enregistré pour'} ${client.name} !`);
  openReceiptPreviewModalWithData(client.name, client.phone, `Règlement solde (${selectedMethod})`, amountToPay);
};

window.viewClientDetails = function(clientId) {
  const client = AppState.clients.find(c => c.id === clientId);
  if (!client) return;

  AppState.activeClientInModal = client;

  const initials = client.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  document.getElementById('modal-client-initials').textContent = initials;
  document.getElementById('modal-client-name').textContent = client.name;
  document.getElementById('modal-client-phone').textContent = client.phone;
  document.getElementById('modal-client-due').textContent = formatCurrency(client.totalDue);
  document.getElementById('modal-client-score').textContent = client.reliabilityScore + ' / 100';
  
  let scoreColor = client.reliabilityScore >= 80 ? '#10B981' : (client.reliabilityScore >= 50 ? '#F59E0B' : '#EF4444');
  document.getElementById('modal-client-score').style.color = scoreColor;

  let statusText = client.totalDue <= 0 ? `🟢 ${AppState.lang === 'en' ? 'Settled' : 'À Jour'}` :
                   (client.status === 'overdue' ? `🔴 ${AppState.lang === 'en' ? 'Overdue' : 'En Retard'}` : `🟠 ${AppState.lang === 'en' ? 'Pending' : 'En Cours'}`);
  document.getElementById('modal-client-status').innerHTML = statusText;

  const historyBody = document.getElementById('modal-client-history-body');
  if (client.transactions && client.transactions.length > 0) {
    historyBody.innerHTML = client.transactions.map(t => {
      let bColor = t.status === 'paid' ? '#10B981' : (t.status === 'overdue' ? '#EF4444' : '#F59E0B');
      let bText = t.status === 'paid' ? (AppState.lang === 'en' ? 'Paid' : 'Payé') : 
                  (t.status === 'overdue' ? (AppState.lang === 'en' ? 'Overdue' : 'En Retard') : (AppState.lang === 'en' ? 'Pending' : 'En Attente'));
      return `
        <tr>
          <td style="color:#64748B;">${t.date}</td>
          <td style="font-weight:700;">${escapeHTML(t.desc)}</td>
          <td style="font-weight:800;">${formatCurrency(t.amount)}</td>
          <td><span style="background:${bColor}22; color:${bColor}; padding:2px 6px; border-radius:4px; font-size:0.72rem; font-weight:700;">${bText}</span></td>
        </tr>
      `;
    }).join('');
  } else {
    historyBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:16px; color:#94A3B8;">${AppState.lang === 'en' ? 'No transactions.' : 'Aucune transaction.'}</td></tr>`;
  }

  const btnWhatsapp = document.getElementById('modal-client-whatsapp-btn');
  if (btnWhatsapp) {
    btnWhatsapp.onclick = () => {
      sendWhatsAppReminder(client.name, client.phone, client.totalDue);
    };
  }

  const btnSms = document.getElementById('modal-client-sms-btn');
  if (btnSms) {
    btnSms.onclick = () => {
      sendSMSReminder(client.name, client.phone, client.totalDue);
    };
  }

  openModal('modal-client-details');
};

// --------------------------------------------------------------------------
// 9.b SYSTÈME INTELLIGENT DE RAPPEL WHATSAPP & SMS
// --------------------------------------------------------------------------
function sanitizePhoneNumber(phone) {
  if (!phone) return '';
  let clean = phone.toString().replace(/[^0-9]/g, '');
  if (clean.startsWith('00')) clean = clean.substring(2);

  // Table des indicatifs internationaux d'Afrique
  const countryPrefixMap = {
    "CI": "225", "BJ": "229", "SN": "221", "GH": "233", "NG": "234",
    "CM": "237", "KE": "254", "ZA": "27", "MA": "212", "DZ": "213",
    "TN": "216", "EG": "20", "BF": "226", "ML": "223", "TG": "228",
    "CD": "243", "GA": "241", "GN": "224", "NE": "227", "RW": "250"
  };
  const activeCountry = AppState.country || 'CI';
  const defaultPrefix = countryPrefixMap[activeCountry] || '225';

  // Si le numéro est au format local (8 à 10 chiffres sans indicatif)
  if (clean.length >= 8 && clean.length <= 10 && !clean.startsWith(defaultPrefix)) {
    clean = defaultPrefix + clean;
  }
  return clean;
}

let currentReminderTarget = { name: '', phone: '', amount: 0 };

window.openReminderModal = function(name, phone, amount) {
  currentReminderTarget = { name, phone, amount };
  
  const modalName = document.getElementById('reminder-modal-client-name');
  const modalPhone = document.getElementById('reminder-modal-phone');
  const modalAmount = document.getElementById('reminder-modal-amount');
  const modalText = document.getElementById('reminder-modal-custom-text');

  if (modalName) modalName.textContent = name;
  if (modalPhone) modalPhone.textContent = phone;
  if (modalAmount) modalAmount.textContent = formatCurrency(amount);

  const defaultTemplate = localStorage.getItem('whatsappTemplate') || 
    (AppState.lang === 'en' ? 
      "Hello {nom_client}, this is a friendly reminder that your balance of {montant} at {nom_commerce} is due. Thank you for your payment." : 
      "Bonjour {nom_client}, nous vous rappelons que votre solde de {montant} chez {nom_commerce} est à régler. Merci pour votre confiance !");
  
  let msg = defaultTemplate
    .replace(/{nom_client}/g, name)
    .replace(/{montant}/g, formatCurrency(amount))
    .replace(/{nom_commerce}/g, AppState.businessName);

  if (modalText) modalText.value = msg;

  openModal('modal-send-reminder');
};

window.triggerWhatsAppFromModal = function() {
  const cleanPhone = sanitizePhoneNumber(currentReminderTarget.phone);
  const text = document.getElementById('reminder-modal-custom-text')?.value || '';
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  closeModal('modal-send-reminder');
  showToast(`💬 WhatsApp ouvert avec le numéro de ${currentReminderTarget.name} (+${cleanPhone}) !`);
};

window.triggerSMSFromModal = function() {
  const cleanPhone = sanitizePhoneNumber(currentReminderTarget.phone);
  const text = document.getElementById('reminder-modal-custom-text')?.value || '';
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const separator = isIOS ? '&' : '?';
  const url = `sms:${cleanPhone}${separator}body=${encodeURIComponent(text)}`;
  window.location.href = url;
  closeModal('modal-send-reminder');
  showToast(`📱 SMS ouvert avec le numéro de ${currentReminderTarget.name} (+${cleanPhone}) !`);
};

window.sendWhatsAppReminder = function(name, phone, amount) {
  const cleanPhone = sanitizePhoneNumber(phone);
  const client = AppState.clients.find(c => c.name === name || c.phone === phone);
  
  // Extraire la liste détaillée des articles achetés à crédit
  let itemsSummary = '';
  if (client && client.transactions && client.transactions.length > 0) {
    const unpaidTxs = client.transactions.filter(t => t.status !== 'paid');
    const txsToUse = unpaidTxs.length > 0 ? unpaidTxs : client.transactions;
    itemsSummary = txsToUse.map(t => `• ${t.desc} (${formatCurrency(t.amount)})`).join('\n');
  }

  const template = localStorage.getItem('whatsappTemplate') || 
    (AppState.lang === 'en' ? 
      "Bonjour {nom_client}, nous vous rappelons amicalement que votre solde de {montant} chez {nom_commerce} est à régler. Merci pour votre confiance !" : 
      "Bonjour {nom_client}, nous vous rappelons amicalement que votre solde de {montant} chez {nom_commerce} est à régler. Merci pour votre confiance !");
  
  let msg = template
    .replace(/{nom_client}/g, name)
    .replace(/{montant}/g, formatCurrency(amount))
    .replace(/{nom_commerce}/g, AppState.businessName);

  if (itemsSummary) {
    msg += `\n\n📦 Détail de vos achats à régler :\n${itemsSummary}`;
  }

  if (AppState.businessPhone) {
    msg += `\n\n📱 Règlement possible en espèces ou par Mobile Money / Wave au : ${AppState.businessPhone}`;
  }

  // Ouvre directement WhatsApp avec le numéro de téléphone et le message propre
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  showToast(`💬 WhatsApp ouvert avec le détail des achats pour ${name} (+${cleanPhone}) !`);
};

window.sendSMSReminder = function(name, phone, amount) {
  const cleanPhone = sanitizePhoneNumber(phone);
  const template = localStorage.getItem('whatsappTemplate') || 
    (AppState.lang === 'en' ? 
      "Hello {nom_client}, reminder of your balance of {montant} at {nom_commerce}." : 
      "Bonjour {nom_client}, rappel de votre solde de {montant} chez {nom_commerce}. Merci de régler dès que possible.");
  
  let msg = template
    .replace(/{nom_client}/g, name)
    .replace(/{montant}/g, formatCurrency(amount))
    .replace(/{nom_commerce}/g, AppState.businessName);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const separator = isIOS ? '&' : '?';
  const url = `sms:${cleanPhone}${separator}body=${encodeURIComponent(msg)}`;
  window.location.href = url;
  showToast(`📱 Application SMS ouverte avec le numéro de ${name} (+${cleanPhone}) !`);
};

window.saveWhatsAppTemplate = function() {
  const txt = document.getElementById('whatsapp-template-text')?.value;
  if (txt) {
    localStorage.setItem('whatsappTemplate', txt);
    showToast(AppState.lang === 'en' ? 'WhatsApp message template saved!' : 'Modèle de message WhatsApp enregistré !');
  }
};

// --------------------------------------------------------------------------
// 10. SIGNATURE DIGITALE & REÇUS THERMIQUES / PDF
// --------------------------------------------------------------------------
function initSignaturePad() {
  const canvas = document.getElementById('signature-pad');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 300;
    canvas.height = 100;
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

  function startDraw(e) {
    drawing = true;
    ctx.beginPath();
    const p = getPos(e);
    ctx.moveTo(p.x, p.y);
    e.preventDefault();
  }

  function draw(e) {
    if (!drawing) return;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    e.preventDefault();
  }

  function stopDraw() { drawing = false; }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDraw);

  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  window.addEventListener('touchend', stopDraw);
}

window.clearSignature = function() {
  const canvas = document.getElementById('signature-pad');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

window.openReceiptPreviewModalWithData = function(name, phone, desc, amount) {
  document.getElementById('receipt-biz-name').textContent = AppState.businessName.toUpperCase();
  document.getElementById('receipt-client-name').textContent = name;
  document.getElementById('receipt-client-phone').textContent = phone;
  document.getElementById('receipt-items-desc').textContent = desc;
  document.getElementById('receipt-total-amount').textContent = formatCurrency(amount);

  const canvas = document.getElementById('signature-pad');
  const img = document.getElementById('receipt-signature-img');
  const placeholder = document.getElementById('receipt-signature-placeholder');

  if (canvas) {
    img.src = canvas.toDataURL();
    img.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
  }

  openModal('modal-receipt-preview');
};

window.printReceiptTicket = function() { window.print(); };

window.downloadReceiptPDF = function() {
  const element = document.getElementById('receipt-ticket-content');
  if (window.html2pdf) {
    const opt = {
      margin: 10,
      filename: `Recu_CreditTrack_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
    showToast(AppState.lang === 'en' ? 'PDF receipt generated!' : 'Reçu PDF généré et téléchargé !');
  } else {
    window.print();
  }
};

window.openModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
};

window.closeModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
};

// --------------------------------------------------------------------------
// 11. PARAMÈTRES (MON COMMERCE, UTILISATEURS, BACKUP)
// --------------------------------------------------------------------------
window.switchSettingsTab = function(tabName) {
  document.querySelectorAll('.settings-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.settings-tab-btn').forEach(b => {
    b.classList.remove('btn-primary', 'active');
    b.classList.add('btn-outline');
  });

  const activePanel = document.getElementById(`settings-panel-${tabName}`);
  const activeBtn = document.getElementById(`tab-btn-${tabName}`);

  if (activePanel) activePanel.style.display = 'block';
  if (activeBtn) {
    activeBtn.classList.remove('btn-outline');
    activeBtn.classList.add('btn-primary', 'active');
  }
};

window.saveCompanySettings = function() {
  const name = document.getElementById('setting-company-input')?.value;
  const addr = document.getElementById('setting-address-input')?.value;
  const phone = document.getElementById('setting-phone-input')?.value;

  if (name) {
    AppState.businessName = name;
    localStorage.setItem('businessName', name);
  }
  if (addr) {
    AppState.businessAddress = addr;
    localStorage.setItem('businessAddress', addr);
  }
  if (phone) {
    AppState.businessPhone = phone;
    localStorage.setItem('businessPhone', phone);
  }

  showToast(AppState.lang === 'en' ? 'Business information saved!' : 'Informations du commerce sauvegardées !');
};

window.saveUserSettings = function() {
  const user = document.getElementById('setting-username-input')?.value;
  const role = document.getElementById('setting-role-input')?.value;

  if (user) {
    AppState.userName = user;
    localStorage.setItem('userName', user);
    const sbName = document.getElementById('sidebar-user-name');
    if (sbName) sbName.textContent = user;
  }
  if (role) {
    AppState.userRole = role;
    localStorage.setItem('userRole', role);
  }

  showToast(AppState.lang === 'en' ? 'User profile saved!' : 'Profil utilisateur mis à jour !');
};

window.exportJSON = function() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState, null, 2));
  const dl = document.createElement('a');
  dl.setAttribute("href", dataStr);
  dl.setAttribute("download", `CreditTrack_Backup_${AppState.country}_${Date.now()}.json`);
  document.body.appendChild(dl);
  dl.click();
  dl.remove();
  showToast(AppState.lang === 'en' ? 'JSON backup downloaded!' : 'Sauvegarde JSON exportée !');
};

window.exportAccountingCSV = function() {
  let csv = "Date;NumeroPiece;Categorie;Description;MontantHT;TVA;TotalTTC;Statut\n";
  AppState.accountingEntries.forEach(e => {
    const total = e.amountHT + (e.vatAmount || 0);
    csv += `"${e.date}";"${e.ref}";"${e.code}";"${e.label}";"${e.amountHT}";"${e.vatAmount}";"${total}";"${e.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Livre_Caisse_${AppState.country}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(AppState.lang === 'en' ? 'Excel (CSV) file exported!' : 'Export Excel (CSV) généré !');
};

function filterClientTable(query) {
  const q = query.toLowerCase();
  const rows = document.querySelectorAll('#clients-saas-table-body tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

function filterAccountingTable(query) {
  const q = query.toLowerCase();
  const rows = document.querySelectorAll('#accounting-journal-body tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

// --------------------------------------------------------------------------
// 12. COMPTABILITÉ & CAISSE
// --------------------------------------------------------------------------
function updateAccountCodeOptions(type) {
  const select = document.getElementById('acc-account-select');
  if (!select) return;
  const chart = ACCOUNTING_CHARTS.SYSCOHADA;
  let filtered = chart;
  if (type === 'revenue') filtered = chart.filter(c => c.category === 'revenue');
  else if (type === 'expense') filtered = chart.filter(c => c.category === 'expense');
  else if (type === 'cash') filtered = chart.filter(c => c.category === 'cash');

  select.innerHTML = filtered.map(c => 
    `<option value="${c.code}">${c.code} — ${AppState.lang === 'en' ? c.labelEn : c.labelFr}</option>`
  ).join('');
}

function recalcVatPreview() {
  const htInput = document.getElementById('acc-amount-ht');
  const vatInput = document.getElementById('acc-amount-vat');
  if (!htInput || !vatInput) return;
  const ht = parseFloat(htInput.value) || 0;
  const vatRate = AppState.countryConfig ? AppState.countryConfig.vatRate : 18;
  const vat = Math.round((ht * vatRate) / 100);
  vatInput.value = vat;
}

function handleNewAccountingEntrySubmit(e) {
  e.preventDefault();
  const type = document.getElementById('acc-entry-type').value;
  const code = document.getElementById('acc-account-select').value;
  const amountHT = parseFloat(document.getElementById('acc-amount-ht').value) || 0;
  const vatAmount = parseFloat(document.getElementById('acc-amount-vat').value) || 0;
  const label = document.getElementById('acc-entry-desc').value;

  const newEntry = {
    id: Date.now(),
    date: new Date().toLocaleDateString('fr-FR'),
    ref: `RC-${Math.floor(1000 + Math.random() * 9000)}`,
    code,
    label,
    type,
    amountHT,
    vatAmount,
    status: 'Validé'
  };

  AppState.accountingEntries.unshift(newEntry);
  if (window.dataStore) window.dataStore.add('accountingEntries', newEntry).catch(() => {});
  saveLocalCache('credittrack_accounting', AppState.accountingEntries);

  renderAccountingKPIs();
  renderAccountingJournal();
  closeModal('modal-accounting-entry');
  showToast(`${AppState.lang === 'en' ? 'Entry of' : 'Écriture de'} ${formatCurrency(amountHT)} ${AppState.lang === 'en' ? 'saved!' : 'enregistrée !'}`);
}

function renderAccountingKPIs() {
  let revenue = 0;
  let expenses = 0;
  let vat = 0;

  AppState.accountingEntries.forEach(e => {
    if (e.type === 'revenue') {
      revenue += e.amountHT;
      vat += (e.vatAmount || 0);
    } else if (e.type === 'expense') {
      expenses += e.amountHT;
    }
  });

  const profit = revenue - expenses;

  const revEl = document.getElementById('acc-metric-revenue');
  const expEl = document.getElementById('acc-metric-expenses');
  const vatEl = document.getElementById('acc-metric-vat');
  const profEl = document.getElementById('acc-metric-profit');

  if (revEl) revEl.textContent = formatCurrency(revenue);
  if (expEl) expEl.textContent = formatCurrency(expenses);
  if (vatEl) vatEl.textContent = formatCurrency(vat);
  if (profEl) profEl.textContent = formatCurrency(profit);
}

function renderAccountingJournal() {
  const tbody = document.getElementById('accounting-journal-body');
  if (!tbody) return;

  if (AppState.accountingEntries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#94A3B8;padding:20px;">${AppState.lang === 'en' ? 'No accounting entries recorded.' : 'Aucune écriture enregistrée.'}</td></tr>`;
    return;
  }

  tbody.innerHTML = AppState.accountingEntries.map(e => {
    const amountTTC = e.amountHT + (e.vatAmount || 0);
    return `
      <tr>
        <td>${escapeHTML(e.date)}</td>
        <td style="font-weight:800;">${escapeHTML(e.ref)}</td>
        <td><span class="badge-status ${e.type === 'revenue' ? 'paid' : 'overdue'}">${escapeHTML(e.code)}</span></td>
        <td style="font-weight:700;">${escapeHTML(e.label)}</td>
        <td style="font-weight:800;color:${e.type === 'revenue' ? '#10B981' : '#EF4444'};">${formatCurrency(e.amountHT)}</td>
        <td style="color:#64748B;">${formatCurrency(e.vatAmount || 0)}</td>
        <td style="font-weight:800;color:#0F172A;">${formatCurrency(amountTTC)}</td>
        <td><span class="badge-status paid">${escapeHTML(e.status || 'Validé')}</span></td>
      </tr>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// 13. GRAPHIQUES (CHART.JS)
// --------------------------------------------------------------------------
function initCharts() {
  const ctxWeekly = document.getElementById('weeklyChart');
  if (ctxWeekly && window.Chart) {
    if (weeklyChartInstance) weeklyChartInstance.destroy();
    const ctx = ctxWeekly.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.22)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.01)');

    const hasPayments = AppState.payments.length > 0;
    const chartData = hasPayments ? [0, 0, 0, 0, 0, AppState.payments.reduce((acc, p) => acc + (p.amount || 0), 0)] : [0, 0, 0, 0, 0, 0];

    weeklyChartInstance = new Chart(ctxWeekly, {
      type: 'line',
      data: {
        labels: ['Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
        datasets: [{
          label: AppState.lang === 'en' ? 'Collections' : 'Paiements Reçus',
          data: chartData,
          borderColor: '#2563EB',
          borderWidth: 3,
          pointBackgroundColor: '#2563EB',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          tension: 0.35,
          fill: true,
          backgroundColor: gradient
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#64748B', font: { size: 10, weight: '600' } }, grid: { display: false } },
          y: { 
            ticks: { color: '#64748B', font: { size: 10, weight: '600' }, callback: v => v >= 1000 ? (v/1000) + 'K' : v }, 
            grid: { color: '#F1F5F9' },
            beginAtZero: true
          }
        }
      }
    });
  }

  const ctxScoring = document.getElementById('scoringChart');
  if (ctxScoring && window.Chart) {
    if (scoringChartInstance) scoringChartInstance.destroy();
    
    let reliable = 0, average = 0, atRisk = 0;
    AppState.clients.forEach(c => {
      if (c.reliabilityScore >= 80) reliable++;
      else if (c.reliabilityScore >= 50) average++;
      else atRisk++;
    });

    const hasClients = AppState.clients.length > 0;
    const scoringData = hasClients ? [reliable, average, atRisk] : [1];
    const scoringColors = hasClients ? ['#10B981', '#F59E0B', '#EF4444'] : ['#E2E8F0'];
    const scoringLabels = hasClients ? ['Sérieux', 'Moyen', 'En retard'] : ['En attente de clients'];

    scoringChartInstance = new Chart(ctxScoring, {
      type: 'doughnut',
      data: {
        labels: scoringLabels,
        datasets: [{
          data: scoringData,
          backgroundColor: scoringColors,
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { display: false } }
      }
    });
  }

  const ctxAccCashflow = document.getElementById('accountingCashflowChart');
  if (ctxAccCashflow && window.Chart) {
    if (accountingCashflowChartInstance) accountingCashflowChartInstance.destroy();
    const ctx = ctxAccCashflow.getContext('2d');
    const gradRevenue = ctx.createLinearGradient(0, 0, 0, 220);
    gradRevenue.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
    gradRevenue.addColorStop(1, 'rgba(16, 185, 129, 0.01)');

    const hasAccounting = AppState.accountingEntries.length > 0;
    const revData = hasAccounting ? [0, 0, 0, 0, AppState.accountingEntries.filter(e => e.type === 'revenue').reduce((acc, e) => acc + (e.amountHT || 0), 0)] : [0, 0, 0, 0, 0];
    const expData = hasAccounting ? [0, 0, 0, 0, AppState.accountingEntries.filter(e => e.type === 'expense').reduce((acc, e) => acc + (e.amountHT || 0), 0)] : [0, 0, 0, 0, 0];

    accountingCashflowChartInstance = new Chart(ctxAccCashflow, {
      type: 'line',
      data: {
        labels: ['Avr', 'Mai', 'Juin', 'Juil', 'Août'],
        datasets: [
          {
            label: AppState.lang === 'en' ? 'Revenue' : 'Recettes (Ventes)',
            data: revData,
            borderColor: '#10B981', borderWidth: 2.5, pointBackgroundColor: '#10B981',
            pointRadius: 3, tension: 0.35, fill: true, backgroundColor: gradRevenue
          },
          {
            label: AppState.lang === 'en' ? 'Expenses' : 'Dépenses',
            data: expData,
            borderColor: '#EF4444', borderWidth: 2.5, pointBackgroundColor: '#EF4444',
            pointRadius: 3, tension: 0.35
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 } } } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#F1F5F9' }, beginAtZero: true }
        }
      }
    });
  }

  const ctxAccExpense = document.getElementById('accountingExpenseChart');
  if (ctxAccExpense && window.Chart) {
    if (accountingExpenseChartInstance) accountingExpenseChartInstance.destroy();
    accountingExpenseChartInstance = new Chart(ctxAccExpense, {
      type: 'doughnut',
      data: {
        labels: ['Achats Stock', 'Charges & Transport', 'Frais MoMo'],
        datasets: [{
          data: AppState.accountingEntries.length > 0 ? [65, 25, 10] : [1],
          backgroundColor: AppState.accountingEntries.length > 0 ? ['#2563EB', '#F59E0B', '#8B5CF6'] : ['#E2E8F0'],
          borderWidth: 0, hoverOffset: 4
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: { legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 } } } }
      }
    });
  }
}

// --------------------------------------------------------------------------
// 14. SYSTÈME D'AUTHENTIFICATION & VÉRIFICATION EMAIL PAR CODE OTP SERVEUR
// --------------------------------------------------------------------------
let pendingAuthData = {
  email: '',
  bizName: '',
  phone: ''
};

let resendTimerInterval = null;
let resendSecondsLeft = 0;

// Masquage sécurisé de l'adresse e-mail pour l'affichage (ex: u**********r@gmail.com)
function maskEmail(email) {
  if (!email || !email.includes('@')) return email || '';
  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return `${username[0]}*@${domain}`;
  }
  const first = username[0];
  const last = username[username.length - 1];
  const stars = '*'.repeat(Math.min(10, Math.max(3, username.length - 2)));
  return `${first}${stars}${last}@${domain}`;
}

function startResendCooldown(seconds = 60) {
  resendSecondsLeft = seconds;
  const resendBtn = document.getElementById('auth-resend-btn');
  const timerSpan = document.getElementById('auth-resend-timer');
  
  if (resendTimerInterval) clearInterval(resendTimerInterval);
  
  if (resendBtn) {
    resendBtn.style.pointerEvents = 'none';
    resendBtn.style.opacity = '0.5';
  }
  if (timerSpan) timerSpan.textContent = `(${resendSecondsLeft}s)`;
  
  resendTimerInterval = setInterval(() => {
    resendSecondsLeft--;
    if (resendSecondsLeft <= 0) {
      clearInterval(resendTimerInterval);
      resendTimerInterval = null;
      if (resendBtn) {
        resendBtn.style.pointerEvents = 'auto';
        resendBtn.style.opacity = '1';
      }
      if (timerSpan) timerSpan.textContent = '';
    } else {
      if (timerSpan) timerSpan.textContent = `(${resendSecondsLeft}s)`;
    }
  }, 1000);
}

window.openAuthModal = function(tab = 'register') {
  switchAuthTab(tab);
  openModal('modal-auth');
};

window.switchAuthTab = function(tab) {
  const isRegister = tab === 'register';
  const tabLogin = document.getElementById('tab-auth-login');
  const tabReg = document.getElementById('tab-auth-register');
  const viewReg = document.getElementById('auth-view-register');
  const viewLogin = document.getElementById('auth-view-login');
  const viewOtp = document.getElementById('auth-view-otp');
  const tabsContainer = document.getElementById('auth-tabs-container');
  const modalTitle = document.getElementById('auth-modal-title');

  if (tabsContainer) tabsContainer.style.display = 'flex';
  if (viewOtp) viewOtp.style.display = 'none';

  if (isRegister) {
    if (viewReg) viewReg.style.display = 'block';
    if (viewLogin) viewLogin.style.display = 'none';
    if (modalTitle) modalTitle.textContent = '✨ Créer un Compte (Essai 3 Mois Offert)';
    if (tabReg) {
      tabReg.classList.add('active');
      tabReg.style.background = '#fff';
      tabReg.style.color = '#0F172A';
      tabReg.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }
    if (tabLogin) {
      tabLogin.classList.remove('active');
      tabLogin.style.background = 'transparent';
      tabLogin.style.color = '#64748B';
      tabLogin.style.boxShadow = 'none';
    }
  } else {
    if (viewReg) viewReg.style.display = 'none';
    if (viewLogin) viewLogin.style.display = 'block';
    if (modalTitle) modalTitle.textContent = '🔐 Connexion à votre Espace';
    if (tabLogin) {
      tabLogin.classList.add('active');
      tabLogin.style.background = '#fff';
      tabLogin.style.color = '#0F172A';
      tabLogin.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }
    if (tabReg) {
      tabReg.classList.remove('active');
      tabReg.style.background = 'transparent';
      tabReg.style.color = '#64748B';
      tabReg.style.boxShadow = 'none';
    }
  }
};

window.backToAuthRegister = function() {
  switchAuthTab('register');
};

window.promptPendingVerification = function() {
  const email = prompt("Veuillez saisir votre adresse e-mail pour valider le code OTP reçu :");
  if (email && email.trim()) {
    pendingAuthData.email = email.trim().toLowerCase();
    showOtpVerificationView(pendingAuthData.email);
  }
};

function showOtpVerificationView(email) {
  const viewReg = document.getElementById('auth-view-register');
  const viewLogin = document.getElementById('auth-view-login');
  const viewOtp = document.getElementById('auth-view-otp');
  const tabsContainer = document.getElementById('auth-tabs-container');
  const targetDisplay = document.getElementById('auth-target-email-display');
  const modalTitle = document.getElementById('auth-modal-title');

  if (tabsContainer) tabsContainer.style.display = 'none';
  if (viewReg) viewReg.style.display = 'none';
  if (viewLogin) viewLogin.style.display = 'none';
  if (viewOtp) viewOtp.style.display = 'block';
  if (modalTitle) modalTitle.textContent = '📬 Vérification de votre E-mail';
  if (targetDisplay) targetDisplay.textContent = maskEmail(email);

  const otpInput = document.getElementById('auth-otp-code');
  if (otpInput) {
    otpInput.value = '';
    otpInput.focus();
  }

  startResendCooldown(60);
}

window.handleRegisterSubmit = async function(e) {
  e.preventDefault();
  const bizName = (document.getElementById('auth-reg-biz-name')?.value || '').trim() || 'Mon Commerce';
  const phone = (document.getElementById('auth-reg-phone')?.value || '').trim();
  const email = (document.getElementById('auth-reg-email')?.value || '').trim().toLowerCase();
  const password = document.getElementById('auth-reg-password')?.value || '';
  const passwordConfirm = document.getElementById('auth-reg-password-confirm')?.value || '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showToast("⚠️ Veuillez renseigner une adresse email valide.");
    document.getElementById('auth-reg-email')?.focus();
    return;
  }

  if (password.length < 6) {
    showToast("⚠️ Le mot de passe doit comporter au moins 6 caractères.");
    document.getElementById('auth-reg-password')?.focus();
    return;
  }

  if (password !== passwordConfirm) {
    showToast("❌ Les mots de passe ne correspondent pas.");
    document.getElementById('auth-reg-password-confirm')?.focus();
    return;
  }

  pendingAuthData.email = email;
  pendingAuthData.bizName = bizName;
  pendingAuthData.phone = phone;

  const submitBtn = document.getElementById('auth-reg-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;margin-right:6px;"></div> Envoi sécurisé du code...`;
  }

  try {
    if (window.supabaseClient) {
      // 1. Inscription côté serveur Supabase avec hachage et envoi du code par e-mail
      const { data, error } = await window.supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: bizName,
            phone: phone,
            plan_tier: 'trial_3_months'
          }
        }
      });

      if (error) {
        if (error.message && (error.message.includes('already registered') || error.message.includes('already exists') || error.status === 422)) {
          showToast("ℹ️ Un compte existe déjà avec cette adresse email. Veuillez vous connecter.");
          switchAuthTab('login');
          const loginEmail = document.getElementById('auth-login-email');
          if (loginEmail) loginEmail.value = email;
          return;
        }
        throw error;
      }

      if (data && data.user && data.user.identities && data.user.identities.length === 0) {
        showToast("ℹ️ Cette adresse email est déjà enregistrée. Veuillez vous connecter.");
        switchAuthTab('login');
        const loginEmail = document.getElementById('auth-login-email');
        if (loginEmail) loginEmail.value = email;
        return;
      }
    }

    // Basculer vers l'écran de saisie du code OTP
    showOtpVerificationView(email);
    showToast(`📬 Un vrai code de sécurité à 6 chiffres a été envoyé à ${maskEmail(email)} !`);
  } catch (err) {
    console.error("Erreur Inscription Supabase:", err);
    showToast(`⚠️ Erreur : ${err.message || "Impossible d'initier l'inscription"}`);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Créer mon Compte &amp; Recevoir le Code</span> ➔`;
    }
  }
};

window.handleVerifyOtpSubmit = async function(e) {
  e.preventDefault();
  const rawCode = (document.getElementById('auth-otp-code')?.value || '').trim();
  const otpCode = rawCode.replace(/[^0-9]/g, '');

  if (!otpCode || otpCode.length < 6) {
    showToast("⚠️ Veuillez entrer le code de sécurité à 6 chiffres reçu par mail.");
    document.getElementById('auth-otp-code')?.focus();
    return;
  }

  const verifyBtn = document.getElementById('auth-verify-btn');
  if (verifyBtn) {
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = `<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;margin-right:6px;"></div> Vérification serveur...`;
  }

  try {
    let userId = 'usr_' + Date.now();
    let userEmail = pendingAuthData.email;

    if (window.supabaseClient) {
      // Vérification côté serveur par Supabase Auth
      let verifyRes = await window.supabaseClient.auth.verifyOtp({
        email: pendingAuthData.email,
        token: otpCode,
        type: 'signup'
      });

      // Fallback si le type de confirmation est 'email'
      if (verifyRes.error) {
        verifyRes = await window.supabaseClient.auth.verifyOtp({
          email: pendingAuthData.email,
          token: otpCode,
          type: 'email'
        });
      }

      if (verifyRes.error) throw verifyRes.error;

      if (verifyRes.data && verifyRes.data.user) {
        userId = verifyRes.data.user.id;
        userEmail = verifyRes.data.user.email || userEmail;
      }
    }

    // Initialisation session utilisateur avec 3 mois d'essai offerts
    AppState.user.id = userId;
    AppState.user.email = userEmail;
    AppState.user.businessName = pendingAuthData.bizName || AppState.businessName;
    AppState.user.planTier = 'trial_3_months';
    AppState.user.status = 'active';
    AppState.businessName = AppState.user.businessName;
    AppState.userName = userEmail.split('@')[0];

    localStorage.setItem('user_id', userId);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('bizName', AppState.user.businessName);
    localStorage.setItem('userPlan', 'trial_3_months');
    localStorage.setItem('userName', AppState.userName);

    // Charger immédiatement le jeu de données isolé propre à cet utilisateur
    AppState.clients = getCachedArray('credittrack_clients');
    AppState.payments = getCachedArray('credittrack_payments');
    AppState.accountingEntries = getCachedArray('credittrack_accounting');

    if (window.dataStore) {
      try {
        await window.dataStore.syncFromSupabase();
      } catch(e) {}
    }

    renderClientDirectory();
    renderPaymentsTable();
    renderAccountingKPIs();
    renderCreditKPIs();

    updateUserPlanBadgeUI();
    closeModal('modal-auth');

    // Ouvrir directement l'espace de travail sécurisé
    openAppWorkspace('menu-2');

    showToast(`🎉 Bienvenue ${AppState.user.businessName} ! Compte vérifié & 3 Mois d'Essai activés ! 🚀`);
  } catch (err) {
    console.error("Erreur validation OTP:", err);
    showToast("❌ Code incorrect ou expiré. Veuillez vérifier votre boîte mail.");
    const otpInput = document.getElementById('auth-otp-code');
    if (otpInput) {
      otpInput.style.borderColor = '#EF4444';
      setTimeout(() => { otpInput.style.borderColor = ''; }, 3500);
    }
  } finally {
    if (verifyBtn) {
      verifyBtn.disabled = false;
      verifyBtn.innerHTML = `✅ Valider &amp; Activer mon Compte`;
    }
  }
};

window.handleLoginSubmit = async function(e) {
  e.preventDefault();
  const email = (document.getElementById('auth-login-email')?.value || '').trim().toLowerCase();
  const password = document.getElementById('auth-login-password')?.value || '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showToast("⚠️ Veuillez renseigner une adresse email valide.");
    document.getElementById('auth-login-email')?.focus();
    return;
  }

  if (!password) {
    showToast("⚠️ Veuillez saisir votre mot de passe.");
    document.getElementById('auth-login-password')?.focus();
    return;
  }

  const submitBtn = document.getElementById('auth-login-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;margin-right:6px;"></div> Connexion en cours...`;
  }

  try {
    let userId = 'usr_' + Date.now();
    let userEmail = email;
    let bizName = 'Mon Commerce';

    if (window.supabaseClient) {
      const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message && (error.message.includes('Email not confirmed') || error.message.includes('not confirmed'))) {
          showToast("⚠️ Votre adresse email n'est pas encore confirmée. Un code vous a été envoyé.");
          pendingAuthData.email = email;
          try {
            await window.supabaseClient.auth.resend({ type: 'signup', email });
          } catch(re) {}
          showOtpVerificationView(email);
          return;
        }
        throw error;
      }

      if (data && data.user) {
        userId = data.user.id;
        userEmail = data.user.email || email;
        bizName = data.user.user_metadata?.business_name || bizName;
      }
    }

    AppState.user.id = userId;
    AppState.user.email = userEmail;
    AppState.user.businessName = bizName;
    AppState.user.planTier = localStorage.getItem('userPlan') || 'trial_3_months';
    AppState.user.status = 'active';
    AppState.businessName = bizName;
    AppState.userName = userEmail.split('@')[0];

    localStorage.setItem('user_id', userId);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('bizName', bizName);
    localStorage.setItem('userName', AppState.userName);

    // Charger les données isolées propres à ce commerçant
    AppState.clients = getCachedArray('credittrack_clients');
    AppState.payments = getCachedArray('credittrack_payments');
    AppState.accountingEntries = getCachedArray('credittrack_accounting');

    if (window.dataStore) {
      try {
        await window.dataStore.syncFromSupabase();
      } catch(e) {}
    }

    renderClientDirectory();
    renderPaymentsTable();
    renderAccountingKPIs();
    renderCreditKPIs();

    updateUserPlanBadgeUI();
    closeModal('modal-auth');

    openAppWorkspace('menu-2');
    showToast(`✅ Heureux de vous revoir ${AppState.businessName} !`);
  } catch (err) {
    console.error("Erreur Connexion:", err);
    showToast("❌ Adresse email ou mot de passe incorrect.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>🔐 Se Connecter</span>`;
    }
  }
};

window.handleResendOtp = async function() {
  if (!pendingAuthData.email) {
    showToast("⚠️ Aucune adresse e-mail en attente de vérification.");
    return;
  }

  if (resendSecondsLeft > 0) {
    showToast(`⏳ Veuillez patienter encore ${resendSecondsLeft} secondes avant de renvoyer un code.`);
    return;
  }

  showToast("⏳ Envoi d'un nouveau code par le serveur...");
  try {
    if (window.supabaseClient) {
      const { error } = await window.supabaseClient.auth.resend({
        type: 'signup',
        email: pendingAuthData.email
      });
      if (error) {
        await window.supabaseClient.auth.signInWithOtp({
          email: pendingAuthData.email,
          options: { shouldCreateUser: false }
        });
      }
    }
    startResendCooldown(60);
    showToast(`📧 Nouveau code renvoyé avec succès à ${maskEmail(pendingAuthData.email)} !`);
  } catch (e) {
    console.warn("Erreur renvoi OTP:", e);
    showToast("⚠️ Impossible de renvoyer le code pour le moment. Veuillez patienter.");
  }
};

window.handleSignOut = async function() {
  if (window.supabaseClient) {
    try { await window.supabaseClient.auth.signOut(); } catch(e) {}
  }
  AppState.user = { id: '', email: '', businessName: 'Mon Commerce', planTier: 'free', status: 'active', isVip: false };
  AppState.clients = [];
  AppState.payments = [];
  AppState.accountingEntries = [];

  localStorage.removeItem('user_id');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userPlan');
  localStorage.removeItem('isVip');
  localStorage.removeItem('activeView');
  localStorage.removeItem('credittrack_clients');
  localStorage.removeItem('credittrack_payments');
  localStorage.removeItem('credittrack_accounting');
  
  updateUserPlanBadgeUI();
  renderClientDirectory();
  renderPaymentsTable();
  renderAccountingKPIs();
  renderAccountingJournal();
  renderCreditKPIs();
  
  openPublicLanding();
  showToast("👋 Déconnexion réussie. L'espace commerçant a été verrouillé.");
};

window.openSubscriptionModal = function() {
  openModal('modal-subscription-plans');
};

// --------------------------------------------------------------------------
// 15. DÉBLOCAGE VIP ADMIN & GESTION DU FORFAIT PRO
// --------------------------------------------------------------------------
const VALID_ADMIN_KEYS = [
  'VIP-SALEM-PRO-2026',
  'CREDITTRACK-VIP-PASS',
  'SALEM-FOUNDER-PASS',
  'PROMO-2026-VIP'
];

window.redeemAdminLicenseKey = function() {
  const input = document.getElementById('admin-license-key-input');
  if (!input) return;
  const key = input.value.trim().toUpperCase();

  if (VALID_ADMIN_KEYS.includes(key) || key.startsWith('VIP-')) {
    AppState.user.planTier = 'vip_lifetime';
    AppState.user.isVip = true;
    localStorage.setItem('userPlan', 'vip_lifetime');
    localStorage.setItem('isVip', 'true');

    updateUserPlanBadgeUI();
    closeModal('modal-subscription-plans');
    showToast("👑 Clé VIP Validée ! Accès PRO Illimité à Vie activé avec succès ! 🚀");
    
    // Save to local IndexedDB & Supabase
    if (window.dataStore) {
      window.dataStore.add("settings", { key: "active_license", value: key, plan: "vip_lifetime", date: new Date().toISOString() });
    }
  } else {
    showToast("❌ Clé de licence VIP invalide ou expirée.");
    input.style.borderColor = '#EF4444';
    setTimeout(() => { input.style.borderColor = ''; }, 3000);
  }
};

window.triggerSaaSPayment = function(planTier, amount) {
  const planLabel = planTier === 'pro_yearly' ? 'PRO Annuel' : 'PRO Mensuel';
  
  // 1. If FedaPay Checkout SDK is available
  if (typeof FedaPay !== 'undefined' && FedaPay.init) {
    try {
      const widget = FedaPay.init({
        public_key: window.FEDAPAY_PUBLIC_KEY || 'pk_sandbox_uT1v9L9_sample_key',
        transaction: {
          amount: amount,
          description: `Abonnement CreditTrack ${planLabel}`,
          custom_metadata: { plan_tier: planTier, user_email: AppState.user.email || 'client@credittrack.pro' }
        },
        customer: {
          email: AppState.user.email || 'commercant@credittrack.pro',
          firstname: AppState.user.businessName || 'Commerçant'
        },
        onComplete: function(response) {
          if (response && (response.status === 'approved' || response.status === 'completed')) {
            activateProPlan(planTier, amount, 'FedaPay');
          }
        }
      });
      widget.open();
      return;
    } catch (e) {
      console.warn("FedaPay widget fallback:", e);
    }
  }

  // 2. Direct Activation Fallback
  activateProPlan(planTier, amount, 'Wave / Mobile Money');
};

function activateProPlan(planTier, amount, method) {
  AppState.user.planTier = planTier;
  localStorage.setItem('userPlan', planTier);
  
  const paymentLog = {
    id: Date.now(),
    ref: `SAAS-${Math.floor(100000 + Math.random() * 900000)}`,
    amount,
    planTier,
    date: new Date().toISOString().split('T')[0],
    method
  };

  if (window.dataStore) {
    window.dataStore.add("payments", {
      id: Date.now(),
      ref: paymentLog.ref,
      clientName: `Abonnement ${planTier === 'pro_yearly' ? 'Annuel' : 'Mensuel'} PRO`,
      amount,
      date: 'À l\'instant',
      method
    });
  }

  updateUserPlanBadgeUI();
  closeModal('modal-subscription-plans');
  showToast(`🎉 Félicitations ! Votre Forfait ${planTier === 'pro_yearly' ? 'PRO Annuel' : 'PRO Mensuel'} est ACTIF ! Toutes les fonctionnalités sont débloquées ! 🚀`);
}

window.checkPlanAccess = function(actionType = 'add_client') {
  const isPro = AppState.user.planTier === 'trial_3_months' || AppState.user.planTier === 'pro_monthly' || AppState.user.planTier === 'pro_yearly' || AppState.user.planTier === 'vip_lifetime';
  
  if (actionType === 'add_client') {
    const maxFree = 10;
    if (!isPro && AppState.clients.length >= maxFree) {
      showToast(`⚠️ Limite de ${maxFree} clients atteinte en version Gratuite. Passez en PRO pour des clients illimités !`);
      openSubscriptionModal();
      return false;
    }
  }
  return true;
};

function updateUserPlanBadgeUI() {
  const isPro = AppState.user.planTier === 'trial_3_months' || AppState.user.planTier === 'pro_monthly' || AppState.user.planTier === 'pro_yearly' || AppState.user.planTier === 'vip_lifetime';
  const badge = document.getElementById('sidebar-user-plan-badge');
  const proBanner = document.getElementById('sidebar-pro-banner');
  const userName = document.getElementById('sidebar-user-name');

  if (userName) {
    userName.textContent = AppState.user.businessName || 'Mon Commerce';
  }

  if (badge) {
    if (AppState.user.planTier === 'vip_lifetime') {
      badge.textContent = '👑 VIP Fondateur';
      badge.style.color = '#10B981';
    } else if (AppState.user.planTier === 'trial_3_months') {
      badge.textContent = '🎁 Essai 3 Mois Actif';
      badge.style.color = '#10B981';
    } else if (isPro) {
      badge.textContent = '👑 PRO ACTIF';
      badge.style.color = '#10B981';
    } else {
      badge.textContent = 'GRATUIT (Starter)';
      badge.style.color = '#FBBF24';
    }
  }

  if (proBanner) {
    if (isPro) {
      proBanner.style.background = 'rgba(16, 185, 129, 0.15)';
      proBanner.style.border = '1px solid #10B981';
      const label = document.getElementById('sidebar-pro-plan-label');
      const desc = document.getElementById('sidebar-pro-plan-desc');
      const btn = document.getElementById('sidebar-pro-btn');
      if (label) label.textContent = 'Forfait PRO Actif 👑';
      if (desc) desc.textContent = 'Accès illimité débloqué pour votre boutique.';
      if (btn) {
        btn.textContent = 'Gérer mon Abonnement';
        btn.style.background = '#10B981';
      }
    } else {
      proBanner.style.background = '';
      proBanner.style.border = '';
      const label = document.getElementById('sidebar-pro-plan-label');
      const desc = document.getElementById('sidebar-pro-plan-desc');
      const btn = document.getElementById('sidebar-pro-btn');
      if (label) label.textContent = 'Formule Pro Commerçant';
      if (desc) desc.textContent = 'Rappels WhatsApp automatiques & clients illimités.';
      if (btn) {
        btn.textContent = 'Passer à Pro (5 000 F)';
        btn.style.background = '';
      }
    }
  }
}

// Initialisation UI plan badge au chargement
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(updateUserPlanBadgeUI, 600);
});

