-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "rollNo" TEXT NOT NULL,
    "phone" TEXT,
    "isFrozen" BOOLEAN NOT NULL DEFAULT false,
    "frozenReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Duty" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DutyStudent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dutyId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DutyStudent_dutyId_fkey" FOREIGN KEY ("dutyId") REFERENCES "Duty" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DutyStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "dutyDate" DATETIME NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Report_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RotationQueue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "lastAssignedDate" DATETIME,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNo_key" ON "Student"("rollNo");

-- CreateIndex
CREATE INDEX "Student_floor_idx" ON "Student"("floor");

-- CreateIndex
CREATE INDEX "Student_isFrozen_idx" ON "Student"("isFrozen");

-- CreateIndex
CREATE UNIQUE INDEX "Duty_date_key" ON "Duty"("date");

-- CreateIndex
CREATE INDEX "DutyStudent_dutyId_idx" ON "DutyStudent"("dutyId");

-- CreateIndex
CREATE INDEX "DutyStudent_studentId_idx" ON "DutyStudent"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "DutyStudent_dutyId_studentId_key" ON "DutyStudent"("dutyId", "studentId");

-- CreateIndex
CREATE INDEX "Report_studentId_idx" ON "Report"("studentId");

-- CreateIndex
CREATE INDEX "Report_dutyDate_idx" ON "Report"("dutyDate");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RotationQueue_studentId_key" ON "RotationQueue"("studentId");

-- CreateIndex
CREATE INDEX "RotationQueue_floor_idx" ON "RotationQueue"("floor");

-- CreateIndex
CREATE INDEX "RotationQueue_priority_idx" ON "RotationQueue"("priority");
