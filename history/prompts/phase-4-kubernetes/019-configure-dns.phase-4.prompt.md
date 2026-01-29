---
id: "019"
title: "Configure Local DNS"
stage: "phase-4"
date: "2026-01-30"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "kubernetes"
branch: "main"
user: "Coders"
command: "sp.tasks"
labels: ["dns", "networking", "accessibility"]
links:
  spec: "phase-4-kubernetes/spec.md"
  ticket: null
  adr: null
  pr: null
files: []
tests: []
---

# Configure Local DNS

## PROMPT
Configure local DNS to access the Todo Chatbot application via todo.local hostname.

## RESPONSE
Successfully configured local DNS by adding the Minikube IP address with the todo.local hostname to the system hosts file. The application can now be accessed externally through the configured ingress using the todo.local domain.