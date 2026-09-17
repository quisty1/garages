// Playwright projects for e2e, a11y, and visual tests against out/.

import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    launchOptions: {
      // Analytics allowlists production host; map it to localhost for SW/host checks.
      args: ['--host-resolver-rules=MAP metallmontage33.ru 127.0.0.1'],
    },
  },
  webServer: {
    command: `serve out -l ${PORT}`,
    url: BASE_URL,
    // Never validate a stale export left by an earlier local run.
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'e2e',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'a11y',
      testMatch: /a11y\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual',
      testMatch: /visual\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testMatch: /cross-browser\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testMatch: /cross-browser\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
