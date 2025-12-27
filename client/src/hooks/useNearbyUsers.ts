import { useQuery } from "@tanstack/react-query";
import { locationAPI } from "@/lib/api";

export function useNearbyUsers(latitude: number | null, longitude: number | null, radius: number = 5000) {
  return useQuery({
    queryKey: ["nearbyUsers", latitude, longitude, radius],
    queryFn: () => {
      if (latitude === null || longitude === null) {
        throw new Error("Location required");
      }
      return locationAPI.getNearbyUsers(latitude, longitude, radius);
    },
    enabled: latitude !== null && longitude !== null,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider stale after 10 seconds
  });
}
