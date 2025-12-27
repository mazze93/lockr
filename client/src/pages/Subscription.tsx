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
      color: "from-brand-secondary to-status-secure",
      buttonColor: "bg-brand-secondary hover:bg-brand-secondary/90",
      popular: false
    },
    {
      name: "All-Access",
      price: "$24.99",
      period: "/mo",
      features: ["Global Locker Room Access", "Stealth Mode", "Read Receipts", "Priority Status"],
      color: "from-brand-primary to-brand-accent-hot",
      buttonColor: "bg-brand-accent-warm hover:bg-brand-accent-warm/90 text-background",
      popular: true
    },
    {
      name: "VIP",
      price: "$49.99",
      period: "/mo",
      features: ["Dedicated Support", "Message Before Match", "See Online Status", "Verified Badge"],
      color: "from-brand-accent-warm to-brand-accent-hot",
      buttonColor: "bg-brand-accent-hot hover:bg-brand-accent-hot/90",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-midnight-grid pb-24 px-4 pt-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-white/10 mb-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent" />
            <Lock className="w-8 h-8 text-brand-accent-warm" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">
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
                    "relative p-[1px] rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] shadow-xl",
                    plan.popular ? "bg-gradient-to-r " + plan.color : "bg-white/5"
                )}
              >
                  {plan.popular && (
                      <div className="absolute top-0 right-0 bg-brand-accent-warm px-4 py-1 rounded-bl-xl text-[10px] font-bold text-background uppercase tracking-wider font-mono shadow-sm">
                          Most Popular
                      </div>
                  )}
                  <div className="bg-card rounded-[15px] p-6 h-full relative">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <h3 className={cn("text-xl font-bold font-display uppercase tracking-wider", plan.popular ? "text-brand-accent-warm" : "text-white")}>
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
                              <li key={i} className="flex items-center text-sm text-gray-300">
                                  <div className="w-4 h-4 mr-3 text-brand-primary">
                                      <Key className="w-4 h-4" />
                                  </div>
                                  {feature}
                              </li>
                          ))}
                      </ul>

                      <Button className={cn("w-full rounded-full h-12 text-sm uppercase tracking-widest font-bold shadow-lg transition-all border-0", plan.buttonColor)}>
                          Unlock {plan.name}
                      </Button>
                  </div>
              </div>
          ))}
      </div>
      
      <p className="text-center text-[10px] text-muted-foreground mt-8 px-8 uppercase tracking-widest font-mono opacity-60">
          Secure. Private. Discrete.
      </p>

      <NavBar />
    </div>
  );
}
