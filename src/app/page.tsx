import { Categories } from "@/components/Categories";
import { Hero } from "@/components/Hero";
import { Featured } from "@/components/Featured";

export default async function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <Categories />
    </>
  );
}
