HEAD
# Porterest

A Pinterest-inspired application for showcasing and discovering creative portfolios.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Elysia.js
- **Database:** Supabase

## Quickstart

```bash
# install dependencies
bun install

# start Supabase (requires Docker)
bunx supabase start

# apply database migrations
bunx supabase db reset

# run both frontend and backend
bun dev
```

Make sure to set up `.env` files in `frontend/` and `backend/` directories before running. See [SETUP.md](docs/SETUP.md) for detailed instructions.

## Project Structure

```
porterest-repository/
├── frontend/      # react frontend components and tests
├── backend/       # elysia.js server and tests
├── supabase/      # database migrations and config
└── docs/          # documentation
```

## Documentation

- [Setup Guide](docs/SETUP.md) - Set up your development environment
- [Architecture](docs/ARCHITECTURE.md) - Codebase structure overview
- [Package Management](docs/PACKAGE_MANAGEMENT.md) - Adding and managing dependencies
- [Contributing](docs/CONTRIBUTING.md) - Testing, code quality, and workflow