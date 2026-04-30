import { useState } from "react";
import type { AuthMode } from "./AuthForm";

export type AuthFormState = {
  mode: AuthMode;
  email: string;
  password: string;
  showPassword: boolean;
  error: string | null;
};

/** Manages auth form state and exposes state mutation helpers. */
export function useAuthState() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeChange = (value: AuthMode) => {
    setMode(value);
    setError(null);
  };

  return {
    mode,
    email,
    password,
    showPassword,
    error,
    setEmail,
    setPassword,
    setShowPassword,
    setError,
    handleModeChange,
  };
}
