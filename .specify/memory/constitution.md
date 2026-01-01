# Constitution - Todo App Hackathon II

## Purpose
This project demonstrates Spec-Driven Development (SDD) where we build a Todo application evolving from a simple console app to a distributed cloud-native AI system. All development follows strict spec-driven principles.

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
- **MUST** follow: Specify → Plan → Tasks → Implement workflow
- **NO** code generation without complete specification
- **NO** manual coding allowed - use Claude Code for implementation
- Every feature MUST have corresponding spec.md, plan.md, tasks.md
- All implementations must reference task IDs and spec sections

### II. Technology Stack Adherence
Each phase uses specific technologies; no unauthorized substitutions:

**Phase I**: Python 3.13+, UV, Claude Code, Spec-Kit Plus
**Phase II**: Next.js 16+ (App Router), FastAPI, SQLModel, Neon PostgreSQL, Better Auth
**Phase III**: OpenAI ChatKit, OpenAI Agents SDK, Official MCP SDK
**Phase IV**: Docker, Minikube, Helm, kubectl-ai, kagent, Gordon (Docker AI)
**Phase V**: Kafka, Dapr, AKS/GKE/OKE, GitHub Actions CI/CD

### III. Phase Dependencies & Sequential Evolution
- Phases build sequentially; CANNOT skip phases
- Each phase inherits from previous implementation
- Maintain clean separation of concerns across phase boundaries
- Use monorepo structure with spec-kit organization

**Phase Dependency Chain**:
```
Phase I (Console App)
    ↓ Inherits: Core logic, data models
Phase II (Web App)
    ↓ Inherits: Backend API, authentication
Phase III (AI Chatbot)
    ↓ Inherits: Full application stack
Phase IV (Kubernetes - Local)
    ↓ Inherits: Containerized app
Phase V (Cloud Deployment - Advanced)
```

### IV. Code Quality Standards
- Clean code principles applied at all phases
- Proper Python/TypeScript project structure
- Clear naming conventions (snake_case for Python, camelCase for TypeScript)
- Comprehensive inline documentation
- Error handling for all user-facing operations

### V. Security Standards
- JWT-based authentication (Phase II onwards) with shared secret
- Secure secret management (environment variables, Kubernetes secrets)
- Input validation on all API endpoints
- SQL injection prevention via SQLModel ORM
- XSS protection on frontend
- CORS properly configured

### VI. Database Standards
- SQLModel for ORM (Phase II onwards)
- Neon Serverless PostgreSQL for production persistence
- Proper indexing on user_id, completed fields
- Foreign key relationships maintained
- Database migration scripts included
- Connection pooling implemented

### VII. Cloud-Native Standards
- Containerization with Docker (Phase IV onwards)
- Orchestration via Kubernetes
- Helm charts for deployment management
- AIOps tools: kubectl-ai, kagent, Gordon for operations
- CI/CD pipelines with GitHub Actions (Phase V)

### VIII. AI Agent Standards
- MCP server for tool interfaces (Phase III)
- Stateless chat endpoint design
- Conversation persistence in database
- Natural language understanding capabilities
- Graceful error handling and user feedback
- Tool composition support

## Phase Requirements & Feature Progression

### Basic Level (All Phases)
1. Add Task – Create new todo items
2. Delete Task – Remove tasks from list
3. Update Task – Modify existing task details
4. View Task List – Display all tasks
5. Mark as Complete – Toggle task completion status

### Intermediate Level (Phase II+)
1. Priorities & Tags/Categories – High/Medium/Low, Work/Home
2. Search & Filter – By keyword, status, priority, date
3. Sort Tasks – By due date, priority, alphabetical

### Advanced Level (Phase V)
1. Recurring Tasks – Auto-reschedule repeating tasks
2. Due Dates & Reminders – Date/time pickers, notifications

## Bonus Features Allocation

| Bonus Feature | Relevant Phases | Implementation Strategy | Points |
|--------------|-----------------|------------------------|--------|
| Reusable Intelligence (Subagents, Agent Skills) | **ALL Phases** | Create Claude Code skills for: spec generation, task breakdown, deployment automation | +200 |
| Cloud-Native Blueprints | **Phase IV, V** | Create spec-driven deployment blueprints via Agent Skills | +200 |
| Multi-language Support (Urdu) | **Phase III** | Add Urdu language support in chatbot prompts | +100 |
| Voice Commands | **Phase III** | Integrate Web Speech API for voice input | +200 |

## Monorepo Structure

