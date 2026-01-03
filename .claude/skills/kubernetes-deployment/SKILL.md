---
name: kubernetes-deployment
description: Kubernetes deployment patterns for Hackathon II Todo App. Use when deploying on Minikube (Phase IV) or cloud (Phase V). Includes: (1) Docker containers, (2) Helm charts, (3) kubectl-ai commands, (4) Kagent operations, (5) Minikube setup, (6) Service exposure
---

# Kubernetes Deployment

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MINIKUBE CLUSTER                       │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌───────┐  │
│  │  Frontend     │  │  Backend       │  │  Neon  │  │
│  │  Pod (Next.js) │  │  Pod (FastAPI) │  │  DB     │  │
│  └───────────────┘  └───────────────┘  └───────┘  │
│         │                    │                      │         │
│         └────────┬───────────┘                      │         │
│                  ▼                               │         │
│         ┌────────────────┐                        │         │
│         │ Ingress       │◀─────────────────────┘         │
│         │ /tasks, /api │                                  │
│         └────────────────┘                                  │
└─────────────────────────────────────────────────────────────┘
```

## Phase IV: Local Deployment (Minikube)

### 1. Install Minikube

```bash
# Windows (Chocolatey)
choco install minikube

# Windows (WSL2)
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start Minikube
minikube start --driver=docker --cpus=4 --memory=8192

# Enable ingress
minikube addons enable ingress

# Verify
minikube status
```

### 2. Install kubectl

```bash
# Download latest kubectl
curl -LO https://dl.k8s.io/release/stable/bin/windows/amd64/kubectl.exe

# Add to PATH
# Move kubectl.exe to a directory in PATH

# Verify
kubectl version --client
```

### 3. Install kubectl-ai

```bash
# Install kubectl-ai plugin
kubectl krew install kubectl-ai

# Verify
kubectl-ai --version
```

### 4. Install Kagent

```bash
# Clone repo
git clone https://github.com/kagent-dev/kagent.git
cd kagent

# Install
go install ./...

# Verify
kagent version
```

## Docker Containers

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.13-slim

WORKDIR /app

# Install uv
COPY pyproject.toml ./
RUN pip install uv

# Install dependencies
RUN uv pip install -e .

COPY app/ ./app

# Expose port
EXPOSE 8000

# Run with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build Images

```bash
# Build frontend
cd frontend
docker build -t todo-frontend:latest .

# Build backend
cd ../backend
docker build -t todo-backend:latest .

# Load into Minikube
minikube image load todo-frontend:latest
minikube image load todo-backend:latest
```

## Helm Charts

### Frontend Helm Chart

```yaml
# charts/frontend/Chart.yaml
apiVersion: v2
name: todo-frontend
description: Todo Frontend Deployment
type: application
version: 1.0.0

---
# charts/frontend/values.yaml
replicaCount: 2

image:
  repository: todo-frontend
  tag: latest
  pullPolicy: Never  # Use local images in Minikube

service:
  type: LoadBalancer
  port: 80
  targetPort: 3000

ingress:
  enabled: true
  host: todo.local
  path: /
  className: nginx

---
# charts/frontend/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Chart.Name }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Chart.Name }}
  template:
    metadata:
      labels:
        app: {{ .Chart.Name }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "http://todo-backend-service:8000"
        - name: NEXT_PUBLIC_BETTER_AUTH_URL
          value: "http://todo.local"
---
# charts/frontend/templates/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ .Chart.Name }}
spec:
  type: {{ .Values.service.type }}
  selector:
    app: {{ .Chart.Name }}
  ports:
  - port: {{ .Values.service.port }}
    targetPort: {{ .Values.service.targetPort }}
---
# charts/frontend/templates/ingress.yaml
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Chart.Name }}-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: {{ .Values.ingress.className }}
  rules:
  - host: {{ .Values.ingress.host }}
    http:
      paths:
      - path: {{ .Values.ingress.path }}
        pathType: Prefix
        backend:
          service:
            name: {{ .Chart.Name }}
            port:
              number: {{ .Values.service.port }}
{{- end }}
```

### Backend Helm Chart

```yaml
# charts/backend/Chart.yaml
apiVersion: v2
name: todo-backend
description: Todo Backend Deployment
type: application
version: 1.0.0

---
# charts/backend/values.yaml
replicaCount: 2

image:
  repository: todo-backend
  tag: latest
  pullPolicy: Never

service:
  type: ClusterIP
  port: 8000

env:
  databaseUrl: "postgresql://..."
  betterAuthSecret: "your-secret"
  openaiApiKey: "your-api-key"

