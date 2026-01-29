---
id: "014"
title: "Health Probes Configuration"
stage: "phase-4"
date: "2026-01-30"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "kubernetes"
branch: "main"
user: "Coders"
command: "sp.tasks"
labels: ["kubernetes", "health", "monitoring"]
links:
  spec: "phase-4-kubernetes/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "kubernetes/helm/todo-app/templates/frontend-deployment.yaml"
  - "kubernetes/helm/todo-app/templates/backend-deployment.yaml"
tests: []
---

# Health Probes Configuration

## PROMPT
Configure health probes (liveness and readiness) for the Todo Chatbot application deployments.

## RESPONSE
Successfully configured liveness and readiness probes for both frontend and backend deployments. The frontend has HTTP probes checking the root path, while the backend has health check endpoints configured. These probes ensure proper pod health monitoring and automatic restarts when needed.