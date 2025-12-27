import type { StyleSpecification } from "maplibre-gl";

export const blueprintMapStyle: StyleSpecification = {
  version: 8,
  name: "Lockr Blueprint",
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm-tiles-layer",
      type: "raster",
      source: "osm-tiles",
      paint: {
        "raster-saturation": -1,
        "raster-brightness-min": 0.05,
        "raster-brightness-max": 0.25,
        "raster-contrast": 0.3,
        "raster-hue-rotate": 200,
      },
    },
  ],
  glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
};

export const LANDMARK_CATEGORIES = {
  bar: { icon: "🍸", color: "#F8B654" },
  club: { icon: "🪩", color: "#E91E8C" },
  cafe: { icon: "☕", color: "#126D7F" },
  park: { icon: "🌳", color: "#4CAF50" },
  gym: { icon: "💪", color: "#FF5722" },
  sauna: { icon: "🔥", color: "#FF9800" },
  beach: { icon: "🏖️", color: "#00BCD4" },
  hotel: { icon: "🏨", color: "#9C27B0" },
};

export interface Landmark {
  id: string;
  name: string;
  category: keyof typeof LANDMARK_CATEGORIES;
  latitude: number;
  longitude: number;
  description?: string;
}

export function generateLandmarksForArea(centerLat: number, centerLng: number): Landmark[] {
  const landmarks: Landmark[] = [];
  const categories = Object.keys(LANDMARK_CATEGORIES) as (keyof typeof LANDMARK_CATEGORIES)[];
  
  const landmarkNames: Record<keyof typeof LANDMARK_CATEGORIES, string[]> = {
    bar: ["The Vault", "Neon Lounge", "Blue Hour", "Midnight Bar"],
    club: ["Pulse", "Spectrum", "The Underground", "Echo"],
    cafe: ["Bean & Gone", "Sunrise Café", "The Grind", "Cozy Corner"],
    park: ["Liberty Park", "Rainbow Gardens", "Central Green", "Unity Square"],
    gym: ["Iron Temple", "Flex Zone", "Peak Fitness", "Pump House"],
    sauna: ["Steam Room", "Heat Wave", "Nordic Spa", "Relax Zone"],
    beach: ["Sandy Shores", "Sunset Beach", "Wave Point", "Coastal Edge"],
    hotel: ["The Grand", "Urban Stay", "Night Owl Inn", "Metro Hotel"],
  };

  categories.forEach((category, catIndex) => {
    const names = landmarkNames[category];
    const count = 2 + Math.floor(Math.random() * 2);
    
    for (let i = 0; i < count; i++) {
      const angle = ((catIndex * 45) + (i * 90) + Math.random() * 30) * (Math.PI / 180);
      const distance = 0.005 + Math.random() * 0.015;
      
      landmarks.push({
        id: `${category}-${i}`,
        name: names[i % names.length],
        category,
        latitude: centerLat + Math.sin(angle) * distance,
        longitude: centerLng + Math.cos(angle) * distance,
        description: `A popular ${category} in the area`,
      });
    }
  });

  return landmarks;
}
