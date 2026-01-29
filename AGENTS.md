# AGENTS.md

## Purpose
This project uses **Spec-Driven Development (SDD)** — a workflow where **no agent is allowed to write code until specification is complete and approved**.

All AI agents (Claude, Copilot, Gemini, local LLMs, etc.) must follow the **Spec-Kit lifecycle**:
1. **Specify** → Create/update spec.md (requirements, user stories)
2. **Plan** → Create/update plan.md (architecture, design decisions)
3. **Tasks** → Create/update tasks.md (actionable implementation steps)
4. **Implement** → Execute code changes ONLY when tasks exist

---

## The Golden Rule

### ALWAYS:
- ✅ Read spec.md before making decisions
- ✅ Reference plan.md for architecture decisions
- ✅ Link every code change to a Task ID from tasks.md
- ✅ Use TodoWrite tool for multi-step implementation tasks

### NEVER:
- ❌ Generate code without a referenced Task ID
- ❌ Modify architecture without updating plan.md
- ❌ Propose new features without updating spec.md
- ❌ Skip planning and jump to coding

---

## Agent Rules

### 1. Task References
Every code file must contain a comment linking to the Task ID:

```python
# T-306: Implement MCP tool: add_task
def add_task(user_id: str, title: str, description: str = None):
    ...
```

```typescript
// T-319: Create ChatKit frontend component
const ChatInterface = () => {
    ...
```

### 2. Architecture Changes
Before modifying system architecture:
- Update `plan.md` with new component design
- Document dependencies and trade-offs
- Get user approval before proceeding
- Update CLAUDE.md if stack changes

### 3. Feature Requests
When user requests new features:
- First check if spec.md covers this requirement
- If not, update spec.md with new user story
- Create or update tasks in tasks.md
- Only then implement the code

### 4. Testing Requirements
- Every task must include tests
- Test files must match the structure: `__tests__/*.test.ts` or `tests/test_*.py`
- Tests must be documented in tasks.md before writing code

---

## Agent Skills & Capabilities

This project leverages specialized agent skills. Use these skills when their specific domain expertise is required.

### Core Roles
- **cloud-architect**: Expert high-level cloud decisions (AKS/GKE/OKE), capacity planning, and critical infrastructure choices.
- **k8s-platform-engineer**: Kubernetes operations specialist (Helm charts, manifests, scaling, secrets).
- **dapr-backend-developer**: Dapr ecosystem specialist (Pub/Sub, Bindings, State, Service Invocation) using Python/FastAPI.

### Functional Skills
- **kafka-dapr**: Event-Driven Architecture, Kafka topic design, schema definition, and Dapr Pub/Sub configuration.
- **ci-cd-gen**: Automated pipeline generation (GitHub Actions) for build, test, and cloud deployment.
- **monitor-setup**: Observability stack setup (Prometheus, Grafana dashboards, alerting rules).
- **cloud-blueprints**: Generation of reusable, spec-driven deployment blueprints for entire stacks.

### Standard Skills
- **better-auth-integration**: Authentication implementation.
- **fastapi-stack**: Backend development with FastAPI.
- **kubernetes-deployment**: General K8s deployment tasks.
- **mcp-tools**: Model Context Protocol tool creation.
- **neon-database**: Database schema and query management.
- **nextjs-stack**: Frontend development with Next.js.
- **openai-agents**: AI agent implementation.
- **spec-kit-workflow**: SDD workflow management.

---

## Monorepo Structure

