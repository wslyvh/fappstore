import { Categories } from "@/components/Categories";
import { Hero } from "@/components/Hero";
import { Featured } from "@/components/Featured";
import { Showcase } from "@/components/Showcase";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Hero />
      <Suspense>
        <Featured />
        <Showcase />
      </Suspense>
      <Categories />
    </>
  );
}
