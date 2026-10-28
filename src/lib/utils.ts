import Cookie from "js-cookie";

export const KEYS = {
  CUSTOMER_TOKEN_COOKIE: "customer_token",
  CART_ID: "shopify-cart-id",
  CHECKOUT_URL: "shopify-checkout-url"
};

type CookieOptions = {
  key: string;
  value: string;
  options?: Cookies.CookieAttributes;
};

type TimeUnits = "milliseconds" | "seconds" | "hours" | "days";

export function saveCookie(params: CookieOptions) {
  Cookie.set(params.key, params.value, {
    expires: params.options?.expires || 7,
    path: "/",
    secure: true,
    sameSite: "Lax",
  });
}

export function getCookie(key: string) {
  return Cookie.get(key);
}

export function getTimeFromMinutes(
  minutes: number,
  to: TimeUnits = "milliseconds",
) {
  if (to === "days") return minutes / 1440;
  if (to === "hours") return minutes / 60;
  if (to === "seconds") return minutes * 60;
  return minutes * 60 * 1000;
}

export function getCurrencySymbolFromCode(code: string, amount: number) {
  const hasDecimals = !Number.isInteger(amount);

  return new Intl.NumberFormat('en-GB', {
    style: "currency",
    currency: code,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  }).format(amount);
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

export function getCategoryIdFromName(category: string) {
  if (category !== "wigs" && category !== "eyelashes") return;

  if (category === "wigs") return "aa-2-14-12";
  if (category === "eyelashes") return "hb-3-2-6-3-5";
}
