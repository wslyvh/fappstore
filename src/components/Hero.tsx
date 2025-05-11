"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME, APP_DESCRIPTION, POPULAR_TAGS } from "@/utils/config";
import Link from "next/link";

export function Hero() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <section className="relative flex flex-col items-center justify-center py-8 md:py-12 text-center">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-60 h-60 bg-primary opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-[15%] right-[15%] w-80 h-80 bg-secondary opacity-10 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[60%] w-32 h-32 bg-accent opacity-10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">{APP_NAME}</h1>
        <p className="text-lg md:text-xl text-base-content/60 mb-8">
          {APP_DESCRIPTION}
        </p>
        <form
          className="w-full max-w-md mx-auto mb-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (search.trim()) {
              router.push(
                `/explore?search=${encodeURIComponent(search.trim())}`
              );
            }
          }}
        >
          <label className="input input-md w-full flex items-center gap-2 p-0">
            <svg
              className="h-5 w-5 opacity-50 ml-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2.5" />
              <path
                d="m21 21-4.3-4.3"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search apps…"
              className="flex-1 bg-transparent border-none focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-primary flex-shrink-0 rounded-l-none"
              type="submit"
            >
              Search
            </button>
          </label>
        </form>
        <div className="flex flex-wrap gap-4 justify-center mx-8">
          {POPULAR_TAGS.map((tag) => (
            <Link
              key={tag.id}
              href={`/c/${tag.id}`}
              className={`badge badge-md ${tag.color} badge-outline`}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
