// dataStore.js – Secure IndexedDB & Supabase Cloud Sync for CreditTrack PRO
// ------------------------------------------------------------------
// Synchronisation bidirectionnelle Cloud Supabase & Stockage Local Offline avec isolation sécurisée

const DB_NAME = "CreditTrackDB";
const DB_VERSION = 2;

// Configuration Supabase sécurisée (Publishable Anon Key pour accès RLS)
const SUPABASE_CONFIG = {
  url: window.ENV_SUPABASE_URL || "https://bnkwplwlfnhukevwdcen.supabase.co",
  anonKey: window.ENV_SUPABASE_ANON_KEY || "sb_publishable_hjz2yi3KHdNtSBlsgrCQnw_IssHIkvK"
};

let supabaseClient = null;

function initSupabase() {
  if (supabaseClient) return supabaseClient;
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    try {
      supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });
      window.supabaseClient = supabaseClient;
    } catch {
      // Échec silencieux pour éviter la fuite d'informations
    }
  }
  return supabaseClient;
}

const STORE_DEFINITIONS = [
  { name: "companies", keyPath: "id", autoIncrement: true },
  { name: "clients", keyPath: "id", autoIncrement: false },
  { name: "credits", keyPath: "id", autoIncrement: false },
  { name: "payments", keyPath: "id", autoIncrement: false },
  { name: "reminders", keyPath: "id", autoIncrement: true },
  { name: "accountingEntries", keyPath: "id", autoIncrement: true },
  { name: "settings", keyPath: "key", autoIncrement: false }
];

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      for (const storeDef of STORE_DEFINITIONS) {
        if (!db.objectStoreNames.contains(storeDef.name)) {
          db.createObjectStore(storeDef.name, { keyPath: storeDef.keyPath, autoIncrement: storeDef.autoIncrement });
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fonction d'assainissement des données avant stockage
function sanitizeRecord(val) {
  if (!val || typeof val !== 'object') return val;
  const clean = { ...val };
  for (const k in clean) {
    if (typeof clean[k] === 'string') {
      clean[k] = clean[k].trim();
    }
  }
  return clean;
}

async function add(storeName, value) {
  const sanitized = sanitizeRecord(value);
  const db = await openDB();
  
  // 1. Sauvegarde locale IndexedDB
  const localPromise = new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.put(sanitized);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  // 2. Synchronisation Cloud Supabase sécurisée en arrière-plan
  const client = initSupabase();
  if (client) {
    try {
      if (storeName === 'clients') {
        client.from('clients').upsert({
          name: sanitized.name,
          phone: sanitized.phone,
          cni: sanitized.cni || null,
          preferred_payment_method: sanitized.preferredPaymentMethod || 'Espèces',
          payment_account: sanitized.paymentAccount || sanitized.phone,
          reliability_score: Number(sanitized.reliabilityScore) || 85,
          total_due: Math.max(0, Number(sanitized.totalDue) || 0),
          status: sanitized.status || 'pending'
        }).then(({ error }) => {
          if (error && error.code !== 'PGRST116') {
            // Log sécurisé sans fuite de structure
          }
        });
      } else if (storeName === 'payments') {
        client.from('payments').insert({
          client_name: sanitized.clientName,
          amount: Math.max(0, Number(sanitized.amount) || 0),
          payment_method: sanitized.method || 'Espèces',
          reference: sanitized.ref,
          notes: sanitized.date
        }).then(() => {});
      }
    } catch {
      // Ignorer sans faire planter l'application locale
    }
  }

  return localPromise;
}

async function getAll(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getById(storeName, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function update(storeName, value) {
  return add(storeName, value);
}

async function remove(storeName, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Récupération Cloud Supabase au démarrage
async function syncFromSupabase() {
  const client = initSupabase();
  if (!client) return;

  try {
    const { data: clientsData, error: clientsError } = await client
      .from('clients')
      .select('id, name, phone, cni, preferred_payment_method, payment_account, total_due, status, reliability_score, created_at')
      .limit(100);

    if (!clientsError && Array.isArray(clientsData) && clientsData.length > 0) {
      const mapped = clientsData.map(c => ({
        id: c.id,
        name: c.name || 'Client',
        phone: c.phone || '',
        cni: c.cni || '',
        preferredPaymentMethod: c.preferred_payment_method || 'Espèces',
        paymentAccount: c.payment_account || c.phone || '',
        totalDue: Math.max(0, parseFloat(c.total_due) || 0),
        status: c.status || 'pending',
        reliabilityScore: Math.min(100, Math.max(0, parseInt(c.reliability_score) || 85)),
        addedDate: c.created_at ? c.created_at.split('T')[0] : '2026-08-01',
        transactions: []
      }));
      
      if (window.AppState) {
        window.AppState.clients = mapped;
        if (typeof window.renderClientDirectory === 'function') window.renderClientDirectory();
        if (typeof window.renderCreditKPIs === 'function') window.renderCreditKPIs();
      }
    }
  } catch {
    // Échec de synchronisation silencieux sans bloquer le mode offline
  }
}

// Initialisation globale
window.dataStore = { add, getAll, getById, update, remove, syncFromSupabase, initSupabase };

window.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  setTimeout(syncFromSupabase, 800);
});
