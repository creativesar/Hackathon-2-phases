# Phase V: Advanced Cloud Deployment - Plan

## Architecture Overview
Cloud-native distributed system with Kubernetes, Kafka event streaming, and Dapr distributed runtime. Deploy to production cloud (AKS/GKE/OKE).

```
┌──────────────────────────────────────────────────────────────────────────┐
│                  Cloud Kubernetes Cluster (AKS/GKE/OKE)             │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │              Namespace: todo-app                          │       │
│  │                                                            │       │
│  │  ┌────────────────────────────────────────────────────┐     │       │
│  │  │         Frontend + Dapr Sidecar             │     │       │
│  │  │  ┌─────────────────────────────────────┐     │       │
│  │  │  │  Next.js Chatbot              │     │       │
│  │  │  │  Port: 3000                     │     │       │
│  │  │  │  Env: API via Dapr invocation  │     │       │
│  │  │  └─────────────────────────────────────┘     │       │
│  │  │         ▲                                        │       │
│  │  │         │ Dapr HTTP: 3500                   │       │
│  │  └────────────────────────────────────────────────────┘     │       │
│  │               ▲                                               │       │
│  │               │ Service: todo-frontend                        │       │
│  │               │                                                │       │
│  │  ┌────────────────────────────────────────────────────┐     │       │
│  │  │         Backend + Dapr Sidecar               │     │       │
│  │  │  ┌─────────────────────────────────────┐     │       │
│  │  │  │  FastAPI + Agents SDK + MCP   │     │       │
│  │  │  │  Port: 8000                     │     │       │
│  │  │  │  Kafka Publisher (Dapr)         │     │       │
│  │  │  └─────────────────────────────────────┘     │       │
│  │  │         ▲                                        │       │
│  │  │         │ Dapr HTTP: 3500                   │       │
│  │  └────────────────────────────────────────────────────┘     │       │
│  │               ▲                                               │       │
│  │               │ Service: todo-backend                         │       │
│  │               │                                                │       │
│  │  ┌────────────────────────────────────────────────────┐     │       │
│  │  │         Recurring Task Service + Dapr     │     │       │
│  │  │  ┌─────────────────────────────────────┐     │       │
│  │  │  │  Kafka Consumer                 │     │       │
│  │  │  │  Auto-create next task           │     │       │
│  │  │  └─────────────────────────────────────┘     │       │
│  │  └────────────────────────────────────────────────────┘     │       │
│  │                                                        │       │
│  │  ┌────────────────────────────────────────────────────┐     │       │
│  │  │         Notification Service + Dapr        │     │       │
│  │  │  ┌─────────────────────────────────────┐     │       │
│  │  │  │  Kafka Consumer                 │     │       │
│  │  │  │  Send reminders                 │     │       │
│  │  │  └─────────────────────────────────────┘     │       │
│  │  └────────────────────────────────────────────────────┘     │       │
│  │                                                        │       │
│  │  ┌────────────────────────────────────────────────────┐     │       │
│  │  │         Kafka Cluster (K8s or Managed)    │     │       │
│  │  │  ┌─────────────────────────────────────┐     │       │
│  │  │  │  Topic: task-events           │     │       │
│  │  │  │  Topic: reminders             │     │       │
│  │  │  │  Topic: task-updates         │     │       │
│  │  │  └─────────────────────────────────────┘     │       │
│  │  └────────────────────────────────────────────────────┘     │       │
│  │                                                        │       │
│  │  ┌────────────────────────────────────────────────────┐     │       │
│  │  │         Dapr Components                     │     │       │
│  │  │  ┌─────────────────────────────────────┐     │       │
│  │  │  │  pubsub.kafka (task-events)      │     │       │
│  │  │  │  state.postgresql                │     │       │
│  │  │  │  bindings.cron (reminders)      │     │       │       │
│  │  │  │  secretstores.kubernetes         │     │       │
│  │  │  └─────────────────────────────────────┘     │       │
│  │  └────────────────────────────────────────────────────┘     │       │
│  │                                                        │       │
│  │  ┌────────────────────────────────────────────────────┐     │       │
│  │  │         Monitoring Stack                  │     │       │
│  │  │  ┌─────────────────────────────────────┐     │       │
│  │  │  │  Prometheus + Grafana            │     │       │
│  │  │  │  Loki (Logs)                    │     │       │
│  │  │  │  Alertmanager                    │     │       │
│  │  │  └─────────────────────────────────────┘     │       │
│  │  └────────────────────────────────────────────────────┘     │       │
│  │                                                        │       │
│  └───────────────────────────────────────────────────────────────────┘       │
                        ▲                         ▲                       │
                        │                         │                       │
        ┌───────────────┐    ┌───────────────┐                         │
        │   Neon DB      │    │  User Browser │                         │
        │  (External)    │    │  Production  │                         │
        └───────────────┘    │    URL         │                         │
                                └───────────────┘                         │
```

