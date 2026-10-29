import client from "~/lib/shopify-client";
import {
  createAccessTokenMutation,
  fetchUserQuery,
  logoutCustomerMutation,
  requestPswdResetMutation,
  resetPasswordMutation,
  signupMutation,
} from "../queries/auth.query";
import type {
  CustomerAccessToken,
  CustomerInput,
  SCustomer,
  SCustomerReset,
  SCustomerResetComplete,
} from "../types/auth.types";
import { type ShopifyResponse } from "~/lib/types";
import { handleToken } from "../utils";
import { getDefaultStore } from "jotai";
import { customerAtom } from "~/store/auth.store";
import { deleteCookie, getCookie, KEYS } from "~/lib/utils";
import { cartAtom } from "~/store/cart.store";

/**
 * Authenticates a customer with their email and password to generate a Shopify Customer Access Token.
 *
 * @param {Object} input - The customer credentials.
 * @param {string} input.email - The customer's email address.
 * @param {string} input.password - The customer's password.
 * @returns {Promise<ShopifyResponse<CustomerAccessToken>>} The Shopify response containing the access token details or errors.
 */
async function createCustomerAccessToken(input: {
  email: string;
  password: string;
}) {
  return (await client.request(createAccessTokenMutation, {
    variables: { input },
  })) as ShopifyResponse<CustomerAccessToken>;
}

/**
 * Registers a new customer with Shopify, automatically generates an access token,
 * saves the token as an HTTP-accessible cookie, and returns the customer data or errors.
 *
 * @param {CustomerInput} input - The customer registration details (e.g., email, password, first name, last name).
 * @returns {Promise<{ errors: any[] | null; data: SCustomer | null }>} An object containing either the created customer data or Shopify user/access token errors.
 */
export async function createCustomer(input: CustomerInput) {
  const { errors } = (await client.request(signupMutation, {
    variables: { input },
  })) as ShopifyResponse<SCustomer>;

  if (errors) throw errors;

  const accessTokenResult = await createCustomerAccessToken({
    email: input.email,
    password: input.password,
  });

  const tokenResult = handleToken(accessTokenResult);
  if (tokenResult.errors !== null) {
    return tokenResult;
  }

  return await fetchCustomer(tokenResult.data);
}

/**
 * Authenticates a customer using their email and password, handles access token creation,
 * saves the token as an HTTP cookie, and fetches the associated customer profile data.
 *
 * @param {Object} input - The customer login credentials.
 * @param {string} input.email - The customer's email address.
 * @param {string} input.password - The customer's password.
 * @returns {Promise<{ errors: any[] | null; data: any | null }>} An object containing the customer profile data or error details.
 */
export async function loginCustomer(input: {
  email: string;
  password: string;
}) {
  const accessTokenResult = await createCustomerAccessToken(input);

  const tokenResult = handleToken(accessTokenResult);
  if (tokenResult.errors !== null) {
    throw tokenResult.errors;
  }

  return await fetchCustomer(tokenResult.data);
}

/**
 * Fetches the customer profile details from Shopify using a valid customer access token.
 *
 * @param {string} accessToken - The valid customer access token.
 * @returns {Promise<{ errors: null; data: any }>} An object containing the customer data retrieved from Shopify.
 */
export async function fetchCustomer(accessToken: string | null) {
  if (!accessToken) return { errors: null, data: null };

  const { data, errors } = await client.request(fetchUserQuery, {
    variables: { customerAccessToken: accessToken },
  }) as ShopifyResponse<SCustomer>;

  if (errors) throw errors;

  const store = getDefaultStore();
  const customerData = data.customer;

  store.set(customerAtom, customerData);

  return { errors: null, data: data.customer };
}

/**
 * Requests a password reset email for a customer associated with the given email address.
 *
 * @param {string} email - The customer's email address to send the reset link to.
 * @returns {Promise<{ errors: any[] | null; data: null }>} An object containing customer user errors if any occurred, otherwise success (null errors and data).
 * @throws {ShopifyError[]} Throws Shopify request-level errors if the API call fails.
 */
export async function requestPasswordReset(email: string) {
  const { data, errors } = await client.request(requestPswdResetMutation, {
    variables: { email }
  }) as ShopifyResponse<SCustomerReset>;

  if (errors) throw errors;

  if (data.customerRecover.customerUserErrors.length > 0) {
    const error = data.customerRecover.customerUserErrors;
    return { errors: error, data: null };
  }

  return { errors: null, data: null };
}

/**
 * Completes the customer password reset process using the reset URL received via email and a new password.
 *
 * @param {string} resetUrl - The unique reset URL sent to the customer's email.
 * @param {string} password - The new password to set for the customer.
 * @returns {Promise<{ errors: any[] | null; data: null }>} An object containing customer user errors if any occurred, otherwise success (null errors and data).
 * @throws {ShopifyError[]} Throws Shopify request-level errors if the API call fails.
 */
export async function resetPassword(resetUrl: string, password: string) {
  const { data, errors } = await client.request(resetPasswordMutation, {
    variables: { resetUrl, password }
  }) as ShopifyResponse<SCustomerResetComplete>;

  if (errors) throw errors;

  if (data.customerResetByUrl.customerUserErrors.length > 0) {
    const error = data.customerResetByUrl.customerUserErrors;
    return { errors: error, data: null };
  }

  return { errors: null, data: null };
}

export async function logoutCustomer() {
  const accessToken = getCookie(KEYS.CUSTOMER_TOKEN_COOKIE);
  if (!accessToken) return null;
  const { data, errors } = await client.request(logoutCustomerMutation, {
    variables: { customerAccessToken: accessToken }
  });

  if (!errors && data?.customerAccessTokenDelete.userErrors.length === 0) {
    const store = getDefaultStore();
    store.set(customerAtom, null);
    store.set(cartAtom, null);

    deleteCookie(KEYS.CART_ID);
    deleteCookie(KEYS.CHECKOUT_URL);
    deleteCookie(KEYS.CUSTOMER_TOKEN_COOKIE);
  }
}
