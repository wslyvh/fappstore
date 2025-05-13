import { getCatalogData } from "@/clients/neynar";
import AppDetails from "@/components/AppDetails";
import { Suspense } from "react";

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
    <Suspense>
      <AppDetails app={app} />
    </Suspense>
  );
}
