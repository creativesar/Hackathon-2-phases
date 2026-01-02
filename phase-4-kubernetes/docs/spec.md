# Phase IV: Local Kubernetes Deployment - Specification

## Overview
Deploy Phase III Todo Chatbot on local Kubernetes cluster using Minikube, Helm Charts, and AIOps tools (kubectl-ai, kagent, Gordon).

**Points**: 250 | **Due Date**: Jan 4, 2026

## Purpose
Containerize and deploy the chatbot application on Kubernetes with Helm charts and AI-assisted operations.

## Dependencies

**Predecessor Phase**: Phase III - AI Chatbot
- Inherits: Complete application stack (Next.js + FastAPI + Agents SDK + MCP)
- Inherits: Database models (Task, Conversation, Message)
- Inherits: Authentication (Better Auth + JWT)

**Successor Phase**: Phase V - Advanced Cloud Deployment
- Provides: Containerized application, Helm charts, K8s manifests

## User Stories

### US-1: Containerized Deployment
**As a developer, I want to deploy the application using containers, so I can run it consistently across environments.**

### US-2: Kubernetes Orchestration
**As a developer, I want to manage the application with Kubernetes, so I can scale and monitor it easily.**

### US-3: Helm Chart Management
**As a developer, I want to use Helm for deployment, so I can configure and upgrade easily.**

### US-4: AI-Assisted Operations
**As a developer, I want to use AIOps tools, so I can manage K8s with natural language.**

## Functional Requirements

### FR-1: Docker Containerization
- System shall create Docker image for frontend (Next.js)
- System shall create Docker image for backend (FastAPI)
- System shall use multi-stage builds for optimization
- System shall minimize image sizes
- System shall tag images appropriately

### FR-2: Kubernetes Deployment
- System shall deploy to Minikube locally
- System shall create Deployment manifests for frontend
- System shall create Deployment manifests for backend
- System shall create Service manifests
- System shall configure Ingress for external access
- System shall set up ConfigMaps for configuration
- System shall set up Secrets for sensitive data

### FR-3: Helm Charts
- System shall create Helm chart for frontend
- System shall create Helm chart for backend
- System shall support multiple environments (dev, prod)
- System shall use values.yaml for configuration
- System shall include templates for all K8s resources

### FR-4: AIOps Integration
- System shall use Docker AI Agent (Gordon) for Docker operations
- System shall use kubectl-ai for K8s operations
- System shall use kagent for cluster management
- System shall provide example AIOps commands

### FR-5: Database Integration
- System shall connect to Neon PostgreSQL from K8s
- System shall configure connection via environment variables
- System shall handle connection pooling
- System shall ensure database accessibility from pods

### FR-6: Application Functionality
- System shall maintain all Phase III features in K8s deployment
- System shall serve chatbot UI via Ingress
- System shall expose backend API via Service
- System shall support multiple replicas

## Technology Stack

