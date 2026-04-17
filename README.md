# QA Automation Take-Home

This repository is a production-minded Playwright TypeScript automation foundation for the [Thinking Tester Contact List App](https://thinking-tester-contact-list.herokuapp.com). The app is a public demo built specifically for UI and API practice, with user login plus contact create/read/update/delete flows exposed through both the browser and [HTTP API](https://documenter.getpostman.com/view/4012288/TzK2bEa8).

The implemented automation scope covers two test levels:

- API tests for authorization, contact listing, schema validation, resource creation, negative validation, status codes, and response time checks.
- E2E tests for successful and unsuccessful login, page navigation, form validation, valid contact creation, and UI rendering of data prepared through the API.

## Selected Stack

- Language: TypeScript
- Test runner/framework: Playwright Test
- UI/E2E automation: Playwright browser automation
- API automation: Playwright `APIRequestContext`
- Schema validation: Zod
- Reporting: Playwright HTML report
- Quality checks: ESLint, Prettier, TypeScript strict mode
- CI/CD: GitHub Actions

See [docs/stack-decision.md](docs/stack-decision.md) for the language and tooling rationale.

## Installation

Requirements:

- Node.js 22 or newer
- npm

Install dependencies and the Chromium browser used by the E2E suite:

```bash
npm ci
npx playwright install chromium
```

For first-time local setup from a fresh clone, copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Environment Configuration

`TEST_ENV` selects the target environment. Supported values are `dev`, `staging`, and `prod`.

```dotenv
TEST_ENV=dev
DEV_BASE_URL=https://thinking-tester-contact-list.herokuapp.com
DEV_API_BASE_URL=https://thinking-tester-contact-list.herokuapp.com
MAX_API_RESPONSE_TIME_MS=10000
```

The public demo has one shared deployment, so the default dev/staging/prod URLs point to the same host. The separation is still implemented in configuration so real project URLs can be supplied without changing test code.

Environment variables:

- `TEST_ENV`: target environment name, default `dev`
- `{ENV}_BASE_URL`: UI base URL for the selected environment
- `{ENV}_API_BASE_URL`: API base URL for the selected environment
- `MAX_API_RESPONSE_TIME_MS`: response time threshold used by API assertions

## Local Execution

Run all tests:

```bash
npm test
```

Run quality checks:

```bash
npm run lint
npm run typecheck
npm run format:check
```

Run API tests only:

```bash
npm run test:api
```

Run E2E tests only:

```bash
npm run test:e2e
```

Run E2E tests headed:

```bash
npm run test:e2e:headed
```

## Reports

Playwright generates an HTML report after each test run:

```bash
npm run report
```

Report output is written to `playwright-report/`. Raw traces, screenshots, and videos for failures are written to `test-results/`.

## CI Notes

The GitHub Actions workflow in `.github/workflows/playwright.yml` runs on `push` and `pull_request`.

Pipeline steps:

- install dependencies with `npm ci`
- install Chromium with Playwright
- run linting
- run TypeScript type checks
- run API and E2E tests
- upload the Playwright HTML report and test artifacts

Retries are enabled only in CI through Playwright config. This keeps local failures visible while reducing occasional public-demo/network flakes in the pipeline.

## Project Structure

```text
.
|-- .github/workflows/playwright.yml
|-- docs/
|   |-- stack-decision.md
|   `-- test-strategy.md
|-- src/
|   |-- api/
|   |-- assertions/
|   |-- config/
|   |-- fixtures/
|   |-- pages/
|   `-- test-data/
|-- tests/
|   |-- api/
|   `-- e2e/
|-- playwright.config.ts
|-- tsconfig.json
`-- package.json
```

## Assumptions and Limitations

- The app under test is a public demo environment, so all tests create isolated users and clean them up by deleting the owning user account.
- The public app may occasionally be cold or slower than a controlled internal environment; response-time checks use a tolerant default threshold.
- The implemented scope is API and E2E automation. In a full product repository, frontend unit/integration tests would normally use Vitest and backend Python unit/integration tests would normally use pytest.
- E2E tests intentionally cover the critical browser journeys and delegate data-heavy validation to the API layer.
