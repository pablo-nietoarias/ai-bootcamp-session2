# Coding Guidelines

This document defines coding standards and conventions for the todo app (React frontend + Node.js/Express backend).

## General

- Use **JavaScript (ES2020+)** across the entire codebase; do not mix TypeScript and JavaScript in the same package.
- Keep functions small and focused on a single responsibility.
- Prefer `const` over `let`; never use `var`.
- Use **arrow functions** for callbacks and short expressions; use named function declarations for top-level functions.
- Avoid deeply nested logic — extract into clearly named helper functions.
- Remove all `console.log` calls before merging; use structured error logging for meaningful backend messages.

## Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Variables & functions | camelCase | `fetchTodos`, `dueDate` |
| React components | PascalCase | `TodoItem`, `TagBadge` |
| CSS classes | kebab-case | `todo-item`, `tag-badge` |
| Constants | UPPER_SNAKE_CASE | `MAX_TAG_LENGTH` |
| Files (components) | PascalCase | `TodoItem.js` |
| Files (utilities/hooks) | camelCase | `useTodos.js`, `dateUtils.js` |

## Frontend (React)

- Use **functional components** and React hooks only; do not use class components.
- Keep component files focused: one component per file.
- Extract reusable UI elements (buttons, toasts, inputs) into `src/components/` as shared components.
- Use the **primary / secondary button components** defined in the UI guidelines — do not create ad-hoc `<button>` elements.
- Manage side effects in `useEffect`; clean up subscriptions and timers on unmount.
- Do not fetch data directly inside JSX — use hooks or handler functions.
- Keep inline styles to a minimum; prefer CSS classes or a theme-based approach aligned with Material Design.

## Backend (Node.js / Express)

- Organise routes, controllers, and data access in separate modules — avoid putting all logic in `app.js`.
- Validate and sanitise all incoming request data at the route boundary before processing.
- Return consistent JSON response shapes: `{ data }` for success, `{ error: "message" }` for failures.
- Use appropriate HTTP status codes: `200` OK, `201` Created, `400` Bad Request, `404` Not Found, `500` Internal Server Error.
- Never expose raw database errors or stack traces in API responses.
- Use environment variables (via `process.env`) for all configuration — ports, connection strings, secrets.

## Error Handling

- Always handle promise rejections with `try/catch` or `.catch()`.
- Provide meaningful error messages that aid debugging without leaking implementation details to the client.
- Frontend: surface errors to the user via toast notifications (see UI guidelines), not raw `alert()` calls.

## Code Style

- Use **2-space indentation**.
- Maximum line length: **100 characters**.
- Always use **semicolons** at the end of statements.
- Use **single quotes** for strings in JavaScript; template literals when interpolation is needed.
- Add a blank line between logical sections within a function to improve readability.

## Dependencies

- Prefer well-maintained, widely-used packages over custom implementations for common problems.
- Do not add a dependency for functionality that can be reasonably implemented in a few lines.
- Keep `devDependencies` and `dependencies` correctly separated in `package.json`.

## Version Control

- Write descriptive commit messages in the imperative mood (e.g., `Add due date field to todo model`).
- Keep commits focused — one logical change per commit.
- All new features and bug fixes must be accompanied by appropriate tests before merging.
