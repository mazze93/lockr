import { NavBar } from "@/components/NavBar";
import { MOCK_USERS } from "@/lib/mockData";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export default function Messages() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-4 pt-6 sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-white/5">
        <h1 className="text-3xl font-display font-bold mb-4">Messages</h1>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9 bg-muted/50 border-transparent focus:bg-muted transition-all" placeholder="Search matches..." />
        </div>
      </div>

      <div className="p-4 space-y-2">
        {/* Matches Row */}
        <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 tracking-wide uppercase">New Matches</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {MOCK_USERS.map((user) => (
                    <div key={user.id} className="flex flex-col items-center gap-2 min-w-[70px]">
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-primary to-secondary">
                             <img src={user.image} className="w-full h-full rounded-full object-cover border-2 border-background" />
                        </div>
                        <span className="text-xs font-medium truncate w-full text-center">{user.name}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Message List */}
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 tracking-wide uppercase">Conversations</h2>
        <div className="space-y-1">
            {MOCK_USERS.slice(0, 4).map((user, i) => (
                <Link key={user.id} href={`/messages/${user.id}`}>
                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer active:scale-[0.98] transition-transform">
                        <div className="relative">
                            <img src={user.image} className="w-14 h-14 rounded-full object-cover" />
                            {user.status === 'online' && (
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full shadow-[0_0_8px_theme(colors.green.500)]" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-semibold text-lg">{user.name}</h3>
                                <span className="text-xs text-muted-foreground">{i === 0 ? '2m' : i === 1 ? '1h' : '1d'}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                                {i === 0 ? "Hey, are you going to the event tonight?" : i === 1 ? "Nice to meet you!" : "Let's grab coffee sometime."}
                            </p>
                        </div>
                        {i === 0 && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-primary/40">
                                1
                            </div>
                        )}
                    </div>
                </Link>
            ))}
        </div>
      </div>
      <NavBar />
    </div>
  );
}
