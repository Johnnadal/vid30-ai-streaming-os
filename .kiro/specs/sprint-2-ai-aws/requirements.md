# Vid30 Sprint 2 — AI & AWS Requirements

## 1. Objective

Sprint 2 transforms the existing Vid30 React Native TV foundation into the first functional AI-powered content discovery experience.

The primary goal is to demonstrate the following vertical slice:

User intent
→ Vid30 TV
→ API Gateway
→ Lambda
→ AIProvider
→ Amazon Bedrock
→ Structured intent
→ CatalogProvider
→ Relevant content
→ Vid30 TV

The objective is not to build a complete streaming platform or a complete backend.

The objective is to prove that Vid30 can use AI to understand natural-language viewing intent and retrieve relevant content from its own catalog.

---

## 2. Product Principle

Vid30 is not simply a streaming application with a chatbot.

The product vision is:

> Vid30 — the first AI Streaming Operating System for Smart TVs.

AI must therefore participate in content discovery and interaction with the Vid30 catalog.

Bedrock must not invent or hallucinate the available films.

The AI layer is responsible for understanding user intent.

The CatalogProvider is responsible for determining which content actually exists and which content matches the structured intent.

---

## 3. User Story

### US-01 — Natural language discovery

As a Vid30 TV user,

I want to describe what I want to watch using natural language,

so that Vid30 can find relevant content without requiring me to manually browse the catalog.

Example:

> "I want something dark, cinematic and under 90 minutes."

Expected interpretation:

```json
{
  "mood": ["dark"],
  "style": ["cinematic"],
  "maxDuration": 90
}
