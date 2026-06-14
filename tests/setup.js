import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

import { prisma } from '../src/config/dbInit.js';

beforeAll(async () => {

});

afterAll(async () => {
  await prisma.$disconnect();
});