---
name: better-auth-integration
description: Better Auth JWT integration between Next.js frontend and FastAPI backend. Use when implementing authentication, protecting routes, verifying JWT tokens, or managing user sessions. Includes: (1) JWT token flow, (2) Frontend configuration, (3) Backend middleware, (4) Shared secret management
---

# Better Auth Integration

## Authentication Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Next.js        │────▶│  Better Auth    │────▶│  FastAPI       │
│  Frontend       │     │  (JWT Issuer)  │     │  (JWT Verifier) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                          │                          │
        └──────────────────────────┘                          │
           Authorization: Bearer <token>                    └──▶ Verify & Extract User
```

## Architecture Overview

| Component | Role | Files |
|-----------|-------|--------|
| **Better Auth** | JWT token issuer | Next.js frontend |
| **FastAPI Backend** | JWT token verifier | Python backend |
| **Shared Secret** | Signs & verifies JWT | Both use same key |

## Frontend Setup (Next.js)

### 1. Install Better Auth

```bash
npm install better-auth
```

### 2. Configure Better Auth

```typescript
// lib/auth.config.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
  plugins: {
    jwt: {
      // Enable JWT plugin
      enabled: true,
      expiresIn: "7d",
    },
  },
  user: {
    additionalFields: {
      userId: {
        type: "string",
        required: true,
      },
    },
  },
})
```

### 3. Environment Variables (Frontend)

```bash
# .env.local
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here
```

### 4. Auth Server Actions

```typescript
// lib/auth-actions.ts
import { auth } from "@/lib/auth.config"

export async function signUp(data: {
  email: string
  password: string
  name: string
}) {
  const user = await auth.api.signUp.email({
    email: data.email,
    password: data.password,
    name: data.name,
  })

  if (user.error) {
    throw new Error(user.error.message)
  }

  return user.data
}

export async function signIn(data: {
  email: string
  password: string
}) {
  const result = await auth.api.signIn.email({
    email: data.email,
    password: data.password,
  })

  if (result.error) {
    throw new Error(result.error.message)
  }

  // Store JWT token in localStorage
  if (result.data?.jwt) {
    localStorage.setItem('better-auth-token', result.data.jwt)
  }

  return result.data
}

export async function signOut() {
  await auth.api.signOut()
  localStorage.removeItem('better-auth-token')
  window.location.href = '/en/signin'
}
```

### 5. Signin Page

```tsx
// app/[locale]/(auth)/signin/page.tsx
'use client'

import { signIn } from '@/lib/auth-actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      await signIn({ email, password })
      router.push('/en/tasks')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border rounded p-2 w-full mb-4"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border rounded p-2 w-full mb-4"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Sign In
      </button>
    </form>
  )
}
```

### 6. Get JWT Token on Client

```typescript
// lib/auth.ts
export function getJWTToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('better-auth-token')
}

export function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.sub || payload.userId
  } catch {
    return null
  }
}
```

## Backend Setup (FastAPI)

### 1. Install Dependencies

```bash
uv pip install python-jose[cryptography]
```

### 2. Environment Variables (Backend)

```bash
# .env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key-here  # MUST match frontend!
OPENAI_API_KEY=sk-...
```

### 3. JWT Verification Middleware

```python
# api/dependencies.py
from fastapi import Depends, HTTPException, Header
from jose import jwt, JWTError
from typing import Optional
import os

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

