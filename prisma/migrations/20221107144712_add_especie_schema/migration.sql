-- CreateTable
CREATE TABLE "Especie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "reino" TEXT NOT NULL,
    "filo" TEXT NOT NULL,
    "classe" TEXT NOT NULL,
    "infraclasse" TEXT NOT NULL,
    "ordem" TEXT NOT NULL,
    "familia" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "especie" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Especie_name_key" ON "Especie"("name");
