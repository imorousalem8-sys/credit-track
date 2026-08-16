-- ====================================================================================
-- CREDITTRACK PRO - SCHÉMA POSTGRESQL SUPABASE SÉCURISÉ & MULTI-TENANT
-- ====================================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE CLIENTS (AVEC ISOLATION MULTI-TENANT USER_ID)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    cni VARCHAR(100),
    preferred_payment_method VARCHAR(50) DEFAULT 'Espèces',
    payment_account VARCHAR(100),
    reliability_score INT DEFAULT 85 CHECK (reliability_score BETWEEN 0 AND 100),
    total_due DECIMAL(12, 2) DEFAULT 0 CHECK (total_due >= 0),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paid', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);

-- 3. TABLE CRÉDITS (VENTES À CRÉDIT & ÉCHÉANCES)
CREATE TABLE IF NOT EXISTS credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    due_date DATE NOT NULL,
    description TEXT,
    preferred_payment_method VARCHAR(50) DEFAULT 'Espèces',
    payment_account VARCHAR(100),
    penalty_rate DECIMAL(5, 2) DEFAULT 0 CHECK (penalty_rate >= 0),
    guarantor_name VARCHAR(255),
    guarantor_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paid', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_client_id ON credits(client_id);
CREATE INDEX IF NOT EXISTS idx_credits_due_date ON credits(due_date);

-- 4. TABLE PAIEMENTS (ENCAISSEMENTS & HISTORIQUE DES REÇUS)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) DEFAULT 'Espèces',
    reference VARCHAR(100),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);

-- 5. MODULE COMPTABILITÉ & CAISSE (SYSCOHADA)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_user_code ON accounts(COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid), code);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    reference VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id),
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_tx_id ON journal_entries(transaction_id);

-- 6. VUE SOLDE DES COMPTES (BALANCE COMPTABLE)
CREATE OR REPLACE VIEW account_balances AS
SELECT 
    a.id,
    a.user_id,
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
GROUP BY a.id, a.user_id, a.code, a.name, a.type;

-- 7. CONFIGURATION RLS (ROW LEVEL SECURITY) ÉTANCHE
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Politiques pour utilisateurs authentifiés (Isolation par commerçant)
DROP POLICY IF EXISTS "Auth users manage own clients" ON clients;
CREATE POLICY "Auth users manage own clients" ON clients FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Auth users manage own credits" ON credits;
CREATE POLICY "Auth users manage own credits" ON credits FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Auth users manage own payments" ON payments;
CREATE POLICY "Auth users manage own payments" ON payments FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Auth users manage own accounts" ON accounts;
CREATE POLICY "Auth users manage own accounts" ON accounts FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Auth users manage own transactions" ON transactions;
CREATE POLICY "Auth users manage own transactions" ON transactions FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Auth users manage own journal_entries" ON journal_entries;
CREATE POLICY "Auth users manage own journal_entries" ON journal_entries FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Politiques pour l'accès démonstration (anonyme sans compromettre les comptes enregistrés)
DROP POLICY IF EXISTS "Anon demo clients" ON clients;
CREATE POLICY "Anon demo clients" ON clients FOR ALL TO anon
USING (user_id IS NULL) WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "Anon demo credits" ON credits;
CREATE POLICY "Anon demo credits" ON credits FOR ALL TO anon
USING (user_id IS NULL) WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "Anon demo payments" ON payments;
CREATE POLICY "Anon demo payments" ON payments FOR ALL TO anon
USING (user_id IS NULL) WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "Anon demo accounts" ON accounts;
CREATE POLICY "Anon demo accounts" ON accounts FOR ALL TO anon
USING (user_id IS NULL) WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "Anon demo transactions" ON transactions;
CREATE POLICY "Anon demo transactions" ON transactions FOR ALL TO anon
USING (user_id IS NULL) WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "Anon demo journal_entries" ON journal_entries;
CREATE POLICY "Anon demo journal_entries" ON journal_entries FOR ALL TO anon
USING (user_id IS NULL) WITH CHECK (user_id IS NULL);

-- 8. MODULE SAAS : ABONNEMENTS, COMMERÇANTS & CLÉS DE LICENCE VIP ADMIN
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    plan_tier VARCHAR(20) DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro_monthly', 'pro_yearly', 'vip_lifetime')),
    subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'grace_period', 'expired', 'canceled')),
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
    payment_method VARCHAR(50) NOT NULL, -- 'fedapay', 'wave', 'orange_money', 'mtn_momo', 'card', 'vip_license'
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'completed',
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des Clés de Licence VIP Administrateur (Activations Gratuites / Famille / Partenaires)
CREATE TABLE IF NOT EXISTS admin_license_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_key VARCHAR(100) UNIQUE NOT NULL, -- ex: 'VIP-SALEM-2026-PRO'
    label VARCHAR(255) NOT NULL, -- ex: 'Licence Offerte Frère / Partenaire'
    plan_granted VARCHAR(20) DEFAULT 'vip_lifetime',
    max_uses INT DEFAULT 1,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion de clés VIP Administrateur par défaut
INSERT INTO admin_license_keys (license_key, label, plan_granted, max_uses) VALUES
('VIP-SALEM-PRO-2026', 'Licence Fondateur & Proches Salem', 'vip_lifetime', 100),
('CREDITTRACK-VIP-PASS', 'Pass VIP Spécial Famille', 'vip_lifetime', 50)
ON CONFLICT (license_key) DO NOTHING;

-- RLS pour Merchants & Abonnements
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_license_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Merchants read/update own profile" ON merchants;
CREATE POLICY "Merchants read/update own profile" ON merchants FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Merchants read own payments" ON saas_subscription_payments;
CREATE POLICY "Merchants read own payments" ON saas_subscription_payments FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow anon checking valid license key" ON admin_license_keys;
CREATE POLICY "Allow anon checking valid license key" ON admin_license_keys FOR SELECT
USING (is_active = TRUE);

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
ON CONFLICT DO NOTHING;
