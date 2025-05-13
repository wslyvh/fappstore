"use client";

import { useState } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import { useRouter } from "next/navigation";
import Image from "next/image";

const itemsToShow = 12;

const FILTERS = [
  { id: "top", label: "Top" },
  { id: "new", label: "New" },
];

export function Showcase() {
  const { data } = useCatalog();
  const [filter, setFilter] = useState("top");
  const router = useRouter();

  if (!data) return null;

  const newApps = [...data.apps]
    .sort((a, b) => (b.indexedAt || 0) - (a.indexedAt || 0))
    .slice(0, itemsToShow);
  const topApps = data.apps.slice(0, itemsToShow);
  const apps = filter === "top" ? topApps : newApps;

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
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </span>
          ))}
        </div>
        <a
          href="/explore"
          className="text-primary font-semibold text-sm hover:underline ml-auto"
        >
          All Apps &raquo;
        </a>
      </div>
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
            <a
              href={`https://warpcast.com/?launchFrameUrl=${encodeURIComponent(
                app.framesUrl ?? ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-xs ml-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              Open
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
