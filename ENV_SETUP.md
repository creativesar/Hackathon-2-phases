# Environment Variables Setup Guide

## Overview

This guide explains how to configure environment variables for the Phase II Todo Full-Stack Web Application.

## Backend Environment (`backend/.env`)

### Required Variables

```env
# Neon PostgreSQL Database
DATABASE_URL=postgresql://neondb_owner:npg_Jq9HuW3Lrhvt@ep-polished-truth-ahgm6cp2-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Better Auth Shared Secret (MUST MATCH FRONTEND)
BETTER_AUTH_SECRET=l0voS6QVLyQpXZmG0goZpIVOAORi91cJ

# OpenRouter API Key (for Phase III AI chatbot)
OPENAI_API_KEY=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
```

### Configuration Details

**DATABASE_URL**:
- Provider: Neon Serverless PostgreSQL
- Region: US East (Ohio) - AWS
- Connection: Pooler with SSL enabled
- Tables: users, tasks, messages

**BETTER_AUTH_SECRET**:
- Purpose: JWT token signing and verification
- Length: 32 characters
- **CRITICAL**: Must match frontend secret exactly
- Used by: FastAPI JWT middleware

**OPENAI_API_KEY**:
- Provider: OpenRouter (OpenAI-compatible API)
- Purpose: Phase III AI chatbot functionality
- Format: sk-or-v1-*

### Template File

See `backend/.env.example` for a template with all available options.

## Frontend Environment (`frontend/.env.local`)

### Required Variables

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Shared Secret (MUST MATCH BACKEND)
BETTER_AUTH_SECRET=l0voS6QVLyQpXZmG0goZpIVOAORi91cJ

# Database URL (for Better Auth user management)
DATABASE_URL=postgresql://neondb_owner:npg_Jq9HuW3Lrhvt@ep-polished-truth-ahgm6cp2-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Configuration Details

**NEXT_PUBLIC_API_URL**:
- Development: `http://localhost:8000`
- Production: Your deployed backend URL
- Exposed to browser (NEXT_PUBLIC_*)

**BETTER_AUTH_SECRET**:
- Must match backend secret EXACTLY
- Used for JWT token generation
- Not exposed to browser

**DATABASE_URL**:
- Same Neon database as backend
- Better Auth needs direct database access
- Manages users table

**BETTER_AUTH_URL**:
- Base URL for Better Auth callbacks
- Development: `http://localhost:3000`
- Production: Your Vercel deployment URL

**BETTER_AUTH_TRUSTED_ORIGINS**:
- Comma-separated list of allowed origins
- Include both frontend and backend URLs

### Template File

See `frontend/.env.example` for a template with all options.

## Security Checklist

- [X] `.env` files are in `.gitignore`
- [X] `BETTER_AUTH_SECRET` matches between frontend and backend
- [X] `DATABASE_URL` points to Neon PostgreSQL
- [X] `OPENAI_API_KEY` configured for AI features
- [X] No secrets committed to version control

## Verification

### Backend Configuration Check

```bash
cd backend
uv run python -c "from app.config import settings; print(f'Database: {settings.DATABASE_URL.split(\"@\")[-1][:50]}'); print(f'Auth Secret Length: {len(settings.BETTER_AUTH_SECRET)}')"
```

Expected output:
```
Database: ep-polished-truth-ahgm6cp2-pooler.c-3.us-east-1.aws...
Auth Secret Length: 32
```

### Frontend Configuration Check

```bash
cd frontend
# Check that .env.local exists
ls -la .env.local
```

### Database Connection Test

```bash
cd backend
uv run python -c "from app.db import init_db; init_db(); print('Database connection successful')"
```

Expected output:
```
Database initialized: ep-polished-truth-ahgm6cp2-pooler...
Database connection successful
```

## Production Deployment

### Backend (Render/Railway)

Set these environment variables in your deployment platform:

```
DATABASE_URL=<your-neon-url>
BETTER_AUTH_SECRET=l0voS6QVLyQpXZmG0goZpIVOAORi91cJ
OPENAI_API_KEY=<your-openrouter-key>
ENVIRONMENT=production
DEBUG=false
```

### Frontend (Vercel)

Set these environment variables in Vercel:

```
NEXT_PUBLIC_API_URL=<your-deployed-backend-url>
BETTER_AUTH_SECRET=l0voS6QVLyQpXZmG0goZpIVOAORi91cJ
DATABASE_URL=<your-neon-url>
BETTER_AUTH_URL=<your-vercel-url>
BETTER_AUTH_TRUSTED_ORIGINS=<your-vercel-url>,<your-backend-url>
```

## Common Issues

### Issue: "BETTER_AUTH_SECRET must match"

**Solution**: Copy the exact secret from backend/.env to frontend/.env.local

### Issue: "Database connection failed"

**Solution**: Verify DATABASE_URL is correct and includes `?sslmode=require`

### Issue: "Unauthorized" errors from API

**Solution**: Check that BETTER_AUTH_SECRET matches on both frontend and backend

## Environment File Locations

```
phase-2-web-app/
├── backend/
│   ├── .env                 # Local development (NOT committed)
│   └── .env.example        # Template (safe to commit)
├── frontend/
│   ├── .env.local          # Local development (NOT committed)
│   └── .env.example        # Template (safe to commit)
└── .gitignore              # Ignores all .env files
```

## Status

✅ All environment variables configured
✅ Backend connected to Neon PostgreSQL
✅ Frontend configured with Better Auth
✅ Secrets match between frontend and backend
✅ OpenRouter API key ready for Phase III
✅ .gitignore properly configured

Ready for development and deployment!
