"use client";

import { Catalog, App } from "@/clients/neynar";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
  const [search, setSearch] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setSearch(searchParams.get("search") || "");
  }, []);

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
