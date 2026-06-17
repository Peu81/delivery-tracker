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
  setupFiles: ['./tests/env-setup.js'],

  setupFilesAfterEnv: ['./tests/setup.js'],
};