# Cloud Provider Decision - Task T-501

## Decision Summary

**Selected Provider**: Oracle Cloud Infrastructure (OKE - Oracle Kubernetes Engine)

**Decision Date**: 2026-02-04

**Status**: ✅ APPROVED

---

## Evaluation Criteria

### Cost Analysis

| Provider | Free Tier | Duration | Resources | Monthly Cost (after free) |
|----------|-----------|----------|-----------|---------------------------|
| **OKE** | ✅ Always Free | Unlimited | 4 OCPUs, 24GB RAM | $0 (Always Free) |
| AKS | $200 credit | 30 days | Variable | ~$150-300/month |
| GKE | $300 credit | 90 days | Variable | ~$150-300/month |

### Technical Capabilities

| Feature | OKE | AKS | GKE |
|---------|-----|-----|-----|
| Kubernetes Version | ✅ Latest | ✅ Latest | ✅ Latest |
| Container Registry | ✅ OCIR | ✅ ACR | ✅ GCR |
| Load Balancer | ✅ Yes | ✅ Yes | ✅ Yes |
| Persistent Storage | ✅ Block Volume | ✅ Azure Disk | ✅ Persistent Disk |
| Monitoring | ✅ OCI Monitoring | ✅ Azure Monitor | ✅ Cloud Monitoring |
| CLI Tool | oci | az | gcloud |

### Deployment Complexity

| Provider | Setup Complexity | Learning Curve | Documentation Quality |
|----------|------------------|----------------|----------------------|
| **OKE** | Medium | Medium | Good |
| AKS | Low | Low | Excellent |
| GKE | Low | Low | Excellent |

---

## Decision Rationale

### Why OKE?

1. **Zero Cost** ✅
   - Always-free tier with sufficient resources (4 OCPUs, 24GB RAM)
   - No credit card billing after free credits expire
   - Perfect for hackathon and learning purposes
   - Can run all services: Frontend, Backend, Kafka, Dapr, Monitoring

2. **Sufficient Resources** ✅
   - 4 OCPUs enough for multi-service deployment
   - 24GB RAM supports Kafka, Dapr sidecars, and application pods
   - Meets all Phase 5 requirements

3. **Production-Grade Features** ✅
   - Full Kubernetes support
   - Container registry (OCIR)
   - Load balancing
   - Block storage for persistent volumes
   - Monitoring and logging capabilities

4. **Sustainability** ✅
   - System remains running beyond hackathon
   - No surprise bills
   - Can be used for portfolio/demos indefinitely

### Why NOT AKS or GKE?

**AKS (Azure)**
- ❌ Only $200 free credit (30 days)
- ❌ Billing starts after 30 days
- ❌ Risk of unexpected charges
- ✅ Excellent documentation
- ✅ Easy setup

**GKE (Google Cloud)**
- ❌ $300 credit (90 days) - still temporary
- ❌ Billing starts after free period
- ❌ Risk of unexpected charges
- ✅ Excellent documentation
- ✅ Easy setup
- ✅ Best integration with Google services

---

## Implementation Plan

### OKE Setup Steps

1. **Create OCI Account**
   ```bash
   # Sign up at: https://www.oracle.com/cloud/free/
   # Select "Always Free" tier
   ```

2. **Install OCI CLI**
   ```bash
   # Windows
   bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"

   # Verify installation
   oci --version
   ```

3. **Configure OCI CLI**
   ```bash
   # Run configuration
   oci setup config

   # Provide:
   # - User OCID
   # - Tenancy OCID
   # - Region
   # - Generate API signing key
   ```

4. **Create OKE Cluster**
   ```bash
   # Create VCN first (if not exists)
   oci network vcn create \
     --cidr-block 10.0.0.0/16 \
     --display-name todo-vcn \
     --compartment-id <compartment-ocid>

   # Create OKE cluster
   oci ce cluster create \
     --name todo-oke \
     --kubernetes-version v1.28.2 \
     --vcn-id <vcn-ocid> \
     --compartment-id <compartment-ocid>

   # Wait for cluster to be active (5-10 minutes)
   oci ce cluster get --cluster-id <cluster-ocid>
   ```

