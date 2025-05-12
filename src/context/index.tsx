import { PropsWithChildren } from "react";
import { QueryProvider } from "./Query";
import { AnalyticsProvider } from "./Analytics";

export function Providers(props: PropsWithChildren) {
  return (
    <AnalyticsProvider>
      <QueryProvider>{props.children}</QueryProvider>
    </AnalyticsProvider>
  );
}
