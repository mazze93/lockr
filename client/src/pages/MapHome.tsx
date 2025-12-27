import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPin } from "@/components/UserPin";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { Button } from "@/components/ui/button";
import { Filter, Locate, Shield, Menu, Ghost } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { useNearbyUsers } from "@/hooks/useNearbyUsers";

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

export default function MapHome() {
  const constraintsRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState<MapUser | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const { user, location, updateLocation } = useAuth();
  
  // Get user's location
  useEffect(() => {
    if (location) {
      setUserLocation({ lat: location.latitude, lng: location.longitude });
    } else {
      // Request geolocation
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          // Update location in backend
          updateLocation({
            latitude,
            longitude,
            blurRadiusMeters: 200,
            ghostModeEnabled: false,
          });
        },
        () => {
          // Fallback to a default location for demo purposes
          setUserLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    }
  }, [location, updateLocation]);

  const { data: nearbyData, isLoading } = useNearbyUsers(
    userLocation?.lat ?? null,
    userLocation?.lng ?? null,
    5000
  );

  // Transform API data to MapUser format or use demo users
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
        coordinates: generateCoordinates(index, nearbyData.users.length),
      }))
    : generateDemoUsers();

  const handlePinClick = (user: MapUser) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground relative touch-none select-none">
      {/* Map Header - Floating */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 pt-6 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto max-w-md mx-auto w-full bg-card/80 backdrop-blur-lg border border-border/50 p-3 rounded-full shadow-lg">
            <div className="flex items-center gap-3 pl-2">
                 <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                    <Shield className="w-4 h-4 fill-current" />
                 </div>
                 <div>
                    <h1 className="text-lg font-bold text-white leading-none">
                        Lockr
                    </h1>
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

      {/* Ghost Mode Toggle */}
      {location?.ghostModeEnabled && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-muted/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
          <Ghost className="w-4 h-4 text-brand-accent-warm" />
          <span className="text-xs text-white font-medium">Ghost Mode Active</span>
        </div>
      )}

      {/* Map Container */}
      <div className="w-full h-full relative bg-midnight-grid" ref={constraintsRef}>
        <motion.div 
            className="absolute bg-midnight-grid w-[300vw] h-[300vh]"
            style={{ 
                left: '-100vw',
                top: '-100vh'
            }}
            drag
            dragConstraints={{ left: -1000, right: 0, top: -1000, bottom: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
        >
             {/* Map Decoration - Radar circles */}
             <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                 <svg width="100%" height="100%">
                    <circle cx="50%" cy="50%" r="200" stroke="rgba(18, 109, 127, 0.3)" strokeWidth="1" fill="none" />
                    <circle cx="50%" cy="50%" r="400" stroke="rgba(18, 109, 127, 0.2)" strokeWidth="1" fill="none" />
                    <circle cx="50%" cy="50%" r="600" stroke="rgba(18, 109, 127, 0.1)" strokeWidth="1" fill="none" />
                 </svg>
             </div>

             {/* Users */}
             {isLoading ? (
               <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2">
                 <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
               </div>
             ) : (
               mapUsers.map((user) => (
                   <UserPin key={user.id} user={user} onClick={handlePinClick} />
               ))
             )}

            {/* Current User location pulse */}
            <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                 <div className="w-64 h-64 rounded-full bg-brand-primary/10 animate-pulse absolute -translate-x-1/2 -translate-y-1/2" />
                 <div className="w-4 h-4 rounded-full bg-brand-primary border-2 border-white/50 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-[0_0_20px_theme(colors.brand.primary)]">
                 </div>
            </div>

        </motion.div>

         {/* Location Badge */}
        <div className="absolute right-4 bottom-24 z-40">
            <div className="bg-card/80 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 text-[10px] text-muted-foreground font-medium shadow-xl flex items-center gap-2">
                <Locate className="w-3 h-3 text-brand-primary" />
                <span data-testid="text-accuracy">Accuracy: ~{location?.blurRadiusMeters || 200}m</span>
            </div>
        </div>
      </div>

      <ProfileDrawer 
        user={selectedUser} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      <NavBar />
    </div>
  );
}

// Helper functions
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

function generateCoordinates(index: number, total: number): { x: number; y: number } {
  // Distribute users around the center in a spiral pattern
  const angle = (index / total) * 2 * Math.PI;
  const radius = 10 + (index * 5);
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;
  return { x: Math.max(15, Math.min(85, x)), y: Math.max(15, Math.min(85, y)) };
}

function generateDemoUsers(): MapUser[] {
  // Demo users for visual prototype when no real users exist
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
  const positions = [
    { x: 45, y: 45 },
    { x: 60, y: 30 },
    { x: 20, y: 60 },
    { x: 80, y: 75 },
    { x: 30, y: 20 },
    { x: 55, y: 65 },
  ];

  return demoNames.map((name, i) => ({
    id: `demo-${i}`,
    name,
    age: 22 + i * 2,
    distance: `${200 + i * 300}m`,
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    bio: demoBios[i],
    tags: demoTags[i],
    status: i % 2 === 0 ? 'online' : 'offline',
    coordinates: positions[i],
  }));
}
