"use client";

import { useFarcasterUser } from "@/hooks/useFarcasterUser";
import sdk from "@farcaster/frame-sdk";

export function Account() {
  const { user, frameAdded } = useFarcasterUser();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      {frameAdded ? (
        <div className="avatar">
          <div className="w-6 rounded-full">
            <img src={user.pfpUrl} />
          </div>
        </div>
      ) : (
        <button
          className="btn btn-xs btn-soft"
          onClick={async () => {
            try {
              console.log("Adding frame..");
              await sdk.actions.addFrame();
            } catch (error) {
              console.error("Error adding frame", error);
            }
          }}
        >
          Add
        </button>
      )}
    </div>
  );
}
