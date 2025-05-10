import dayjs from "dayjs";
import fs from "fs/promises";
import path from "path";

export const VALID_CATEGORIES = [
  "games",
  "social",
  "finance",
  "utility",
  "productivity",
  "health-fitness",
  "news-media",
  "music",
  "shopping",
  "education",
  "developer-tools",
  "entertainment",
  "art-creativity",
] as const;

export type Category = (typeof VALID_CATEGORIES)[number];

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
  title: string;
  subtitle?: string;
  description: string;
  category?: Category;
  tags?: string[];
  homeUrl: string;
  iconUrl: string;
  imageUrl?: string;
  framesUrl?: string;
  backgroundColor?: string;
  author: Author;
  firstSeen: number;
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
  return {
    ...app1,
    ...app2,
    // Merge arrays and remove duplicates
    tags: [...new Set([...(app1.tags || []), ...(app2.tags || [])])],
    // Keep non-empty values
    title: app1.title || app2.title,
    subtitle: app1.subtitle || app2.subtitle,
    description: app1.description || app2.description,
    category: app1.category || app2.category,
    homeUrl: app1.homeUrl || app2.homeUrl,
    iconUrl: app1.iconUrl || app2.iconUrl,
    imageUrl: app1.imageUrl || app2.imageUrl,
    framesUrl: app1.framesUrl || app2.framesUrl,
    backgroundColor: app1.backgroundColor || app2.backgroundColor,
    // Merge author data
    author: {
      ...app1.author,
      ...app2.author,
      bio: app1.author.bio || app2.author.bio,
    },
  };
}

export async function updateAppCatalog() {
  console.log("Updating app catalog");
  if (!process.env.NEYNAR_API_KEY) {
    console.error("NEYNAR_API_KEY is required");
    return;
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
    const apps = data.frames.map((frame: any) => {
      const app: App = {
        version: frame.version,
        id: new URL(frame.frames_url).hostname,
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
        firstSeen: dayjs().unix(),
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

  // Merge duplicates
  const uniqueApps = allApps.reduce((acc: App[], current) => {
    const existingIndex = acc.findIndex((app) => app.id === current.id);
    if (existingIndex === -1) {
      acc.push(current);
    } else {
      acc[existingIndex] = mergeApps(acc[existingIndex], current);
    }
    return acc;
  }, []);

  const catalogData: Catalog = {
    lastUpdated: new Date().toISOString(),
    totalItems: uniqueApps.length,
    apps: uniqueApps,
  };

  await fs.mkdir("public", { recursive: true });

  await fs.writeFile(
    path.join(process.cwd(), "public", "catalog.json"),
    JSON.stringify(catalogData, null, 2)
  );

  await fs.writeFile(
    path.join(process.cwd(), "public", "catalog.min.json"),
    JSON.stringify(catalogData)
  );

  console.log(`Catalog updated with ${catalogData.totalItems} items`);
  return catalogData;
}
