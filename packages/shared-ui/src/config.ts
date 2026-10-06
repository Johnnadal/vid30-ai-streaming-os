/**
 * Central config for Vid30 API endpoints.
 * Change API_BASE_URL to switch between local dev and production.
 */

// Production: API Gateway (Lambda + Bedrock)
// Dev: local Fastify server (yarn dev in apps/api)
export const API_BASE_URL =
  'https://jows41bdb5.execute-api.eu-west-3.amazonaws.com/prod';
