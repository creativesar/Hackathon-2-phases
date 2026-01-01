# Phase V: Advanced Cloud Deployment - Tasks

## Task Breakdown

| ID | Description | Dependencies | Status |
|-----|-------------|----------------|---------|
| T-501 | Choose cloud provider (AKS/GKE/OKE) | None | Pending |
| T-502 | Set up cloud K8s cluster | T-501 | Pending |
| T-503 | Set up container registry | T-502 | Pending |
| T-504 | Update Task model for advanced features | None | Pending |
| T-505 | Create Recurrence model | T-504 | Pending |
| T-506 | Create database migration script | T-504, T-505 | Pending |
| T-507 | Deploy Kafka cluster | T-502 | Pending |
| T-508 | Create Kafka topics | T-507 | Pending |
| T-509 | Create Dapr Pub/Sub component | T-507 | Pending |
| T-510 | Create Dapr State component | T-502 | Pending |
| T-511 | Create Dapr Bindings component | T-502 | Pending |
| T-512 | Create Dapr Secrets component | T-502 | Pending |
| T-513 | Create Recurring Task Service | T-505, T-509 | Pending |
| T-514 | Create Notification Service | T-511 | Pending |
| T-515 | Update backend for event publishing | T-507, T-509 | Pending |
| T-516 | Update backend for advanced features | T-506 | Pending |
| T-517 | Add Dapr sidecars to deployments | T-509-T-512 | Pending |
| T-518 | Deploy enhanced Helm charts | T-517 | Pending |
| T-519 | Create CI/CD pipeline (GitHub Actions) | T-503 | Pending |
| T-520 | Deploy monitoring stack (Prometheus) | T-502 | Pending |
| T-521 | Deploy monitoring stack (Grafana) | T-520 | Pending |
| T-522 | Create Grafana dashboards | T-521 | Pending |
| T-523 | Configure alerting rules | T-522 | Pending |
| T-524 | Update frontend for advanced features | T-516 | Pending |
| T-525 | Deploy to cloud K8s | T-518, T-519 | Pending |
| T-526 | Test event-driven architecture | T-525 | Pending |
| T-527 | Test recurring tasks | T-525 | Pending |
| T-528 | Test reminders | T-525 | Pending |
| T-529 | Test monitoring and alerting | T-522 | Pending |
| T-530 | End-to-end system testing | T-529 | Pending |
| T-531 | Create runbook | T-530 | Pending |
| T-532 | Create comprehensive README | T-531 | Pending |
| T-533 | Record demo video | T-532 | Pending |

---

## Detailed Tasks

### T-501: Choose cloud provider (AKS/GKE/OKE)

**Priority**: High
**Related Spec**: Cloud K8s

**Steps**:
1. Evaluate providers:
   - AKS: $200 for 30 days
   - GKE: $300 for 90 days
   - OKE: 4 OCPUs, 24GB RAM - always free (recommended)
2. Consider factors: cost, complexity, free tier
3. Document decision rationale
4. Select provider
5. Create provider-specific setup notes

**Outputs**: Cloud provider selected

---

### T-502: Set up cloud K8s cluster

**Priority**: High
**Related Spec**: Cloud Deployment

**Steps** (depending on provider):

**AKS**:
```bash
az login
az group create --name todo-rg --location eastus
az aks create --resource-group todo-rg --name todo-aks --node-count 1
az aks get-credentials --resource-group todo-rg --name todo-aks
```

**GKE**:
```bash
gcloud auth login
gcloud container clusters create todo-gke --num-nodes=1 --zone=us-central1-a
gcloud container clusters get-credentials todo-gke
```

**OKE** (recommended - always free):
```bash
oci ce cluster create --name todo-oke --node-pool-shape "VM.Standard.E4.Flex"
oci ce cluster create-kubeconfig --cluster-id <cluster-id>
```

**Outputs**: Cloud K8s cluster running, kubectl configured

