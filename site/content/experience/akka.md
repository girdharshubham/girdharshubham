---
title: Senior Site Reliability Engineer II
company: Akka (Lightbend)
location: Remote
start: 2023-04
# end: leave out while you still work here
---

### Akka Optimize (AI inference and training)

- Own the platform side of Akka's AI inference and fine-tuning offering, taking it from proof of concept to production.
- Architected multi-tenant LLM serving as a native platform capability, managed end to end from the Akka CLI. Wrote the Go operators behind it (Kubernetes DRA, vLLM) and wired agentgateway's external-processing hook into the gateway router.
- Designed GPU capacity as a pool of independent clusters across AWS (H100, Crossplane-provisioned) and a neocloud (H200, no inbound ports); training runs land wherever there's capacity.
- Delivered the first enterprise design partner end to end, with models fine-tuned and served on the platform. That closed the product's first platform deal.
- Stay hands-on in product code across the trainer runtime (Python) and gateway router (Java, Akka SDK).

### Akka Platform

- Led the redesign of the platform from Terraform to Crossplane, with composite cross-cloud APIs that unlocked sales to several large enterprise customers in finance, healthcare and aviation.
- Operate the multi-cloud control plane across 40+ regions on AWS, Azure and GCP, including a 22-region footprint for a single customer spanning Asia, Canada and the US.
- Own tenant onboarding: CMEK on GCP, Cilium networking, federation-plane permissions and customer-specific isolation.
- Designed a cloud-agnostic zero-trust access gateway centralizing authentication, RBAC and audit logging.
- Drove infrastructure and observability cost optimization while rolling out Linkerd and Groundcover across all customer regions.
