---
id: "007"
title: "Frontend Deployment Manifest"
stage: "phase-4"
date: "2026-01-30"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "kubernetes"
branch: "main"
user: "Coders"
command: "sp.tasks"
labels: ["kubernetes", "deployment", "frontend"]
links:
  spec: "phase-4-kubernetes/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "kubernetes/helm/todo-app/templates/frontend-deployment.yaml"
tests: []
---

# Frontend Deployment Manifest

## PROMPT
Create frontend deployment manifest for the Next.js Todo Chatbot application.

## RESPONSE
Successfully created frontend deployment manifest with 2 replicas, proper resource limits (CPU 500m, RAM 512Mi), liveness and readiness probes, and environment variable configuration for connecting to the backend service.