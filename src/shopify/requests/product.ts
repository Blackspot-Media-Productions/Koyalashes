import client from "~/lib/shopify-client";
import {
  collectionsQuery,
  filteredProductsQuery,
  latestProductQuery,
  productQuery,
  productsByCategoryQuery,
  productsByCollectionQuery,
  productsQuery,
  type ProductsQueryCounts,
} from "../queries/product.query";
import {
  toCollectionsArray,
  toProduct,
  toProductsArray,
  toProductsArrayFromSearch,
} from "../utils";
import type { ShopifyResponse } from "~/lib/types";
import type {
  SCategorySearch,
  SCollection,
  SCollectionWithProducts,
  SProduct,
  SProductFilters,
  SProductLatest,
  SProducts,
} from "../types/product.types";
import { getCategoryIdFromName } from "~/lib/utils";

/**
 * Fetches a list of products from Shopify based on optional query counts and pagination limits.
 *
 * @param {ProductsQueryCounts} [counts] - Optional configuration specifying the number of products and variants to fetch.
 * @returns {Promise<{ errors: any[] | null; extensions: any; data: any[] }>} An object containing errors, extensions, and a mapped array of product objects.
 */
export async function fetchProducts(counts?: ProductsQueryCounts) {
  const { data, errors, extensions } = (await client.request(
    productsQuery(counts),
  )) as ShopifyResponse<SProducts>;

  return {
    errors,
    extensions,
    products: toProductsArray(data.products.edges),
  };
}

/**
 * Fetches a single product by its unique URL handle (slug) from Shopify.
 *
 * @param {string} handle - The unique handle/slug of the product to retrieve.
 * @param {ProductsQueryCounts} [counts] - Optional configuration specifying the number of variants, images, etc. to fetch.
 * @returns {Promise<{ errors: any[] | null; extensions: any; data: any }>} An object containing errors, extensions, and the mapped product object.
 */
export async function getProductBySlug(
  handle: string,
  counts?: ProductsQueryCounts,
) {
  const { data, errors, extensions } = (await client.request(
    productQuery(counts),
    { variables: { handle } },
  )) as ShopifyResponse<SProduct>;

  return {
    errors,
    extensions,
    product: toProduct(data.product),
  };
}

export async function getCollections(count: number = 10) {
  const parsedCount = typeof count === "number" && !isNaN(count) ? count : 10;

  const { data, errors, extensions } = (await client.request(
    collectionsQuery(parsedCount),
  )) as ShopifyResponse<SCollection>;

  return {
    errors,
    extensions,
    collections: toCollectionsArray(data.collections.edges),
  };
}

export async function getProductsByCollection(
  collectionSlug: string,
  productCount?: number,
) {
  const { data, errors, extensions } = (await client.request(
    productsByCollectionQuery(productCount),
    { variables: { handle: collectionSlug } },
  )) as ShopifyResponse<SCollectionWithProducts>;

  return {
    errors,
    extensions,
    products: toProductsArray(data.collection.products.edges).toReversed(),
  };
}

export async function getProductByCategory(
  category: string,
  after: string | null,
  productCount?: number,
) {
  const categoryId = getCategoryIdFromName(category);
  const { data, errors, extensions } = (await client.request(
    productsByCategoryQuery(productCount),
    {
      variables: { categoryId, after },
    },
  )) as ShopifyResponse<SCategorySearch>;

  return {
    errors,
    extensions,
    products: toProductsArrayFromSearch(data.search).toSorted(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  };
}

export async function getLatestProducts(productCount?: number) {
  const { data, errors, extensions } = (await client.request(
    latestProductQuery(productCount),
  )) as ShopifyResponse<SProductLatest>;

  return {
    errors,
    extensions,
    products: toProductsArrayFromSearch(data.products),
  };
}

export async function getFilteredProducts(
  filters: SProductFilters,
  productCount?: number,
  after: string | null = null,
) {
  const { data, errors, extensions } = (await client.request(
    filteredProductsQuery(productCount),
    {
      variables: {
        filters,
        after,
      },
    },
  )) as ShopifyResponse<SCategorySearch>;

  return {
    errors,
    extensions,
    products: toProductsArrayFromSearch(data.search).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
    pagination: data.search.pageInfo,
  };
}
