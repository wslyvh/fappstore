"use client";

import { usePathname, useRouter } from "next/navigation";

export function Back() {
  const router = useRouter();
  const pathname = usePathname();
  const isAppDetails = pathname?.startsWith("/app/");

  if (!isAppDetails) return null;
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-base-content/60 hover:text-base-content transition-colors w-fit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      Back
    </button>
  );
}
