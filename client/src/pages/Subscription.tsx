import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Check, Zap, Eye, Ghost, Map, Infinity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Subscription() {
  const plans = [
    {
      name: "Plus",
      price: "$9.99",
      period: "/mo",
      features: ["Unlimited swipes", "See who liked you", "5 Super Likes/day"],
      color: "from-blue-500 to-cyan-500",
      popular: false
    },
    {
      name: "Ultra",
      price: "$24.99",
      period: "/mo",
      features: ["Everything in Plus", "Global Mode", "Incognito Mode", "Read Receipts"],
      color: "from-primary to-purple-600",
      popular: true
    },
    {
      name: "Max",
      price: "$49.99",
      period: "/mo",
      features: ["Everything in Ultra", "Priority Placement", "Message Before Match", "See Online Status"],
      color: "from-yellow-500 to-orange-500",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary mb-4 shadow-[0_0_30px_theme(colors.primary/50)]">
            <Zap className="w-8 h-8 text-white fill-white" />
        </div>
        <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Unlock Pulse
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
            Get more matches, see who likes you, and explore globally.
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
          {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={cn(
                    "relative p-[1px] rounded-3xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]",
                    plan.popular ? "bg-gradient-to-r " + plan.color : "bg-white/10"
                )}
              >
                  {plan.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-black/50 to-transparent px-4 py-1 rounded-bl-xl text-xs font-bold text-white uppercase tracking-wider">
                          Best Value
                      </div>
                  )}
                  <div className="bg-card rounded-[23px] p-6 h-full relative">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <h3 className={cn("text-2xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r", plan.color)}>
                                  {plan.name}
                              </h3>
                          </div>
                          <div className="text-right">
                              <span className="text-2xl font-bold text-white">{plan.price}</span>
                              <span className="text-xs text-muted-foreground">{plan.period}</span>
                          </div>
                      </div>

                      <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-center text-sm text-gray-300">
                                  <div className={cn("w-5 h-5 rounded-full flex items-center justify-center mr-3 bg-gradient-to-r text-white text-[10px]", plan.color)}>
                                      <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                  {feature}
                              </li>
                          ))}
                      </ul>

                      <Button className={cn("w-full rounded-xl h-12 text-base font-bold text-white shadow-lg bg-gradient-to-r hover:opacity-90 transition-opacity border-0", plan.color)}>
                          Get {plan.name}
                      </Button>
                  </div>
              </div>
          ))}
      </div>
      
      <p className="text-center text-xs text-muted-foreground mt-8 px-8">
          Recurring billing, cancel anytime. By continuing you agree to our Terms of Service.
      </p>

      <NavBar />
    </div>
  );
}
