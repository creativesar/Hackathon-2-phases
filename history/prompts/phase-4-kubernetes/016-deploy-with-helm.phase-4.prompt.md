---
id: "016"
title: "Deploy with Helm"
stage: "phase-4"
date: "2026-01-30"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "kubernetes"
branch: "main"
user: "Coders"
command: "sp.tasks"
labels: ["helm", "deployment", "orchestration"]
links:
  spec: "phase-4-kubernetes/spec.md"
  ticket: null
  adr: null
  pr: null
files: []
tests: []
---

# Deploy with Helm

## PROMPT
Deploy the Todo Chatbot application using Helm chart with development values.

## RESPONSE
Successfully deployed the Todo Chatbot application using Helm chart with development values. The deployment includes all necessary Kubernetes resources (deployments, services, ingress, configmaps, secrets) and the application is now running in the Minikube cluster.