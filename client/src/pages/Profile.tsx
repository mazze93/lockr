import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { PassportProfile } from "@/components/PassportProfile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, LogOut, Shield, Star, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePhotos, useAlbums, useCreatePhoto, useSetPrimaryPhoto } from "@/hooks/usePhotos";
import { toast } from "sonner";

export default function Profile() {
  const { user, profile, isLoading: authLoading, logout } = useAuth();
  const { data: photos = [] } = usePhotos();
  const { data: albums = [] } = useAlbums();
  const createPhoto = useCreatePhoto();
  const setPrimaryPhoto = useSetPrimaryPhoto();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch("/api/object-storage/generate-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          visibility: "private",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { signedUrl, objectPath } = await response.json();

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      await createPhoto.mutateAsync({
        objectPath,
        caption: file.name,
      });

      toast.success("Photo uploaded successfully!");
      setUploadDialogOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    try {
      await setPrimaryPhoto.mutateAsync(photoId);
      toast.success("Primary photo updated!");
    } catch (error) {
      toast.error("Failed to set primary photo");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#081B3A] to-[#050f1f] pb-24">
      <div className="relative">
        <div className="absolute inset-0 h-32 bg-gradient-to-b from-[#0d2137] to-transparent" />
        <div className="relative z-10 flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-[#F8B654] tracking-wider">MY PASSPORT</h1>
          <Button 
            size="icon" 
            variant="ghost" 
            className="text-white/70 hover:text-white hover:bg-white/10"
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <PassportProfile
          profile={profile}
          photos={photos}
          albums={albums}
          isOwnProfile={true}
          onUploadPhoto={() => setUploadDialogOpen(true)}
          onSetPrimary={handleSetPrimary}
        />

        <div className="mt-8 space-y-4">
          <h2 className="text-sm font-semibold text-[#8B5A2B] uppercase tracking-wider mb-2">Account</h2>
          
          <div className="bg-[#1a0f0a]/50 border border-[#8B5A2B]/20 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div 
              className="p-4 flex items-center gap-4 hover:bg-[#8B5A2B]/10 cursor-pointer transition-colors border-b border-[#8B5A2B]/10"
              data-testid="link-privacy"
            >
              <div className="w-10 h-10 rounded-full bg-[#126D7F]/20 flex items-center justify-center text-[#126D7F]">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Privacy & Safety</h3>
                <p className="text-xs text-[#8B5A2B]">Manage your visibility</p>
              </div>
            </div>
            <div 
              className="p-4 flex items-center gap-4 hover:bg-[#8B5A2B]/10 cursor-pointer transition-colors"
              data-testid="link-membership"
            >
              <div className="w-10 h-10 rounded-full bg-[#F8B654]/20 flex items-center justify-center text-[#F8B654]">
                <Star className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Lockr+ Membership</h3>
                <p className="text-xs text-[#8B5A2B]">Upgrade for features</p>
              </div>
            </div>
          </div>

          <Button 
            variant="destructive" 
            className="w-full mt-8 rounded-xl h-12 bg-red-900/20 text-red-500 hover:bg-red-900/40 border border-red-900/50"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="bg-[#1a0f0a] border-[#8B5A2B]/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#F8B654]">Upload Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label 
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-[#8B5A2B]/30 rounded-xl cursor-pointer hover:bg-[#8B5A2B]/10 transition-colors"
            >
              {isUploading ? (
                <div className="w-12 h-12 border-2 border-[#F8B654] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-[#8B5A2B]" />
                  <span className="text-[#8B5A2B]">Click to select a photo</span>
                  <span className="text-xs text-[#8B5A2B]/60">Max 10MB, JPEG or PNG</span>
                </>
              )}
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={isUploading}
                data-testid="input-photo-upload"
              />
            </label>
          </div>
        </DialogContent>
      </Dialog>

      <NavBar />
    </div>
  );
}
