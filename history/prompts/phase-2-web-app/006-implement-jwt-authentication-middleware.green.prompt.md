---
id: 006
title: Implement JWT authentication middleware
stage: green
date: 2026-01-01
surface: agent
model: claude-sonnet-4-5
feature: phase-2-web-app
branch: main
user: Coders
command: /sp.implement
labels: ["backend", "jwt", "authentication", "middleware", "security"]
links:
  spec: phase-2-web-app/docs/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - phase-2-web-app/backend/app/auth.py
  - phase-2-web-app/docs/tasks.md
tests:
  - Manual verification: JWT token creation works
  - Manual verification: JWT token verification works
  - Manual verification: Invalid tokens rejected (401)
  - Manual verification: Auth module integrates with FastAPI
---

## Prompt

T-206 | Implement JWT authentication middleware | T-205

## Response snapshot

Successfully implemented Task T-206 (JWT authentication middleware) by:

1. **Created JWT Authentication Module** (`backend/app/auth.py`):
   - Complete JWT token management for Better Auth integration
   - Uses shared `BETTER_AUTH_SECRET` for token verification
   - Algorithm: HS256 (HMAC with SHA-256)
   - Token expiration: 7 days default

2. **Implemented Core Functions**:

   **`create_access_token(data, expires_delta)`**:
   - Creates JWT tokens with user claims (sub, email)
   - Adds issued_at (iat) and expiration (exp) timestamps
   - Signs with shared secret using HS256 algorithm
   - Returns encoded JWT string

   **`decode_access_token(token)`**:
   - Decodes and verifies JWT signature
   - Validates token expiration
   - Returns payload with claims (sub, email, iat, exp)
   - Raises HTTPException 401 if invalid/expired

3. **Implemented FastAPI Dependencies**:

   **`get_current_user_id(credentials)`**:
   - FastAPI dependency for route protection
   - Extracts JWT from Authorization: Bearer header
   - Verifies token and extracts user_id (sub claim)
   - Returns authenticated user_id
   - Usage: `current_user_id: str = Depends(get_current_user_id)`

   **`verify_user_access(user_id, current_user_id)`**:
   - FastAPI dependency for data isolation
   - Validates URL path user_id matches token user_id
   - Ensures users can only access their own resources
   - Raises HTTPException 403 if mismatch
   - Usage: `verified_user_id: str = Depends(verify_user_access)`

4. **Implemented Optional Middleware**:

   **`jwt_auth_middleware(request, call_next)`**:
   - HTTP middleware for automatic authentication
   - Skips public paths (/, /health, /docs)
   - Verifies JWT on all protected endpoints
   - Attaches user_id to request.state
   - Note: Current design uses dependency injection instead

5. **JWT Token Structure** (as per plan.md:311-319):
   ```json
   {
     "sub": "user_id",           # Subject (user ID)
     "email": "user@example.com",
     "iat": 1234567890,          # Issued at (timestamp)
     "exp": 1235172890           # Expiration (7 days later)
   }
   ```

6. **Security Features**:
   - Token signature verification (prevents tampering)
   - Expiration validation (7-day lifetime)
   - User isolation enforcement (403 if accessing other user's data)
   - Proper error responses (401 for invalid tokens, 403 for forbidden)
   - Shared secret with frontend (BETTER_AUTH_SECRET matches)

7. **Verified Implementation**:
   - Token creation works correctly
   - Token verification successful
   - User ID extraction accurate (sub claim)
   - Invalid tokens rejected with 401 status
   - Malformed tokens rejected properly
   - Auth module imports in FastAPI app
   - Ready for route integration

8. **Updated tasks.md** - Marked T-206 as Completed [X]

The JWT authentication middleware is now complete and ready for use in CRUD endpoints (T-207).

## Outcome

- ✅ Impact: JWT authentication layer implemented for secure API access
- 🧪 Tests: Manual verification passed (token creation, verification, rejection)
- 📁 Files: 1 file created (auth.py with 200+ lines)
- 🔁 Next prompts: T-207 (Create task CRUD endpoints with auth protection)
- 🧠 Reflection: Clean separation using FastAPI dependencies vs middleware. Dependency injection provides better control over which endpoints require auth.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual verification PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
