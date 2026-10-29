import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { collectionsAtom } from "~/store/app.store";
import { ChevronDown, Search, User2, X } from "lucide-react";
import { useEffect, useState } from "react";
import TextField from "./ui/TextField";
import Button from "./Button";
import { cartAtom } from "~/store/cart.store";
import { getCurrencySymbolFromCode } from "~/lib/utils";
import { removeCartItem, updateCartQuantity } from "~/shopify/requests/cart";
import AuthModal from "./AuthModal";
import { customerAtom } from "~/store/auth.store";
import { logoutCustomer } from "~/shopify/requests/auth";

function NavbarDropdown(props: {
  title: string;
  link: string;
  items: { label: string; link: string }[];
}) {
  return (
    <div className="relative group">
      <div className="flex items-center gap-2.5 py-2.5 cursor-pointer">
        <Link to={props.link} role="button">
          {props.title}
        </Link>
        <span>
          <ChevronDown size={24} />
        </span>
      </div>

      <div className="hidden w-full absolute bg-primary left-0 group-hover:flex flex-col gap-y-2 px-3 py-2">
        {props.items
          .filter((i) => i.label !== "Featured")
          .map((item) => (
            <Link
              key={item.label.toLowerCase()}
              to={item.link}
              className="font-dm-sans hover:underline underline-offset-4 text-near-black"
            >
              {item.label}
            </Link>
          ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const customer = useAtomValue(customerAtom);
  const collections = useAtomValue(collectionsAtom);
  const cart = useAtomValue(cartAtom);

  const [updatingCartQuantity, setUpdatingCartQuantity] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (customer && showAuthModal) setShowAuthModal(false);
  }, [customer, showAuthModal]);

  return (
    <>
      <nav className="absolute z-999 top-0 left-1/2 -translate-x-1/2 kl-container flex items-center justify-between py-9">
        {/* links */}
        <div className="flex items-center gap-x-5 font-dm-serif text-off-white">
          <NavbarDropdown
            title="Collections"
            link="/collections"
            items={collections.map((c) => ({
              label: c.title,
              link: `/collections?collections=${c.slug}`,
            }))}
          />
          <Link to="/" className="py-2.5">
            Support
          </Link>
          <button
            type="button"
            onClick={() => setShowCart(true)}
            className="py-2.5"
          >
            <span>Cart</span>
          </button>
        </div>

        {/*logo*/}
        <Link to="/">
          <img
            src="/img/koyalashes-logo.svg"
            alt="Koyalashes Logo"
            width={102}
            height={97}
            className="w-25.5 h-24.25"
          />
        </Link>

        {/*actions*/}
        <div className="flex items-center gap-x-6">
          <button type="button">
            <Search size={24} className="text-off-white" />
          </button>

          <div className={customer ? "relative group" : ""}>
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="pt-2"
            >
              <User2 size={24} className="text-off-white" />
            </button>

            {customer && <div className="hidden group-hover:flex flex-col gap-y-2 absolute right-0 p-4 mt-4 bg-white before:absolute before:-top-4 before:h-4 before:w-full">
              <div className="flex gap-x-3 border-b border-input pb-4">
                <span className="w-9 h-9 bg-grey rounded-full grid place-content-center">
                  <User2 size={24} className="text-muted" />
                </span>
                <div>
                  <p>
                    {customer?.firstName} {customer?.lastName}
                  </p>
                  <span className="text-sm text-muted">{customer?.email}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={loggingOut}
                onClick={async () => {
                  setLoggingOut(true);
                  await logoutCustomer();
                  setLoggingOut(false);
                }}
                className="rounded text-red-500 text-sm text-left hover:bg-red-100 py-1 px-3"
              >
                Log out
              </button>
            </div>}
          </div>
        </div>
      </nav>

      {!customer && showAuthModal && (
        <AuthModal closeModal={() => setShowAuthModal(false)} />
      )}

      <div
        className={`${showCart ? "w-full" : "w-0"} h-screen bg-near-black/60 fixed z-99999 top-0 left-0`}
      >
        <div
          className={`${showCart ? "w-[36%] px-8" : "w-0"} h-screen overflow-auto bg-white float-right py-8.5 transition-all duration-300`}
        >
          <div className="w-full flex items-center justify-between border-b border-input pb-8.5">
            <h2 className="font-dm-serif text-4xl text-near-black flex items-start gap-x-3">
              Your cart{" "}
              <span className="text-sm text-muted font-dm-sans mt-2">
                ({cart?.items.length || 0})
              </span>
            </h2>

            <button type="button" onClick={() => setShowCart(false)}>
              <X size={22} className="text-near-black" />
            </button>
          </div>

          {/* Cart items */}
          <div>
            {cart?.items.length === 0 && (
              <p className="text-muted text-center py-12">
                No items in cart yet.
              </p>
            )}

            {cart?.items &&
              cart.items.length > 0 &&
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="w-full py-7 border-b border-input flex gap-x-5"
                >
                  <img
                    src={item.merchandise.image.url}
                    alt={`${item.merchandise.product.handle} cover image`}
                    className="w-26 h-33 object-cover"
                  />
                  <div className="w-full flex flex-col gap-y-3">
                    <div className="flex justify-between gap-x-4">
                      <div className="flex flex-col gap-y-3">
                        <p>{item.merchandise.product.title}</p>
                        {/*<span>{item.merchandise.}</span>*/}
                      </div>
                      <p>
                        {getCurrencySymbolFromCode(
                          item.cost.totalAmount.currencyCode,
                          Number(item.cost.totalAmount.amount),
                        )}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-27 px-3 h-9 border border-input flex items-center justify-between">
                        <button
                          type="button"
                          disabled={updatingCartQuantity}
                          onClick={async () => {
                            setUpdatingCartQuantity(true);
                            await updateCartQuantity(
                              item.id,
                              item.quantity === 1 ? 1 : item.quantity - 1,
                            );
                            setUpdatingCartQuantity(false);
                          }}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          disabled={updatingCartQuantity}
                          onClick={async () => {
                            setUpdatingCartQuantity(true);
                            await updateCartQuantity(
                              item.id,
                              item.quantity + 1,
                            );
                            setUpdatingCartQuantity(false);
                          }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={updatingCartQuantity}
                        onClick={async () => {
                          setUpdatingCartQuantity(true);
                          await removeCartItem(item.id);
                          setUpdatingCartQuantity(false);
                        }}
                        className="text-sm text-near-black underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div
            className={`${showCart ? "w-[36%] px-8" : "w-0"} bg-white fixed bottom-0 right-0 border-t border-input py-7 transition-all duration-300`}
          >
            <div className="flex items-end gap-x-3 border-b border-input pb-6 mb-6">
              <TextField
                label="Discount code"
                id="discount-code"
                name="discount_code"
                placeholder="Enter code"
                value={discountCode}
                onChange={(value) => setDiscountCode(value)}
              />
              <Button
                disabled={discountCode.trim() === ""}
                className="w-[41%] py-2.75!"
              >
                Apply
              </Button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-lg text-near-black">Subtotal</p>
              <p className="text-lg text-near-black">
                {(() => {
                  const currency =
                    cart?.items[0]?.cost.totalAmount.currencyCode || "GBP";
                  const amount =
                    cart?.items?.reduce(
                      (total, item) =>
                        total + Number(item.cost.totalAmount.amount),
                      0,
                    ) || 0;
                  return getCurrencySymbolFromCode(currency, amount);
                })()}
              </p>
            </div>

            <Button
              as="link"
              href={(cart?.items.length || 0) > 0 ? cart?.checkoutUrl : ""}
              isExternalLink
              disabled={cart?.items.length === 0}
              action={(e) =>
                cart?.items.length === 0 ? e.preventDefault() : null
              }
              className="w-full block text-center"
            >
              Checkout
            </Button>

            <button
              type="button"
              onClick={() => {
                setShowCart(false);
                if (pathname !== "collections") {
                  navigate({
                    to: "/collections",
                    search: {
                      priceRange: "0,200",
                      productType: "wigs",
                    },
                  });
                }
              }}
              className="w-full py-3 mt-2"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
