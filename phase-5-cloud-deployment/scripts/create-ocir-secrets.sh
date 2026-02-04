#!/bin/bash
# Create OCIR ImagePullSecrets in Kubernetes
# Task: T-503 - Set up container registry
# Purpose: Create docker-registry secrets for OCIR in all required namespaces

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=========================================="
echo "Create OCIR Kubernetes Secrets"
echo "=========================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl not installed${NC}"
    exit 1
fi

if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}Error: Cannot connect to Kubernetes cluster${NC}"
    echo "Run: oci ce cluster create-kubeconfig --cluster-id <cluster-ocid>"
    exit 1
fi

if ! command -v oci &> /dev/null; then
    echo -e "${RED}Error: OCI CLI not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites met${NC}"
echo ""

# Get OCIR configuration
echo "Getting OCIR configuration..."

# Tenancy namespace
TENANCY_NAMESPACE=$(oci os ns get --query "data" --raw-output 2>/dev/null)
if [ -z "$TENANCY_NAMESPACE" ]; then
    echo -e "${RED}Error: Cannot get tenancy namespace${NC}"
    exit 1
fi
echo "Tenancy Namespace: $TENANCY_NAMESPACE"

# Region and region key
REGION=$(oci iam region-subscription list --query "data[0].\"region-name\"" --raw-output 2>/dev/null)
case "$REGION" in
    "us-ashburn-1") REGION_KEY="iad" ;;
    "us-phoenix-1") REGION_KEY="phx" ;;
    "us-sanjose-1") REGION_KEY="sjc" ;;
    "ca-toronto-1") REGION_KEY="yyz" ;;
    "ca-montreal-1") REGION_KEY="yul" ;;
    "uk-london-1") REGION_KEY="lhr" ;;
    "eu-frankfurt-1") REGION_KEY="fra" ;;
    "eu-zurich-1") REGION_KEY="zrh" ;;
    "eu-amsterdam-1") REGION_KEY="ams" ;;
    *) REGION_KEY="iad" ;;
esac
OCIR_ENDPOINT="${REGION_KEY}.ocir.io"
echo "Region: $REGION"
echo "OCIR Endpoint: $OCIR_ENDPOINT"
echo ""

# Prompt for credentials
echo "=========================================="
echo "OCIR Credentials Required"
echo "=========================================="
echo ""
echo "You need the following information:"
echo "  1. OCI Username (e.g., oracleidentitycloudservice/user@example.com)"
echo "  2. Auth Token (from OCI Console → User Settings → Auth Tokens)"
echo "  3. Email address"
echo ""

read -p "Enter OCI Username: " OCI_USERNAME
if [ -z "$OCI_USERNAME" ]; then
    echo -e "${RED}Error: Username required${NC}"
    exit 1
fi

read -sp "Enter Auth Token: " AUTH_TOKEN
echo ""
if [ -z "$AUTH_TOKEN" ]; then
    echo -e "${RED}Error: Auth token required${NC}"
    exit 1
fi

read -p "Enter Email: " EMAIL
if [ -z "$EMAIL" ]; then
    echo -e "${RED}Error: Email required${NC}"
    exit 1
fi

echo ""
echo "Configuration:"
echo "  Server: $OCIR_ENDPOINT"
echo "  Username: ${TENANCY_NAMESPACE}/${OCI_USERNAME}"
echo "  Email: $EMAIL"
echo ""

# Confirm before creating
read -p "Create secrets in all namespaces? (y/N): " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi
echo ""

# Define namespaces
NAMESPACES=("todo-app" "monitoring" "kafka")

# Create secrets in each namespace
for ns in "${NAMESPACES[@]}"; do
    echo "Processing namespace: $ns"

    # Check if namespace exists
    if ! kubectl get namespace "$ns" &> /dev/null; then
        echo -e "  ${YELLOW}⚠${NC} Namespace not found, creating..."
        kubectl create namespace "$ns"
        echo -e "  ${GREEN}✓${NC} Namespace created"
    fi

    # Check if secret already exists
    if kubectl get secret ocir-secret -n "$ns" &> /dev/null; then
        echo -e "  ${YELLOW}⚠${NC} Secret already exists, deleting old secret..."
        kubectl delete secret ocir-secret -n "$ns"
        echo -e "  ${GREEN}✓${NC} Old secret deleted"
    fi

    # Create secret
    if kubectl create secret docker-registry ocir-secret \
        --docker-server="$OCIR_ENDPOINT" \
        --docker-username="${TENANCY_NAMESPACE}/${OCI_USERNAME}" \
        --docker-password="$AUTH_TOKEN" \
        --docker-email="$EMAIL" \
        --namespace="$ns" &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Secret created"
    else
        echo -e "  ${RED}✗${NC} Failed to create secret"
        exit 1
    fi

    # Verify secret
    SECRET_TYPE=$(kubectl get secret ocir-secret -n "$ns" -o jsonpath='{.type}' 2>/dev/null)
    if [ "$SECRET_TYPE" = "kubernetes.io/dockerconfigjson" ]; then
        echo -e "  ${GREEN}✓${NC} Secret verified"
    else
        echo -e "  ${RED}✗${NC} Secret verification failed"
        exit 1
    fi

    echo ""
done

# Summary
echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""
echo "OCIR secrets created in the following namespaces:"
for ns in "${NAMESPACES[@]}"; do
    echo "  ✓ $ns"
done
echo ""

echo "To use in deployments, add to pod spec:"
echo ""
echo "  spec:"
echo "    imagePullSecrets:"
echo "    - name: ocir-secret"
echo "    containers:"
echo "    - name: myapp"
echo "      image: ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/myapp:latest"
echo ""

echo -e "${GREEN}✓ OCIR secrets created successfully!${NC}"
echo ""

# Verify all secrets
echo "Verifying secrets..."
for ns in "${NAMESPACES[@]}"; do
    kubectl get secret ocir-secret -n "$ns" --no-headers 2>/dev/null | \
        awk -v ns="$ns" '{printf "  %-15s %s\n", ns, $2}'
done
echo ""

echo "Next steps:"
echo "  1. Test image pull with a deployment"
echo "  2. Build and push application images"
echo "  3. Deploy applications using OCIR images"
