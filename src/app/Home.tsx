import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import Slider from "~/components/ui/Slider";
import { type Collection, type Product } from "~/lib/types";
import { getCurrencySymbolFromCode, getTimeFromMinutes } from "~/lib/utils";
import { queryClient } from "~/main";
import {
  getLatestProducts,
  getProductByCategory,
  getProductsByCollection,
} from "~/shopify/requests/product";
import { collectionsAtom } from "~/store/app.store";

const productCategories = ["eyelashes", "wigs"];

export default function Homepage() {
  const collections = useAtomValue(collectionsAtom);

  const [_prevActiveFilter, setPrevActiveFilter] = useState("eyelashes");
  const [activeFilter, setActiveFilter] = useState("eyelashes");

  const [prevTrendingFilter, setPrevTrendingFilter] = useState("eyelashes");
  const [trendingFilter, setTrendingFilter] = useState("eyelashes");

  const { data: featured, isPending: isPendingFeature } = useQuery({
    queryKey: ["featured-products", "featured"],
    queryFn: () => getProductsByCollection("featured"),
    staleTime: getTimeFromMinutes(30), // keep as fresh for 30 minutes
    gcTime: getTimeFromMinutes(30), // keep in cache for 30 minutes before garbage
  });

  const { data: trending, isFetching: isPendingTrending } = useQuery({
    queryKey: ["trending-products", trendingFilter],
    queryFn: () => {
      return getProductByCategory(trendingFilter, null, 5);
    },
    staleTime: getTimeFromMinutes(30),
    gcTime: getTimeFromMinutes(30),
  });

  const { data: latest, isPending: isPendingLatest } = useQuery({
    queryKey: ["latest-products"],
    queryFn: () => getLatestProducts(3),
    staleTime: getTimeFromMinutes(30),
    gcTime: getTimeFromMinutes(30)
  })

  useEffect(() => {
    if (trendingFilter !== prevTrendingFilter) {
      // queryClient.invalidateQueries({
      //   queryKey: ["trending-products", prevTrendingFilter],
      // });
      queryClient.resetQueries({
        queryKey: ["trending-products", prevTrendingFilter],
      });
    }
  }, [trendingFilter]);

  return (
    <div>
      <section id="hero-section">
        {isPendingFeature ? (
          <div className="relative z-99999 w-full h-screen bg-muted/20 flex items-center justify-center backdrop-blur-2xl">
            <Loader2 size={96} className="text-primary animate-spin" />
          </div>
        ) : (
          <Slider
            key="id"
            data={featured?.products.reverse() ?? []}
            render={(item) => {
              const product = item as Product;
              return (
                <div key={product.id} className="relative">
                  <img
                    src={product.images[0].url}
                    alt={`${product.slug} cover image`}
                    className="bg-muted w-full h-screen object-cover"
                  />

                  <div className="w-full h-screen bg-black/40 absolute z-2 top-0 left-0">
                    <div className="kl-container h-full flex flex-col justify-end pb-[15vh]">
                      <p className="text-white text-lg mb-4">
                        Elevate your look
                      </p>
                      <h1 className="text-off-white text-5xl font-dm-serif mb-8">
                        {product.title}
                      </h1>
                      <Button className="w-fit">Shop Now</Button>
                    </div>
                  </div>
                </div>
              );
            }}
          />
        )}
      </section>

      <section className="kl-container py-14">
        <h2 className="mb-8 text-4xl font-dm-serif">Explore Koyalashes</h2>
        <div className="mb-14 flex gap-x-4">
          {productCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setPrevActiveFilter(activeFilter);
                setActiveFilter(category);
              }}
              className="uppercase"
            >
              <span
                className={`uppercase ${activeFilter === category ? "text-near-black border-b border-near-black pb-0.5" : "text-muted"}`}
              >
                {category}
              </span>
            </button>
          ))}
        </div>

        <div className="w-full">
          <Slider
            key="id"
            data={collections.filter((c) => c.slug !== "featured") || []}
            render={(item) => {
              const collection = item as Collection;
              return (
                <div key={collection.id} className="relative w-full h-150">
                  <img
                    src={collection.image?.url}
                    alt={collection.image?.altText}
                    className="w-full h-full object-cover bg-primary"
                  />
                  <div className="absolute top-0 w-full h-full bg-black/33 flex flex-col items-center justify-end gap-y-6 px-8 xl:px-20 py-14.5">
                    <p className="font-dm-serif text-5xl uppercase text-center text-white">
                      {collection.title}
                    </p>
                    <Button>Shop now</Button>
                  </div>
                </div>
              );
            }}
            showDots={false}
            carouselOpts={{ active: false }}
            ciClassName="basis-1/3"
          />
        </div>
      </section>

      <section id="trending" className="kl-container py-8.25 space-y-14">
        <h2 className="text-center mb-6 font-dm-serif text-4xl uppercase">
          Trending in store
        </h2>
        <div className="flex justify-center gap-x-4">
          {productCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setPrevTrendingFilter(trendingFilter);
                setTrendingFilter(category);
              }}
              className="uppercase"
            >
              <span
                className={`uppercase ${trendingFilter === category ? "text-near-black border-b border-near-black pb-0.5" : "text-muted"}`}
              >
                {category}
              </span>
            </button>
          ))}
        </div>

        {isPendingTrending && (
          <div className="w-full flex justify-center py-12">
            <Loader2 size={32} className="text-primary animate-spin" />
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!isPendingTrending &&
            trending?.products.map((product) => {
              const currency =
                product.priceRange?.maxVariantPrice.currencyCode || "GBP";
              const amount =
                Number(product.priceRange?.maxVariantPrice.amount) || 0;
              const price = getCurrencySymbolFromCode(currency, amount);

              return (
                <div key={product.id} className="h-117 flex flex-col gap-y-4">
                  <img
                    src={product.images[0].url}
                    alt={`${product.slug} cover image`}
                    className="h-full object-cover"
                  />
                  <div className="shrink-0 flex items-start justify-between">
                    <div className="flex flex-col gap-y-2">
                      <p className="text-near-black">{product.title}</p>
                      <span className="text-sm text-muted">{price}</span>
                    </div>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-near-black grid place-content-center"
                    >
                      <Plus size={19} className="text-primary" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      <section id="latest" className="w-full bg-[#F4F0EF]">
        <div className="kl-container w-full py-29.25">
          <div className="flex flex-col items-center gap-y-4">
            <span className="uppercase">Online @Koyalashes</span>
            <h2 className="uppercase text-5xl text-near-black font-dm-serif">
              FOLLOW FOR THE LATEST
            </h2>
          </div>

          <div className="mt-21.25">
            {isPendingLatest && (
              <div className="w-full flex justify-center py-12">
                <Loader2 size={32} className="text-primary animate-spin" />
              </div>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {!isPendingLatest &&
                latest?.products.map((product) => {
                  const currency =
                    product.priceRange?.maxVariantPrice.currencyCode || "GBP";
                  const amount =
                    Number(product.priceRange?.maxVariantPrice.amount) || 0;
                  const price = getCurrencySymbolFromCode(currency, amount);

                  return (
                    <div key={product.id} className="h-145 flex flex-col">
                      <img
                        src={product.images[0].url}
                        alt={`${product.slug} cover image`}
                        className="h-full bg-product-bg object-cover"
                      />
                      <div className="shrink-0 bg-white px-2.5 py-6 flex items-center justify-between">
                        <div className="flex items-center gap-x-4.5">
                          <img src={product.images[0].url} alt={`${product.slug} cover image mini`} className="shrink-0 w-12.25 h-15 object-cover" />
                          <div className="flex flex-col gap-y-2">
                            <p className="text-sm xl:text-base text-near-black">{product.title}</p>
                            <span className="text-sm text-muted">{price}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full bg-near-black grid place-content-center"
                        >
                          <Plus size={19} className="text-primary" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
