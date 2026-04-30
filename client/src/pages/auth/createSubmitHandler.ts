import type { AuthFormState } from "./useAuthState";
import type { AuthMutations } from "./useAuthMutations";

/** Validates input and triggers the correct authentication mutation. */
export function createSubmitHandler({
  state,
  setError,
  loginMutation,
  signupMutation,
}: {
  state: AuthFormState;
  setError: (message: string | null) => void;
  loginMutation: AuthMutations["loginMutation"];
  signupMutation: AuthMutations["signupMutation"];
}) {
  return (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!state.email || !state.password) {
      setError("Email and password are required");
      return;
    }

    if (state.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (state.mode === "login") {
      loginMutation.mutate();
      return;
    }

    signupMutation.mutate();
  };
}
