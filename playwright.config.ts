// Playwright projects for e2e, a11y, and visual tests against out/.

import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const CHROMIUM_USE = {
  ...devices['Desktop Chrome'],
  launchOptions: {
    // Analytics allowlists the production host; map it to localhost for
    // Chromium-only analytics and service-worker checks.
    args: ['--host-resolver-rules=MAP metallmontage33.ru 127.0.0.1'],
  },
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
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
      use: CHROMIUM_USE,
    },
    {
      name: 'a11y',
      testMatch: /a11y\/.*\.spec\.ts/,
      use: CHROMIUM_USE,
    },
    {
      name: 'visual',
      testMatch: /visual\/.*\.spec\.ts/,
      use: CHROMIUM_USE,
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
