-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "badge" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "productId" TEXT,
ADD COLUMN     "subtext" TEXT;

-- CreateIndex
CREATE INDEX "Banner_productId_idx" ON "Banner"("productId");

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

