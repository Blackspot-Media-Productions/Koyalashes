export type ProductsQueryCounts = {
  product?: number;
  images?: number;
  variants?: number;
};

export const productsQuery = (count?: ProductsQueryCounts) => `
  query ProductsQuery {
    products(first: ${count?.product || 3}) {
      edges {
        cursor
        node {
          id
          title
          description
          handle
          collections(first: 20, after: null) {
            nodes {
              id
              title
              handle
              image {
                url
                altText
              }
            }
          }
          category {
            id
            name
          }
          images(first: ${count?.images || 3}) {
            edges {
              cursor
              node {
                id
                url
                width
                height
              }
            }
          }
          variants(first: ${count?.variants || 3}) {
            edges {
              cursor
              node {
                id
                title
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          priceRange { # Returns range of prices for a product in the shop's currency.
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          createdAt
        }
      }
    }
  }
`;

export const productQuery = (count?: ProductsQueryCounts) => `
  query getProductByHandle($handle: String) {
    product(handle: $handle) {
      id
      title
      description
      handle
      collections(first: 20, after: null) {
        nodes {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
      category {
        id
        name
      }
      images(first: ${count?.images || 3}) {
        edges {
          cursor
          node {
            id
            url
            width
            height
          }
        }
      }
      variants(first: ${count?.variants || 3}) {
        edges {
          cursor
          node {
            id
            title
            quantityAvailable
            price {
              amount
              currencyCode
            }
          }
        }
      }
      priceRange { # Returns range of prices for a product in the shop's currency.
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      createdAt
    }
  }
`;

export const collectionsQuery = (count: number = 10) => `
  query getCollections() {
    collections(first: ${count}) {
      edges {
        cursor
        node {
          id
          handle
          title
          image {
            url
            altText
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
    }
  }
`;

export const productsByCollectionQuery = (count: number = 4) => `
  query getProductsInCollection($handle: String!) {
    collection(handle: $handle) {
      id
      title
      products(first: ${count}, sortKey: BEST_SELLING) {
        edges {
          node {
            id
            title
            description
            handle
            collections(first: 20, after: null) {
              nodes {
                id
                title
                handle
                image {
                  url
                  altText
                }
              }
            }
            category {
              id
              name
            }
            images(first: 1) {
              edges {
                node {
                  id
                  url
                  width
                  height
                }
              }
            }
            priceRange { # Returns range of prices for a product in the shop's currency.
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            createdAt
          }
        }
      }
    }
  }
`;

export const productsByCategoryQuery = (count: number = 50) => `
  query ProductsByCategory($categoryId: String!, $after: String) {
    search(
      query: "*"
      types: [PRODUCT]
      first: ${count}
      after: $after
      productFilters: [{ category: { id: $categoryId } }]
    ) {
      nodes {
        ... on Product {
          id
          title
          description
          handle
          collections(first: 20, after: null) {
            nodes {
              id
              title
              handle
              image {
                url
                altText
              }
            }
          }
          category {
            id
            name
          }
          images(first: 3) {
            edges {
              cursor
              node {
                id
                url
                width
                height
              }
            }
          }
          variants(first: 3) {
            edges {
              cursor
              node {
                id
                title
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          priceRange { # Returns range of prices for a product in the shop's currency.
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const latestProductQuery = (productCount: number = 50) => `
  query NewestProducts($after: String) {
    products(
      first: ${productCount}
      after: $after
      sortKey: CREATED_AT
      reverse: true
    ) {
      nodes {
        id
        title
        description
        handle
        collections(first: 20, after: null) {
          nodes {
            id
            title
            handle
            image {
              url
              altText
            }
          }
        }
        category {
          id
          name
        }
        images(first: 3) {
          edges {
            cursor
            node {
              id
              url
              width
              height
            }
          }
        }
        variants(first: 3) {
          edges {
            cursor
            node {
              id
              title
              quantityAvailable
              price {
                amount
                currencyCode
              }
            }
          }
        }
        priceRange { # Returns range of prices for a product in the shop's currency.
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        createdAt
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const filteredProductsQuery = (count: number = 50) => `
  query FilteredProducts($filters: [ProductFilter!], $after: String) {
    search(
      query: "*"
      types: [PRODUCT]
      first: ${count}
      after: $after
      productFilters: $filters
    ) {
      nodes {
        ... on Product {
          id
          title
          description
          handle
          collections(first: 20, after: null) {
            nodes {
              id
              title
              handle
              image {
                url
                altText
              }
            }
          }
          category {
            id
            name
          }
          images(first: 3) {
            edges {
              cursor
              node {
                id
                url
                width
                height
              }
            }
          }
          variants(first: 3) {
            edges {
              cursor
              node {
                id
                title
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          priceRange { # Returns range of prices for a product in the shop's currency.
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
