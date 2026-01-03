---
name: kafka-dapr
description: Kafka event streaming & Dapr distributed runtime for Hackathon II Todo App. Use when implementing event-driven architecture, real-time sync, scheduled reminders, or state management. Includes: (1) Kafka topics, (2) Event producers/consumers, (3) Dapr components, (4) Pub/Sub patterns, (5) State management, (6) Service invocation
---

# Kafka + Dapr Integration

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│              KUBERNETES CLUSTER                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌──────────┐  │
│  │ Chat API    │   │ Recurring   │   │ Kafka    │  │
│  │ + Dapr      │──▶│ Task       │──▶│ Cluster  │  │
│  │ Sidecar     │   │ Service    │   │          │  │
│  └──────┬──────┘   └──────┬──────┘   └─────┬────┘  │
│         │                   │                 │          │
│         └─────────┬───────────┴─────────────────┘          │
│                   │                                   │         │
│                   ▼                                   ▼         │
│            ┌───────────────────────────────────────┐        │
│            │         DAPR COMPONENTS           │        │
│            │  ┌─────────────────────────────────┐ │        │
│            │  │ pubsub.kafka              │◀─┼───────┘  │
│            │  ├─────────────────────────────────┤ │            │
│            │  │ state.postgresql            │───┼────▶ Neon DB
│            │  ├─────────────────────────────────┤ │
│            │  │ scheduler.jobs-api        │   │ (Reminders)
│            │  ├─────────────────────────────────┤ │
│            │  │ secretstores.kubernetes     │   │
│            │  └─────────────────────────────────┘ │
│            └───────────────────────────────────────┘        │
└────────────────────────────────────────────────────────────┘
```

## Kafka Topics

### Topic: task-events

**Purpose:** Publish all task operations for audit, recurring tasks, real-time sync.

**Schema:**
```json
{
  "event_type": "created" | "updated" | "completed" | "deleted",
  "task_id": 123,
  "task_data": {
    "id": 123,
    "user_id": "ziakhan",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-01-03T10:30:00Z"
  },
  "user_id": "ziakhan",
  "timestamp": "2026-01-03T10:30:00Z"
}
```

### Topic: reminders

**Purpose:** Trigger notification for tasks with due dates.

**Schema:**
```json
{
  "task_id": 123,
  "title": "Call mom",
  "due_at": "2026-01-05T20:00:00Z",
  "remind_at": "2026-01-05T19:30:00Z",
  "user_id": "ziakhan",
  "notification_type": "email" | "push"
}
```

### Topic: task-updates

**Purpose:** Real-time sync across all connected clients (WebSocket).

**Schema:**
```json
{
  "task_id": 123,
  "event_type": "updated" | "completed" | "deleted",
  "task_data": { /* full task object */ },
  "user_id": "ziakhan",
  "timestamp": "2026-01-03T10:30:00Z"
}
```

## Dapr Components

### Component: kafka-pubsub (Kafka Pub/Sub)

```yaml
# dapr-components/kafka-pubsub.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
    - name: brokers
      value: "kafka:9092"
    - name: consumerGroup
      value: "todo-service"
    - name: autoCommit
      value: "false"
```

### Component: statestore (PostgreSQL)

```yaml
# dapr-components/statestore.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.postgresql
  version: v1
  metadata:
    - name: connectionString
      value: "host=neon.db port=5432 user=... password=... dbname=todo"
    - name: tableName
      value: "dapr_state"
```

### Component: scheduler (Jobs API)

```yaml
# dapr-components/scheduler.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: scheduler
spec:
  type: scheduler
  version: v1
  metadata:
    - name: scheduleInterval
      value: "PT1M"  # Check every minute
```

### Component: kubernetes-secrets

```yaml
# dapr-components/kubernetes-secrets.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kubernetes-secrets
spec:
  type: secretstores.kubernetes
  version: v1
```

## Event Publishing (Producers)

### Publish Task Event

```python
# app/api/tasks.py (enhanced)
import httpx
from datetime import datetime

async def publish_task_event(
    event_type: str,
    task_id: int,
    task_data: dict,
    user_id: str
):
    """Publish task event to Kafka via Dapr."""
    event = {
        "event_type": event_type,
        "task_id": task_id,
        "task_data": task_data,
        "user_id": user_id,
        "timestamp": datetime.utcnow().isoformat()
    }

    # Publish via Dapr sidecar
    async with httpx.AsyncClient() as client:
        await client.post(
            "http://localhost:3500/v1.0/publish/kafka-pubsub/task-events",
            json=event
        )

# Add to all CRUD operations
@router.post("")
async def create_task(...):
    # ... create task logic ...

    # Publish event
    await publish_task_event(
        event_type="created",
        task_id=db_task.id,
        task_data=db_task.dict(),
        user_id=user_id
    )

    return db_task

