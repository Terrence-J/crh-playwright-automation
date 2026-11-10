import { test as base } from '@playwright/test';
import { DemoLoginPage } from '../pages/DemoLoginPage';

export const test = base.extend<{ demoLoginPage: DemoLoginPage }>({
  demoLoginPage: async ({ page }, use) => {
    await use(new DemoLoginPage(page));
  },
});
export { expect } from '@playwright/test';

