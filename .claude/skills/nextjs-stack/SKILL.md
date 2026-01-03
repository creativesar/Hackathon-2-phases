---
name: nextjs-stack
description: Next.js frontend development patterns for Hackathon II Todo App (frontend folder). Use when implementing components, pages, routes, or Next.js-specific features. Project uses: (1) Next.js 16.1+ (App Router), (2) TypeScript (strict mode), (3) Tailwind CSS, (4) Better Auth, (5) next-intl (i18n - en/ur), (6) Lucide icons, (7) React 19.3
---

# Next.js Frontend Stack - Hackathon II

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   ├── globals.css             # Tailwind imports
│   │   └── [locale]/             # i18n routing
│   │       ├── (auth)/            # Auth routes (signin/signup)
│   │       │   ├── signin/page.tsx
│   │       │   └── signup/page.tsx
│   │       └── (protected)/        # Protected routes
│   │           └── tasks/
│   │               ├── page.tsx        # Task list page
│   │               └── TaskList.tsx    # Task list component
│   ├── components/
│   │   ├── TaskCard.tsx            # Individual task display
│   │   ├── TaskForm.tsx            # Add/edit task form
│   │   ├── ThemeToggle.tsx          # Dark mode toggle
│   │   └── ConfirmModal.tsx          # Delete confirmation
│   ├── lib/
│   │   ├── api.ts                  # Backend API client
│   │   ├── auth.ts                 # Better Auth utilities
│   │   └── types.ts                # TypeScript interfaces
│   └── i18n/
│       ├── request.ts               # i18n request config
│       └── routing.ts               # i18n routing
├── messages/
│   ├── en.json                   # English translations
│   └── ur.json                   # Urdu translations
├── public/                         # Static assets
├── next.config.ts                  # Next.js config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                  # TypeScript config
└── package.json                    # Dependencies
```

## App Router Structure

### Root Layout

```tsx
// src/app/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={routing.defaultLocale}>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <NextIntlClientProvider>
          <header className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Todo App</h1>
            <div className="flex gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### Landing Page

```tsx
// src/app/page.tsx
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const t = getTranslations('home')

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-6">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          {t('subtitle')}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/en/signin"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('signIn')}
            <ArrowRight className="inline ml-2" />
          </Link>
          <Link
            href="/en/signup"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {t('signUp')}
          </Link>
        </div>
      </div>
    </div>
  )
}
```

### Protected Tasks Page

```tsx
// src/app/[locale]/(protected)/tasks/page.tsx
import { getTranslations } from 'next-intl/server'
import TaskList from '@/components/TaskList'
import { isAuthenticated } from '@/lib/auth'

export default async function TasksPage({
  params: { locale: string }
}: {
  params: { locale: string }
}) {
  // Check auth server-side
  const auth = await isAuthenticated()

  if (!auth) {
    // Redirect to signin if not authenticated
    return Response.redirect(new URL(`/${locale}/signin`))
  }

  const t = getTranslations('tasks')

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">{t('title')}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </div>
      <TaskList />
    </div>
  )
}
```

## Components

### Server Component (TaskList - Wrapper)

```tsx
// src/app/[locale]/(protected)/tasks/TaskList.tsx
'use client'

import { use, useEffect } from 'react'
import { getTasks, createTask, deleteTask, toggleComplete } from '@/lib/api'
import { getToken, getUserId } from '@/lib/auth'
import { useTranslations } from 'next-intl'
import TaskCard from '@/components/TaskCard'
import TaskForm from '@/components/TaskForm'
import { Plus, CheckCircle2 } from 'lucide-react'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations('tasks')
  const userId = getUserId()!

  useEffect(() => {
    loadTasks()
  }, [userId])

  async function loadTasks() {
    setLoading(true)
    const data = await getTasks(userId)
    setTasks(data)
    setLoading(false)
  }

  async function handleCreate(taskData: { title: string; description?: string }) {
    const newTask = await createTask(userId, taskData)
    setTasks([...tasks, newTask])
  }

  async function handleDelete(taskId: number) {
    await deleteTask(userId, taskId)
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  async function handleToggleComplete(taskId: number) {
    const updated = await toggleComplete(userId, taskId)
    setTasks(tasks.map(t => t.id === taskId ? updated : t))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add task form */}
      <TaskForm onSubmit={handleCreate} />

      {/* Task stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {tasks.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('total')}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {tasks.filter(t => t.completed).length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('completed')}
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {tasks.filter(t => !t.completed).length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('pending')}
          </p>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 opacity-50" />
            <p>{t('noTasks')}</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => handleDelete(task.id)}
              onToggle={() => handleToggleComplete(task.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
```

