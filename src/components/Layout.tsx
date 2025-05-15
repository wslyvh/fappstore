import { SOCIAL_FARCASTER, SOCIAL_GITHUB } from "@/utils/config";
import { PropsWithChildren } from "react";
import { Account } from "./Account";
import { Back } from "./Back";
import Link from "next/link";

export function Layout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4">
        <div className="w-20 flex justify-start">
          <Back />
        </div>

        <Link href="/" className="flex justify-center px-4">
          <span className="flex items-center gap-1">
            <span className="text-xl font-bold">Fapp</span>
            <span className="text-xl font-bold px-2 rounded bg-primary text-base-100">
              Store
            </span>
          </span>
        </Link>

        <div className="w-20 flex justify-end">
          <Account />
        </div>
      </header>

      <main className="flex flex-col flex-1 container mx-auto px-4 gap-8">
        {props.children}
      </main>

      <footer className="flex flex-col items-center justify-center mt-8 p-4 gap-2">
        <p className="text-sm text-gray-500">fapp fapp fapp</p>
        <p className="flex gap-4">
          <Link
            href={`https://www.github.com/${SOCIAL_GITHUB}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          <Link
            href={`https://warpcast.com/${SOCIAL_FARCASTER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Farcaster
          </Link>
        </p>
      </footer>
    </div>
  );
}