---

### T-503: Set up container registry

**Priority**: High
**Related Spec**: Container Registry

**Steps** (depending on provider):

**AKS (ACR)**:
```bash
az acr create --resource-group todo-rg --name todoacr --sku Basic
az acr login --name todoacr
```

**GKE (GCR)**:
```bash
gcloud artifacts repositories create todo-repo --repository-format=docker
gcloud auth configure-docker
```

**Docker Hub** (universal):
```bash
docker login
# Use existing Docker Hub account
```

**Outputs**: Container registry configured, ready for image push

---

### T-504: Update Task model for advanced features

**Priority**: High
**Related Spec**: FR-4, FR-5

**Steps**:
1. Navigate to `backend/app/models.py`
2. Add `due_date` field to Task model:
   ```python
   due_date: datetime | None = Field(default=None)
   ```
3. Add `recurrence` field to Task model:
   ```python
   recurrence: str | None = Field(default=None)  # "daily", "weekly", "monthly"
   ```
4. Add `reminder_sent` field:
   ```python
   reminder_sent: bool = Field(default=False)
   ```
5. Update database migration script
6. Test model changes

**Outputs**: Task model enhanced

---

### T-505: Create Recurrence model

**Priority**: High
**Related Spec**: FR-4

**Steps**:
1. Create `TaskRecurrence` model in `backend/app/models.py`:
   ```python
   class TaskRecurrence(SQLModel, table=True):
       id: int | None = Field(default=None, primary_key=True)
       task_id: int = Field(foreign_key="task.id")
       recurrence_type: str  # "daily", "weekly", "monthly"
       next_due_date: datetime
       last_created_at: datetime
   ```
2. Add relationship to Task model
3. Create migration script

**Outputs**: Recurrence model created

---

### T-506: Create database migration script

**Priority**: High
**Related Spec**: Database Integration

**Steps**:
1. Create `backend/migrations/` directory
2. Create migration file: `backend/migrations/001_add_advanced_fields.py`
3. Add SQL to add new fields:
   ```sql
   ALTER TABLE tasks ADD COLUMN due_date TIMESTAMP;
   ALTER TABLE tasks ADD COLUMN recurrence VARCHAR(20);
   ALTER TABLE tasks ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE;
   CREATE TABLE task_recurrences (...);
   ```
4. Create rollback script
5. Test migration on copy of database

**Outputs**: Migration scripts created

---

### T-507: Deploy Kafka cluster

**Priority**: High
**Related Spec**: Kafka Event Streaming

**Options**:

**Option A: Self-hosted (Strimzi on K8s)** - Recommended
1. Install Strimzi operator
2. Create Kafka cluster manifest
3. Apply to K8s
4. Wait for Kafka to be ready

**Option B: Redpanda Cloud (Free Tier)**
1. Sign up at redpanda.com/cloud
2. Create serverless cluster
3. Create topics
4. Get bootstrap server URL

**Steps** (Self-hosted):
```bash
# Install Strimzi
kubectl apply -f https://strimzi.io/install/latest?namespace=kafka

# Create Kafka cluster
kubectl apply -f k8s/kafka/kafka-cluster.yaml

# Verify
kubectl get pods -n kafka
```

**Outputs**: Kafka cluster running

---

### T-508: Create Kafka topics

**Priority**: High
**Related Spec**: Kafka Topics

**Steps**:
1. Create topic manifest: `k8s/kafka/topics/task-events.yaml`
2. Create topics for:
   - task-events
   - reminders
   - task-updates
3. Set partitions: 3 for task-events
4. Apply to K8s
5. Verify topics created

**Outputs**: Kafka topics created

---

### T-509: Create Dapr Pub/Sub component

**Priority**: High
**Related Spec**: Dapr Integration

