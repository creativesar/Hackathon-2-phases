# OCIR (Oracle Container Registry) Setup Guide - Task T-503

## Overview

This guide provides detailed instructions for setting up Oracle Container Registry (OCIR) for the Phase 5 cloud deployment. OCIR is Oracle Cloud's managed Docker registry service, integrated with OKE.

**Target Configuration**:
- Registry: Oracle Container Registry (OCIR)
- Region: Same as OKE cluster region
- Repositories: todo-frontend, todo-backend, todo-recurring-service, todo-notification-service
- Authentication: OCI Auth Token
- Integration: Kubernetes ImagePullSecrets

---

## Prerequisites

✅ **Completed**:
- Task T-501: Cloud provider selected (OKE)
- Task T-502: OKE cluster running
- OCI CLI configured
- Docker installed and running

✅ **Required**:
- Active OCI account
- Tenancy namespace known
- Docker Desktop running
- kubectl configured for OKE cluster

---

## Understanding OCIR

### OCIR Endpoint Structure

```
<region-key>.ocir.io/<tenancy-namespace>/<repository-name>:<tag>
```

**Example**:
```
iad.ocir.io/mytenancy/todo-frontend:latest
iad.ocir.io/mytenancy/todo-backend:v1.0.0
```

### Region Keys

| Region Name | Region Key | Example Endpoint |
|-------------|------------|------------------|
| US East (Ashburn) | iad | iad.ocir.io |
| US West (Phoenix) | phx | phx.ocir.io |
| US West (San Jose) | sjc | sjc.ocir.io |
| Canada (Toronto) | yyz | yyz.ocir.io |
| Canada (Montreal) | yul | yul.ocir.io |
| UK (London) | lhr | lhr.ocir.io |
| Germany (Frankfurt) | fra | fra.ocir.io |
| Switzerland (Zurich) | zrh | zrh.ocir.io |
| Netherlands (Amsterdam) | ams | ams.ocir.io |

Full list: https://docs.oracle.com/en-us/iaas/Content/Registry/Concepts/registryprerequisites.htm#regional-availability

---

## Step 1: Get Tenancy Namespace

### Option A: OCI CLI (Recommended)

```bash
# Get tenancy namespace
oci os ns get

# Output example:
# {
#   "data": "mytenancy"
# }

# Save to variable
export TENANCY_NAMESPACE=$(oci os ns get --query "data" --raw-output)
echo "Tenancy Namespace: $TENANCY_NAMESPACE"
```

### Option B: OCI Console

1. Navigate to: **Profile Icon (top right)** → **Tenancy: <name>**
2. Look for "Object Storage Namespace"
3. Copy the namespace value

**Save this value** - you'll need it for Docker login and image paths.

---

## Step 2: Generate Auth Token

Auth tokens are used as passwords for Docker login to OCIR.

### Generate Token via Console

1. **Navigate to**: Profile Icon → **User Settings**
2. Click **Auth Tokens** (left sidebar under Resources)
3. Click **Generate Token**
4. **Description**: Enter `ocir-token-todo-app`
5. Click **Generate Token**
6. **IMPORTANT**: Copy the token immediately
   - ⚠️ It will only be shown once
   - ⚠️ Cannot be retrieved later
   - ⚠️ Store securely (password manager)

**Token Format**: Long alphanumeric string (e.g., `AbCd1234EfGh5678...`)

### Security Best Practices

✅ **DO**:
- Store token in password manager
- Use separate token per application/environment
- Rotate tokens periodically (every 90 days)
- Delete unused tokens

❌ **DON'T**:
- Commit tokens to git
- Share tokens via email/chat
- Use same token across multiple projects
- Store in plain text files

---

## Step 3: Docker Login to OCIR

### Get Required Information

Before logging in, collect:

1. **Region Key**: e.g., `iad`, `phx` (from Step 1 table)
2. **Tenancy Namespace**: from Step 1
3. **OCI Username**: Your OCI username
   - **Format**: For federated users: `oracleidentitycloudservice/<username>`
   - **Format**: For native OCI users: `<username>`
