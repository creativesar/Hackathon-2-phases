# Phase IV: Local Kubernetes Deployment - Plan

## Architecture Overview
Containerize Phase III application and deploy to Minikube using Kubernetes manifests and Helm charts. Integrate AIOps tools for intelligent operations.

```
┌─────────────────────────────────────────────────────────────────┐
│                   Minikube Kubernetes Cluster               │
│                                                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               Namespace: todo-app                      │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │         Frontend Pods (Next.js)           │  │   │
│  │  │  ┌─────────────────────────────────────────┐  │  │   │
│  │  │  │  Pod 1 ───┐                     │  │   │   │
│  │  │  │             │ Service: todo-frontend │  │   │   │
│  │  │  │  Pod 2 ───┘                     │  │   │   │
│  │  │  └─────────────────────────────────────────┘  │   │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │           ▲                                          │   │
│  │           │                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         Backend Pods (FastAPI)           │  │   │
│  │  │  ┌─────────────────────────────────────────┐  │  │   │
│  │  │  │  Pod 1 ───┐                     │  │   │   │
│  │  │  │             │ Service: todo-backend  │  │   │   │
│  │  │  │  Pod 2 ───┘                     │  │   │   │
│  │  │  └─────────────────────────────────────────┘  │   │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         Ingress (Nginx)                  │  │   │
│  │  │  Routes: / → frontend                 │  │   │
│  │  │          /api/* → backend                │  │   │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         ConfigMaps                         │  │   │
│  │  │  - frontend-config: API_URL, env vars     │  │   │
│  │  │  - backend-config: Database settings      │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         Secrets                            │  │   │
│  │  │  - neon-connection-string              │  │   │
│  │  │  - jwt-secret                         │  │   │
│  │  │  - openai-api-key                    │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                           │
└───────────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Component | Technology | Purpose |
|-----------|-------------|----------|
| Containerization | Docker | Build images |
| Docker AI | Gordon (Docker AI Agent) | AI-assisted Docker operations |
| Orchestration | Kubernetes (Minikube) | Local cluster |
| Package Manager | Helm | Chart management |
| AIOps - K8s | kubectl-ai | Natural language K8s commands |
| AIOps - Cluster | kagent | Cluster management |
| Runtime | Minikube | Local K8s environment |

## Component Design

### 1. Frontend Docker Image

**Purpose**: Package Next.js chatbot application

**Location**: `frontend/Dockerfile`

**Multi-stage Build**:
```
Stage 1: Dependencies
  - FROM node:18-alpine
  - COPY package*.json
  - RUN npm ci
  - Cache node_modules

Stage 2: Build
  - COPY . .
  - RUN npm run build
  - Output: .next directory

Stage 3: Production
  - FROM node:18-alpine
  - COPY .next directory
  - COPY public directory
  - EXPOSE 3000
  - CMD: node server.js
```

**Optimizations**:
- Multi-stage reduces image size
- Alpine Linux base minimizes size
- Layer caching for faster rebuilds

### 2. Backend Docker Image

**Purpose**: Package FastAPI + Agents SDK + MCP

**Location**: `backend/Dockerfile`

**Build**:
```
Stage 1: Dependencies
  - FROM python:3.13-slim
  - COPY requirements.txt
  - RUN pip install --no-cache-dir -r requirements.txt

Stage 2: Application
  - COPY . .
  - EXPOSE 8000
  - CMD: uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Optimizations**:
- No-cache-dir for pip
- Slim Python base image
- Exposed port clearly documented

### 3. Kubernetes Deployment (Frontend)

**Purpose**: Deploy frontend pods with replica management

**Location**: `helm/todo-app/templates/frontend-deployment.yaml`

**Configuration**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-frontend
  namespace: todo-app
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
        image: todo-frontend:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: frontend-config
        resources:
          requests:
            cpu: 250m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 4. Kubernetes Deployment (Backend)

**Purpose**: Deploy backend pods with secrets and config

**Location**: `helm/todo-app/templates/backend-deployment.yaml`

**Configuration**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-backend
  namespace: todo-app
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
        image: todo-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: neon-secrets
              key: connection-string
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secrets
              key: secret
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-secrets
              key: api-key
        resources:
          requests:
            cpu: 250m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 5. Kubernetes Services

**Purpose**: Expose pods within cluster

