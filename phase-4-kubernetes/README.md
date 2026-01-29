# Phase IV: Local Kubernetes Deployment

## Overview

This phase deploys the Todo Chatbot application on a local Kubernetes cluster using Minikube, Helm Charts, and AIOps tools (kubectl-ai, kagent, Gordon).

**Points**: 250 | **Due Date**: Jan 4, 2026

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  Minikube Kubernetes Cluster               │
│                                                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               Namespace: todo-app                      │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         Frontend Deployment (Next.js)         │  │  │
│  │  │  ┌─────────────────────────────────────────┐  │  │  │
│  │  │  │  - Replicas: 2                         │  │  │  │
│  │  │  │  - Image: creativesar/todo_frontend:latest      │  │  │
│  │  │  │  - Port: 3000                        │  │  │  │
│  │  │  │  - Env: NEXT_PUBLIC_API_URL          │  │  │  │
│  │  │  └─────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │           ▲                                          │   │
│  │           │ Service (ClusterIP)                       │   │
│  │           │                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │         Backend Deployment (FastAPI)          │  │  │
│  │  │  ┌─────────────────────────────────────────┐  │  │  │
│  │  │  │  - Replicas: 2                         │  │  │  │
│  │  │  │  - Image: creativesar/todo_backend:latest        │  │  │
│  │  │  │  - Port: 8000                        │  │  │  │
│  │  │  │  - Env: DATABASE_URL, BETTER_AUTH_SECRET     │  │  │
│  │  │  │  - Secrets: NEON_CONNECTION_STRING     │  │  │  │
│  │  │  └─────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │         Ingress Controller                   │  │  │  │
│  │  │  ┌─────────────────────────────────────────┐  │  │  │
│  │  │  │  - Host: todo.local                │  │  │  │
│  │  │  │  - TLS: Self-signed cert            │  │  │  │
│  │  │  │  - Routes: /, /api              │  │  │  │
│  │  │  └─────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │         ConfigMaps                            │  │  │  │
│  │  │  - frontend-config                         │  │  │  │
│  │  │  - backend-config                          │  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │         Secrets                                │  │  │  │
│  │  │  - database-url                           │  │  │  │
│  │  │  - jwt-secret                             │  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
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

## Prerequisites

- Docker Desktop with Docker AI (Gordon) enabled
- Minikube
- kubectl
- Helm
- kubectl-ai (npm install -g kubectl-ai)
- kagent (npm install -g @kagent-dev/kagent)

## Installation Steps

### 1. Start Minikube
```bash
minikube start --cpus=4 --memory=4096
minikube addons enable ingress
```

### 2. Build Docker Images
```bash
# Navigate to frontend directory
cd frontend
docker build -t creativesar/todo_frontend:latest .

# Navigate to backend directory
cd ../backend
docker build -t creativesar/todo_backend:latest .

# Load images into minikube
minikube image load creativesar/todo_frontend:latest
minikube image load creativesar/todo_backend:latest
```

### 3. Deploy with Helm
```bash
# Navigate to helm chart directory
cd kubernetes/helm/todo-app

# Install the chart
helm install todo-app . \
  --namespace todo-app \
  --values values-dev.yaml \
  --create-namespace
```

### 4. Configure Local DNS
```bash
# Get minikube IP
minikube ip

# Add to /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
echo "<MINIKUBE_IP> todo.local" | sudo tee -a /etc/hosts
```

## AIOps Commands Examples

### kubectl-ai
```bash
# Deploy and scale
kubectl-ai "Deploy the todo frontend with 2 replicas"
kubectl-ai "Scale the backend to handle more load"
kubectl-ai "Show me the backend logs from the last 5 minutes"

# Health checks
kubectl-ai "Analyze the cluster health and resource usage"
kubectl-ai "Check why the pods are failing"
```

### kagent
```bash
# Health and optimization
kagent "analyze the cluster health"
kagent "optimize resource allocation for the todo app"
kagent "investigate why the backend pods are crashing"
```

### Gordon (Docker AI)
```bash
# Image operations
docker ai "Build optimized Docker images for frontend and backend"
docker ai "Analyze frontend Docker image for security vulnerabilities"
docker ai "Optimize Docker layer caching for faster builds"
```

## How to Access Application

Once DNS is configured, access the application at:
- Frontend: http://todo.local
- Backend API: http://todo.local/api

## Troubleshooting Guide

### Common Issues

1. **Pods failing to start**
   - Check logs: `kubectl logs -l app=todo-frontend -n todo-app`
   - Check events: `kubectl describe pod <pod-name> -n todo-app`

2. **Service not accessible**
   - Verify ingress: `kubectl get ingress -n todo-app`
   - Check services: `kubectl get svc -n todo-app`

3. **Database connection issues**
   - Verify secrets: `kubectl get secrets -n todo-app`
   - Check if Neon DB is accessible from cluster

### Useful Commands

```bash
# Check all resources in namespace
kubectl get all -n todo-app

# Check ingress status
kubectl get ingress -n todo-app

# Check configmaps and secrets
kubectl get cm,secrets -n todo-app

# Port forward for debugging
kubectl port-forward -n todo-app svc/todo-app-backend 8000:80
```

## Environment Variables

The application uses the following environment variables:

### ConfigMaps
- `NEXT_PUBLIC_API_URL`: Points to the backend service

### Secrets
- `DATABASE_URL`: Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET`: JWT secret for authentication
- `OPENROUTER_API_KEY`: API key for OpenRouter

## Scaling

To manually scale deployments:
```bash
# Scale frontend
kubectl scale deployment todo-app-frontend --replicas=3 -n todo-app

# Scale backend
kubectl scale deployment todo-app-backend --replicas=3 -n todo-app
```

## Clean Up

To uninstall the application:
```bash
helm uninstall todo-app -n todo-app
kubectl delete namespace todo-app
```

## Features Implemented

✅ Containerized application with optimized Docker images
✅ Kubernetes deployments with health probes
✅ Service discovery between frontend and backend
✅ Ingress configuration for external access
✅ ConfigMaps for configuration
✅ Secrets for sensitive data
✅ Helm chart for easy deployment
✅ AIOps integration for cluster management
✅ Multi-environment configuration (dev/prod)
✅ Resource limits and requests defined
✅ Ready for horizontal pod autoscaling