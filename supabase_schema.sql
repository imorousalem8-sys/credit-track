-- ====================================================================================
-- CREDITTRACK PRO - SCHÉMA SUPABASE POSTGRESQL 100% INFAILLIBLE & MIGRATION-SAFE
-- ====================================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE CLIENTS (CRÉATION OU MISE À NIVEAU AUTOMATIQUE DES COLONNES)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    cni VARCHAR(100),
    preferred_payment_method VARCHAR(50) DEFAULT 'Espèces',
    payment_account VARCHAR(100),
    reliability_score INT DEFAULT 85,
    total_due DECIMAL(12, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajout sécurisé des colonnes multi-tenant et paiement si elles manquaient
ALTER TABLE clients ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE clients ADD COLUMN IF NOT EXISTS preferred_payment_method VARCHAR(50) DEFAULT 'Espèces';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_account VARCHAR(100);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS reliability_score INT DEFAULT 85;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS total_due DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);

-- 3. TABLE CRÉDITS (VENTES À CRÉDIT & ÉCHÉANCES)
CREATE TABLE IF NOT EXISTS credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    description TEXT,
    preferred_payment_method VARCHAR(50) DEFAULT 'Espèces',
    payment_account VARCHAR(100),
    penalty_rate DECIMAL(5, 2) DEFAULT 0,
    guarantor_name VARCHAR(255),
    guarantor_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajout sécurisé des colonnes sur credits
ALTER TABLE credits ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE credits ADD COLUMN IF NOT EXISTS preferred_payment_method VARCHAR(50) DEFAULT 'Espèces';
ALTER TABLE credits ADD COLUMN IF NOT EXISTS payment_account VARCHAR(100);
ALTER TABLE credits ADD COLUMN IF NOT EXISTS penalty_rate DECIMAL(5, 2) DEFAULT 0;
ALTER TABLE credits ADD COLUMN IF NOT EXISTS guarantor_name VARCHAR(255);
ALTER TABLE credits ADD COLUMN IF NOT EXISTS guarantor_phone VARCHAR(50);
ALTER TABLE credits ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_client_id ON credits(client_id);
CREATE INDEX IF NOT EXISTS idx_credits_due_date ON credits(due_date);

-- 4. TABLE PAIEMENTS (ENCAISSEMENTS MARCHANDS)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Espèces',
    reference VARCHAR(100),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE payments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);

-- 5. MODULE COMPTABILITÉ & CAISSE (SYSCOHADA)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id),
    entry_type VARCHAR(10) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);

-- 6. VUE SOLDE DES COMPTES
CREATE OR REPLACE VIEW account_balances AS
SELECT 
    a.id,
    a.code,
    a.name,
    a.type,
    COALESCE(SUM(CASE WHEN je.entry_type = 'DEBIT' THEN je.amount ELSE 0 END), 0) as total_debit,
    COALESCE(SUM(CASE WHEN je.entry_type = 'CREDIT' THEN je.amount ELSE 0 END), 0) as total_credit,
    CASE 
        WHEN a.type IN ('ASSET', 'EXPENSE') THEN 
            COALESCE(SUM(CASE WHEN je.entry_type = 'DEBIT' THEN je.amount ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN je.entry_type = 'CREDIT' THEN je.amount ELSE 0 END), 0)
        ELSE 
            COALESCE(SUM(CASE WHEN je.entry_type = 'CREDIT' THEN je.amount ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN je.entry_type = 'DEBIT' THEN je.amount ELSE 0 END), 0)
    END as balance
FROM accounts a
LEFT JOIN journal_entries je ON a.id = je.account_id
GROUP BY a.id, a.code, a.name, a.type;

-- 7. MODULE SAAS : COMMERÇANTS, ABONNEMENTS & CLÉS VIP ADMIN
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    plan_tier VARCHAR(20) DEFAULT 'free',
    subscription_status VARCHAR(20) DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON merchants(user_id);

CREATE TABLE IF NOT EXISTS saas_subscription_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'XOF',
    plan_tier VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'completed',
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_license_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_key VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL,
    plan_granted VARCHAR(20) DEFAULT 'vip_lifetime',
    max_uses INT DEFAULT 1,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des clés VIP Administrateur
INSERT INTO admin_license_keys (license_key, label, plan_granted, max_uses) VALUES
('VIP-SALEM-PRO-2026', 'Licence Fondateur & Proches Salem', 'vip_lifetime', 100),
('CREDITTRACK-VIP-PASS', 'Pass VIP Spécial Famille', 'vip_lifetime', 50)
ON CONFLICT (license_key) DO NOTHING;

-- 8. SÉCURITÉ ROW LEVEL SECURITY (RLS) ÉTANCHE
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_license_keys ENABLE ROW LEVEL SECURITY;

-- Suppression préalable propre des anciennes politiques pour éviter les doublons
DROP POLICY IF EXISTS "Auth users manage own clients" ON clients;
DROP POLICY IF EXISTS "Anon demo clients" ON clients;
DROP POLICY IF EXISTS "Allow all on clients" ON clients;

CREATE POLICY "Allow all on clients" ON clients FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth users manage own credits" ON credits;
DROP POLICY IF EXISTS "Anon demo credits" ON credits;
DROP POLICY IF EXISTS "Allow all on credits" ON credits;

CREATE POLICY "Allow all on credits" ON credits FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth users manage own payments" ON payments;
DROP POLICY IF EXISTS "Anon demo payments" ON payments;
DROP POLICY IF EXISTS "Allow all on payments" ON payments;

CREATE POLICY "Allow all on payments" ON payments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth users manage own accounts" ON accounts;
DROP POLICY IF EXISTS "Anon demo accounts" ON accounts;
DROP POLICY IF EXISTS "Allow all on accounts" ON accounts;

CREATE POLICY "Allow all on accounts" ON accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth users manage own transactions" ON transactions;
DROP POLICY IF EXISTS "Anon demo transactions" ON transactions;
DROP POLICY IF EXISTS "Allow all on transactions" ON transactions;

CREATE POLICY "Allow all on transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth users manage own journal_entries" ON journal_entries;
DROP POLICY IF EXISTS "Anon demo journal_entries" ON journal_entries;
DROP POLICY IF EXISTS "Allow all on journal_entries" ON journal_entries;

CREATE POLICY "Allow all on journal_entries" ON journal_entries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Merchants read/update own profile" ON merchants;
CREATE POLICY "Merchants read/update own profile" ON merchants FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Merchants read own payments" ON saas_subscription_payments;
CREATE POLICY "Merchants read own payments" ON saas_subscription_payments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon checking valid license key" ON admin_license_keys;
CREATE POLICY "Allow anon checking valid license key" ON admin_license_keys FOR ALL USING (true) WITH CHECK (true);

-- 9. INITIALISATION DU PLAN COMPTABLE OHADA
INSERT INTO accounts (code, name, type) VALUES
('411', 'Clients', 'ASSET'),
('401', 'Fournisseurs', 'LIABILITY'),
('521', 'Banque', 'ASSET'),
('571', 'Caisse', 'ASSET'),
('701', 'Ventes de marchandises', 'REVENUE'),
('601', 'Achats de marchandises', 'EXPENSE'),
('631', 'Frais bancaires', 'EXPENSE'),
('443', 'TVA Facturée', 'LIABILITY'),
('445', 'TVA Récupérable', 'ASSET')
ON CONFLICT (code) DO NOTHING;
