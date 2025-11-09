# Architecture

This document explains the high-level structure of the Porterest codebase.

## Monorepo Structure

Porterest uses a monorepo architecture via Bun workspaces, organized into separate packages for frontend and backend.

```
porterest-repository/
├── .github/              # github actions workflows
├── frontend/             # frontend package
├── backend/              # backend package
├── supabase/             # supabase cli
├── docs/                 # documentation
├── package.json          # root project config file (scripts, dependencies, etc.)
├── bunfig.toml           # bun config
├── eslint.config.js      # eslint config
└── .prettierrc           # prettier config
```

## Frontend Architecture

### Directory Structure

```
frontend/
├── src/                  # source files
├── tests/                # tests
├── vite.config.js        # vite config
└── package.json          # frontend config file (scripts, dependencies, etc.)
```

## Backend Architecture

### Directory Structure

```
backend/
├── src/                  # source files
├── tests/                # tests
└── package.json          # backend config file (scripts, dependencies, etc.)
```
