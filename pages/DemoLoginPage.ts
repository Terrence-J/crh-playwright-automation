import { expect, type Locator, type Page } from '@playwright/test';

/** Example page object for the bundled demo, not SAP/CRH login selectors. */
export class DemoLoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly signIn: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.email = page.getByLabel('Email', { exact: true });
    this.password = page.getByLabel('Password', { exact: true });
    this.signIn = page.getByRole('button', { name: 'Sign in', exact: true });
    this.error = page.getByRole('alert');
  }

  async open() {
    await this.page.goto('/');
    await expect(this.page.getByRole('heading', { name: 'Framework demo' })).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.signIn.click();
  }
}
