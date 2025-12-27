import { NavBar } from "@/components/NavBar";
import { CURRENT_USER } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Settings, Edit2, Shield, Star, LogOut } from "lucide-react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background pb-24">
       <div className="relative h-64">
           <img src={CURRENT_USER.image} className="w-full h-full object-cover opacity-60 mask-image-b" />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
           <Button size="icon" variant="ghost" className="absolute top-4 right-4 bg-black/20 backdrop-blur-md text-white hover:bg-black/40">
               <Settings className="w-5 h-5" />
           </Button>
       </div>

       <div className="px-6 -mt-12 relative z-10">
           <div className="flex justify-between items-end mb-4">
               <div>
                   <h1 className="text-4xl font-display font-bold">{CURRENT_USER.name}, {CURRENT_USER.age}</h1>
                   <p className="text-muted-foreground">@alex_city</p>
               </div>
               <Button size="icon" className="rounded-full w-12 h-12 bg-primary text-white shadow-[0_0_20px_theme(colors.primary/40)] hover:bg-primary/90">
                   <Edit2 className="w-5 h-5" />
               </Button>
           </div>

           {/* Stats / Status */}
           <div className="flex gap-4 mb-8">
               <div className="flex-1 bg-card border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
                   <span className="text-2xl font-bold font-display">1.2k</span>
                   <span className="text-xs text-muted-foreground uppercase tracking-wider">Views</span>
               </div>
               <div className="flex-1 bg-card border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <span className="text-2xl font-bold font-display text-primary">Free</span>
                   <span className="text-xs text-muted-foreground uppercase tracking-wider">Plan</span>
               </div>
           </div>

            {/* Menu Items */}
           <div className="space-y-4">
               <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</h2>
               
               <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
                   <div className="p-4 flex items-center gap-4 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5">
                       <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                           <Shield className="w-5 h-5" />
                       </div>
                       <div className="flex-1">
                           <h3 className="font-medium">Privacy & Safety</h3>
                           <p className="text-xs text-muted-foreground">Manage your visibility</p>
                       </div>
                   </div>
                    <div className="p-4 flex items-center gap-4 hover:bg-white/5 cursor-pointer transition-colors">
                       <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                           <Star className="w-5 h-5" />
                       </div>
                       <div className="flex-1">
                           <h3 className="font-medium">Lockr+ Membership</h3>
                           <p className="text-xs text-muted-foreground">Upgrade for features</p>
                       </div>
                   </div>
               </div>

                <Button variant="destructive" className="w-full mt-8 rounded-xl h-12 bg-red-900/20 text-red-500 hover:bg-red-900/40 border border-red-900/50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                </Button>
           </div>
       </div>

      <NavBar />
    </div>
  );
}