@router.patch("/{task_id}/complete")
async def toggle_complete(...):
    # ... toggle logic ...

    await publish_task_event(
        event_type="completed" if task.completed else "updated",
        task_id=task.id,
        task_data=task.dict(),
        user_id=user_id
    )

    return task
```

### Publish Reminder

```python
# app/api/reminders.py
async def schedule_reminder(
    task_id: int,
    title: str,
    due_at: datetime,
    user_id: str
):
    """Schedule reminder using Dapr Jobs API."""
    remind_at = due_at - timedelta(minutes=30)  # 30 min before due

    job_data = {
        "task_id": task_id,
        "title": title,
        "due_at": due_at.isoformat(),
        "remind_at": remind_at.isoformat(),
        "user_id": user_id,
        "type": "reminder"
    }

    async with httpx.AsyncClient() as client:
        # Create scheduled job
        await client.post(
            f"http://localhost:3500/v1.0-alpha1/jobs/reminder-task-{task_id}",
            json={
                "dueTime": remind_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "data": job_data
            }
        )
```

## Event Consumption (Consumers)

### Recurring Task Consumer

```python
# consumers/recurring_task_service.py
from fastapi import FastAPI, BackgroundTasks
import httpx

app = FastAPI()

@app.on_event("startup")
async def subscribe_to_task_events():
    """Subscribe to task-events topic on startup."""
    print("Subscribing to task-events...")

# Consumer endpoint
@app.post("/api/jobs/trigger")
async def handle_job_trigger(request):
    """Dapr calls this when scheduled job fires."""
    job_data = await request.json()

    if job_data.get("data", {}).get("type") == "reminder":
        # Send notification
        await send_notification(job_data["data"])

    return {"status": "SUCCESS"}

async def send_notification(reminder_data: dict):
    """Send notification (email/push)."""
    # TODO: Implement email/Push notification
    print(f"Notification sent: {reminder_data['title']}")

async def create_next_recurring_task(reminder_data: dict):
    """Create next occurrence of recurring task."""
    task_id = reminder_data["task_id"]
    user_id = reminder_data["user_id"]

    # TODO: Query task DB, create new task
    # Use same title, new due date (+7 days, etc.)
    print(f"Creating recurring task from {task_id}")
```

### WebSocket Service (Real-time Sync)

```python
# consumers/websocket_service.py
from fastapi import WebSocket, WebSocketDisconnect
import json

connected_clients = {}

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for real-time updates."""
    await websocket.accept()
    connected_clients[user_id] = websocket

    try:
        while True:
            # Wait for messages (if needed)
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        del connected_clients[user_id]

async def broadcast_task_update(user_id: str, task_update: dict):
    """Broadcast task update to all connected clients."""
    if user_id in connected_clients:
        await connected_clients[user_id].send_json(task_update)

# Subscribe to task-updates topic and broadcast
@app.post("/api/consume/task-updates")
async def handle_task_updates(request):
    """Consume task-updates and broadcast via WebSocket."""
    update = await request.json()
    user_id = update.get("user_id")

    await broadcast_task_update(user_id, update)
    return {"status": "ACK"}
```

## State Management with Dapr

### Save Conversation State

```python
# app/api/chat.py (enhanced)
import httpx

async def save_conversation_state(
    conversation_id: int,
    messages: list
):
    """Save conversation state via Dapr."""
    state = {
        "conversation_id": conversation_id,
        "messages": messages
    }

    async with httpx.AsyncClient() as client:
        await client.post(
            f"http://localhost:3500/v1.0/state/statestore/conversation-{conversation_id}",
            json=state
        )

async def get_conversation_state(conversation_id: int) -> list:
    """Get conversation state from Dapr."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://localhost:3500/v1.0/state/statestore/conversation-{conversation_id}"
        )

    if response.status_code == 200:
        data = response.json()
        return data.get("messages", [])

    return []
```

## Service Invocation

### Frontend → Backend via Dapr

```typescript
// lib/dapr-api.ts (frontend)
export async function invokeBackend(
  endpoint: string,
  data?: any
) {
  // Use Dapr service invocation (built-in retries, discovery)
  const response = await fetch(
    `http://localhost:3500/v1.0/invoke/todo-backend-service/method/${endpoint}`,
    {
      method: data ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    }
  )

  return response.json()
}

// Example: Get tasks
export async function getTasksWithDapr(userId: string) {
  return invokeBackend(`/api/${userId}/tasks`)
}
```

## Deployment

### Install Dapr on Kubernetes

```bash
# Install Dapr CLI
wget -qO- https://raw.githubusercontent.com/dapr/cli/master/install/install.sh
chmod +x ./install.sh
./install.sh

