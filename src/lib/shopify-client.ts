import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const client = createStorefrontApiClient({
  apiVersion: "2026-10",
  storeDomain: "https://npkq1t-dm.myshopify.com/api/2026-10/graphql.json",
  publicAccessToken: "1c886e3b72b368aee7564eb57424bb0d",
  retries: 2
});

export default client;
