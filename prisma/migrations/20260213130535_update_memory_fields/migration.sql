/*
  Warnings:

  - You are about to drop the column `content` on the `Memory` table. All the data in the column will be lost.
  - Added the required column `date` to the `Memory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Memory` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `Memory` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Memory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "date" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Memory" ("createdAt", "id", "order", "title") SELECT "createdAt", "id", "order", "title" FROM "Memory";
DROP TABLE "Memory";
ALTER TABLE "new_Memory" RENAME TO "Memory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
