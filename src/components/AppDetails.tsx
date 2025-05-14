"use client";

import { useCallback, useState } from "react";
import { openFrame } from "@/utils/frames";
import { APP_URL } from "@/utils/config";
import { AppGrid } from "./Showcase";
import { App } from "@/utils/types";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import sdk from "@farcaster/frame-sdk";

interface AppDetailProps {
  app: App;
  relatedApps: App[];
}

export default function AppDetails({ app, relatedApps }: AppDetailProps) {
  const [copied, setCopied] = useState(false);
  const handleShare = useCallback(async () => {
    const context = await sdk.context;
    if (context?.user) {
      await sdk.actions.composeCast({
        text: `Check out this App by ${app.author.username}`,
        embeds: [app.framesUrl ?? `${APP_URL}/app/${app.id}`],
      });
    } else {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      }
    }
  }, []);

  if (!app) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>App not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="relative flex flex-col md:flex-row items-center gap-4 bg-base-100 rounded-xl shadow">
        {app.iconUrl && (
          <div className="w-24 h-24 md:w-32 md:h-32 lg:w-52 lg:h-52 relative flex-shrink-0 mx-auto md:mx-0">
            <Image
              src={app.iconUrl}
              alt={app.title}
              fill
              className="object-contain rounded-2xl border border-base-200 bg-base-200"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center w-full">
          <h2 className="text-3xl font-bold leading-tight">{app.title}</h2>
          {app.subtitle && (
            <p className="text-base-content/60 text-lg mt-1">{app.subtitle}</p>
          )}
          {app.tags && app.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {app.tags.map((tag: string) => (
                <span key={tag} className="badge badge-outline text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mt-4 w-full justify-center md:justify-start">
            {app.framesUrl && (
              <button
                onClick={() => openFrame(app.framesUrl)}
                className="btn btn-primary min-w-[120px]"
              >
                Open
              </button>
            )}
            {app.homeUrl && (
              <a
                href={app.homeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn min-w-[120px]"
              >
                Website
              </a>
            )}

            {/* Share */}
            <div
              className={`flex items-center justify-center gap-2 text-primary cursor-pointer tooltip tooltip-bottom ${
                copied ? " tooltip-open" : ""
              }`}
              data-tip="Copied!"
              onClick={handleShare}
              tabIndex={0}
              role="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                width="20"
                height="20"
                className="text-primary"
                fill="currentColor"
              >
                <path d="M 23 3 A 4 4 0 0 0 19 7 A 4 4 0 0 0 19.09375 7.8359375 L 10.011719 12.376953 A 4 4 0 0 0 7 11 A 4 4 0 0 0 3 15 A 4 4 0 0 0 7 19 A 4 4 0 0 0 10.013672 17.625 L 19.089844 22.164062 A 4 4 0 0 0 19 23 A 4 4 0 0 0 23 27 A 4 4 0 0 0 27 23 A 4 4 0 0 0 23 19 A 4 4 0 0 0 19.986328 20.375 L 10.910156 15.835938 A 4 4 0 0 0 11 15 A 4 4 0 0 0 10.90625 14.166016 L 19.988281 9.625 A 4 4 0 0 0 23 11 A 4 4 0 0 0 27 7 A 4 4 0 0 0 23 3 z" />
              </svg>
              <span className={`font-medium transition-all duration-200`}>
                Share
              </span>
            </div>
          </div>
        </div>

        {app.category && (
          <div className="absolute top-0 right-0">
            <Link
              href={`/c/${app.category}`}
              className="badge badge-primary badge-soft text-xs px-3 py-1"
            >
              {app.category}
            </Link>
          </div>
        )}
      </div>

      <hr className="border border-base-content/20" />

      {/* About */}
      <div>
        <h3 className="text-xl font-bold mb-4">About this App</h3>
        <p className="leading-relaxed">{app.description}</p>
        {app.indexedAt && (
          <div className="text-sm text-base-content/60 mt-2">
            Indexed {dayjs.unix(app.indexedAt).format("MMMM D, YYYY")}
          </div>
        )}
      </div>

      {app.screenshotUrls && app.screenshotUrls.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Screenshots</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {app.screenshotUrls.map((url: string, idx: number) => (
              <div
                key={idx}
                className="rounded-xl border border-base-200 bg-base-200 min-w-[200px] max-w-xs h-96 flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={url}
                  alt={`Screenshot ${idx + 1}`}
                  width={220}
                  height={400}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Developer Section */}
      <div>
        <h3 className="text-xl font-bold mb-4">Developer</h3>
        <div className="flex items-center gap-4 bg-base-200 rounded-xl shadow p-4">
          <div className="w-16 h-16 relative flex-shrink-0">
            <Image
              src={app.author?.pfpUrl}
              alt={app.author?.displayName || "Developer"}
              fill
              className="object-cover rounded-full border border-base-200 bg-base-200"
            />
          </div>
          <div>
            <div className="text-lg font-semibold">
              {app.author?.displayName}
            </div>
            <div className="text-base-content/60">
              <a
                className="text-primary hover:underline"
                href={`https://warpcast.com/${app.author?.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{app.author?.username}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">
          More by {app.author?.displayName}
        </h3>
        <AppGrid apps={relatedApps} />
      </div>
    </div>
  );
}
