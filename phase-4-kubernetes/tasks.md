# Phase IV: Local Kubernetes Deployment - Tasks

## Task Breakdown

| ID | Description | Dependencies | Status |
|-----|-------------|----------------|---------|
| T-401 | Set up Minikube and prerequisites | None | ✅ Completed |
| T-402 | Create frontend Dockerfile | T-401 | ✅ Completed |
| T-403 | Create backend Dockerfile | T-401 | ✅ Completed |
| T-404 | Build Docker images | T-402, T-403 | ✅ Completed |
| T-405 | Create Kubernetes namespace | T-401 | ✅ Completed |
| T-406 | Create Helm chart structure | T-405 | ✅ Completed |
| T-407 | Create frontend deployment manifest | T-406 | ✅ Completed |
| T-408 | Create backend deployment manifest | T-406 | ✅ Completed |
| T-409 | Create service manifests | T-407, T-408 | ✅ Completed |
| T-410 | Create ConfigMap manifests | T-406 | ✅ Completed |
| T-411 | Create Secret manifests | T-406 | ✅ Completed |
| T-412 | Create Ingress manifest | T-409 | ✅ Completed |
| T-413 | Create Helm values files | T-406 | ✅ Completed |
| T-414 | Configure health probes | T-407, T-408 | ✅ Completed |
| T-415 | Load images into Minikube | T-404 | ✅ Completed |
| T-416 | Deploy with Helm | T-415, T-413 | ✅ Completed |
| T-417 | Verify deployment | T-416 | ✅ Completed |
| T-418 | Test application functionality | T-417 | ✅ Completed |
| T-419 | Configure local DNS (/etc/hosts) | T-417 | ✅ Completed |
| T-420 | Document AIOps commands | T-416 | ✅ Completed |
| T-421 | Test scaling | T-418 | ✅ Completed |
| T-422 | Create README | T-420 | Pending |
| T-423 | Record demo video | T-422 | Pending |

---

## Detailed Tasks

### T-401: Set up Minikube and prerequisites

**Priority**: High
**Related Spec**: Technology Stack

**Steps**:
1. Verify Docker Desktop installed
2. Install Minikube: `choco install minikube` (Windows)
3. Install kubectl: `choco install kubernetes-cli`
4. Install Helm: `choco install kubernetes-helm`
5. Enable Docker AI (Gordon) in Docker Desktop Settings
6. Install kubectl-ai: `npm install -g kubectl-ai`
7. Install kagent: `npm install -g @kagent-dev/kagent`
8. Start Minikube: `minikube start --cpus=4 --memory=4096`
9. Enable ingress: `minikube addons enable ingress`

**Outputs**: Minikube running with ingress

---

### T-402: Create frontend Dockerfile

**Priority**: High
**Related Spec**: FR-1, Docker Images

**Steps**:
1. Navigate to `frontend/`
2. Create `Dockerfile` with multi-stage build
3. Stage 1: Dependencies (install node_modules)
4. Stage 2: Build (run npm run build)
5. Stage 3: Production (copy .next and public)
6. Create `.dockerignore` file
7. Optimize for size (use Alpine)

**Outputs**: `frontend/Dockerfile`, `frontend/.dockerignore`

---

### T-403: Create backend Dockerfile

**Priority**: High
**Related Spec**: FR-1, Docker Images

**Steps**:
1. Navigate to `backend/`
2. Create `Dockerfile`
3. Stage 1: Dependencies (install from requirements.txt)
4. Stage 2: Application (copy source code)
5. Use slim Python base image
6. Create `.dockerignore` file
7. Expose port 8000

**Outputs**: `backend/Dockerfile`, `backend/.dockerignore`

---

### T-404: Build Docker images

**Priority**: High
**Related Spec**: FR-1, AC-1

**Steps**:
1. Build frontend image: `docker build -t todo-frontend:latest ./frontend`
2. Build backend image: `docker build -t todo-backend:latest ./backend`
3. Verify images: `docker images | grep todo`
4. Check image sizes (< 500MB frontend, < 300MB backend)
5. If Gordon available, use: `docker ai "Build optimized images"`

**Outputs**: Docker images built

---

### T-405: Create Kubernetes namespace

**Priority**: Medium
**Related Spec**: Kubernetes Deployment

**Steps**:
1. Create namespace YAML: `k8s/namespace.yaml`
2. Define namespace: `todo-app`
3. Create labels for organization
4. Apply: `kubectl apply -f k8s/namespace.yaml`
5. Verify: `kubectl get namespace`

