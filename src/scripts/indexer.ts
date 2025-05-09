import { updateAppCatalog } from "@/clients/neynar";
import "dotenv/config";

async function main() {
  console.log("Running indexer...");
  await updateAppCatalog();
}

main().catch((err) => {
  console.error("Error in daily notification script:", err);
  process.exit(1);
});
