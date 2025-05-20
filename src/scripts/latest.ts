import { App } from "@/utils/types";
import catalog from "../../public/catalog.min.json";
import dayjs from "dayjs";

async function main() {
  console.log("Fetching new Apps...");
  const apps = catalog.apps as App[];
  const since = dayjs().subtract(1, "day");

  const latestApps = apps.filter((app) => {
    return dayjs.unix(app.indexedAt).isAfter(since);
  });

  if (latestApps.length === 0) {
    console.log("No new apps indexed...");
    return;
  }

  console.log(`Found ${latestApps.length} new apps:\n`);
  const filtered = latestApps.filter(
    (app) => app.author.powerBadge || app.author.score > 0.9
  );
  const categorized = filtered.filter((app) => app.category);
  console.log(`From power users: ${filtered.length}`);
  console.log(`From non-power users: ${latestApps.length - filtered.length}`);
  console.log(`From categorized: ${categorized.length}`);

  categorized.forEach((app) => {
    console.log(`- ${app.title} @${app.author.username}`);
  });
}

main().catch((err) => {
  console.error("Error in latest apps script:", err);
  process.exit(1);
});