**Outputs**: K8s namespace created

---

### T-406: Create Helm chart structure

**Priority**: High
**Related Spec**: Helm Charts

**Steps**:
1. Create directory: `helm/todo-app/`
2. Create `Chart.yaml` with metadata
3. Create `templates/` directory
4. Create `values.yaml` with defaults
5. Create `values-dev.yaml` for local development
6. Create `values-prod.yaml` for production

**Outputs**: Helm chart structure created

---

### T-407: Create frontend deployment manifest

**Priority**: High
**Related Spec**: Kubernetes Deployment

**Steps**:
1. Create template: `helm/todo-app/templates/frontend-deployment.yaml`
2. Define Deployment resource with:
   - App label: `todo-frontend`
   - Replicas: 2
   - Container: `todo-frontend:latest`
   - Port: 3000
   - Env vars from ConfigMap
   - Resource limits (CPU 500m, RAM 512Mi)
3. Add liveness probe (HTTP GET / every 10s)
4. Add readiness probe (HTTP GET / every 5s)

**Outputs**: Frontend deployment manifest

---

### T-408: Create backend deployment manifest

**Priority**: High
**Related Spec**: Kubernetes Deployment

**Steps**:
1. Create template: `helm/todo-app/templates/backend-deployment.yaml`
2. Define Deployment resource with:
   - App label: `todo-backend`
   - Replicas: 2
   - Container: `todo-backend:latest`
   - Port: 8000
   - Env vars from Secrets (DB URL, JWT, OpenAI key)
   - Resource limits (CPU 500m, RAM 512Mi)
3. Add liveness probe (HTTP GET /health every 10s)
4. Add readiness probe (HTTP GET /health every 5s)

**Outputs**: Backend deployment manifest

---

### T-409: Create service manifests

**Priority**: High
**Related Spec**: Kubernetes Deployment

**Steps**:
1. Create `helm/todo-app/templates/frontend-service.yaml`
   - Selector: `app: todo-frontend`
   - Port: 80 → 3000
   - Type: ClusterIP
2. Create `helm/todo-app/templates/backend-service.yaml`
   - Selector: `app: todo-backend`
   - Port: 80 → 8000
   - Type: ClusterIP

**Outputs**: Frontend and backend Service manifests

---

### T-410: Create ConfigMap manifests

**Priority**: Medium
**Related Spec**: Kubernetes Deployment

**Steps**:
1. Create `helm/todo-app/templates/configmap.yaml`
2. Define frontend config:
   - `NEXT_PUBLIC_API_URL`: backend service URL
   - Other env vars
3. Reference in values.yaml

**Outputs**: ConfigMap manifest

---

### T-411: Create Secret manifests

**Priority**: High
**Related Spec**: Kubernetes Deployment

**Steps**:
1. Create `helm/todo-app/templates/secret.yaml`
2. Define secrets for:
   - `NEON_CONNECTION_STRING`: Neon DB URL
   - `JWT_SECRET`: Better Auth secret
   - `OPENAI_API_KEY`: OpenAI key
3. Create `secrets.yaml` (not in git) with actual values
4. Document secret creation process

**Outputs**: Secret manifest template

---

### T-412: Create Ingress manifest

**Priority**: High
**Related Spec**: Ingress

**Steps**:
1. Create `helm/todo-app/templates/ingress.yaml`
2. Define Ingress with:
   - Host: `todo.local`
   - Class: `nginx`
   - TLS annotations (self-signed)
3. Route rules:
   - `/` → Frontend service
   - `/api` → Backend service
4. Add rewrite target annotation

**Outputs**: Ingress manifest

---

### T-413: Create Helm values files

**Priority**: Medium
**Related Spec**: Helm Charts

**Steps**:
1. Update `helm/todo-app/values.yaml`:
   - Frontend config (replicas, image, resources)
   - Backend config (replicas, image, resources)
   - Ingress config (host, enabled)
2. Create `helm/todo-app/values-dev.yaml`:
   - Set for local Minikube
   - Use `todo.local` for ingress
3. Create `helm/todo-app/values-prod.yaml`:
   - Production-ready values
   - Higher replicas
   - Proper TLS configuration

**Outputs**: Values files created

---

### T-414: Configure health probes

**Priority**: Medium
**Related Spec**: Health Checks

**Steps**:
1. Add liveness probe to frontend deployment:
   - HTTP GET `/` every 10s
   - Initial delay: 10s
   - Timeout: 5s
2. Add readiness probe to frontend deployment:
   - HTTP GET `/` every 5s
   - Initial delay: 5s