5. **Configure kubectl**
   ```bash
   # Generate kubeconfig
   oci ce cluster create-kubeconfig \
     --cluster-id <cluster-ocid> \
     --file $HOME/.kube/config \
     --region <region> \
     --token-version 2.0.0

   # Verify connection
   kubectl get nodes
   kubectl cluster-info
   ```

6. **Setup Container Registry (OCIR)**
   ```bash
   # Login to OCIR
   docker login <region-key>.ocir.io
   # Username: <tenancy-namespace>/<oci-username>
   # Password: <auth-token>

   # Create auth token in OCI Console:
   # User Settings → Auth Tokens → Generate Token
   ```

---

## Resource Allocation Plan

### Cluster Configuration

```yaml
Cluster: todo-oke
Kubernetes Version: v1.28.2
Node Pool:
  - Shape: VM.Standard.E4.Flex
  - OCPUs: 4 (Always Free limit)
  - Memory: 24GB (Always Free limit)
  - Nodes: 1
  - OS: Oracle Linux 8
```

### Pod Resource Allocation

| Service | CPU Request | Memory Request | CPU Limit | Memory Limit |
|---------|-------------|----------------|-----------|--------------|
| Frontend | 200m | 256Mi | 500m | 512Mi |
| Backend | 300m | 512Mi | 1000m | 1Gi |
| Kafka | 500m | 1Gi | 1000m | 2Gi |
| Recurring Service | 100m | 256Mi | 300m | 512Mi |
| Notification Service | 100m | 256Mi | 300m | 512Mi |
| Prometheus | 200m | 512Mi | 500m | 1Gi |
| Grafana | 100m | 256Mi | 300m | 512Mi |
| **Total Reserved** | ~1500m | ~3Gi | ~3600m | ~6.5Gi |
| **Available** | 4000m | 24Gi | - | - |
| **Headroom** | 2500m | 21Gi | ✅ Sufficient | ✅ Sufficient |

---

## Risk Assessment

### Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Resource exhaustion | Low | High | Set resource limits, monitor usage |
| OCI account issues | Low | High | Complete verification early |
| Setup complexity | Medium | Medium | Follow official docs, use OCI Console |
| API rate limits | Low | Low | Reasonable usage patterns |
| Always Free changes | Very Low | High | Document architecture, plan migration |

---

## Acceptance Criteria

- [X] Cloud provider evaluated and selected
- [X] Cost analysis completed
- [X] Resource requirements validated
- [X] Setup instructions documented
- [X] Risk assessment completed
- [X] Decision rationale documented

---

## Next Steps

✅ **Task T-501 Complete** - Cloud provider selected (OKE)

➡️ **Next Task: T-502** - Set up cloud K8s cluster
   - Create OCI account
   - Install OCI CLI
   - Create OKE cluster
   - Configure kubectl
   - Verify cluster connectivity

---

## References

- [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)
- [OKE Documentation](https://docs.oracle.com/en-us/iaas/Content/ContEng/home.htm)
- [OCI CLI Installation](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm)
- [OCIR Documentation](https://docs.oracle.com/en-us/iaas/Content/Registry/home.htm)

---

## Decision Record

**Decision ID**: CLOUD-001
**Type**: Infrastructure
**Status**: Approved
**Impact**: High (affects entire Phase 5 deployment)
**Stakeholders**: Development team, Operations
**Approver**: System Architect

**Alternatives Considered**:
1. Azure AKS - Rejected due to cost after free period
2. Google GKE - Rejected due to cost after free period
3. Oracle OKE - **SELECTED** due to always-free tier

**Consequences**:
- ✅ Zero ongoing infrastructure cost
- ✅ Sufficient resources for all services
- ⚠️ Medium learning curve for OCI tools
- ✅ Production-ready Kubernetes environment
- ✅ Sustainable beyond hackathon

---

**Document Version**: 1.0
**Last Updated**: 2026-02-04
**Author**: AI System Architect
