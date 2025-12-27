import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { profileAPI, locationAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, User, MapPin, Sparkles, ChevronRight, Check } from "lucide-react";

const TAGS = ["Vers", "Top", "Bottom", "Hung", "Fit", "Beard", "Smooth", "Outdoor", "Hosting", "Travel", "Discreet"];
const GENDERS = [
  { value: "masculine", label: "Masculine" },
  { value: "feminine", label: "Feminine" },
  { value: "androgynous", label: "Androgynous" },
  { value: "not_specified", label: "Not specified" },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState(1);
  const [headline, setHeadline] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("masculine");
  const [bio, setBio] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const createProfileMutation = useMutation({
    mutationFn: () => profileAPI.create({
      headline: headline.trim(),
      age: parseInt(age, 10),
      gender,
      bio: bio.trim() || undefined,
      tags: selectedTags,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      setStep(2);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to create profile");
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: (data: { latitude: number; longitude: number }) => 
      locationAPI.update({
        ...data,
        blurRadiusMeters: 200,
        ghostModeEnabled: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      setLocation("/");
    },
    onError: () => {
      setLocation("/");
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleProfileSubmit = () => {
    setError(null);
    
    if (!headline.trim()) {
      setError("Please add a headline");
      return;
    }
    
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) {
      setError("Please enter a valid age (18-99)");
      return;
    }

    createProfileMutation.mutate();
  };

  const handleLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocationMutation.mutate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setLocation("/");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const handleSkipLocation = () => {
    queryClient.invalidateQueries({ queryKey: ["auth"] });
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-midnight-grid flex flex-col items-center justify-center p-6">
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[1, 2].map(s => (
          <div
            key={s}
            className={`w-16 h-1 rounded-full transition-colors ${
              s <= step ? "bg-brand-accent-warm" : "bg-muted/30"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-secondary/20 mb-4">
              <User className="w-8 h-8 text-brand-secondary" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Your Profile</h1>
            <p className="text-muted-foreground text-sm">Tell others about yourself</p>
          </div>

          <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-5">
            {/* Headline */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Headline</label>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g., Discreet top, here for fun"
                maxLength={150}
                className="bg-muted/30 border-transparent focus:border-brand-primary"
                data-testid="input-headline"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Age</label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="18+"
                min={18}
                max={99}
                className="bg-muted/30 border-transparent focus:border-brand-primary w-24"
                data-testid="input-age"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">How do you identify?</label>
              <div className="grid grid-cols-2 gap-2">
                {GENDERS.map(g => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setGender(g.value)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                      gender === g.value
                        ? "bg-brand-primary/20 border-brand-primary text-white"
                        : "bg-muted/20 border-transparent text-muted-foreground hover:text-white"
                    }`}
                    data-testid={`button-gender-${g.value}`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Bio (optional)</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others more about you..."
                maxLength={500}
                rows={3}
                className="bg-muted/30 border-transparent focus:border-brand-primary resize-none"
                data-testid="input-bio"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">What are you into?</label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      selectedTags.includes(tag)
                        ? "bg-brand-accent-hot/20 border-brand-accent-hot text-white"
                        : "bg-muted/20 border-transparent text-muted-foreground hover:text-white"
                    }`}
                    data-testid={`button-tag-${tag}`}
                  >
                    {selectedTags.includes(tag) && <Check className="w-3 h-3 inline mr-1" />}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <Button
              onClick={handleProfileSubmit}
              disabled={createProfileMutation.isPending}
              className="w-full h-12 rounded-full bg-brand-accent-warm hover:bg-brand-accent-warm/90 text-background font-bold"
              data-testid="button-next"
            >
              {createProfileMutation.isPending ? "Saving..." : "Continue"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/20 mb-4">
            <MapPin className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Enable Location</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Allow location access to discover people nearby. Your exact location is always blurred for privacy.
          </p>

          <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4 mb-4">
            <div className="flex items-start gap-3 text-left">
              <Shield className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Location blurred to ~200m</p>
                <p className="text-xs text-muted-foreground">Your exact location is never shared</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-left">
              <Sparkles className="w-5 h-5 text-brand-accent-warm flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Ghost mode available</p>
                <p className="text-xs text-muted-foreground">Hide from map anytime</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLocationPermission}
            disabled={updateLocationMutation.isPending}
            className="w-full h-12 rounded-full bg-brand-accent-warm hover:bg-brand-accent-warm/90 text-background font-bold mb-3"
            data-testid="button-enable-location"
          >
            {updateLocationMutation.isPending ? "Getting location..." : "Enable Location"}
          </Button>

          <button
            onClick={handleSkipLocation}
            className="text-sm text-muted-foreground hover:text-white transition-colors"
            data-testid="button-skip"
          >
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
}
