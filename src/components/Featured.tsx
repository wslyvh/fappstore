"use client";

import { useRef, useState, useEffect } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import { App } from "@/utils/types";
import { FEATURED_APPS } from "@/utils/config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { openFrame } from "@/utils/frames";

export function Featured() {
  const { data: apps } = useCatalog();
  if (!apps) return null;

  const featuredApps = FEATURED_APPS.map((id) =>
    apps.apps.find((app: App) => app.id === id)
  ).filter((app): app is App => app !== undefined);

  return <FeaturedSlider apps={featuredApps} />;
}

export function FeaturedSlider({ apps }: { apps: App[] }) {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const updateScrollButtons = () => {
      if (!carouselRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };
    updateScrollButtons();
    carouselRef.current?.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      carouselRef.current?.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({
        left: dir === "left" ? -width : width,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {canScrollLeft && (
        <button
          className="btn btn-circle btn-lg p-0 bg-base-200/80 backdrop-blur absolute left-4 top-1/2 z-10 hover:bg-base-300 focus:bg-base-300 border-none focus:outline-none focus-visible:outline-none"
          style={{ width: 48, height: 48 }}
          onClick={() => scroll("left")}
          aria-label="Previous"
          tabIndex={0}
        >
          ❮
        </button>
      )}

      <div
        className="carousel carousel-center space-x-8 w-full overflow-x-auto overflow-visible scroll-smooth"
        ref={carouselRef}
        style={{ scrollSnapType: "x mandatory" }}
      >
        {apps.map((app) => (
          <div
            key={app.id}
            className="carousel-item w-[32rem] max-w-full flex-shrink-0"
            style={{ scrollSnapAlign: "center" }}
          >
            <div
              className="card bg-base-300 shadow-md w-full hover:shadow-lg cursor-pointer"
              onClick={() => router.push(`/app/${app.id}`)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  router.push(`/app/${app.id}`);
              }}
            >
              <figure className="w-full aspect-[3/2.1] relative overflow-hidden">
                <Image
                  src={app.imageUrl ?? app.iconUrl}
                  alt={app.title}
                  fill
                  className="w-full h-full object-cover"
                  sizes="(max-width: 512px) 100vw, 512px"
                />
                <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none bg-gradient-to-t from-base-300/100 via-base-300/80 to-transparent" />
              </figure>
              <div className="card-body -mt-12 relative z-10">
                <h3 className="card-title text-2xl">{app.title}</h3>
                <div className="flex items-center mt-4 justify-between gap-2">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mr-3 overflow-hidden">
                      <img
                        src={app.author.pfpUrl}
                        alt={app.author.displayName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center font-semibold text-lg gap-1">
                        {app.author.displayName}
                        {app.author.powerBadge && (
                          <span
                            title="Power Badge"
                            className="inline-flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 841.89 595.28"
                              width="24"
                              height="24"
                              className="text-secondary"
                              fill="currentColor"
                            >
                              <path
                                d="M351.54,516.77l-39.52-67.9l-78.54-16.17l8.83-76.77l-49.93-58.5l49.93-57.98l-8.83-76.75l78.54-16.21
        l39.52-68.39l69.71,32.39l69.71-32.39l40.05,68.41l78.01,16.19l-8.83,76.77l49.93,57.96l-49.93,58.5l8.83,76.77l-78.01,16.17
        l-40.05,67.9l-69.71-32.39L351.54,516.77z M398.88,366.9l118.08-117.51l-23.4-21.42l-94.68,94.01l-49.4-51.69l-23.94,23.48
        C325.55,293.77,398.88,366.9,398.88,366.9z"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        @{app.author.username}
                      </div>
                    </div>
                  </div>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openFrame(app.framesUrl);
                    }}
                  >
                    Open
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {canScrollRight && (
        <button
          className="btn btn-circle btn-lg p-0 bg-base-200/80 backdrop-blur absolute right-4 top-1/2 z-10 hover:bg-base-300 focus:bg-base-300 border-none focus:outline-none focus-visible:outline-none"
          style={{ width: 48, height: 48 }}
          onClick={() => scroll("right")}
          aria-label="Next"
          tabIndex={0}
        >
          ❯
        </button>
      )}
    </div>
  );
}
