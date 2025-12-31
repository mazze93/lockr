import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Camera, Plus, Star, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile, Photo, Album } from "@shared/schema";

interface PassportProfileProps {
  profile: Profile;
  photos: Photo[];
  albums: Album[];
  isOwnProfile?: boolean;
  onUploadPhoto?: () => void;
  onSetPrimary?: (photoId: string) => void;
}

export function PassportProfile({ 
  profile, 
  photos, 
  albums, 
  isOwnProfile = false,
  onUploadPhoto,
  onSetPrimary
}: PassportProfileProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(photos.length / 2));

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const primaryPhoto = photos.find(p => p.isPrimary) || photos[0];
  const currentPhotos = photos.slice(currentPage * 2, currentPage * 2 + 2);

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <motion.div 
        className="relative"
        initial={{ rotateY: -5 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div 
          className="rounded-xl overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(145deg, #2d1810 0%, #1a0f0a 50%, #0d0805 100%)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          }}
        >
          <div 
            className="p-1"
            style={{
              background: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(139, 90, 43, 0.15) 4px, rgba(139, 90, 43, 0.15) 5px)"
            }}
          >
            <div 
              className="rounded-lg overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #f5e6d3 0%, #e8d5b7 100%)",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div className="relative border-b-4 border-[#8B5A2B]/30" style={{ background: "linear-gradient(180deg, #1a3a5c 0%, #0d2137 100%)" }}>
                <div className="absolute inset-0 opacity-20" style={{ 
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F8B654' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }} />
                
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#F8B654]" />
                    <span className="text-[#F8B654] font-bold tracking-[0.2em] text-sm">LOCKR</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {profile.isVerified && (
                      <div className="flex items-center gap-1 text-[#126D7F]">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center pb-4">
                  <h2 
                    className="text-2xl font-bold tracking-[0.15em] uppercase"
                    style={{ 
                      color: "#F8B654",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(248, 182, 84, 0.3)"
                    }}
                  >
                    Member ID
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex gap-4">
                  <div className="relative">
                    <div 
                      className="w-28 h-36 rounded-lg overflow-hidden border-4 border-[#8B5A2B]/50"
                      style={{
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)"
                      }}
                    >
                      {primaryPhoto ? (
                        <img 
                          src={primaryPhoto.objectPath} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          style={{ filter: "sepia(10%) contrast(105%)" }}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#d4c4a8] flex items-center justify-center">
                          {isOwnProfile ? (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={onUploadPhoto}
                              className="text-[#8B5A2B] hover:text-[#6B4423]"
                            >
                              <Camera className="w-8 h-8" />
                            </Button>
                          ) : (
                            <Camera className="w-8 h-8 text-[#8B5A2B]/50" />
                          )}
                        </div>
                      )}
                    </div>
                    {isOwnProfile && primaryPhoto && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onUploadPhoto}
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#F8B654] text-white hover:bg-[#e5a347] shadow-lg"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#8B5A2B]/70">Name</p>
                      <p 
                        className="font-bold text-xl text-[#1a0f0a] tracking-wide"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {profile.headline}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#8B5A2B]/70">Age</p>
                        <p className="font-semibold text-[#1a0f0a]">{profile.age}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#8B5A2B]/70">Type</p>
                        <p className="font-semibold text-[#1a0f0a] capitalize">{profile.gender}</p>
                      </div>
                    </div>
                    {profile.tags && profile.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {profile.tags.slice(0, 3).map((tag, i) => (
                          <span 
                            key={i}
                            className="px-2 py-0.5 bg-[#8B5A2B]/10 text-[#6B4423] text-[10px] rounded-full border border-[#8B5A2B]/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {profile.bio && (
                  <div className="pt-2 border-t border-[#8B5A2B]/20">
                    <p className="text-[10px] uppercase tracking-wider text-[#8B5A2B]/70 mb-1">Bio</p>
                    <p className="text-sm text-[#1a0f0a]/80 italic" style={{ fontFamily: "Georgia, serif" }}>
                      "{profile.bio}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {photos.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 
                className="text-lg font-bold text-[#F8B654] tracking-wider"
                style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
              >
                Photo Album
              </h3>
              {isOwnProfile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onUploadPhoto}
                  className="text-[#F8B654] hover:text-[#e5a347] hover:bg-[#F8B654]/10"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              )}
            </div>

            <div 
              className="relative rounded-xl overflow-hidden p-4"
              style={{
                background: "linear-gradient(145deg, #2d1810 0%, #1a0f0a 100%)",
                boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="text-[#F8B654] hover:bg-[#F8B654]/10 disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-xs text-[#8B5A2B]">
                  {currentPage + 1} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextPage}
                  disabled={currentPage >= totalPages - 1}
                  className="text-[#F8B654] hover:bg-[#F8B654]/10 disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="grid grid-cols-2 gap-3"
                >
                  {currentPhotos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group"
                      style={{
                        background: "#f5e6d3",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4), 2px 2px 0 rgba(139, 90, 43, 0.3)"
                      }}
                      whileHover={{ scale: 1.02, rotate: 1 }}
                      onClick={() => isOwnProfile && onSetPrimary?.(photo.id)}
                    >
                      <div className="absolute inset-2 rounded overflow-hidden">
                        <img 
                          src={photo.objectPath} 
                          alt="Photo" 
                          className="w-full h-full object-cover"
                          style={{ filter: "sepia(5%) contrast(102%)" }}
                        />
                      </div>
                      {photo.isPrimary && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#F8B654] flex items-center justify-center shadow-lg">
                          <Star className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}
                      {isOwnProfile && !photo.isPrimary && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs">Set as Primary</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {currentPhotos.length === 1 && isOwnProfile && (
                    <motion.div
                      className="aspect-[3/4] rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-[#8B5A2B]/30 flex items-center justify-center"
                      style={{ background: "rgba(139, 90, 43, 0.1)" }}
                      whileHover={{ scale: 1.02 }}
                      onClick={onUploadPhoto}
                    >
                      <Plus className="w-8 h-8 text-[#8B5A2B]/50" />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {photos.length === 0 && isOwnProfile && (
          <motion.div
            className="mt-6 rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-[#8B5A2B]/30"
            style={{ background: "rgba(139, 90, 43, 0.1)" }}
            whileHover={{ scale: 1.02 }}
            onClick={onUploadPhoto}
          >
            <Camera className="w-12 h-12 text-[#8B5A2B]/50 mx-auto mb-2" />
            <p className="text-[#8B5A2B] font-medium">Add your first photo</p>
            <p className="text-[#8B5A2B]/60 text-sm">Build your photo album</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