| Component | Technology | Purpose |
|-----------|-------------|----------|
| Containerization | Docker | Build images |
| Docker AI | Gordon (Docker AI Agent) | AI-assisted Docker operations |
| Orchestration | Kubernetes (Minikube) | Local K8s cluster |
| Package Manager | Helm | Chart management |
| AIOps - K8s | kubectl-ai | Natural language K8s commands |
| AIOps - Cluster | kagent | Cluster management and optimization |
| Runtime | Minikube | Local K8s environment |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  Minikube Kubernetes Cluster               │
│                                                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               Namespace: todo-app                      │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │         Frontend Deployment (Next.js)         │  │   │
│  │  │  ┌─────────────────────────────────────────┐  │  │   │
│  │  │  │  - Replicas: 2                         │  │  │   │
│  │  │  │  - Image: todo-frontend:latest      │  │  │   │
│  │  │  │  - Port: 3000                        │  │  │   │
│  │  │  │  - Env: NEXT_PUBLIC_API_URL          │  │  │   │
│  │  │  └─────────────────────────────────────────┘  │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │           ▲                                          │   │
│  │           │ Service (ClusterIP)                       │   │
│  │           │                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         Backend Deployment (FastAPI)          │  │   │
│  │  │  ┌─────────────────────────────────────────┐  │  │   │
│  │  │  │  - Replicas: 2                         │  │  │   │
│  │  │  │  - Image: todo-backend:latest        │  │  │   │
│  │  │  │  - Port: 8000                        │  │  │   │
│  │  │  │  - Env: DATABASE_URL, JWT_SECRET     │  │  │   │
│  │  │  │  - Secrets: NEON_CONNECTION_STRING     │  │  │   │
│  │  │  └─────────────────────────────────────────┘  │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         Ingress Controller                   │   │   │
│  │  │  ┌─────────────────────────────────────────┐  │  │   │
│  │  │  │  - Host: todo.local                │  │  │   │
│  │  │  │  - TLS: Self-signed cert            │  │  │   │
│  │  │  │  - Routes: /, /api              │  │  │   │
│  │  │  └─────────────────────────────────────────┘  │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         ConfigMaps                            │   │   │
│  │  │  - frontend-config                         │   │   │
│  │  │  - backend-config                          │   │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         Secrets                                │   │   │
│  │  │  - database-url                           │   │  │   │
│  │  │  - jwt-secret                             │   │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                           │
└───────────────────────────────────────────────────────────────────┘
                    │
                    │ (Access via Ingress)
                    ▼
         ┌────────────────────────┐
         │   Browser/Client     │
         │   todo.local        │
         └────────────────────────┘
```

## Container Requirements

### Frontend Dockerfile (Multi-stage)
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### Backend Dockerfile
```dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Helm Chart Structure

```
helm/todo-app/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-prod.yaml
└── templates/
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── ingress.yaml
    ├── configmap.yaml
    └── secret.yaml
```

## AIOps Commands

### Docker AI (Gordon)
```bash
# Build images
docker ai "Build optimized Docker images for frontend and backend"

# Analyze images
docker ai "Analyze frontend Docker image for security vulnerabilities"

# Optimize
docker ai "Optimize Docker layer caching for faster builds"
```

### kubectl-ai
```bash
# Deploy application
kubectl-ai "Deploy the todo frontend with 2 replicas"

# Scale backend
kubectl-ai "Scale the backend to handle more load"

# Check pod status
kubectl-ai "Check why the pods are failing"

# View logs
kubectl-ai "Show me the backend logs from the last 5 minutes"

# Get cluster info
kubectl-ai "Analyze the cluster health and resource usage"
```

### kagent
```bash
# Health check
kagent "analyze the cluster health"

# Optimize resources
kagent "optimize resource allocation for the todo app"

# Troubleshoot
kagent "investigate why the backend pods are crashing"
```

## Non-Functional Requirements

### NFR-1: Performance
- Image build time: < 5 minutes
- Deployment time: < 2 minutes
- Pod startup time: < 30 seconds
- Resource limits: CPU 500m, RAM 512Mi per pod

### NFR-2: Reliability
- Liveness probes configured
- Readiness probes configured
- Rolling updates enabled
- No single point of failure

### NFR-3: Maintainability
- Clear Helm values
- Documented AIOps commands
- Versioned Helm charts
- Log aggregation setup

### NFR-4: Scalability
- Horizontal pod autoscaling (HPA) ready
- Multiple replicas supported
- Load balancing via Service

## Acceptance Criteria

### AC-1: Docker Images
- [ ] Frontend Dockerfile created (multi-stage)
- [ ] Backend Dockerfile created
- [ ] Images build successfully
- [ ] Images are optimized (< 500MB each)
- [ ] Images tagged correctly

### AC-2: Kubernetes Deployment
- [ ] Minikube cluster running
- [ ] Frontend deployment created
- [ ] Backend deployment created
- [ ] Services created (ClusterIP)
- [ ] ConfigMaps for environment variables
- [ ] Secrets for sensitive data
- [ ] All pods running

### AC-3: Helm Charts
- [ ] Chart.yaml complete
- [ ] Values files created (dev, prod)
- [ ] Templates for all resources
- [ ] Helm install successful
- [ ] Helm upgrade works

### AC-4: Ingress
- [ ] Ingress controller installed
- [ ] Ingress resource created
- [ ] Application accessible via todo.local
- [ ] TLS configured (even if self-signed)

