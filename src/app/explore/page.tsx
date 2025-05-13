import { Explorer } from "@/components/Explorer";
import { getCatalogData } from "@/clients/neynar";
import { Suspense } from "react";

export default async function Page() {
  const catalog = await getCatalogData();

  return (
    <div>
      <div className="relative flex items-center gap-8 p-8 mb-8 rounded-xl bg-base-200 shadow-lg overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">All Apps</h2>
          <p className="text-base text-base-content/70">
            Explore all apps in the Farcaster ecosystem.
          </p>
        </div>
        <span
          className="text-8xl opacity-20 absolute right-8 pointer-events-none select-none leading-none"
          aria-hidden="true"
        >
          🚀
        </span>
      </div>

      <Suspense>
        <Explorer initialData={catalog} />
      </Suspense>
    </div>
  );
}
