import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Check, Lock, Shield, Key } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Subscription() {
  const plans = [
    {
      name: "Member",
      price: "$9.99",
      period: "/mo",
      features: ["Unlimited swipes", "See who checked your locker", "5 Super Likes/day"],
      color: "from-slate-600 to-slate-500",
      popular: false
    },
    {
      name: "All-Access",
      price: "$24.99",
      period: "/mo",
      features: ["Global Locker Room Access", "Stealth Mode", "Read Receipts", "Priority Status"],
      color: "from-primary to-purple-600",
      popular: true
    },
    {
      name: "VIP",
      price: "$49.99",
      period: "/mo",
      features: ["Dedicated Support", "Message Before Match", "See Online Status", "Verified Badge"],
      color: "from-yellow-500 to-orange-500",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-locker-mesh pb-24 px-4 pt-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-white/10 mb-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <Lock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white">
            Unlock Access
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xs mx-auto font-medium">
            Secure your spot in the global locker room.
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
          {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={cn(
                    "relative p-[1px] rounded-sm overflow-hidden transition-transform duration-300 hover:scale-[1.02]",
                    plan.popular ? "bg-gradient-to-r " + plan.color : "bg-white/10"
                )}
              >
                  {plan.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-black/50 to-transparent px-4 py-1 text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                          Most Popular
                      </div>
                  )}
                  <div className="bg-card rounded-[1px] p-6 h-full relative">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <h3 className={cn("text-xl font-bold font-display uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r", plan.color)}>
                                  {plan.name}
                              </h3>
                          </div>
                          <div className="text-right">
                              <span className="text-2xl font-bold text-white font-mono">{plan.price}</span>
                              <span className="text-xs text-muted-foreground">{plan.period}</span>
                          </div>
                      </div>

                      <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-center text-sm text-gray-400">
                                  <div className="w-4 h-4 mr-3 text-muted-foreground">
                                      <Key className="w-4 h-4" />
                                  </div>
                                  {feature}
                              </li>
                          ))}
                      </ul>

                      <Button className={cn("w-full rounded-sm h-12 text-sm uppercase tracking-widest font-bold text-white shadow-lg bg-gradient-to-r hover:opacity-90 transition-opacity border-0", plan.color)}>
                          Unlock {plan.name}
                      </Button>
                  </div>
              </div>
          ))}
      </div>
      
      <p className="text-center text-[10px] text-muted-foreground mt-8 px-8 uppercase tracking-widest font-mono">
          Secure. Private. Discrete.
      </p>

      <NavBar />
    </div>
  );
}
