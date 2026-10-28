import type { Cart, Collection, Product, ShopifyResponse } from "~/lib/types";
import type {
  SCategorySearch,
  SCollectionEdges,
  SProductEdges,
} from "./types/product.types";
import type { CustomerAccessToken } from "./types/auth.types";
import { KEYS, saveCookie } from "~/lib/utils";
import type { SCartGet } from "./types/cart.types";

export function toProductsArray(products: SProductEdges[]): Product[] {
  return products.map((product) => ({
    id: product.node.id,
    description: product.node.description,
    slug: product.node.handle,
    category: product.node.category,
    collections: toCollectionsArrayFromNodes(product.node.collections.nodes),
    images: product.node.images.edges.map((img) => ({
      height: img.node.height,
      width: img.node.width,
      id: img.node.id,
      url: img.node.url,
    })),
    title: product.node.title,
    variants: product.node.variants?.edges.map((variant) => ({
      id: variant.node.id,
      price: variant.node.price,
      quantityAvailable: variant.node.quantityAvailable,
      title: variant.node.title,
    })),
    priceRange: product.node.priceRange,
    createdAt: product.node.createdAt,
  }));
}

export function toProduct(product: SProductEdges["node"]): Product {
  return {
    id: product.id,
    description: product.description,
    slug: product.handle,
    title: product.title,
    category: product.category,
    collections: toCollectionsArrayFromNodes(product.collections.nodes),
    images: product.images.edges.map((img) => ({
      height: img.node.height,
      width: img.node.width,
      id: img.node.id,
      url: img.node.url,
    })),
    variants: product.variants?.edges.map((variant) => ({
      id: variant.node.id,
      price: variant.node.price,
      quantityAvailable: variant.node.quantityAvailable,
      title: variant.node.title,
    })),
    priceRange: product.priceRange,
    createdAt: product.createdAt,
  };
}

export function toCollectionsArray(
  collections: SCollectionEdges[],
): Collection[] {
  return collections.map((collection) => ({
    id: collection.node.id,
    slug: collection.node.handle,
    title: collection.node.title,
    image: collection.node.image,
  }));
}

export function toCollectionsArrayFromNodes(
  collections: SCollectionEdges["node"][],
): Collection[] {
  return collections.map((collection) => ({
    id: collection.id,
    slug: collection.handle,
    title: collection.title,
    image: collection.image,
  }));
}

export function handleToken(tokenResult: ShopifyResponse<CustomerAccessToken>) {
  if (tokenResult.errors) {
    return { errors: tokenResult.errors, data: null };
  }

  const customerTokenUserErrors =
    tokenResult.data.customerAccessTokenCreate.customerUserErrors;

  if (customerTokenUserErrors.length > 0) {
    return { errors: customerTokenUserErrors, data: null };
  }

  const customerAccessToken =
    tokenResult.data.customerAccessTokenCreate.customerAccessToken;

  if (customerAccessToken.accessToken) {
    saveCookie({
      key: KEYS.CUSTOMER_TOKEN_COOKIE,
      value: customerAccessToken.accessToken,
      options: {
        expires: new Date(customerAccessToken.expiresAt),
      },
    });
  }

  return { errors: null, data: customerAccessToken.accessToken };
}

export function toProductsArrayFromSearch(
  products: SCategorySearch["search"],
): Product[] {
  return products.nodes.map((product) => ({
    id: product.id,
    description: product.description,
    slug: product.handle,
    category: product.category,
    collections: toCollectionsArrayFromNodes(product.collections.nodes),
    images: product.images.edges.map((img) => ({
      height: img.node.height,
      width: img.node.width,
      id: img.node.id,
      url: img.node.url,
    })),
    title: product.title,
    variants: product.variants?.edges.map((variant) => ({
      id: variant.node.id,
      price: variant.node.price,
      quantityAvailable: variant.node.quantityAvailable,
      title: variant.node.title,
    })),
    priceRange: product.priceRange,
    createdAt: product.createdAt,
  }));
}

export function toCart(cart: SCartGet["cart"]): Cart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    items: cart.lines.nodes.map((node) => ({
      id: node.id,
      cost: node.cost,
      merchandise: node.merchandise,
      quantity: node.quantity,
    })),
  };
}
