# Phase 5 Setup Scripts

This directory contains scripts for setting up and managing the OKE cluster and related infrastructure.

## Scripts

### 1. verify-oke-setup.sh

**Purpose**: Comprehensive verification of OKE cluster setup

**Usage**:
```bash
chmod +x scripts/verify-oke-setup.sh
./scripts/verify-oke-setup.sh
```

**Checks**:
- ✓ OCI CLI installation and configuration
- ✓ kubectl installation and configuration
- ✓ Cluster connectivity
- ✓ Node resources (CPU, memory)
- ✓ Dapr installation
- ✓ Helm installation
- ✓ Docker installation and daemon
- ✓ Required namespaces
- ✓ OCIR login status
- ✓ OCIR Kubernetes secret
- ✓ System pods health

**Exit Codes**:
- `0`: All checks passed or warnings only
- `1`: One or more critical checks failed

---

### 2. create-namespaces.sh

**Purpose**: Create all required Kubernetes namespaces

**Usage**:
```bash
chmod +x scripts/create-namespaces.sh
./scripts/create-namespaces.sh
```

**Namespaces Created**:
- `todo-app`: Application services (frontend, backend, microservices)
- `monitoring`: Monitoring stack (Prometheus, Grafana, Loki)
- `kafka`: Kafka cluster and related components

**Labels Applied**:
- `todo-app`: app=todo-app
- `monitoring`: monitoring=true
- `kafka`: kafka=true

---

### 3. verify-ocir-setup.sh

**Purpose**: Comprehensive verification of OCIR setup

**Usage**:
```bash
chmod +x scripts/verify-ocir-setup.sh
./scripts/verify-ocir-setup.sh
```

**Checks**:
- ✓ OCI CLI configuration
- ✓ Tenancy namespace retrieval
- ✓ Docker installation and daemon
- ✓ OCIR login status
- ✓ OCIR repositories existence
- ✓ Kubernetes connection
- ✓ OCIR secrets in all namespaces (todo-app, monitoring, kafka)
- ✓ Environment variables
- ✓ Region configuration

**Exit Codes**:
- `0`: All checks passed or warnings only
- `1`: One or more critical checks failed

---

### 4. test-ocir-push-pull.sh

**Purpose**: Test OCIR connectivity by pushing and pulling a test image

**Usage**:
```bash
chmod +x scripts/test-ocir-push-pull.sh
./scripts/test-ocir-push-pull.sh
```

**Test Steps**:
1. Builds a test Alpine image
2. Tags image for OCIR
3. Pushes image to OCIR
4. Removes local image
5. Pulls image from OCIR
6. Runs container to verify
7. Cleans up test resources

**Prerequisites**:
- Docker logged in to OCIR
- OCI CLI configured
- Internet connection

---

### 5. create-ocir-secrets.sh

**Purpose**: Create OCIR ImagePullSecrets in all Kubernetes namespaces

**Usage**:
```bash
chmod +x scripts/create-ocir-secrets.sh
./scripts/create-ocir-secrets.sh
```

**Interactive Prompts**:
- OCI Username (e.g., `oracleidentitycloudservice/user@example.com`)
- Auth Token (from OCI Console)
- Email address

**Actions**:
- Creates `ocir-secret` in todo-app namespace
- Creates `ocir-secret` in monitoring namespace
- Creates `ocir-secret` in kafka namespace
- Verifies all secrets created successfully

---

## Prerequisites

Before running these scripts:

1. **Install required tools**:
   - OCI CLI
   - kubectl
   - Docker
   - (Optional) Dapr CLI
   - (Optional) Helm

2. **Configure OCI CLI**:
   ```bash
   oci setup config
   ```

3. **Create OKE cluster** (via Console or CLI)

4. **Generate kubeconfig**:
   ```bash
   oci ce cluster create-kubeconfig \
     --cluster-id <cluster-ocid> \
     --file ~/.kube/config \
     --region <region>
   ```

---

## Execution Order

1. Set up OKE cluster (manual via Console/CLI)
2. Run `create-namespaces.sh` - Create Kubernetes namespaces
3. Run `verify-oke-setup.sh` - Verify OKE cluster setup
4. Login to OCIR (`docker login <region>.ocir.io`)
5. Run `create-ocir-secrets.sh` - Create ImagePullSecrets
6. Run `verify-ocir-setup.sh` - Verify OCIR configuration
7. Run `test-ocir-push-pull.sh` (optional) - Test OCIR connectivity
8. Proceed with application deployment

---

## Troubleshooting

### Script won't execute

```bash
# Make script executable
chmod +x scripts/<script-name>.sh

# Or run with bash
bash scripts/<script-name>.sh
```

### kubectl connection errors

```bash
# Regenerate kubeconfig
oci ce cluster create-kubeconfig \
  --cluster-id <cluster-ocid> \
  --file ~/.kube/config \
  --region <region>

# Test connection
kubectl get nodes
```

### Permission denied

```bash
# Run with bash explicitly
bash scripts/<script-name>.sh

# Or add execute permission
chmod +x scripts/<script-name>.sh
```

---

## See Also

- [OKE Cluster Setup Guide](../docs/oke-cluster-setup.md)
- [OCIR Setup Guide](../docs/ocir-setup.md)
- [OKE Environment Template](../oke-env.template.sh)
