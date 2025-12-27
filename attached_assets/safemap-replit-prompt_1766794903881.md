# SafeMap – Replit Build Prompt

**Use this prompt directly in Replit AI or Claude to begin development.**

---

## PROJECT BRIEFING

PROJECT: **SafeMap** – Privacy-First Map-Based Gay Dating & Hookup App

### Positioning
SafeMap combines Sniffies' elegant, real-time map-first experience with Grindr's user density and discovery, but built from the ground up for **privacy, security, and dignity** of queer men. No data harvesting. No location tracking. Only encrypted conversations. 2FA mandatory on signup. This is for men and masc-aligned folks who want to hook up without surveillance.

### Market Context
- Global LGBTQ+ dating app market: $2B (2025), projected 15% CAGR to $6B by 2033.
- Gay men segment: ~$400M (2024) → $1B (2035); fastest-growing is privacy + security features.
- **Competitive gaps**: 
  - Grindr: location leaks, data sales, corporate bloat.
  - Tinder: heteronormative defaults.
  - Sniffies: web-only, no safety verification, limited features.
- **SafeMap's edge**: E2E encrypted messaging + mandatory 2FA + blurred geolocation + ghost mode + device session management.
- **User psychology**: "I want to be seen, not tracked. I want to connect, not be sold."

---

## DESIGN TOKENS (Single Source of Truth)

All colors, spacing, and typography defined here. Use these everywhere—no hardcoded values.

### Colors
```
--color-bg-app: #081B3A;          [Midnight Indigo – app background]
--color-bg-surface: #0D234A;      [Lighter indigo for cards/panels]
--color-brand-primary: #126D7F;   [Arcane Teal – trust, verification]
--color-brand-secondary: #5B2D7F; [Violet Ember – desire, community]
--color-brand-accent-warm: #F8B654;[Candle Gold – CTAs, warmth]
--color-brand-accent-hot: #D4548E; [Ritual Magenta – online, attraction]
--color-text-primary: #FFFFFF;    [White text on dark]
--color-text-muted: #C9D3E0;      [Soft Smoke – secondary text]
--color-text-invert: #03040A;     [Onyx – text on light]
--color-border-subtle: #23345C;   [Dark borders]
--color-status-secure: #126D7F;   [2FA verified, encrypted]
--color-status-online: #D4548E;   [User is active]
--color-status-away: #C9D3E0;     [User is inactive]
--color-status-warning: #F8B654;  [Pending action]
```

### Spacing
```
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
```

### Radius & Typography
```
--radius-sm: 8px
--radius-md: 16px
--radius-lg: 24px
--radius-pill: 999px
--font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif
--font-size-body: 15px
--font-size-label: 13px
--font-size-heading: 22px
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-bold: 700
```

---

## COPY TONE & CULTURAL COMPETENCE

### Core Messaging
- **Affirming**: "Your safety. Your privacy. Your rules."
- **Sex-positive**: Use "hookup," "meet," "connect"—not euphemisms.
- **Safety as empowerment, not paternalism**: "2FA keeps your business *your* business."
- **Gender-open**: Profile types = Masculine, Feminine, Androgynous, Not specified.
- **Queer-centered**: Acknowledge context—doxxing, outing, discrimination. Privacy is a justice issue.

### Microcopy Examples (Use Throughout)
- "Turn on 2FA: Keep your hookups your business."
- "Location blurred to ~200m for your safety. [Learn more]"
- "Your messages are end-to-end encrypted. We can't read them."
- "Ghost mode: Hide from map, stay in chats."
- "Blue checkmark = 2FA verified + real photo."
- "⚠️ This user hasn't enabled 2FA. [Learn why that matters]"

### Hero Copy
> "**Map. Connect. Stay Private.**
> 
> Real-time hookup discovery with the privacy you deserve. 2FA mandatory. Messages encrypted. Location blurred. Ghost mode built-in. No data harvesting, no bullshit—just safe, discreet connections."

---

## CORE SCREENS (Build Order)

### Phase 1: Auth + Map + Discovery
1. **Sign-up & Login**
   - Email → Password → 2FA TOTP setup (mandatory) → Profile basics
   - Backup codes generated & saved
   - Copy emphasizes: "2FA protects your identity."

2. **Map View (Homepage)**
   - Dark canvas, indigo-to-violet gradient
   - User's own pin: Glowing teal ring, pulsing, labeled "YOU"
   - Other pins: Color-coded (teal if 2FA verified, magenta if online, gray if away)
   - Tap pin → bottom sheet with profile preview
   - Controls: Filters (online, distance, 2FA only), ghost mode toggle, location precision slider
   - Real-time updates via WebSocket

3. **Profile Sheet (Bottom Sheet)**
   - Avatar, headline, age/distance/tags, bio
   - Status chips: "✅ 2FA verified" and "🔒 Encrypted chats"
   - CTAs: "Message" (primary, gold), "Block" (secondary), "Report" (tertiary)
   - No exact addresses, no last-seen, no device info

### Phase 2: Messaging & 2FA
4. **Chat View**
   - Left panel: Conversation list (sorted by recency, unread badges)
   - Center: Message history with encryption indicator (teal lock)
   - Header: Name, online status, 2FA badge, "Encrypted" label
   - Features: Disappearing messages toggle, photo attachment, typing indicator
   - Security notice: "🔒 Your messages are end-to-end encrypted. Only you & them can read this."
   - Yellow warning if user hasn't enabled 2FA

