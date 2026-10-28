import { createFileRoute } from '@tanstack/react-router'
import Collections from '~/app/Collections'
import { z } from "zod";

const collectionSearchSchema = z.object({
  productType: z.enum(["wigs", "eyelashes", "wigs,eyelashes", "eyelashes,wigs"]).catch("wigs"),
  collections: z.string().optional(),
  priceRange: z.string().catch("0,200"),
  sortBy: z.string().optional()
})

export const Route = createFileRoute('/collections')({
  validateSearch: (search) => collectionSearchSchema.parse(search),
  component: RouteComponent,
})

function RouteComponent() {
  return <Collections />
}