async def get_current_user(
    authorization: Optional[str] = Header(None)
) -> str:
    """
    Extract and verify JWT token from Authorization header.
    Returns user_id (sub claim).
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        # Extract token from "Bearer <token>"
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        user_id = payload.get("sub") or payload.get("userId")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        return user_id

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token error: {str(e)}")
```

### 4. Path User Verification

```python
# api/dependencies.py (continued)
from fastapi import Depends, Request
from sqlmodel import Session, select
from ..models import Task

async def verify_path_user(
    user_id: str,
    request: Request,
    current_user: str = Depends(get_current_user)
) -> str:
    """
    Ensure user_id in URL path matches authenticated user.
    Used for all endpoints with /api/{user_id}/ pattern.
    """
    if user_id != current_user:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: User ID mismatch"
        )
    return user_id
```

### 5. Protected Routes Example

```python
# api/tasks.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..models import Task
from .dependencies import get_current_user, verify_path_user, get_session

router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])

@router.get("")
async def list_tasks(
    user_id: str,  # From URL path
    session: Session = Depends(get_session),
    _: str = Depends(verify_path_user)  # Verify ownership
):
    """List all tasks for authenticated user."""
    query = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(query).all()
    return tasks

@router.post("")
async def create_task(
    user_id: str,
    task: TaskCreate,
    session: Session = Depends(get_session),
    _: str = Depends(verify_path_user)
):
    """Create new task for authenticated user."""
    db_task = Task.model_validate(task)
    db_task.user_id = user_id
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.get("/{task_id}")
async def get_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    _: str = Depends(verify_path_user)
):
    """Get specific task."""
    task = session.get(Task, task_id)

    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    return task

@router.put("/{task_id}")
async def update_task(
    user_id: str,
    task_id: int,
    task_update: TaskUpdate,
    session: Session = Depends(get_session),
    _: str = Depends(verify_path_user)
):
    """Update task."""
    task = session.get(Task, task_id)

    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    task_data = task_update.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(task, key, value)

    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.delete("/{task_id}")
async def delete_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    _: str = Depends(verify_path_user)
):
    """Delete task."""
    task = session.get(Task, task_id)

    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(task)
    session.commit()
    return {"status": "deleted", "task_id": task_id}

@router.patch("/{task_id}/complete")
async def toggle_complete(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    _: str = Depends(verify_path_user)
):
    """Toggle task completion."""
    task = session.get(Task, task_id)

    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = not task.completed
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

## API Client with JWT

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Get JWT token from localStorage
  const token = localStorage.getItem('better-auth-token')

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Include Authorization header with JWT
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('better-auth-token')
      window.location.href = '/en/signin'
    }

    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

// Example: Get tasks for user
export async function getTasks(userId: string) {
  // userId must match JWT token's sub claim
  return apiRequest(`/api/${userId}/tasks`)
}
```

## Shared Secret Management

### Why Shared Secret Matters

| Issue | Without Shared Secret | With Shared Secret |
|-------|---------------------|-------------------|
| Token Signing | Frontend uses key A | Frontend and backend use same key |
| Token Verification | Backend uses key B | Backend can verify frontend's tokens |
| Security | Mismatch = 401 errors | Proper authentication flow |

### Setting Shared Secret

```bash
# Frontend .env.local
BETTER_AUTH_SECRET=super-secret-key-change-in-production

# Backend .env
BETTER_AUTH_SECRET=super-secret-key-change-in-production

# MUST be identical!
```

### Security Best Practices

1. **Never commit secrets to Git**
2. **Use strong random secrets** (32+ characters)
3. **Rotate secrets regularly** (not during hackathon)
4. **Use different secrets for dev/stage/prod**
5. **Store in environment variables** only

## Middleware Protection

### Next.js Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('better-auth-token') ||
                 localStorage.getItem('better-auth-token')

  // Protect all /api routes and /tasks pages
  if (
    (request.nextUrl.pathname.startsWith('/tasks') ||
     request.nextUrl.pathname.startsWith('/api')) &&
    !token
  ) {
    return NextResponse.redirect(new URL('/en/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/tasks/:path*', '/api/:path*'],
}
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|--------|----------|
| 401 Unauthorized | Token missing/expired | Check localStorage, redirect to signin |
| 403 Forbidden | User ID mismatch | Verify URL user_id matches JWT sub |
| Token not in header | Client not sending token | Add `Authorization: Bearer ${token}` |
| Invalid signature | Secret key mismatch | Ensure BETTER_AUTH_SECRET matches |
| Token in URL instead of header | Insecure implementation | Move token to Authorization header |

## Quick Reference

| Component | Code Pattern |
|-----------|-------------|
| Get JWT token | `localStorage.getItem('better-auth-token')` |
| Attach to API | `headers: { Authorization: Bearer ${token} }` |
| Verify in FastAPI | `Depends(get_current_user)` |
| Verify path user | `Depends(verify_path_user)` |
| Sign out | `localStorage.removeItem('better-auth-token')` |
| Redirect on 401 | `window.location.href = '/signin'` |

## Testing Auth Flow

### Test Sequence

1. **Sign up user** → JWT stored in localStorage
2. **Visit /tasks** → Token sent in Authorization header
3. **Backend verifies** → Token decoded with shared secret
4. **User ID match** → Tasks returned
5. **Sign out** → Token removed, redirect to signin

### cURL Testing

```bash
# Get token (from localStorage after signin)
TOKEN="your-jwt-token-here"

# Test protected endpoint
curl -X GET \
  http://localhost:8000/api/user123/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Should return tasks if user_id matches token's sub claim
```

## Project-Specific Rules

1. **Shared secret MUST match** between frontend and backend
2. **All backend routes require JWT** except health check
3. **User ID in URL MUST match JWT sub claim**
4. **Token in Authorization header only** - never in URL or body
5. **Handle 401 errors** - redirect to signin or refresh token
6. **Use `verify_path_user` dependency** on all /api/{user_id} routes
7. **Store token in localStorage** on successful signin
8. **Remove token on signout** and redirect to home
