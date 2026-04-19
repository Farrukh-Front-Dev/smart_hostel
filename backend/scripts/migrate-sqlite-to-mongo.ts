import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient as MongoPrismaClient } from '@prisma/client';
import { PrismaClient as SqlitePrismaClient } from '../generated/sqlite-client';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.SQLITE_DATABASE_URL) {
  process.env.SQLITE_DATABASE_URL = 'file:./prisma/dev.db';
}

const sqlite = new SqlitePrismaClient();
const mongo = new MongoPrismaClient();

async function clearMongoDatabase() {
  await mongo.dutyStudent.deleteMany({});
  await mongo.payment.deleteMany({});
  await mongo.duty.deleteMany({});
  await mongo.rotationQueue.deleteMany({});
  await mongo.student.deleteMany({});
  await mongo.settings.deleteMany({});
  await mongo.user.deleteMany({});
}

async function main() {
  if (!process.env.DATABASE_URL?.startsWith('mongodb')) {
    throw new Error('DATABASE_URL must point to MongoDB before running this migration');
  }

  const [
    users,
    students,
    queues,
    duties,
    dutyStudents,
    settings,
    payments,
  ] = await Promise.all([
    sqlite.user.findMany({ orderBy: { id: 'asc' } }),
    sqlite.student.findMany({ orderBy: { id: 'asc' } }),
    sqlite.rotationQueue.findMany({ orderBy: { id: 'asc' } }),
    sqlite.duty.findMany({ orderBy: { id: 'asc' } }),
    sqlite.dutyStudent.findMany({ orderBy: { id: 'asc' } }),
    sqlite.settings.findMany({ orderBy: { id: 'asc' } }),
    sqlite.payment.findMany({ orderBy: { id: 'asc' } }),
  ]);

  console.log(`Found ${students.length} students and ${payments.length} payments in SQLite`);

  await clearMongoDatabase();

  const studentIdMap = new Map<number, string>();
  const dutyIdMap = new Map<number, string>();

  for (const user of users) {
    await mongo.user.create({
      data: {
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  for (const setting of settings) {
    await mongo.settings.create({
      data: {
        key: setting.key,
        value: setting.value,
        createdAt: setting.createdAt,
        updatedAt: setting.updatedAt,
      },
    });
  }

  for (const student of students) {
    const created = await mongo.student.create({
      data: {
        username: student.username,
        floor: student.floor,
        room: student.room,
        fullName: student.fullName,
        note: student.note,
        ...(student.telegramId ? { telegramId: student.telegramId } : {}),
        isFrozen: student.isFrozen,
        frozenReason: student.frozenReason,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      },
    });

    studentIdMap.set(student.id, created.id);
  }

  for (const queue of queues) {
    const studentId = studentIdMap.get(queue.studentId);
    if (!studentId) {
      throw new Error(`Missing student mapping for rotationQueue.studentId=${queue.studentId}`);
    }

    await mongo.rotationQueue.create({
      data: {
        studentId,
        floor: queue.floor,
        lastAssignedDate: queue.lastAssignedDate,
        priority: queue.priority,
        createdAt: queue.createdAt,
        updatedAt: queue.updatedAt,
      },
    });
  }

  for (const duty of duties) {
    const created = await mongo.duty.create({
      data: {
        date: duty.date,
        status: duty.status,
        createdAt: duty.createdAt,
        updatedAt: duty.updatedAt,
      },
    });

    dutyIdMap.set(duty.id, created.id);
  }

  for (const assignment of dutyStudents) {
    const dutyId = dutyIdMap.get(assignment.dutyId);
    const studentId = studentIdMap.get(assignment.studentId);

    if (!dutyId || !studentId) {
      throw new Error(`Missing relation mapping for dutyStudent.id=${assignment.id}`);
    }

    await mongo.dutyStudent.create({
      data: {
        dutyId,
        studentId,
        floor: assignment.floor,
        createdAt: assignment.createdAt,
      },
    });
  }

  for (const payment of payments) {
    const studentId = studentIdMap.get(payment.studentId);
    if (!studentId) {
      throw new Error(`Missing student mapping for payment.id=${payment.id}`);
    }

    await mongo.payment.create({
      data: {
        studentId,
        amount: payment.amount,
        month: payment.month,
        status: payment.status,
        imageUrl: payment.imageUrl,
        submittedAt: payment.submittedAt,
        reviewedAt: payment.reviewedAt,
        reviewedBy: payment.reviewedBy,
        note: payment.note,
      },
    });
  }

  console.log('SQLite to MongoDB migration completed successfully');
}

main()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await Promise.all([sqlite.$disconnect(), mongo.$disconnect()]);
  });
