// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chrome',                     // runs your existing Chrome
      use: {
        channel: 'chrome',               // use system Chrome
        // channel: 'msedge',            // uncomment this if you prefer Edge
      },
    },
  ],
});