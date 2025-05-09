import { App } from "@/clients/neynar";
import { useQuery } from "@tanstack/react-query";

export async function getCatalogData() {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const res = await fetch(`${url}/catalog.min.json`);
  if (!res.ok) throw new Error("Failed to fetch catalog");
  return res.json();
}

export const useCatalog = (initialData?: App[]) => {
  return useQuery<App[]>({
    queryKey: ["catalog"],
    queryFn: async () => {
      const res = await fetch("/data/catalog-min.json");
      if (!res.ok) throw new Error("Failed to fetch catalog");
      return res.json();
    },
    staleTime: 1000 * 60 * 60 * 24,
    initialData,
  });
};
