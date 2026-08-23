export interface PaymentMethodOption {
  id: string;
  label: string;
}

export const COUNTRY_PAYMENT_METHODS: Record<string, PaymentMethodOption[]> = {
  CI: [
    { id: "wave_ci", label: "Wave Côte d'Ivoire" },
    { id: "orange_money_ci", label: "Orange Money CI" },
    { id: "mtn_momo_ci", label: "MTN Mobile Money (MoMo CI)" },
    { id: "moov_money_ci", label: "Moov Money CI" },
    { id: "djamo_ci", label: "Djamo CI" },
    { id: "cash", label: "Espèces (Cash en boutique)" },
    { id: "bank_transfer", label: "Virement Bancaire / Chèque" }
  ],
  BJ: [
    { id: "mtn_momo_bj", label: "MTN Mobile Money Bénin (MoMo)" },
    { id: "moov_flooz_bj", label: "Moov Money Bénin (Flooz)" },
    { id: "celtiis_cash_bj", label: "Celtiis Cash Bénin" },
    { id: "wave_bj", label: "Wave Bénin" },
    { id: "cash", label: "Espèces (Cash en boutique)" },
    { id: "bank_transfer", label: "Virement Bancaire" }
  ],
  SN: [
    { id: "wave_sn", label: "Wave Sénégal" },
    { id: "orange_money_sn", label: "Orange Money Sénégal" },
    { id: "free_money_sn", label: "Free Money Sénégal" },
    { id: "wizall_sn", label: "Wizall Money" },
    { id: "cash", label: "Espèces (Cash en boutique)" },
    { id: "bank_transfer", label: "Virement Bancaire" }
  ],
  CM: [
    { id: "orange_money_cm", label: "Orange Money Cameroun" },
    { id: "mtn_momo_cm", label: "MTN Mobile Money (MoMo Cameroun)" },
    { id: "express_union_cm", label: "Express Union Mobile (EUM)" },
    { id: "cash", label: "Espèces (Cash en boutique)" },
    { id: "bank_transfer", label: "Virement Bancaire / Chèque" }
  ],
  NG: [
    { id: "opay_ng", label: "OPay" },
    { id: "palmpay_ng", label: "PalmPay" },
    { id: "moniepoint_ng", label: "Moniepoint" },
    { id: "kuda_ng", label: "Kuda Bank" },
    { id: "bank_transfer_ng", label: "NIP Instant Bank Transfer (GTB, Zenith, Access...)" },
    { id: "ussd_ng", label: "USSD Transfer (*737#, *966#...)" },
    { id: "cash", label: "Cash (NGN)" }
  ],
  KE: [
    { id: "mpesa_ke", label: "M-Pesa (Safaricom Kenya)" },
    { id: "airtel_money_ke", label: "Airtel Money Kenya" },
    { id: "tkash_ke", label: "T-Kash (Telkom Kenya)" },
    { id: "pesalink_ke", label: "Pesalink / Bank Transfer" },
    { id: "cash", label: "Cash (KES)" }
  ],
  GH: [
    { id: "mtn_momo_gh", label: "MTN Mobile Money Ghana (MoMo)" },
    { id: "vodafone_cash_gh", label: "Telecel Cash (Vodafone Cash)" },
    { id: "at_money_gh", label: "AT Money (AirtelTigo)" },
    { id: "gmoney_gh", label: "G-Money" },
    { id: "bank_transfer_gh", label: "Bank Transfer / GhIPSS" },
    { id: "cash", label: "Cash (GHS)" }
  ],
  CD: [
    { id: "mpesa_cd", label: "M-Pesa RDC (Vodacom)" },
    { id: "orange_money_cd", label: "Orange Money RDC" },
    { id: "airtel_money_cd", label: "Airtel Money RDC" },
    { id: "afrimoney_cd", label: "Afrimoney RDC" },
    { id: "cash", label: "Espèces (USD / Franc Congolais)" },
    { id: "bank_transfer", label: "Virement Bancaire (Rawbank, EquityBCDC...)" }
  ],
  TG: [
    { id: "tmoney_tg", label: "T-Money (Togocom)" },
    { id: "flooz_tg", label: "Moov Money (Flooz Togo)" },
    { id: "wave_tg", label: "Wave Togo" },
    { id: "cash", label: "Espèces (Cash en boutique)" },
    { id: "bank_transfer", label: "Virement Bancaire" }
  ],
  BF: [
    { id: "orange_money_bf", label: "Orange Money Burkina" },
    { id: "moov_money_bf", label: "Moov Money (Flooz BF)" },
    { id: "coris_money_bf", label: "Coris Money" },
    { id: "wave_bf", label: "Wave Burkina" },
    { id: "cash", label: "Espèces (Cash en boutique)" },
    { id: "bank_transfer", label: "Virement Bancaire" }
  ],
  ML: [
    { id: "orange_money_ml", label: "Orange Money Mali" },
    { id: "moov_money_ml", label: "Moov Money (Malitel)" },
    { id: "wave_ml", label: "Wave Mali" },
    { id: "sama_money_ml", label: "SAMA Money" },
    { id: "cash", label: "Espèces (Cash en boutique)" },
    { id: "bank_transfer", label: "Virement Bancaire" }
  ],
  GN: [
    { id: "orange_money_gn", label: "Orange Money Guinée" },
    { id: "mtn_momo_gn", label: "MTN Mobile Money Guinée" },
    { id: "paycard_gn", label: "PayCard Guinée" },
    { id: "cash", label: "Espèces (GNF)" },
    { id: "bank_transfer", label: "Virement Bancaire" }
  ],
  GA: [
    { id: "airtel_money_ga", label: "Airtel Money Gabon" },
    { id: "moov_money_ga", label: "Moov Money Gabon" },
    { id: "bgfi_mobile_ga", label: "BGFIMobile" },
    { id: "cash", label: "Espèces (Cash en boutique)" },
    { id: "bank_transfer", label: "Virement Bancaire" }
  ],
  NE: [
    { id: "airtel_money_ne", label: "Airtel Money Niger" },
    { id: "moov_money_ne", label: "Moov Money Niger" },
    { id: "al_izza_ne", label: "Al Izza Cash" },
    { id: "cash", label: "Espèces (Cash en boutique)" },
    { id: "bank_transfer", label: "Virement Bancaire" }
  ],
  RW: [
    { id: "mtn_momo_rw", label: "MTN Mobile Money Rwanda (MoMo)" },
    { id: "airtel_money_rw", label: "Airtel Money Rwanda" },
    { id: "bk_quick_rw", label: "BK Quick" },
    { id: "cash", label: "Cash (RWF)" },
    { id: "bank_transfer", label: "Bank Transfer" }
  ],
  MA: [
    { id: "cmi_ma", label: "Carte Bancaire CMI" },
    { id: "cash_plus_ma", label: "Cash Plus" },
    { id: "wafacash_ma", label: "Wafacash" },
    { id: "inwi_orange_ma", label: "Inwi Money / Orange Money Maroc" },
    { id: "bank_transfer", label: "Virement Bancaire" },
    { id: "cash", label: "Espèces (MAD)" }
  ],
  DZ: [
    { id: "edahabia_dz", label: "Edahabia (Algérie Poste)" },
    { id: "cib_dz", label: "Carte CIB" },
    { id: "baridimob_dz", label: "BaridiMob" },
    { id: "cash", label: "Espèces (DZD)" },
    { id: "bank_transfer", label: "Virement Bancaire" }
  ],
  TN: [
    { id: "flouci_tn", label: "Flouci" },
    { id: "d17_tn", label: "D17 (Poste Tunisienne)" },
    { id: "sobflous_tn", label: "Sobflous" },
    { id: "carte_bancaire_tn", label: "Carte Bancaire / Virement" },
    { id: "cash", label: "Espèces (TND)" }
  ],
  EG: [
    { id: "vodafone_cash_eg", label: "Vodafone Cash" },
    { id: "instapay_eg", label: "InstaPay Egypt" },
    { id: "fawry_eg", label: "Fawry" },
    { id: "orange_etisalat_eg", label: "Orange Cash / Etisalat Cash" },
    { id: "bank_transfer_eg", label: "Bank Transfer" },
    { id: "cash", label: "Cash (EGP)" }
  ],
  ZA: [
    { id: "capitec_pay_za", label: "Capitec Pay" },
    { id: "snapscan_za", label: "SnapScan" },
    { id: "zapper_za", label: "Zapper" },
    { id: "eft_ozow_za", label: "EFT / Ozow Instant Pay" },
    { id: "bank_transfer", label: "Bank Transfer (FNB, Standard Bank...)" },
    { id: "cash", label: "Cash (ZAR)" }
  ]
};

export function getCountryPaymentMethods(countryParam?: string | { code?: string }): PaymentMethodOption[] {
  let code = 'CI';
  if (typeof countryParam === 'string') {
    code = countryParam;
  } else if (countryParam && typeof countryParam.code === 'string') {
    code = countryParam.code;
  }
  code = code.toUpperCase();
  return COUNTRY_PAYMENT_METHODS[code] || COUNTRY_PAYMENT_METHODS['CI'];
}