### Client Component (TaskCard)

```tsx
// src/components/TaskCard.tsx
'use client'

import { useState } from 'react'
import { Trash2, Check, Pencil, Calendar } from 'lucide-react'
import { useTranslations } from 'next-intl'
import ConfirmModal from '@/components/ConfirmModal'

interface TaskCardProps {
  task: {
    id: number
    title: string
    description?: string
    completed: boolean
    created_at: string
  }
  onDelete: () => void
  onToggle: () => void
}

export default function TaskCard({ task, onDelete, onToggle }: TaskCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const t = useTranslations('tasks')

  return (
    <div className={`border rounded-lg p-6 transition-all ${
      task.completed
        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-lg'
    }`}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 transition-colors ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
          }`}
          aria-label={task.completed ? t('markIncomplete') : t('markComplete')}
        >
          {task.completed && <Check className="w-4 h-4" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold mb-1 ${
            task.completed ? 'text-gray-500 dark:text-gray-500 line-through' : ''
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {task.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setShowConfirm(true)}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            aria-label={t('delete')}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <ConfirmModal
          title={t('confirmDelete')}
          message={t('confirmDeleteMessage', { title: task.title })}
          onConfirm={() => {
            onDelete()
            setShowConfirm(false)
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}
```

### Client Component (TaskForm)

```tsx
// src/components/TaskForm.tsx
'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface TaskFormProps {
  onSubmit: (data: { title: string; description?: string }) => void
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showForm, setShowForm] = useState(false)
  const t = useTranslations('tasks')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) return

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined
    })

    setTitle('')
    setDescription('')
    setShowForm(false)
  }

  return (
    <>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('addTask')}
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('title')}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('titlePlaceholder')}
              maxLength={200}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('description')}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              maxLength={1000}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              {t('save')}
            </button>
          </div>
        </form>
      )}
    </>
  )
}
```

## API Client

```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('better-auth-token')

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('better-auth-token')
      window.location.href = `/${currentLocale()}/signin`
    }

    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

// Current locale helper
function currentLocale(): string {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    const match = path.match(/^\/([a-z]{2})\//)
    return match ? match[1] : 'en'
  }
  return 'en'
}

// Task CRUD operations
export async function getTasks(userId: string, status?: string) {
  const query = status ? `?status=${status}` : ''
  return apiRequest(`/api/${userId}/tasks${query}`)
}

