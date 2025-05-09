import fs from "fs/promises";
import path from "path";

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
  name: string;
  title: string;
  description: string;
  homeUrl: string;
  iconUrl: string;
  imageUrl: string;
  framesUrl: string;
  backgroundColor: string;
  author: Author;
}

export interface Catalog {
  lastUpdated: string;
  totalItems: number;
  apps: App[];
}

export async function updateAppCatalog() {
  console.log("Updating app catalog");
  if (!process.env.NEYNAR_API_KEY) {
    console.error("NEYNAR_API_KEY is required");
    return [];
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
    const apps = data.frames.map((frame: any) => ({
      version: frame.version,
      name: frame.title,
      title: frame.metadata?.html?.ogTitle || "",
      description: frame.metadata?.html?.ogDescription || "",
      homeUrl: frame.manifest?.frame?.home_url || "",
      iconUrl: frame.manifest?.frame?.icon_url || "",
      imageUrl: frame.image,
      framesUrl: frame.frames_url,
      backgroundColor: frame.manifest?.frame?.splash_background_color || "",
      author: {
        fid: frame.author.fid,
        username: frame.author.username,
        displayName: frame.author.display_name,
        pfpUrl: frame.author.pfp_url,
        bio: frame.author.profile?.bio?.text || "",
        powerBadge: frame.author.power_badge || false,
        score: frame.author.score || 0,
      },
    }));
    allApps.push(...apps);
    cursor = data.next?.cursor;
  } while (cursor);

  const catalogData: Catalog = {
    lastUpdated: new Date().toISOString(),
    totalItems: allApps.length,
    apps: allApps,
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
  return catalogData.apps;
}
