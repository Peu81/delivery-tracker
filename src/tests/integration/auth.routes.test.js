import { prisma } from '../../src/config/database.js';

beforeEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.usuario.deleteMany();
});