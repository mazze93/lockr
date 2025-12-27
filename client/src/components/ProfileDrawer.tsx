import { Drawer } from "vaul";
import { User } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, MapPin, Zap } from "lucide-react";
import { Link } from "wouter";

interface ProfileDrawerProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ user, isOpen, onClose }: ProfileDrawerProps) {
  if (!user) return null;

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
        <Drawer.Content className="bg-card flex flex-col rounded-t-[20px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 outline-none">
            {/* Handle Indicator */}
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/30 mt-4 mb-2" />
            
            <div className="p-4 flex-1 overflow-y-auto">
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl mb-6 group">
                    <img 
                        src={user.image} 
                        alt={user.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="text-4xl font-display font-bold text-white mb-1">
                                    {user.name}, {user.age}
                                </h2>
                                <div className="flex items-center text-white/80 gap-2 text-sm font-medium">
                                    <span className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_theme(colors.green.500)]' : 'bg-gray-500'}`} />
                                    {user.status === 'online' ? 'Online Now' : 'Last seen recently'}
                                    <span className="mx-1">•</span>
                                    <MapPin className="w-4 h-4" /> {user.distance} away
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 px-1">
                    <div className="flex gap-2 w-full">
                         <Link href={`/messages?user=${user.id}`} className="flex-1">
                            <Button size="lg" className="w-full text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl h-14 shadow-[0_0_20px_theme(colors.primary/30)]">
                                <MessageCircle className="mr-2 w-5 h-5" />
                                Say Hi
                            </Button>
                        </Link>
                        <Button size="icon" variant="secondary" className="h-14 w-14 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20">
                            <Zap className="w-6 h-6" />
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white/90">About Me</h3>
                        <p className="text-muted-foreground leading-relaxed text-base">
                            {user.bio}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white/90">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.tags.map(tag => (
                                <span key={tag} className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-white/80 border border-white/5">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-4 border-t border-white/5 bg-card pb-8">
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-white" onClick={onClose}>
                    Close Profile
                </Button>
            </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
