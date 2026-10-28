import client from "~/lib/shopify-client";
import { addToCartQuery, createCartQuery, getCartItemsQuery, removeCartItemQuery, updateCartQuantityQuery } from "../queries/cart.query";
import type { ShopifyResponse } from "~/lib/types";
import type { SCartAdd, SCartCreate, SCartGet } from "../types/cart.types";
import { getCookie, KEYS, saveCookie } from "~/lib/utils";
import { toCart } from "../utils";
import { getDefaultStore } from "jotai";
import { cartAtom } from "~/store/cart.store";

export async function createCart(
  variantId: string,
  quantity: number = 1,
  loading?: (status: boolean) => void,
) {
  loading?.(true);
  const { data, errors, extensions } = (await client.request(createCartQuery, {
    variables: {
      lines: [{ merchandiseId: variantId, quantity }],
    },
  })) as ShopifyResponse<SCartCreate>;

  if (data.cartCreate.userErrors.length === 0) {
    saveCookie({
      key: KEYS.CART_ID,
      value: data.cartCreate.cart.id,
      options: { expires: 7 },
    });
    saveCookie({
      key: KEYS.CHECKOUT_URL,
      value: data.cartCreate.cart.checkoutUrl,
      options: { expires: 7 },
    });
  }

  loading?.(false);

  return {
    errors,
    extensions,
    userErrors: data.cartCreate.userErrors,
  };
}

export async function addToCart(
  variantId: string,
  quantity: number = 1,
  loading?: (status: boolean) => void,
) {
  const cartId = getCookie(KEYS.CART_ID);
  if (!cartId) {
    loading?.(true);
    const result = await createCart(variantId);
    loading?.(false);
    return {
      errors: result.errors,
      extensions: result.extensions,
      userErrors: result.userErrors,
    };
  }

  const { data, errors, extensions } = await client.request(addToCartQuery, {
    variables: {
      cartId,
      lines: [
        { merchandiseId: variantId, quantity }
      ],
    },
  }) as ShopifyResponse<SCartAdd>;

  console.log(data);

  if (data.cartLinesAdd.userErrors.length === 0) {
    saveCookie({
      key: KEYS.CART_ID,
      value: data.cartLinesAdd.cart.id,
      options: { expires: 7 },
    });
    saveCookie({
      key: KEYS.CHECKOUT_URL,
      value: data.cartLinesAdd.cart.checkoutUrl,
      options: { expires: 7 },
    });
  }

  loading?.(false);

  await getCart();

  return {
    errors,
    extensions,
    userErrors: data.cartLinesAdd.userErrors,
  };
}

export async function getCart() {
  const cartId = getCookie(KEYS.CART_ID);
  if (!cartId) return null;

  const { data, errors, extensions } = await client.request(getCartItemsQuery, {
    variables: { cartId, after: null }
  }) as ShopifyResponse<SCartGet>;

  if (!errors) {
    const store = getDefaultStore();
    const cartData = toCart(data.cart);

    store.set(cartAtom, cartData);
  }

  return {
    errors,
    extensions,
  }
}

export async function updateCartQuantity(itemId: string, newQuantity: number) {
  const cartId = getCookie(KEYS.CART_ID);
  if (!cartId) return;

  const { errors, extensions } = await client.request(updateCartQuantityQuery, {
    variables: { cartId, lineId: itemId, quantity: newQuantity }
  });

  if (!errors) {
    await getCart();
  }

  return {
    errors,
    extensions
  }
}

export async function removeCartItem(itemId: string) {
  const cartId = getCookie(KEYS.CART_ID);
  if (!cartId) return;

  const { errors, extensions } = await client.request(removeCartItemQuery, {
    variables: { cartId, lineIds: [itemId] }
  });

  if (!errors) {
    await getCart();
  }

  return {
    errors,
    extensions
  }
}
