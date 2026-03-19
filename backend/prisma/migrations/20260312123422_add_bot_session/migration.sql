/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `Report` table. All the data in the column will be lost.
  - Added the required column `username` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "BotSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "dutyDate" DATETIME NOT NULL,
    "step" TEXT NOT NULL DEFAULT 'nickname',
    "nickname" TEXT,
    "photoCount" INTEGER NOT NULL DEFAULT 0,
    "messageIds" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BotSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Duty" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Duty" ("createdAt", "date", "id", "updatedAt") SELECT "createdAt", "date", "id", "updatedAt" FROM "Duty";
DROP TABLE "Duty";
ALTER TABLE "new_Duty" RENAME TO "Duty";
CREATE UNIQUE INDEX "Duty_date_key" ON "Duty"("date");
CREATE TABLE "new_Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "dutyDate" DATETIME NOT NULL,
    "photoCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Report_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Report" ("createdAt", "dutyDate", "id", "notes", "status", "studentId", "updatedAt") SELECT "createdAt", "dutyDate", "id", "notes", "status", "studentId", "updatedAt" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
CREATE INDEX "Report_studentId_idx" ON "Report"("studentId");
CREATE INDEX "Report_dutyDate_idx" ON "Report"("dutyDate");
CREATE INDEX "Report_status_idx" ON "Report"("status");
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "rollNo" TEXT NOT NULL,
    "phone" TEXT,
    "telegramId" TEXT,
    "isFrozen" BOOLEAN NOT NULL DEFAULT false,
    "frozenReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Student" ("createdAt", "email", "floor", "frozenReason", "id", "isFrozen", "name", "phone", "rollNo", "updatedAt") SELECT "createdAt", "email", "floor", "frozenReason", "id", "isFrozen", "name", "phone", "rollNo", "updatedAt" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_username_key" ON "Student"("username");
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
CREATE UNIQUE INDEX "Student_rollNo_key" ON "Student"("rollNo");
CREATE UNIQUE INDEX "Student_telegramId_key" ON "Student"("telegramId");
CREATE INDEX "Student_floor_idx" ON "Student"("floor");
CREATE INDEX "Student_isFrozen_idx" ON "Student"("isFrozen");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "BotSession_dutyDate_idx" ON "BotSession"("dutyDate");

-- CreateIndex
CREATE INDEX "BotSession_status_idx" ON "BotSession"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BotSession_studentId_dutyDate_key" ON "BotSession"("studentId", "dutyDate");
