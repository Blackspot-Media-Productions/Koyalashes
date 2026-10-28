import { useSuspenseQuery, type QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import { cartQueryOptions, collectionQueryOptions } from "~/lib/queries";
import { collectionsAtom } from "~/store/app.store";

export interface KRouterContext {
  queryClient: QueryClient;
}

const RootLayout = () => {
  const {pathname} = useLocation()
  const { data: result } = useSuspenseQuery(collectionQueryOptions);
  useSuspenseQuery(cartQueryOptions);

  const updateCollections = useSetAtom(collectionsAtom)

  useEffect(() => {
    if (result.collections.length > 0) {
      updateCollections(result.collections);
    }
  }, [result]);

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
  }, [pathname]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRouteWithContext<KRouterContext>()({
  loader: async ({ context }) => {
    return context.queryClient.query(collectionQueryOptions);
  },

  pendingComponent: () => (
    <div className="w-full h-screen">
      <img src="/img/loading-screen.jpg" alt="setting up view" className="w-full h-full object-cover bg-primary/20" />
    </div>
  ),
  pendingMs: 0,

  component: RootLayout,
});
