import { sdk } from '@farcaster/frame-sdk';

export async function openFrame(frameUrl: string | null | undefined, isInsideFrame: boolean): Promise<void> {
  if (!frameUrl) return;

  if (isInsideFrame) {
    try {
      await sdk.actions.openUrl(frameUrl);
    } catch (error) {
      console.error('Failed to open frame URL:', error);
    }
  } else {
    window.open(getWarpcastUrl(frameUrl), '_blank');
  }
}

function getWarpcastUrl(frameUrl: string): string {
  return `https://warpcast.com/?launchFrameUrl=${encodeURIComponent(frameUrl)}`;
}