# Initialize Dapr on Kubernetes
dapr init --kubernetes --runtime-version=1.12.0

# Verify
kubectl get pods -n dapr-system
```

### Deploy Dapr Components

```bash
kubectl apply -f dapr-components/kafka-pubsub.yaml
kubectl apply -f dapr-components/statestore.yaml
kubectl apply -f dapr-components/scheduler.yaml
kubectl apply -f dapr-components/kubernetes-secrets.yaml

# Verify components
kubectl get components -n dapr-system
```

### Run App with Dapr Sidecar

```yaml
# k8s/deployments/backend-dapr.yaml
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
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "todo-backend"
        dapr.io/app-port: "8000"
    spec:
      containers:
      - name: todo-backend
        image: todo-backend:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 8000
        env:
        - name: DAPR_HTTP_PORT
          value: "3500"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: todo-secrets
              key: database-url
```

## Local Development (Minikube)

### Run Kafka with Docker

```bash
# docker-compose.kafka.yml
version: '3.8'

services:
  kafka:
    image: redpandadata/redpanda:v24.1.0
    ports:
      - "9092:9092"
      - "9093:9093"
    command:
      - redpanda start
      - --smp 1024
      - --overprovisioned 1
      - --kafka-addr PLAINTEXT://0.0.0.0:9092

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    ports:
      - "8080:8080"
    environment:
      - KAFKA_CLUSTERS_0=PLANT_KAFKA_0
      - KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka:9092

# Start
docker-compose -f docker-compose.kafka.yml up -d
```

### Run Dapr with App

```bash
# Backend
dapr run \
  --app-id todo-backend \
  --app-port 8000 \
  --dapr-http-port 3500 \
  --components-path ./dapr-components \
  uvicorn app.main:app

# Frontend
dapr run \
  --app-id todo-frontend \
  --app-port 3000 \
  --dapr-http-port 3501 \
  npm run dev
```

## Quick Reference

| Task | Dapr HTTP Endpoint |
|------|-------------------|
| Publish event | `POST /v1.0/publish/{pubsub-name}/{topic}` |
| Subscribe to topic | App config (server-side) |
| Save state | `POST /v1.0/state/{store-name}/{key}` |
| Get state | `GET /v1.0/state/{store-name}/{key}` |
| Delete state | `DELETE /v1.0/state/{store-name}/{key}` |
| Invoke service | `POST /v1.0/invoke/{app-id}/method/{endpoint}` |
| Schedule job | `POST /v1.0-alpha1/jobs/{job-name}` |

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|--------|----------|
| Consumer not receiving | Wrong topic name | Verify topic matches Dapr component config |
| State not saving | Component not loaded | Check `kubectl get components` |
| Dapr sidecar crash | Missing env vars | Set `DAPR_HTTP_PORT` |
| Job not firing | Wrong dueTime format | Use ISO 8601 format |
| High latency | Too many events | Batch events, increase consumer group size |
| State conflicts | Race conditions | Use optimistic locking |

## Best Practices

1. **Use Dapr for infrastructure abstraction** - Don't use Kafka client directly
2. **Event schema versioning** - Add version field to events
3. **Idempotent consumers** - Handle duplicate events gracefully
4. **State + Database hybrid** - Dapr for cache, DB for persistence
5. **Monitor consumer lag** - Check Kafka consumer group offsets
6. **Use dead-letter queues** - Route failed events for retry
7. **Circuit breakers** - Protect downstream services
8. **Observability** - Log all event publishes/consumptions
9. **Graceful shutdown** - Drain in-flight events before stopping
10. **Security** - Use Kubernetes secrets, never commit credentials

## Architecture Benefits

| Without Dapr | With Dapr |
|--------------|-----------|
| Import kafka-python | HTTP calls to Dapr |
| Hardcoded Kafka brokers | Dapr components (YAML config) |
| Manual retry logic | Built-in retries, circuit breakers |
| Service URLs hardcoded | Automatic service discovery |
| Secrets in env vars | Secure secret store integration |
| Vendor lock-in | Swap Kafka for RabbitMQ with config change |

## Event Flow Examples

### Task Creation Flow

1. User creates task via chat
2. Agent calls `add_task` MCP tool
3. Task saved to DB
4. Event published to `task-events` topic
5. Real-time sync consumers update all connected clients
6. Audit consumer logs event

### Reminder Flow

1. Task with due date created
2. Reminder scheduled via Dapr Jobs API
3. At `remind_at` time, Dapr triggers callback
4. Consumer sends notification (email/push)
5. If recurring, consumer creates next occurrence

### Real-time Sync Flow

1. Task updated by any client
2. Event published to `task-updates` topic
3. WebSocket consumer receives event
4. Broadcast to all connected clients
5. All clients update UI immediately
