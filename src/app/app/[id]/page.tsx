import { getCatalogData } from "@/clients/neynar";
import AppDetailClient from "@/components/AppDetailClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catalog = await getCatalogData();
  const app = catalog.apps.find((app) => app.id === id);

  return <AppDetailClient app={app} />;
}
