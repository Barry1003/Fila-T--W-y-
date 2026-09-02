-- AlterTable
ALTER TABLE "User" ADD COLUMN     "appwriteId" TEXT,
ADD COLUMN     "avatarUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_appwriteId_key" ON "User"("appwriteId");

-- CreateIndex
CREATE INDEX "User_appwriteId_idx" ON "User"("appwriteId");

