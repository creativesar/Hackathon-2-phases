# Phase V: Advanced Cloud Deployment - Specification

## Overview
Deploy advanced todo application with event-driven architecture (Kafka), distributed runtime (Dapr), and cloud Kubernetes (AKS/GKE/OKE). Implement advanced features (recurring tasks, reminders).

**Points**: 300 | **Due Date**: Jan 18, 2026

## Purpose
Evolve Phase IV deployment into production-grade cloud-native system with event streaming and advanced task features.

## Dependencies

**Predecessor Phase**: Phase IV - Kubernetes
- Inherits: Containerized application, Helm charts, Minikube deployment
- Inherits: K8s manifests, AIOps workflows

## User Stories

### US-1: Cloud Deployment
**As a developer, I want to deploy to cloud K8s (AKS/GKE/OKE), so my app is production-ready.**

### US-2: Event-Driven Architecture
**As a developer, I want to use Kafka for events, so services communicate asynchronously.**

### US-3: Distributed Runtime
**As a developer, I want to use Dapr, so I can abstract infrastructure concerns.**

### US-4: Recurring Tasks
**As a user, I want to set up recurring tasks, so I don't need to recreate them.**

### US-5: Due Date Reminders
**As a user, I want due dates and reminders, so I never miss deadlines.**

## Functional Requirements

### FR-1: Cloud Kubernetes Deployment
- System shall deploy to AKS (Azure) or GKE (Google) or OKE (Oracle)
- System shall use production-grade TLS certificates
- System shall support horizontal scaling
- System shall have CI/CD pipeline (GitHub Actions)
- System shall have monitoring and logging

### FR-2: Kafka Event Streaming
- System shall deploy Kafka cluster (or use managed service)
- System shall create topics: task-events, reminders, task-updates
- System shall publish events on task operations
- System shall consume events for:
  - Recurring task service
  - Notification service
  - Audit service

### FR-3: Dapr Integration
- System shall add Dapr sidecars to all pods
- System shall use Dapr Pub/Sub for Kafka
- System shall use Dapr State for conversation caching
- System shall use Dapr Bindings for cron reminders
- System shall use Dapr Service Invocation for internal calls
- System shall use Dapr Secrets for credential management

### FR-4: Recurring Tasks
- System shall add recurrence field to Task model
- System shall support recurrence patterns: daily, weekly, monthly
- System shall auto-create next occurrence on completion
- System shall track recurrence history

### FR-5: Due Dates & Reminders
- System shall add due_date field to Task model
- System shall allow setting due dates
- System shall send reminders before due dates
- System shall support multiple reminder times (1 day before, 1 hour before)
- System shall integrate with Kafka reminder events

### FR-6: CI/CD Pipeline
- System shall have GitHub Actions workflow
- System shall build Docker images
- System shall push to container registry
- System shall deploy to cloud K8s
- System shall run tests before deployment

### FR-7: Monitoring
- System shall configure Prometheus for metrics
- System shall configure Grafana for visualization
- System shall set up alerting rules
- System shall collect logs centrally

## Technology Stack

| Component | Technology | Purpose |
|-----------|-------------|----------|
| Cloud K8s | AKS / GKE / OKE | Production cluster |
| CI/CD | GitHub Actions | Automated deployment |
| Event Streaming | Kafka / Redpanda | Pub/Sub messaging |
| Distributed Runtime | Dapr | Abstraction layer |
| Container Registry | Docker Hub / ACR / GCR | Image storage |
| Monitoring | Prometheus + Grafana | Metrics and alerting |
| Messaging | Dapr Bindings | Scheduled reminders |

## Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    Cloud Kubernetes Cluster (AKS/GKE/OKE)          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │              Namespace: todo-app                         │     │
│  │                                                           │     │
│  │  ┌─────────────────────────────────────────────────┐    │     │
│  │  │         Frontend Pod + Dapr Sidecar       │    │     │
│  │  │  ┌─────────────────────────────────────┐    │    │     │
│  │  │  │  Next.js App                   │    │    │     │
│  │  │  └─────────────────────────────────────┘    │    │     │
│  │  │         ▲                                  │    │     │
│  │  │         │ Dapr HTTP Port (3500)             │    │     │
│  │  └─────────────────────────────────────────────────┘    │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐     │
│  │         Backend Pod + Dapr Sidecar        │     │
│  │  ┌─────────────────────────────────────┐    │     │
│  │  │  FastAPI + Agents SDK + MCP    │    │     │
│  │  │  ┌───────────────────────────┐  │    │     │
│  │  │  │  Kafka Publisher        │  │    │     │
│  │  │  └───────────────────────────┘  │    │     │
│  │  └─────────────────────────────────────┘    │     │
│  │         ▲                                  │    │     │
│  │         │ Dapr HTTP Port (3500)             │    │     │
│  └──────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐     │
│  │         Kafka Cluster (K8s or Managed)      │     │
│  │  ┌─────────────────────────────────────┐    │     │
│  │  │  Topic: task-events            │    │     │
│  │  │  Topic: reminders              │    │     │
│  │  │  Topic: task-updates          │    │     │
│  │  └─────────────────────────────────────┘    │     │
│  └──────────────────────────────────────────────────┘     │
│           ▲                         ▲                      │
│           │                         │                      │
│  ┌─────────────────┐   ┌─────────────────┐              │
│  │ Notification     │   │ Recurring Task  │              │
│  │ Service         │   │ Service         │              │
│  │ + Dapr Sidecar  │   │ + Dapr Sidecar  │              │
│  └─────────────────┘   └─────────────────┘              │
│          │                     │                         │
│          └──────► Publish / Subscribe to Kafka   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐     │
│  │         Dapr Components                     │     │
│  │  ┌─────────────────────────────────────┐    │     │
│  │  │  pubsub.kafka (task-events)    │    │     │
│  │  │  state.postgresql                │    │     │
│  │  │  bindings.cron (reminders)      │    │     │
│  │  │  secretstores.kubernetes        │    │     │
│  │  └─────────────────────────────────────┘    │     │
│  └──────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐     │
│  │         External Neon DB                   │     │
│  │  - tasks table (now with due_date,    │     │
│  │              recurrence)                    │     │
│  │  - conversations table                │     │
│  │  - messages table                   │     │
│  └──────────────────────────────────────────────────┘     │
│                                                                  │
└───────────────────────────────────────────────────────────────────┘
```

## Data Model Changes

### Task Model (Enhanced)
```python
class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str
    title: str
    description: str | None = None
    completed: bool = Field(default=False)
    due_date: datetime | None = Field(default=None)  # NEW
    recurrence: str | None = Field(default=None)     # NEW (daily/weekly/monthly)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Recurrence Model (NEW)
```python
class TaskRecurrence(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    task_id: int = Field(foreign_key="task.id")
    recurrence_type: str  # "daily", "weekly", "monthly"
    next_due_date: datetime
    last_created_at: datetime
```

## Kafka Topics

| Topic | Purpose | Producer | Consumer |
|-------|---------|-----------|-----------|
| task-events | All task CRUD operations | Backend → Recurring Task Service, Audit Service |
| reminders | Due date reminders | Backend/Notification Service → Notification Consumers |
| task-updates | Real-time task changes | Backend → WebSocket Service |

## Event Schemas

### Task Event
```json
{
  "event_type": "created|updated|completed|deleted",
  "task_id": 123,
  "task_data": { /* full task object */ },
  "user_id": "ziakhan",
  "timestamp": "2025-01-18T10:00:00Z"
}
```

### Reminder Event
```json
{
  "task_id": 123,
  "title": "Buy groceries",
  "due_at": "2025-01-20T10:00:00Z",
  "remind_at": "2025-01-19T10:00:00Z",
  "user_id": "ziakhan"
}
```

## Dapr Components

### Pub/Sub Component (Kafka)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
  namespace: todo-app
spec:
  type: pubsub.kafka
  version: v1
  metadata:
    - name: brokers
      value: "kafka:9092"
    - name: consumerGroup
      value: "todo-services"
    - name: authRequired
      value: "false"
```

### State Component (PostgreSQL)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
  namespace: todo-app
spec:
  type: state.postgresql
  version: v1
  metadata:
    - name: connectionString
      secretKeyRef:
        name: neon-secrets
        key: connection-string
```

### Binding Component (Cron - Reminders)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: reminder-check
  namespace: todo-app
spec:
  type: bindings.cron
  version: v1
  metadata:
    - name: schedule
      value: "@every 5m"  # Check every 5 minutes
```

### Secret Store Component
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kubernetes-secrets
  namespace: todo-app
spec:
  type: secretstores.kubernetes
  version: v1
```

## CI/CD Pipeline (GitHub Actions)