### AC-5: AIOps Integration
- [ ] Docker AI (Gordon) commands documented
- [ ] kubectl-ai commands tested
- [ ] kagent commands tested
- [ ] Natural language K8s operations working

### AC-6: Database Integration
- [ ] Backend connects to Neon DB
- [ ] Connection string in Secrets
- [ ] All features work in K8s deployment
- [ ] Chatbot functions correctly

### AC-7: Health Checks
- [ ] Liveness probes configured
- [ ] Readiness probes configured
- [ ] Health endpoints accessible
- [ ] Failed pods auto-restart

### AC-8: Documentation
- [ ] Dockerfiles documented
- [ ] Helm chart documented
- [ ] AIOps commands documented
- [ ] Setup instructions clear

### AC-9: Testing
- [ ] Application tested in Minikube
- [ ] All features working
- [ ] Scaling tested (increase replicas)
- [ ] Rolling update tested

### AC-10: Demo
- [ ] Demo video under 90 seconds
- [ ] Shows K8s deployment process
- [ ] Shows AIOps usage
- [ ] Shows running application

## Out of Scope

- Production cloud deployment (Phase V)
- Kafka event streaming (Phase V)
- Dapr integration (Phase V)
- CI/CD pipelines (Phase V)
- Production-grade TLS certificates
- Advanced monitoring (Prometheus, Grafana)

## Related Bonus Features

### Bonus 1: Reusable Intelligence (+200)
Create Claude Code Agent Skills for:
- Docker image generation from spec
- Helm chart generation
- K8s manifest generation
- AIOps command generation

**Relevance**: High - directly related to deployment automation

### Bonus 2: Cloud-Native Blueprints (+200)
Create spec-driven deployment blueprints via Agent Skills
- Kubernetes deployment blueprint
- Helm chart blueprint
- Multi-environment deployment blueprint
- Rollback strategy blueprint

**Relevance**: High - core to this phase


## Integration with Phase III (Detailed)

**Phase III Reference**: 
- `phase-3-ai-chatbot/backend/app/main.py` - Complete FastAPI + Agents SDK + MCP
- `phase-3-ai-chatbot/frontend/app/page.tsx` - ChatKit chat interface
- `phase-3-ai-chatbot/backend/app/models.py` - Database models

### Inherited from Phase III (Complete Stack)

**Backend Stack (from `phase-3-ai-chatbot/backend/`):**
```python
# phase-3-ai-chatbot/backend/app/main.py
# Complete FastAPI application with:
#   - JWT authentication (inherited from Phase II)
#   - Task CRUD endpoints (inherited from Phase II)
#   - Chat endpoint (NEW in Phase III)
#   - MCP Server integration (NEW in Phase III)
#   - OpenAI Agents SDK (NEW in Phase III)
#   - SQLModel database (Task, Conversation, Message models)
```

**Frontend Stack (from `phase-3-ai-chatbot/frontend/`):**
```typescript
// phase-3-ai-chatbot/frontend/app/page.tsx
// Complete Next.js application with:
//   - Better Auth authentication (inherited from Phase II)
//   - ChatKit chat interface (NEW in Phase III)
//   - Task management UI (inherited from Phase II)
```

**Database Models (from `phase-3-ai-chatbot/backend/app/models.py`):**
```python
# Phase I → II → III Evolution

# Task model (Phase I → II → III)
class Task(SQLModel, table=True):
    # Phase I: Inherited from dataclass
    # Phase II: Added user_id for multi-user
    # Phase III: Used by MCP tools for AI operations
    id: int | None = Field(default=None, primary_key=True)
    user_id: str          # Phase II addition
    title: str            # Phase I inheritance
    description: str | None = None
    completed: bool = Field(default=False)
    created_at: datetime
    updated_at: datetime

# Conversation model (NEW in Phase III)
class Conversation(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str          # Links to Phase II user model
    created_at: datetime
    updated_at: datetime

# Message model (NEW in Phase III)
class Message(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str
    conversation_id: int
    role: str  # "user" or "assistant"
    content: str
    tool_calls: JSON | None = None
    created_at: datetime
```

