# Hackathon II - Todo App (Spec-Driven Development)

## Overview
Complete spec-driven evolution of a todo application from console app to cloud-native AI system using Claude Code and Spec-Kit Plus.

## Project Structure

```
hackathon-2-phases/
├── .specify/memory/
│   └── constitution.md              ✅ Complete
│
├── phase-1-console-app/docs/          ✅ Complete
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
│
├── phase-2-web-app/docs/             ✅ Complete
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
│
├── phase-3-ai-chatbot/docs/          ✅ Spec Complete
│   ├── spec.md
│   ├── plan.md                      ⏳ To be created
│   └── tasks.md                     ⏳ To be created
│
├── phase-4-kubernetes/docs/           ⏳ Pending
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
│
├── phase-5-cloud-deployment/docs/      ⏳ Pending
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
│
├── bonus-features/docs/               ✅ Complete
│   └── README.md                    (All 4 bonus features documented)
│
├── PROJECT_STRUCTURE.md                ✅ Complete (Summary)
└── README.md                         ✅ This file
```

## Phase Dependencies

```
Phase I (Console App) ─────┐
       ↓                       │
Phase II (Web App)           │  All Phases
       ↓                       │  │
Phase III (AI Chatbot)        │  ▶ Reusable Intelligence (+200)
       ↓                       │  │
Phase IV (Kubernetes) ───────┼──▶ Cloud-Native Blueprints (+200)
       ↓                       │
Phase V (Cloud Deployment)       │
                                │  │
        Phase III only ─────────────┘  ▶ Multi-language/Urdu (+100)
                                         │
                                         ▶ Voice Commands (+200)
```

## Points Breakdown

| Phase | Points | Status |
|--------|---------|---------|
| Phase I: Console App | 100 | 📝 Ready for implementation |
| Phase II: Web Application | 150 | 📝 Ready for implementation |
| Phase III: AI Chatbot | 200 | 📝 Ready for implementation |
| Phase IV: Kubernetes | 250 | ⏳ Documentation pending |
| Phase V: Cloud Deployment | 300 | ⏳ Documentation pending |
| **PHASE TOTAL** | **1,000** | |

| Bonus Feature | Points | Relevant Phase |
|--------------|---------|----------------|
| Reusable Intelligence (Subagents, Skills) | +200 | ALL |
| Cloud-Native Blueprints | +200 | Phase IV, V |
| Multi-language Support/Urdu | +100 | Phase III |
| Voice Commands | +200 | Phase III |
| **BONUS TOTAL** | **+600** | |

**MAXIMUM POSSIBLE**: 1,600 points

## Quick Start

### 1. Understanding the Project
Read the [constitution](.specify/memory/constitution.md) to understand:
- Core principles (Spec-Driven Development)
- Technology stack for each phase
- Phase dependencies
- Success criteria
- Bonus feature allocations

### 2. Working with Phases

Each phase follows the SDD workflow:

```
1. Read spec.md         → Understand requirements
2. Read plan.md         → Understand architecture
3. Read tasks.md        → Break down into steps
4. Implement with Claude Code → Use /sp.implement
5. Test               → Verify acceptance criteria
6. Submit             → Demo + GitHub link
```

### 3. Phase-by-Phase Guide

#### Phase I: Console App (100 pts)
- **Location**: `phase-1-console-app/docs/`
- **Tech Stack**: Python 3.13+, UV, Claude Code
- **Features**: 5 Basic Level (Add, Delete, Update, View, Mark Complete)
- **Due Date**: Dec 7, 2025
- **Files**: ✅ spec.md, ✅ plan.md, ✅ tasks.md

**Status**: Documentation complete, ready for implementation

#### Phase II: Web Application (150 pts)
- **Location**: `phase-2-web-app/docs/`
- **Tech Stack**: Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, Better Auth
- **Features**: Multi-user web app with REST API and authentication
- **Due Date**: Dec 14, 2025
- **Files**: ✅ spec.md, ✅ plan.md, ✅ tasks.md

