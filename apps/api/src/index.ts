import Fastify from "fastify";
import { searchCatalog } from "./catalog/mockCatalog";
import { DiscoverRequest, DiscoveryIntent } from "./catalog/types";

const app = Fastify({
  logger: true,
});

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

  const intent: DiscoveryIntent = {};
  const normalizedQuery = query.toLowerCase();

  if (normalizedQuery.includes("dark")) {
    intent.mood = ["dark"];
  }

  if (normalizedQuery.includes("cinematic")) {
    intent.cinematic = true;
    intent.mood = [...(intent.mood ?? []), "cinematic"];
  }

  const durationMatch = normalizedQuery.match(
    /(?:under|less than|moins de)\s+(\d+)\s*(?:minutes?|min)?/
  );

  if (durationMatch) {
    intent.maxDurationMinutes = Number(durationMatch[1]);
  }

  const results = searchCatalog(intent);

  return {
    intent,
    results,
  };
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