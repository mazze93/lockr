import { User } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface UserPinProps {
  user: User;
  onClick: (user: User) => void;
}

export function UserPin({ user, onClick }: UserPinProps) {
  return (
    <motion.button
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${user.coordinates.x}%`, top: `${user.coordinates.y}%` }}
      whileHover={{ scale: 1.2, zIndex: 10 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent map click
        onClick(user);
      }}
    >
      <div className="relative">
        {/* Status Indicator Ring */}
        <div className={cn(
            "absolute -inset-1 rounded-full opacity-70 blur-sm transition-colors duration-500",
            user.status === 'online' ? "bg-primary" : "bg-transparent"
        )} />
        
        {/* Avatar */}
        <div className={cn(
            "w-12 h-12 rounded-full overflow-hidden border-2 shadow-lg transition-colors duration-300",
            user.status === 'online' ? "border-primary" : "border-muted-foreground/50 grayscale-[0.5]"
        )}>
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
        </div>

        {/* Distance Badge */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 pointer-events-none">
            {user.name}, {user.age} • {user.distance}
        </div>
      </div>
    </motion.button>
  );
}
