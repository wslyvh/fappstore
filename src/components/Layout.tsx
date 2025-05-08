import { PropsWithChildren } from "react";

export function Layout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-primary">fappstore</h1>
      </header>

      <main className="flex flex-1 container mx-auto">{props.children}</main>

      <footer className="flex items-center justify-center p-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} fappstore
        </p>
      </footer>
    </div>
  );
}