3. Add liveness probe to backend deployment:
   - HTTP GET `/health` every 10s
4. Add readiness probe to backend deployment:
   - HTTP GET `/health` every 5s
5. Test probes with `kubectl describe pod <pod>`

**Outputs**: Health probes configured

---

### T-415: Load images into Minikube

**Priority**: High
**Related Spec**: Container Requirements

**Steps**:
1. Load frontend image: `minikube image load todo-frontend:latest`
2. Load backend image: `minikube image load todo-backend:latest`
3. Verify loaded: `minikube image ls`
4. If images too large, optimize Dockerfiles

**Outputs**: Images loaded into Minikube

---

### T-416: Deploy with Helm

**Priority**: High
**Related Spec**: Helm Charts

**Steps**:
1. Install Helm chart:
   ```bash
   helm install todo-app ./helm/todo-app \
     --namespace todo-app \
     --values values-dev.yaml \
     --create-namespace
   ```
2. Wait for deployment: `kubectl get pods -n todo-app -w`
3. Verify pods are Running
4. Check services: `kubectl get svc -n todo-app`
5. Check ingress: `kubectl get ingress -n todo-app`

**Outputs**: Application deployed

---

### T-417: Verify deployment

**Priority**: High
**Related Spec**: AC-6, AC-7

**Steps**:
1. Check all pods: `kubectl get pods -n todo-app`
2. Verify pod status (Running, not CrashLoopBackOff)
3. Check logs:
   - Frontend: `kubectl logs -l app=todo-frontend -n todo-app`
   - Backend: `kubectl logs -l app=todo-backend -n todo-app`
4. Verify services: `kubectl get svc -n todo-app`
5. Verify ingress: `kubectl get ingress -n todo-app`
6. Test with kubectl-ai: `kubectl-ai "Show status of todo-app"`

**Outputs**: Deployment verified

---

### T-418: Test application functionality

**Priority**: High
**Related Spec**: AC-6, AC-9

**Steps**:
1. Access application (once DNS configured)
2. Test chatbot interface
3. Test add task via chat
4. Test list tasks via chat
5. Test mark complete via chat
6. Test delete task via chat
7. Test authentication flow
8. Verify database connectivity

**Outputs**: All features tested

---

### T-419: Configure local DNS (/etc/hosts)

**Priority**: High
**Related Spec**: Ingress

**Steps**:
1. Get Minikube IP: `minikube ip`
2. Get ingress host: `kubectl get ingress -n todo-app`
3. Update /etc/hosts (Linux/Mac):
   ```bash
   echo "192.168.49.2 todo.local" | sudo tee -a /etc/hosts
   ```
4. Update C:\Windows\System32\drivers\etc\hosts (Windows):
   - Run as Administrator
   - Add line: `192.168.49.2  todo.local`
5. Test access: `curl http://todo.local`
6. Access in browser: `http://todo.local`

**Outputs**: Local DNS configured

---

### T-420: Document AIOps commands

**Priority**: Medium
**Related Spec**: AIOps Integration

**Steps**:
1. Create `docs/aiops-commands.md`
2. Document kubectl-ai commands:
   - Deploy: "Deploy todo frontend with 2 replicas"
   - Scale: "Scale backend to 4 replicas"
   - Check status: "Show me all pods in todo-app"
   - Logs: "Show backend logs"
3. Document kagent commands:
   - Health: "Analyze cluster health"
   - Optimize: "Optimize resource allocation"
4. Document Gordon commands:
   - Build: "Build optimized Docker images"
   - Scan: "Scan for vulnerabilities"
5. Add example usage outputs

**Outputs**: AIOps commands documented

---

### T-421: Test scaling

**Priority**: Medium
**Related Spec**: Scalability

**Steps**:
1. Check current replicas: `kubectl get deploy -n todo-app`
2. Scale frontend: `kubectl scale deployment todo-frontend --replicas=3 -n todo-app`
3. Scale backend: `kubectl scale deployment todo-backend --replicas=3 -n todo-app`
4. Verify new pods started
5. Test application with higher replicas
6. Scale back down: `kubectl scale deployment todo-frontend --replicas=2 -n todo-app`
7. Use kubectl-ai to assist: `kubectl-ai "Scale backend to handle more load"`

**Outputs**: Scaling tested

---

### T-422: Create README

**Priority**: Medium
**Related Spec**: Success Criteria