**Status**: Documentation complete, ready for implementation

#### Phase III: AI Chatbot (200 pts)
- **Location**: `phase-3-ai-chatbot/docs/`
- **Tech Stack**: OpenAI ChatKit, OpenAI Agents SDK, Official MCP SDK
- **Features**: Natural language todo management with MCP tools
- **Due Date**: Dec 21, 2025
- **Files**: ✅ spec.md, ⏳ plan.md (to be created), ⏳ tasks.md (to be created)

**Status**: spec.md complete, plan and tasks to follow Phase II pattern

#### Phase IV: Kubernetes Deployment (250 pts)
- **Location**: `phase-4-kubernetes/docs/`
- **Tech Stack**: Docker, Minikube, Helm, kubectl-ai, kagent, Gordon
- **Features**: Local K8s deployment with AIOps tools
- **Due Date**: Jan 4, 2026
- **Files**: ⏳ spec.md, ⏳ plan.md, ⏳ tasks.md

**Status**: Documentation pending

#### Phase V: Advanced Cloud Deployment (300 pts)
- **Location**: `phase-5-cloud-deployment/docs/`
- **Tech Stack**: Kafka, Dapr, AKS/GKE/OKE, GitHub Actions CI/CD
- **Features**: Cloud deployment with event-driven architecture
- **Due Date**: Jan 18, 2026
- **Files**: ⏳ spec.md, ⏳ plan.md, ⏳ tasks.md

**Status**: Documentation pending

## Bonus Features Guide

### Where to Implement Bonuses

| Bonus Feature | When to Implement | Where to Add |
|--------------|-------------------|----------------|
| Reusable Intelligence | Throughout ALL phases | Create Claude Code skills in `.claude/commands/` |
| Cloud-Native Blueprints | Phase IV and V | Create blueprint generation skills |
| Multi-language/Urdu | Phase III | Add Urdu to chatbot |
| Voice Commands | Phase III | Add voice input to chat interface |

### Detailed Bonus Documentation
See [bonus-features/docs/README.md](bonus-features/docs/README.md) for:
- Implementation strategies for each bonus
- File locations and code examples
- Acceptance criteria
- Testing requirements

## Key Concepts

### Spec-Driven Development (SDD)
- **NO CODE WITHOUT SPEC** - Every feature must have spec.md
- **Sequential Workflow**: Specify → Plan → Tasks → Implement
- **No Manual Coding** - Use Claude Code only
- **Reference Tracking** - Every code change references task ID

### Phase Dependencies
Each phase builds on the previous:
- **Phase I** → Data models, validation rules
- **Phase II** → Inherits models, adds database, API, auth
- **Phase III** → Inherits full stack, adds AI, MCP, chat
- **Phase IV** → Inherits complete app, adds containerization, K8s
- **Phase V** → Inherits K8s setup, adds cloud deployment, Kafka, Dapr

### Monorepo Structure
All phases in one repository for:
- Single CLAUDE.md context
- Easier cross-cutting changes
- Simpler submission process
- Shared documentation

## How to Use This Repository

### For Implementation

1. **Start with Phase I**
   ```bash
   cd phase-1-console-app
   cat docs/spec.md
   cat docs/plan.md
   cat docs/tasks.md
   ```

2. **Use Claude Code**
   ```
   /sp.specify "Implement Phase I console app"
   /sp.plan
   /sp.tasks
   /sp.implement
   ```

3. **Progress sequentially**
   - Complete Phase I before starting Phase II
   - Each phase inherits from previous
   - Test thoroughly before moving on

4. **Implement bonuses**
   - Add Reusable Intelligence skills throughout
   - Implement Cloud-Native Blueprints in Phase IV/V
   - Add Urdu/Voice in Phase III

### For Review

1. Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for overview
2. Review [constitution](.specify/memory/constitution.md) for principles
3. Read phase-specific spec/plan/tasks for details
4. Review bonus documentation for extra points

