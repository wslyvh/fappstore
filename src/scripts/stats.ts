import { App, Category } from "@/utils/types";
import catalog from "../../public/catalog.min.json";

interface Stats {
  totalApps: number;
  categories: Record<Category, number>;
  topAuthors: Array<{ author: string; count: number }>;
  tagFrequency: Record<string, number>;
  metadataCompleteness: {
    hasIcon: number;
    hasImage: number;
    hasSubtitle: number;
    hasCategory: number;
    hasTags: number;
    hasScreenshotUrls: number;
  };
  averageAuthorScore: number;
  powerBadgeAuthors: number;
}

async function main() {
  console.log("Analyzing app store statistics...");
  const apps = catalog.apps as App[];

  const stats: Stats = {
    totalApps: apps.length,
    categories: {} as Record<Category, number>,
    topAuthors: [],
    tagFrequency: {},
    metadataCompleteness: {
      hasIcon: 0,
      hasImage: 0,
      hasSubtitle: 0,
      hasCategory: 0,
      hasTags: 0,
      hasScreenshotUrls: 0,
    },
    averageAuthorScore: 0,
    powerBadgeAuthors: 0,
  };

  // Category stats
  const categories = apps
    .map((app) => app.category)
    .filter((category): category is Category => category !== undefined);
  stats.categories = categories.reduce(
    (acc: Record<Category, number>, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<Category, number>
  );

  // Author stats
  const authorCounts = apps.reduce((acc: Record<string, number>, app) => {
    const author = app.author.username;
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  stats.topAuthors = Object.entries(authorCounts)
    .map(([author, count]) => ({ author, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Tag analysis
  apps.forEach((app) => {
    app.tags?.forEach((tag) => {
      stats.tagFrequency[tag] = (stats.tagFrequency[tag] || 0) + 1;
    });
  });

  // Metadata completeness
  apps.forEach((app) => {
    if (app.iconUrl) stats.metadataCompleteness.hasIcon++;
    if (app.imageUrl) stats.metadataCompleteness.hasImage++;
    if (app.subtitle) stats.metadataCompleteness.hasSubtitle++;
    if (app.category) stats.metadataCompleteness.hasCategory++;
    if (app.tags?.length) stats.metadataCompleteness.hasTags++;
    if (app.screenshotUrls?.length)
      stats.metadataCompleteness.hasScreenshotUrls++;
  });

  // Author metrics
  const totalScore = apps.reduce((sum, app) => sum + app.author.score, 0);
  stats.averageAuthorScore = totalScore / apps.length;
  stats.powerBadgeAuthors = apps.filter((app) => app.author.powerBadge).length;

  // Print stats
  console.log("\n=== App Store Statistics ===");
  console.log(`Total Apps: ${stats.totalApps}`);

  console.log("\n=== Categories ===");
  Object.entries(stats.categories)
    .sort(([, a], [, b]) => b - a)
    .forEach(([category, count]) => {
      console.log(
        `${category}: ${count} apps (${(
          (count / stats.totalApps) *
          100
        ).toFixed(1)}%)`
      );
    });

  console.log("\n=== Top Authors ===");
  stats.topAuthors.forEach(({ author, count }) => {
    console.log(`${author}: ${count} apps`);
  });

  console.log("\n=== Popular Tags ===");
  Object.entries(stats.tagFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .forEach(([tag, count]) => {
      console.log(`${tag}: ${count} apps`);
    });

  console.log("\n=== Metadata Completeness ===");
  Object.entries(stats.metadataCompleteness).forEach(([field, count]) => {
    console.log(
      `${field}: ${count} apps (${((count / stats.totalApps) * 100).toFixed(
        1
      )}%)`
    );
  });

  console.log("\n=== Author Metrics ===");
  console.log(`Average Author Score: ${stats.averageAuthorScore.toFixed(2)}`);
  console.log(
    `Authors with Power Badge: ${stats.powerBadgeAuthors} (${(
      (stats.powerBadgeAuthors / stats.totalApps) *
      100
    ).toFixed(1)}%)`
  );
}

main().catch((err) => {
  console.error("Error in stats script:", err);
  process.exit(1);
});