## Technology Stack

| Component | Technology | Provider |
|-----------|-------------|----------|
| Cloud K8s | AKS / GKE / OKE | Azure / Google / Oracle |
| Event Streaming | Kafka / Redpanda | Self-hosted or Managed |
| Distributed Runtime | Dapr | Open source |
| CI/CD | GitHub Actions | GitHub |
| Container Registry | ACR / GCR / Docker Hub | Cloud provider or Hub |
| Monitoring | Prometheus + Grafana | Self-hosted |
| Logging | Loki | Self-hosted |

## Component Design

### 1. Kafka Cluster

**Purpose**: Event streaming for distributed architecture

**Options**:

**Option A: Self-hosted on K8s (Strimzi)**
- Recommended for hackathon
- Free (just compute cost)
- Full control
- Learng experience

**Option B: Redpanda Cloud (Free Tier)**
- Kafka-compatible
- Serverless
- Easy setup
- Free for basic use

**Option C: Confluent Cloud**
- Industry standard
- $400 credit for 30 days
- More complex setup

**Topics**:
```yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: task-events
  namespace: todo-app
spec:
  partitions: 3
  replicas: 1
```

### 2. Dapr Integration

**Purpose**: Abstract infrastructure with building blocks

**Dapr Sidecar Annotation**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-backend
  namespace: todo-app
spec:
  template:
    metadata:
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "todo-backend"
        dapr.io/app-port: "8000"
```

**Dapr Pub/Sub for Kafka**:
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

**Dapr State (Conversation Cache)**:
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

**Dapr Bindings (Cron Reminders)**:
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

### 3. Recurring Task Service

**Purpose**: Auto-create next occurrence of recurring tasks

**Python Code**:
```python
from dapr.clients import DaprClient

dapr = DaprClient()

@app.post("/bindings/reminder-check")
async def handle_reminder(event):
    """Dapr calls this every 5 minutes"""
    # Query tasks due soon
    due_tasks = db.query("SELECT * FROM tasks WHERE due_date <= NOW() + INTERVAL '1 HOUR'")

    for task in due_tasks:
        if task.recurrence:
            # Create next occurrence
            create_next_task(task)

            # Publish event
            dapr.publish_event(
                pubsub_name="kafka-pubsub",
                topic_name="task-events",
                data={
                    "event_type": "recurring_task_created",
                    "task_id": task.id
                }
            )

    return {"status": "OK"}
```

### 4. Notification Service

**Purpose**: Send reminders before due dates

**Python Code**:
```python
from dapr.clients import DaprClient

dapr = DaprClient()

@app.post("/bindings/reminder-check")
async def send_reminders(event):
    """Dapr calls this via cron binding"""
    # Query tasks due soon
    upcoming_tasks = db.query("""
        SELECT * FROM tasks
        WHERE due_date >= NOW() AND due_date <= NOW() + INTERVAL '1 HOUR'
        AND reminder_sent = FALSE
    """)

    for task in upcoming_tasks:
        # Send notification (email, push, etc.)
        send_notification(task)

        # Mark reminder sent
        task.reminder_sent = True
        db.update(task)

        # Publish reminder event
        dapr.publish_event(
            pubsub_name="kafka-pubsub",
            topic_name="reminders",
            data={
                "task_id": task.id,
                "title": task.title,
                "due_at": task.due_date.isoformat()
            }
        )

    return {"status": "OK"}
```

### 5. CI/CD Pipeline (GitHub Actions)

**Workflow**: `.github/workflows/deploy-cloud.yml`

```yaml
name: Deploy to Cloud K8s

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io  # or azurecr.io, gcr.io
  IMAGE_NAME: todo-app

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Login to registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Build images
      run: |
        docker build -t ${{ env.REGISTRY }}/$IMAGE_NAME/frontend:${{ github.sha }} ./frontend
        docker build -t ${{ env.REGISTRY }}/$IMAGE_NAME/backend:${{ github.sha }} ./backend

    - name: Push images
      run: |
        docker push ${{ env.REGISTRY }}/$IMAGE_NAME/frontend:${{ github.sha }}
        docker push ${{ env.REGISTRY }}/$IMAGE_NAME/backend:${{ github.sha }}

    - name: Configure kubectl
      run: |
        # Setup kubectl for cloud provider
        az aks get-credentials --resource-group todo-rg --name todo-aks
        # or: gcloud container clusters get-credentials todo-gke

    - name: Deploy with Helm
      run: |
        helm upgrade --install todo-app ./helm/todo-app \
          --namespace todo-app \
          --values values-prod.yaml \
          --set image.tag=${{ github.sha }}

    - name: Verify deployment
      run: |
        kubectl rollout status deployment/todo-frontend -n todo-app
        kubectl rollout status deployment/todo-backend -n todo-app
