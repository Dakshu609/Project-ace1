-- ============================================================================
-- ENUMS: All custom enum types (replaces inline CHECK constraints)
-- ============================================================================
-- Migrations: 001
-- Dependencies: 000
-- ============================================================================
-- NOTE: All enums use text-based CHECK constraints rather than native
-- CREATE TYPE for compatibility with Supabase's type system and to allow
-- future enum value additions without ALTER TYPE ... ADD VALUE locking.
-- ============================================================================

do $$ begin
  -- Not using CREATE TYPE to avoid migration rigidity.
  -- All enum validation is enforced via CHECK constraints on the columns.
  -- This design permits online schema evolution.
end $$;
