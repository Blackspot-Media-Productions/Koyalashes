import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useLoaderData, useParams, useSearch } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import { getCurrencySymbolFromCode } from "~/lib/utils";
import { addToCart } from "~/shopify/requests/cart";
import { getProductsByCollection } from "~/shopify/requests/product";

export default function Product() {
  const { slug } = useParams({ from: "/collection/$slug" });
  const data = useLoaderData({ from: "/collection/$slug" });
  const { collection } = useSearch({ from: "/collection/$slug" });

  if (!data) {
    return Navigate({ to: "/" });
  }

  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [updatingCartQuantity, setUpdatingCartQuantity] = useState(false);

  const [cartQuantity, setCartQuantity] = useState(1);
  const [selectedVariant, _setSelectedVariant] = useState(
    data.product.variants?.[0].id || "",
  );

  const { data: related, isPending } = useQuery({
    queryKey: ["related", collection || "featured"],
    queryFn: () => getProductsByCollection(collection || "featured"),
    staleTime: Infinity
  });

  useEffect(() => {
    if (data.product) {
      setCartQuantity(1);
      _setSelectedVariant(data.product.variants?.[0].id || "")
    }
  }, [slug]);

  return (
    <div className="w-full">
      <section className="relative h-40">
        <img
          src="/img/hero-image.jpg"
          alt="collections section's hero image"
          className="bg-muted w-full h-full object-cover"
        />
      </section>

      <section className="pt-7 pb-16 px-13.75 bg-off-white">
        <div className="kl-container">
          <p className="text-sm text-muted">
            All collections&nbsp;&nbsp;/&nbsp;&nbsp;
            {data.product.category?.name}
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <span className="text-near-black">{data.product.title}</span>
          </p>

          <div className="mt-7 flex gap-x-[7.4%]">
            <div className="w-[53%] flex gap-x-4 shrink-0">
              {data.product.images.length > 1 && (
                <div className="flex flex-col gap-y-5">
                  {data.product.images
                    .filter((_, index) => index !== 0)
                    .map((image, index) => (
                      <img
                        src={image.url}
                        alt={`${data.product.slug} image #${index + 1}`}
                        className="w-18 h-22.5"
                      />
                    ))}
                </div>
              )}
              <img
                src={data.product.images[0].url}
                alt={`${data.product.slug} cover image`}
                className="w-[87.5%] h-190 object-cover"
              />
            </div>

            <div className="flex flex-col gap-y-4.5">
              <p className="uppercase text-muted text-sm">
                koyalashes&nbsp;/&nbsp;{data.product.category?.name}
              </p>
              <h2 className="font-dm-serif text-5xl text-near-black">
                {data.product.title}
              </h2>
              <p className="text-lg text-near-black">
                {getCurrencySymbolFromCode(
                  data.product.priceRange?.maxVariantPrice.currencyCode ||
                    "GBP",
                  Number(data.product.priceRange?.maxVariantPrice.amount) || 0,
                )}
              </p>
              <p className="text-muted text-lg">
                {data.product.description || "No description for this product"}
              </p>

              <div className="flex gap-x-8 mt-2.5">
                {(data.product.variants?.length || 0) > 1 && (
                  ["length", "shade"].map((variantHead) => {
                    const [shade, length] = (data.product.variants ||
                      [])[0].title.split(" / ");

                    return (
                      <div
                        key={variantHead}
                        className={`${variantHead === "length" ? "w-[27%]" : "w-[66.8%]"} flex flex-col gap-y-3`}
                      >
                        <p className="capitalize text-sm text-near-black">
                          {variantHead}
                        </p>
                        <div className="grid place-content-center border border-primary bg-off-white px-6 py-3.5">
                          <span>
                            {variantHead === "length" ? `${length}"` : shade}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex gap-x-8 mt-2.5">
                <div className="w-[27%] px-3 h-13 border border-input flex items-center justify-between">
                  <button
                    type="button"
                    disabled={updatingCartQuantity}
                    onClick={async () => {
                      const quantity = cartQuantity <= 1 ? 1 : cartQuantity - 1;
                      setCartQuantity(quantity);
                    }}
                  >
                    -
                  </button>
                  <span>{cartQuantity}</span>
                  <button
                    type="button"
                    disabled={updatingCartQuantity}
                    onClick={async () => {
                      const quantity = cartQuantity + 1;
                      setCartQuantity(quantity);
                    }}
                  >
                    +
                  </button>
                </div>

                <Button
                  action={async () => {
                    setUpdatingCartQuantity(true);
                    await addToCart(selectedVariant, cartQuantity);
                    setUpdatingCartQuantity(false);
                    setCartQuantity(1);
                  }}
                  disabled={updatingCartQuantity}
                  className="w-3/4"
                >
                  Add to cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="kl-container px-13.75 pt-14 pb-20 flex flex-col gap-y-8">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-4xl font-dm-serif text-near-black">More from the collection</h2>
            <Link
              to="/collections"
              search={{ priceRange: "0,200", productType: "wigs", collections: collection }}
              className="text-primary text-sm"
            >
              Explore all collections
            </Link>
          </div>

          <div>
            {isPending && (
              <div className="w-full py-12 flex justify-center">
                <Loader2 size={32} className="animate-spin text-primary" />
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {(related?.products.length || 0) > 0 && (
                related?.products.filter((p) => p.id !== data.product.id).slice(0, 3).map((product) => {
                  const currency =
                    product.priceRange?.maxVariantPrice.currencyCode || "GBP";
                  const amount =
                    Number(product.priceRange?.maxVariantPrice.amount) || 0;
                  const price = getCurrencySymbolFromCode(currency, amount);
                  const variant = product.variants?.[0].id || "";

                  const isAddingToCart = addingToCart === product.id;
                  const AddIcon = isAddingToCart ? Loader2 : Plus;

                  return (
                    <div key={product.id} className="group h-117 flex flex-col gap-y-4">
                      <img
                        src={product.images[0].url}
                        alt={`${product.slug} cover image`}
                        className="h-full object-cover"
                      />
                      <div className="shrink-0 flex items-start justify-between">
                        <div className="flex flex-col gap-y-2">
                          <Link
                            to="/collection/$slug"
                            className="group-hover:underline underline-offset-4"
                            params={{ slug: product.slug }}
                            search={{ collection: product.collections?.[0]?.slug }}
                          >
                            <p className="text-near-black">{product.title}</p>
                          </Link>
                          <span className="text-sm text-muted">{price}</span>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            setAddingToCart(product.id);
                            await addToCart(variant);
                            setAddingToCart(null);
                          }}
                          className="w-8 h-8 rounded-full bg-near-black grid place-content-center"
                        >
                          <AddIcon
                            size={19}
                            className={
                              isAddingToCart
                                ? "animate-spin text-white"
                                : "text-primary"
                            }
                          />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
