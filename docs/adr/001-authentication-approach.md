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

The strategy can be seen in this flow:

1. **Frontend**: User clicks "Sign in with Google", redirecting to Google's OAuth screen.
2. **Google**: User authenticates, grants permissions, and is redirected back to the backend with an authorization `code`.
3. **Backend**: Receives the `code` at the `/auth/google/callback` endpoint.
4. **Backend**: Sends the `code` to Google and receives an `id_token`.
5. **Backend**: Decodes and validates the `id_token` and extract the user's Google profile.
6. **Backend**: Uses the Google ID from the profile to query the Supabase database. If the user is new, a new record is created.
7. **Backend**: Creates a session JWT for the user and sets it in a secure, `HttpOnly` cookie, then redirects the user to a frontend page.

## User Records

Stored in Supabase database.

## Redirect URIs

- Development: `http://localhost:8080/auth/google/callback`
- Production: `https://example-domain.com/auth/google/callback`