5. **2FA Setup Flow**
   - QR code for TOTP (Google Authenticator, Authy, etc.)
   - Manual key entry fallback
   - Test code validation before proceeding
   - Generate & display backup codes (critical UX—user must save)
   - Success state: "✅ 2FA enabled via TOTP"

### Phase 3: Privacy & Polish
6. **Privacy Dashboard**
   - Location blur slider (100m–5km, default ~200m)
   - Ghost mode toggle with explanation
   - Photo visibility toggle (blur by default)
   - Active device sessions (device name, IP, location blur, sign-out button)
   - 2FA management (status, regenerate codes)
   - Data download & account deletion (30-day grace period)

7. **Polish & Responsiveness**
   - Toast notifications (success, warning, error)
   - Loading states (skeleton screens or spinners in teal)
   - Error handling (clear messages, retry buttons)
   - Mobile responsive (bottom nav: Map, Chats, Profile)
   - Dark mode only

---

## TECHNICAL STACK

- **Frontend**: React 18 + Vite
- **Styling**: CSS variables (leverage all tokens!) + plain CSS or Tailwind
- **Database**: Replit Database (JSON-based)
- **Maps**: Mapbox GL JS or Leaflet + OpenStreetMap
- **Real-time**: Socket.io for chat
- **Encryption**: TweetNaCl.js (client-side E2E)
- **Auth**: TOTP via speakeasy/otplib + token-based sessions

---

## COMPONENT STRUCTURE

```
SafeMap/
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapCanvas.jsx
│   │   │   ├── UserPin.jsx
│   │   │   └── MapControls.jsx
│   │   ├── Auth/
│   │   │   ├── SignUp.jsx
│   │   │   ├── TOTP2FA.jsx
│   │   │   └── PrivacyConsent.jsx
│   │   ├── Profile/
│   │   │   ├── ProfileSheet.jsx
│   │   │   ├── ProfileEdit.jsx
│   │   │   └── PrivacyDashboard.jsx
│   │   ├── Chat/
│   │   │   ├── ConversationList.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   └── MessageInput.jsx
│   │   └── Common/
│   │       ├── Button.jsx
│   │       ├── Chip.jsx
│   │       ├── Card.jsx
│   │       └── Toast.jsx
│   ├── hooks/
│   │   ├── useMap.js
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   └── usePrivacy.js
│   ├── lib/
│   │   ├── crypto.js
│   │   ├── api.js
│   │   └── constants.js
│   ├── styles/
│   │   └── tokens.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

---

## BUILD ROADMAP (For Replit AI)

**Phase 1 (MVP)**: Auth + Map + Profile
1. Set up React + Vite. Create routing (Home, Auth, Settings).
2. Build sign-up & login forms with email validation.
3. Design components using tokens.css. Style all UI with CSS variables.
4. Build MapCanvas. Display 5 test users as pins (teal, magenta, gray).
5. Add map controls (filters, ghost mode toggle).
6. Build ProfileSheet (bottom sheet). Show test profile data.

**Phase 2**: Messaging & 2FA
7. Implement TOTP 2FA setup. Generate backup codes. Show clear UI.
8. Build ChatWindow & ConversationList. Mock messages.
9. Add Socket.io for real-time messaging to Replit Database.
10. Implement client-side E2E encryption (TweetNaCl.js).

**Phase 3**: Privacy & Polish
11. Build PrivacyDashboard with toggles & session management.
12. Add toast notifications, loading states, error handling.
13. Test responsive design (mobile, tablet, desktop).
14. Deploy to Replit.

---

## KEY IMPLEMENTATION NOTES

### Design
- **Dark mode only** (privacy aesthetic, queer cultural context).
- **No gradients on text** (readability).
- **Large touch targets** (min 44px height for buttons).
- **Accessibility**: WCAG AA contrast (4.5:1), keyboard nav, semantic HTML.

### Micro-interactions
- Map pin pulse: Teal, 1.5s loop.
- Buttons: Darken on hover, scale on active.
- Bottom sheet: Slide up with spring ease, swipe to dismiss.
- Disappearing messages: Show countdown timer.

### Encryption
- E2E via TweetNaCl.js on client.
- Keys exchanged via secure handshake.
- No server-side decryption.
- **Make it visible** in UI (not hidden).

### 2FA
- **Mandatory on signup**.
- Email or TOTP (TOTP preferred).
- Backup codes generated, displayed, must be saved.
- Login flow: Email → Password → TOTP code.

---

## SUCCESS CRITERIA (MVP)

✅ Auth works (sign-up, login, 2FA setup)
✅ Map displays test users; real-time movement visible
✅ Tapping a pin shows profile sheet with message CTA
✅ All UI uses design tokens (no hardcoded colors)
✅ Copy is sex-positive, affirming, privacy-focused
✅ Mobile responsive (iPhone, iPad, desktop)
✅ Accessibility baseline met (contrast, keyboard nav)

---

## Start Here

1. Create a new Replit project (React + Vite).
2. Create `src/styles/tokens.css` with all design tokens.
3. Prompt: "Set up a basic React app with three pages (Home, Auth, Settings) and routing."
4. Continue with Phase 1 builds (auth, map, profile).
5. Test after each step. Iterate.

**This is not just a dating app—this is a statement. Build it thoughtfully.**
