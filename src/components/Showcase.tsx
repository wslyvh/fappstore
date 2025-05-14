"use client";

import { useCatalog } from "@/hooks/useCatalog";
import { useRouter, useSearchParams } from "next/navigation";
import { openFrame } from "@/utils/frames";
import { App } from "@/utils/types";
import Image from "next/image";

const itemsToShow = 12;

const FILTERS = [
  { id: "popular", label: "Popular" },
  { id: "newest", label: "New" },
];

export function Showcase() {
  const { data } = useCatalog();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "popular";

  if (!data) return null;

  const newApps = [...data.apps]
    .sort((a, b) => (b.indexedAt || 0) - (a.indexedAt || 0))
    .slice(0, itemsToShow);
  const popularApps = data.apps.slice(0, itemsToShow);
  const apps = filter === "popular" ? popularApps : newApps;

  const handleFilterChange = (filterId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", filterId);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="w-full">
      <div className="flex gap-2 mb-8 items-center justify-between flex-wrap">
        <div className="flex gap-4">
          {FILTERS.map((f) => (
            <span
              key={f.id}
              className={`badge badge-xl badge-soft cursor-pointer select-none font-semibold px-4 transition-colors duration-100 ${
                filter === f.id ? "badge-primary" : "badge-outline"
              }`}
              onClick={() => handleFilterChange(f.id)}
            >
              {f.label}
            </span>
          ))}
        </div>
        <a
          href={`/explore?sort=${filter}`}
          className="text-primary font-semibold text-sm hover:underline ml-auto"
        >
          All Apps &raquo;
        </a>
      </div>

      <AppGrid apps={apps} />
    </section>
  );
}

export function AppGrid({ apps }: { apps: App[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {apps.map((app) => (
        <div
          key={app.id}
          className="flex items-center gap-4 p-4 rounded-xl transition-shadow hover:bg-base-200 hover:shadow-lg group cursor-pointer"
          onClick={() => router.push(`/app/${app.id}`)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              router.push(`/app/${app.id}`);
          }}
        >
          <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src={app.iconUrl}
              alt={app.title}
              width={64}
              height={64}
              className="w-16 h-16 object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{app.title}</div>
            <div className="text-xs text-base-content/60 truncate mt-2">
              by {app.author.displayName}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openFrame(app.framesUrl);
            }}
            className="btn btn-primary btn-xs ml-auto z-10"
          >
            Open
          </button>
        </div>
      ))}
    </div>
  );
}
