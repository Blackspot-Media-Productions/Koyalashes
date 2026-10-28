import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Loader2, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getCategoryIdFromName,
  getCurrencySymbolFromCode,
  getTimeFromMinutes,
} from "~/lib/utils";
import { addToCart } from "~/shopify/requests/cart";
import { getFilteredProducts } from "~/shopify/requests/product";
import type { SProductFilters } from "~/shopify/types/product.types";

const DEFAULT_PAGE_COUNT = 6;

type Props = {
  filterOptions: {
    products: string[];
    collections: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  sortOption: "featured" | "newest" | "oldest";
};

export default function CollectionProducts(props: Props) {
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasPagination, setHasPagination] = useState<{
    status: boolean;
    nextCursor: string | null;
  }>({
    status: false,
    nextCursor: null,
  });

  const filters = useMemo(() => {
    const filterOptions = props.filterOptions;
    const categories = filterOptions.products.map((t) => ({
      category: { id: getCategoryIdFromName(t) },
    }));

    return [
      ...(categories || []),
      {
        price: {
          min: filterOptions.priceRange.min,
          max: filterOptions.priceRange.max,
        },
      },
    ];
  }, [props.filterOptions]);

  const { data, isPending } = useQuery({
    queryKey: ["collection-products", filters, hasPagination.nextCursor],
    queryFn: () =>
      getFilteredProducts(
        filters as unknown as SProductFilters,
        50,
        hasPagination.nextCursor,
      ),
    staleTime: getTimeFromMinutes(30),
    gcTime: getTimeFromMinutes(30),
  });

  const products = useMemo(() => {
    setCurrentPage(1);
    if (
      data?.products.length &&
      data?.products.length > 0 &&
      (props.filterOptions.collections.length > 0 || props.sortOption)
    ) {
      return data.products
        .filter((p) =>
          props.filterOptions.collections?.every((collection) =>
            p.collections?.some((e) => e.slug === collection),
          ),
        )
        .toSorted((a, b) => {
          if (props.sortOption === "featured") {
            const aFeatured =
              a.collections?.some((c) => c.slug === "featured") ?? false;
            const bFeatured =
              b.collections?.some((c) => c.slug === "featured") ?? false;

            return Number(bFeatured) - Number(aFeatured);
          }

          if (props.sortOption === "newest") {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }

          if (props.sortOption === "oldest") {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          }

          return 0;
        });
    }

    return data?.products;
  }, [data?.products, props.filterOptions.collections, props.sortOption]);

  const sliceIndex = useMemo(() => {
    const startIndex = (currentPage - 1) * DEFAULT_PAGE_COUNT;
    return {
      start: startIndex,
      end: startIndex + DEFAULT_PAGE_COUNT,
    };
  }, [currentPage]);

  useEffect(() => {
    if (!hasPagination.status && data?.pagination.hasNextPage) {
      setHasPagination({
        status: data.pagination.hasNextPage,
        nextCursor: data.pagination.endCursor,
      });
    }
  }, [hasPagination]);

  const canAddPages = () => {
    const productLength = data?.products.length || 0;
    if (productLength / (DEFAULT_PAGE_COUNT * currentPage + 1) >= 1) {
      return true;
    }

    return false;
  };

  return (
    <div className="pb-16">
      {isPending && (
        <div className="w-full flex justify-center py-12">
          <Loader2 size={32} className="text-primary animate-spin" />
        </div>
      )}

      {products?.length === 0 && (
        <div className="w-full py-12 flex justify-center">
          <p className="text-muted text-sm">
            No products found for these selections.
          </p>
        </div>
      )}

      {(products?.length || 0) > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-7 md:gap-x-6 md:gap-y-12 px-5 md:px-10 py-6 lg:py-7">
          {products?.slice(sliceIndex.start, sliceIndex.end).map((product) => {
            const currency =
              product.priceRange?.maxVariantPrice.currencyCode || "GBP";
            const amount =
              Number(product.priceRange?.maxVariantPrice.amount) || 0;
            const price = getCurrencySymbolFromCode(currency, amount);
            const variant = product.variants?.[0].id || "";

            const isAddingToCart = addingToCart === product.id
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
                      await addToCart(variant)
                      setAddingToCart(null);
                    }}
                    disabled={addingToCart !== null}
                    className="w-8 h-8 rounded-full bg-near-black grid place-content-center"
                  >
                    <AddIcon size={19} className={isAddingToCart ? "animate-spin text-white" : "text-primary"} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(products?.length || 0) > DEFAULT_PAGE_COUNT && (
        <div className="flex items-center justify-center gap-x-4">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ArrowLeft
              size={24}
              className={currentPage > 1 ? "text-near-black" : "text-grey"}
            />
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(currentPage)}
            className={`w-9 h-9 border ${canAddPages() ? "border-primary" : "border-near-black"} grid place-content-center text-sm text-near-black`}
          >
            {canAddPages() ? currentPage : currentPage - 1}
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`w-9 h-9 border ${canAddPages() ? "border-near-black" : "border-primary"} grid place-content-center text-sm text-near-black`}
          >
            {canAddPages() ? currentPage + 1 : currentPage}
          </button>
          <button
            type="button"
            disabled={currentPage >= (data?.products.length || 0) / 6}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ArrowRight
              size={24}
              className={
                currentPage < (data?.products.length || 0) / 6
                  ? "text-near-black"
                  : "text-grey"
              }
            />
          </button>
        </div>
      )}
    </div>
  );
}
