# Vid30 Sprint 2 — Technical Design

## 1. Design Goal

The design provides the smallest architecture capable of demonstrating Vid30 AI Discovery end-to-end.

The architecture must remain easy to evolve without introducing infrastructure that is not yet justified by the product.

---

## 2. Target Architecture

```text
┌─────────────────────────────┐
│         VID30 TV             │
│      React Native TV         │
└──────────────┬──────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────┐
│        API Gateway           │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│           Lambda             │
│         Vid30 API            │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
CatalogProvider      AIProvider
       │                │
       ▼                ▼
MockCatalog       BedrockProvider
                        │
                        ▼
                 Amazon Bedrock

                 