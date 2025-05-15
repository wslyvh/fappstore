import { getCatalogData } from "@/clients/neynar";
import AppDetails from "@/components/AppDetails";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const catalog = await getCatalogData();
  const app = catalog.apps.find((app) => app.id === params.id);

  if (!app) {
    return {
      title: "App Not Found",
    };
  }

  const metadata: Metadata = {
    title: app.title,
    description: app.description,
  };

  if (app.imageUrl) {
    metadata.openGraph = {
      images: app.imageUrl,
    };
    metadata.twitter = {
      images: app.imageUrl,
    };
  }

  return metadata;
}

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

  const relatedApps = catalog.apps.filter(
    (i) => i.author.username === app.author.username
  );

  return (
    <Suspense>
      <AppDetails app={app} relatedApps={relatedApps} />
    </Suspense>
  );
}