4. **Auth Token**: from Step 2

### Login Command

```bash
# Set variables
export REGION_KEY="iad"  # Change to your region
export TENANCY_NAMESPACE="mytenancy"  # From Step 1
export OCI_USERNAME="oracleidentitycloudservice/user@example.com"  # Your username
export AUTH_TOKEN="<your-auth-token>"  # From Step 2

# Login to OCIR
docker login ${REGION_KEY}.ocir.io \
  -u "${TENANCY_NAMESPACE}/${OCI_USERNAME}" \
  -p "${AUTH_TOKEN}"

# Expected output:
# Login Succeeded
```

### Username Format Examples

**Federated User (IDCS)**:
```bash
# Username in OCI Console: user@example.com
# Docker login username: mytenancy/oracleidentitycloudservice/user@example.com

docker login iad.ocir.io \
  -u "mytenancy/oracleidentitycloudservice/user@example.com" \
  -p "AbCd1234..."
```

**Native OCI User**:
```bash
# Username in OCI Console: john.doe
# Docker login username: mytenancy/john.doe

docker login iad.ocir.io \
  -u "mytenancy/john.doe" \
  -p "AbCd1234..."
```

### Troubleshooting Login

**Error: "unauthorized: authentication required"**
- Check username format (tenancy-namespace/username)
- Verify auth token is correct
- Ensure user has permissions to access OCIR

**Error: "denied: Your authorization token has expired"**
- Token may be revoked or expired
- Generate new auth token
- Update login command

**Error: "denied: requested access to the resource is denied"**
- Check user permissions (see Step 4)
- Verify compartment access

---

## Step 4: Configure User Permissions

Ensure your OCI user has permissions to push/pull images.

### Required Policies

**For Root Compartment** (recommended for Always Free):

```
Allow group <your-group> to manage repos in tenancy
Allow group <your-group> to read repos in tenancy
```

### Add Policy via Console

1. **Navigate to**: Identity & Security → **Policies**
2. Select **Root Compartment**
3. Click **Create Policy**
4. **Name**: `ocir-access-policy`
5. **Description**: `Allow OCIR access for todo-app`
6. **Policy Statements**:
   ```
   Allow group Administrators to manage repos in tenancy
   Allow group Administrators to read repos in tenancy
   ```
7. Click **Create**

### Verify Permissions

```bash
# Test by listing repositories
oci artifacts container repository list \
  --compartment-id <compartment-ocid> \
  --display-name todo-frontend

# Should return empty list (no error)
```

---

## Step 5: Create Repository Structure

OCIR repositories are created automatically when you first push an image, but you can pre-create them for better organization.

### Repository Naming Convention

```
<tenancy-namespace>/<repository-name>
```

**Repositories needed**:
- `todo-frontend` - Next.js frontend
- `todo-backend` - FastAPI backend
- `todo-recurring-service` - Recurring task service
- `todo-notification-service` - Notification service

### Pre-create Repositories (Optional)

**Via Console**:
1. Navigate to: **Developer Services** → **Container Registry**
2. Click **Create Repository**
3. **Name**: `todo-frontend`
4. **Access**: Private
5. **Compartment**: Select root or todo compartment
6. Click **Create**
7. Repeat for other repositories

**Via CLI**:
```bash
# Set compartment OCID
export COMPARTMENT_OCID="<your-compartment-ocid>"

# Create repositories
for repo in todo-frontend todo-backend todo-recurring-service todo-notification-service; do
  echo "Creating repository: $repo"
  oci artifacts container repository create \
    --compartment-id "$COMPARTMENT_OCID" \
    --display-name "$repo" \
    --is-public false
done
```

**Note**: Repositories are also auto-created on first push, so this step is optional.

---

## Step 6: Test Image Push/Pull

### 6.1 Create Test Image

```bash
# Create test directory
mkdir -p /tmp/ocir-test
cd /tmp/ocir-test

# Create simple Dockerfile
cat > Dockerfile << 'EOF'
FROM alpine:latest
RUN echo "OCIR Test Image" > /test.txt
CMD ["cat", "/test.txt"]
EOF

# Build test image
docker build -t ocir-test:v1 .
```

