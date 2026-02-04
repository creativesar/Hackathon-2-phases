#!/bin/bash
# OKE Cluster Environment Variables Template
# Copy this file to oke-env.sh and fill in your values
# Usage: source oke-env.sh

# OCI Configuration
export OCI_REGION="us-ashburn-1"                    # Your OCI region (e.g., us-ashburn-1, us-phoenix-1)
export OCI_COMPARTMENT_OCID="ocid1.compartment..."  # Your compartment OCID
export OCI_TENANCY_OCID="ocid1.tenancy..."          # Your tenancy OCID
export OCI_USER_OCID="ocid1.user..."                # Your user OCID

# OKE Cluster
export CLUSTER_NAME="todo-oke"
export CLUSTER_OCID="ocid1.cluster..."              # Your cluster OCID
export VCN_OCID="ocid1.vcn..."                      # Your VCN OCID
export KUBERNETES_VERSION="v1.28.2"

# Container Registry (OCIR)
export OCI_TENANCY_NAMESPACE="your-namespace"        # Your tenancy namespace (from: oci os ns get)
export OCIR_REGION_KEY="iad"                        # Region key (iad, phx, etc.)
export OCIR_ENDPOINT="${OCIR_REGION_KEY}.ocir.io"
export OCIR_NAMESPACE="${OCI_TENANCY_NAMESPACE}"

# Image Paths
export OCIR_REPO_PREFIX="${OCIR_ENDPOINT}/${OCIR_NAMESPACE}"
export FRONTEND_IMAGE="${OCIR_REPO_PREFIX}/todo-frontend"
export BACKEND_IMAGE="${OCIR_REPO_PREFIX}/todo-backend"
export RECURRING_SERVICE_IMAGE="${OCIR_REPO_PREFIX}/todo-recurring-service"
export NOTIFICATION_SERVICE_IMAGE="${OCIR_REPO_PREFIX}/todo-notification-service"

# Kubernetes Namespaces
export K8S_NAMESPACE_APP="todo-app"
export K8S_NAMESPACE_MONITORING="monitoring"
export K8S_NAMESPACE_KAFKA="kafka"

# Database (Neon)
export DATABASE_URL="postgresql://user:password@host/db"  # Your Neon database URL

# Application Configuration
export APP_ENV="production"
export LOG_LEVEL="info"

# Display loaded configuration
echo "=========================================="
echo "OKE Environment Variables Loaded"
echo "=========================================="
echo "Cluster: ${CLUSTER_NAME}"
echo "Region: ${OCI_REGION}"
echo "Registry: ${OCIR_ENDPOINT}"
echo "Namespace: ${K8S_NAMESPACE_APP}"
echo "=========================================="
