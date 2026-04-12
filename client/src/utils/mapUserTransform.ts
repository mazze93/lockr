import type { MapUser } from "@/pages/MapHome";

export interface NearbyUser {
  userId: string;
  profile?: {
    headline?: string;
    age?: number;
    photos?: string[];
    bio?: string;
    tags?: string[];
  };
  distance: number;
  isOnline: boolean;
  location: {
    longitude: number;
    latitude: number;
  };
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function transformNearbyUserToMapUser(
  user: NearbyUser,
  index: number
): MapUser {
  return {
    id: user.userId,
    name: user.profile?.headline?.split(',')[0] || `User ${index + 1}`,
    age: user.profile?.age || 25,
    distance: formatDistance(user.distance),
    image: user.profile?.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userId}`,
    bio: user.profile?.bio || "",
    tags: user.profile?.tags || [],
    status: user.isOnline ? 'online' : 'offline',
    coordinates: {
      x: user.location.longitude,
      y: user.location.latitude,
    },
  };
}

export function transformNearbyUsers(users: NearbyUser[]): MapUser[] {
  return users.map((user, index) => transformNearbyUserToMapUser(user, index));
}
