# Todo App - Hackathon II Monorepo

## Project Overview
This is a monorepo for Phases 2-5 of the Hackathon II Todo App project. The project evolves from a simple web app to a cloud-native AI chatbot deployed on Kubernetes.

## Monorepo Structure

```
Hackathon-2-phases/
├── phase-1-console-app/          # Phase 1: Console app (separate)
│
├── frontend/                     # Phase 2+: Next.js App Router
│   ├── src/
│   ├── package.json
│   ├── CLAUDE.md
│   └── README.md
│
├── backend/                      # Phase 2+: FastAPI + SQLModel
│   ├── app/
│   ├── main.py
│   ├── models.py
│   ├── CLAUDE.md
│   └── README.md
│
├── mcp-server/                  # Phase 3+: MCP Server (OpenAI Agents SDK)
│   ├── src/
│   ├── main.py
│   └── CLAUDE.md
│
├── kubernetes/                   # Phase 4+: Helm charts & manifests
│   ├── frontend/
│   ├── backend/
│   ├── mcp-server/
│   └── README.md
│
├── phase-2-web-app/
│   └── docs/                    # Phase 2 specs only
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
│
├── phase-3-ai-chatbot/
│   └── docs/                    # Phase 3 specs only
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
│
├── phase-4-kubernetes/
│   └── docs/                    # Phase 4 specs only
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
│
├── phase-5-cloud-deployment/
│   └── docs/                    # Phase 5 specs only
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
│
├── .specify/                    # SpecKit Plus configuration
├── history/                     # Prompt History Records & ADRs
├── CLAUDE.md                    # This file - Monorepo instructions
└── README.md
```

## Phase Progression

| Phase | Description | Code Folders | Docs Folder | Status |
|-------|-------------|--------------|-------------|---------|
| I | Console App | `phase-1-console-app/` | `phase-1-console-app/docs/` | ✅ Done |
| II | Web App | `frontend/`, `backend/` | `phase-2-web-app/docs/` | 🔄 In Progress |
| III | AI Chatbot | Add `mcp-server/` | `phase-3-ai-chatbot/docs/` | ⏳ Pending |
| IV | K8s Deployment | Add `kubernetes/` | `phase-4-kubernetes/docs/` | ⏳ Pending |
| V | Cloud Deployment | Add `kafka/`, `dapr/` | `phase-5-cloud-deployment/docs/` | ⏳ Pending |

## Tech Stack

### Frontend (Phase 2+)
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Better Auth (JWT)
- OpenAI ChatKit (Phase 3+)

### Backend (Phase 2+)
- Python 3.13+
- FastAPI
- SQLModel (ORM)
- Neon PostgreSQL
- Better Auth JWT integration

### MCP Server (Phase 3+)
- Python FastAPI
- OpenAI Agents SDK
- Official MCP SDK

### Infrastructure (Phase 4+)
- Docker
- Kubernetes (Minikube)
- Helm Charts
- kubectl-ai, Kagent

### Cloud (Phase 5+)
- Azure AKS / Google GKE / Oracle OKE
- Kafka (Confluent/Redpanda)
- Dapr (Pub/Sub, State, Bindings, Secrets)
- GitHub Actions CI/CD

## Development Workflow

### Spec-Driven Development
Follow the SDD-RI workflow:
1. **Specify** → `/sp.specify` or edit `phase-X/docs/spec.md`
2. **Plan** → `/sp.plan` or edit `phase-X/docs/plan.md`
3. **Tasks** → `/sp.tasks` or edit `phase-X/docs/tasks.md`
4. **Implement** → `/sp.implement` or manual implementation

### Working on a Phase
1. Navigate to the phase docs: `phase-X-web-app/docs/`
2. Read the spec/plan/tasks to understand requirements
3. Implement changes in shared code folders (`frontend/`, `backend/`, etc.)
4. Update docs as needed

### Running the App

**Frontend (Phase 2+):**
```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:3000
```

**Backend (Phase 2+):**
```bash
cd backend
uv pip install -e .
uvicorn app.main:app --reload --port 8000
# API at http://localhost:8000
```

**MCP Server (Phase 3+):**
```bash
cd mcp-server
uvicorn main:app --reload --port 8001
# MCP tools at http://localhost:8001
```

**Local K8s (Phase 4+):**
```bash
minikube start
helm install todo-backend ./kubernetes/backend
helm install todo-frontend ./kubernetes/frontend
```

## API Endpoints (Phase 2+)

All endpoints require JWT authentication (Better Auth):

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/{user_id}/tasks` | List all tasks |
| POST | `/api/{user_id}/tasks` | Create new task |
| GET | `/api/{user_id}/tasks/{id}` | Get task details |
| PUT | `/api/{user_id}/tasks/{id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |
| POST | `/api/{user_id}/chat` | Chat with AI (Phase 3+) |

## Authentication

- **Frontend:** Better Auth (JavaScript/TypeScript)
- **Backend:** JWT verification via shared secret (`BETTER_AUTH_SECRET`)
- **Flow:** Login → JWT token → API requests with `Authorization: Bearer <token>`

## Environment Variables

Create `.env` files in respective folders:

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://...
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
```

**Backend (.env):**
```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
```

## Code Conventions

### Frontend
- Use Server Components by default
- Client Components only for interactivity
- API calls via `@/lib/api.ts`
- Tailwind CSS for styling
- i18n support (en/ur)

### Backend
- FastAPI routes under `/api/`
- Pydantic models for validation
- SQLModel for database operations
- Error handling with HTTPException
- Async/await throughout

### Testing
- Frontend: Jest + React Testing Library
- Backend: pytest with fixtures
- Run tests: `npm test` or `pytest`

## Spec-Kit Plus Integration

For advanced spec-driven development:
- Edit specs in `phase-X/docs/`
- Use `/sp.specify`, `/sp.plan`, `/sp.tasks` commands
- Track changes in `history/`

## Additional Resources

- [Hackathon Documentation](./Hackathon%20II%20-%20Todo%20Spec-Driven%20Development.md)
- [Frontend CLAUDE.md](./frontend/CLAUDE.md)
- [Backend CLAUDE.md](./backend/CLAUDE.md)
