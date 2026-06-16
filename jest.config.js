import dotenv from 'dotenv';

dotenv.config({ path: '.env.test', override: true});

export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.js', '**/*.spec.js'],
  
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/server.js',
  ],
  coverageThreshold: {
    './src/services/': { statements: 80 },
    './src/middlewares/': { statements: 85 },
    './src/utils/': { statements: 75 }
  },
  setupFilesAfterFramework: ['./tests/setup.js'],
};