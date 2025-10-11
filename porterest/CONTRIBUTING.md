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