### 6.2 Tag Image for OCIR

```bash
# Set variables (use your values)
export REGION_KEY="iad"
export TENANCY_NAMESPACE="mytenancy"
export OCIR_ENDPOINT="${REGION_KEY}.ocir.io"

# Tag image
docker tag ocir-test:v1 \
  ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/ocir-test:v1

# Verify tag
docker images | grep ocir-test
```

### 6.3 Push Image to OCIR

```bash
# Push image
docker push ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/ocir-test:v1

# Expected output:
# The push refers to repository [iad.ocir.io/mytenancy/ocir-test]
# v1: digest: sha256:abc123... size: 527
```

### 6.4 Verify in OCIR

**Via Console**:
1. Navigate to: **Developer Services** → **Container Registry**
2. You should see `ocir-test` repository
3. Click on repository to see `v1` tag

**Via CLI**:
```bash
# List repositories
oci artifacts container repository list \
  --compartment-id "$COMPARTMENT_OCID" \
  --display-name "ocir-test"

# List image versions
oci artifacts container image list \
  --compartment-id "$COMPARTMENT_OCID" \
  --repository-name "ocir-test"
```

### 6.5 Pull Image from OCIR

```bash
# Remove local image
docker rmi ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/ocir-test:v1
docker rmi ocir-test:v1

# Pull from OCIR
docker pull ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/ocir-test:v1

# Run container to verify
docker run --rm ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/ocir-test:v1

# Expected output: OCIR Test Image
```

### 6.6 Cleanup Test Resources

```bash
# Remove local images
docker rmi ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/ocir-test:v1

# Delete repository (optional)
oci artifacts container repository delete \
  --repository-id <repository-ocid> \
  --force
```

---

## Step 7: Create Kubernetes ImagePullSecret

Kubernetes needs credentials to pull images from OCIR.

### 7.1 Create Secret in todo-app Namespace

```bash
# Set variables (use your values)
export REGION_KEY="iad"
export TENANCY_NAMESPACE="mytenancy"
export OCI_USERNAME="oracleidentitycloudservice/user@example.com"
export AUTH_TOKEN="<your-auth-token>"
export OCIR_ENDPOINT="${REGION_KEY}.ocir.io"

# Create secret
kubectl create secret docker-registry ocir-secret \
  --docker-server="${OCIR_ENDPOINT}" \
  --docker-username="${TENANCY_NAMESPACE}/${OCI_USERNAME}" \
  --docker-password="${AUTH_TOKEN}" \
  --docker-email="<your-email>" \
  --namespace=todo-app

# Verify secret created
kubectl get secret ocir-secret -n todo-app

# Expected output:
# NAME          TYPE                             DATA   AGE
# ocir-secret   kubernetes.io/dockerconfigjson   1      5s
```

### 7.2 Verify Secret Contents

```bash
# Decode and inspect secret
kubectl get secret ocir-secret -n todo-app -o jsonpath='{.data.\.dockerconfigjson}' | base64 --decode | jq

# Should show Docker auth config with OCIR endpoint
```

### 7.3 Create Secrets in Other Namespaces

```bash
# Create in monitoring namespace (for custom monitoring images)
kubectl create secret docker-registry ocir-secret \
  --docker-server="${OCIR_ENDPOINT}" \
  --docker-username="${TENANCY_NAMESPACE}/${OCI_USERNAME}" \
  --docker-password="${AUTH_TOKEN}" \
  --docker-email="<your-email>" \
  --namespace=monitoring

# Create in kafka namespace (if using custom Kafka images)
kubectl create secret docker-registry ocir-secret \
  --docker-server="${OCIR_ENDPOINT}" \
  --docker-username="${TENANCY_NAMESPACE}/${OCI_USERNAME}" \
  --docker-password="${AUTH_TOKEN}" \
  --docker-email="<your-email>" \
  --namespace=kafka
```

### 7.4 Use Secret in Deployment

**Example Deployment YAML**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-frontend
  namespace: todo-app
