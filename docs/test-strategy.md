# Test Strategy

## What To Test First

On a new project with no automated testing, the first priority is fast coverage of the highest-risk user and system contracts. I would start with API tests for authentication, core resource CRUD, validation rules, and response schemas because they are faster than E2E tests and fail close to the source of backend or contract problems.

The next priority is a small set of E2E smoke and critical-path tests. These should prove that the user can log in, navigate through the main pages, submit important forms, and see API-backed data in the UI. This gives confidence that the major integrated parts of the product still work without turning the browser suite into a slow duplicate of API coverage.

For this repository, the first automated slice is:

- API authorization success and failure
- API contact list retrieval with schema validation
- API contact creation and read-back through the list endpoint
- API validation failures for required fields and malformed email
- UI login success and failure
- UI navigation from contact list to add contact and back
- UI contact creation with valid data
- UI form validation for invalid data
- UI rendering of a contact created through the API

## API vs E2E Responsibility

API tests own most contract and data-rule coverage. They are the right place for status codes, response schemas, validation messages, response time checks, authorization rules, and CRUD chains. They run faster, are less brittle than browser tests, and can cover more negative cases with less maintenance cost.

E2E tests own integrated user confidence. They should verify that the browser, routing, forms, authentication cookie, API calls, and rendered UI work together. They should not exhaustively test every backend validation branch when the API layer can test those branches more directly.

In this suite, API tests check the detailed contact contract and negative payload cases. E2E tests check that representative positive and negative form paths are wired correctly in the browser.

## Test Data Strategy

Each test creates its own user account with a unique email address. The user's token is used for API setup and cleanup. Contacts are created under that user, so deleting the test user removes the user's owned data and keeps cleanup simple.

Data preparation follows the cheapest stable path:

- API tests prepare and assert directly through API calls.
- E2E login tests create the user through the API, then exercise login through the UI.
- E2E contact display tests create contact data through the API, then verify that the UI renders it.
- E2E form tests create the user through the API, then use the UI only for the behavior under test.

This avoids brittle UI-only setup. For example, a test that only needs a contact in the list should not spend time clicking through an add-contact form unless the form itself is the behavior under test.

Cleanup is handled in the shared `registeredUser` fixture. After each test, the fixture deletes the current user account. Cleanup tolerates already-deleted users so tests can still clean up intentionally deleted accounts without failing in teardown.

## Keeping E2E Lean

E2E tests are expensive because they depend on the browser, network, UI rendering, and backend state at the same time. They are valuable, but only when they answer questions that lower-level tests cannot answer.

The strategy is to keep E2E tests focused on a few user-visible workflows:

- Can a valid user log in?
- Is an invalid login rejected in the UI?
- Can the user move between important pages?
- Does the contact form submit valid data and show validation errors?
- Does API-backed data appear in the contact list?

Logic-heavy and data-heavy checks belong at the API layer. That is why schema validation, CRUD read-back, status codes, response time checks, and multiple negative payload cases are covered in API tests. The result is a suite that is easier to debug: API failures usually indicate contract or backend behavior issues, while E2E failures usually indicate integration or UI flow issues.
