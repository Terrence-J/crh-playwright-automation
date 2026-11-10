// Interactive, visible QA inspection. Does not save a draft or submit a request.
require('dotenv').config({ quiet: true });
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--remote-debugging-port=9225'] });
  try {
    const context = await browser.newContext({ storageState: 'playwright/.auth/ad-user.json', viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(process.env.CRH_BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.getByText('New Commercial Request', { exact: true }).click({ timeout: 60000 });
    const form = page.frameLocator('iframe[src*=sc-commercial-request]');
    await form.getByRole('radio', { name: /New Commercial Request/ }).click({ timeout: 60000 });
    await form.getByLabel('Site(s)', { exact: true }).click();
    await form.getByText('Amandelbult', { exact: true }).click();
    await form.locator('div.sapMHBox').filter({ has: form.getByText('Dishaba', { exact: true }) }).getByRole('checkbox').click();
    await form.getByRole('button', { name: 'Done', exact: true }).click();
    const area = form.getByRole('combobox', { name: 'Functional Area' });
    await area.fill('Supply Chain');
    await area.press('ArrowDown');
    await area.press('Enter');
    await form.locator('[id$=requirementTypeSelect]').click();
    await form.getByRole('option', { name: 'Services', exact: true }).click();
    await form.getByPlaceholder('Brief high-level description of what is being requested (used in workflow and approvals).').fill('QA AUTOMATION - Commercial request test');
    await form.getByPlaceholder('Describe the scope of Work.', { exact: false }).fill('QA automation test only: validate a non-production commercial request workflow. No real procurement is requested.');
    await form.locator('[id$=consideredLocalOpportunitiesRadio]').getByRole('radio', { name: 'Yes', exact: true }).click();
    await form.getByPlaceholder('e.g. Local supplier', { exact: false }).fill('QA test data only - no actual supplier assessment.');
    await form.locator('[id$=intermediaryRadio]').getByRole('radio', { name: 'No', exact: true }).click();
    await form.locator('[id$=soleSourceRadio]').getByRole('radio', { name: 'No', exact: true }).click();
    await form.getByRole('button', { name: 'Next Step' }).click();
    for (const label of ['Cost Center Owner', 'Company Representative']) {
      await form.getByRole('textbox', { name: label }).fill('rambau');
      await form.getByRole('listitem').filter({ hasText: 'tshifhiwa.rambau@valterraplatinum.com' }).click({ timeout: 30000 });
    }
    console.log('Financial stage ready; both directory entries selected.');
    await page.waitForTimeout(1800000);
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e.message); process.exitCode = 1; });