```
Hackathon-2-phases/
├── frontend/                    # Shared across Phases 2-5
│   ├── src/app/[locale]/       # Next.js App Router
│   ├── src/components/         # React components
│   ├── src/lib/              # API & utilities
│   └── package.json
├── backend/                     # Shared across Phases 2-5
│   ├── routes/               # FastAPI endpoints
│   ├── models.py             # SQLModel models
│   ├── agent.py             # Phase 3: OpenAI Agent
│   ├── mcp_server.py        # Phase 3: MCP Tools
│   └── pyproject.toml
├── phase-1-console-app/          # Phase 1: CLI app
│   └── docs/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── phase-2-web-app/             # Phase 2: Web UI
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
├── phase-3-ai-chatbot/          # Phase 3: AI Chatbot
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
├── phase-4-kubernetes/           # Phase 4: K8s Deployment
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
├── phase-5-cloud-deployment/     # Phase 5: Cloud Deployment
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
├── AGENTS.md                    # This file - Agent rules
├── CLAUDE.md                    # Claude Code shim (@AGENTS.md)
├── README.md                    # Project overview
└── .specify/                   # Spec-Kit Plus config
```

---

## Tech Stack

### Frontend (Phase 2+)
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Auth**: Better Auth (JWT)
- **i18n**: next-intl (en/ur)
- **Icons**: Lucide React

### Backend (Phase 2+)
- **Framework**: FastAPI (Python 3.13+)
- **ORM**: SQLModel
- **Database**: Neon PostgreSQL
- **Package Manager**: UV
- **Auth**: Better Auth JWT integration

### AI/Chatbot (Phase 3+)
- **Framework**: OpenAI Agents SDK
- **Tools**: Official MCP SDK
- **Models**: GPT-4o (fallback to GPT-4o-mini)

### Infrastructure (Phase 4+)
- **Containerization**: Docker
- **Orchestration**: Kubernetes (Minikube)
- **Package Manager**: Helm Charts
- **AI K8s tools**: kubectl-ai, Kagent

### Cloud (Phase 5+)
- **Platform**: Azure AKS / Google GKE / Oracle OKE
- **Event Streaming**: Kafka (Confluent/Redpanda)
- **Distributed Runtime**: Dapr (Pub/Sub, State, Bindings)
- **CI/CD**: GitHub Actions

---

## Spec-Kit Workflow

### When User Requests New Feature:

1. **Check spec.md** - Is the requirement documented?
   - If NO: Update spec.md with new user story
   - If YES: Proceed to step 2

2. **Check plan.md** - Does architecture support this?
   - If NO: Update plan.md with design decision
   - If YES: Proceed to step 3

3. **Check tasks.md** - Are implementation tasks defined?
   - If NO: Create tasks with dependencies
   - If YES: Proceed to step 4

4. **Implement** - Write code referencing Task IDs
   - Every file links to a task
   - Tests included
   - Documentation updated

### Example Workflow:

**User**: "Add a delete button to the task card"

**Agent Response**:
1. Check spec.md - US for delete functionality exists
2. Check plan.md - Task card component architecture is documented
3. Check tasks.md - No task for delete button
4. Create task: `T-XXX: Add delete button to task card`
5. Implement in `frontend/src/components/TaskCard.tsx` with comment `// T-XXX`
6. Add test: `frontend/__tests__/TaskCard.test.tsx`
7. Update tasks.md status to completed

---

## Phase Progression Rules

### Phase 1: Console App
- Location: `phase-1-console-app/`
- Technology: Python CLI
- Status: ✅ Done

### Phase 2: Web Application
- Location: `frontend/`, `backend/` (shared)
- Technology: Next.js + FastAPI
- Status: 🔄 In Progress

### Phase 3: AI Chatbot
- Location: `frontend/`, `backend/` (extends Phase 2)
- New Code: `backend/agent.py`, `backend/mcp_server.py`, `backend/routes/chat.py`
- New Models: `Conversation`, `Message`
- Status: ⏳ Pending

### Phase 4: Kubernetes Deployment
- Location: `kubernetes/`
- Technology: Docker + K8s + Helm
- Status: ⏳ Pending

### Phase 5: Cloud Deployment
- Location: `kafka/`, `dapr/`, `kubernetes/`
- Technology: Kafka + Dapr + Cloud K8s
- Status: ⏳ Pending

