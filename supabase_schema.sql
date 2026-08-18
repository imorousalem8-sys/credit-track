-- ====================================================================================
-- CREDITTRACK PRO - SCHÉMA POSTGRESQL SUPABASE COMPLET & STRICTEMENT SÉCURISÉ (RLS)
-- ====================================================================================
-- Protection absolue contre les fuites inter-commerçants (Multi-Tenant Isolation)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SUPPRESSION DE LA VUE TEMPORAIREMENT POUR PERMETTRE LA MISE À NIVEAU DES COLONNES
DROP VIEW IF EXISTS account_balances CASCADE;

-- 3. CRÉATION OU MISE À JOUR DE LA TABLE CLIENTS
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    cni VARCHAR(100),
    preferred_payment_method VARCHAR(50) DEFAULT 'Espèces',
    payment_account VARCHAR(100),
    reliability_score INT DEFAULT 85 CHECK (reliability_score >= 0 AND reliability_score <= 100),
    total_due DECIMAL(12, 2) DEFAULT 0 CHECK (total_due >= 0),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE clients ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE clients ADD COLUMN IF NOT EXISTS preferred_payment_method VARCHAR(50) DEFAULT 'Espèces';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_account VARCHAR(100);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS reliability_score INT DEFAULT 85;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS total_due DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);

-- 4. CRÉATION OU MISE À JOUR DE LA TABLE CRÉDITS
CREATE TABLE IF NOT EXISTS credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
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

-- 5. CRÉATION DE LA TABLE PAIEMENTS (ENCAISSEMENTS MARCHANDS)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) DEFAULT 'Espèces',
    reference VARCHAR(100),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE payments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);

-- 6. COMPTABILITÉ & CAISSE (SYSCOHADA)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, code)
);

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    reference VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, reference)
);

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id),
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);

-- 7. RECRÉATION DE LA VUE SOLDE DES COMPTES AVEC ISOLATION COMMERÇANT
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

-- 8. MODULE SAAS : COMMERÇANTS, ABONNEMENTS & CLÉS VIP ADMIN
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

-- Table des journaux d'audit de sécurité
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_event ON security_audit_logs(event_type);

-- 9. SÉCURITÉ ROW LEVEL SECURITY (RLS) STRICTE & ÉTANCHE (ZÉRO FUITE)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Politiques strictes : Chaque commerçant n'accède UNIQUEMENT qu'à ses propres données

-- Clients
DROP POLICY IF EXISTS "Users can only access their own clients" ON clients;
CREATE POLICY "Users can only access their own clients" ON clients
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Crédits
DROP POLICY IF EXISTS "Users can only access their own credits" ON credits;
CREATE POLICY "Users can only access their own credits" ON credits
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Paiements
DROP POLICY IF EXISTS "Users can only access their own payments" ON payments;
CREATE POLICY "Users can only access their own payments" ON payments
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Comptes
DROP POLICY IF EXISTS "Users can only access their own accounts" ON accounts;
CREATE POLICY "Users can only access their own accounts" ON accounts
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Transactions
DROP POLICY IF EXISTS "Users can only access their own transactions" ON transactions;
CREATE POLICY "Users can only access their own transactions" ON transactions
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Écritures de Journal
DROP POLICY IF EXISTS "Users can only access their own journal entries" ON journal_entries;
CREATE POLICY "Users can only access their own journal entries" ON journal_entries
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Profil Commerçant
DROP POLICY IF EXISTS "Users can only access their own merchant profile" ON merchants;
CREATE POLICY "Users can only access their own merchant profile" ON merchants
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Paiements d'abonnements
DROP POLICY IF EXISTS "Users can only access their own subscription payments" ON saas_subscription_payments;
CREATE POLICY "Users can only access their own subscription payments" ON saas_subscription_payments
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Clés Administrateur (Lecture protégée : Service Role ou Administrateur uniquement)
DROP POLICY IF EXISTS "Admin license keys protected" ON admin_license_keys;
CREATE POLICY "Admin license keys protected" ON admin_license_keys
FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

-- Journaux de sécurité (Insertion par authenticated, lecture service role)
DROP POLICY IF EXISTS "Users can create security logs" ON security_audit_logs;
CREATE POLICY "Users can create security logs" ON security_audit_logs
FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Only admins can view security logs" ON security_audit_logs;
CREATE POLICY "Only admins can view security logs" ON security_audit_logs
FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

-- 10. INITIALISATION DU PLAN COMPTABLE OHADA
INSERT INTO accounts (user_id, code, name, type) VALUES
('00000000-0000-0000-0000-000000000000', '411', 'Clients', 'ASSET'),
('00000000-0000-0000-0000-000000000000', '401', 'Fournisseurs', 'LIABILITY'),
('00000000-0000-0000-0000-000000000000', '521', 'Banque', 'ASSET'),
('00000000-0000-0000-0000-000000000000', '571', 'Caisse', 'ASSET'),
('00000000-0000-0000-0000-000000000000', '701', 'Ventes de marchandises', 'REVENUE'),
('00000000-0000-0000-0000-000000000000', '601', 'Achats de marchandises', 'EXPENSE'),
('00000000-0000-0000-0000-000000000000', '631', 'Frais bancaires', 'EXPENSE'),
('00000000-0000-0000-0000-000000000000', '443', 'TVA Facturée', 'LIABILITY'),
('00000000-0000-0000-0000-000000000000', '445', 'TVA Récupérable', 'ASSET')
ON CONFLICT (user_id, code) DO NOTHING;
