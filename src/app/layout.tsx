import type { Metadata, Viewport } from "next";
import { PropsWithChildren } from "react";
import {
  APP_NAME,
  APP_DESCRIPTION,
  APP_URL,
  SOCIAL_TWITTER,
} from "@/utils/config";
import { Layout } from "@/components/Layout";
import { Providers } from "@/context";
import "@/assets/globals.css";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: `${APP_NAME} · ${APP_DESCRIPTION}`,
    template: `%s · ${APP_NAME}`,
  },
  metadataBase: new URL(APP_URL),
  description: APP_DESCRIPTION,
  openGraph: {
    type: "website",
    title: APP_NAME,
    siteName: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    images: "/og.png",
  },
  twitter: {
    card: "summary_large_image",
    site: SOCIAL_TWITTER,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: "/og.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1.0,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{props.children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
