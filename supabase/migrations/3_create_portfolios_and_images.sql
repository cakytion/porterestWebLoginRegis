-- 1. Add a bridge column to the existing 'users' table
-- This allows us to map the Supabase UUID (auth.uid()) to your internal BigInt ID.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'auth_user_id') THEN
        ALTER TABLE "public"."users" 
        ADD COLUMN "auth_user_id" uuid REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- Optional: Create an index for performance since RLS will query this often
        CREATE INDEX idx_users_auth_user_id ON "public"."users" (auth_user_id);
    END IF;
END $$;

-- 2. Create portfolios table
CREATE TABLE IF NOT EXISTS "public"."portfolios" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "owner_id" bigint NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "description" text,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- 3. Create portfolio_images table
CREATE TABLE IF NOT EXISTS "public"."portfolio_images" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "portfolio_id" uuid NOT NULL REFERENCES "public"."portfolios"("id") ON DELETE CASCADE,
    "image_url" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE "public"."portfolios" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."portfolio_images" ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Fixed for BigInt vs UUID mismatch)

-- Policy: Students can manage own portfolios
-- Logic: Find the BigInt ID in 'users' that matches the logged-in UUID, then compare.
CREATE POLICY "Students can manage own portfolios" ON "public"."portfolios"
    FOR ALL USING (
        owner_id = (
            SELECT id FROM "public"."users" WHERE auth_user_id = auth.uid()
        )
    )
    WITH CHECK (
        owner_id = (
            SELECT id FROM "public"."users" WHERE auth_user_id = auth.uid()
        )
    );

-- Policy: Students manage images
-- Logic: Allow if the parent portfolio belongs to the user (resolved via the same lookup).
CREATE POLICY "Students manage images" ON "public"."portfolio_images"
    FOR ALL USING (
        portfolio_id IN (
            SELECT id FROM "public"."portfolios" 
            WHERE owner_id = (
                SELECT id FROM "public"."users" WHERE auth_user_id = auth.uid()
            )
        )
    ) WITH CHECK (
        portfolio_id IN (
            SELECT id FROM "public"."portfolios" 
            WHERE owner_id = (
                SELECT id FROM "public"."users" WHERE auth_user_id = auth.uid()
            )
        )
    );

-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolios_owner_id ON "public"."portfolios"(owner_id);
CREATE INDEX IF NOT EXISTS idx_images_portfolio_id ON "public"."portfolio_images"(portfolio_id);