spec:
  template:
    spec:
      imagePullSecrets:
      - name: ocir-secret
      containers:
      - name: frontend
        image: iad.ocir.io/mytenancy/todo-frontend:latest
```

---

## Step 8: Configure CI/CD Integration

### GitHub Actions Secrets

Add these secrets to your GitHub repository:

1. Navigate to: **Repository** → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `OCI_TENANCY_NAMESPACE` | `mytenancy` | Your tenancy namespace |
| `OCIR_USERNAME` | `mytenancy/oracleidentitycloudservice/user@example.com` | Full OCIR username |
| `OCIR_TOKEN` | `AbCd1234...` | Auth token |
| `OCIR_REGION_KEY` | `iad` | Region key |

### GitHub Actions Workflow Example

```yaml
name: Build and Push to OCIR

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Login to OCIR
        run: |
          echo "${{ secrets.OCIR_TOKEN }}" | docker login \
            ${{ secrets.OCIR_REGION_KEY }}.ocir.io \
            -u "${{ secrets.OCIR_USERNAME }}" \
            --password-stdin

      - name: Build and push frontend
        run: |
          docker build -t todo-frontend:${{ github.sha }} ./frontend
          docker tag todo-frontend:${{ github.sha }} \
            ${{ secrets.OCIR_REGION_KEY }}.ocir.io/${{ secrets.OCI_TENANCY_NAMESPACE }}/todo-frontend:${{ github.sha }}
          docker push ${{ secrets.OCIR_REGION_KEY }}.ocir.io/${{ secrets.OCI_TENANCY_NAMESPACE }}/todo-frontend:${{ github.sha }}
```

---

## Step 9: Image Tagging Strategy

### Tagging Best Practices

**Use multiple tags**:
```bash
# Git commit SHA (unique, immutable)
docker tag myapp:build ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/myapp:abc123

# Semantic version (release)
docker tag myapp:build ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/myapp:v1.2.3

# Latest (convenience)
docker tag myapp:build ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/myapp:latest

# Environment (staging, production)
docker tag myapp:build ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/myapp:production
```

### Recommended Tags

| Tag Type | Example | Use Case |
|----------|---------|----------|
| Git SHA | `abc123` | Traceability, rollback |
| Semantic Version | `v1.2.3` | Releases |
| Latest | `latest` | Development, convenience |
| Environment | `prod`, `staging` | Environment tracking |
| Date | `2026-02-04` | Time-based tracking |

### Tag Lifecycle

```bash
# Build image
docker build -t todo-frontend:build ./frontend

# Tag for OCIR (multiple tags)
COMMIT_SHA=$(git rev-parse --short HEAD)
docker tag todo-frontend:build ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/todo-frontend:${COMMIT_SHA}
docker tag todo-frontend:build ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/todo-frontend:latest

# Push all tags
docker push ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/todo-frontend:${COMMIT_SHA}
docker push ${OCIR_ENDPOINT}/${TENANCY_NAMESPACE}/todo-frontend:latest
```

---

## Step 10: Repository Management

### List Repositories

```bash
# Via CLI
oci artifacts container repository list \
  --compartment-id "$COMPARTMENT_OCID" \
  --all

# Filter by name
oci artifacts container repository list \
  --compartment-id "$COMPARTMENT_OCID" \
  --display-name "todo-*"
```

### List Image Versions

```bash
# List all versions in a repository
oci artifacts container image list \
  --compartment-id "$COMPARTMENT_OCID" \
  --repository-name "todo-frontend"
```

### Delete Image Version

```bash
# Delete specific version
oci artifacts container image delete \
  --image-id <image-ocid> \
  --force
```

### Repository Cleanup Policy

**Retention Policy** (optional):
- Keep last N versions
- Delete images older than X days
- Keep images with specific tags

**Example via Console**:
1. Navigate to repository
2. Click **Edit**
3. Set retention policy
4. Save

---

## Troubleshooting

### Issue: "unauthorized: authentication required"

**Cause**: Invalid credentials

**Solution**:
```bash
# Verify username format
echo "${TENANCY_NAMESPACE}/${OCI_USERNAME}"