**Frontend Service**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: todo-frontend
  namespace: todo-app
spec:
  selector:
    app: todo-frontend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

**Backend Service**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: todo-backend
  namespace: todo-app
spec:
  selector:
    app: todo-backend
  ports:
  - port: 80
    targetPort: 8000
  type: ClusterIP
```

### 6. Ingress Controller

**Purpose**: Expose application externally with routing

**Location**: `helm/todo-app/templates/ingress.yaml`

**Configuration**:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: todo-ingress
  namespace: todo-app
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: todo.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: todo-frontend
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: todo-backend
            port:
              number: 80
```

### 7. Helm Chart Structure

**Purpose**: Package K8s resources for easy deployment

**Location**: `helm/todo-app/`

**Structure**:
```
helm/todo-app/
├── Chart.yaml           # Chart metadata
├── values.yaml          # Default configuration
├── values-dev.yaml      # Development config
├── values-prod.yaml     # Production config
└── templates/
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── ingress.yaml
    ├── configmap.yaml
    └── secret.yaml
```

**Chart.yaml**:
```yaml
apiVersion: v2
name: todo-app
description: Todo Chatbot application
type: application
version: 1.0.0
appVersion: "1.0"
keywords:
- todo
- chatbot
- kubernetes
maintainers:
- name: Hackathon Team
```

**values.yaml**:
```yaml
frontend:
  replicaCount: 2
  image:
    repository: todo-frontend
    tag: latest
  resources:
    requests:
      cpu: 250m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi

backend:
  replicaCount: 2
  image:
    repository: todo-backend
    tag: latest
  resources:
    requests:
      cpu: 250m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi

ingress:
  enabled: true
  host: todo.local
  className: nginx
```

### 8. AIOps Integration

#### kubectl-ai Usage

**Purpose**: Natural language K8s operations

**Example Commands**:
```bash
# Deploy application
kubectl-ai "Deploy todo-frontend with 2 replicas"

# Scale pods
kubectl-ai "Scale backend to 4 replicas"

# Check status
kubectl-ai "Show me all pods in todo-app namespace"

# View logs
kubectl-ai "Show logs from backend pods for last 10 minutes"

# Troubleshoot
kubectl-ai "Why are my pods crashing?"
kubectl-ai "Investigate high memory usage"
```

#### kagent Usage

**Purpose**: Cluster health and optimization

**Example Commands**:
```bash
# Health check
kagent "analyze cluster health"

# Resource optimization
kagent "optimize resource allocation for todo-app namespace"

# Cost analysis
kagent "calculate estimated cost for this cluster setup"

# Security scan
kagent "check for security vulnerabilities in deployments"
```

#### Gordon (Docker AI) Usage

**Purpose**: AI-assisted Docker operations

**Example Commands**:
```bash
# Build optimization
docker ai "Optimize Dockerfile for smaller image size"

# Security analysis
docker ai "Scan frontend image for security vulnerabilities"

# Layer optimization
docker ai "Improve Docker layer caching for faster builds"
```

## Project Structure

```
phase-4-kubernetes/
├── frontend/                    # Next.js application
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
├── backend/                     # FastAPI application
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
├── helm/
│   └── todo-app/
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-dev.yaml
│       ├── values-prod.yaml
│       └── templates/
│           ├── frontend-deployment.yaml
│           ├── frontend-service.yaml
│           ├── backend-deployment.yaml
│           ├── backend-service.yaml
│           ├── ingress.yaml
│           ├── configmap.yaml
│           └── secret.yaml
├── scripts/
│   ├── build-images.sh
│   ├── load-images.sh
│   └── deploy.sh
├── docs/
│   ├── spec.md
│   ├── plan.md          # This file
│   └── tasks.md
└── README.md
```

## Deployment Workflow

### 1. Build Docker Images
```bash
# Frontend
docker build -t todo-frontend:latest ./frontend

# Backend
docker build -t todo-backend:latest ./backend

# Verify images
docker images | grep todo
```

### 2. Load Images into Minikube
```bash
minikube image load todo-frontend:latest
minikube image load todo-backend:latest

# Verify loaded
minikube image ls
```

### 3. Deploy with Helm
```bash
# Create namespace
kubectl create namespace todo-app

# Install chart
helm install todo-app ./helm/todo-app --values values-dev.yaml

# Verify deployment
kubectl get pods -n todo-app
kubectl get svc -n todo-app
kubectl get ingress -n todo-app
```

