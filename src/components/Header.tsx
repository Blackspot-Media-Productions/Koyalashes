import { useQuery } from "@tanstack/react-query";
import Navbar from "./Navbar";
import { getProductsByCollection } from "~/shopify/requests/product";
import { getTimeFromMinutes } from "~/lib/utils";
import Slider from "./ui/Slider";
import type { Product } from "~/lib/types";
import { Loader2 } from "lucide-react";
import Button from "./Button";

export default function Header() {
  const { data: result, isPending } = useQuery({
    queryKey: ["featured-products", "featured"],
    queryFn: () => getProductsByCollection("featured"),
    staleTime: getTimeFromMinutes(30), // keep as fresh for 30 minutes
    gcTime: getTimeFromMinutes(30), // keep in cache for 30 minutes before garbage
  });

  return (
    <header>
      <Navbar />

      <div className="relative">
        {isPending ? (
          <div className="relative z-99999 w-full h-screen bg-muted/40 flex items-center justify-center backdrop-blur-2xl">
            <Loader2 size={32} />
          </div>
        ) : (
          <Slider
            key="id"
            data={result?.products ?? []}
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
                      <p className="text-white text-lg mb-4">Elevate your look</p>
                      <h1 className="text-off-white text-5xl font-dm-serif mb-8">{product.title}</h1>
                      <Button className="w-fit">Shop Now</Button>
                    </div>
                  </div>
                </div>
              );
            }}
          />
        )}
      </div>
    </header>
  );
}
