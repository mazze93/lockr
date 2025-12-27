import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock, Eye, EyeOff, Mail, AlertCircle } from "lucide-react";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { login, signup, isLoggingIn, isSigningUp, loginError, signupError, isAuthenticated } = useAuth();
  
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  if (isAuthenticated) {
    setLocation("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await signup({ email, password });
      }
      setLocation("/onboarding");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  const currentError = error || loginError || signupError;
  const isLoading = isLoggingIn || isSigningUp;

  return (
    <div className="min-h-screen bg-midnight-grid flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-white/10 mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent" />
          <Shield className="w-10 h-10 text-brand-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Lockr
        </h1>
        <p className="text-muted-foreground text-sm">
          Map. Connect. Stay Private.
        </p>
      </div>

      {/* Auth Form */}
      <div className="w-full max-w-sm">
        <div className="bg-card border border-white/10 rounded-2xl p-6 shadow-xl">
          {/* Mode Toggle */}
          <div className="flex bg-muted/30 rounded-full p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
                mode === "login"
                  ? "bg-card text-white shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
              data-testid="tab-login"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
                mode === "signup"
                  ? "bg-card text-white shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
              data-testid="tab-signup"
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 bg-muted/30 border-transparent focus:border-brand-primary focus:bg-muted/50 transition-all"
                  data-testid="input-email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="pl-10 pr-10 bg-muted/30 border-transparent focus:border-brand-primary focus:bg-muted/50 transition-all"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {currentError && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {currentError}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-brand-accent-warm hover:bg-brand-accent-warm/90 text-background font-bold text-sm uppercase tracking-widest shadow-lg disabled:opacity-50"
              data-testid="button-submit"
            >
              {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Security Notice */}
          {mode === "signup" && (
            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                <p>
                  Your privacy is protected. Messages are encrypted. Location is blurred.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
