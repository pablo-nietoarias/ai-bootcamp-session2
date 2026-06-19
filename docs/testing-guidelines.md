# Testing Guidelines

This document defines testing standards and conventions for the todo app.

## Unit Tests

Use **Jest** to test individual functions and React components in isolation.

- File naming convention: `*.test.js` or `*.test.ts`
- Backend unit tests location: `packages/backend/__tests__/`
- Frontend unit tests location: `packages/frontend/src/__tests__/`
- Name test files to match what they're testing (e.g., `app.test.js` for testing `app.js`)

## Integration Tests

Use **Jest + Supertest** to test backend API endpoints with real HTTP requests.

- Location: `packages/backend/__tests__/integration/`
- File naming convention: `*.test.js` or `*.test.ts`
- Name integration test files based on what they test (e.g., `todos-api.test.js` for TODO API endpoints)

## End-to-End (E2E) Tests

Use **Playwright** (required framework) to test complete UI workflows through browser automation.

- Location: `tests/e2e/`
- File naming convention: `*.spec.js` or `*.spec.ts`
- Name E2E test files based on the user journey they test (e.g., `todo-workflow.spec.js`)
- Use **one browser only** in Playwright configuration
- Must follow the **Page Object Model (POM)** pattern for maintainability
- Limit to **5–8 critical user journeys** — focus on happy paths and key edge cases, not exhaustive coverage

## Port Configuration

Always use environment variables with sensible defaults for port configuration to allow CI/CD workflows to dynamically detect ports.

- **Backend**: `const PORT = process.env.PORT || 3030;`
- **Frontend**: React's default port is `3000`, but can be overridden with the `PORT` environment variable

## General Principles

- **All tests must be isolated and independent** — each test sets up its own data and does not rely on other tests.
- **Setup and teardown hooks are required** — tests must succeed on repeated runs without manual cleanup.
- **All new features must include appropriate tests** — unit, integration, or E2E depending on the scope of the change.
- **Tests should be maintainable and follow best practices** — keep assertions focused, avoid test duplication, and use descriptive test names.