export async function createTask(userId: string, data: { title: string; description?: string }) {
  return apiRequest(`/api/${userId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateTask(
  userId: string,
  taskId: number,
  data: { title?: string; description?: string; completed?: boolean }
) {
  return apiRequest(`/api/${userId}/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteTask(userId: string, taskId: number) {
  return apiRequest(`/api/${userId}/tasks/${taskId}`, {
    method: 'DELETE',
  })
}

export async function toggleComplete(userId: string, taskId: number) {
  return apiRequest(`/api/${userId}/tasks/${taskId}/complete`, {
    method: 'PATCH',
  })
}
```

## Better Auth Integration

```typescript
// src/lib/auth.ts
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('better-auth-token')
}

export function getUserId(): string | null {
  if (typeof window === 'undefined') return null
  const session = localStorage.getItem('better-auth-session')
  return session ? JSON.parse(session).user?.id : null
}

export function isAuthenticated(): boolean {
  return !!getToken() && !!getUserId()
}

// Server-side auth check (async)
export async function isAuthenticated(): Promise<boolean> {
  if (typeof window === 'undefined') {
    // Server-side check
    const { auth } = await import('better-auth/react/server')
    const session = await auth.api.getSession()
    return !!session?.user
  }
  return isAuthenticated()
}

export function logout() {
  localStorage.removeItem('better-auth-token')
  localStorage.removeItem('better-auth-session')
  window.location.href = `${currentLocale()}/signin`
}
```

## TypeScript Types

```typescript
// src/lib/types.ts
export interface Task {
  id: number
  user_id: string
  title: string
  description?: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface TaskCreate {
  title: string
  description?: string
}

export interface TaskUpdate {
  title?: string
  description?: string
  completed?: boolean
}

export interface User {
  id: string
  email: string
  name: string
}

export interface ChatResponse {
  conversation_id: number
  response: string
  tool_calls?: any[]
  tool_results?: any[]
}

export interface ChatRequest {
  message: string
  conversation_id?: number
}
```

## i18n Translations

```json
// messages/en.json
{
  "home": {
    "title": "Todo App",
    "subtitle": "Manage your tasks efficiently",
    "signIn": "Sign In",
    "signUp": "Sign Up"
  },
  "tasks": {
    "title": "My Tasks",
    "subtitle": "Add, complete, and manage your tasks",
    "addTask": "Add Task",
    "save": "Save",
    "cancel": "Cancel",
    "title": "Title",
    "titlePlaceholder": "Enter task title...",
    "description": "Description",
    "descriptionPlaceholder": "Enter task description...",
    "total": "Total",
    "completed": "Completed",
    "pending": "Pending",
    "noTasks": "No tasks yet. Create your first task!",
    "markComplete": "Mark as complete",
    "markIncomplete": "Mark as incomplete",
    "confirmDelete": "Delete Task",
    "confirmDeleteMessage": "Are you sure you want to delete \"{{title}}\"?"
  }
}

// messages/ur.json
{
  "home": {
    "title": "ٹوے ایپ",
    "subtitle": "اپنے کامز کو مؤثر طریقے سے منیجیں",
    "signIn": "سائن ان",
    "signUp": "سائن اپ"
  },
  "tasks": {
    "title": "میری کامز",
    "subtitle": "اپنے کمز شامل، مکمل اور منیج کریں",
    "addTask": "کم شامل کریں",
    "save": "محفوظ کریں",
    "cancel": "منسوخ کریں",
    "title": "عنوان",
    "titlePlaceholder": "کام کا عنوان درج کریں...",
    "description": "تفصیل",
    "descriptionPlaceholder": "کام کی تفصیل درج کریں...",
    "total": "کل",
    "completed": "مکمل",
    "pending": "زیر التواء",
    "noTasks": "ابھ تک کوئی بھ کام نہیں۔ اپنی پہلی کام بنائیں!",
    "markComplete": "مکمل کے طور پر نشان دیں",
    "markIncomplete": "نامکمل کے طور پر نشان دیں",
    "confirmDelete": "کم حذف کریں",
    "confirmDeleteMessage": "کیا آپ واقعی \"{{title}}\" کو حذف کرنا چاہتے ہیں؟"
  }
}
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## Quick Reference

| Task | Code Pattern |
|------|-------------|
| Server component | No 'use client' directive |
| Client component | `'use client'` at top of file |
| API call with JWT | `apiRequest()` includes Bearer token |
| Use i18n | `useTranslations('namespace')` |
| Get token | `localStorage.getItem('better-auth-token')` |
| Get user ID | `localStorage.getItem('better-auth-session')` |
| Redirect on 401 | `window.location.href = '/signin'` |
| Tailwind classes | `bg-blue-600 hover:bg-blue-700` |
| Lucide icons | `import { Plus } from 'lucide-react'` |
| Dark mode | `dark:bg-gray-900 dark:text-gray-100` |

## Project-Specific Rules

1. **Use Server Components by default** - Only 'use client' when interactivity needed
2. **API calls go through `@/lib/api.ts`** - Never use fetch directly
3. **All protected routes require auth check** - Server-side verify with Better Auth
4. **Use Tailwind CSS only** - No inline styles or custom CSS unless necessary
5. **i18n support required** - Use `useTranslations()` for all user-facing text
6. **Better Auth tokens in localStorage** - Keys: `better-auth-token`, `better-auth-session`
7. **Type strict mode enabled** - No `any` types without justification
8. **Responsive design** - Use `md:` and `lg:` breakpoints for mobile/desktop
9. **Loading states** - Show skeleton loaders during async operations
10. **Error boundaries** - Wrap components in error handling

## Common Pitfalls

❌ **Don't:** Use `fetch` directly in components
✅ **Do:** Use `apiRequest()` from `@/lib/api.ts`

❌ **Don't:** Put heavy computation in client components
✅ **Do:** Move to server components or API routes

❌ **Don't:** Forget JWT token in API calls
✅ **Do:** Include `Authorization: Bearer ${token}` header

❌ **Don't:** Use `any` type without justification
✅ **Do:** Define proper TypeScript interfaces

❌ **Don't:** Hardcode strings - use i18n
✅ **Do:** Use `t('key')` for all user-facing text
