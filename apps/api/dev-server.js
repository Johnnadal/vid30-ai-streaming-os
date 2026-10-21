#!/usr/bin/env node

/**
 * Local development API server for testing.
 * Runs the same discover endpoint locally without Lambda.
 */

const http = require('http');
const url = require('url');

// Import built TypeScript files
const { DiscoveryService } = require('./dist/discovery/DiscoveryService.js');
const { RuleBasedAIProvider } = require('./dist/ai/RuleBasedAIProvider.js');
const { MockCatalogProvider } = require('./dist/catalog/MockCatalogProvider.js');

const service = new DiscoveryService(
  new RuleBasedAIProvider(),
  new MockCatalogProvider()
);

const PORT = process.env.PORT || 3001;

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const pathname = url.parse(req.url).pathname;

  // Health check
  if (req.method === 'GET' && pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Discover endpoint
  if (req.method === 'POST' && pathname === '/discover') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { query, familyMode = false } = data;

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
          res.writeHead(400);
          res.end(JSON.stringify({
            error: 'INVALID_REQUEST',
            message: 'query is required'
          }));
          return;
        }

        console.log(`\n📨 Received query: "${query}" (familyMode=${familyMode})`);

        const result = await service.discover({ query, familyMode });

        console.log(`📤 Returning ${result.results.length} results`);
        console.log(`   familyMode in intent: ${result.intent.familyMode}`);

        res.writeHead(200);
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error('Error:', err);
        res.writeHead(500);
        res.end(JSON.stringify({
          error: 'DISCOVERY_ERROR',
          message: err.message
        }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'NOT_FOUND' }));
});

server.listen(PORT, () => {
  console.log(`\n✅ Local API server running on http://localhost:${PORT}`);
  console.log(`   /health  - Health check`);
  console.log(`   /discover - POST to discover content\n`);
});
