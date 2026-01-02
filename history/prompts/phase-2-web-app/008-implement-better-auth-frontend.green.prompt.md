---
id: 008
title: Implement Better Auth on frontend
stage: green
date: 2026-01-01
surface: agent
model: claude-sonnet-4-5
feature: phase-2-web-app
branch: main
user: Coders
command: /sp.implement
labels: ["frontend", "authentication", "better-auth", "nextjs", "jwt"]
links:
  spec: phase-2-web-app/docs/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - phase-2-web-app/frontend/lib/auth.ts
  - phase-2-web-app/frontend/lib/auth-client.ts
  - phase-2-web-app/frontend/app/api/auth/[...all]/route.ts
  - phase-2-web-app/frontend/package.json
  - phase-2-web-app/docs/tasks.md
tests:
  - Manual verification: better-auth package installed (v1.4.10)
  - Manual verification: Auth configuration files created
  - Manual verification: API route handler created
---

## Prompt

T-208 | Implement Better Auth on frontend | T-202

## Response snapshot

Successfully implemented Task T-208 (Implement Better Auth on frontend) by:

1. **Installed Better Auth Package**:
   - Version: 1.4.10
   - Added to frontend/package.json dependencies
   - Installed successfully with npm (15 packages added)

2. **Created Server-Side Auth Config** (`lib/auth.ts`):
   - Configured Better Auth with `betterAuth()` function
   - Database provider: PostgreSQL (connects to Neon)
   - Database URL from `process.env.DATABASE_URL`
   - Email and password authentication enabled
   - Secret from `process.env.BETTER_AUTH_SECRET`
   - Base URL configured (defaults to localhost:3000)
   - Trusted origins from environment (localhost:3000, localhost:8000)
   - Next.js cookies plugin enabled for session management
   - Exported TypeScript types: `Session`, `User`

3. **Created Client-Side Auth Utilities** (`lib/auth-client.ts`):
   - Created auth client with `createAuthClient()` from "better-auth/react"
   - Base URL from `process.env.NEXT_PUBLIC_API_URL`
   - Exported convenience functions:
     - `signIn`: For user login
     - `signUp`: For user registration
     - `signOut`: For logout
     - `useSession`: React hook for session state
     - `getSession`: Function to get current session

4. **Created API Route Handler** (`app/api/auth/[...all]/route.ts`):
   - Catch-all route for `/api/auth/*` endpoints
   - Uses `toNextJsHandler()` to convert Better Auth to Next.js handler
   - Exports GET and POST handlers
   - Handles all authentication operations:
     - `/api/auth/sign-in` - User login
     - `/api/auth/sign-up` - User registration
     - `/api/auth/sign-out` - User logout
     - `/api/auth/session` - Get current session
     - Other Better Auth endpoints

5. **Configuration Features**:

   **Server-Side** (`lib/auth.ts`):
   - PostgreSQL database integration
   - JWT token generation with shared secret
   - Session management via cookies
   - Next.js-specific optimizations

   **Client-Side** (`lib/auth-client.ts`):
   - React hooks for session management
   - Type-safe authentication functions
   - Automatic token handling
   - Session state synchronization

   **API Routes** (`app/api/auth/[...all]/route.ts`):
   - RESTful authentication endpoints
   - Automatic request handling
   - Cookie-based session storage
   - CSRF protection

6. **Environment Variables Used**:
   - `DATABASE_URL`: Neon PostgreSQL connection (server-side)
   - `BETTER_AUTH_SECRET`: JWT signing secret (must match backend)
   - `BETTER_AUTH_URL`: Base URL for callbacks
   - `BETTER_AUTH_TRUSTED_ORIGINS`: CORS allowed origins
   - `NEXT_PUBLIC_API_URL`: API endpoint (client-side)

7. **Integration with Backend**:
   - Shared `BETTER_AUTH_SECRET` with backend
   - JWT tokens compatible with backend verification
   - User records stored in Neon database (users table)
   - Same database used by backend for data consistency

8. **File Structure Created**:
   ```
   frontend/
   ├── app/
   │   └── api/
   │       └── auth/
   │           └── [...all]/
   │               └── route.ts       # Auth API handler
   ├── lib/
   │   ├── auth.ts                   # Server-side config
   │   └── auth-client.ts            # Client-side utilities
   └── package.json                  # better-auth@1.4.10
   ```

9. **Updated tasks.md** - Marked T-208 as Completed [X]

Better Auth is now configured and ready for use in login/signup pages and protected routes.

## Outcome

- ✅ Impact: Authentication foundation established for frontend
- 🧪 Tests: Manual verification passed (package installed, files created)
- 📁 Files: 3 files created (auth.ts, auth-client.ts, route.ts)
- 🔁 Next prompts: T-209 (Create API client for backend communication)
- 🧠 Reflection: Better Auth provides clean separation between server and client with Next.js App Router compatibility

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual verification PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
