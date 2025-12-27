import { Link, useLocation } from "wouter";
import { Map, MessageCircle, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavBar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Map, label: "Map" },
    { href: "/messages", icon: MessageCircle, label: "Chat" },
    { href: "/subscription", icon: Zap, label: "Pulse+" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-transparent pointer-events-none">
      <nav className="flex items-center justify-around max-w-md mx-auto pointer-events-auto bg-background/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 shadow-2xl">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer group",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                    "p-2 rounded-full transition-all duration-300 relative",
                    isActive && "bg-primary/20"
                )}>
                    <item.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                        <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
                    )}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
