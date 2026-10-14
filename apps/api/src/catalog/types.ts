/**
 * HTTP-layer types for the /discover endpoint.
 * Domain types (DiscoveryIntent, CatalogItem) live in ai/types.ts and catalog/CatalogProvider.ts.
 */

export type DiscoverRequest = {
  query: string;
  /** Optional. When true, only familySafe content is returned. Default: false. */
  familyMode?: boolean;
};
