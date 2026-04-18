import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { createSubmitHandler } from "./createSubmitHandler";
import { useAuthMutations } from "./useAuthMutations";
import { useAuthState } from "./useAuthState";

/** Aggregates Auth page state, mutations, and submit behavior. */
export function useAuthPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const state = useAuthState();

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["auth"] });
    setLocation("/onboarding");
  };

  const { loginMutation, signupMutation } = useAuthMutations({
    email: state.email,
    password: state.password,
    onSuccess: handleSuccess,
    onError: (message) => state.setError(message),
  });

  const handleSubmit = createSubmitHandler({
    state: {
      mode: state.mode,
      email: state.email,
      password: state.password,
      showPassword: state.showPassword,
      error: state.error,
    },
    setError: state.setError,
    loginMutation,
    signupMutation,
  });

  return {
    state,
    isLoading: loginMutation.isPending || signupMutation.isPending,
    handleSubmit,
    toggleShowPassword: () => state.setShowPassword((prev) => !prev),
  };
}
