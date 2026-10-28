import { queryOptions } from "@tanstack/react-query";
import { getCart } from "~/shopify/requests/cart";
import { getCollections } from "~/shopify/requests/product";

export const collectionQueryOptions = queryOptions({
  queryKey: ["collections"],
  queryFn: () => getCollections(150),
  staleTime: Infinity,
});

export const cartQueryOptions = queryOptions({
  queryKey: ["cart"],
  queryFn: getCart,
  staleTime: Infinity
})
