import { Catalog, App } from "@/clients/neynar";
import { useQuery } from "@tanstack/react-query";

export async function getCatalogData() {
  const catalog = await import("../../public/catalog.min.json");
  return catalog.default as Catalog;
}

function filterCatalog(data: Catalog, category: string, search: string) {
  if (category) {
    data.apps = data.apps.filter((app: App) => app.category === category);
  }

  if (!search) return data;
  const searchLower = search.toLowerCase();
  return {
    ...data,
    apps: data.apps.filter((app: App) => {
      const fields = [
        app.title,
        app.subtitle,
        app.description,
        app.author.username,
        app.author.displayName,
        app.homeUrl,
      ];
      return fields.some(
        (field) => field && field.toLowerCase().includes(searchLower)
      );
    }),
  };
}

export function useCatalog(
  initialData?: Catalog,
  category: string = "",
  search: string = ""
) {
  return useQuery<Catalog>({
    queryKey: ["catalog", category, search],
    queryFn: async () => {
      const res = await fetch("/catalog.min.json");
      if (!res.ok) throw new Error("Failed to fetch catalog");
      const data = await res.json();

      return filterCatalog(data, category, search);
    },
    staleTime: 1000 * 60 * 60 * 24,
    initialData: initialData
      ? filterCatalog(initialData, category, search)
      : undefined,
  });
}
