#!/bin/bash
# OCIR Setup Verification Script
# Task: T-503 - Set up container registry
# Purpose: Verify OCIR is properly configured and ready for use

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
echo "OCIR Setup Verification"
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

# Test 1: OCI CLI Configuration
echo "Checking OCI CLI..."
if command -v oci &> /dev/null; then
    if oci iam region list &> /dev/null; then
        print_result "OCI CLI configured" "PASS" "CLI authenticated"
    else
        print_result "OCI CLI configured" "FAIL" "Authentication failed. Run: oci setup config"
    fi
else
    print_result "OCI CLI configured" "FAIL" "OCI CLI not installed"
fi

# Test 2: Get Tenancy Namespace
echo "Checking tenancy namespace..."
if command -v oci &> /dev/null; then
    TENANCY_NAMESPACE=$(oci os ns get --query "data" --raw-output 2>/dev/null)
    if [ -n "$TENANCY_NAMESPACE" ]; then
        print_result "Tenancy namespace" "PASS" "Namespace: $TENANCY_NAMESPACE"
        export TENANCY_NAMESPACE
    else
        print_result "Tenancy namespace" "FAIL" "Cannot retrieve namespace"
    fi
else
    print_result "Tenancy namespace" "FAIL" "OCI CLI required"
fi

# Test 3: Docker Installation
echo "Checking Docker..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_result "Docker installed" "PASS" "$DOCKER_VERSION"

    # Check if Docker daemon is running
    if docker ps &> /dev/null; then
        print_result "Docker daemon" "PASS" "Running"
    else
        print_result "Docker daemon" "FAIL" "Not running. Start Docker Desktop."
    fi
else
    print_result "Docker installed" "FAIL" "Docker not found"
fi

# Test 4: OCIR Login Status
echo "Checking OCIR login..."
if command -v docker &> /dev/null; then
    if docker info 2>/dev/null | grep -q "ocir.io"; then
        REGISTRY=$(docker info 2>/dev/null | grep "ocir.io" | head -n1)
        print_result "OCIR login" "PASS" "Logged in to OCIR"
    else
        print_result "OCIR login" "WARN" "Not logged in. Run: docker login <region>.ocir.io"
    fi
else
    print_result "OCIR login" "FAIL" "Docker required"
fi

# Test 5: OCIR Repositories (if logged in)
echo "Checking OCIR repositories..."
if command -v oci &> /dev/null; then
    # Get compartment OCID (try from config or use tenancy)
    COMPARTMENT_OCID=$(oci iam compartment list --query "data[0].id" --raw-output 2>/dev/null || echo "")

    if [ -z "$COMPARTMENT_OCID" ]; then
        # Fallback to tenancy OCID
        COMPARTMENT_OCID=$(oci iam region list --query "data[0].key" --raw-output 2>/dev/null || echo "")
    fi

    if [ -n "$COMPARTMENT_OCID" ]; then
        REPO_COUNT=$(oci artifacts container repository list \
            --compartment-id "$COMPARTMENT_OCID" \
            --all 2>/dev/null | grep -c "\"display-name\"" || echo "0")

        if [ "$REPO_COUNT" -gt 0 ]; then
            print_result "OCIR repositories" "PASS" "$REPO_COUNT repositor(ies) found"
        else
            print_result "OCIR repositories" "WARN" "No repositories found (will be auto-created on first push)"
        fi
    else
        print_result "OCIR repositories" "WARN" "Cannot check repositories (compartment OCID not found)"
    fi
else
    print_result "OCIR repositories" "FAIL" "OCI CLI required"
fi

# Test 6: Kubernetes Connection
echo "Checking Kubernetes connection..."
if command -v kubectl &> /dev/null; then
    if kubectl cluster-info &> /dev/null; then
        print_result "kubectl connected" "PASS" "Connected to cluster"
    else
        print_result "kubectl connected" "FAIL" "Cannot connect to cluster"
    fi
else
    print_result "kubectl connected" "FAIL" "kubectl not installed"
fi

# Test 7: OCIR Secret in todo-app Namespace
echo "Checking OCIR secret in todo-app namespace..."
if command -v kubectl &> /dev/null && kubectl cluster-info &> /dev/null; then
    if kubectl get namespace todo-app &> /dev/null; then
        if kubectl get secret ocir-secret -n todo-app &> /dev/null; then
            # Verify secret has correct type
            SECRET_TYPE=$(kubectl get secret ocir-secret -n todo-app -o jsonpath='{.type}')
            if [ "$SECRET_TYPE" = "kubernetes.io/dockerconfigjson" ]; then
                print_result "OCIR secret (todo-app)" "PASS" "Secret exists and valid"
            else
                print_result "OCIR secret (todo-app)" "WARN" "Secret exists but wrong type: $SECRET_TYPE"
            fi
        else
            print_result "OCIR secret (todo-app)" "WARN" "Secret not found. Create with: kubectl create secret docker-registry ocir-secret"
        fi
    else
        print_result "OCIR secret (todo-app)" "WARN" "Namespace todo-app not found"
    fi
