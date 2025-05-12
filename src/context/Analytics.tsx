import PlausibleProvider from "next-plausible";
import { APP_DOMAIN } from "@/utils/config";
import { PropsWithChildren } from "react";

export function AnalyticsProvider(props: PropsWithChildren) {
  return (
    <PlausibleProvider domain={APP_DOMAIN} trackOutboundLinks={true}>
      {props.children}
    </PlausibleProvider>
  );
}
