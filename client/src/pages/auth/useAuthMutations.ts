import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";

type AuthResponse = { userId: string; message: string };

export type AuthMutations = {
  loginMutation: UseMutationResult<AuthResponse, Error, void>;
  signupMutation: UseMutationResult<AuthResponse, Error, void>;
};

/** Builds auth mutation hooks with shared success/error behavior. */
export function useAuthMutations({
  email,
  password,
  onSuccess,
  onError,
}: {
  email: string;
  password: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}): AuthMutations {
  const loginMutation = useMutation<AuthResponse, Error, void>({
    mutationFn: () => authAPI.login(email, password),
    onSuccess,
    onError: (err: Error) => onError(err.message || "Login failed"),
  });

  const signupMutation = useMutation<AuthResponse, Error, void>({
    mutationFn: () => authAPI.signup(email, password),
    onSuccess,
    onError: (err: Error) => onError(err.message || "Signup failed"),
  });

  return { loginMutation, signupMutation };
}
