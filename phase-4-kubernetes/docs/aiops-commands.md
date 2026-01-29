# AIOps Commands Documentation

This document provides comprehensive documentation for the AI-powered operations commands used in the Kubernetes deployment of the Todo Chatbot application.

## Overview

AIOps (Artificial Intelligence for IT Operations) tools are integrated into our Kubernetes deployment to simplify operations and enable natural language interaction with our cluster. The following tools are used:

- **kubectl-ai**: Natural language interface for Kubernetes operations
- **kagent**: AI-powered cluster management and optimization
- **Gordon (Docker AI)**: AI-assisted Docker operations

## kubectl-ai Commands

kubectl-ai enables natural language interaction with Kubernetes clusters. Here are the common commands used in our Todo Chatbot deployment:

### Deployment Management

```bash
# Deploy the todo frontend with specific replica count
kubectl-ai "Deploy the todo frontend with 2 replicas"

# Scale the backend to handle more load
kubectl-ai "Scale the backend to handle more load"
kubectl-ai "Scale the backend deployment to 4 replicas"

# Check why pods are failing
kubectl-ai "Check why the pods are failing"
kubectl-ai "Why are the backend pods restarting?"

# View specific logs
kubectl-ai "Show me the backend logs from the last 5 minutes"
kubectl-ai "Show me the frontend logs with errors"
```

### Cluster Information

```bash
# Get cluster health and resource usage
kubectl-ai "Analyze the cluster health and resource usage"
kubectl-ai "Show me the status of all pods in the todo-app namespace"
kubectl-ai "What resources is the todo-frontend consuming?"

# Get specific resource information
kubectl-ai "Show me all deployments in the todo-app namespace"
kubectl-ai "Get the service configuration for the backend"
kubectl-ai "Show me the ingress rules for todo.local"
```

### Troubleshooting

```bash
# Diagnose issues
kubectl-ai "Explain why the todo-frontend pods are in CrashLoopBackOff"
kubectl-ai "What's wrong with the backend service?"
kubectl-ai "Check the health of the todo-app namespace"

# Configuration checks
kubectl-ai "Show me the environment variables in the frontend pods"
kubectl-ai "What secrets are mounted in the backend pods?"
kubectl-ai "Check the ConfigMap values for the todo-app"
```

## kagent Commands

kagent provides AI-powered cluster management and optimization capabilities:

### Health Analysis

```bash
# Analyze cluster health
kagent "analyze the cluster health"

# Get detailed health report
kagent "provide a detailed health report for the todo-app namespace"
kagent "check for potential issues in the cluster"
```

### Resource Optimization

```bash
# Optimize resource allocation
kagent "optimize resource allocation for the todo app"
kagent "suggest resource optimizations for the frontend deployment"
kagent "analyze and optimize CPU and memory limits"
```

### Troubleshooting

```bash
# Investigate pod issues
kagent "investigate why the backend pods are crashing"
kagent "troubleshoot the todo-frontend deployment issues"
kagent "analyze the causes of high resource consumption"
```

## Gordon (Docker AI) Commands

Gordon provides AI-powered Docker operations for building and managing container images:

### Image Building

```bash
# Build optimized images
docker ai "Build optimized Docker images for frontend and backend"
docker ai "Create a multi-stage Dockerfile for the Next.js frontend"
docker ai "Optimize the backend Dockerfile for smaller size"
```

### Image Analysis

```bash
# Analyze images for security
docker ai "Analyze frontend Docker image for security vulnerabilities"
docker ai "Scan the backend image for CVEs"
docker ai "Check the frontend image for potential security issues"
```

### Optimization

```bash
# Optimize Docker layers
docker ai "Optimize Docker layer caching for faster builds"
docker ai "Improve the build cache efficiency for the frontend image"
docker ai "Reduce the size of the backend Docker image"
```

## Practical Examples

### Complete Deployment Example

```bash
# 1. Build optimized images
docker ai "Build optimized Docker images for frontend and backend with proper tagging"

# 2. Deploy the application
kubectl-ai "Deploy the todo chatbot application with frontend and backend in the todo-app namespace"

# 3. Scale based on demand
kubectl-ai "Scale the backend to handle increased load, maintaining 3 replicas"

# 4. Monitor and analyze
kubectl-ai "Show me the current status and resource usage of the todo application"
kagent "analyze the cluster health and suggest optimizations"
```

### Monitoring and Maintenance

```bash
# Daily health check
kubectl-ai "Provide a health summary of all deployments in the todo-app namespace"
kagent "analyze resource usage patterns and suggest optimizations"

# Issue resolution
kubectl-ai "Investigate why the frontend pods are consuming high memory"
docker ai "Analyze the frontend image for potential improvements"
```

## Best Practices

1. **Be Specific**: Use detailed descriptions in your natural language commands for better results
2. **Context Matters**: Include namespace information when working with specific deployments
3. **Regular Analysis**: Use kagent regularly to maintain optimal cluster performance
4. **Security First**: Always scan Docker images before deployment using Gordon
5. **Monitor Resource Usage**: Regularly check resource consumption using kubectl-ai

## Troubleshooting Common Issues

### Command Not Found
- Ensure kubectl-ai is properly installed: `npm install -g kubectl-ai`
- Verify Docker AI (Gordon) is enabled in Docker Desktop settings

### Permission Issues
- Make sure kubectl is properly configured with cluster access
- Verify RBAC permissions for the operations you're attempting

### AI Misinterpretation
- Use more specific language if the AI doesn't interpret your command correctly
- Include technical terms alongside natural language for clarity