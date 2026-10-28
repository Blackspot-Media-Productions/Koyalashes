import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import Product from "~/app/Product";
import { getProductBySlug } from "~/shopify/requests/product";

const productSearchSchema = z.object({
  collection: z.string().optional(),
});

const productCounts = { images: 10, product: 10, variants: 10 };

export const Route = createFileRoute("/collection/$slug")({
  validateSearch: (search) => productSearchSchema.parse(search),
  loader: ({ params }) => getProductBySlug(params.slug, productCounts),
  component: RouteComponent,
});

function RouteComponent() {
  return <Product />;
}
