import { CATEGORIES } from "@/clients/neynar";
import { CatalogClient } from "@/components/CatalogClient";
import { getCatalogData } from "@/hooks/useCatalog";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catalog = await getCatalogData();
  const category = CATEGORIES.find((c) => c.id === id);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div>
      <p className="text-2xl font-bold">{category.name}</p>
      <p className="text-sm text-gray-500">{category.description}</p>
      <p className="text-sm text-gray-500">{category.icon}</p>
      <CatalogClient initialData={catalog} category={category.id} />;
    </div>
  );
}