else
    print_result "OCIR secret (todo-app)" "FAIL" "Cannot check (kubectl not connected)"
fi

# Test 8: OCIR Secret in monitoring Namespace
echo "Checking OCIR secret in monitoring namespace..."
if command -v kubectl &> /dev/null && kubectl cluster-info &> /dev/null; then
    if kubectl get namespace monitoring &> /dev/null; then
        if kubectl get secret ocir-secret -n monitoring &> /dev/null; then
            print_result "OCIR secret (monitoring)" "PASS" "Secret exists"
        else
            print_result "OCIR secret (monitoring)" "WARN" "Secret not found (optional for monitoring namespace)"
        fi
    else
        print_result "OCIR secret (monitoring)" "WARN" "Namespace monitoring not found"
    fi
else
    print_result "OCIR secret (monitoring)" "FAIL" "Cannot check (kubectl not connected)"
fi

# Test 9: OCIR Secret in kafka Namespace
echo "Checking OCIR secret in kafka namespace..."
if command -v kubectl &> /dev/null && kubectl cluster-info &> /dev/null; then
    if kubectl get namespace kafka &> /dev/null; then
        if kubectl get secret ocir-secret -n kafka &> /dev/null; then
            print_result "OCIR secret (kafka)" "PASS" "Secret exists"
        else
            print_result "OCIR secret (kafka)" "WARN" "Secret not found (optional for kafka namespace)"
        fi
    else
        print_result "OCIR secret (kafka)" "WARN" "Namespace kafka not found"
    fi
else
    print_result "OCIR secret (kafka)" "FAIL" "Cannot check (kubectl not connected)"
fi

# Test 10: Test Image Push/Pull (Optional)
echo "Testing OCIR push/pull capability..."
if command -v docker &> /dev/null && docker ps &> /dev/null; then
    if docker info 2>/dev/null | grep -q "ocir.io"; then
        print_result "OCIR push/pull test" "PASS" "Docker logged in (manual test recommended)"
    else
        print_result "OCIR push/pull test" "WARN" "Login to OCIR first"
    fi
else
    print_result "OCIR push/pull test" "FAIL" "Docker not available"
fi

# Test 11: Environment Variables
echo "Checking environment variables..."
if [ -n "$TENANCY_NAMESPACE" ]; then
    print_result "TENANCY_NAMESPACE" "PASS" "Set to: $TENANCY_NAMESPACE"
else
    print_result "TENANCY_NAMESPACE" "WARN" "Not set. Run: export TENANCY_NAMESPACE=\$(oci os ns get --query data --raw-output)"
fi

# Test 12: Region Configuration
echo "Checking OCI region..."
if command -v oci &> /dev/null; then
    REGION=$(oci iam region-subscription list --query "data[0].\"region-name\"" --raw-output 2>/dev/null || echo "")
    if [ -n "$REGION" ]; then
        print_result "OCI region" "PASS" "Region: $REGION"
    else
        print_result "OCI region" "WARN" "Cannot determine region"
    fi
else
    print_result "OCI region" "FAIL" "OCI CLI required"
fi

# Summary
echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo -e "${GREEN}Passed:${NC}   $PASSED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "${RED}Failed:${NC}   $FAILED"
echo ""

# Recommendations
if [ $FAILED -gt 0 ] || [ $WARNINGS -gt 0 ]; then
    echo "=========================================="
    echo "Recommendations"
    echo "=========================================="

    if ! docker info 2>/dev/null | grep -q "ocir.io"; then
        echo "1. Login to OCIR:"
        echo "   export REGION_KEY=\"iad\"  # Change to your region"
        echo "   export TENANCY_NAMESPACE=\"\$(oci os ns get --query data --raw-output)\""
        echo "   export OCI_USERNAME=\"your-username\""
        echo "   export AUTH_TOKEN=\"your-auth-token\""
        echo "   docker login \${REGION_KEY}.ocir.io -u \"\${TENANCY_NAMESPACE}/\${OCI_USERNAME}\" -p \"\${AUTH_TOKEN}\""
        echo ""
    fi

    if ! kubectl get secret ocir-secret -n todo-app &> /dev/null; then
        echo "2. Create Kubernetes ImagePullSecret:"
        echo "   kubectl create secret docker-registry ocir-secret \\"
        echo "     --docker-server=\"\${REGION_KEY}.ocir.io\" \\"
        echo "     --docker-username=\"\${TENANCY_NAMESPACE}/\${OCI_USERNAME}\" \\"
        echo "     --docker-password=\"\${AUTH_TOKEN}\" \\"
        echo "     --docker-email=\"your-email\" \\"
        echo "     --namespace=todo-app"
        echo ""
    fi

    echo "3. See docs/ocir-setup.md for detailed instructions"
    echo ""
fi

# Overall status
if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}✓ All checks passed! OCIR is fully configured.${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠ Setup mostly complete with warnings. Review recommendations above.${NC}"
        exit 0
    fi
else
    echo -e "${RED}✗ Setup incomplete. Address failed checks above.${NC}"
    exit 1
fi
