import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';

interface FarcasterContext {
  isInsideFrame: boolean;
  fid?: number;
  isLoading: boolean;
  error?: Error;
}

export function useFarcasterContext(): FarcasterContext {
  const [context, setContext] = useState<FarcasterContext>({
    isInsideFrame: false,
    isLoading: true
  });

  useEffect(() => {
    let mounted = true;

    async function checkFarcasterContext() {
      try {
        const sdkContext = await sdk.context;
        if (!mounted) return;

        setContext({
          isInsideFrame: !!sdkContext?.client?.clientFid,
          fid: sdkContext?.client?.clientFid,
          isLoading: false
        });
      } catch (error) {
        if (!mounted) return;

        console.error("Failed to get Farcaster context:", error);
        setContext({
          isInsideFrame: false,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Unknown error')
        });
      }
    }

    checkFarcasterContext();

    return () => {
      mounted = false;
    };
  }, []);

  return context;
} 
