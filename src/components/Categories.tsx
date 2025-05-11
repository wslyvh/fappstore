import Link from "next/link";
import { CATEGORIES } from "@/utils/config";

export function Categories() {
  return (
    <section>
      <h1 className="text-2xl font-medium mb-6 text-base-content/80">
        Explore Categories
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((category) => (
          <Link key={category.id} href={`/c/${category.id}`} className="group">
            <div className="card card-border bg-base-200 hover:bg-base-300 transition-all duration-200 hover:shadow-sm">
              <div className="card-body p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl opacity-80 group-hover:opacity-100 transition-opacity">
                    {category.icon}
                  </span>
                  <h2 className="card-title text-base font-medium text-base-content/90 group-hover:text-primary transition-colors">
                    {category.name}
                  </h2>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
