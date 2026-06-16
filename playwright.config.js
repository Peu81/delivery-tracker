import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    workers: 1,
    testMatch: '**/*.spec.js',
    use: {
        baseURL: 'http://localhost:3000',
        screenshot: 'only-on-failure',
    },
    webServer: {
        command: 'node ../src/server.js',
        url: 'http://localhost:3000/painel',
        reuseExistingServer: !process.env.CI
    }
});