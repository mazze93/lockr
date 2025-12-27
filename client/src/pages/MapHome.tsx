import { useState, useEffect } from "react";
import { BlueprintMap } from "@/components/BlueprintMap";
import { Button } from "@/components/ui/button";
import { Filter, Shield, Menu, Ghost, X } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { useNearbyUsers } from "@/hooks/useNearbyUsers";
import { Drawer } from "vaul";
import type { Landmark } from "@/lib/mapStyle";
import { LANDMARK_CATEGORIES } from "@/lib/mapStyle";
import { useLocation } from "wouter";
import { useCreateConversation } from "@/hooks/useConversations";

export interface MapUser {
  id: string;
  name: string;
  age: number;
  distance: string;
  image: string;
  bio: string;
  tags: string[];
  status: 'online' | 'offline' | 'busy';
  coordinates: { x: number; y: number };
}

const DEFAULT_LOCATION = { lat: 40.7128, lng: -74.006 };

export default function MapHome() {
  const [, setLocation] = useLocation();
  const [selectedUser, setSelectedUser] = useState<MapUser | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [isLandmarkDrawerOpen, setIsLandmarkDrawerOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(DEFAULT_LOCATION);
  
  const { location, updateLocation } = useAuth();
  const createConversation = useCreateConversation();

  useEffect(() => {
    if (location) {
      setUserLocation({ lat: location.latitude, lng: location.longitude });
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          updateLocation({
            latitude,
            longitude,
            blurRadiusMeters: 200,
            ghostModeEnabled: false,
          });
        },
        () => {
          // Keep default location on error
        }
      );
    }
  }, [location, updateLocation]);

  const { data: nearbyData, isLoading } = useNearbyUsers(
    userLocation?.lat ?? null,
    userLocation?.lng ?? null,
    5000
  );

  const mapUsers: MapUser[] = nearbyData?.users?.length
    ? nearbyData.users.map((u: any, index: number) => ({
        id: u.userId,
        name: u.profile?.headline?.split(',')[0] || `User ${index + 1}`,
        age: u.profile?.age || 25,
        distance: formatDistance(u.distance),
        image: u.profile?.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.userId}`,
        bio: u.profile?.bio || "",
        tags: u.profile?.tags || [],
        status: u.isOnline ? 'online' : 'offline',
        coordinates: { 
          x: u.location.longitude, 
          y: u.location.latitude 
        },
      }))
    : generateDemoUsers(userLocation?.lat || 40.7128, userLocation?.lng || -74.006);

  const handleUserClick = (user: MapUser) => {
    setSelectedUser(user);
    setIsUserDrawerOpen(true);
  };

  const handleLandmarkClick = (landmark: Landmark) => {
    setSelectedLandmark(landmark);
    setIsLandmarkDrawerOpen(true);
  };

  const handleMessage = async () => {
    if (!selectedUser) return;
    try {
      const result = await createConversation.mutateAsync(selectedUser.id);
      setIsUserDrawerOpen(false);
      setLocation(`/messages/${result.conversation.id}`);
    } catch (error) {
      setIsUserDrawerOpen(false);
      setLocation(`/messages`);
    }
  };

  if (false) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground relative">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 pt-6 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto max-w-md mx-auto w-full bg-card/80 backdrop-blur-lg border border-border/50 p-3 rounded-full shadow-lg">
          <div className="flex items-center gap-3 pl-2">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
              <Shield className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Lockr</h1>
              <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-status-secure animate-pulse" />
                SECURE • ENCRYPTED
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full w-9 h-9 hover:bg-white/10 text-muted-foreground hover:text-white"
              data-testid="button-filter"
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full w-9 h-9 hover:bg-white/10 text-muted-foreground hover:text-white"
              data-testid="button-menu"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Ghost Mode Indicator */}
      {location?.ghostModeEnabled && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-muted/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
          <Ghost className="w-4 h-4 text-brand-accent-warm" />
          <span className="text-xs text-white font-medium">Ghost Mode Active</span>
        </div>
      )}

      {/* Blueprint Map */}
      <BlueprintMap
        center={userLocation}
        users={mapUsers}
        onUserClick={handleUserClick}
        onLandmarkClick={handleLandmarkClick}
        blurRadius={location?.blurRadiusMeters || 200}
      />

      {/* Accuracy Badge */}
      <div className="absolute left-4 bottom-24 z-40">
        <div className="bg-card/80 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 text-[10px] text-muted-foreground font-medium shadow-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          <span data-testid="text-accuracy">Accuracy: ~{location?.blurRadiusMeters || 200}m</span>
        </div>
      </div>

      {/* User Profile Drawer */}
      <Drawer.Root open={isUserDrawerOpen} onOpenChange={(open) => !open && setIsUserDrawerOpen(false)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
          <Drawer.Content className="bg-card flex flex-col rounded-t-[20px] max-h-[85vh] fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 outline-none">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/30 mt-4 mb-2" />
            
            {selectedUser && (
              <div className="p-6 overflow-y-auto">
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-accent-hot shadow-xl bg-muted">
                      <img src={selectedUser.image} alt={selectedUser.name} className="w-full h-full object-cover" />
                    </div>
                    {selectedUser.status === 'online' && (
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-brand-accent-hot rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white" data-testid="text-username">
                      {selectedUser.name}, {selectedUser.age}
                    </h2>
                    <p className="text-sm text-muted-foreground" data-testid="text-distance">
                      {selectedUser.distance} away
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-status-secure/20 text-status-secure text-xs font-medium rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                      {selectedUser.status === 'online' && (
                        <span className="px-2 py-0.5 bg-brand-accent-hot/20 text-brand-accent-hot text-xs font-medium rounded-full">
                          Online
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {selectedUser.bio && (
                  <p className="text-foreground/80 text-sm mb-4" data-testid="text-bio">
                    {selectedUser.bio}
                  </p>
                )}

                {selectedUser.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedUser.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-muted/50 text-xs font-medium text-foreground/70 rounded-full border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleMessage}
                  disabled={createConversation.isPending}
                  className="w-full h-12 rounded-full bg-brand-accent-warm hover:bg-brand-accent-warm/90 text-background font-bold"
                  data-testid="button-message"
                >
                  {createConversation.isPending ? "Opening chat..." : "Say Hi 👋"}
                </Button>
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Landmark Drawer */}
      <Drawer.Root open={isLandmarkDrawerOpen} onOpenChange={(open) => !open && setIsLandmarkDrawerOpen(false)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
          <Drawer.Content className="bg-card flex flex-col rounded-t-[20px] max-h-[60vh] fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 outline-none">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/30 mt-4 mb-2" />
            
            {selectedLandmark && (
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg border"
                    style={{ 
                      background: `${LANDMARK_CATEGORIES[selectedLandmark.category].color}20`,
                      borderColor: `${LANDMARK_CATEGORIES[selectedLandmark.category].color}50`,
                    }}
                  >
                    {LANDMARK_CATEGORIES[selectedLandmark.category].icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedLandmark.name}</h2>
                    <p className="text-sm text-muted-foreground capitalize">{selectedLandmark.category}</p>
                  </div>
                </div>
                
                {selectedLandmark.description && (
                  <p className="text-foreground/80 text-sm mb-4">{selectedLandmark.description}</p>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-muted/30 rounded-md">LGBTQ+ Friendly</span>
                  <span className="px-2 py-1 bg-muted/30 rounded-md">Popular</span>
                </div>
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <NavBar />
    </div>
  );
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

function generateDemoUsers(centerLat: number, centerLng: number): MapUser[] {
  const demoNames = ["Jordan", "Casey", "Riley", "Taylor", "Morgan", "Jamie"];
  const demoBios = [
    "Art director by day, gamer by night. 🎨🎮",
    "Love hiking and outdoor adventures.",
    "Student at the university. 📚",
    "Musician. Let's jam? 🎸",
    "Chef. I make the best pasta. 🍝",
    "Just looking for friends.",
  ];
  const demoTags = [
    ["Art", "Gaming", "Nightlife"],
    ["Hiking", "Outdoors", "Photography"],
    ["Student", "Books", "Coffee"],
    ["Music", "Guitar", "Concerts"],
    ["Food", "Cooking", "Wine"],
    ["Friends", "Chat"],
  ];

  return demoNames.map((name, i) => {
    const angle = (i / demoNames.length) * 2 * Math.PI;
    const distance = 0.003 + Math.random() * 0.008;
    
    return {
      id: `demo-${i}`,
      name,
      age: 22 + i * 2,
      distance: `${200 + i * 300}m`,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      bio: demoBios[i],
      tags: demoTags[i],
      status: i % 2 === 0 ? 'online' : 'offline',
      coordinates: { 
        x: centerLng + Math.cos(angle) * distance, 
        y: centerLat + Math.sin(angle) * distance 
      },
    };
  });
}
