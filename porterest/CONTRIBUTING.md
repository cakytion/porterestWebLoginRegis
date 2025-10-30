# Contributing to Porterest

This guide provides instructions for setting up the development environment.

- This project uses [Bun](https://bun.sh/) as the primary toolkit for runtime and package management.
- Run all commands from within the `porterest` directory.

## Getting Started

1.  **Install Bun:** Follow the official instructions at [bun.sh](https://bun.sh/).
2.  **Install Dependencies:**

```bash
bun install
```

## Environment Variables

Before running the application, you must set up your environment variables. These are used to store sensitive information like API keys and secrets.

1.  Create a copy of the example environment file.
2.  Open the newly created `.env` file and fill in the required values.

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
