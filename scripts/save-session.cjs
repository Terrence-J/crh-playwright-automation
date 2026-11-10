const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
const path = require('node:path');
const fs = require('node:fs/promises');
const readline = require('node:readline/promises');

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
  quiet: true,
});

async function saveSession() {
  const appUrl = process.env.CRH_BASE_URL;

  if (!appUrl) {
    throw new Error('Set CRH_BASE_URL in your .env file first.');
  }

  const authFile = path.resolve(
    __dirname,
    '../playwright/.auth/ad-user.json'
  );

  await fs.mkdir(path.dirname(authFile), { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  });

  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(appUrl);

    await terminal.question(
      '\nSign in with AD and complete MFA if prompted.\n' +
      'Wait for your launchpad tiles to load, then open CRH.\n' +
      'When CRH has fully loaded, return here and press Enter.\n'
    );

    await context.storageState({
      path: authFile,
      indexedDB: true,
    });

    console.log('\nSession saved to playwright/.auth/ad-user.json');
  } finally {
    terminal.close();
    await browser.close();
  }
}

saveSession().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});