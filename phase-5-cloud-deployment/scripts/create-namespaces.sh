#!/bin/bash
# Create Required Kubernetes Namespaces
# Task: T-502 - Set up cloud K8s cluster
# Purpose: Create all required namespaces for Phase 5 deployment

set -e

echo "=========================================="
echo "Creating Kubernetes Namespaces"
echo "=========================================="
echo ""

# Check kubectl connectivity
if ! kubectl cluster-info &> /dev/null; then
    echo "Error: Cannot connect to Kubernetes cluster"
    echo "Ensure kubectl is configured: oci ce cluster create-kubeconfig"
    exit 1
fi

# Define namespaces
NAMESPACES=(
    "todo-app:Application services (frontend, backend, microservices)"
    "monitoring:Monitoring stack (Prometheus, Grafana, Loki)"
    "kafka:Kafka cluster and related components"
)

# Create namespaces
for ns_entry in "${NAMESPACES[@]}"; do
    ns_name=$(echo "$ns_entry" | cut -d':' -f1)
    ns_desc=$(echo "$ns_entry" | cut -d':' -f2)

    echo "Creating namespace: $ns_name"
    echo "  Purpose: $ns_desc"

    if kubectl get namespace "$ns_name" &> /dev/null; then
        echo "  ✓ Namespace already exists"
    else
        kubectl create namespace "$ns_name"
        echo "  ✓ Namespace created"
    fi
    echo ""
done

# Label namespaces for better organization
echo "Adding labels to namespaces..."
kubectl label namespace todo-app app=todo-app --overwrite
kubectl label namespace monitoring monitoring=true --overwrite
kubectl label namespace kafka kafka=true --overwrite
echo "✓ Labels added"
echo ""

# Verify all namespaces
echo "=========================================="
echo "Namespace Verification"
echo "=========================================="
kubectl get namespaces | grep -E "todo-app|monitoring|kafka"
echo ""

echo "✓ All namespaces created successfully!"