**Application Evolution Table:**
| Component | Phase I | Phase II | Phase III | Phase IV (This) |
|-----------|----------|----------|------------|------------------|
| **Storage** | In-memory | PostgreSQL | PostgreSQL | PostgreSQL (K8s) |
| **Model** | dataclass | SQLModel | SQLModel | SQLModel (unchanged) |
| **Frontend** | CLI | Next.js Web | Next.js + ChatKit | Next.js Container |
| **Backend** | Python script | FastAPI | FastAPI + Agents + MCP | FastAPI Container |
| **Auth** | None | Better Auth | Better Auth | Better Auth (K8s secrets) |
| **AI** | None | None | OpenAI Agents | OpenAI Agents (Container) |
| **MCP** | None | None | MCP Server | MCP Server (Container) |

### New in Phase IV (Containerization & Orchestration)

**Container Images (from Phase III source):**
```dockerfile
# phase-4-kubernetes/Dockerfile.frontend
# Built from: phase-3-ai-chatbot/frontend/
FROM node:20-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

# phase-4-kubernetes/Dockerfile.backend  
# Built from: phase-3-ai-chatbot/backend/
FROM python:3.13-slim
WORKDIR /app
COPY backend/pyproject.toml ./
RUN pip install uv && uv sync
COPY backend/ ./
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0.0", "--port", "8000"]
```

**Kubernetes Resources:**
```yaml
# phase-4-kubernetes/deployments/frontend.yaml
# Deploying: phase-3-ai-chatbot/frontend/
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: todo-frontend
  template:
    metadata:
      labels:
        app: todo-frontend
    spec:
      containers:
      - name: frontend
        image: todo-frontend:latest  # Built from Phase III source
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          valueFrom:
            configMapKeyRef:
              name: backend-config
              key: api-url

# phase-4-kubernetes/deployments/backend.yaml
# Deploying: phase-3-ai-chatbot/backend/
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: todo-backend
  template:
    metadata:
      labels:
        app: todo-backend
    spec:
      containers:
      - name: backend
        image: todo-backend:latest  # Built from Phase III source
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: BETTER_AUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: auth-secret
              key: jwt-secret
```

**Helm Chart Structure:**
```yaml
# phase-4-kubernetes/helm/todo-app/Chart.yaml
# Packages: Complete Phase III application
apiVersion: v2
name: todo-app
description: Phase III Todo Chatbot - Kubernetes deployment
type: application

# Templates:
#   - deployment-frontend.yaml (from Phase III source)
#   - deployment-backend.yaml (from Phase III source)
#   - service-frontend.yaml
#   - service-backend.yaml
#   - ingress.yaml
#   - configmap.yaml
#   - secrets.yaml
```

### Evolution Summary: Phase III → IV
| Aspect | Phase III (Local) | Phase IV (Minikube K8s) |
|---------|------------------|-------------------------------|
| **App Source** | `phase-3-ai-chatbot/` | Same source, containerized |
| **Frontend** | `npm run dev` (localhost:3000) | Docker Pod (ClusterIP) |
| **Backend** | `uvicorn` (localhost:8000) | Docker Pod (ClusterIP) |
| **Database** | Neon (direct connection) | Neon (via K8s Service) |
| **Environment** | Local `.env` files | K8s ConfigMaps + Secrets |
| **Access** | `http://localhost:3000` | `http://todo.local` (Ingress) |
| **Scaling** | Single instance | Replicas: 2 (auto-scaling) |
| **Auth Secret** | `.env` local file | K8s Secret (encrypted) |

### Key Continuities
- ✅ **Same Code**: Phase III source unchanged
- ✅ **Same Models**: Task, Conversation, Message unchanged
- ✅ **Same Auth**: Better Auth + JWT unchanged
- ✅ **Same Database**: Neon PostgreSQL unchanged
- ✅ **Same Features**: Chatbot + MCP unchanged

### Phase IV Additions (Infrastructure Only)
- ➕ Docker multi-stage builds
- ➕ Kubernetes Deployment manifests
- ➕ Helm Chart packaging
- ➕ Minikube local cluster
- ➕ AIOps tools integration
- ➕ Service & Ingress configuration