### 4. Access Application
```bash
# Get Minikube IP
minikube ip

# Update /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
echo "192.168.49.2 todo.local" | sudo tee -a /etc/hosts

# Access
open http://todo.local
```

### 5. Use AIOps for Management
```bash
# Check deployment
kubectl-ai "Show status of todo-app deployment"

# Scale if needed
kubectl-ai "Scale frontend to 3 replicas"

# Monitor health
kagent "analyze cluster health"
```

## Data Flow

```
User Browser
    ↓ HTTP Request
Ingress (todo.local)
    ↓ Routes
/ → Frontend Service
    → Frontend Pod (Next.js)
/api → Backend Service
    → Backend Pod (FastAPI)
    ↓ MCP Tools
    ↓ Database
Neon PostgreSQL (External)
```

## Non-Functional Requirements

### Performance
- Pod startup: < 30 seconds
- Image build: < 5 minutes each
- Deployment: < 2 minutes
- Health check response: < 500ms

### Reliability
- Liveness probes configured
- Readiness probes configured
- Rolling updates enabled (no downtime)
- Failed pods auto-restart

### Maintainability
- Clear Helm values
- Documented AIOps commands
- Versioned charts
- Structured logging

### Scalability
- Easy to increase replicas
- Load balancing via Service
- Horizontal Pod Autoscaler ready (not configured but structure ready)

## Security Considerations

### Image Security
- Use minimal base images (Alpine, slim)
- Scan images for vulnerabilities
- No secrets in images (use K8s Secrets)
- Regular updates for base images

### Kubernetes Security
- Secrets for sensitive data
- Resource limits to prevent DoS
- Network policies (optional, for Phase V)
- Pod security contexts

### Network Security
- TLS termination at Ingress
- Internal service communication via ClusterIP
- No direct pod exposure
- Namespace isolation

## Testing Strategy

### Image Testing
```bash
# Test images locally
docker run --rm -p 3000:3000 todo-frontend:latest
docker run --rm -p 8000:8000 todo-backend:latest
```

### K8s Resource Testing
```bash
# Test deployment
kubectl apply -f manifests/

# Verify pods running
kubectl get pods -w

# Check logs
kubectl logs -l app=todo-frontend -n todo-app
kubectl logs -l app=todo-backend -n todo-app
```

### AIOps Testing
```bash
# Test kubectl-ai
kubectl-ai "List all deployments"

# Test kagent
kagent "Check namespace health"
```

## Migration from Phase III

### What Changes
- **Deployment**: Direct run → K8s pods
- **Infrastructure**: None → Kubernetes cluster
- **Configuration**: Env vars → ConfigMaps + Secrets
- **Operations**: Manual → AIOps-assisted
- **Packaging**: None → Helm charts

### What Stays Same
- **Application Code**: No changes to Next.js or FastAPI
- **Database**: Neon PostgreSQL connection unchanged
- **Authentication**: Better Auth + JWT unchanged
- **MCP Tools**: Same implementation

## Preparation for Phase V

### Deliverables for Phase V
- Containerized application (ready for cloud)
- Working K8s manifests (adaptable for cloud)
- Helm charts (adaptable for cloud)
- AIOps workflows (extendable for CI/CD)

### Key Changes for Phase V
- **Cluster**: Minikube → AKS/GKE/OKE
- **Add**: Kafka deployment
- **Add**: Dapr sidecars
- **Add**: CI/CD pipelines
- **Add**: Monitoring (Prometheus, Grafana)

## Decision Records

### DR-001: Multi-stage Docker Builds
**Decision**: Use multi-stage builds
**Rationale**:
- Smaller final image size
- Better caching
- Security (no build tools in final image)
- Industry best practice

**Trade-offs**:
- More complex Dockerfile
- Longer initial understanding

### DR-002: Helm vs Raw Manifests
**Decision**: Use Helm charts
**Rationale**:
- Better configuration management
- Versioning and rollback easier
- Reusable across environments
- Standard for production

**Trade-offs**:
- Additional Helm learning curve
- Chart maintenance overhead

### DR-003: Ingress vs NodePort
**Decision**: Use Ingress controller
**Rationale**:
- Single entry point
- Better URL routing
- TLS support
- More production-like

**Trade-offs**:
- Requires Ingress controller installation
- More complex setup

