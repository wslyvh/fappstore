import { PropsWithChildren } from "react";
import { QueryProvider } from "./Query";

export function Providers(props: PropsWithChildren) {
  return <QueryProvider>{props.children}</QueryProvider>;
}
