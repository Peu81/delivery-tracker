import { prisma } from '../src/config/dbInit.js'; 

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  // Limpeza isolada do banco SQLite
  const tables = await prisma.$queryRaw`
    SELECT name FROM sqlite_schema 
    WHERE type='table' 
    AND name NOT LIKE 'sqlite_%' 
    AND name != '_prisma_migrations';
  `;

  for (const table of tables) {
    await prisma.$queryRawUnsafe(`DELETE FROM "${table.name}";`);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});