## File Index

### Core Documentation
- ✅ [constitution.md](.specify/memory/constitution.md) - Project principles and rules
- ✅ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Complete structure summary

### Phase Documentation
| Phase | Spec | Plan | Tasks | Status |
|--------|------|-------|--------|--------|
| I | ✅ [spec.md](phase-1-console-app/docs/spec.md) | ✅ [plan.md](phase-1-console-app/docs/plan.md) | ✅ [tasks.md](phase-1-console-app/docs/tasks.md) | Complete |
| II | ✅ [spec.md](phase-2-web-app/docs/spec.md) | ✅ [plan.md](phase-2-web-app/docs/plan.md) | ✅ [tasks.md](phase-2-web-app/docs/tasks.md) | Complete |
| III | ✅ [spec.md](phase-3-ai-chatbot/docs/spec.md) | ⏳ To be created | ⏳ To be created | Spec Done |
| IV | ⏳ To be created | ⏳ To be created | ⏳ To be created | Pending |
| V | ⏳ To be created | ⏳ To be created | ⏳ To be created | Pending |

### Bonus Documentation
- ✅ [bonus-features/docs/README.md](bonus-features/docs/README.md) - All 4 bonus features detailed

## Important Notes

### ⚠️ Constraints
- **Cannot skip phases** - Must complete sequentially
- **No manual coding** - Use Claude Code only
- **Spec-driven** - No code without complete spec
- **Sequential dependencies** - Each phase builds on previous

### 📋 Submission Requirements
For each phase, submit:
1. Public GitHub repository link
2. Published app URL (Vercel, etc.)
3. Demo video (max 90 seconds)
4. WhatsApp number (for presentation invitation)

### 🎯 Success Criteria
- All 5 phases completed
- Working demos for each phase
- Complete documentation
- Deployed applications
- Demo videos under 90 seconds
- Bonus features (optional but recommended)

### 💡 Pro Tips
1. **Start early** - Phase I due Dec 7, 2025
2. **Test thoroughly** - Each phase builds on the previous
3. **Document everything** - Create PHRs for all prompts
4. **Use Claude Code** - It's required and saves time
5. **Consider bonuses** - +600 points possible
6. **Prepare demo videos** - Must be under 90 seconds

## Getting Help

- **Claude Code**: Use `/help` for commands
- **Constitution**: See `.specify/memory/constitution.md`
- **Phase docs**: See each `phase-*/docs/` folder
- **Bonuses**: See `bonus-features/docs/README.md`

## Timeline

| Milestone | Date | Description |
|----------|------|-------------|
| Hackathon Start | Dec 1, 2025 | Documentation released |
| **Phase I Due** | Dec 7, 2025 | Console app checkpoint |
| **Phase II Due** | Dec 14, 2025 | Web app checkpoint |
| **Phase III Due** | Dec 21, 2025 | Chatbot checkpoint |
| **Phase IV Due** | Jan 4, 2026 | Local K8s checkpoint |
| **Final Submission** | Jan 18, 2026 | All phases complete |
| Live Presentations | Sundays (Dec 7, 14, 21, Jan 4, 18) | Top submissions present |

## Quick Commands

### Setup (Phase I)
```bash
cd phase-1-console-app
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
```

### Run (Phase I)
```bash
python src/main.py
```

### Setup (Phase II)
```bash
# Backend
cd phase-2-web-app/backend
uv venv && source .venv/bin/activate
uv sync

# Frontend
cd phase-2-web-app/frontend
npm install
npm run dev
```

### Run (Phase II)
```bash
# Backend
uvicorn app.main:app --reload --port 8000

# Frontend
# Automatically runs on http://localhost:3000
```

## License

This is a hackathon project. See individual phase licenses.

---

**Ready to start Phase I implementation! 🚀**

Remember: Spec → Plan → Tasks → Implement
Use Claude Code for all implementation
Test thoroughly before submission
Good luck! 🎯
