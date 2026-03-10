-- AlterTable Ledger: add balanceAfter (schema had it; init migration did not).
-- Existing rows get 0 as we don't have historical balance snapshots.
ALTER TABLE "Ledger" ADD COLUMN IF NOT EXISTS "balanceAfter" DECIMAL(65,30) NOT NULL DEFAULT 0;
