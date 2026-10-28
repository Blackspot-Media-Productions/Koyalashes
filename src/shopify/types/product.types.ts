export type SProductPrice = {
  amount: string;
  currencyCode: string;
};

export type SPageInfo = { hasNextPage: boolean; endCursor: string }

export type SProductVariant = {
  cursor: string;
  node: {
    id: string;
    price: {
      amount: string;
      currencyCode: "GBP";
    };
    quantityAvailable: number;
    title: string;
  };
};

export type SProductImage = {
  cursor: string;
  node: {
    height: number;
    id: string;
    url: string;
    width: number;
  };
};

export type SProductEdges = {
  cursor: string;
  node: {
    id: string;
    handle: string;
    description: string;
    title: string;
    collections: {
      nodes: SCollectionEdges["node"][]
    }
    category: {
      id: string;
      name: string;
    };
    images: {
      edges: SProductImage[];
    };
    variants?: {
      edges: SProductVariant[];
    };
    priceRange?: {
      maxVariantPrice: SProductPrice;
      minVariantPrice: SProductPrice;
    };
    createdAt: Date | string;
  };
};

export type SProducts = { products: { edges: SProductEdges[] } };

export type SProduct = { product: SProductEdges["node"] };

export type SProductLatest = { products: { nodes: SProductEdges["node"][], pageInfo: SPageInfo } }

export type SCollectionEdges = {
  cursor: string;
  node: {
    handle: string;
    id: string;
    title: string;
    image: {
      url: string;
      altText: string;
    };
  };
};

export type SCollection = { collections: { edges: SCollectionEdges[] } };

export type SCollectionWithProducts = {
  collection: {
    id: string;
    title: string;
  } & SProducts;
};

export type SCategorySearch = {
  search: {
    nodes: SProductEdges["node"][];
    pageInfo: SPageInfo;
  };
};

export type SProductFilters = Record<"category" | "price", Record<string, string | number>>;
