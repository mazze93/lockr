import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import MapHome from "@/pages/MapHome";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import Subscription from "@/pages/Subscription";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MapHome} />
      <Route path="/messages" component={Messages} />
      <Route path="/messages/:id" component={Messages} />
      <Route path="/profile" component={Profile} />
      <Route path="/subscription" component={Subscription} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