### DR-004: AIOps Tools Choice
**Decision**: kubectl-ai + kagent + Gordon
**Rationale**:
- Natural language operations
- Modern AI-native approach
- Diverse capabilities (K8s, cluster, Docker)
- Demonstrates AIOps skills

**Trade-offs**:
- Multiple tools to learn
- Requires API keys/configuration

## Risk Analysis

### Risk 1: Image Size Too Large
**Likelihood**: Medium
**Impact**: Medium (slow deployment)
**Mitigation**:
- Use Alpine/slim base images
- Multi-stage builds
- Minimize layers

### Risk 2: Pods Not Starting
**Likelihood**: High (common issue)
**Impact**: High (application unavailable)
**Mitigation**:
- Configure health probes
- Set resource limits appropriately
- Use AIOps for troubleshooting
- Document common issues

### Risk 3: Ingress Not Working
**Likelihood**: Medium
**Impact**: High (can't access app)
**Mitigation**:
- Verify Ingress controller running
- Check /etc/hosts configuration
- Use kubectl-ai for debugging
- Document setup steps

## Success Criteria

- [ ] Frontend Docker image built (< 500MB)
- [ ] Backend Docker image built (< 300MB)
- [ ] Minikube cluster running
- [ ] All pods healthy and running
- [ ] Services created and accessible
- [ ] Ingress configured
- [ ] Application accessible via todo.local
- [ ] Helm chart functional
- [ ] AIOps tools working
- [ ] Demo video under 90 seconds
- [ ] Documentation complete

## Next Steps

1. Create Dockerfiles for frontend and backend
2. Build and test images locally
3. Create Helm chart structure
4. Create K8s manifests
5. Deploy to Minikube
6. Test all features
7. Document AIOps commands
8. Create demo video
9. Prepare for Phase V

## References

- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [kubectl-ai GitHub](https://github.com/GoogleCloudPlatform/kubectl-ai)
- [kagent GitHub](https://github.com/kagent-dev/kagent)
- [Docker AI (Gordon)](https://docs.docker.com/ai/gordon/)

## Clarifications & Decisions

### CLR-001: Helm Values Strategy
**Decision**: Base values.yaml with environment-specific overrides (values-dev.yaml, values-prod.yaml)
**Rationale**: Shared defaults, easy environment switching, DRY principle
**Implementation**:
```yaml
# values.yaml (base)
frontend:
  replicaCount: 2
  image:
    repository: todo-frontend
    tag: latest

# values-dev.yaml (dev overrides)
frontend:
  image:
    tag: latest  # Use latest in dev

# values-prod.yaml (prod overrides)
frontend:
  image:
    tag: ${GIT_SHA}  # Use commit SHA in prod
```

### CLR-002: Resource Limits vs Requests
**Decision**: Requests: 250m CPU, 256Mi RAM | Limits: 500m CPU, 512Mi RAM
**Rationale**: Sufficient headroom for traffic, prevent resource starvation, balanced for local dev
**Implementation**:
```yaml
resources:
  requests:
    cpu: 250m    # Guarantees 1/4 CPU
    memory: 256Mi  # Guarantees 256MB RAM
  limits:
    cpu: 500m     # Maximum 1/2 CPU
    memory: 512Mi  # Maximum 512MB RAM
```

### CLR-003: AIOps Commands Documentation
**Decision**: Create AIOps-cheatsheet.md with actual tested commands
**Rationale**: Demonstrates AIOps usage, reproducible for evaluation, learning resource
**Implementation**:
- Document in `docs/AIOps-cheatsheet.md`
- Include exact commands used during development
- Add output/success notes for each command
- Organize by task (deploy, scale, debug, monitor)

### CLR-004: Rolling Update Strategy
**Decision**: maxUnavailable: 25%, maxSurge: 25%
**Rationale**: Zero-downtime, gradual rollout, easy rollback
**Implementation**:
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%  # Allow 1 pod down during update
      maxSurge: 25%        # Add 1 extra pod during update
  replicas: 2
```

### CLR-005: .dockerignore Configuration
**Decision**: Exclude node_modules, .git, local files to reduce build context
**Rationale**: Faster builds, smaller images, avoid unnecessary files
**Implementation**:
```
node_modules
.git
.next
.gitignore
.env.local
npm-debug.log*
.DS_Store
```

