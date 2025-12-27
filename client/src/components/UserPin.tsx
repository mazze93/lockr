import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import type { MapUser } from "@/pages/MapHome";

interface UserPinProps {
  user: MapUser;
  onClick: (user: MapUser) => void;
}

export function UserPin({ user, onClick }: UserPinProps) {
  const isOnline = user.status === 'online';
  
  return (
    <motion.button
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${user.coordinates.x}%`, top: `${user.coordinates.y}%` }}
      whileHover={{ scale: 1.15, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(user);
      }}
      data-testid={`pin-user-${user.id}`}
    >
      <div className="relative">
        {/* Status Glow */}
        {isOnline && (
            <div className="absolute -inset-2 rounded-full bg-brand-accent-hot/30 animate-pulse blur-md" />
        )}
        
        {/* Avatar Ring */}
        <div className={cn(
            "w-12 h-12 rounded-full overflow-hidden border-2 shadow-xl transition-all duration-300 relative z-10 bg-card",
            isOnline ? "border-brand-accent-hot" : "border-muted-foreground/40 grayscale"
        )}>
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
        </div>

        {/* 2FA/Verified Badge - Teal Shield */}
        <div className="absolute -top-1 -right-1 z-20 bg-status-secure text-white rounded-full p-0.5 border border-background shadow-sm">
            <Shield className="w-2.5 h-2.5 fill-current" />
        </div>

        {/* Distance Badge */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-card/90 text-white text-[10px] px-2 py-1 rounded-md shadow-lg border border-white/10 pointer-events-none z-20 flex flex-col items-center gap-0.5">
            <span className="font-bold text-brand-accent-warm">{user.name}, {user.age}</span>
            <span className="text-[9px] text-muted-foreground">{user.distance} away</span>
        </div>
      </div>
    </motion.button>
  );
}
