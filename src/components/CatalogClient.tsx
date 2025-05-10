"use client";

import { Catalog } from "@/clients/neynar";
import { useCatalog } from "@/hooks/useCatalog";
import { useSearchParams } from "next/navigation";

interface CatalogClientProps {
  initialData: Catalog;
  category?: string;
}

export function CatalogClient({ initialData, category }: CatalogClientProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { data, isLoading, error } = useCatalog(initialData, category, search);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading catalog</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