**Workflow**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Cloud K8s

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Build Docker images
      run: |
        docker build -t todo-frontend:${{ github.sha }} ./frontend
        docker build -t todo-backend:${{ github.sha }} ./backend

    - name: Login to registry
      uses: docker/login-action@v2
      with:
        registry: ghcr.io

    - name: Push images
      run: |
        docker push ghcr.io/todo-frontend:${{ github.sha }}
        docker push ghcr.io/todo-backend:${{ github.sha }}

    - name: Deploy with Helm
      run: |
        helm upgrade --install todo-app ./helm/todo-app \
          --namespace todo-app \
          --values values-prod.yaml \
          --set image.tag=${{ github.sha }}
```

## Non-Functional Requirements

### NFR-1: Performance
- Event latency: < 100ms (producer to consumer)
- API response: < 500ms
- Dapr sidecar overhead: < 20ms
- Cron check interval: 5 minutes

### NFR-2: Scalability
- Kafka supports partitioning
- Horizontal Pod Autoscaling
- Load balancing via Service
- Database connection pooling

### NFR-3: Reliability
- Event replay supported (Kafka retention)
- Idempotent event processing
- Graceful degradation
- Circuit breakers (Dapr)

### NFR-4: Observability
- Metrics: Prometheus + Grafana
- Logs: Centralized (Loki or similar)
- Tracing: OpenTelemetry (optional)
- Alerting: Grafana Alertmanager

## Acceptance Criteria

### AC-1: Cloud Deployment
- [ ] Cluster created on AKS/GKE/OKE
- [ ] Application deployed
- [ ] TLS configured (production certificates)
- [ ] Domain configured
- [ ] All pods healthy

### AC-2: Kafka Integration
- [ ] Kafka cluster running
- [ ] All topics created
- [ ] Events publish correctly
- [ ] Event consumers functional

### AC-3: Dapr Integration
- [ ] Dapr sidecars running
- [ ] Pub/Sub component working
- [ ] State component working
- [ ] Bindings component working
- [ ] Secrets component working

### AC-4: Recurring Tasks
- [ ] Task model updated with recurrence field
- [ ] Recurring Task Service created
- [ ] Auto-creation on completion working
- [ ] Recurrence history tracked

### AC-5: Due Dates & Reminders
- [ ] Task model updated with due_date field
- [ ] UI allows setting due dates
- [ ] Reminder Service created
- [ ] Cron binding configured
- [ ] Reminders sent before due dates

### AC-6: Event-Driven Architecture
- [ ] task-events topic populated
- [ ] Recurring Service subscribes and processes
- [ ] Notification Service subscribes
- [ ] Audit Service subscribes
- [ ] Events logged

### AC-7: CI/CD Pipeline
- [ ] GitHub Actions workflow created
- [ ] Build stage working
- [ ] Push to registry working
- [ ] Deploy stage working
- [ ] Tests run before deploy

### AC-8: Monitoring
- [ ] Prometheus configured
- [ ] Grafana dashboard configured
- [ ] Alerting rules configured
- [ ] Metrics collecting
- [ ] Logs collecting

### AC-9: Advanced Features
- [ ] Recurring tasks functional in UI
- [ ] Due dates displayed
- [ ] Reminders work
- [ ] All features tested end-to-end

### AC-10: Demo & Documentation
- [ ] Demo video under 90 seconds
- [ ] Shows cloud deployment
- [ ] Shows Kafka + Dapr working
- [ ] Shows advanced features
- [ ] Complete documentation

## Out of Scope

- Voice commands (Bonus - Phase III)
- Multi-language support (Bonus - Phase III)
- Advanced analytics (dashboard, reports)
- Machine learning features
- Multi-tenant (beyond simple user isolation)

## Related Bonus Features

### Bonus 1: Reusable Intelligence (+200)
Create Claude Code Agent Skills for:
- Kafka topic generation
- Dapr component generation
- CI/CD workflow generation
- Monitoring dashboard generation

**Relevance**: High - directly to cloud deployment automation

### Bonus 2: Cloud-Native Blueprints (+200)
Create spec-driven deployment blueprints via Agent Skills
- Cloud K8s deployment blueprint
- Kafka cluster blueprint
- Dapr integration blueprint
- Monitoring stack blueprint

**Relevance**: High - core to this phase

## Integration with Phase IV

### Inherited from Phase IV
- **Containerized Application**: Docker images
- **Helm Charts**: Complete chart structure
- **K8s Manifests**: Deployment, Service, Ingress
- **AIOps Workflows**: kubectl-ai, kagent, Gordon

### New in Phase V
- **Cloud K8s**: Minikube → AKS/GKE/OKE
- **Kafka**: Event streaming added
- **Dapr**: Distributed runtime added
- **CI/CD**: GitHub Actions pipeline
- **Monitoring**: Prometheus + Grafana
- **Advanced Features**: Recurring tasks, reminders

## Cloud Providers

### Azure (AKS)
**Free Credits**: $200 for 30 days
**Setup**:
```bash
az login
az aks create --resource-group todo-rg --name todo-aks --node-count 1
az aks get-credentials --resource-group todo-rg --name todo-aks
```

### Google Cloud (GKE)
**Free Credits**: $300 for 90 days
**Setup**:
```bash
gcloud container clusters create todo-gke --num-nodes=1 --zone=us-central1-a
gcloud container clusters get-credentials todo-gke
```

### Oracle Cloud (OKE) - **RECOMMENDED (Always Free)**
**Free Tier**: 4 OCPUs, 24GB RAM - always free
**Setup**:
```bash
oci ce cluster create --name todo-oke --node-pool-shape "VM.Standard.E4.Flex"
```

## Preparation for Production

### Deliverables
- Production-ready Helm charts
- CI/CD pipeline
- Monitoring stack
- Complete documentation
- Deployment runbook

### Operational Readiness
- Runbook for common tasks
- Alerting thresholds
- Rollback procedures
- Disaster recovery plan

## Constraints

- Must use Spec-Driven Development
- No manual coding allowed
- Must use AKS/GKE or OKE
- Must deploy Kafka (managed or self-hosted)
- Must integrate Dapr sidecars
- Must have CI/CD pipeline

## Success Metrics

- Cloud K8s deployment working
- Kafka event streaming functional
- Dapr components working
- Advanced features (recurring, reminders) working
- CI/CD pipeline automated
- Monitoring configured
- Demo video under 90 seconds
- Complete specification files

## Clarifications & Decisions

### CLR-001: Cloud Provider Selection
**Decision**: Oracle Cloud OKE (Always Free Tier) for hackathon
**Rationale**: 4 OCPUs + 24GB RAM free, sufficient for all services, zero cost
**Implementation**:
```bash
# Create OKE cluster
oci ce cluster create \
  --name todo-oke \
  --node-pool-shape "VM.Standard.E4.Flex" \
  --nsg-type "OCI_VCN_NATIVE"

