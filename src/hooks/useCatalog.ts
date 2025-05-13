"use client";

import { App, Catalog } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

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

export function useCatalog(initialData?: Catalog, category: string = "") {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

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