```
hackathon-todo/
├── .spec-kit/                    # Spec-Kit configuration
│   └── config.yaml
├── specs/                        # All specifications
│   ├── features/                  # Feature specs
│   ├── api/                      # API endpoints
│   ├── database/                 # Database schemas
│   └── ui/                       # UI components
├── .specify/
│   └── memory/constitution.md     # This file
├── CLAUDE.md                     # Root Claude Code instructions
├── phase-1-console-app/          # Console app (100 pts)
│   ├── src/
│   ├── README.md
│   └── docs/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── phase-2-web-app/              # Next.js + FastAPI (150 pts)
│   ├── frontend/
│   ├── backend/
│   ├── README.md
│   └── docs/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── phase-3-ai-chatbot/           # ChatKit + Agents SDK (200 pts)
│   ├── frontend/
│   ├── backend/
│   ├── README.md
│   └── docs/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── phase-4-kubernetes/            # Minikube + Helm (250 pts)
│   ├── frontend/
│   ├── backend/
│   ├── helm-charts/
│   ├── README.md
│   └── docs/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── phase-5-cloud-deployment/      # AKS/GKE + Kafka + Dapr (300 pts)
│   ├── services/
│   ├── helm-charts/
│   ├── .github/workflows/
│   ├── README.md
│   └── docs/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── bonus-features/               # Bonus implementations (+600 pts max)
│   ├── reusable-intelligence/
│   ├── cloud-native-blueprints/
│   ├── multi-language/
│   └── voice-commands/
│   └── README.md
└── history/
    ├── prompts/                  # PHR records
    └── adr/                    # Architecture Decision Records
```

## Non-Negotiable Rules

1. **Spec-Driven**: No code without complete specification
2. **Sequential**: Follow phase order; cannot skip
3. **No Manual Coding**: Use Claude Code only for implementation
4. **Documentation**: Every phase must have README.md and docs/*
5. **Version Control**: Git commits with meaningful messages
6. **Demo Video**: Max 90 seconds for each submission
7. **PHR Records**: Create Prompt History Record for every user prompt
8. **ADRs**: Document significant architectural decisions

## Success Criteria

- ✅ All 5 phases completed sequentially
- ✅ Working demos for each phase
- ✅ Public GitHub repository
- ✅ Deployed applications (Phase II: Vercel, Phase III-V: Cloud)
- ✅ Demo videos under 90 seconds
- ✅ Complete specification files (spec.md, plan.md, tasks.md)
- ✅ Bonus features implemented for extra points

## Testing Requirements

- **Phase I**: Manual testing acceptable
- **Phase II**: API testing + Frontend testing
- **Phase III**: Integration testing + MCP tool testing
- **Phase IV**: End-to-end testing on Minikube
- **Phase V**: Load testing + Chaos testing

## Deployment Requirements

- **Phase I**: Local Python execution
- **Phase II**: Deploy to Vercel (frontend) + Backend API URL
- **Phase III**: Deploy chatbot with OpenAI domain allowlist
- **Phase IV**: Deploy on Minikube locally with Helm
- **Phase V**: Deploy to cloud (AKS/GKE/OKE) with Kafka + Dapr

## API Standards (Phase II onwards)

### RESTful API Endpoints
- Base URL: `/api/{user_id}`
- All endpoints require JWT authentication
- Use appropriate HTTP verbs (GET, POST, PUT, DELETE, PATCH)
- Return JSON responses with consistent structure
- Handle errors with proper HTTP status codes

### Error Taxonomy
- 400 Bad Request – Invalid input
- 401 Unauthorized – Missing/invalid token
- 403 Forbidden – Wrong user accessing data
- 404 Not Found – Resource not found
- 422 Unprocessable Entity – Validation error
- 500 Internal Server Error – Server error

## MCP Tools Standards (Phase III onwards)

### Tool Specifications
All MCP tools MUST include:
- Purpose description
- Required parameters (with types)
- Optional parameters (with defaults)
- Return value structure
- Example input/output
- Error handling

### Available Tools
- `add_task` – Create new task
- `list_tasks` – Retrieve tasks with filters
- `complete_task` – Mark task complete
- `delete_task` – Remove task
- `update_task` – Modify task details

## Development Workflow

1. **Specify**: Create spec.md with requirements
2. **Plan**: Create plan.md with architecture
3. **Tasks**: Break down into tasks.md
4. **Implement**: Use Claude Code with `/sp.implement`
5. **Test**: Verify against acceptance criteria
6. **Document**: Update README and create PHR

## Governance

- Constitution supersedes all other practices
- Amendments require documentation, approval, migration plan
- All PRs/reviews must verify compliance
- Complexity must be justified with architectural decisions
- Use `history/prompts/` for runtime development guidance

**Version**: 1.0.0 | **Ratified**: 2025-12-01 | **Last Amended**: 2025-12-01
