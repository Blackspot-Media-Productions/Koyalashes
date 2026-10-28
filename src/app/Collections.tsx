import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { ChevronDown, Minus, PoundSterling, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CollectionProducts from "~/components/collection-sections/Products";
import DualRangeSlider from "~/components/ui/DualRangeSlider";
import TextField from "~/components/ui/TextField";
import { debounce } from "~/lib/utils";
import { collectionsAtom } from "~/store/app.store";

type AccordionProps = {
  title: string;
  listName: string;
  selected: string | string[];
  changeSelected: (value: string, checked: boolean) => void;
  list: {
    label: string;
    value: string;
  }[];
};

function FilterAccordion(props: AccordionProps) {
  return (
    <div className="px-6 space-y-4.5">
      <div className="flex items-center justify-between">
        <p className="text-near-black">{props.title}</p>
        <button type="button">
          <Minus size={14} className="text-near-black" />
        </button>
      </div>

      <div className="space-y-4.5">
        {props.list.map((l) => (
          <label
            htmlFor={l.value}
            key={l.label.toLowerCase()}
            className="flex items-center gap-x-3"
          >
            <input
              type="checkbox"
              name={props.listName}
              id={l.value}
              checked={props.selected?.includes(l.value)}
              onChange={(e) => props.changeSelected(l.value, e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{l.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

const productsFilterMap = [
  { label: "Eyelashes", value: "eyelashes" },
  { label: "Wigs", value: "wigs" },
];

export default function Collections() {
  const navigate = useNavigate();
  const collections = useAtomValue(collectionsAtom);
  const search = useSearch({ from: "/collections" });

  const [sortBy, setSortBy] = useState<"featured" | "newest" | "oldest">("newest");

  const [selectedFilters, setSelectedFilters] = useState({
    products: [...search.productType.split(",")],
    collections: [...(search.collections?.split(",") || [])],
    priceRange: { min: 0, max: 200 },
  });

  const debouncedNavigate = useMemo(() => {
    return debounce((freshUrlObject: typeof search) => {
      navigate({
        to: "/collections",
        search: freshUrlObject,
        replace: true,
        resetScroll: false,
      });
    }, 500);
  }, [navigate]);

  const updateRangeTextField = (value: string, type: "min" | "max") => {
    let finalValue: number | null = null;

    const valueAsNumber = Number(value);
    if (!isNaN(valueAsNumber)) {
      finalValue =
        valueAsNumber > 200 ? 200 : valueAsNumber < 0 ? 0 : valueAsNumber;
    }

    setSelectedFilters((c) => ({
      ...c,
      priceRange: {
        ...c.priceRange,
        [type]: finalValue === null ? c.priceRange[type] : finalValue,
      },
    }));
  };

  useEffect(() => {
    if (search) {
      let searchPriceRange = search.priceRange
        ? [...search.priceRange.split(",")]
        : [selectedFilters.priceRange.min, selectedFilters.priceRange.max];

      setSelectedFilters((current) => ({
        products: search.productType
          ? [...search.productType.split(",")]
          : current.products,
        collections: search.collections
          ? [...search.collections.split(",")]
          : current.collections,
        priceRange: {
          min: Number(searchPriceRange[0]),
          max: Number(searchPriceRange[1]),
        },
      }));
    }
  }, [search]);

  useEffect(() => {
    const productString = selectedFilters.products.join(",");
    const collectionString = selectedFilters.collections.join(",");

    const priceRangeArray = [
      selectedFilters.priceRange.min,
      selectedFilters.priceRange.max,
    ];
    const priceRangeString = priceRangeArray.join(",");

    const urlObject: typeof search = {
      productType: search.productType,
      priceRange: search.priceRange,
    };

    if (productString !== search.productType) {
      urlObject.productType = productString as typeof search.productType;
    }

    const collectionsValue =
      collectionString !== search.collections
        ? collectionString
        : search.collections;
    if (collectionsValue) {
      urlObject.collections = collectionsValue;
    }

    const priceRangeValue =
      priceRangeString !== search.priceRange
        ? priceRangeString
        : search.priceRange;
    if (priceRangeValue) {
      urlObject.priceRange = priceRangeValue;
    }

    if (priceRangeString !== search.priceRange) {
      debouncedNavigate(urlObject);
    } else {
      navigate({
        to: "/collections",
        search: urlObject,
        replace: true,
        resetScroll: false,
      });
    }
  }, [selectedFilters]);

  return (
    <div className="w-full">
      <section className="relative h-112">
        <img
          src="/img/hero-image.jpg"
          alt="collections section's hero image"
          className="bg-muted w-full h-full object-cover"
        />

        <div className="w-full h-full bg-black/40 absolute z-2 top-0 left-0">
          <div className="kl-container h-full flex flex-col items-center justify-end">
            <h1 className="text-off-white text-5xl font-dm-serif mb-23">
              Explore our Collection
            </h1>
          </div>
        </div>
      </section>

      <section className="flex">
        <aside className="w-[22%] shrink-0 border-r border-grey space-y-7">
          <div className="h-25 border-b border-grey px-6 flex items-center justify-between">
            <p className="text-2xl text-near-black font-dm-serif">Filters</p>
            <button
              type="button"
              className="text-primary"
              onClick={() => {
                setSelectedFilters({
                  products: ["wigs"],
                  collections: [],
                  priceRange: { max: 200, min: 0 },
                });
                navigate({
                  to: "/collections",
                  search: {
                    productType: "wigs",
                    priceRange: "0,200",
                  },
                  replace: true,
                  resetScroll: false,
                });
              }}
            >
              Clear filters
            </button>
          </div>

          <div className="px-6">
            <TextField
              label="Search"
              icon={Search}
              name="search"
              id="search"
              placeholder="Search the collection"
            />
          </div>

          <div className="border-b border-grey pb-7 space-y-7">
            <FilterAccordion
              title="Products"
              list={productsFilterMap}
              selected={selectedFilters.products}
              changeSelected={(value, checked) =>
                setSelectedFilters((c) => ({
                  ...c,
                  products: checked
                    ? Array.from(new Set([...c.products, value]))
                    : c.products.filter((p) => p !== value),
                }))
              }
              listName="products-filter"
            />
            <FilterAccordion
              title="Collections"
              list={collections
                .filter((c) => c.slug !== "featured")
                .map((c) => ({ label: c.title, value: c.slug }))}
              listName="collections-filter"
              selected={selectedFilters.collections}
              changeSelected={(value, checked) =>
                setSelectedFilters((c) => ({
                  ...c,
                  collections: checked
                    ? Array.from(new Set([...c.collections, value]))
                    : c.collections.filter((p) => p !== value),
                }))
              }
            />
          </div>

          <div className="px-6 w-full space-y-5 pb-7 border-b border-grey mb-8">
            <div className="flex items-center justify-between">
              <p className="text-near-black">Price</p>
              <button type="button">
                <Minus size={14} className="text-near-black" />
              </button>
            </div>

            <div className="w-full flex flex-col gap-y-5">
              <DualRangeSlider
                initialMax={selectedFilters.priceRange.max}
                initialMin={selectedFilters.priceRange.min}
                max={200}
                min={0}
                onChange={(range) =>
                  setSelectedFilters((c) => ({ ...c, priceRange: range }))
                }
              />

              <div className="w-full grid grid-cols-2 gap-3">
                <TextField
                  icon={PoundSterling}
                  iconProps={{ size: 13 }}
                  id="min-price"
                  name="price_range_min"
                  value={selectedFilters.priceRange.min}
                  className="py-1 gap-x-px!"
                  onChange={(value) => updateRangeTextField(value, "min")}
                />
                <TextField
                  icon={PoundSterling}
                  iconProps={{ size: 13 }}
                  id="max-price"
                  name="price_range_max"
                  value={selectedFilters.priceRange.max}
                  className="py-1 gap-x-px!"
                  onChange={(value) => updateRangeTextField(value, "max")}
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="w-full">
          <div className="h-25 border-b border-grey px-6 flex items-center justify-between">
            <p className="text-sm text-muted">All collections</p>

            <div className="group max-w-[40%] flex items-center gap-x-2.5 pr-8">
              <p className="text-sm text-muted shrink-0">Sort by</p>
              <div className="w-full relative">
                <button type="button" className="relative flex items-center gap-x-2.5 after:w-full after:h-3 after:absolute after:top-full">
                  <p className="text-sm text-near-black capitalize">{sortBy}</p>
                  <ChevronDown size={14} className="text-near-black" />
                </button>

                <div className="hidden absolute mt-2 right-0 bg-primary text-white max-w-50 pl-3 pr-10 py-1 group-hover:flex flex-col">
                  {["featured", "oldest", "newest"].map((sort) => (
                    <button key={sort} type="button" onClick={() => setSortBy(sort as typeof sortBy)} className="text-sm text-left py-1 capitalize hover:underline">{sort}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <CollectionProducts filterOptions={selectedFilters} sortOption={sortBy} />
        </div>
      </section>
    </div>
  );
}
