import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.js', '**/*.spec.js'],
  
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/server.js',
  ],
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
  setupFilesAfterFramework: ['./tests/setup.js'],
};