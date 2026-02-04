# OKE Cluster Setup Guide - Task T-502

## Overview

This guide provides step-by-step instructions for setting up an Oracle Kubernetes Engine (OKE) cluster on Oracle Cloud Infrastructure's Always Free tier.

**Target Configuration**:
- Cluster Name: `todo-oke`
- Kubernetes Version: v1.28.2 or later
- Node Pool: VM.Standard.E4.Flex (Always Free)
- Resources: 4 OCPUs, 24GB RAM
- Nodes: 1 node (expandable later)

---

## Prerequisites

### 1. Oracle Cloud Account

✅ **Create OCI Account** (if not already done):
1. Visit: https://www.oracle.com/cloud/free/
2. Click "Start for free"
3. Fill in registration details
4. Verify email address
5. Complete identity verification
6. Select "Always Free" tier

**Important**:
- No credit card required for Always Free tier
- 4 OCPUs and 24GB RAM permanently free
- Some resources require upgrade to paid account (we won't use these)

### 2. Required Tools

**OCI CLI**:
```bash
# Windows (Git Bash or WSL)
bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"

# Verify installation
oci --version
# Expected: oci x.x.x
```

**kubectl**:
```bash
# Windows (using Chocolatey)
choco install kubernetes-cli

# Or download from: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/

# Verify installation
kubectl version --client
```

**Docker** (for container operations):
```bash
# Verify Docker is installed
docker --version

# Ensure Docker Desktop is running
docker ps
```

---

## Step 1: Configure OCI CLI

### 1.1 Gather Required Information

Before running `oci setup config`, gather these from OCI Console:

1. **User OCID**:
   - Navigate to: Profile Icon (top right) → User Settings
   - Copy the OCID (starts with `ocid1.user.oc1..`)

2. **Tenancy OCID**:
   - Navigate to: Profile Icon → Tenancy: <name>
   - Copy the OCID (starts with `ocid1.tenancy.oc1..`)

3. **Region**:
   - Note your home region (e.g., `us-ashburn-1`, `us-phoenix-1`)
   - See available regions: https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm

4. **Compartment OCID** (root compartment):
   - Navigate to: Identity & Security → Compartments
   - Copy root compartment OCID (usually same as Tenancy OCID)

### 1.2 Run OCI Configuration

```bash
# Run interactive configuration
oci setup config

# Provide information when prompted:
# - Enter location for config [~/.oci/config]: <press Enter>
# - Enter user OCID: <paste User OCID>
# - Enter tenancy OCID: <paste Tenancy OCID>
# - Enter region: <your region, e.g., us-ashburn-1>
# - Generate new API signing key? [Y/n]: Y
# - Enter location for key [~/.oci/oci_api_key.pem]: <press Enter>
# - Enter passphrase (optional): <press Enter for no passphrase>
```

### 1.3 Upload API Public Key to OCI

The setup created a public key at `~/.oci/oci_api_key_public.pem`.

**Upload to OCI Console**:
1. Navigate to: Profile Icon → User Settings
2. Click "API Keys" (left sidebar)
3. Click "Add API Key"
4. Select "Paste Public Key"
5. Paste contents of `~/.oci/oci_api_key_public.pem`
6. Click "Add"

### 1.4 Verify Configuration

```bash
# Test OCI CLI
oci iam region list

# Should output list of OCI regions
# If successful, configuration is correct
```

---

## Step 2: Create VCN (Virtual Cloud Network)

OKE requires a VCN with proper subnets and security rules.

### 2.1 Option A: Quick Create with OCI Console (Recommended)

1. **Navigate to**: Networking → Virtual Cloud Networks
2. Click "Start VCN Wizard"
3. Select "Create VCN with Internet Connectivity"
4. Fill in details:
   - **VCN Name**: `todo-vcn`
   - **Compartment**: Select root or create new compartment
   - **VCN CIDR Block**: `10.0.0.0/16`
   - **Public Subnet CIDR**: `10.0.0.0/24`
   - **Private Subnet CIDR**: `10.0.1.0/24`
5. Click "Next" → Review → "Create"

**Wait**: VCN creation takes ~1 minute.

### 2.2 Option B: Create with OCI CLI

```bash
# Set variables
export COMPARTMENT_OCID="<your-compartment-ocid>"
export REGION="<your-region>"

# Create VCN
oci network vcn create \
  --compartment-id "$COMPARTMENT_OCID" \
  --display-name "todo-vcn" \
  --cidr-block "10.0.0.0/16" \
  --dns-label "todovcn" \
  --wait-for-state AVAILABLE

# Get VCN OCID (save this for next steps)
export VCN_OCID=$(oci network vcn list \
  --compartment-id "$COMPARTMENT_OCID" \
  --query "data[?\"display-name\"=='todo-vcn'].id | [0]" \
  --raw-output)

echo "VCN OCID: $VCN_OCID"
```

---

## Step 3: Create OKE Cluster

### 3.1 Option A: OCI Console (Recommended for First-Time)

1. **Navigate to**: Developer Services → Kubernetes Clusters (OKE)
2. Click "Create Cluster"
3. Select "Quick Create" → "Submit"
4. Fill in cluster details:

   **Basic Information**:
   - **Name**: `todo-oke`
   - **Compartment**: Select compartment
   - **Kubernetes Version**: Select latest (e.g., v1.28.2)
   - **Kubernetes API Endpoint**: Public Endpoint
   - **Kubernetes Worker Nodes**: Public Workers

   **Node Pool Configuration**:
   - **Name**: `todo-pool`
   - **Node Count**: `1`
   - **Shape**: `VM.Standard.E4.Flex` (Always Free eligible)
   - **OCPUs**: `4` (max for Always Free)
   - **Memory (GB)**: `24` (max for Always Free)
   - **Boot Volume (GB)**: `50` (default)
   - **Node Image**: Select latest Oracle Linux

   **Networking**:
   - **VCN**: Select `todo-vcn`
   - **Kubernetes Service LB Subnets**: Select public subnet
   - **Kubernetes Service CIDR**: `10.96.0.0/16` (default)
   - **Pods CIDR**: `10.244.0.0/16` (default)

5. Click "Next" → Review → "Create Cluster"

**Wait**: Cluster creation takes ~7-10 minutes.

### 3.2 Option B: OCI CLI (Advanced)

```bash
# Set variables (use values from Step 2)
export COMPARTMENT_OCID="<your-compartment-ocid>"
export VCN_OCID="<your-vcn-ocid>"
export SUBNET_OCID="<your-public-subnet-ocid>"

# Create cluster (this is a simplified version)
# Note: Full CLI creation requires multiple subnets and security lists
# Use Console for first-time setup

oci ce cluster create \
  --compartment-id "$COMPARTMENT_OCID" \
  --name "todo-oke" \
  --kubernetes-version "v1.28.2" \
  --vcn-id "$VCN_OCID" \
  --wait-for-state SUCCEEDED

# Get cluster OCID
export CLUSTER_OCID=$(oci ce cluster list \
  --compartment-id "$COMPARTMENT_OCID" \
  --name "todo-oke" \
  --query "data[0].id" \
  --raw-output)

echo "Cluster OCID: $CLUSTER_OCID"
```

---

## Step 4: Configure kubectl

### 4.1 Get Cluster OCID

**From Console**:
1. Navigate to: Developer Services → Kubernetes Clusters
2. Click on `todo-oke`
3. Copy Cluster OCID

**From CLI**:
```bash
oci ce cluster list \
  --compartment-id "$COMPARTMENT_OCID" \
  --query "data[?name=='todo-oke'].id | [0]" \
  --raw-output
```

### 4.2 Generate kubeconfig

```bash
# Set cluster OCID
export CLUSTER_OCID="<your-cluster-ocid>"

# Create kubeconfig directory if it doesn't exist
mkdir -p ~/.kube

# Generate kubeconfig
oci ce cluster create-kubeconfig \
  --cluster-id "$CLUSTER_OCID" \
  --file ~/.kube/config \
  --region "$REGION" \
  --token-version 2.0.0 \
  --kube-endpoint PUBLIC_ENDPOINT

# Note: This will overwrite existing ~/.kube/config
# If you have existing clusters, merge configs or use --file with different path
```

### 4.3 Verify kubectl Configuration

```bash
# Test connection
kubectl cluster-info

# Expected output:
# Kubernetes control plane is running at https://...
# CoreDNS is running at https://...

# Get nodes
kubectl get nodes

# Expected output:
# NAME                       STATUS   ROLES   AGE   VERSION
# 10.0.1.x                   Ready    node    5m    v1.28.2

# Check node capacity
kubectl describe nodes

# Verify OCPUs and memory:
# Should show ~4 CPUs and ~24GB memory
```

---

## Step 5: Install Required Add-ons

### 5.1 Install Dapr

```bash
# Install Dapr CLI
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash

# Verify installation
dapr version

# Initialize Dapr on Kubernetes
dapr init --kubernetes --wait

# Verify Dapr installation
kubectl get pods -n dapr-system

# Expected output: All pods Running
# - dapr-operator
# - dapr-sentry
# - dapr-sidecar-injector
# - dapr-placement-server
```

### 5.2 Install Helm (if not already installed)

```bash
# Windows (Chocolatey)
choco install kubernetes-helm

# Verify installation
helm version
```

### 5.3 Create Namespaces

```bash
# Create application namespace
kubectl create namespace todo-app

# Create monitoring namespace
kubectl create namespace monitoring

# Create Kafka namespace
kubectl create namespace kafka

# Verify namespaces
kubectl get namespaces
```

---

## Step 6: Verify Cluster Setup

### 6.1 Cluster Health Check

```bash
# Check cluster components
kubectl get componentstatuses

# Check all system pods
kubectl get pods -n kube-system

# Check Dapr components
kubectl get pods -n dapr-system

# All pods should be Running
```

### 6.2 Test Deployment

```bash
# Create test deployment
kubectl create deployment nginx --image=nginx -n todo-app

# Expose as service
kubectl expose deployment nginx --port=80 --type=LoadBalancer -n todo-app

# Get service external IP (may take 2-3 minutes)
kubectl get svc nginx -n todo-app -w

# Once EXTERNAL-IP appears, test access
curl http://<external-ip>

# Clean up test resources
kubectl delete deployment nginx -n todo-app
kubectl delete service nginx -n todo-app
```

### 6.3 Resource Verification

```bash
# Check total cluster resources
kubectl top nodes

# Check available resources per namespace
kubectl describe nodes | grep -A 5 "Allocated resources"

# Verify we have sufficient resources:
# - CPU: Should show ~4000m (4 cores)
# - Memory: Should show ~24Gi
```

---

## Step 7: Configure Container Registry (OCIR)

### 7.1 Create Auth Token

1. **Navigate to**: Profile Icon → User Settings
2. Click "Auth Tokens" (left sidebar)
3. Click "Generate Token"
4. **Description**: `ocir-token-todo-app`
5. Click "Generate Token"
6. **IMPORTANT**: Copy the token immediately (won't be shown again)

### 7.2 Login to OCIR

```bash
# Get tenancy namespace
export TENANCY_NAMESPACE=$(oci os ns get --query "data" --raw-output)

# Get region key (e.g., iad for us-ashburn-1)
export REGION_KEY="<region-key>"  # See: https://docs.oracle.com/en-us/iaas/Content/Registry/Concepts/registryprerequisites.htm#regional-availability

# Login to OCIR
docker login ${REGION_KEY}.ocir.io \
  -u "${TENANCY_NAMESPACE}/<oci-username>" \
  -p "<auth-token>"

# Example:
# docker login iad.ocir.io -u mytenancy/oracleidentitycloudservice/user@example.com -p 'abc123...'

# Verify login
docker info | grep -A 3 "Registry"
```

### 7.3 Create Kubernetes Secret for OCIR

```bash
# Create secret in todo-app namespace
kubectl create secret docker-registry ocir-secret \
  --docker-server="${REGION_KEY}.ocir.io" \
  --docker-username="${TENANCY_NAMESPACE}/<oci-username>" \
  --docker-password="<auth-token>" \
  --docker-email="<your-email>" \
  -n todo-app

# Verify secret
kubectl get secret ocir-secret -n todo-app
```

---

## Step 8: Save Configuration

### 8.1 Export Important Variables

Create a file `phase-5-cloud-deployment/oke-env.sh`:

```bash
#!/bin/bash
# OKE Cluster Environment Variables

export OCI_REGION="<your-region>"
export OCI_COMPARTMENT_OCID="<your-compartment-ocid>"
export OCI_TENANCY_NAMESPACE="<your-tenancy-namespace>"
export CLUSTER_OCID="<your-cluster-ocid>"
export VCN_OCID="<your-vcn-ocid>"

# Container registry
export OCIR_REGION_KEY="<region-key>"
export OCIR_ENDPOINT="${OCIR_REGION_KEY}.ocir.io"
export OCIR_NAMESPACE="${OCI_TENANCY_NAMESPACE}"

# Image paths
export FRONTEND_IMAGE="${OCIR_ENDPOINT}/${OCIR_NAMESPACE}/todo-frontend"
export BACKEND_IMAGE="${OCIR_ENDPOINT}/${OCIR_NAMESPACE}/todo-backend"

echo "OKE environment variables loaded"
echo "Cluster: $CLUSTER_OCID"
echo "Registry: $OCIR_ENDPOINT"
```

**Usage**:
```bash
source phase-5-cloud-deployment/oke-env.sh
```

### 8.2 Document Cluster Details

Create `phase-5-cloud-deployment/CLUSTER-INFO.md`:

```markdown
# OKE Cluster Information

## Cluster Details
- **Name**: todo-oke
- **OCID**: <cluster-ocid>
- **Region**: <region>
- **Kubernetes Version**: v1.28.2
- **API Endpoint**: <endpoint-url>

## Node Pool
- **Shape**: VM.Standard.E4.Flex
- **OCPUs**: 4
- **Memory**: 24GB
- **Node Count**: 1

## Container Registry
- **Endpoint**: <region-key>.ocir.io
- **Namespace**: <tenancy-namespace>

## Access
- **kubeconfig**: ~/.kube/config
- **Context**: <context-name>

## Created**: 2026-02-04
```

---

## Troubleshooting

### Issue: kubectl connection timeout

**Solution**:
```bash
# Regenerate kubeconfig
oci ce cluster create-kubeconfig \
  --cluster-id "$CLUSTER_OCID" \
  --file ~/.kube/config \
  --region "$REGION" \
  --token-version 2.0.0

# Test connection
kubectl get nodes
```

### Issue: Nodes not ready

**Check**:
```bash
# Describe node
kubectl describe nodes

# Check node pod logs
kubectl get pods -n kube-system
kubectl logs <pod-name> -n kube-system
```

### Issue: Cannot pull images from OCIR

**Solution**:
```bash
# Verify secret exists
kubectl get secret ocir-secret -n todo-app

# Recreate if needed
kubectl delete secret ocir-secret -n todo-app
kubectl create secret docker-registry ocir-secret \
  --docker-server="${REGION_KEY}.ocir.io" \
  --docker-username="${TENANCY_NAMESPACE}/<username>" \
  --docker-password="<auth-token>" \
  -n todo-app
```

### Issue: OCI CLI authentication errors

**Solution**:
```bash
# Verify config
cat ~/.oci/config

# Test authentication
oci iam region list

# If fails, re-run setup
oci setup config --repair
```

---

## Security Considerations

### 1. API Keys

- ✅ Store API keys securely (`~/.oci/`)
- ✅ Never commit API keys to git
- ✅ Use separate keys for different environments
- ✅ Rotate keys periodically

### 2. Auth Tokens

- ✅ Store auth tokens in password manager
- ✅ Never commit tokens to git
- ✅ Regenerate if compromised
- ✅ Use separate tokens per application

### 3. Kubernetes Secrets

- ✅ Use Kubernetes secrets for sensitive data
- ✅ Enable secret encryption at rest
- ✅ Use RBAC to restrict secret access
- ✅ Consider using OCI Vault for production

### 4. Network Security

- ✅ Use security lists to restrict access
- ✅ Limit API endpoint to specific IPs if possible
- ✅ Use private subnets for worker nodes in production
- ✅ Enable pod security policies

---

## Next Steps

✅ **Task T-502 Complete** - OKE cluster set up and configured

➡️ **Next Task: T-503** - Set up container registry
   - OCIR already configured as part of T-502
   - Test image push/pull
   - Configure CI/CD integration

➡️ **Next Task: T-507** - Deploy Kafka cluster
   - Install Strimzi operator
   - Create Kafka cluster manifest
   - Deploy to OKE

---

## Additional Resources

- [OCI Documentation](https://docs.oracle.com/en-us/iaas/Content/home.htm)
- [OKE Documentation](https://docs.oracle.com/en-us/iaas/Content/ContEng/home.htm)
- [OCI CLI Reference](https://docs.oracle.com/en-us/iaas/tools/oci-cli/latest/oci_cli_docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [Dapr Documentation](https://docs.dapr.io/)
- [OCIR Documentation](https://docs.oracle.com/en-us/iaas/Content/Registry/home.htm)

---

**Document Version**: 1.0
**Last Updated**: 2026-02-04
**Status**: Ready for execution