```

### 6. Monitoring Stack

**Prometheus Deployment**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: config
          mountPath: /etc/prometheus
      volumes:
      - name: config
        configMap:
          name: prometheus-config
```

**Grafana Deployment**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:latest
        ports:
        - containerPort: 3000
```

## Data Flow

```
User Creates Task (with recurrence)
    ↓
Frontend → Backend (via Dapr Service Invocation)
    ↓
Backend saves to Database
    ↓
Backend publishes task-created event (via Dapr Pub/Sub)
    ↓
┌─────────────────────────────────────┐
│           Kafka Topics             │
│  ┌─────────────────────────────┐  │
│  │  task-events (created)    │  │
│  └─────────────────────────────┘  │
└─────────────────────────────────────┘
    ↓
         ┌────────────┴────────────┐
         │                         │
    ┌────▼─────┐          ┌────▼─────┐
    │ Recurring  │          │  Audit     │
    │ Task       │          │ Service   │
    │ Service   │          │           │
    └────────────┘          └────────────┘
    ↓
Auto-create next task occurrence
    ↓
Publish recurring-task-created event
```

## Cloud Provider Setup

### Azure (AKS)
```bash
# Create resource group
az group create --name todo-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group todo-rg \
  --name todo-aks \
  --node-count 1 \
  --node-vm-size Standard_DS2_v2 \
  --generate-ssh-keys

# Get credentials
az aks get-credentials \
  --resource-group todo-rg \
  --name todo-aks

# Create ACR
az acr create --resource-group todo-rg --name todoacr --sku Basic

# Login to ACR
az acr login --name todoacr
```

### Google Cloud (GKE)
```bash
# Create cluster
gcloud container clusters create todo-gke \
  --num-nodes=1 \
  --zone=us-central1-a \
  --machine-type=e2-medium

# Get credentials
gcloud container clusters get-credentials todo-gke \
  --zone=us-central1-a

# Create GCR
gcloud artifacts repositories create todo-repo --repository-format=docker

# Configure auth
gcloud auth configure-docker
```

### Oracle Cloud (OKE) - Recommended
```bash
# Create cluster
oci ce cluster create \
  --name todo-oke \
  --node-pool-shape "VM.Standard.E4.Flex" \
  --nsg-type "OCI_VCN_NATIVE"

# Get credentials
oci ce cluster create-kubeconfig \
  --cluster-id <cluster-id> \
  --file $HOME/.kube/config

# Login to OCR (Oracle Container Registry)
docker login <region-key>.ocir.io
```

## Project Structure

```
phase-5-cloud-deployment/
├── frontend/                    # Next.js + Dapr annotations
├── backend/                     # FastAPI + Dapr SDK
├── services/                     # New microservices
│   ├── recurring-task-service/
│   ├── notification-service/
│   └── audit-service/
├── helm/
│   └── todo-app/               # Enhanced Helm charts
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-prod.yaml
│       └── templates/
├── dapr/
│   └── components/              # Dapr component YAMLs
│       ├── pubsub-kafka.yaml
│       ├── state-postgres.yaml
│       ├── bindings-cron.yaml
│       └── secretstores-k8s.yaml
├── monitoring/                   # Prometheus + Grafana
│   ├── prometheus/
│   ├── grafana/
│   └── dashboards/
├── .github/
│   └── workflows/
│       └── deploy-cloud.yml     # CI/CD pipeline
├── k8s/                        # Kafka manifests
│   └── kafka/
│       ├── kafka-cluster.yaml
│       └── topics/
└── docs/
    ├── spec.md
    ├── plan.md                 # This file
    └── tasks.md
