---
id: 009
title: Cloud Provider Selection for Phase 5
stage: tasks
date: 2026-02-04
surface: agent
model: claude-sonnet-4-5
feature: phase-5-cloud-deployment
branch: main
user: Coders
command: /sp.implement
labels: ["cloud-provider", "infrastructure", "decision", "oke", "phase-5"]
links:
  spec: phase-5-cloud-deployment/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - phase-5-cloud-deployment/cloud-provider-decision.md
 - phase-5-cloud-deployment/tasks.md
tests:
 - None (decision documentation task)
---

## Prompt

T-501 | Choose cloud provider (AKS/GKE/OKE) | None | Pending |

## Response snapshot

Executed Task T-501: Cloud Provider Selection for Phase 5 Advanced Cloud Deployment.

**Decision Made**: Oracle Cloud Infrastructure (OKE - Oracle Kubernetes Engine)

**Key Rationale**:
1. **Always Free Tier**: 4 OCPUs + 24GB RAM permanently free (no expiration)
2. **Zero Cost**: Unlike AKS ($200/30 days) or GKE ($300/90 days), OKE free tier never expires
3. **Sufficient Resources**: Enough capacity for Frontend, Backend, Kafka, Dapr, microservices, and monitoring stack
4. **Production-Ready**: Full Kubernetes support with OCIR container registry
5. **Sustainability**: System can run indefinitely for portfolio/demos beyond hackathon

**Resource Allocation Plan**:
- Total CPU allocation: ~1500m requested, ~3600m limits (4000m available)
- Total Memory allocation: ~3Gi requested, ~6.5Gi limits (24Gi available)
- Sufficient headroom for all Phase 5 services

**Deliverables Created**:
1. Comprehensive cloud provider decision document (`cloud-provider-decision.md`)
2. Updated tasks.md to mark T-501 as completed
3. Documented setup instructions for OKE cluster creation
4. Risk assessment and mitigation strategies
5. Resource allocation plan for all services

**Next Steps**: Task T-502 - Set up cloud K8s cluster

## Outcome

- ✅ Impact: Critical infrastructure decision for Phase 5 cloud deployment. Selected OKE (Oracle Cloud) as the cloud provider based on always-free tier (4 OCPUs, 24GB RAM) vs time-limited credits from AKS/GKE.
- 🧪 Tests: None (decision documentation task, no code implementation)
- 📁 Files: Created cloud-provider-decision.md with comprehensive evaluation, rationale, and setup instructions. Updated tasks.md to mark T-501 completed.
- 🔁 Next prompts: Task T-502 - Set up cloud K8s cluster, configure OCI CLI, create OKE cluster, setup kubectl
- 🧠 Reflection: Decision well-documented with cost analysis, technical capabilities comparison, resource allocation plan, and risk assessment. Always-free tier provides best long-term sustainability for hackathon project.

## Evaluation notes (flywheel)

- Failure modes observed: Initial attempt to run from main branch (not feature branch), PHR script requires specs/ directory structure. Mitigated by creating PHR manually.
- Graders run and results (PASS/FAIL): N/A (decision task, not code implementation)
- Prompt variant (if applicable): sp.implement command for task execution
- Next experiment (smallest change to try): Proceed with T-502 cluster setup, validate OKE always-free tier resource allocation in practice
