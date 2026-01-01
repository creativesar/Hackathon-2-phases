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

## Integration with Phase III

### Inherited from Phase III
- **Complete Application**: Next.js + FastAPI + Agents SDK + MCP
- **Database Models**: Task, Conversation, Message
- **Authentication**: Better Auth + JWT
- **API Endpoints**: Chat endpoint + task CRUD

### New in Phase IV
- **Containerization**: Docker images
- **Orchestration**: Kubernetes deployment
- **Packaging**: Helm charts
- **Operations**: AIOps tools
- **Infrastructure**: Minikube cluster

## Preparation for Phase V

### Deliverables for Phase V
- Containerized application
- Working Kubernetes manifests
- Helm charts
- AIOps workflows
- Minikube deployment tested

### Key Changes for Phase V
- Local K8s (Minikube) → Cloud K8s (AKS/GKE/OKE)
- Helm only → Helm + Kafka + Dapr
- Local operations → CI/CD pipelines
- Basic deployment → Advanced cloud-native deployment

## Constraints

- Must use Spec-Driven Development
- No manual coding allowed
- Must use Docker (multi-stage builds)
- Must deploy to Minikube locally
- Must use Helm for packaging
- Must use AIOps tools (kubectl-ai, kagent, Gordon)

## Success Metrics

- All containers built and optimized
- Application runs on Minikube
- Helm charts functional
- AIOps tools integrated
- Demo video under 90 seconds
- Complete specification files

## Local Development Setup

### Prerequisites
- Docker Desktop installed
- Minikube installed
- kubectl installed
- Helm installed
- Gordon enabled (Docker AI)
- kubectl-ai installed
- kagent installed

### Installation Commands
```bash
# Minikube
minikube start --cpus=4 --memory=4096

# Enable ingress
minikube addons enable ingress

# Docker AI (Gordon)
# Enable in Docker Desktop Settings → Beta features

# kubectl-ai
npm install -g kubectl-ai

# kagent
npm install -g @kagent-dev/kagent
```

## Deployment Workflow

### 1. Build Images
```bash
# Frontend
docker build -t todo-frontend:latest ./frontend

# Backend
docker build -t todo-backend:latest ./backend
```

### 2. Load into Minikube
```bash
minikube image load todo-frontend:latest
minikube image load todo-backend:latest
```

### 3. Deploy with Helm
```bash
helm install todo-app ./helm/todo-app --values values-dev.yaml
```

### 4. Access Application
```bash
# Get Minikube IP
minikube ip

# Update /etc/hosts
echo "192.168.49.2 todo.local" | sudo tee -a /etc/hosts

# Access
open http://todo.local
```

## Troubleshooting

### Pods Not Starting
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl-ai "Check why the pods are failing"
```

### Service Not Accessible
```bash
kubectl get svc
minikube service <service-name>
kubectl-ai "Debug the service connectivity"
```

### Image Pull Issues
```bash
kubectl get events
docker images | grep todo
minikube image ls
```

## Clarifications & Decisions

### CLR-001: Minikube Resource Allocation
**Decision**: 4 CPUs, 4096MB memory for Minikube
**Rationale**: Sufficient for 4 pods (2 frontend + 2 backend), reasonable for local development
**Implementation**:
```bash
minikube start --cpus=4 --memory=4096 --driver=docker
```

### CLR-002: Image Tagging Strategy
**Decision**: Use `latest` for local development, commit SHA for production
**Rationale**: Simpler for local workflow, version control for production
**Implementation**:
- Development: `docker build -t todo-frontend:latest ./frontend`
- Production: `docker build -t todo-frontend:${GIT_SHA} ./frontend`
- Minikube load: `minikube image load todo-frontend:latest`

### CLR-003: Health Probe Configuration
**Decision**: Liveness: check root path every 10s, Readiness: check health endpoint every 5s
**Rationale**: Fast failure detection, graceful restarts, minimal overhead
**Implementation**:
```yaml
livenessProbe:
  httpGet:
    path: /
    port: 3000  # frontend
  initialDelaySeconds: 10
  periodSeconds: 10
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health
    port: 8000  # backend
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 3
```

### CLR-004: Ingress TLS Strategy
**Decision**: Self-signed certificate for local Minikube, documented for production
**Rationale**: Works locally without Let's Encrypt, clear migration path to cloud
**Implementation**:
```bash
# Create self-signed cert
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tls.key -out tls.crt

# Create secret
kubectl create secret tls todo-tls --cert=tls.crt --key=tls.key

# Reference in ingress
spec:
  tls:
  - hosts:
    - todo.local
    secretName: todo-tls
```

### CLR-005: ConfigMap vs Environment Variables
**Decision**: Use ConfigMaps for non-sensitive, Secrets for sensitive data
**Rationale**: Security best practice, clear separation, Git-friendly configs
**Implementation**:
- ConfigMaps: API URLs, feature flags, non-sensitive config
- Secrets: Database connection strings, API keys, JWT secrets
- Secrets never committed to Git
- ConfigMaps in version control

## Notes

- Focus on local Minikube deployment (not cloud yet)
- Use AIOps tools extensively to demonstrate AI-assisted DevOps
- Document all AIOps commands used
- Test scaling and rolling updates
- Prepare for Phase V (cloud deployment)
