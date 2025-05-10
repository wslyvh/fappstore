import dayjs from "dayjs";
import fs from "fs/promises";
import path from "path";

export const CATEGORIES = [
  {
    id: "games",
    name: "Games",
    description:
      "Games built for the Farcaster ecosystem, from casual mini-games to complex multiplayer experiences with on-chain achievements.",
    icon: "🎮",
  },
  {
    id: "social",
    name: "Social",
    description:
      "Apps that enhance your Farcaster experience with new ways to connect, share, and interact with each other, and the community.",
    icon: "👥",
  },
  {
    id: "finance",
    name: "Finance",
    description:
      "Tools for managing crypto assets, tracking investments, and participating in DeFi activities within the Farcaster ecosystem.",
    icon: "💰",
  },
  {
    id: "utility",
    name: "Utility",
    description:
      "Essential tools and services that enhance your Farcaster experience, from network explorers to data management utilities.",
    icon: "🔧",
  },
  {
    id: "productivity",
    name: "Productivity",
    description:
      "Apps to help you stay organized, manage tasks, and enhance your workflow while leveraging your Farcaster identity.",
    icon: "✅",
  },
  {
    id: "health-fitness",
    name: "Health & Fitness",
    description:
      "Track physical activity, monitor health metrics, and engage with wellness communities in the Farcaster ecosystem.",
    icon: "💪",
  },
  {
    id: "news-media",
    name: "News & Media",
    description:
      "Stay informed with curated content, journalism, and information services focused on crypto, Web3, and general interest topics.",
    icon: "📰",
  },
  {
    id: "music",
    name: "Music",
    description:
      "Discover, share, and experience music with apps that integrate streaming services and offer social music experiences.",
    icon: "🎵",
  },
  {
    id: "shopping",
    name: "Shopping",
    description:
      "Discover and purchase products, from physical goods to digital assets, with social commerce features and crypto payments.",
    icon: "🛍️",
  },
  {
    id: "education",
    name: "Education",
    description:
      "Learn and grow with educational content, courses, and knowledge-sharing communities focused on crypto and Web3 topics.",
    icon: "🎓",
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    description:
      "Resources, frameworks, and utilities for building and enhancing applications on the Farcaster protocol.",
    icon: "👨‍💻",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description:
      "Enjoy diverse experiences beyond gaming, including video content, interactive experiences, and creative entertainment.",
    icon: "🍿",
  },
  {
    id: "art-creativity",
    name: "Art & Creativity",
    description:
      "Create, share, and discover digital art and creative content, with tools for artistic expression and NFT creation.",
    icon: "🎨",
  },
] as const;

export type Category = (typeof CATEGORIES)[number]["id"];
export const VALID_CATEGORIES = CATEGORIES.map((c) => c.id);

export interface Author {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  bio: string;
  powerBadge: boolean;
  score: number;
}

export interface App {
  version: string;
  id: string;
  index: number;
  title: string;
  subtitle?: string;
  description: string;
  category?: Category;
  tags?: string[];
  homeUrl: string;
  iconUrl: string;
  imageUrl?: string;
  framesUrl?: string;
  screenshotUrls?: string[];
  backgroundColor?: string;
  author: Author;
  indexedAt: number;
}

export interface Catalog {
  lastUpdated: string;
  totalItems: number;
  apps: App[];
}

function inferCategory(app: App): Category | undefined {
  const content = `${app.title} ${app.subtitle || ""} ${
    app.description
  }`.toLowerCase();

  const categoryMatches: Record<Category, string[]> = {
    games: ["game", "play", "gaming", "puzzle", "quiz"],
    social: ["social", "chat", "connect", "community", "friends"],
    finance: ["finance", "money", "crypto", "trading", "wallet", "token"],
    utility: ["utility", "tool", "calculator", "converter"],
    productivity: ["productivity", "task", "todo", "calendar", "schedule"],
    "health-fitness": ["health", "fitness", "workout", "exercise", "diet"],
    "news-media": ["news", "media", "article", "blog", "feed"],
    music: ["music", "song", "playlist", "audio", "sound"],
    shopping: ["shop", "store", "market", "buy", "sell"],
    education: ["learn", "education", "academy", "course", "study", "tutorial"],
    "developer-tools": ["dev", "code", "api", "developer", "programming"],
    entertainment: ["entertainment", "fun", "watch", "stream"],
    "art-creativity": ["art", "creative", "design", "draw", "paint"],
  };

  let bestMatch: Category | undefined;
  let maxMatches = 0;

  for (const [category, keywords] of Object.entries(categoryMatches)) {
    const matches = keywords.filter((keyword) =>
      content.includes(keyword)
    ).length;

    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = category as Category;
    }
  }

  return bestMatch;
}

