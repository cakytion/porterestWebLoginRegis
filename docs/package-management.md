# Package Management

This guide covers how to add, remove, and manage packages in the monorepo.

## Adding Packages

- Install to root when the same package is required for multiple workspaces.
- If different versions are needed or a package is only required for a single workspace, install to the specific workspace instead of root.

### To Frontend

```bash
cd frontend
bun add <package>
cd ..
```

### To Backend

```bash
cd backend
bun add <package>
cd ..
```

### To Root

```bash
bun add <package>
```

## Dependencies vs DevDependencies

Dependencies - tools the app needs to run in production:

```bash
# frontend
cd frontend
bun add react-icons

# backend
cd backend
bun add zod
```

DevDependencies - tools for development only (testing, linting, building, etc.):

```bash
# frontend
cd frontend
bun add vitest --dev

# backend
cd backend
bun add @types/node --dev
```

If it's not required for working production app, then install to DevDependencies.

## Removing Packages

```bash
# remove from frontend
cd frontend
bun remove <package>
cd ..

# remove from backend
cd backend
bun remove <package>
cd ..

# remove from root
bun remove <package>
```