# Get credentials
oci ce cluster create-kubeconfig \
  --cluster-id <cluster-id> \
  --file $HOME/.kube/config
```

### CLR-002: Kafka Deployment Option
**Decision**: Use Redpanda Cloud Free Tier for simplicity
**Rationale**: Kafka-compatible, serverless, free tier available, easy setup
**Implementation**:
- Create Redpanda Cloud account
- Create free tier cluster
- Get bootstrap servers URL
- Configure Dapr pubsub component with Redpanda brokers
- Alternative: Self-hosted Kafka on K8s using Strimzi operator

### CLR-003: Dapr Sidecar Injection
**Decision**: Use K8s annotations for automatic injection
**Rationale**: Standard Dapr practice, no code changes, automatic mTLS
**Implementation**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-backend
spec:
  template:
    metadata:
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "todo-backend"
        dapr.io/app-port: "8000"
        dapr.io/config: "app-config"
```

### CLR-004: Event Schema Versioning
**Decision**: Include version field in all Kafka events
**Rationale**: Supports event schema evolution, backward compatibility
**Implementation**:
```json
{
  "version": "1.0",
  "event_type": "task_created",
  "task_id": 123,
  "task_data": {...},
  "user_id": "ziakhan",
  "timestamp": "2025-01-18T10:00:00Z"
}
```

### CLR-005: Cron Check Interval
**Decision**: Check reminders every 5 minutes
**Rationale**: Frequent enough for accuracy, minimal resource usage
**Implementation**:
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: reminder-check
spec:
  type: bindings.cron
  metadata:
    - name: schedule
      value: "@every 5m"
```

### CLR-006: Recurrence Calculation Strategy
**Decision**: Calculate next due date on task completion
**Rationale**: Simple to implement, consistent behavior, user-friendly
**Implementation**:
- Daily: due_date + 1 day
- Weekly: due_date + 7 days
- Monthly: due_date + 1 month
- Store next_due_date in TaskRecurrence model
- Auto-create task via Notification Service on completion

## Notes

- This is the final phase
- Focus on production-grade deployment
- Document all operational procedures
- Test event-driven architecture thoroughly
- Prepare for presentation and judging
