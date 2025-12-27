# SafeMap – Design Tokens & Brand System

## Color Tokens

### Core Brand Colors
```css
--color-bg-app: #081B3A;          /* Midnight Indigo – secure, intimate */
--color-bg-surface: #0D234A;      /* Slightly lighter for cards/panels */
--color-bg-map: #081B3A;          /* Map canvas uses app bg */

--color-brand-primary: #126D7F;   /* Arcane Teal – tech, trust, verification */
--color-brand-secondary: #5B2D7F; /* Violet Ember – desire, ritual, community */
--color-brand-accent-warm: #F8B654;/* Candle Gold – warmth, CTA energy */
--color-brand-accent-hot: #D4548E; /* Ritual Magenta – online status, pins, attraction */
```

### Status Colors
```css
--color-status-secure: #126D7F;   /* Same as primary; 2FA verified, encrypted chat */
--color-status-online: #D4548E;   /* Ritual Magenta; user is active & discoverable */
--color-status-away: #C9D3E0;     /* Soft Smoke; user is lurking or inactive */
--color-status-warning: #F8B654;  /* Gold; pending action (e.g., verify email) */
```

### Text & UI
```css
--color-text-primary: #FFFFFF;    /* White on dark; high contrast */
--color-text-muted: #C9D3E0;      /* Soft Smoke; secondary text, hints */
--color-text-invert: #03040A;     /* Onyx; text over light backgrounds (rare) */

--color-border-subtle: #23345C;   /* Dark blue-gray; card borders, dividers */
--color-shadow-soft: rgba(0,0,0,0.35); /* Atmospheric depth */
```

## Spacing

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

## Border Radius

```css
--radius-sm: 8px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-pill: 999px;
```

## Typography

```css
--font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--font-size-body: 15px;
--font-size-label: 13px;
--font-size-heading: 22px;

--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;

--line-height-tight: 1.2;
--line-height-normal: 1.5;
```

## Elevation & Shadows

```css
--shadow-soft: 0 4px 6px rgba(0,0,0,0.35);
--shadow-card: 0 18px 45px rgba(0,0,0,0.55);
--shadow-bottom-sheet: 0 -16px 40px rgba(0,0,0,0.7);
```

## Component Tokens

### Buttons
```css
--button-primary-bg: var(--color-brand-accent-warm);   /* Gold */
--button-primary-text: var(--color-text-invert);       /* Onyx text on gold */
--button-primary-hover-bg: #E6A23A;                    /* Darker gold */

--button-secondary-bg: var(--color-brand-primary);     /* Teal */
--button-secondary-text: var(--color-text-primary);    /* White text on teal */
--button-secondary-hover-bg: #0F5968;                  /* Darker teal */
```

### Chips & Badges
```css
--chip-secure-bg: var(--color-brand-primary);          /* Teal for 2FA, encrypted */
--chip-secure-text: var(--color-text-primary);         /* White */

--chip-online-bg: var(--color-brand-accent-hot);       /* Magenta for online */
--chip-online-text: var(--color-text-primary);         /* White */
```

### Cards & Surfaces
```css
--card-bg: var(--color-bg-surface);
--card-border: var(--color-border-subtle);
--card-shadow: var(--shadow-card);
```

### Map Elements
```css
--map-pin-user-online: var(--color-brand-accent-hot);  /* Magenta for active users */
--map-pin-secure: var(--color-brand-primary);          /* Teal for 2FA verified */
--map-pin-user: var(--color-brand-secondary);          /* Violet for base users */
--map-pin-glow: rgba(210, 68, 142, 0.4);              /* Magenta glow for pulse */
```

## Usage Guidelines

### Color Application
- **Backgrounds**: Use `--color-bg-app` (default), `--color-bg-surface` (cards, panels).
- **Primary CTAs**: Use `--color-brand-accent-warm` (gold buttons).
- **Secondary CTAs**: Use `--color-brand-primary` (teal buttons).
- **Trust & Security**: Apply `--color-brand-primary` (teal) to 2FA, encryption, verified badges.
- **Status & Presence**: Use `--color-brand-accent-hot` (magenta) for online indicators, map pins.
- **Text**: Always use `--color-text-primary` (white) on dark; use `--color-text-muted` (soft smoke) for secondary.

### Spacing
- Margins between sections: `--spacing-lg` (24px)
- Padding inside cards: `--spacing-md` (16px)
- Gaps between components: `--spacing-sm` to `--spacing-md` (8–16px)

### Radius
- Buttons: `--radius-pill` (999px)
- Cards: `--radius-md` (16px)
- Inputs: `--radius-sm` (8px)

### Typography
- Headings: `--font-size-heading` (22px), `--font-weight-bold` (700)
- Body text: `--font-size-body` (15px), `--font-weight-regular` (400)
- Labels: `--font-size-label` (13px), `--font-weight-medium` (500)

## Accessibility Notes

- **Color contrast**: All text meets WCAG AA (4.5:1 minimum).
- **No color-only information**: Always pair color with icons or text.
- **Focus states**: Interactive elements get visible focus ring using `--color-brand-accent-warm`.
- **Dark mode only**: App respects queer cultural context and privacy aesthetic.
