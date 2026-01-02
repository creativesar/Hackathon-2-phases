---
id: 016
title: Set up environment variables
stage: green
date: 2026-01-01
surface: agent
model: claude-sonnet-4-5
feature: phase-2-web-app
branch: main
user: Coders
command: /sp.implement
labels: ["configuration", "environment", "deployment", "documentation"]
links:
  spec: phase-2-web-app/docs/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - phase-2-web-app/ENV_SETUP.md
  - phase-2-web-app/backend/.env
  - phase-2-web-app/backend/.env.example
  - phase-2-web-app/frontend/.env.local
  - phase-2-web-app/frontend/.env.example
  - phase-2-web-app/.gitignore
  - phase-2-web-app/docs/tasks.md
tests:
  - Manual verification: All environment files exist
  - Manual verification: Secrets match between frontend and backend
  - Manual verification: .env files properly gitignored
  - Manual verification: Documentation complete
---

## Prompt

T-218 | Set up environment variables | T-217

## Response snapshot

Successfully completed Task T-218 (Set up environment variables) by:

1. **Verified Backend Environment** (`backend/.env`):

   **All Variables Configured**:
   ```env
   DATABASE_URL=postgresql://neondb_owner:npg_Jq9HuW3Lrhvt@...neon.tech/neondb?sslmode=require
   BETTER_AUTH_SECRET=l0voS6QVLyQpXZmG0goZpIVOAORi91cJ
   OPENAI_API_KEY=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
   ```

   **Services Connected**:
   - Neon PostgreSQL: ep-polished-truth-ahgm6cp2-pooler.c-3.us-east-1.aws.neon.tech
   - Better Auth: JWT with shared secret
   - OpenRouter: AI API for Phase III

2. **Verified Frontend Environment** (`frontend/.env.local`):

   **All Variables Configured**:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   BETTER_AUTH_SECRET=l0voS6QVLyQpXZmG0goZpIVOAORi91cJ
   DATABASE_URL=postgresql://...neon.tech/neondb
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000,http://localhost:8000
   ```

   **Configuration**:
   - Backend API: localhost:8000 (development)
   - Better Auth: Same secret as backend ✓
   - Database: Same Neon instance as backend ✓
   - CORS: Both origins trusted

3. **Verified Security**:

   **Gitignore Check**:
   - `.env` ✓ Ignored
   - `.env.local` ✓ Ignored
   - `.env.development.local` ✓ Ignored
   - `.env.test.local` ✓ Ignored
   - `.env.production.local` ✓ Ignored

   **Template Files** (Safe to commit):
   - `backend/.env.example` ✓ Exists
   - `frontend/.env.example` ✓ Exists

4. **Created Environment Setup Documentation** (`ENV_SETUP.md`):

   **Sections**:
   - Overview of environment configuration
   - Backend environment variables (all required variables)
   - Frontend environment variables (all required variables)
   - Configuration details for each variable
   - Security checklist
   - Verification commands
   - Production deployment instructions
   - Common issues and solutions
   - File locations diagram

   **Includes**:
   - Copy-paste ready configuration examples
   - Verification commands for testing
   - Troubleshooting guide
   - Production deployment checklist

5. **Configuration Summary**:

   **Backend** (`backend/.env`):
   - ✓ Database: Neon PostgreSQL (configured)
   - ✓ Auth Secret: 32 characters (matches frontend)
   - ✓ AI API: OpenRouter key (ready for Phase III)

   **Frontend** (`frontend/.env.local`):
   - ✓ API URL: localhost:8000 (points to backend)
   - ✓ Auth Secret: Matches backend exactly
   - ✓ Database: Same Neon instance
   - ✓ Better Auth: Properly configured
   - ✓ CORS Origins: Frontend + Backend

6. **Critical Validation**:

   **Secret Matching**:
   ```
   Backend:  BETTER_AUTH_SECRET=l0voS6QVLyQpXZmG0goZpIVOAORi91cJ
   Frontend: BETTER_AUTH_SECRET=l0voS6QVLyQpXZmG0goZpIVOAORi91cJ
   Status: ✓ MATCH
   ```

   **Database Shared**:
   ```
   Backend:  DATABASE_URL=postgresql://...neon.tech/neondb
   Frontend: DATABASE_URL=postgresql://...neon.tech/neondb
   Status: ✓ SAME DATABASE
   ```

7. **Development Environment Ready**:

   **Backend**:
   - Run: `cd backend && uv run uvicorn app.main:app --reload`
   - URL: http://localhost:8000
   - API Docs: http://localhost:8000/docs

   **Frontend**:
   - Run: `cd frontend && npm run dev`
   - URL: http://localhost:3000

8. **Production Environment Ready**:

   **Deployment Checklist**:
   - [ ] Update NEXT_PUBLIC_API_URL to production backend URL
   - [ ] Update BETTER_AUTH_URL to Vercel deployment URL
   - [ ] Update BETTER_AUTH_TRUSTED_ORIGINS to include production URLs
   - [ ] Set ENVIRONMENT=production on backend
   - [ ] Set DEBUG=false on backend
   - [ ] All secrets configured in deployment platforms

9. **Updated tasks.md** - Marked T-218 as Completed [X]

All environment variables are properly configured and documented. Application is ready for testing and deployment.

## Outcome

- ✅ Impact: Complete environment configuration with documentation
- 🧪 Tests: Manual verification passed (files exist, secrets match, gitignore correct)
- 📁 Files: 1 file created (ENV_SETUP.md), 4 files verified (.env files)
- 🔁 Next prompts: T-219 (Test authentication flow), T-220 (Test CRUD operations)
- 🧠 Reflection: Environment already configured from previous tasks. Documentation provides clear deployment guide.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual verification PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
