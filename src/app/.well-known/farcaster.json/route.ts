import { APP_NAME, APP_URL } from "@/utils/config";

export async function GET() {
  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: {
      version: "next",
      name: APP_NAME,
      homeUrl: APP_URL,
      iconUrl: `${APP_URL}/icon.png`,
      imageUrl: `${APP_URL}/og.png`,
      webhookUrl: `${APP_URL}/api/webhook`,
      primaryCategory: "utility",
      tags: ["app", "store", "farcaster"],
    },
  });
}
