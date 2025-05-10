import { CatalogClient } from "@/components/CatalogClient";
import { getCatalogData } from "@/clients/neynar";

export default async function Page() {
  const catalog = await getCatalogData();

  return (
    <>
      <CatalogClient initialData={catalog} />;
    </>
  );
}
