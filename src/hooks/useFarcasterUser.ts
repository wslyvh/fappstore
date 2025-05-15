import { UserContext } from "@farcaster/frame-core/dist/context";
import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";

export function useFarcasterUser() {
  const [user, setUser] = useState<UserContext | null>(null);
  const [frameAdded, setFrameAdded] = useState(false);

  useEffect(() => {
    sdk.context.then((context) => {
      setFrameAdded(context.client.added);
      setUser(context.user);
    });
  }, []);

  return { user, frameAdded };
}
