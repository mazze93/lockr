import { AlertCircle, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type AuthMode = "login" | "signup";

type AuthFormProps = {
  email: string;
  error: string | null;
  isLoading: boolean;
  mode: AuthMode;
  password: string;
  showPassword: boolean;
  onEmailChange: (value: string) => void;
  onModeChange: (value: AuthMode) => void;
  onPasswordChange: (value: string) => void;
  onShowPasswordToggle: () => void;
  onSubmit: (event: React.FormEvent) => void;
};

/** Presents the login/signup toggle buttons. */
function ModeToggle({ mode, onModeChange }: { mode: AuthMode; onModeChange: (value: AuthMode) => void }) {
  return (
    <div className="flex bg-muted/30 rounded-full p-1 mb-6">
      <button
        type="button"
        onClick={() => onModeChange("login")}
        className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
          mode === "login" ? "bg-card text-white shadow-sm" : "text-muted-foreground hover:text-white"
        }`}
        data-testid="tab-login"
      >
        Sign In
      </button>
      <button
        type="button"
        onClick={() => onModeChange("signup")}
        className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
          mode === "signup" ? "bg-card text-white shadow-sm" : "text-muted-foreground hover:text-white"
        }`}
        data-testid="tab-signup"
      >
        Create Account
      </button>
    </div>
  );
}

/** Announces validation errors to assistive technology. */
function ErrorNotice({ message, messageId }: { message: string; messageId: string }) {
  return (
    <div
      id={messageId}
      className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      {message}
    </div>
  );
}

/** Reinforces privacy guarantees during signup. */
function SecurityNotice() {
  return (
    <div className="mt-6 pt-4 border-t border-white/5">
      <div className="flex items-start gap-3 text-sm text-muted-foreground">
        <Shield className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
        <p>Your privacy is protected. Messages are encrypted. Location is blurred.</p>
      </div>
    </div>
  );
}

/** Collects the user's email address with accessible labeling. */
function EmailField({
  value,
  errorMessageId,
  inputId,
  onChange,
}: {
  value: string;
  errorMessageId?: string;
  inputId: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium text-muted-foreground">Email</label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          id={inputId}
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="you@example.com"
          className="pl-10 bg-muted/30 border-transparent focus:border-brand-primary focus:bg-muted/50 transition-all"
          data-testid="input-email"
          aria-describedby={errorMessageId}
          required
        />
      </div>
    </div>
  );
}

/** Captures the password with an inline show/hide toggle. */
function PasswordField({
  value,
  errorMessageId,
  inputId,
  onChange,
  onToggle,
  showPassword,
}: {
  value: string;
  errorMessageId?: string;
  inputId: string;
  onChange: (value: string) => void;
  onToggle: () => void;
  showPassword: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium text-muted-foreground">Password</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          id={inputId}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Min 8 characters"
          className="pl-10 pr-10 bg-muted/30 border-transparent focus:border-brand-primary focus:bg-muted/50 transition-all"
          data-testid="input-password"
          aria-describedby={errorMessageId}
          minLength={8}
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

/** Shows the current submit state for the active mode. */
function SubmitButton({ isLoading, mode }: { isLoading: boolean; mode: AuthMode }) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="w-full h-12 rounded-full bg-brand-accent-warm hover:bg-brand-accent-warm/90 text-background font-bold text-sm uppercase tracking-widest shadow-lg disabled:opacity-50"
      data-testid="button-submit"
    >
      {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
    </Button>
  );
}

/** Auth form with accessible labels, validation, and privacy messaging. */
export function AuthForm({
  email,
  error,
  isLoading,
  mode,
  password,
  showPassword,
  onEmailChange,
  onModeChange,
  onPasswordChange,
  onShowPasswordToggle,
  onSubmit,
}: AuthFormProps) {
  const emailInputId = "auth-email";
  const passwordInputId = "auth-password";
  const errorMessageId = error ? "auth-error" : undefined;

  return (
    <div className="bg-card/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
      <ModeToggle mode={mode} onModeChange={onModeChange} />
      <form onSubmit={onSubmit} className="space-y-4">
        <EmailField
          value={email}
          errorMessageId={errorMessageId}
          inputId={emailInputId}
          onChange={onEmailChange}
        />
        <PasswordField
          value={password}
          errorMessageId={errorMessageId}
          inputId={passwordInputId}
          onChange={onPasswordChange}
          onToggle={onShowPasswordToggle}
          showPassword={showPassword}
        />
        {error && errorMessageId && <ErrorNotice message={error} messageId={errorMessageId} />}
        <SubmitButton isLoading={isLoading} mode={mode} />
      </form>
      {mode === "signup" && <SecurityNotice />}
    </div>
  );
}
