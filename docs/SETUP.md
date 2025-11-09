# Development Setup

This guide provides instructions for setting up the development environment.

- This project uses [Bun](https://bun.sh/) for runtime and package management.
- Run all commands from the root directory.

## Prerequisites

1. **Bun:** Follow the official instructions at [bun.sh](https://bun.sh/).
2. **Docker:** Required for running Supabase locally. Install from [Docker Desktop](https://www.docker.com/products/docker-desktop/).

## Install Dependencies

```bash
bun install
```

## Environment Variables

Before running the application, you must set up your environment variables. These are used to store sensitive information like API keys and secrets.

### Backend Environment Variables

1. Create a copy of the example environment file `backend/.env.example` as `.env`.
2. Open the newly created `.env` file and fill in the required values.
   - Supabase environment variables can be obtained from the Supabase setup section below.
   - For Google secrets, you can set up your own projects or contact the owner of this project.
   - `JWT_SECRET` can be generated from a password manager or be a random string.

### Frontend Environment Variables

1. Create a copy of the example environment file `frontend/.env.example` as `.env`.
2. Open the newly created `.env` file and fill in the required values.
   - `VITE_BACKEND_URL` is set to empty string for local development.

## Supabase Setup

This project uses Supabase for the database. Follow these steps to set up your local environment.

### Initial Setup

1. **Start Docker:** Ensure Docker Desktop is running.
2. **Start Supabase locally:** This command will pull all necessary Docker images, start all services, and display the local service URLs and keys.

```bash
bunx supabase start
```

Access the studio at `http://localhost:54323`. This is where you can manage your database.

3. **Update backend `.env` file**: Update `SUPABASE_URL` with `API URL` and `SUPABASE_SERVICE_ROLE_KEY` with `service_role key` for the backend environment variables.
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

You can run both servers simultaneously or in separate terminals.

### Run Both Servers

To start both frontend and backend development servers:

```bash
bun dev
```

### Run Servers Separately

**Frontend (Vite):**

```bash
bun dev:frontend
```

**Backend (Elysia):**

```bash
bun dev:backend
```

## Troubleshooting

### Supabase Command Not Found

If `bunx supabase start` fails with `error: could not determine executable to run for package supabase`, clean reinstall by removing all `node_modules` folders and `bun.lock`:

```bash
rm -rf node_modules frontend/node_modules backend/node_modules bun.lock
bun install
```
