-- Keep the full image and let the owner place its subject in storefront crops.
ALTER TABLE "ProductImage"
  ADD COLUMN IF NOT EXISTS "focalX" INTEGER NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS "focalY" INTEGER NOT NULL DEFAULT 50;
