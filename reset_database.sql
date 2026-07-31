-- SK Sure Wins Database Reset Script
-- WARNING: This will drop existing tables and data! Run only when resetting.

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS won_tickets CASCADE;
DROP TABLE IF EXISTS free_hooks CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;

-- 1. Admin Users Table (For Secure Portal)
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    mfa_secret TEXT, -- For TOTP/2FA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Clients Table (Normalized with Session Token for Anti-Sharing)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT,
    pin TEXT,
    session_token UUID, -- Used to strictly lock a session to one device
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Index for 1M+ Users checking logins
CREATE INDEX idx_clients_phone ON clients(phone);

-- 3. Packages Table (Odd 2, Odd 3, VIP, etc.)
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price_ugx INTEGER NOT NULL,
    duration_days INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Packages (Example Data)
INSERT INTO packages (name, price_ugx, duration_days) VALUES
    ('Odd 2 (Daily)', 10000, 1),
    ('Odd 3 (Daily)', 15000, 1),
    ('VIP Ticket (Weekly)', 50000, 7),
    ('Life Changer (Monthly)', 150000, 30);

-- 4. Subscriptions Table (A client can have multiple packages)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Index for fast expiration checks
CREATE INDEX idx_subs_client_status_expires ON subscriptions(client_id, status, expires_at);

-- 5. Premium Tickets Table (Linked specifically to a package)
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    odds_total NUMERIC,
    booking_code TEXT,
    match_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tickets_package ON tickets(package_id);

-- 6. Won Tickets (Public History)
CREATE TABLE won_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Free Hooks (Public Teasers)
CREATE TABLE free_hooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Testimonials (Reviews)
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Transactions Table (For Airtel/MTN Payments API)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id TEXT UNIQUE NOT NULL,
    amount NUMERIC NOT NULL,
    phone TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    package_id UUID REFERENCES packages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_ref ON transactions(reference_id);

-- 10. Audit Logs (Admin Extreme Security - Tracking every action)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Set Default Admin User (Password: admin123)
-- IMPORTANT: Update password and configure MFA immediately in production!
INSERT INTO admin_users (username, password_hash) VALUES 
('ADMIN', 'admin123');
