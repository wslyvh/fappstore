import { sdk } from "@farcaster/frame-sdk";

export async function openFrame(
  frameUrl: string | null | undefined
): Promise<void> {
  if (!frameUrl) return;

  const isMiniApp = await sdk.isInMiniApp();

  if (isMiniApp) {
    try {
      await sdk.actions.openUrl(
        `?launchFrameUrl=${encodeURIComponent(frameUrl)}`
      );
    } catch (error) {
      console.error("Failed to open frame URL:", error);
    }
  } else {
    window.open(
      `https://warpcast.com/?launchFrameUrl=${encodeURIComponent(frameUrl)}`,
      "_blank"
    );
  }
}
