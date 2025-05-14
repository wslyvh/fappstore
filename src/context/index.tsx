import { PropsWithChildren } from "react";
import { QueryProvider } from "./Query";
import { AnalyticsProvider } from "./Analytics";
import { FarcasterProvider } from "./Farcaster";

export function Providers(props: PropsWithChildren) {
  return (
    <AnalyticsProvider>
      <QueryProvider>
        <FarcasterProvider>{props.children}</FarcasterProvider>
      </QueryProvider>
    </AnalyticsProvider>
  );
}
