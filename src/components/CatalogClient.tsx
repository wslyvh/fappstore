"use client";

import { Catalog } from "@/clients/neynar";
import { useCatalog } from "@/hooks/useCatalog";

interface CatalogClientProps {
  initialData: Catalog;
  category?: string;
}

export function CatalogClient({ initialData, category }: CatalogClientProps) {
  const { data, isLoading, error } = useCatalog(initialData, category);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading catalog</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
