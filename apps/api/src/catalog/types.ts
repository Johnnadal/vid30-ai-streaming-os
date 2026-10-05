/**
 * HTTP-layer types for the /discover endpoint.
 * Domain types (DiscoveryIntent, CatalogItem) live in ai/types.ts and catalog/CatalogProvider.ts.
 */

export type DiscoverRequest = {
  query: string;
};
