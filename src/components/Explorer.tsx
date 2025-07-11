"use client";

import { useState, useMemo } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import { useRouter, useSearchParams } from "next/navigation";
import { Catalog } from "@/utils/types";
import { CATEGORIES } from "@/utils/config";
import { openFrame } from "@/utils/frames";
import Image from "next/image";

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { id: "popular", label: "Popular" },
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
];

interface ExplorerProps {
  initialData: Catalog;
  category?: string;
}

export function Explorer({ initialData, category }: ExplorerProps) {
  const searchParams = useSearchParams();
  const { data, isLoading, error } = useCatalog(initialData);
  const router = useRouter();

  // Get all parameters from URL
  const searchQuery = searchParams.get("search") || "";
  const selectedCategories = useMemo(() => {
    // If we're on a category page, use that category
    if (category) {
      return [category];
    }
    // Otherwise use the URL parameter
    return searchParams.get("categories")?.split(",").filter(Boolean) || [];
  }, [searchParams, category]);
  const selectedSort = searchParams.get("sort") || "popular";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const showPowerUsersOnly = searchParams.get("power") === "true";
  const viewMode = (searchParams.get("view") || "grid") as "grid" | "list";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update URL with new parameters
  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    let hasChanges = false;

    Object.entries(updates).forEach(([key, value]) => {
      const currentValue = params.get(key);
      if (value === null) {
        if (currentValue !== null) {
          params.delete(key);
          hasChanges = true;
        }
      } else if (currentValue !== value) {
        params.set(key, value);
        hasChanges = true;
      }
    });

    // Only update URL if there are actual changes
    if (hasChanges) {
      router.push(`?${params.toString()}`);
    }
  };

  // Update search
  const handleSearchChange = (value: string) => {
    updateUrl({ search: value || null, page: "1" });
  };

  // Update categories
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);
    updateUrl({
      categories: newCategories.length ? newCategories.join(",") : null,
      page: "1",
    });
  };

  // Update sort
  const handleSortChange = (value: string) => {
    updateUrl({ sort: value, page: "1" });
  };

  // Update power users filter
  const handlePowerUsersChange = (checked: boolean) => {
    updateUrl({ power: checked ? "true" : null, page: "1" });
  };

  // Update view mode
  const handleViewModeChange = (mode: "grid" | "list") => {
    updateUrl({ view: mode });
  };

  // Update page
  const handlePageChange = (page: number) => {
    updateUrl({ page: page.toString() });
  };

  // Clear all filters
  const handleClearFilters = () => {
    updateUrl({
      search: null,
      categories: null,
      sort: "popular",
      page: "1",
      power: null,
      view: "grid",
    });
    setSidebarOpen(false);
  };

  const filteredApps = useMemo(() => {
    if (!data) return [];

    let filtered = [...data.apps];

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((app) => {
        const fields = [
          app.title,
          app.subtitle,
          app.description,
          app.author.username,
          app.author.displayName,
          app.homeUrl,
        ];
        return fields.some(
          (field) => field && field.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (app) => app.category && selectedCategories.includes(app.category)
      );
    }

    // Apply power user filter
    if (showPowerUsersOnly) {
      filtered = filtered.filter((app) => app.author.powerBadge);
    }

    // Apply sorting
    switch (selectedSort) {
      case "popular":
        // don't filter. Default order is by popularity
        // filtered.sort((a, b) => (b.index || 0) - (a.index || 0));
        break;
      case "newest":
        filtered.sort((a, b) => (b.indexedAt || 0) - (a.indexedAt || 0));
        break;
      case "oldest":
        filtered.sort((a, b) => (a.indexedAt || 0) - (b.indexedAt || 0));
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  }, [data, searchQuery, selectedCategories, selectedSort, showPowerUsersOnly]);

  // Determine if any filter/search is active
  const isFilterActive =
    !!searchQuery || selectedCategories.length > 0 || showPowerUsersOnly;

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
      return pages;
    };

    return (
      <div className="flex justify-center mt-8 gap-2">
        <button
          className="btn btn-primary btn-sm transition-colors disabled:opacity-50"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              className={`btn btn-sm transition-colors focus:outline-none ${
                page === currentPage ? "btn-outline" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ) : null
        )}
        <button
          className="btn btn-primary btn-sm transition-colors disabled:opacity-50"
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (error)
    return <div className="alert alert-error">Error loading catalog</div>;

  if (!data) return <div className="alert">No data available</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      <aside
        className={`hidden lg:block fixed md:static top-0 left-0 z-30 h-full md:h-auto w-72 md:w-72 bg-base-200 rounded-xl p-6 mb-8 md:mb-0 flex-shrink-0 transition-transform duration-200 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={{ maxWidth: 320 }}
      >
        <div className="text-2xl font-bold mb-4">Filter</div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="search..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSidebarOpen(false);
              }
            }}
          />
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2">Categories</div>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) =>
                    handleCategoryChange(category.id, e.target.checked)
                  }
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2">Author</div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={showPowerUsersOnly}
              onChange={(e) => handlePowerUsersChange(e.target.checked)}
            />
            <span>Power badge</span>
          </label>
        </div>

        {/* Clear filters */}
        {isFilterActive && (
          <div className="mt-8 flex justify-center">
            <button
              className="link text-primary underline underline-offset-2 text-sm font-semibold"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>
        )}
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 w-full">
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="text-xl font-bold">{filteredApps.length} Apps</div>
          <div className="flex items-center gap-2 ml-0">
            <div className="flex">
              <button
                className={`btn btn-sm rounded-l-lg rounded-r-none transition-colors focus:outline-none ${
                  viewMode === "grid" ? "btn-primary" : "btn-soft"
                }`}
                aria-label="Grid view"
                onClick={() => handleViewModeChange("grid")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3v18" />
                  <path d="M3 12h18" />
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              </button>
              <button
                className={`btn btn-sm rounded-l-none rounded-r-lg transition-colors focus:outline-none ${
                  viewMode === "list" ? "btn-primary" : "btn-soft"
                }`}
                aria-label="List view"
                onClick={() => handleViewModeChange("list")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12h.01" />
                  <path d="M3 18h.01" />
                  <path d="M3 6h.01" />
                  <path d="M8 12h13" />
                  <path d="M8 18h13" />
                  <path d="M8 6h13" />
                </svg>
              </button>
            </div>
            <select
              className="select select-sm w-28"
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sidebar (collapsible on mobile) */}
        <button
          className="btn btn-primary btn-soft w-full btn-sm mb-4 block lg:hidden"
          onClick={() => setSidebarOpen((open) => !open)}
        >
          Filter
        </button>

        {/* App Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedApps.map((app) => (
              <div
                key={app.id}
                className="card bg-base-200 shadow-md hover:shadow-lg transition w-full cursor-pointer"
                onClick={() => router.push(`/app/${app.id}`)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    router.push(`/app/${app.id}`);
                }}
              >
                <figure className="w-full aspect-[3/2.1] relative overflow-hidden rounded-t-xl">
                  <Image
                    src={app.imageUrl ?? app.iconUrl}
                    alt={app.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 400px) 100vw, 400px"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-12 pointer-events-none bg-gradient-to-t from-base-200 via-base-200/60 to-transparent" />
                </figure>

                <div className="card-body p-4">
                  <h3 className="card-title text-xl truncate text-ellipsis">
                    {app.title}
                  </h3>
                  <div className="flex items-center mt-2 gap-2">
                    <div className="w-8 h-8 rounded-full bg-base-100 flex items-center justify-center overflow-hidden mr-2">
                      <img
                        src={app.author.pfpUrl}
                        alt={app.author.displayName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center font-semibold text-sm gap-1">
                        {app.author.displayName}
                        {app.author.powerBadge && (
                          <span
                            title="Power Badge"
                            className="inline-flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 841.89 595.28"
                              width="16"
                              height="16"
                              className="text-secondary"
                              fill="currentColor"
                            >
                              <path
                                d="M351.54,516.77l-39.52-67.9l-78.54-16.17l8.83-76.77l-49.93-58.5l49.93-57.98l-8.83-76.75l78.54-16.21
                        l39.52-68.39l69.71,32.39l69.71-32.39l40.05,68.41l78.01,16.19l-8.83,76.77l49.93,57.96l-49.93,58.5l8.83,76.77l-78.01,16.17
                        l-40.05,67.9l-69.71-32.39L351.54,516.77z"
                              />
                              <path
                                d="M398.88,366.9l118.08-117.51l-23.4-21.42l-94.68,94.01l-49.4-51.69l-23.94,23.48"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="16"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-base-content/60">
                        @{app.author.username}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openFrame(app.framesUrl);
                      }}
                      className="btn btn-primary btn-xs ml-auto z-10"
                    >
                      Open
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {paginatedApps.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-4 p-4 rounded-xl transition-shadow hover:bg-base-200 hover:shadow-lg group cursor-pointer"
                onClick={() => router.push(`/app/${app.id}`)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    router.push(`/app/${app.id}`);
                }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image
                    src={app.iconUrl}
                    alt={app.title}
                    width={56}
                    height={56}
                    className="w-14 h-14 object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{app.title}</div>
                  <div className="text-xs text-base-content/60 truncate mt-2">
                    by {app.author.displayName}
                  </div>
                </div>

                {app.category && (
                  <span className="badge badge-primary badge-soft badge-xs sm:badge-sm">
                    {app.category}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openFrame(app.framesUrl);
                  }}
                  className="btn btn-primary btn-xs ml-auto z-10"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {renderPagination()}
      </main>
    </div>
  );
}
