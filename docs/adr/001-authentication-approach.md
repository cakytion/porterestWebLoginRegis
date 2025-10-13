# ADR-001: Authentication Approach

**Date**: 2025-10-12

## Context

The goal is to implement "Sign in with Google" functionality. We need to decide on the technical stack and implementation details.

## Frameworks/Libraries

We will implement Google OAuth 2.0 using the following stack:

- **Frontend**: React with Vite
  - UI ("Sign in with Google" button, logout button)
  - Manages routing.
- **Backend**: Elysia.js
  - Handles OAuth callback from Google.
  - Manages user data and tokens.
- **Database**: Supabase
  - Stores user records.

## Session Strategy

The authentication flow uses OAuth 2.0 Authorization Code flow with PKCE:

1. **Initiate**: Frontend requests authorization URL from backend. Backend creates and stores `state` and `code_verifier` in `HttpOnly` cookies. User redirect to the authorization URL.
2. **Callback**: After Google authentication, the backend's callback endpoint (`/auth/google/callback`) validates `state` and `code` (using the `code_verifier`) for access token. Then fetch the user's Google profile.
3. **Handle User**:
   - **Existing User**: If the user's Google ID exists in the database, a session JWT is created and set in a `HttpOnly` cookie. The user is then redirected to the dashboard.
   - **New User**: If the user is new, a temporary JWT is set in a cookie, and the user is redirected to a `/finish-signup` page to select their role. Then the user is saved into the database and a session JWT is created and stored, then redirect them to the dashboard.

## User Records

Stored in a Supabase database across two main tables:

- `users`: User account information.
- `auth_identities`: Links a user in `users` table to their authentication identities.

## Redirect URIs

- **Development**: `http://localhost:8080/auth/google/callback`
- **Production**: `${BACKEND_URL}/auth/google/callback` (Configured via environment variables)
