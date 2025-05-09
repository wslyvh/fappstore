"use client";

import { App } from "@/clients/neynar";
import { useCatalog } from "@/hooks/useCatalog";

interface CatalogClientProps {
  initialData: App[];
}

export function CatalogClient({ initialData }: CatalogClientProps) {
  const { data, isLoading, error } = useCatalog(initialData);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading catalog</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
