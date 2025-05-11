import { Categories } from "@/components/Categories";
import { Hero } from "@/components/Hero";
import { Featured } from "@/components/Featured";
import { Showcase } from "@/components/Showcase";

export default async function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <Showcase />
      <Categories />
    </>
  );
}
