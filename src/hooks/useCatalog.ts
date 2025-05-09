import { Catalog } from "@/clients/neynar";
import { useQuery } from "@tanstack/react-query";

export async function getCatalogData() {
  const catalog = await import("../../public/catalog.min.json");
  return catalog.default as Catalog;
}

export const useCatalog = (initialData?: Catalog) => {
  return useQuery<Catalog>({
    queryKey: ["catalog"],
    queryFn: async () => {
      const res = await fetch("/catalog.min.json");
      if (!res.ok) throw new Error("Failed to fetch catalog");
      return res.json();
    },
    staleTime: 1000 * 60 * 60 * 24,
    initialData,
  });
};
