# Contributing Guide

This guide covers workflows for testing, code quality, and contributing to the codebase.

## Development Workflow

This project follows **trunk-based development**. All changes are made directly to `main` branch or short-lived feature branches that are quickly merged back.

### Commit Messages and Branches

When creating branches for specific issues/features, use this format:

`<type>/<issue_number>-<short_description>`

If no issue number is available, omit it from the branch name.

**Examples:**

- Documentation: `docs/1-add-comments`
- Features: `feat/5-implement-feature`
- Tests: `test/3-add-tests`
- Chores: `chore/4-add-logging`
- Bug fixes: `fix/2-fix-bug`
- Improvements: `feat/6-enhance-feature`
- No Issue Number Feature: `feat/implement-feature`

Work on the branch until done and merge to `main` or create a PR.

For commit messages, follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Example:**

```
fix(login): incorrect string parsing

- change regex for detection
- other messages here

Closes: #13
```

## Testing

All tests are located in the `tests/` directories within each workspace. To run all tests: `bun run test`.

### Frontend Tests

- **Framework:** [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
- **Location:** `frontend/tests/`
- **Setup:** The test environment is configured in `vite.config.js`. The setup file is located at `frontend/tests/setup.js`.
- **To Run:** `bun run --filter=frontend test`

### Backend Tests

- **Framework:** [Bun's native test runner](https://bun.sh/docs/test/writing).
- **Location:** `backend/tests/`
- **Setup:** The setup file is located at `backend/tests/setup.js`.
- **To Run:** `bun run --filter=backend test`

## Code Quality

This project uses [ESLint](https://eslint.org/) for code quality checks and [Prettier](https://prettier.io/) for consistent code formatting.

### Linting

Check for linting issues:

```bash
bun run lint
```

Automatically fix linting issues:

```bash
bun run lint:fix
```

### Formatting

Check if files are formatted correctly:

```bash
bun run format:check
```

Automatically format all files:

```bash
bun run format
```

## Recommended Workflow

Before committing changes:

1. Ensure Supabase is running: `bunx supabase status`
2. Lint and format your code: `bun run lint:fix && bun run format`
3. Run all tests: `bun run test`
4. If you made database schema changes, create a migration and commit them.

## Creating Database Migrations

When you make schema changes to your local database:

1. Make your schema changes (via SQL editor, Supabase Studio, etc.)
2. Generate a migration file from the changes:

```bash
bunx supabase db diff -f <migration_name>
```

Example: `bunx supabase db diff -f add_user_profiles_table`

3. Review the generated migration file in `supabase/migrations/`.
4. Test the migration by resetting your local database:

```bash
bunx supabase db reset
```

5. Commit the migration file to git.
