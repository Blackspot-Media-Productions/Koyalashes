import type {
  GQLExtensions,
  Headers,
  ResponseErrors,
} from "@shopify/graphql-client";

export type ShopifyResponse<T> = {
  errors?: ResponseErrors;
  extensions?: GQLExtensions;
  data: T;
  headers?: Headers;
};

export type Product = {
  id: string;
  slug: string;
  description: string;
  title: string;
  category?: {
    id: string;
    name: string;
  };
  collections?: Collection[];
  images: {
    height: number;
    id: string;
    url: string;
    width: number;
  }[];
  variants?: {
    id: string;
    price: {
      amount: string;
      currencyCode: "GBP";
    };
    quantityAvailable: number;
    title: string;
  }[];
  priceRange?: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  createdAt: Date | string
};

export type Collection = {
  id: string;
  slug: string;
  title: string;
  image: {
    url: string;
    altText: string;
  }
};

export type Customer = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  items: {
    id: string;
    quantity: number;
    cost: {
      totalAmount: { amount: string; currencyCode: string }
    };
    merchandise: {
      id: string;
      title: string;
      image: { url: string; altTexT: string };
      product: { title: string; handle: string }
    }
  }[];
}
