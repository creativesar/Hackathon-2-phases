#!/bin/bash
# OKE Cluster Setup Verification Script
# Task: T-502 - Set up cloud K8s cluster
# Purpose: Verify OKE cluster is properly configured and ready

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

echo "=========================================="
echo "OKE Cluster Setup Verification"
echo "=========================================="
echo ""

# Function to print test result
print_result() {
    local test_name="$1"
    local result="$2"
    local message="$3"

    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✓${NC} $test_name"
        [ -n "$message" ] && echo "  → $message"
        ((PASSED++))
    elif [ "$result" = "FAIL" ]; then
        echo -e "${RED}✗${NC} $test_name"
        [ -n "$message" ] && echo "  → $message"
        ((FAILED++))
    elif [ "$result" = "WARN" ]; then
        echo -e "${YELLOW}⚠${NC} $test_name"
        [ -n "$message" ] && echo "  → $message"
        ((WARNINGS++))
    fi
    echo ""
}

# Test 1: OCI CLI Installation
echo "Checking OCI CLI..."
if command -v oci &> /dev/null; then
    OCI_VERSION=$(oci --version 2>&1)
    print_result "OCI CLI installed" "PASS" "Version: $OCI_VERSION"
else
    print_result "OCI CLI installed" "FAIL" "OCI CLI not found. Install from: https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm"
fi

# Test 2: OCI CLI Configuration
echo "Checking OCI CLI configuration..."
if [ -f ~/.oci/config ]; then
    if oci iam region list &> /dev/null; then
        print_result "OCI CLI configured" "PASS" "Configuration valid"
    else
        print_result "OCI CLI configured" "FAIL" "Configuration exists but authentication failed. Run: oci setup config"
    fi
else
    print_result "OCI CLI configured" "FAIL" "Config file not found at ~/.oci/config. Run: oci setup config"
fi

# Test 3: kubectl Installation
echo "Checking kubectl..."
if command -v kubectl &> /dev/null; then
    KUBECTL_VERSION=$(kubectl version --client --short 2>&1 | head -n1)
    print_result "kubectl installed" "PASS" "$KUBECTL_VERSION"
else
    print_result "kubectl installed" "FAIL" "kubectl not found. Install from: https://kubernetes.io/docs/tasks/tools/"
fi

# Test 4: kubectl Configuration
echo "Checking kubectl configuration..."
if [ -f ~/.kube/config ]; then
    if kubectl cluster-info &> /dev/null; then
        CLUSTER_INFO=$(kubectl cluster-info | head -n1)
        print_result "kubectl configured" "PASS" "$CLUSTER_INFO"
    else
        print_result "kubectl configured" "FAIL" "Cannot connect to cluster. Generate kubeconfig: oci ce cluster create-kubeconfig"
    fi
else
    print_result "kubectl configured" "FAIL" "kubeconfig not found at ~/.kube/config"
fi

# Test 5: Cluster Connectivity
echo "Checking cluster connectivity..."
if kubectl get nodes &> /dev/null; then
    NODE_COUNT=$(kubectl get nodes --no-headers 2>/dev/null | wc -l)
    NODE_STATUS=$(kubectl get nodes --no-headers 2>/dev/null | awk '{print $2}' | head -n1)

    if [ "$NODE_STATUS" = "Ready" ]; then
        print_result "Cluster nodes ready" "PASS" "$NODE_COUNT node(s) ready"
    else
        print_result "Cluster nodes ready" "WARN" "Node status: $NODE_STATUS"
    fi
else
    print_result "Cluster nodes ready" "FAIL" "Cannot get nodes"
fi

# Test 6: Check Node Resources
echo "Checking node resources..."
if kubectl get nodes &> /dev/null; then
    # Get allocatable resources
    CPU_ALLOCATABLE=$(kubectl get nodes -o jsonpath='{.items[0].status.allocatable.cpu}')
    MEM_ALLOCATABLE=$(kubectl get nodes -o jsonpath='{.items[0].status.allocatable.memory}')

    # Convert memory to Gi
    MEM_GI=$(echo "$MEM_ALLOCATABLE" | sed 's/Ki$//' | awk '{printf "%.1f", $1/1024/1024}')

    if [ -n "$CPU_ALLOCATABLE" ] && [ -n "$MEM_ALLOCATABLE" ]; then
        print_result "Node resources" "PASS" "CPU: ${CPU_ALLOCATABLE} cores, Memory: ${MEM_GI}Gi"

        # Check if it meets Always Free tier specs
        CPU_COUNT=$(echo "$CPU_ALLOCATABLE" | sed 's/[^0-9]//g')
        if [ "$CPU_COUNT" -ge 3 ]; then
            print_result "Always Free tier validation" "PASS" "Resources meet/exceed 4 OCPUs, 24GB requirement"
        else
            print_result "Always Free tier validation" "WARN" "Resources below expected Always Free tier (4 OCPUs, 24GB)"
        fi
    else
        print_result "Node resources" "FAIL" "Cannot retrieve node resources"
    fi
else
    print_result "Node resources" "FAIL" "Cannot check resources"
