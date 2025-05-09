import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { APP_NAME, APP_DESCRIPTION } from "@/utils/config";
import { Layout } from "@/components/Layout";
import { Providers } from "@/context";
import "@/assets/globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
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
