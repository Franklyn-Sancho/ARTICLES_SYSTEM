-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Articles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Articles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Articles" ("body", "createdAt", "id", "title", "userId") SELECT "body", "createdAt", "id", "title", "userId" FROM "Articles";
DROP TABLE "Articles";
ALTER TABLE "new_Articles" RENAME TO "Articles";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
