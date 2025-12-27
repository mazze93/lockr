import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { blueprintMapStyle, generateLandmarksForArea, LANDMARK_CATEGORIES, type Landmark } from "@/lib/mapStyle";
import type { MapUser } from "@/pages/MapHome";

interface BlueprintMapProps {
  center: { lat: number; lng: number };
  users: MapUser[];
  landmarks?: Landmark[];
  onUserClick: (user: MapUser) => void;
  onLandmarkClick?: (landmark: Landmark) => void;
  blurRadius?: number;
}

export function BlueprintMap({ 
  center, 
  users, 
  landmarks: externalLandmarks,
  onUserClick,
  onLandmarkClick,
  blurRadius = 200 
}: BlueprintMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const landmarkMarkersRef = useRef<maplibregl.Marker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: blueprintMapStyle,
      center: [center.lng, center.lat],
      zoom: 15,
      minZoom: 12,
      maxZoom: 18,
      attributionControl: false,
    });

    map.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-left"
    );

    map.current.on("load", () => {
      setIsMapLoaded(true);
      
      if (externalLandmarks) {
        setLandmarks(externalLandmarks);
      } else {
        setLandmarks(generateLandmarksForArea(center.lat, center.lng));
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    users.forEach(user => {
      const el = document.createElement("div");
      el.className = "user-marker";
      el.innerHTML = `
        <div class="relative cursor-pointer group" data-testid="pin-user-${user.id}">
          ${user.status === 'online' ? '<div class="absolute -inset-2 rounded-full bg-[#E91E8C]/30 animate-pulse blur-md"></div>' : ''}
          <div class="w-12 h-12 rounded-full overflow-hidden border-2 shadow-xl transition-all duration-300 relative z-10 bg-[#0D2847] ${user.status === 'online' ? 'border-[#E91E8C]' : 'border-gray-500 grayscale'}">
            <img src="${user.image}" alt="${user.name}" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -top-1 -right-1 z-20 bg-[#126D7F] text-white rounded-full p-0.5 border border-[#081B3A] shadow-sm">
            <svg class="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#0D2847]/95 text-white text-[10px] px-2 py-1 rounded-md shadow-lg border border-white/10 pointer-events-none z-20 flex flex-col items-center gap-0.5">
            <span class="font-bold text-[#F8B654]">${user.name}, ${user.age}</span>
            <span class="text-[9px] text-gray-400">${user.distance} away</span>
          </div>
        </div>
      `;

      el.addEventListener("click", () => onUserClick(user));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([user.coordinates.x, user.coordinates.y])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [users, isMapLoaded, onUserClick]);

  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    landmarkMarkersRef.current.forEach(marker => marker.remove());
    landmarkMarkersRef.current = [];

    landmarks.forEach(landmark => {
      const categoryInfo = LANDMARK_CATEGORIES[landmark.category];
      
      const el = document.createElement("div");
      el.className = "landmark-marker";
      el.innerHTML = `
        <div class="cursor-pointer group" data-testid="landmark-${landmark.id}">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-lg border transition-transform hover:scale-110" 
               style="background: ${categoryInfo.color}20; border-color: ${categoryInfo.color}50;">
            ${categoryInfo.icon}
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#0D2847]/95 text-white text-[10px] px-2 py-1 rounded shadow-lg border border-white/10 pointer-events-none z-20">
            <span class="font-medium">${landmark.name}</span>
          </div>
        </div>
      `;

      el.addEventListener("click", () => onLandmarkClick?.(landmark));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([landmark.longitude, landmark.latitude])
        .addTo(map.current!);

      landmarkMarkersRef.current.push(marker);
    });
  }, [landmarks, isMapLoaded, onLandmarkClick]);

  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const existingPulse = document.getElementById("user-pulse-marker");
    if (existingPulse) existingPulse.remove();

    const el = document.createElement("div");
    el.id = "user-pulse-marker";
    el.innerHTML = `
      <div class="relative">
        <div class="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#126D7F]/20 animate-ping"></div>
        <div class="absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#126D7F]/10 animate-pulse"></div>
        <div class="w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#126D7F] border-2 border-white/50 shadow-[0_0_20px_#126D7F]"></div>
      </div>
    `;

    new maplibregl.Marker({ element: el })
      .setLngLat([center.lng, center.lat])
      .addTo(map.current);

  }, [center, isMapLoaded]);

  const handleRecenter = useCallback(() => {
    map.current?.flyTo({
      center: [center.lng, center.lat],
      zoom: 15,
      duration: 1000,
    });
  }, [center]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ 
          filter: "saturate(0.8) contrast(1.1)",
        }}
      />
      
      {/* Blueprint Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(18, 109, 127, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(18, 109, 127, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-brand-secondary/50 pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-brand-secondary/50 pointer-events-none" />
      <div className="absolute bottom-20 left-4 w-8 h-8 border-l-2 border-b-2 border-brand-secondary/50 pointer-events-none" />
      <div className="absolute bottom-20 right-4 w-8 h-8 border-r-2 border-b-2 border-brand-secondary/50 pointer-events-none" />

      {/* Accuracy Ring Visualization */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full border border-dashed border-brand-secondary/30"
        style={{ width: `${blurRadius / 5}px`, height: `${blurRadius / 5}px` }}
      />

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        className="absolute bottom-24 right-4 w-10 h-10 bg-card/90 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-lg hover:bg-card transition-colors z-10"
        data-testid="button-recenter"
      >
        <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        </svg>
      </button>
    </div>
  );
}
