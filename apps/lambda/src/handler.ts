import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { BedrockProvider } from "../../api/src/ai/BedrockProvider";
import { MockCatalogProvider } from "../../api/src/catalog/MockCatalogProvider";
import { DiscoveryService } from "../../api/src/discovery/DiscoveryService";

// Instantiated once per cold start — reused across warm invocations
const discoveryService = new DiscoveryService(
  new BedrockProvider(),
  new MockCatalogProvider(),
);

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  // Normalize path — API Gateway HTTP API v2 includes the stage in rawPath
  const path = event.rawPath.replace(/^\/prod/, "") || "/";
  const method = event.requestContext.http.method;

  // Health check
  if (method === "GET" && path === "/health") {
    return json(200, { status: "ok" });
  }

  // Only POST /discover is supported
  if (method !== "POST" || path !== "/discover") {
    return json(404, { error: "NOT_FOUND" });
  }

  // Parse body
  let query: string | undefined;
  try {
    const body = JSON.parse(event.body ?? "{}");
    query = body.query;
  } catch {
    return json(400, {
      error: "INVALID_REQUEST",
      message: "Request body must be valid JSON",
    });
  }

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return json(400, {
      error: "INVALID_REQUEST",
      message: "query is required",
    });
  }

  try {
    const { intent, results } = await discoveryService.discover(query);
    return json(200, { intent, results });
  } catch (err) {
    console.error("Discovery error:", err);
    return json(500, {
      error: "DISCOVERY_ERROR",
      message: "An error occurred during content discovery.",
    });
  }
};

function json(statusCode: number, body: unknown): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
