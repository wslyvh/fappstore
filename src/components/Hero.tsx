"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME, APP_DESCRIPTION } from "@/utils/config";
import Link from "next/link";

const POPULAR_TAGS = [
  { id: "social", name: "Social", color: "badge-primary" },
  { id: "games", name: "Games", color: "badge-secondary" },
  { id: "finance", name: "Finance", color: "badge-accent" },
  { id: "art-creativity", name: "Art & Creativity", color: "badge-info" },
  { id: "entertainment", name: "Entertainment", color: "badge-success" },
];

export function Hero() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[40vh] md:min-h-[60vh] py-8 md:py-12 text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-60 h-60 bg-primary opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-[15%] right-[15%] w-80 h-80 bg-secondary opacity-10 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[60%] w-32 h-32 bg-accent opacity-10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-base-content mb-4">
          {APP_NAME}
        </h1>
        <p className="text-lg md:text-xl text-base-content/70 mb-8">
          {APP_DESCRIPTION}
        </p>
        <form
          className="flex w-full max-w-md mx-auto mb-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (search.trim()) {
              router.push(
                `/explore?search=${encodeURIComponent(search.trim())}`
              );
            }
          }}
        >
          <input
            type="text"
            placeholder="Search apps…"
            className="input input-bordered input-md w-full rounded-r-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary rounded-l-none" type="submit">
            Search
          </button>
        </form>
        <div className="flex flex-wrap gap-4 justify-center">
          {POPULAR_TAGS.map((tag) => (
            <Link
              key={tag.id}
              href={`/c/${tag.id}`}
              className={`badge badge-md ${tag.color} badge-outline hover:badge-soft font-medium opacity-80`}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
