import { getCatalogData } from "@/clients/neynar";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catalog = await getCatalogData();

  const app = catalog.apps.find((app) => app.id === id);

  if (!app) {
    return <div>App not found</div>;
  }

  return (
    <div>
      <p className="text-2xl font-bold">{app.title}</p>
      <p className="text-sm text-gray-500">{app.description}</p>
      <p className="text-sm text-gray-500">{app.category}</p>
      <p className="text-sm text-gray-500">{app.homeUrl}</p>
    </div>
  );
}
