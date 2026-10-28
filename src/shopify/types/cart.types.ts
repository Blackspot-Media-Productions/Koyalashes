import type { SPageInfo } from "./product.types";

type UserErrors = { field: string; message: string }[];

export type SCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
}

export type SCartCreate = {
  cartCreate: {
    cart: SCart,
    userErrors: UserErrors;
  }
}

export type SCartAdd = {
  cartLinesAdd: {
    cart: SCart,
    userErrors: UserErrors
  }
}

export type SCartGet = {
  cart: {
    id: string;
    checkoutUrl: string;
    lines: {
      nodes: {
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
      pageInfo: SPageInfo;
    };
    totalQuantity: number;
  }
}