```

## Non-Functional Requirements

### Performance
- Event latency: < 100ms
- API response: < 500ms
- Dapr overhead: < 20ms
- Cron check interval: 5 minutes

### Scalability
- Kafka partitioning support
- Horizontal Pod Autoscaling
- Database connection pooling
- Load balancing

### Reliability
- Event replay capability (Kafka retention)
- Idempotent event processing
- Circuit breakers (Dapr)
- Graceful degradation

### Observability
- Prometheus metrics
- Grafana dashboards
- Loki logs
- Alertmanager alerts
- Distributed tracing (optional)

## Security Considerations

- Production TLS certificates
- Dapr mTLS for service-to-service
- Secrets in Kubernetes Secrets
- Network policies
- Pod security contexts

## Migration from Phase IV

### What Changes
- **Cluster**: Minikube → Cloud K8s (AKS/GKE/OKE)
- **Kafka**: None → Kafka + Dapr Pub/Sub
- **Services**: Add Recurring Task + Notification + Audit
- **Monitoring**: Add Prometheus + Grafana
- **CI/CD**: Add GitHub Actions pipeline
- **Advanced Features**: Add recurring tasks, reminders

### What Stays Same
- **Application**: Next.js + FastAPI unchanged
- **Helm Charts**: Enhanced but structure same
- **Dapr Components**: New components added
- **Monitoring**: New layer added

## Risk Analysis

### Risk 1: Kafka Complexity
**Likelihood**: Medium
**Impact**: Medium (operational overhead)
**Mitigation**:
- Start with managed Kafka (Redpanda Cloud)
- Document common issues
- Use Dapr to abstract complexity

### Risk 2: Dapr Learning Curve
**Likelihood**: High
**Impact**: Medium (time to learn)
**Mitigation**:
- Use simple Pub/Sub first
- Document all components
- Start with minimal feature set

### Risk 3: Cloud Costs
**Likelihood**: High
**Impact**: Medium (monthly bills)
**Mitigation**:
- Use OKE (free tier)
- Set resource limits
- Monitor usage
- Use free credits first

### Risk 4: Event Ordering
**Likelihood**: Medium
**Impact**: High (duplicate tasks)
**Mitigation**:
- Use Kafka partitioning
- Idempotent event processing
- Unique event IDs

## Success Criteria

- [ ] Cloud K8s cluster running
- [ ] Kafka cluster deployed
- [ ] Dapr components configured
- [ ] Recurring Task Service working
- [ ] Notification Service working
- [ ] All events flowing correctly
- [ ] Advanced features (recurring, reminders) working
- [ ] CI/CD pipeline automated
- [ ] Monitoring configured
- [ ] Application fully functional
- [ ] Demo video under 90 seconds
- [ ] Complete documentation

## Next Steps

1. Select cloud provider (recommend OKE for free tier)
2. Set up cloud K8s cluster
3. Deploy Kafka (use Redpanda Cloud for simplicity)
4. Configure Dapr components
5. Create microservices (recurring, notification)
6. Set up CI/CD pipeline
7. Configure monitoring
8. Deploy complete system
9. Test end-to-end
10. Create demo video

## Clarifications & Decisions

### CLR-001: Dapr Service Invocation Pattern
**Decision**: Frontend calls backend via Dapr HTTP sidecar port (3500)
**Rationale**: Built-in service discovery, automatic retries, mTLS security
**Implementation**:
```python
# Frontend (Node.js)
fetch('http://localhost:3500/v1.0/invoke/todo-backend/method/api/ziakhan/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'dapr-app-id': 'todo-frontend'
  }
})
```

### CLR-002: Event Publishing Strategy
**Decision**: Backend publishes to Kafka via Dapr Pub/Sub after database write
**Rationale**: Eventual consistency, database-first approach, simpler error handling
**Implementation**:
```python
# In task service
def create_task(task_data):
    # 1. Write to database
    task = db.create(task_data)

    # 2. Publish event via Dapr
    dapr_client.publish_event(
        pubsub_name="kafka-pubsub",
        topic_name="task-events",
        data={
            "event_type": "task_created",
            "task_id": task.id,
            "task_data": task.dict()
        }
    )

    return task
```

### CLR-003: CI/CD Deployment Stages
**Decision**: Build → Test → Push → Deploy (sequential stages)
**Rationale**: Catch issues early, prevent broken deployments, clear rollback point
**Implementation**:
```yaml
jobs:
  test:
    # Run tests first
  build:
    needs: test
    # Build images
  push:
    needs: build
    # Push to registry
  deploy:
    needs: push
    # Deploy to K8s
```

### CLR-004: Monitoring Stack Integration
**Decision**: ServiceMonitor for Prometheus, Grafana dashboards for visualization
**Rationale**: Standard K8s monitoring pattern, automated metric collection, beautiful dashboards
**Implementation**:
```yaml
# ServiceMonitor for backend
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: todo-backend
spec:
  selector:
    matchLabels:
      app: todo-backend
  endpoints:
  - port: http
```

### CLR-005: Horizontal Pod Autoscaler (HPA)
**Decision**: Enable HPA for both frontend and backend
**Rationale**: Auto-scaling based on load, cost optimization, production-ready
**Implementation**:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: todo-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: todo-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### CLR-006: Secret Management Strategy
**Decision**: Use Dapr Secret Store backed by K8s Secrets
**Rationale**: Centralized secrets, automatic injection, Dapr-native approach
**Implementation**:
```yaml
# Dapr secret store component
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kubernetes-secrets
spec:
  type: secretstores.kubernetes

# Access from code
secret = dapr_client.get_secret(
    store_name="kubernetes-secrets",
    key="database-url"
)
```
