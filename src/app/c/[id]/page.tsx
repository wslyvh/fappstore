import { CATEGORIES } from "@/utils/config";
import { Explorer } from "@/components/Explorer";
import { getCatalogData } from "@/clients/neynar";
import { Suspense } from "react";

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
      <div className="relative flex items-center gap-8 p-8 mb-8 rounded-xl bg-base-200 shadow-lg overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">{category.name}</h2>
          <p className="text-base text-base-content/70">
            {category.description}
          </p>
        </div>
        <span
          className="text-8xl opacity-20 absolute right-8 pointer-events-none select-none leading-none"
          aria-hidden="true"
        >
          {category.icon}
        </span>
      </div>

      <Suspense>
        <Explorer initialData={catalog} category={category.id} />
      </Suspense>
    </div>
  );
}
