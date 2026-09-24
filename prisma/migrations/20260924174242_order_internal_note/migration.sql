-- Owner-only internal note on an order (nullable, additive).
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "internalNote" TEXT;
