/*
  Warnings:

  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `rollNo` on the `Student` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "phone" TEXT,
    "note" TEXT,
    "telegramId" TEXT,
    "isFrozen" BOOLEAN NOT NULL DEFAULT false,
    "frozenReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Student" ("createdAt", "email", "floor", "frozenReason", "id", "isFrozen", "phone", "telegramId", "updatedAt", "username") SELECT "createdAt", "email", "floor", "frozenReason", "id", "isFrozen", "phone", "telegramId", "updatedAt", "username" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_username_key" ON "Student"("username");
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
CREATE UNIQUE INDEX "Student_telegramId_key" ON "Student"("telegramId");
CREATE INDEX "Student_floor_idx" ON "Student"("floor");
CREATE INDEX "Student_isFrozen_idx" ON "Student"("isFrozen");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
