import { prisma } from '../../src/config/dbInit.js';

beforeEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.usuario.deleteMany();
});