function mergeApps(app1: App, app2: App): App {
  const app = {
    ...app1,
    ...app2,
    title: app1.title || app2.title,
    subtitle: app1.subtitle || app2.subtitle,
    description: app1.description || app2.description,
    category: app1.category || app2.category,
    homeUrl: app1.homeUrl || app2.homeUrl,
    iconUrl: app1.iconUrl || app2.iconUrl,
    imageUrl: app1.imageUrl || app2.imageUrl,
    framesUrl: app1.framesUrl || app2.framesUrl,
    backgroundColor: app1.backgroundColor || app2.backgroundColor,
    author: {
      ...app1.author,
      ...app2.author,
      bio: app1.author.bio || app2.author.bio,
    },
  };

  const mergedTags = [...new Set([...(app1.tags || []), ...(app2.tags || [])])];
  if (mergedTags.length > 0) {
    app.tags = mergedTags;
  }

  const mergedScreenshotUrls = [
    ...new Set([
      ...(app1.screenshotUrls || []),
      ...(app2.screenshotUrls || []),
    ]),
  ];
  if (mergedScreenshotUrls.length > 0) {
    app.screenshotUrls = mergedScreenshotUrls;
  }

  return app;
}

export async function getCatalogData() {
  const catalog = await import("../../public/catalog.min.json");
  return catalog.default as Catalog;
}

export async function updateAppCatalog() {
  console.log("Updating app catalog");
  if (!process.env.NEYNAR_API_KEY) {
    console.error("NEYNAR_API_KEY is required");
    return;
  }

  // Load existing catalog if it exists
  let existingCatalog: Catalog | null = null;
  try {
    const catalogPath = path.join(process.cwd(), "public", "catalog.min.json");
    const catalogContent = await fs.readFile(catalogPath, "utf-8");
    existingCatalog = JSON.parse(catalogContent);
  } catch {
    console.log("No existing catalog found, creating new one");
  }

  const allApps: App[] = [];
  let cursor: string | undefined;
  do {
    const url = new URL("https://api.neynar.com/v2/farcaster/frame/catalog");
    if (cursor) {
      url.searchParams.append("cursor", cursor);
    }

    const response = await fetch(url.toString(), {
      headers: {
        "x-api-key": process.env.NEYNAR_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch catalog: ${response.statusText}`);
      break;
    }

    const data = await response.json();
    const apps = data.frames.map((frame: any, index: number) => {
      const app: App = {
        version: frame.version,
        id: new URL(frame.frames_url).hostname,
        index,
        title:
          frame.manifest?.frame?.name || frame.metadata?.html?.ogTitle || "",
        subtitle:
          frame.manifest?.frame?.subtitle ||
          frame.manifest?.frame?.tagline ||
          "",
        description: frame.metadata?.html?.ogDescription || "",
        category: frame.manifest?.frame?.primary_category,
        tags: frame.manifest?.frame?.tags,
        homeUrl: frame.manifest?.frame?.home_url,
        iconUrl: frame.manifest?.frame?.icon_url,
        imageUrl: frame.image,
        framesUrl: frame.frames_url,
        screenshotUrls: frame.manifest?.frame?.screenshot_urls,
        backgroundColor: frame.manifest?.frame?.splash_background_color,
        author: {
          fid: frame.author.fid,
          username: frame.author.username,
          displayName: frame.author.display_name,
          pfpUrl: frame.author.pfp_url,
          bio: frame.author.profile?.bio?.text || "",
          powerBadge: frame.author.power_badge || false,
          score: frame.author.score || 0,
        },
        indexedAt: dayjs().unix(),
      };

      // infer category if not provided
      if (!app.category) {
        app.category = inferCategory(app);
      }

      return app;
    });

    allApps.push(...apps);
    cursor = data.next?.cursor;
  } while (cursor);

  // Merge with existing catalog
  const existingApps = existingCatalog?.apps || [];

  // First, create a map of all apps from the API
  const apiAppsMap = new Map(allApps.map((app) => [app.id, app]));

  // Then, process existing apps, only keeping those that are still in the API
  const mergedApps = existingApps.reduce((acc: App[], existingApp) => {
    const apiApp = apiAppsMap.get(existingApp.id);
    if (apiApp) {
      // App still exists in API, merge with new data
      acc.push({
        ...mergeApps(existingApp, apiApp),
        indexedAt: existingApp.indexedAt, // Preserve original indexing time
      });

      // Remove from map to avoid duplicate processing
      apiAppsMap.delete(existingApp.id);
    }
    return acc;
  }, []);

  // Add any remaining new apps from the API
  mergedApps.push(...Array.from(apiAppsMap.values()));

  const catalogData: Catalog = {
    lastUpdated: new Date().toISOString(),
    totalItems: mergedApps.length,
    apps: mergedApps,
  };

  await fs.mkdir("public", { recursive: true });

  // Write both formatted and minified versions
  await fs.writeFile(
    path.join(process.cwd(), "public", "catalog.json"),
    JSON.stringify(catalogData, null, 2)
  );

  await fs.writeFile(
    path.join(process.cwd(), "public", "catalog.min.json"),
    JSON.stringify(catalogData)
  );

  const lastUpdateTimestamp = existingCatalog
    ? dayjs(existingCatalog.lastUpdated).unix()
    : 0;
  const newApps = mergedApps.filter(
    (app) => app.indexedAt > lastUpdateTimestamp
  );
  console.log(
    `Catalog updated with ${catalogData.totalItems} total items (${newApps.length} new)`
  );

  return catalogData;
}