---
# charts/backend/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Chart.Name }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Chart.Name }}
  template:
    metadata:
      labels:
        app: {{ .Chart.Name }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: todo-secrets
              key: database-url
        - name: BETTER_AUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: todo-secrets
              key: better-auth-secret
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: todo-secrets
              key: openai-api-key
---
# charts/backend/templates/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ .Chart.Name }}-service
spec:
  type: {{ .Values.service.type }}
  selector:
    app: {{ .Chart.Name }}
  ports:
  - port: {{ .Values.service.port }}
    targetPort: 8000
---
# charts/backend/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: todo-secrets
type: Opaque
stringData:
  database-url: "{{ .Values.env.databaseUrl }}"
  better-auth-secret: "{{ .Values.env.betterAuthSecret }}"
  openai-api-key: "{{ .Values.env.openaiApiKey }}"
```

## Deployment with kubectl-ai

### Using kubectl-ai for Deployment

```bash
# Deploy frontend
kubectl-ai "Deploy todo-frontend with 2 replicas using Helm chart"

# Deploy backend
kubectl-ai "Deploy todo-backend with environment variables from secret"

# Scale services
kubectl-ai "Scale todo-frontend to 3 replicas"

# Check deployment status
kubectl-ai "Show me the status of todo-frontend deployment"
```

### Using kubectl-ai for Debugging

```bash
# Check why pods are failing
kubectl-ai "Why are the frontend pods crashing?"

# Analyze resource usage
kubectl-ai "Check CPU and memory usage for all pods"

# Fix configuration issues
kubectl-ai "Fix the missing environment variable in backend deployment"
```

## Using Kagent

### Health Checks

```bash
# Analyze cluster health
kagent "Analyze the health of all deployments"

# Check resource constraints
kagent "Check if any pods are hitting resource limits"
```

### Optimization

```bash
# Optimize resource allocation
kagent "Optimize resource allocation for todo-backend"

# Find bottlenecks
kagent "Identify performance bottlenecks in the cluster"
```

## Deployment Workflow

### 1. Create Namespace

```bash
kubectl create namespace todo-app
```

### 2. Create Secrets

```bash
kubectl create secret generic todo-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=better-auth-secret="your-secret" \
  --from-literal=openai-api-key="sk-..." \
  -n todo-app
```

### 3. Deploy Backend

```bash
cd charts/backend
helm install todo-backend . -n todo-app
```

### 4. Deploy Frontend

```bash
cd ../frontend
helm install todo-frontend . -n todo-app
```

### 5. Verify Deployment

```bash
# Check pods
kubectl get pods -n todo-app

# Check services
kubectl get svc -n todo-app

# Check ingress
kubectl get ingress -n todo-app

# Get Minikube URL
minikube service todo-frontend -n todo-app --url
```

### 6. Access Application

```bash
# Add entry to /etc/hosts (for local testing)
echo "$(minikube ip)  todo.local" | sudo tee -a /etc/hosts

# Access at
http://todo.local
```

## Monitoring & Debugging

### View Logs

```bash
# Backend logs
kubectl logs -f deployment/todo-backend -n todo-app

# Frontend logs
kubectl logs -f deployment/todo-frontend -n todo-app

# Specific pod logs
kubectl logs -f <pod-name> -n todo-app
```

### Debug Pod Issues

```bash
# Describe pod
kubectl describe pod <pod-name> -n todo-app

# Shell into pod
kubectl exec -it <pod-name> -n todo-app -- sh

# Check resource usage
kubectl top pods -n todo-app
```

### kubectl-ai Troubleshooting

```bash
# Diagnose pod issues
kubectl-ai "Diagnose why todo-backend-xyz-abc is not ready"

# Check connectivity
kubectl-ai "Test connectivity between frontend and backend"

# Fix configuration
kubectl-ai "Update backend deployment with correct database URL"
```

## Scaling & Updates

### Scale Deployment

```bash
# Manual scaling
kubectl scale deployment/todo-backend --replicas=3 -n todo-app

# Using kubectl-ai
kubectl-ai "Scale todo-backend to 3 replicas based on current load"
```

### Rolling Updates

```bash
# Update image
helm upgrade todo-backend . --set image.tag=v1.2.0 -n todo-app

# Update values
helm upgrade todo-backend . --values new-values.yaml -n todo-app

# Check rollout status
kubectl rollout status deployment/todo-backend -n todo-app
```

## Using Gordon (Docker AI)

### Build with Gordon

```bash
# Ask Gordon to build Dockerfile
docker ai "Build a Docker image for the todo-frontend using Dockerfile in frontend/"

# Gordon will analyze and suggest optimizations
```

### Optimize Docker Images

```bash
# Optimize frontend Dockerfile
docker ai "Optimize this Dockerfile for smaller image size and faster builds"

# Multi-stage build suggestions
docker ai "Convert this Dockerfile to use multi-stage builds for better caching"
```

## Quick Reference

| Task | Command |
|------|----------|
| Start Minikube | `minikube start --driver=docker` |
| Build frontend image | `docker build -t todo-frontend .` |
| Build backend image | `docker build -t todo-backend .` |
| Load to Minikube | `minikube image load todo-frontend` |
| Deploy backend | `helm install todo-backend . -n todo-app` |
| Deploy frontend | `helm install todo-frontend . -n todo-app` |
| Check pods | `kubectl get pods -n todo-app` |
| View logs | `kubectl logs -f deployment/todo-backend -n todo-app` |
| Scale deployment | `kubectl scale deployment/todo-backend --replicas=3` |
| Diagnose with kubectl-ai | `kubectl-ai "Why are pods failing?"` |
| Analyze with Kagent | `kagent "Check cluster health"` |

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|--------|----------|
| ImagePullBackOff | Image not in Minikube | `minikube image load <image>` |
| CrashLoopBackOff | Missing env vars | Check secrets, verify `env` section |
| Service unreachable | Ingress not configured | Enable ingress addon, check ingress config |
| Pod pending | Resource limits | Increase Minikube memory/CPU |
| 502 errors | Backend not ready | Wait for backend to start, check health endpoint |

## Best Practices

1. **Use ConfigMaps for non-sensitive config** - Secrets for credentials
2. **Set resource requests/limits** - Prevent resource exhaustion
3. **Use liveness probes** - Restart unhealthy pods automatically
4. **Tag deployments** - Track versions with `image.tag`
5. **Test locally first** - Build images, test on Minikube before cloud
6. **Use Helm for reproducibility** - Same deployment every time
7. **Monitor pod health** - Use `kubectl top` to check resources
8. **Set up logging** - Centralize logs for debugging
9. **Use ingress for external access** - Don't use LoadBalancer services
10. **Always namespace isolate** - `todo-app` namespace for all resources