---

## MCP Tools (Phase 3+)

When implementing AI chatbot functionality, use these MCP tools:

### Task Management Tools
- **add_task**: Create new task
- **list_tasks**: Retrieve tasks (filter by status)
- **complete_task**: Toggle task completion
- **delete_task**: Remove task
- **update_task**: Modify task title/description

### Tool Rules
- All tools are stateless
- State stored in database (conversations, messages)
- Server holds no in-memory state
- Multi-user isolation enforced via user_id

---

## API Conventions

### Frontend
- Use Server Components by default
- Client Components only for interactivity
- API calls via `@/lib/api.ts`
- Tailwind CSS for styling
- Type safety with TypeScript

### Backend
- All routes under `/api/`
- Return JSON responses
- Use Pydantic models for validation
- Handle errors with HTTPException
- Status codes: 200, 201, 400, 401, 403, 404, 500
- Async/await for all I/O operations

### Authentication
- JWT tokens required on all endpoints
- Verify with `BETTER_AUTH_SECRET`
- Extract user_id from token
- Validate user_id in URL matches token

---

## Code Quality Standards

### Python (Backend)
- Type hints for all functions
- Async/await for I/O
- SQLModel for database operations
- FastAPI best practices
- Error logging with context

### TypeScript (Frontend)
- Strict mode enabled
- Proper interface definitions
- No `any` types without justification
- Component separation of concerns
- Accessibility (ARIA labels, keyboard navigation)

---

## Testing Requirements

### Frontend
- Jest + React Testing Library
- Test user interactions
- Test API integration
- Mock external dependencies
- Coverage goal: 80%+

### Backend
- pytest with fixtures
- Test database operations
- Test API endpoints
- Test authentication
- Coverage goal: 80%+

---

## Commands Reference

### Spec-Kit Tools (via MCP or skills)
- `/sp.specify` - Create or update spec.md
- `/sp.plan` - Create or update plan.md
- `/sp.tasks` - Generate tasks.md from plan
- `/sp.implement` - Execute tasks
- `/sp.checklist` - Generate custom checklist
- `/sp.analyze` - Cross-artifact consistency analysis

### Development Commands
```bash
# Frontend
cd frontend
npm install
npm run dev              # Start dev server
npm run build            # Build for production
npm test                 # Run tests

# Backend
cd backend
uv pip install -e .      # Install dependencies
uvicorn main:app --reload --port 8000  # Start dev server
pytest                   # Run tests
```

---

## Decision Records (ADRs)

When making architectural decisions:
1. Document in plan.md under "Decision Records" section
2. Include: Decision, Rationale, Trade-offs
3. Link to relevant tasks
4. Update AGENTS.md if stack changes

Example:
```markdown
### DR-001: ChatKit vs Custom UI
**Decision**: Use OpenAI ChatKit
**Rationale**:
- Built-in conversational interface
- Better UX out of box
- Less development time
**Trade-offs**:
- Less customization
- Learning curve
**Tasks**: T-319, T-320, T-321
```

---

## Troubleshooting

### Common Issues

**Issue**: Agent proposes code without Task ID
**Solution**: Remind agent to check tasks.md first, create task if needed

**Issue**: Architecture changes break existing code
**Solution**: Ensure plan.md is updated before implementing, review dependencies

**Issue**: Tests failing after changes
**Solution**: Update tests in tasks.md before code changes, ensure backward compatibility

**Issue**: Frontend/Backend mismatch in API
**Solution**: Check spec.md for API contract, update both sides together

---

## Contact & Support

- **Root Documentation**: README.md
- **Phase Specs**: `phase-X/spec.md`
- **Phase Plans**: `phase-X/plan.md`
- **Phase Tasks**: `phase-X/tasks.md`
- **Project Context**: Hackathon II - Todo Spec-Driven Development.md

---

**Last Updated**: 2026-01-30
**Spec-Kit Version**: Plus
