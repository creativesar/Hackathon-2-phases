#!/bin/bash
# OCIR Push/Pull Test Script
# Task: T-503 - Set up container registry
# Purpose: Test OCIR connectivity with a sample image

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=========================================="
echo "OCIR Push/Pull Test"
echo "=========================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker not installed${NC}"
    exit 1
fi

if ! docker ps &> /dev/null; then
    echo -e "${RED}Error: Docker daemon not running${NC}"
    exit 1
fi

if ! command -v oci &> /dev/null; then
    echo -e "${RED}Error: OCI CLI not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites met${NC}"
echo ""

# Get configuration
echo "Getting OCIR configuration..."

# Tenancy namespace
TENANCY_NAMESPACE=$(oci os ns get --query "data" --raw-output 2>/dev/null)
if [ -z "$TENANCY_NAMESPACE" ]; then
    echo -e "${RED}Error: Cannot get tenancy namespace${NC}"
    echo "Run: oci setup config"
    exit 1
fi
echo "Tenancy Namespace: $TENANCY_NAMESPACE"

# Region
REGION=$(oci iam region-subscription list --query "data[0].\"region-name\"" --raw-output 2>/dev/null)
if [ -z "$REGION" ]; then
    echo -e "${RED}Error: Cannot determine region${NC}"
    exit 1
fi
echo "Region: $REGION"

# Map region to region key
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
    *)
        echo -e "${YELLOW}Warning: Unknown region, using default 'iad'${NC}"
        REGION_KEY="iad"
        ;;
esac
echo "Region Key: $REGION_KEY"

OCIR_ENDPOINT="${REGION_KEY}.ocir.io"
echo "OCIR Endpoint: $OCIR_ENDPOINT"
echo ""

# Check Docker login
echo "Checking OCIR login status..."
if docker info 2>/dev/null | grep -q "$OCIR_ENDPOINT"; then
    echo -e "${GREEN}✓ Logged in to OCIR${NC}"
else
    echo -e "${RED}Error: Not logged in to OCIR${NC}"
    echo ""
    echo "Login with:"
    echo "  docker login ${OCIR_ENDPOINT} \\"
    echo "    -u \"${TENANCY_NAMESPACE}/<your-username>\" \\"
    echo "    -p \"<your-auth-token>\""
    exit 1
fi
echo ""

# Create test directory
TEST_DIR="/tmp/ocir-test-$(date +%s)"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo "Test directory: $TEST_DIR"
echo ""

# Step 1: Create test image
echo "Step 1: Creating test image..."
cat > Dockerfile << 'EOF'
FROM alpine:latest
RUN echo "OCIR Test - $(date)" > /test.txt
CMD ["sh", "-c", "cat /test.txt && echo 'Test successful!'"]
EOF

docker build -t ocir-test:latest . > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Test image built${NC}"
else
    echo -e "${RED}✗ Failed to build test image${NC}"
    cd /tmp && rm -rf "$TEST_DIR"
    exit 1
fi
echo ""

# Step 2: Tag for OCIR
echo "Step 2: Tagging image for OCIR..."
IMAGE_TAG="test-$(date +%Y%m%d-%H%M%S)"
FULL_IMAGE="${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/ocir-test:${IMAGE_TAG}"

docker tag ocir-test:latest "$FULL_IMAGE"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Image tagged${NC}"
    echo "  Tag: $IMAGE_TAG"
    echo "  Full: $FULL_IMAGE"
else
    echo -e "${RED}✗ Failed to tag image${NC}"
    cd /tmp && rm -rf "$TEST_DIR"
    exit 1
fi
echo ""

# Step 3: Push to OCIR
echo "Step 3: Pushing image to OCIR..."
echo "This may take a moment..."
if docker push "$FULL_IMAGE" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Image pushed to OCIR${NC}"
    echo "  Repository: ${TENANCY_NAMESPACE}/ocir-test"
    echo "  Tag: $IMAGE_TAG"
else
    echo -e "${RED}✗ Failed to push image${NC}"
    echo ""
    echo "Common issues:"
    echo "  1. Auth token expired - generate new token"
    echo "  2. Insufficient permissions - check OCI policies"
    echo "  3. Network issues - check internet connection"
    cd /tmp && rm -rf "$TEST_DIR"
    exit 1
fi
echo ""

# Step 4: Remove local image
echo "Step 4: Removing local image..."
docker rmi "$FULL_IMAGE" > /dev/null 2>&1
docker rmi ocir-test:latest > /dev/null 2>&1
echo -e "${GREEN}✓ Local images removed${NC}"
echo ""

# Step 5: Pull from OCIR
echo "Step 5: Pulling image from OCIR..."
echo "This may take a moment..."
if docker pull "$FULL_IMAGE" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Image pulled from OCIR${NC}"
else
    echo -e "${RED}✗ Failed to pull image${NC}"
    cd /tmp && rm -rf "$TEST_DIR"
    exit 1
fi
echo ""

# Step 6: Run container test
echo "Step 6: Running container test..."
OUTPUT=$(docker run --rm "$FULL_IMAGE" 2>&1)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Container ran successfully${NC}"
    echo "  Output: $OUTPUT"
else
    echo -e "${RED}✗ Container failed to run${NC}"
    cd /tmp && rm -rf "$TEST_DIR"
    exit 1
fi
echo ""

# Cleanup
echo "Cleaning up..."
docker rmi "$FULL_IMAGE" > /dev/null 2>&1
cd /tmp && rm -rf "$TEST_DIR"
echo -e "${GREEN}✓ Cleanup complete${NC}"
echo ""

# Offer to delete OCIR repository
echo "=========================================="
echo "Test Complete!"
echo "=========================================="
echo ""
echo "Test repository created in OCIR:"
echo "  Repository: ${TENANCY_NAMESPACE}/ocir-test"
echo "  Tag: $IMAGE_TAG"
echo ""
echo "To delete the test repository:"
echo "  1. Go to OCI Console → Developer Services → Container Registry"
echo "  2. Find 'ocir-test' repository"
echo "  3. Click ... → Delete"
echo ""
echo "Or use CLI:"
echo "  REPO_OCID=\$(oci artifacts container repository list \\"
echo "    --compartment-id <compartment-ocid> \\"
echo "    --display-name ocir-test \\"
echo "    --query 'data[0].id' --raw-output)"
echo "  oci artifacts container repository delete --repository-id \$REPO_OCID --force"
echo ""

echo -e "${GREEN}✓ OCIR push/pull test successful!${NC}"
echo ""
echo "Next steps:"
echo "  1. Build and push application images"
echo "  2. Create Kubernetes ImagePullSecrets"
echo "  3. Deploy applications to OKE"
