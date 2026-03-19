import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USERNAMES_BY_FLOOR = {
  1: ['jarrusha', 'albabeck', 'gemmachi', 'lirabelmaxterz', 'efiraralkinfyn', 'travelsadrimor'],
  2: ['gladysjo', 'christib', 'lexamartyrion', 'kosvaldo', 'kybrelsamzter', 'dalvioquentisjarvick'],
  3: ['oskarhar', 'skytejal', 'jayeland', 'blytherm', 'onzarilexon', 'triveranymphadal', 'vekorlix'],
  4: ['visionti', 'spinneta', 'johnieer', 'elvinarkrestalfyn', 'lorzyndraquestor', 'lymorbrivian'],
};

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.botSession.deleteMany({});
  await prisma.report.deleteMany({});
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
      password: 'admin123', // In production, this should be hashed
      name: 'Admin User',
      role: 'admin',
    },
  });

  console.log('✓ Created default admin user (admin@smarthostel.com / admin123)');

  // Create students with provided usernames
  const students = [];

  for (let floor = 1; floor <= 4; floor++) {
    const floorUsernames = USERNAMES_BY_FLOOR[floor as keyof typeof USERNAMES_BY_FLOOR] || [];
    
    for (let i = 0; i < floorUsernames.length; i++) {
      const username = floorUsernames[i];

      const student = await prisma.student.create({
        data: {
          username,
          floor,
          note: `Student on floor ${floor}`,
          isFrozen: Math.random() < 0.1, // 10% frozen
          frozenReason: Math.random() < 0.1 ? 'Medical leave' : null,
        },
      });

      students.push(student);

      // Create rotation queue entry
      await prisma.rotationQueue.create({
        data: {
          studentId: student.id,
          floor,
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

    // Assign 3 students per floor
    for (let floor = 1; floor <= 4; floor++) {
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

  // Create sample reports
  for (let i = 0; i < 10; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const reportDate = new Date(today);
    reportDate.setDate(reportDate.getDate() - Math.floor(Math.random() * 5));

    await prisma.report.create({
      data: {
        studentId: student.id,
        dutyDate: reportDate,
        photoCount: Math.floor(Math.random() * 5) + 3,
        status: ['pending', 'approved', 'rejected'][
          Math.floor(Math.random() * 3)
        ],
      },
    });
  }

  console.log('✓ Created sample reports');
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
