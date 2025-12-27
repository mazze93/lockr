import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MOCK_USERS, User } from "@/lib/mockData";
import { UserPin } from "@/components/UserPin";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { Button } from "@/components/ui/button";
import { Filter, Locate, Zap } from "lucide-react";
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
      <div className="absolute top-0 left-0 right-0 z-40 p-4 pt-6 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto max-w-md mx-auto w-full">
            <div>
                <h1 className="text-2xl font-display font-bold text-white drop-shadow-md flex items-center gap-2">
                    LOCKR <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/20 font-mono text-muted-foreground">BETA</span>
                </h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Secure Access</p>
            </div>
            <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/5">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                </Button>
                 <Button size="icon" variant="ghost" className="rounded-xl bg-primary/10 text-primary hover:bg-primary/20 backdrop-blur-md border border-primary/20 shadow-[0_0_15px_theme(colors.primary/20)]">
                    <Zap className="w-5 h-5 fill-current" />
                </Button>
            </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-full relative bg-locker-mesh" ref={constraintsRef}>
        <motion.div 
            className="absolute bg-locker-mesh w-[300vw] h-[300vh]"
            style={{ 
                left: '-100vw',
                top: '-100vh'
            }}
            drag
            dragConstraints={{ left: -1000, right: 0, top: -1000, bottom: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
        >
             {/* Map Decoration - Streets/Blocks (Abstract) */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" width="100%" height="100%">
                 {/* Random abstract paths to look like streets */}
                 <path d="M 0 500 Q 500 500 1000 0" stroke="white" strokeWidth="2" fill="none" />
                 <path d="M 500 0 L 500 2000" stroke="white" strokeWidth="2" fill="none" />
                 <path d="M 0 1000 L 2000 1000" stroke="white" strokeWidth="1" fill="none" />
                 <circle cx="50%" cy="50%" r="200" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="4" fill="none" />
             </svg>

             {/* Users */}
            {MOCK_USERS.map((user) => (
                <UserPin key={user.id} user={user} onClick={handlePinClick} />
            ))}

            {/* Current User location pulse */}
            <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                 <div className="w-96 h-96 rounded-full bg-primary/5 animate-pulse absolute -translate-x-1/2 -translate-y-1/2" />
                 <div className="w-8 h-8 rounded-full bg-primary/20 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-[0_0_20px_theme(colors.primary)]">
                    <div className="w-3 h-3 bg-white rounded-full" />
                 </div>
            </div>

        </motion.div>

         {/* Floating Recenter Button */}
        <div className="absolute right-4 bottom-24 z-40">
            <Button size="icon" className="rounded-full w-12 h-12 shadow-xl bg-card border border-white/10" onClick={() => {
                // In a real app, this would reset the drag controls
                alert("This would re-center the map to your location");
            }}>
                <Locate className="w-6 h-6 text-primary" />
            </Button>
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
