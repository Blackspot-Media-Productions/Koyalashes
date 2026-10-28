export const createCartQuery = `
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        totalQuantity
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const addToCartQuery = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const getCartItemsQuery = `
  query CartItems($cartId: ID!, $after: String) {
    cart(id: $cartId) {
      id
      totalQuantity
      checkoutUrl
      lines(first: 50, after: $after) {
        nodes {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              image {
                url
                altText
              }
              product {
                title
                handle
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const updateCartQuantityQuery = `
  mutation UpdateCartQuantity(
    $cartId: ID!
    $lineId: ID!
    $quantity: Int!
  ) {
    cartLinesUpdate(
      cartId: $cartId
      lines: [{ id: $lineId, quantity: $quantity }]
    ) {
      cart {
        id
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const removeCartItemQuery = `
  mutation RemoveCartItems($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;