**Steps**:
1. Create `dapr/components/pubsub-kafka.yaml`:
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
   ```
2. Apply to K8s: `kubectl apply -f dapr/components/pubsub-kafka.yaml`
3. Verify component created

**Outputs**: Dapr Pub/Sub component configured

---

### T-510: Create Dapr State component

**Priority**: Medium
**Related Spec**: Dapr Integration

**Steps**:
1. Create `dapr/components/state-postgres.yaml`:
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
2. Apply to K8s
3. Verify component created

**Outputs**: Dapr State component configured

---

### T-511: Create Dapr Bindings component

**Priority**: Medium
**Related Spec**: Dapr Integration

**Steps**:
1. Create `dapr/components/bindings-cron.yaml`:
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
2. Apply to K8s
3. Verify component created

**Outputs**: Dapr Bindings component configured

---

### T-512: Create Dapr Secrets component

**Priority**: Medium
**Related Spec**: Dapr Integration

**Steps**:
1. Create `dapr/components/secretstores-k8s.yaml`:
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
2. Apply to K8s
3. Verify component created

**Outputs**: Dapr Secrets component configured

---

### T-513: Create Recurring Task Service

**Priority**: High
**Related Spec**: Recurring Tasks

**Steps**:
1. Create directory: `services/recurring-task-service/`
2. Create `main.py` with FastAPI
3. Implement Dapr consumer:
   ```python
   from dapr.clients import DaprClient
   dapr = DaprClient()

   @app.post("/bindings/reminder-check")
   async def check_tasks():
       # Query tasks due soon
       # For recurring tasks, create next occurrence
       # Publish to Kafka
   ```
4. Add Dapr annotations to deployment
5. Create Helm chart for service
6. Deploy to K8s

**Outputs**: Recurring Task Service deployed

---

### T-514: Create Notification Service

**Priority**: High
**Related Spec**: Due Dates & Reminders

**Steps**:
1. Create directory: `services/notification-service/`
2. Create `main.py` with FastAPI
3. Implement Dapr consumer:
   ```python
   from dapr.clients import DaprClient
   dapr = DaprClient()

   @app.post("/bindings/reminder-check")
   async def send_notifications():
       # Consume reminder events from Kafka
       # Send notifications (email, push, etc.)
       # Mark as sent
   ```
4. Implement notification channels (email, browser push)
5. Add Dapr annotations to deployment
6. Create Helm chart
7. Deploy to K8s

**Outputs**: Notification Service deployed

---

### T-515: Update backend for event publishing

**Priority**: High
**Related Spec**: Event-Driven Architecture

**Steps**:
1. Add Dapr SDK to backend: `uv add dapr`
2. Import DaprClient: `from dapr.clients import DaprClient`
3. Initialize Dapr client: `dapr = DaprClient()`
4. Update task creation endpoint to publish event:
   ```python
   dapr.publish_event(
       pubsub_name="kafka-pubsub",
       topic_name="task-events",
       data={"event_type": "created", "task_id": task.id, ...}
   )
   ```
5. Update other CRUD endpoints to publish events
6. Test event publishing

**Outputs**: Backend publishes events to Kafka

---

### T-516: Update backend for advanced features

**Priority**: High
**Related Spec**: FR-4, FR-5

**Steps**:
1. Update API endpoints for due dates:
   - Add due_date field to POST /tasks
   - Add recurrence field to POST /tasks
2. Update task listing to filter by due date
3. Update task listing to show due dates in UI
4. Test advanced features

**Outputs**: Backend supports advanced features

---

### T-517: Add Dapr sidecars to deployments

**Priority**: High
**Related Spec**: Dapr Integration

**Steps**:
1. Update Helm templates for frontend:
   ```yaml
   annotations:
     dapr.io/enabled: "true"
     dapr.io/app-id: "todo-frontend"
   ```
2. Update Helm templates for backend:
   ```yaml
   annotations:
     dapr.io/enabled: "true"
     dapr.io/app-id: "todo-backend"
     dapr.io/app-port: "8000"
   ```
3. Update Helm templates for microservices
4. Deploy updated charts

**Outputs**: Dapr sidecars added to all pods

---

### T-518: Deploy enhanced Helm charts

**Priority**: High
**Related Spec**: Cloud Deployment

**Steps**:
1. Update `helm/todo-app/Chart.yaml` to version 2.0.0
2. Update `helm/todo-app/values.yaml` with new config
3. Add microservice deployments to chart
4. Add Dapr annotations to all templates
5. Update resource limits
6. Deploy: `helm upgrade todo-app ./helm/todo-app --values values-prod.yaml`

**Outputs**: Enhanced application deployed

---

### T-519: Create CI/CD pipeline (GitHub Actions)

**Priority**: High
**Related Spec**: CI/CD Pipeline

**Steps**:
1. Create `.github/workflows/deploy-cloud.yml`
2. Add checkout step
3. Add build step (frontend + backend images)
4. Add login to registry step
5. Add push images step
6. Add configure kubectl step
7. Add Helm deploy step
8. Add verify deployment step
9. Add rollback on failure
10. Test pipeline locally with act

**Outputs**: CI/CD pipeline created

---

### T-520: Deploy monitoring stack (Prometheus)

**Priority**: Medium
**Related Spec**: Monitoring

**Steps**:
1. Create `monitoring/prometheus/` directory
2. Create Prometheus Deployment manifest
3. Create Prometheus Service
4. Create Prometheus ConfigMap
5. Add Dapr annotations for metrics
6. Deploy to K8s
7. Verify Prometheus running

**Outputs**: Prometheus deployed

---

### T-521: Deploy monitoring stack (Grafana)

**Priority**: Medium
**Related Spec**: Monitoring

**Steps**:
1. Create `monitoring/grafana/` directory
2. Create Grafana Deployment manifest
3. Create Grafana Service
4. Create Grafana ConfigMap
5. Expose Grafana via Ingress
6. Deploy to K8s
7. Verify Grafana running

**Outputs**: Grafana deployed

---

### T-522: Create Grafana dashboards

**Priority**: Medium
**Related Spec**: Monitoring

**Steps**:
1. Create dashboard for task operations:
   - Tasks created/updated/deleted over time
   - Active recurring tasks
   - Due date distribution
2. Create dashboard for system health:
   - Pod status
   - CPU/memory usage
   - Kafka lag
   - Dapr health
3. Export dashboards as JSON
4. Import into Grafana

**Outputs**: Monitoring dashboards created

---

### T-523: Configure alerting rules

**Priority**: Medium
**Related Spec**: Monitoring

**Steps**:
1. Create Alertmanager ConfigMap
2. Define alert rules:
   - High error rate
   - Pods not ready
   - Kafka consumer lag
   - Database connection issues
3. Configure notification channels (email, Slack)
4. Deploy Alertmanager
5. Test alerts

**Outputs**: Alerting configured

---

### T-524: Update frontend for advanced features

**Priority**: High
**Related Spec**: FR-4, FR-5

**Steps**:
1. Update TaskForm component to add due date picker
2. Update TaskForm component to add recurrence selector
3. Update TaskList component to show due dates
4. Add visual indicators for recurring tasks
5. Add reminder settings UI
6. Test UI changes

**Outputs**: Frontend supports advanced features

---

### T-525: Deploy to cloud K8s

**Priority**: High
**Related Spec**: Cloud Deployment

**Steps**:
1. Push images to registry
2. Configure kubectl for cloud provider
3. Deploy Helm chart: `helm install todo-app ./helm/todo-app --values values-prod.yaml`
4. Configure Ingress for domain
5. Configure TLS certificate
6. Verify all pods running
7. Verify application accessible
8. Run health checks

**Outputs**: Application deployed to cloud

---

### T-526: Test event-driven architecture

**Priority**: High
**Related Spec**: Event-Driven Architecture

**Steps**:
1. Create task via chatbot
2. Verify task-created event published to Kafka
3. Check consumer logs
4. Verify Recurring Task Service receives event
5. Verify Audit Service receives event
6. Test event ordering
7. Test event replay capability

**Outputs**: Event flow verified

---

### T-527: Test recurring tasks

**Priority**: High
**Related Spec**: Recurring Tasks

**Steps**:
1. Create daily recurring task via chatbot
2. Complete task via chatbot
3. Wait for next occurrence (or simulate)
4. Verify next task auto-created
5. Check recurrence history
6. Test weekly recurrence
7. Test monthly recurrence

**Outputs**: Recurring tasks working

---

### T-528: Test reminders

**Priority**: High
**Related Spec**: Due Dates & Reminders

**Steps**:
1. Create task with due date (tomorrow)
2. Set reminder for 1 hour before
3. Monitor Notification Service logs
4. Verify reminder sent
5. Check task reminder_sent flag
6. Test multiple reminders

**Outputs**: Reminders working

---

### T-529: Test monitoring and alerting

**Priority**: Medium
**Related Spec**: Monitoring

**Steps**:
1. Generate test load
2. Verify Prometheus collecting metrics
3. Check Grafana dashboards
4. Trigger alert conditions
5. Verify alerts received
6. Test alert recovery

**Outputs**: Monitoring verified

---

### T-530: End-to-end system testing

**Priority**: High
**Related Spec**: All requirements

**Steps**:
1. Test complete user journey:
   - Register/login
   - Create tasks (including recurring)
   - Chat with bot
   - Set due dates
   - Wait for reminders
2. Test scalability:
   - Scale pods
   - Monitor performance
3. Test fault tolerance:
   - Kill a pod
   - Verify auto-restart
4. Test rollback:
   - Deploy previous version
   - Verify rollback works
5. Document test results

**Outputs**: System fully tested

---

### T-531: Create runbook

**Priority**: Medium
**Related Spec**: Operational Readiness

**Steps**:
1. Create `docs/runbook.md`
2. Document common operations:
   - How to scale pods
   - How to check logs
   - How to restart services
   - How to rollback deployment
   - How to handle Kafka issues
   - How to debug Dapr issues
3. Document escalation procedures
4. Add contact information

**Outputs**: Runbook created

---

### T-532: Create comprehensive README

**Priority**: Medium
**Related Spec**: Success Criteria

**Steps**:
1. Create `phase-5-cloud-deployment/README.md`
2. Include sections:
   - Project overview
   - Architecture diagram
   - Prerequisites (cloud account, tools)
   - Setup instructions for each provider
   - Deployment guide
   - Monitoring guide
   - Troubleshooting guide
   - Runbook reference
3. Add diagrams (ASCII or reference to external images)
4. Document environment variables
5. Add FAQ section

**Outputs**: Complete README

---

### T-533: Record demo video

**Priority**: High
**Related Spec**: Demo Requirements

**Steps**:
1. Plan video script (under 90 seconds):
   - Cloud cluster setup (10s)
   - Kafka + Dapr integration (15s)
   - Recurring tasks demo (15s)
   - Reminders demo (10s)
   - Monitoring demo (10s)
   - Chatbot with advanced features (20s)
2. Record demo (use OBS, Loom, or similar)
3. Keep under 90 seconds
4. Show production URL
5. Show monitoring dashboards
6. Upload to YouTube or similar
7. Add link to submission form

**Outputs**: Demo video ready

---

## Task Dependencies

```
T-501 (Choose Provider)
  └─→ T-502 (Set up Cluster)
        ├─→ T-503 (Container Registry)
        │     └─→ T-519 (CI/CD Pipeline)
        ├─→ T-504 (Update Task Model)
        │     └─→ T-505 (Recurrence Model)
        │           └─→ T-506 (Migration Script)
        │                 └─→ T-516 (Backend Advanced)
        ├─→ T-507 (Kafka)
        │     └─→ T-508 (Topics)
        │           └─→ T-509 (Dapr Pub/Sub)
        ├─→ T-510 (Dapr State)
        ├─→ T-511 (Dapr Bindings)
        ├─→ T-512 (Dapr Secrets)
        └─→ T-517 (Dapr Sidecars)
                  └─→ T-518 (Deploy Helm)
                        └─→ T-525 (Deploy to Cloud)