**Steps**:
1. Create `phase-4-kubernetes/README.md`
2. Include sections:
   - Prerequisites (Docker, Minikube, kubectl, Helm)
   - Installation steps for all tools
   - Build and deployment process
   - How to access application
   - AIOps commands examples
   - Troubleshooting guide
   - Architecture diagrams
3. Add screenshots if possible
4. Document environment variables

**Outputs**: Complete README

---

### T-423: Record demo video

**Priority**: High
**Related Spec**: AC-10

**Steps**:
1. Plan video script (under 90 seconds):
   - Show Minikube setup (10s)
   - Show Docker build (10s)
   - Show Helm deployment (10s)
   - Show AIOps usage (15s)
   - Show running application (15s)
   - Show scaling demo (10s)
   - Show chatbot working (20s)
2. Record demo (use OBS, Loom, or similar)
3. Keep under 90 seconds
4. Upload to YouTube or similar
5. Add link to submission form

**Outputs**: Demo video ready

---

## Task Dependencies

```
T-401 (Setup)
  ├─→ T-402 (Frontend Dockerfile)
  │     └─→ T-404 (Build Images)
  │
  ├─→ T-403 (Backend Dockerfile)
  │     └─→ T-404 (Build Images)
  │
  └─→ T-405 (Namespace)
        └─→ T-406 (Helm Chart)
              ├─→ T-407 (Frontend Deployment)
              │     ├─→ T-409 (Services)
              │     └─→ T-412 (Ingress)
              │
              ├─→ T-408 (Backend Deployment)
              │     ├─→ T-409 (Services)
              │     └─→ T-410 (ConfigMaps)
              │
              ├─→ T-411 (Secrets)
              │
              └─→ T-413 (Values)
              └─→ T-414 (Health Probes)
              └─→ T-415 (Load Images)
                    └─→ T-416 (Deploy with Helm)
                          └─→ T-417 (Verify)
                                ├─→ T-418 (Test App)
                                ├─→ T-419 (DNS Config)
                                ├─→ T-420 (AIOps Docs)
                                ├─→ T-421 (Test Scaling)
                                ├─→ T-422 (README)
                                └─→ T-423 (Demo Video)
```

## Progress Checklist

- [x] Prerequisites installed (Minikube, kubectl, Helm)
- [x] Dockerfiles created (frontend + backend)
- [x] Images built and optimized
- [x] Minikube cluster running
- [x] Helm chart structure created
- [x] All K8s manifests created
- [x] Secrets and ConfigMaps defined
- [x] Ingress configured
- [x] Application deployed
- [x] Pods healthy and running
- [x] Application accessible
- [x] AIOps tools tested
- [x] Scaling tested
- [x] Documentation complete
- [ ] Demo video recorded

## Time Estimates

| Task | Est. Time | Actual Time | Status |
|-------|-----------|--------------|---------|
| T-401 | 20 min | 15 min | ✅ Completed |
| T-402 | 15 min | 5 min | ✅ Completed |
| T-403 | 15 min | 5 min | ✅ Completed |
| T-404 | 30 min | 10 min | ✅ Completed |
| T-405 | 5 min | 2 min | ✅ Completed |
| T-406 | 15 min | 8 min | ✅ Completed |
| T-407 | 20 min | 10 min | ✅ Completed |
| T-408 | 20 min | 10 min | ✅ Completed |
| T-409 | 15 min | 8 min | ✅ Completed |
| T-410 | 10 min | 5 min | ✅ Completed |
| T-411 | 15 min | 8 min | ✅ Completed |
| T-412 | 20 min | 12 min | ✅ Completed |
| T-413 | 15 min | 10 min | ✅ Completed |
| T-414 | 15 min | 10 min | ✅ Completed |
| T-415 | 10 min | 5 min | ✅ Completed |
| T-416 | 15 min | 12 min | ✅ Completed |
| T-417 | 20 min | 8 min | ✅ Completed |
| T-418 | 30 min | 15 min | ✅ Completed |
| T-419 | 10 min | 5 min | ✅ Completed |
| T-420 | 20 min | 15 min | ✅ Completed |
| T-421 | 15 min | 10 min | ✅ Completed |
| T-422 | 20 min | - | Pending |
| T-423 | 30 min | - | Pending |
| **Total** | **~4.5 hours** | - | |

## Notes

- All tasks must be completed before Phase IV submission
- Use Claude Code for all implementation
- Test AIOps commands extensively
- Document all commands used
- Prepare for Phase V (cloud deployment)
- Demo video MUST be under 90 seconds
- Focus on local Minikube deployment (not cloud yet)
