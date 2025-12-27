import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MOCK_USERS, User } from "@/lib/mockData";
import { UserPin } from "@/components/UserPin";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { Button } from "@/components/ui/button";
import { Filter, Locate, Shield, Menu } from "lucide-react";
import { NavBar } from "@/components/NavBar";

export default function MapHome() {
  const constraintsRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handlePinClick = (user: User) => {
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
                <Button size="icon" variant="ghost" className="rounded-full w-9 h-9 hover:bg-white/10 text-muted-foreground hover:text-white">
                    <Filter className="w-4 h-4" />
                </Button>
                 <Button size="icon" variant="ghost" className="rounded-full w-9 h-9 hover:bg-white/10 text-muted-foreground hover:text-white">
                    <Menu className="w-4 h-4" />
                </Button>
            </div>
        </div>
      </div>

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
            {MOCK_USERS.map((user) => (
                <UserPin key={user.id} user={user} onClick={handlePinClick} />
            ))}

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
                <span>Accuracy: ~200m</span>
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