T-513 (Recurring Service)
  └─→ T-515 (Backend Events)
T-514 (Notification Service)
  └─→ T-517 (Dapr Sidecars)
T-520 (Prometheus)
  └─→ T-522 (Dashboards)
        └─→ T-523 (Alerts)
T-521 (Grafana)
  └─→ T-524 (Frontend Advanced)
T-525 (Deploy Cloud)
  ├─→ T-526 (Test Events)
  ├─→ T-527 (Test Recurring)
  ├─→ T-528 (Test Reminders)
  ├─→ T-529 (Test Monitoring)
  └─→ T-530 (E2E Testing)
        └─→ T-531 (Runbook)
              └─→ T-532 (README)
                    └─→ T-533 (Demo Video)
```

## Progress Checklist

- [ ] Cloud provider selected
- [ ] K8s cluster running
- [ ] Container registry configured
- [ ] Kafka cluster deployed
- [ ] All Kafka topics created
- [ ] All Dapr components configured
- [ ] Database migration applied
- [ ] Recurring Task Service deployed
- [ ] Notification Service deployed
- [ ] Backend publishes events
- [ ] Dapr sidecars added
- [ ] Application deployed
- [ ] CI/CD pipeline working
- [ ] Monitoring stack deployed
- [ ] Dashboards configured
- [ ] Alerting configured
- [ ] Advanced features working
- [ ] End-to-end tested
- [ ] Runbook created
- [ ] Documentation complete
- [ ] Demo video recorded

## Time Estimates

| Task | Est. Time | Actual Time | Status |
|-------|-----------|--------------|---------|
| T-501 | 15 min | - | Pending |
| T-502 | 30 min | - | Pending |
| T-503 | 20 min | - | Pending |
| T-504 | 20 min | - | Pending |
| T-505 | 15 min | - | Pending |
| T-506 | 30 min | - | Pending |
| T-507 | 30 min | - | Pending |
| T-508 | 10 min | - | Pending |
| T-509 | 15 min | - | Pending |
| T-510 | 15 min | - | Pending |
| T-511 | 15 min | - | Pending |
| T-512 | 10 min | - | Pending |
| T-513 | 45 min | - | Pending |
| T-514 | 45 min | - | Pending |
| T-515 | 30 min | - | Pending |
| T-516 | 30 min | - | Pending |
| T-517 | 20 min | - | Pending |
| T-518 | 20 min | - | Pending |
| T-519 | 30 min | - | Pending |
| T-520 | 30 min | - | Pending |
| T-521 | 30 min | - | Pending |
| T-522 | 45 min | - | Pending |
| T-523 | 30 min | - | Pending |
| T-524 | 60 min | - | Pending |
| T-525 | 30 min | - | Pending |
| T-526 | 30 min | - | Pending |
| T-527 | 30 min | - | Pending |
| T-528 | 30 min | - | Pending |
| T-529 | 20 min | - | Pending |
| T-530 | 60 min | - | Pending |
| T-531 | 45 min | - | Pending |
| T-532 | 30 min | - | Pending |
| T-533 | 30 min | - | Pending |
| **Total** | **~12 hours** | - | |

## Notes

- This is the final phase
- Focus on production-grade deployment
- Test event-driven architecture thoroughly
- Document all operational procedures
- Prepare for presentation and judging
- Demo video MUST be under 90 seconds
- Recommend OKE (Oracle Cloud) for free tier