# Regenerate auth token
# OCI Console → User Settings → Auth Tokens → Generate Token

# Re-login
docker login ${REGION_KEY}.ocir.io \
  -u "${TENANCY_NAMESPACE}/${OCI_USERNAME}" \
  -p "<new-auth-token>"
```

### Issue: "denied: requested access to the resource is denied"

**Cause**: Missing permissions

**Solution**:
```bash
# Check user groups
oci iam user list-groups --user-id <user-ocid>

# Verify policies
oci iam policy list --compartment-id <tenancy-ocid>

# Add required policies (see Step 4)
```

### Issue: Kubernetes pod fails to pull image

**Cause**: Missing or incorrect ImagePullSecret

**Solution**:
```bash
# Verify secret exists
kubectl get secret ocir-secret -n todo-app

# Recreate secret if needed
kubectl delete secret ocir-secret -n todo-app
kubectl create secret docker-registry ocir-secret \
  --docker-server="${OCIR_ENDPOINT}" \
  --docker-username="${TENANCY_NAMESPACE}/${OCI_USERNAME}" \
  --docker-password="${AUTH_TOKEN}" \
  --docker-email="<your-email>" \
  --namespace=todo-app

# Check pod events
kubectl describe pod <pod-name> -n todo-app
```

### Issue: Push fails with "blob upload unknown"

**Cause**: Network issues or registry problems

**Solution**:
```bash
# Retry push
docker push <image>

# Clear Docker cache and retry
docker system prune -a
docker build -t <image> .
docker push <image>
```

---

## Security Best Practices

### 1. Authentication

✅ **DO**:
- Use auth tokens (not user passwords)
- Rotate tokens every 90 days
- Use separate tokens per environment
- Store tokens in secret management systems

❌ **DON'T**:
- Commit tokens to git
- Share tokens in plaintext
- Use same token across projects

### 2. Image Security

✅ **DO**:
- Scan images for vulnerabilities
- Use minimal base images (alpine, distroless)
- Keep images updated
- Use specific version tags (not just `latest`)

❌ **DON'T**:
- Store secrets in images
- Use outdated base images
- Ignore security scan warnings

### 3. Access Control

✅ **DO**:
- Use private repositories
- Implement least privilege access
- Review access logs regularly
- Use OCI policies for fine-grained control

❌ **DON'T**:
- Make repositories public unnecessarily
- Grant broad permissions
- Share credentials

---

## Summary Checklist

- [ ] Tenancy namespace obtained
- [ ] Auth token generated and stored securely
- [ ] Docker logged in to OCIR
- [ ] User permissions configured
- [ ] Test image pushed successfully
- [ ] Test image pulled successfully
- [ ] Kubernetes ImagePullSecret created in todo-app namespace
- [ ] Kubernetes ImagePullSecret created in monitoring namespace
- [ ] Kubernetes ImagePullSecret created in kafka namespace
- [ ] CI/CD secrets configured
- [ ] Image tagging strategy defined
- [ ] Repository cleanup policy set (optional)

---

## Next Steps

✅ **Task T-503 Complete** - Container registry configured

➡️ **Next Task: T-504** - Update Task model for advanced features
   - Add `due_date` field
   - Add `recurrence` field
   - Add `reminder_sent` field
   - Create database migration

➡️ **Next Task: T-507** - Deploy Kafka cluster
   - Install Strimzi operator
   - Create Kafka cluster manifest
   - Deploy to OKE

---

## Additional Resources

- [OCIR Documentation](https://docs.oracle.com/en-us/iaas/Content/Registry/home.htm)
- [OCIR Regions](https://docs.oracle.com/en-us/iaas/Content/Registry/Concepts/registryprerequisites.htm#regional-availability)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes ImagePullSecrets](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
- [GitHub Actions with OCIR](https://docs.oracle.com/en-us/iaas/Content/Registry/Tasks/registrypushingimageswithgithubactions.htm)

---

**Document Version**: 1.0
**Last Updated**: 2026-02-04
**Status**: Ready for execution
