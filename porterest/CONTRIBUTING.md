# Contributing to Porterest

This guide provides instructions for setting up the development environment.

- This project uses [Bun](https://bun.sh/) as the primary toolkit for runtime and package management.
- Run all commands from within the `porterest` directory.

## Getting Started

1. **Bun:** Follow the official instructions at [bun.sh](https://bun.sh/).
2. **Docker:** Required for running Supabase locally. Install from [Docker Desktop](https://www.docker.com/products/docker-desktop/).
3. **Install Dependencies:**

```bash
bun install
```

## Environment Variables

Before running the application, you must set up your environment variables. These are used to store sensitive information like API keys and secrets.

1. Create a copy of the example environment file as `.env`.
2. Open the newly created `.env` file and fill in the required values.

## Supabase Setup

This project uses Supabase for the database. Follow these steps to set up your local environment.

### Initial Setup

1. **Start Docker:** Ensure Docker Desktop is running.
2. **Start Supabase locally:** This command will pull all necessary Docker images, start all services, and display the local service URLs and keys.

```bash
bunx supabase start
```

Access the studio at `http://localhost:54323`.

3. **Update `.env` file**: Update `SUPABASE_URL` with `API URL` and `SUPABASE_SERVICE_ROLE_KEY` with `Secret key` from the output of the previous step.
4. **Apply database migrations:** This command will reset your local database and apply all migrations from `supabase/migrations/` directory.

```bash
bunx supabase db reset
```

You can check the status via `bunx supabase status`, and stop Supabase with `bunx supabase stop`.

### Linking to Remote (Optional)

Recommended workflow is to only work with local Supabase with migration files committed to git. The single remote instance would be for production.

**Only link if you need to:**

- Pull schema changes from the remote Supabase instance.
- Push local migrations to remote.

To link, first login to Supabase, then link using the `project-ref` from the Supabase instance URL:

```bash
bunx supabase login
bunx supabase link --project-ref <project-ref>
```

Then you can pull remote schema changes:

```bash
bunx supabase db pull
```

Note: If the pull command results in a diffing error, check if the migration file was created correctly in `supabase/migrations/`, then proceed with `bunx supabase db reset` safely.

## Running the Application

You will need two separate terminals to run both the frontend and backend servers.

### Frontend (Vite)

To start the frontend development server:

```bash
bun dev
```

### Backend (Elysia)

To start the backend server:

```bash
bun src/server.js
```

## Testing

All tests are located in the `tests/` directory. To run all tests: `bun run test`.

### Frontend Tests

- **Framework:** [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
- **Location:** `tests/frontend/`
- **Setup:** The test environment is configured in `vite.config.js`. The setup file is located at `tests/frontend/setup.js`.
- **To Run:** `bun run test:frontend`

### Backend Tests

- **Framework:** [Bun's native test runner](https://bun.sh/docs/test/writing).
- **Location:** `tests/backend/`
- **Setup:** The setup file is located at `tests/backend/setup.js`.
- **To Run:** `bun run test:backend`

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

### Recommended Workflow

Before committing changes:

1. Ensure Supabase is running: `bunx supabase status`
2. Lint and format your code: `bun run lint:fix && bun run format`
3. Run all tests: `bun run test`
4. If you made database schema changes, create a migration and commit them.

### Creating Database Migrations

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
