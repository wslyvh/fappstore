import { getCatalogData } from "@/clients/neynar";
import { Metadata } from "next";
import Link from "next/link";
import { AppGrid } from "@/components/Showcase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const catalog = await getCatalogData();
  const users = catalog.apps.filter((app) => app.author.username === id);

  if (users.length === 0) {
    return {
      title: "User Not Found",
    };
  }

  const user = users[0];
  return {
    title: user.author.displayName,
    description: user.author.bio,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catalog = await getCatalogData();
  const users = catalog.apps.filter((app) => app.author.username === id);

  if (users.length === 0) {
    return <div>User not found</div>;
  }

  const user = users[0];

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="w-24 h-24 md:w-32 md:h-32 lg:w-52 lg:h-52 relative flex-shrink-0 mx-auto md:mx-0">
          <img
            src={user.author.pfpUrl}
            alt={user.author.displayName}
            className="w-full h-full object-cover rounded-full border border-base-200 bg-base-200"
          />
        </div>

        <div className="flex flex-col flex-1 text-left">
          <h2 className="text-3xl font-bold leading-tight flex items-center mb-0 xl:mb-2 gap-2">
            {user.author.displayName}
            {user.author.powerBadge && (
              <span title="Power Badge" className="inline-flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 841.89 595.28"
                  width="32"
                  height="32"
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
          </h2>
          <Link
            href={`https://farcaster.xyz/${user.author.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary hover:underline gap-1"
          >
            @{user.author.username}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <p className="text-base-content/60 text-lg mt-4">{user.author.bio}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">
          All Apps by {user.author.displayName}
        </h3>
        <AppGrid
          apps={catalog.apps.filter((app) => app.author.username === id)}
        />
      </div>
    </div>
  );
}
