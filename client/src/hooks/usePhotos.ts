import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Photo, Album } from "@shared/schema";

export function usePhotos(albumId?: string) {
  return useQuery({
    queryKey: ["photos", albumId],
    queryFn: async () => {
      const url = albumId ? `/api/photos?albumId=${albumId}` : "/api/photos";
      const res = await apiRequest("GET", url);
      const data = await res.json();
      return data.photos as Photo[];
    },
  });
}

export function useAlbums() {
  return useQuery({
    queryKey: ["albums"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/albums");
      const data = await res.json();
      return data.albums as Album[];
    },
  });
}

export function useCreatePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photoData: { objectPath: string; caption?: string; albumId?: string }) => {
      const res = await apiRequest("POST", "/api/photos", photoData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useSetPrimaryPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photoId: string) => {
      const res = await apiRequest("POST", `/api/photos/${photoId}/primary`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photoId: string) => {
      const res = await apiRequest("DELETE", `/api/photos/${photoId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (albumData: { name: string; description?: string; isPrivate?: boolean }) => {
      const res = await apiRequest("POST", "/api/albums", albumData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });
}
