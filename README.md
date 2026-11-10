# CRH Playwright automation framework

A fresh TypeScript project using Playwright Test. Start with a working local demo, then add verified CRH flows. No CRH login selectors or business rules are assumed.

## 1. Open in IntelliJ

1. Extract the ZIP and open the `crh-playwright-framework` folder in IntelliJ IDEA.
2. Install Node.js 22 LTS or 24 LTS, then restart IntelliJ so its terminal sees Node.
3. Open IntelliJ's Terminal and check `node --version` and `npm --version`.
4. Run these commands from the folder containing `package.json`:

```powershell
npm ci
npx playwright install chromium
Copy-Item .env.example .env
npm run typecheck
npm test
npm run report
```

On macOS/Linux, use `cp .env.example .env` instead of `Copy-Item`. On Linux CI install browser dependencies with `npx playwright install --with-deps chromium`.

`npm test` starts the bundled demo server, runs three demo tests in Chromium, and stops the server. It needs no external website or credentials. A green demo run verifies the framework only; it does not prove that CRH works.

## 2. Project structure

| Path | Purpose |
| --- | --- |
| `playwright.config.ts` | Browser projects, timeouts, retries and reporters |
| `pages/DemoLoginPage.ts` | Page object showing accessible locators and reusable actions |
| `fixtures/test.ts` | Supplies a fresh page object to each test |
| `tests/demo/login.spec.ts` | Successful login, failed login and isolated starting state |
| `tests/crh/availability.spec.ts` | Optional check of your configured CRH entry point |
| `demo/server.cjs` | Local practice app; never use as a real login service |
| `scripts/run-crh.cjs` | Validates the URL before starting CRH tests |
| `.env.example` | Environment configuration template |
| `azure-pipelines.yml` | Optional demo CI pipeline template |
| `test-results/` | Generated JUnit report and failure evidence |
| `playwright-report/` | Generated HTML report |

## 3. Run and debug

| Command | Action |
| --- | --- |
| `npm test` | Run demo suite headlessly |
| `npm run test:headed` | Run with browser visible |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:debug` | Step through tests in the inspector |
| `npm run test:smoke` | Run demo smoke tests |
| `npm run test:regression` | Run demo regression tests |
| `npm run typecheck` | Check TypeScript types |
| `npm run report` | Open the last HTML report |
| `npm run test:crh` | Run configured CRH availability check |

To run one test:

```powershell
npm test -- --grep "invalid password"
```

Playwright creates an isolated browser context for each test. Tests use automatic locator waiting and web assertions rather than fixed sleeps. Failed tests retain a screenshot, video and trace. Open traces through the HTML report. Treat reports and traces from real CRH sessions as sensitive because they can contain application data.

## 4. Connect CRH

Set your actual QA/SIT application URL in `.env`:

```dotenv
CRH_BASE_URL=https://your-actual-crh-qa-host/application-path
```

Then run:

```powershell
npm run auth:save
npm run test:crh
```

The authentication command opens a separate visible browser. Sign in manually and complete any MFA, then follow the prompt to save the browser state. The CRH project loads `playwright/.auth/ad-user.json` for subsequent tests. Treat this file as a password: it is Git-ignored, but anyone who can read it may be able to use the session. Never share it or publish it as an artifact. When the session expires, run `npm run auth:save` again. Some SSO flows depend on session storage or device-bound tokens, which storage state alone may not preserve.

The availability test checks the HTTP response and confirms that navigation remains on the configured launchpad origin; it does not yet verify launchpad tiles or a CRH business workflow. Missing or expired authentication requires a new manual sign-in.

Next, inspect the real login and dashboard before writing `pages/CrhLoginPage.ts`, dashboard page objects and `tests/crh/login.spec.ts`. The included `DemoLoginPage` selectors belong only to the demo. SAP Work Zone/SSO can involve redirects, frames or MFA, so the real flow must be observed first. Keep secrets in local environment variables or your CI secret store; `.env` and `playwright/.auth/` are ignored by Git.

For future authenticated suites, save an approved test account's storage state under `playwright/.auth/` and configure it only for the appropriate role/project. Site Viewer, Requestor and Admin tests should have separate authenticated states. Use dedicated data and avoid concurrent tests mutating the same request or assignment.

## 5. Add a test

Add real page objects under `pages/` and tests under `tests/crh/`. Prefer `getByRole`, `getByLabel` or stable test IDs verified in the application. Keep actions in page objects and expected business outcomes in tests. Use `@smoke` or `@regression` in test names to filter suites.

The project uses Playwright Test directly; it does not require Java, Maven, TestNG or Cucumber. IntelliJ terminal commands work independently of editor plugins. If PowerShell blocks `npm.ps1`, use `npm.cmd` and `npx.cmd` for the commands above.

## 6. Optional Azure DevOps pipeline

The pipeline template runs the demo suite and publishes JUnit results and HTML/evidence artifacts. Point a new Azure Pipeline at `azure-pipelines.yml` after adding the project to your repository. Change the trigger branch if needed. It does not run CRH or contain credentials.

## Official references

- [Playwright installation](https://playwright.dev/docs/intro)
- [Configuration](https://playwright.dev/docs/test-configuration)
- [Page objects](https://playwright.dev/docs/pom)
- [Authentication](https://playwright.dev/docs/auth)
