import { queryClient } from "./queryClient";

const API_BASE = "/api";

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signup: (email: string, password: string) =>
    fetchAPI<{ userId: string; message: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    fetchAPI<{ userId: string; message: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    fetchAPI<{ message: string }>("/auth/logout", { method: "POST" }),

  getMe: () =>
    fetchAPI<{
      user: { id: string; email: string; isOnline: boolean; lastSeenAt: string };
      profile: any | null;
      location: { latitude: number; longitude: number; blurRadiusMeters: number; ghostModeEnabled: boolean } | null;
      needsOnboarding: boolean;
    }>("/auth/me"),
};

// Profile API
export const profileAPI = {
  create: (data: { headline: string; age: number; gender: string; bio?: string; tags?: string[] }) =>
    fetchAPI<{ profile: any }>("/profile", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  get: (userId: string) =>
    fetchAPI<{ profile: any; isOnline: boolean }>(`/profile/${userId}`),
};

// Location API
export const locationAPI = {
  update: (data: { latitude: number; longitude: number; blurRadiusMeters?: number; ghostModeEnabled?: boolean }) =>
    fetchAPI<{ location: any }>("/location", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getNearbyUsers: (latitude: number, longitude: number, radius: number = 5000) =>
    fetchAPI<{ users: any[] }>(`/users/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`),
};

// Conversations API
export const conversationAPI = {
  getAll: () =>
    fetchAPI<{ conversations: any[] }>("/conversations"),

  create: (otherUserId: string) =>
    fetchAPI<{ conversation: any }>("/conversations", {
      method: "POST",
      body: JSON.stringify({ otherUserId }),
    }),

  getMessages: (conversationId: string, limit = 50, offset = 0) =>
    fetchAPI<{ messages: any[] }>(`/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`),

  sendMessage: (conversationId: string, content: string) =>
    fetchAPI<{ message: any }>(`/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};

// Blocking API
export const blockingAPI = {
  block: (userId: string) =>
    fetchAPI<{ message: string }>(`/users/${userId}/block`, { method: "POST" }),

  unblock: (userId: string) =>
    fetchAPI<{ message: string }>(`/users/${userId}/block`, { method: "DELETE" }),

  getBlocked: () =>
    fetchAPI<{ blockedUsers: any[] }>("/blocked"),
};
