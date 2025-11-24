
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user role enum if not exists
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'viewer', 'administrator');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    email text UNIQUE NOT NULL,
    full_name text,
    avatar_url text,
    role user_role NOT NULL
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create portfolio_images table
CREATE TABLE IF NOT EXISTS portfolio_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id uuid NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Students can manage own portfolios" ON portfolios
    FOR ALL USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Students manage images" ON portfolio_images
    FOR ALL USING (
        portfolio_id IN (SELECT id FROM portfolios WHERE owner_id = auth.uid())
    ) WITH CHECK (
        portfolio_id IN (SELECT id FROM portfolios WHERE owner_id = auth.uid())
    );

-- Optional: Indexes to improve performance
CREATE INDEX IF NOT EXISTS idx_portfolios_owner_id ON portfolios(owner_id);
CREATE INDEX IF NOT EXISTS idx_images_portfolio_id ON portfolio_images(portfolio_id);
