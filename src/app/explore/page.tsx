import { CatalogClient } from "@/components/CatalogClient";
import { getCatalogData } from "@/hooks/useCatalog";

export default async function Page() {
  const catalog = await getCatalogData();

  return (
    <>
      <CatalogClient initialData={catalog} />;
    </>
  );
}
