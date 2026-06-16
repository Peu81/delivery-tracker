import dotenv from 'dotenv';

dotenv.config({ path: '.env.test', override: true });

beforeAll(async () => {
  const dbModule = await import('../src/config/dbInit.js');
  prisma = dbModule.prisma;
  await prisma.$connect();
});

afterAll(async () => {
  if (prisma) {
     await prisma.$disconnect();
  };
});