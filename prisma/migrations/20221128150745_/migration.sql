/*
  Warnings:

  - A unique constraint covering the columns `[articlesId]` on the table `Contributor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Contributor_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Contributor_articlesId_key" ON "Contributor"("articlesId");
