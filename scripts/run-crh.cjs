require('dotenv').config({ quiet: true });
const { spawnSync } = require('node:child_process');
if (!process.env.CRH_BASE_URL) {
  console.error('Set CRH_BASE_URL in .env before running CRH tests.');
  process.exit(1);
}
try {
  const url = new URL(process.env.CRH_BASE_URL);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid protocol');
} catch {
  console.error('CRH_BASE_URL must be a valid http:// or https:// URL.');
  process.exit(1);
}
const result = spawnSync(process.execPath, [require.resolve('@playwright/test/cli'), 'test', '--project=crh-chromium', ...process.argv.slice(2)], { stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
