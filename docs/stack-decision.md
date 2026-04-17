# Stack Decision

## Summary

The automation suite is implemented in TypeScript with Playwright. This keeps the repository coherent, matches the frontend language, and gives one test runner for both browser E2E and HTTP API coverage. The backend is Python, so backend unit and integration tests would naturally live near backend code and use pytest. For this take-home assignment, the implemented automation scope is API plus E2E testing because those are the practical deliverables requested by the assignment.

## Why TypeScript

TypeScript is the strongest fit for this assignment because the application frontend is already TypeScript. A QA automation suite written in the same language as the frontend lowers the maintenance cost for the team: frontend engineers can read and review the tests, page objects can model UI behavior using familiar types, and test data builders can catch shape mistakes at compile time.

TypeScript also gives useful safety without adding much ceremony. Test payloads, API responses, environment config, and fixtures are all typed in this repository. That matters in automation because silent mistakes in test setup can create false failures or false confidence. For example, a contact payload with a misspelled field should be caught quickly by code review, type checking, or schema validation rather than being hidden inside loosely typed helper code.

The backend being Python does not require the automation suite itself to be Python. System-level API and E2E tests interact with the deployed application through stable external contracts: HTTP endpoints and browser behavior. For those layers, the main selection criteria are maintainability, execution speed, reporting, CI support, and alignment with the team that will own the tests. TypeScript meets those criteria while still allowing the Python backend to keep pytest for lower-level backend tests.

## Selected Tools

Playwright Test is used as the primary framework. It provides browser automation, API testing, fixtures, assertions, tracing, screenshots, retries, parallel execution, and HTML reporting in one toolchain. Using Playwright for both API and E2E tests avoids the overhead of mixing test runners for this assignment while still allowing clear separation by folder and project.

API tests use Playwright `APIRequestContext`. This is sufficient for authorization, CRUD, response status, response time, and contract checks. Zod is used for schema validation because it keeps response schemas close to test code, provides readable failures, and gives TypeScript types from the same definitions.

E2E tests use Playwright browser automation with page objects for the stable UI surfaces. The page objects are deliberately thin: they centralize locators and simple user actions without hiding assertions or business intent.

The HTML report is the built-in Playwright report. In CI, it is uploaded as an artifact together with raw test results, traces, screenshots, and videos for failed E2E runs.

For a full product repository, the broader test stack would be:

- Frontend unit/integration: Vitest with Testing Library, because it is fast, TypeScript-native, and fits modern frontend tooling.
- Backend unit/integration: pytest, because it is the Python standard for expressive fixtures, parametrization, and backend-focused integration tests.
- API and E2E: Playwright, because it covers deployed-contract and browser-user workflows well.

## Trade-Offs and Alternatives

Python plus pytest would align with the backend, and pytest is excellent for API tests. The downside for this assignment is that E2E browser automation would require adding Playwright Python or Selenium, while the frontend team would have less direct language alignment. That creates a split ownership model before the project has enough test volume to justify it.

Cypress is a credible E2E option for TypeScript projects and has a strong developer experience. Playwright was selected instead because its API testing support, browser context isolation, tracing, parallel execution, and cross-browser model are stronger for a combined API and E2E automation foundation.

Postman or Newman would be easy for API-only checks, but they would introduce a second test model and would not help with browser coverage. The assignment asks for both API and E2E automation, so a single framework is cleaner.

Selenium remains widely used, but it requires more surrounding decisions for runner, fixtures, reporting, waits, and API testing. Playwright provides those pieces out of the box and encourages modern locator and isolation patterns.

The main trade-off of using one Playwright suite is that it should not replace true unit and component-level tests. That is intentional here. This repository implements the assignment's API and E2E scope while documenting where Vitest and pytest would fit in a complete engineering test pyramid.
