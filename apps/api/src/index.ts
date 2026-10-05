import Fastify from "fastify";

import { RuleBasedAIProvider } from "./ai/RuleBasedAIProvider";
import { MockCatalogProvider } from "./catalog/MockCatalogProvider";
import type { DiscoverRequest } from "./catalog/types";
import { DiscoveryService } from "./discovery/DiscoveryService";

const app = Fastify({
  logger: true,
});

// Providers and service are instantiated once at startup.
// Swap RuleBasedAIProvider → BedrockProvider here when ready.
const discoveryService = new DiscoveryService(
  new RuleBasedAIProvider(),
  new MockCatalogProvider(),
);

app.get("/health", async () => {
  return { status: "ok" };
});

app.post<{ Body: DiscoverRequest }>("/discover", async (request, reply) => {
  const query = request.body?.query;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return reply.status(400).send({
      error: "INVALID_REQUEST",
      message: "query is required",
    });
  }

  try {
    const { intent, results } = await discoveryService.discover(query);
    return { intent, results };
  } catch (err) {
    app.log.error(err);
    return reply.status(500).send({
      error: "DISCOVERY_ERROR",
      message: "An error occurred during content discovery.",
    });
  }
});

async function start() {
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? "0.0.0.0";

  try {
    await app.listen({ port, host });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();
