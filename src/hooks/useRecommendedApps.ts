import { useQuery } from "@tanstack/react-query";
import { App } from "@/utils/types";

export function useRecommendedApps(fid: number, enabled: boolean = false) {
  return useQuery<App[]>({
    queryKey: ["recommendations", fid],
    queryFn: async () => {
      const response = await fetch(`/api/recommendations?fid=${fid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      return response.json();
    },
    enabled: enabled && fid > 0,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
