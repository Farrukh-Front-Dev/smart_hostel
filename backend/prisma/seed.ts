import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Load real student data from JSON file
const studentsJsonPath = path.join(__dirname, '..', '..', 'students.json');
const studentsData = JSON.parse(fs.readFileSync(studentsJsonPath, 'utf-8'));

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.dutyStudent.deleteMany({});
  await prisma.duty.deleteMany({});
  await prisma.rotationQueue.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✓ Cleared existing data');

  // Create default admin user
  await prisma.user.create({
    data: {
      email: 'admin@smarthostel.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
    },
  });

  console.log('✓ Created default admin user (admin@smarthostel.com / admin123)');

  // Create or update default settings
  await prisma.settings.upsert({
    where: { key: 'duty_message_format' },
    update: { value: 'simple' },
    create: {
      key: 'duty_message_format',
      value: 'simple',
    },
  });

  console.log('✓ Created default settings');

  // Create students with provided usernames
  const students = [];

  // Floor 1 (qizlar)
  if (studentsData['1']) {
    for (const studentData of studentsData['1']) {
      const student = await prisma.student.create({
        data: {
          username: studentData.nickname,
          floor: 1,
          room: studentData.room,
          fullName: studentData.name,
          note: null,
          ...(studentData.telegram_id
            ? { telegramId: studentData.telegram_id.toString() }
            : {}),
          isFrozen: false,
        },
      });

      students.push(student);

      // Create rotation queue entry
      await prisma.rotationQueue.create({
        data: {
          studentId: student.id,
          floor: 1,
          priority: 0,
        },
      });
    }
  }

  // Floor 3 (o'g'il bolalar)
  if (studentsData['3']) {
    for (const studentData of studentsData['3']) {
      const student = await prisma.student.create({
        data: {
          username: studentData.nickname,
          floor: 3,
          room: studentData.room,
          fullName: studentData.name,
          note: null,
          ...(studentData.telegram_id
            ? { telegramId: studentData.telegram_id.toString() }
            : {}),
          isFrozen: false,
        },
      });

      students.push(student);

      // Create rotation queue entry
      await prisma.rotationQueue.create({
        data: {
          studentId: student.id,
          floor: 3,
          priority: 0,
        },
      });
    }
  }

  // Floor 4 (o'g'il bolalar)
  if (studentsData['4']) {
    for (const studentData of studentsData['4']) {
      const student = await prisma.student.create({
        data: {
          username: studentData.nickname,
          floor: 4,
          room: studentData.room,
          fullName: studentData.name,
          note: null,
          ...(studentData.telegram_id
            ? { telegramId: studentData.telegram_id.toString() }
            : {}),
          isFrozen: false,
        },
      });

      students.push(student);

      // Create rotation queue entry
      await prisma.rotationQueue.create({
        data: {
          studentId: student.id,
          floor: 4,
          priority: 0,
        },
      });
    }
  }

  console.log(`✓ Created ${students.length} students`);

  // Generate duties for next 7 days
  const today = new Date();
  for (let day = 0; day < 7; day++) {
    const dutyDate = new Date(today);
    dutyDate.setDate(dutyDate.getDate() + day);
    dutyDate.setHours(0, 0, 0, 0);

    const duty = await prisma.duty.create({
      data: {
        date: dutyDate,
        status: day === 0 ? 'posted' : 'pending',
      },
    });

    // Assign 3 students per floor (only floors 1, 3, 4)
    for (const floor of [1, 3, 4]) {
      const floorStudents = students.filter(
        (s) => s.floor === floor && !s.isFrozen
      );

      // Randomly select 3 students
      const selected = floorStudents
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      for (const student of selected) {
        await prisma.dutyStudent.create({
          data: {
            dutyId: duty.id,
            studentId: student.id,
            floor,
          },
        });
      }
    }
  }

  console.log('✓ Generated duties for next 7 days');
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
