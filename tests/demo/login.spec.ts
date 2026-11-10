import { test, expect } from '../../fixtures/test';

test.beforeEach(async ({ demoLoginPage }) => {
  await demoLoginPage.open();
});

test('valid demo user reaches dashboard @smoke', async ({ demoLoginPage, page }) => {
  await demoLoginPage.login('tester@example.test', 'demo-password');
  await expect(page.getByRole('heading', { name: 'Demo dashboard', exact: true })).toBeVisible();
  await expect(page.getByText('Signed in as tester@example.test', { exact: true })).toBeVisible();
});

test('invalid password displays an error @regression', async ({ demoLoginPage, page }) => {
  await demoLoginPage.login('tester@example.test', 'incorrect-password');
  await expect(demoLoginPage.error).toHaveText('Invalid email or password.');
  await expect(page.getByRole('heading', { name: 'Demo dashboard', exact: true })).toHaveCount(0);
});

test('a new test has a fresh browser context @regression', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Demo dashboard', exact: true })).toHaveCount(0);
});
