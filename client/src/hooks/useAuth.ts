import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI, profileAPI, locationAPI } from "@/lib/api";
import { useLocation } from "wouter";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: authData, isLoading, error, refetch } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authAPI.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      refetch();
    },
  });

  const signupMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.signup(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      refetch();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      queryClient.clear();
      setLocation("/auth");
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: profileAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: locationAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["nearbyUsers"] });
    },
  });

  return {
    user: authData?.user ?? null,
    profile: authData?.profile ?? null,
    location: authData?.location ?? null,
    needsOnboarding: authData?.needsOnboarding ?? true,
    isAuthenticated: !!authData?.user,
    isLoading,
    error,

    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    createProfile: createProfileMutation.mutateAsync,
    updateLocation: updateLocationMutation.mutateAsync,

    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    loginError: loginMutation.error?.message,
    signupError: signupMutation.error?.message,
  };
}
