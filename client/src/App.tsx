import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import MapHome from "@/pages/MapHome";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import Subscription from "@/pages/Subscription";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import { authAPI } from "@/lib/api";

function useAuthCheck() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authAPI.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { data, isLoading } = useAuthCheck();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!data?.user) {
    return <Redirect to="/auth" />;
  }

  if (data.needsOnboarding) {
    return <Redirect to="/onboarding" />;
  }

  return <Component />;
}

function AuthRoute({ component: Component }: { component: React.ComponentType }) {
  const { data, isLoading } = useAuthCheck();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (data?.user && !data.needsOnboarding) {
    return <Redirect to="/" />;
  }

  if (data?.user && data.needsOnboarding) {
    return <Redirect to="/onboarding" />;
  }

  return <Component />;
}

function OnboardingRoute({ component: Component }: { component: React.ComponentType }) {
  const { data, isLoading } = useAuthCheck();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!data?.user) {
    return <Redirect to="/auth" />;
  }

  if (!data.needsOnboarding) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/auth">
        {() => <AuthRoute component={Auth} />}
      </Route>
      <Route path="/onboarding">
        {() => <OnboardingRoute component={Onboarding} />}
      </Route>
      <Route path="/">
        {() => <ProtectedRoute component={MapHome} />}
      </Route>
      <Route path="/messages">
        {() => <ProtectedRoute component={Messages} />}
      </Route>
      <Route path="/messages/:id">
        {() => <ProtectedRoute component={Messages} />}
      </Route>
      <Route path="/profile">
        {() => <ProtectedRoute component={Profile} />}
      </Route>
      <Route path="/subscription">
        {() => <ProtectedRoute component={Subscription} />}
      </Route>
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
