-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "blurb" TEXT,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "tagline" TEXT;

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

