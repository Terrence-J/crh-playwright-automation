import { test, expect } from '@playwright/test';

test('configured CRH entry point responds @smoke', async ({ page, baseURL }) => {
  test.skip(!baseURL, 'Set CRH_BASE_URL in .env to enable CRH availability checks.');
  const url = new URL(baseURL!);
  expect(['https:', 'http:']).toContain(url.protocol);
  const response = await page.goto(url.href);
  expect(response, 'Expected an HTTP response from the configured entry point').not.toBeNull();
  expect(response!.status(), 'Entry point or identity-provider response must be successful').toBeLessThan(400);
  const finalUrl = new URL(page.url());
  expect(finalUrl.origin, 'The saved session may have expired: the browser was redirected away from the CRH launchpad. Run npm run auth:save again.').toBe(url.origin);
});