fi

# Test 7: Dapr Installation
echo "Checking Dapr installation..."
if command -v dapr &> /dev/null; then
    DAPR_VERSION=$(dapr version 2>&1 | grep "CLI version" | awk '{print $3}')
    print_result "Dapr CLI installed" "PASS" "Version: $DAPR_VERSION"

    # Check Dapr on cluster
    if kubectl get namespace dapr-system &> /dev/null; then
        DAPR_PODS=$(kubectl get pods -n dapr-system --no-headers 2>/dev/null | wc -l)
        DAPR_RUNNING=$(kubectl get pods -n dapr-system --field-selector=status.phase=Running --no-headers 2>/dev/null | wc -l)

        if [ "$DAPR_PODS" -eq "$DAPR_RUNNING" ] && [ "$DAPR_PODS" -gt 0 ]; then
            print_result "Dapr on Kubernetes" "PASS" "$DAPR_RUNNING/$DAPR_PODS pods running"
        else
            print_result "Dapr on Kubernetes" "WARN" "Only $DAPR_RUNNING/$DAPR_PODS pods running. Run: dapr init --kubernetes"
        fi
    else
        print_result "Dapr on Kubernetes" "WARN" "Dapr not initialized. Run: dapr init --kubernetes"
    fi
else
    print_result "Dapr CLI installed" "WARN" "Dapr not installed (optional for initial setup)"
fi

# Test 8: Helm Installation
echo "Checking Helm..."
if command -v helm &> /dev/null; then
    HELM_VERSION=$(helm version --short 2>&1)
    print_result "Helm installed" "PASS" "$HELM_VERSION"
else
    print_result "Helm installed" "WARN" "Helm not found (required for later deployment)"
fi

# Test 9: Docker Installation
echo "Checking Docker..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_result "Docker installed" "PASS" "$DOCKER_VERSION"

    # Check if Docker daemon is running
    if docker ps &> /dev/null; then
        print_result "Docker daemon running" "PASS" "Docker is ready"
    else
        print_result "Docker daemon running" "FAIL" "Docker daemon not running. Start Docker Desktop."
    fi
else
    print_result "Docker installed" "FAIL" "Docker not found. Install Docker Desktop."
fi

# Test 10: Required Namespaces
echo "Checking Kubernetes namespaces..."
REQUIRED_NAMESPACES=("todo-app" "monitoring" "kafka")
MISSING_NAMESPACES=()

for ns in "${REQUIRED_NAMESPACES[@]}"; do
    if kubectl get namespace "$ns" &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} $ns namespace exists"
    else
        echo -e "  ${YELLOW}⚠${NC} $ns namespace missing"
        MISSING_NAMESPACES+=("$ns")
    fi
done

if [ ${#MISSING_NAMESPACES[@]} -eq 0 ]; then
    print_result "Required namespaces" "PASS" "All namespaces exist"
else
    print_result "Required namespaces" "WARN" "Missing: ${MISSING_NAMESPACES[*]}. Create with: kubectl create namespace <name>"
fi

# Test 11: OCIR Login
echo "Checking OCIR configuration..."
if docker info 2>/dev/null | grep -q "ocir.io"; then
    print_result "OCIR login" "PASS" "Docker logged into OCIR"
else
    print_result "OCIR login" "WARN" "Not logged into OCIR. Run: docker login <region>.ocir.io"
fi

# Test 12: OCIR Secret in Kubernetes
echo "Checking OCIR secret in Kubernetes..."
if kubectl get secret ocir-secret -n todo-app &> /dev/null; then
    print_result "OCIR Kubernetes secret" "PASS" "Secret exists in todo-app namespace"
else
    print_result "OCIR Kubernetes secret" "WARN" "Secret not found. Create with: kubectl create secret docker-registry ocir-secret"
fi

# Test 13: System Pods
echo "Checking system pods..."
if kubectl get pods -n kube-system &> /dev/null; then
    SYSTEM_PODS=$(kubectl get pods -n kube-system --no-headers 2>/dev/null | wc -l)
    SYSTEM_RUNNING=$(kubectl get pods -n kube-system --field-selector=status.phase=Running --no-headers 2>/dev/null | wc -l)

    if [ "$SYSTEM_PODS" -eq "$SYSTEM_RUNNING" ]; then
        print_result "System pods" "PASS" "$SYSTEM_RUNNING/$SYSTEM_PODS pods running"
    else
        print_result "System pods" "WARN" "Only $SYSTEM_RUNNING/$SYSTEM_PODS system pods running"
    fi
else
    print_result "System pods" "FAIL" "Cannot check system pods"
fi

# Summary
echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo -e "${GREEN}Passed:${NC}   $PASSED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "${RED}Failed:${NC}   $FAILED"
echo ""

# Overall status
if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}✓ All checks passed! OKE cluster is fully configured.${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠ Setup mostly complete with warnings. Review warnings above.${NC}"
        exit 0
    fi
else
    echo -e "${RED}✗ Setup incomplete. Address failed checks above.${NC}"
    exit 1
fi
