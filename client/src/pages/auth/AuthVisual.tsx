import { Shield } from "lucide-react";

const AUTH_IMAGE = {
  alt: "",
  src: "/images/lockr-lockers.svg",
};

/** Renders the Lockr branding header and tagline. */
export function AuthHeader() {
  return (
    <div className="text-center lg:text-left mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-white/10 mb-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent" />
        <Shield className="w-10 h-10 text-brand-primary" />
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Lockr</h1>
      <p className="text-muted-foreground text-sm">Map. Connect. Stay Private.</p>
    </div>
  );
}

/** Renders the background artwork and overlay for legibility. */
export function AuthBackground() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <img
        src={AUTH_IMAGE.src}
        alt={AUTH_IMAGE.alt}
        className="h-full w-full object-contain sm:object-cover sm:object-center bg-black/40"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-background/70" />
    </div>
  );
}
