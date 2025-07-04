import { App, Catalog, Category } from "@/utils/types";
import { FEATURED_APPS } from "@/utils/config";
import dayjs from "dayjs";
import fs from "fs/promises";
import path from "path";

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

// function mergeApps(app1: App, app2: App): App {
//   const app = {
//     ...app1,
//     ...app2,
//     title: app1.title || app2.title,
//     subtitle: app1.subtitle || app2.subtitle,
//     description: app1.description || app2.description,
//     category: app1.category || app2.category,
//     homeUrl: app1.homeUrl || app2.homeUrl,
//     iconUrl: app1.iconUrl || app2.iconUrl,
//     imageUrl: app1.imageUrl || app2.imageUrl,
//     framesUrl: app1.framesUrl || app2.framesUrl,
//     backgroundColor: app1.backgroundColor || app2.backgroundColor,
//     author: {
//       ...app1.author,
//       ...app2.author,
//       bio: app1.author.bio || app2.author.bio,
//     },
//   };

//   const mergedTags = [...new Set([...(app1.tags || []), ...(app2.tags || [])])];
//   if (mergedTags.length > 0) {
//     app.tags = mergedTags;
//   }

//   const mergedScreenshotUrls = [
//     ...new Set([
//       ...(app1.screenshotUrls || []),
//       ...(app2.screenshotUrls || []),
//     ]),
//   ];
//   if (mergedScreenshotUrls.length > 0) {
//     app.screenshotUrls = mergedScreenshotUrls;
//   }

//   return app;
// }

export async function getCatalogData() {
  const catalog = await import("../../public/catalog.min.json");
  return catalog.default as Catalog;
}

export async function getApp(id: string) {
  const catalog = await getCatalogData();
  return catalog.apps.find((app) => app.id === id);
}

export async function getFeaturedApps() {
  const catalog = await getCatalogData();
  return catalog.apps.filter((app) =>
    FEATURED_APPS.includes(app.id as (typeof FEATURED_APPS)[number])
  );
}

export async function getTopApps(limit: number = 20) {
  const catalog = await getCatalogData();
  return catalog.apps.slice(0, limit);
}

export async function getAppsByCategory(category: Category) {
  const catalog = await getCatalogData();
  return catalog.apps.filter((app) => app.category === category);
}

export async function getAppsByTag(tag: string) {
  const catalog = await getCatalogData();
  return catalog.apps.filter((app) => app.tags?.includes(tag));
}

export async function getAppsByAuthor(author: string) {
  const catalog = await getCatalogData();
  return catalog.apps.filter((app) => app.author.username === author);
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
    const apps = data.frames.map((frame: any, index: number) =>
      mapFrameToApp(frame, index)
    );

    allApps.push(...apps);
    cursor = data.next?.cursor;
  } while (cursor);

  // Get existing apps or empty array
  const existingApps = existingCatalog?.apps || [];
  
  // Create a map of existing apps by ID for quick lookup
  const existingAppsMap = new Map(existingApps.map((app) => [app.id, app]));
  
  // Create a map of new apps from API for quick lookup
  const apiAppsMap = new Map(allApps.map((app) => [app.id, app]));
  
  const currentTimestamp = dayjs().unix();
  const mergedApps: App[] = [];
  
  // Process existing apps - keep all of them, update if they exist in API
  for (const existingApp of existingApps) {
    const apiApp = apiAppsMap.get(existingApp.id);
    
    if (apiApp) {
      // App exists in API - update all properties except indexedAt
      const updatedApp: App = {
        ...apiApp,
        indexedAt: existingApp.indexedAt, // Preserve original indexing time
        updatedAt: currentTimestamp, // Update the timestamp
      };
      mergedApps.push(updatedApp);
    } else {
      // App no longer in API but we keep it in catalog (never remove)
      // Just preserve the existing app as-is
      mergedApps.push(existingApp);
    }
  }
  
  // Add new apps that don't exist in the existing catalog
  for (const apiApp of allApps) {
    if (!existingAppsMap.has(apiApp.id)) {
      // New app - set both indexedAt and updatedAt to current timestamp
      const newApp: App = {
        ...apiApp,
        indexedAt: currentTimestamp,
        updatedAt: currentTimestamp,
      };
      mergedApps.push(newApp);
    }
  }

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

  // Featured apps
  const featuredAppsFile = mergedApps.filter((app) =>
    FEATURED_APPS.includes(app.id as (typeof FEATURED_APPS)[number])
  );
  await fs.writeFile(
    path.join(process.cwd(), "public", "featured.min.json"),
    JSON.stringify(featuredAppsFile)
  );

  // Top apps
  const topAppsFile = mergedApps.slice(0, 20);
  await fs.writeFile(
    path.join(process.cwd(), "public", "top.min.json"),
    JSON.stringify(topAppsFile)
  );

  // New apps
  const newAppsFile = mergedApps.slice(0, 20);
  await fs.writeFile(
    path.join(process.cwd(), "public", "new.min.json"),
    JSON.stringify(newAppsFile)
  );

  // Count new apps since last update
  const lastUpdateTimestamp = existingCatalog
    ? dayjs(existingCatalog.lastUpdated).unix()
    : 0;
  const newApps = mergedApps.filter(
    (app) => app.indexedAt > lastUpdateTimestamp
  );
  
  // Count updated apps
  const updatedApps = mergedApps.filter(
    (app) => app.updatedAt === currentTimestamp && app.indexedAt < currentTimestamp
  );
  
  console.log(
    `Catalog updated with ${catalogData.totalItems} total items (${newApps.length} new, ${updatedApps.length} updated)`
  );

  return catalogData;
}

export async function getRecommendations(fid: number): Promise<App[]> {
  console.log("Fetching recommendations for fid", fid);

  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/frame/relevant?time_window=24h&viewer_fid=${fid}`,
    {
      headers: {
        "x-api-key": process.env.NEYNAR_API_KEY || "",
      },
    }
  );

  if (!response.ok) {
    console.error(`Failed to fetch recommendations: ${response.statusText}`);
    return [];
  }

  const data = await response.json();
  const currentTimestamp = dayjs().unix();

  return data.relevant_frames.map((item: any, index: number) => {
    const app = mapFrameToApp(item.frame, index);
    // Set timestamps for recommendation apps
    app.indexedAt = currentTimestamp;
    app.updatedAt = currentTimestamp;
    return app;
  });
}

function mapFrameToApp(frame: any, index: number): App {
  const app: App = {
    version: frame.version,
    id: new URL(frame.frames_url).hostname,
    index,
    title: frame.manifest?.frame?.name || frame.metadata?.html?.ogTitle || "",
    subtitle:
      frame.manifest?.frame?.subtitle || frame.manifest?.frame?.tagline || "",
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
      followerCount: frame.author.follower_count || 0,
    },
    indexedAt: 0, // Will be set in updateAppCatalog
    updatedAt: 0, // Will be set in updateAppCatalog
  };

  // infer category if not provided
  if (!app.category) {
    app.category = inferCategory(app);
  }

  return app;
}
