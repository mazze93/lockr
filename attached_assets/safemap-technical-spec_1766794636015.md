# SafeMap – Feature Specification & Technical Architecture

## Feature Matrix

### Authentication & Account Management
| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Email signup/login | ✅ | — | Required; form validation |
| 2FA (TOTP) | ✅ | — | **Mandatory on signup** |
| 2FA (Email) | — | ✅ | Optional backup method |
| Backup codes | ✅ | — | Generated on 2FA setup; critical UX |
| Device session mgmt | — | ✅ | View active sessions, sign out |
| Password reset | — | ✅ | Email-based recovery |
| Account deletion | — | ✅ | 30-day grace period |

### Discovery & Map
| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Live map display | ✅ | — | Real-time user pins, dark theme |
| User pins (color-coded) | ✅ | — | Teal=verified, magenta=online, gray=away |
| Clustering | ✅ | — | Automatic zoom clustering |
| Location blur | ✅ | — | Default ~200m, adjustable (100m–1km) |
| Filter: online only | ✅ | — | Toggle |
| Filter: 2FA verified only | ✅ | — | Toggle |
| Filter: distance radius | ✅ | — | Slider (50m–5km) |
| Ghost mode | — | ✅ | Hide from map, stay chatting |
| User search | — | ✅ | By name, username, tags |
| Favorites / saved profiles | — | ✅ | Bookmark interesting users |

### Profiles
| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Profile creation | ✅ | — | Avatar, headline, age, gender, bio, tags |
| Profile view (sheet) | ✅ | — | Bottom-sheet preview on pin tap |
| Profile edit | ✅ | — | Update bio, photos, headline, tags |
| Photo gallery | ✅ | — | Add/remove photos, set primary |
| Status indicators | ✅ | — | 2FA verified badge, online status |
| Blur photos toggle | — | ✅ | Hidden until tap to reveal |

### Messaging & Chat
| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Send/receive messages | ✅ | — | WebSocket or polling real-time |
| Conversation list | ✅ | — | Sorted by recency, unread badges |
| Chat history | ✅ | — | Scroll to load older messages |
| Typing indicator | ✅ | — | "User is typing..." |
| Photo attachment | ✅ | — | Images only, no files |
| Encryption indicator | ✅ | — | Teal lock icon + "Encrypted" label |
| E2E encryption (TweetNaCl) | ✅ | — | Client-side, no server decryption |
| Disappearing messages | — | ✅ | 1h, 24h, 7d, or never |
| Message search | — | ✅ | Search within conversation |
| Block user | ✅ | — | Hide conversations, can't message |
| Report / flag content | ✅ | — | Safety mechanism |
| Chat export | — | ✅ | Download conversation history (encrypted) |

### Privacy & Safety
| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Location blurring | ✅ | — | Adjustable radius |
| Ghost mode | — | ✅ | Hide from map, stay chatting |
| Photo blur by default | — | ✅ | Toggle in settings |
| Privacy dashboard | — | ✅ | Centralized control panel |
| Device session management | — | ✅ | View & sign out from sessions |
| Data download (export) | — | ✅ | User data as JSON |
| Account deletion | — | ✅ | 30-day grace period |
| 2FA enforcement messaging | ✅ | — | Yellow warning if user lacks 2FA |
| Encryption explainer | ✅ | — | First message explains E2E |

### Admin & Moderation (Not MVP)
| Feature | MVP | Phase 2 | Notes |
|---------|-----|---------|-------|
| Report handling | — | ✅ | Backend moderation queue |
| User bans | — | ✅ | Safety enforcement |
| Content flagging | — | ✅ | Photos, bios, etc. |
| Abuse alerts | — | ✅ | Notify admins of violations |

---

## Technical Architecture

### Frontend (Client)
```
React 18 + Vite
├── Pages (React Router)
│   ├── /auth → Sign-up, Login, 2FA
│   ├── /home → Map + navigation
│   ├── /chats → Conversation list + chat window
│   └── /settings → Profile, privacy, account
├── Components (Reusable)
│   ├── MapCanvas (Mapbox GL JS wrapper)
│   ├── ProfileSheet (Bottom sheet)
│   ├── ChatWindow (Real-time messaging)
│   ├── Button, Chip, Card, Toast (Design tokens)
│   └── Form inputs, validation
├── State Management (Context API or Zustand)
│   ├── AuthContext (user, 2FA state)
│   ├── MapContext (map state, filters, pins)
│   ├── ChatContext (conversations, messages)
│   └── PrivacyContext (ghost mode, location blur)
├── Hooks (Custom)
│   ├── useMap() → Map data, real-time updates
│   ├── useAuth() → Auth logic, 2FA
│   ├── useChat() → Messaging, E2E crypto
│   └── usePrivacy() → Settings, permissions
├── Utils
│   ├── crypto.js → TweetNaCl.js wrapper
│   ├── api.js → REST/WebSocket clients
│   ├── validators.js → Email, password, TOTP
│   └── constants.js → API endpoints, tokens
└── Styles
    └── tokens.css → All design tokens
```

### Backend (Node.js/Express on Replit)
```
Server
├── Auth
│   ├── /signup → Email, password, 2FA setup
│   ├── /login → Email, password, TOTP verification
│   ├── /verify-totp → Code validation
│   ├── /backup-codes → Generate & retrieve
│   └── /session-management → View & sign out
├── Users
│   ├── GET /users/:id → Profile data
│   ├── PUT /users/:id → Update profile
│   ├── GET /users/nearby → List users by location (blurred)
│   ├── POST /users/:id/block → Block user
│   └── POST /users/:id/report → Flag user
├── Messaging
│   ├── POST /messages → Send (store encrypted)
│   ├── GET /messages/:conversationId → Fetch history
│   ├── WebSocket → Real-time messaging
│   ├── GET /conversations → List with last message
│   └── DELETE /messages/:id → Delete (if disappearing)
├── Encryption
│   ├── POST /crypto/handshake → Key exchange init
│   ├── GET /crypto/public-key/:userId → Fetch user's public key
│   └── Verify signatures & integrity
└── Privacy
    ├── PUT /privacy/location-blur → Set blur radius
    ├── PUT /privacy/ghost-mode → Toggle
    ├── GET /sessions → Active device sessions
    ├── POST /sessions/:id/logout → Sign out device
    └── POST /export → Download user data
```

### Database (Replit Database)
```json
{
  "users": {
    "user_id": {
      "email": "user@example.com",
      "passwordHash": "bcrypt_hash",
      "profile": {
        "headline": "Discreet, vers, hosting",
        "age": 28,
        "gender": "masculine",
        "bio": "...",
        "tags": ["vers", "top", "hung"],
        "photos": [
          { "id": "photo_1", "url": "...", "isPrimary": true }
        ],
        "createdAt": "2025-01-01T00:00:00Z"
      },
      "security": {
        "totpSecret": "base32_encoded",
        "backupCodes": ["code1", "code2", ...],
        "2faEnabled": true,
        "2faMethod": "totp"
      },
      "privacy": {
        "locationBlurRadius": 200,
        "ghostModeEnabled": false,
        "photosBlurred": false,
        "lastLocationUpdate": "2025-01-01T12:00:00Z",
        "locationLat": 37.7749,
        "locationLng": -122.4194
      },
      "status": {
        "isOnline": true,
        "lastSeen": "2025-01-01T12:30:00Z",
        "is2faVerified": true
      }
    }
  },
  "conversations": {
    "convo_id": {
      "participants": ["user_a", "user_b"],
      "createdAt": "2025-01-01T10:00:00Z",
      "lastMessageAt": "2025-01-01T12:30:00Z",
      "isActive": true
    }
  },
  "messages": {
    "msg_id": {
      "conversationId": "convo_id",
      "senderId": "user_a",
      "encryptedContent": "nacl.secretbox_encrypted_blob",
      "senderPublicKey": "base64_key_for_receiver",
      "timestamp": "2025-01-01T12:30:00Z",
      "expiresAt": null,
      "isDeleted": false
    }
  },
  "sessions": {
    "session_id": {
      "userId": "user_id",
      "token": "jwt_or_random_token",
      "deviceName": "iPhone 13 Pro",
      "deviceLocation": "San Francisco, CA",
      "ipAddress": "192.168.1.1",
      "createdAt": "2025-01-01T12:00:00Z",
      "lastActiveAt": "2025-01-01T12:30:00Z",
      "expiresAt": "2025-02-01T12:00:00Z"
    }
  },
  "reports": {
    "report_id": {
      "reportedUserId": "user_b",
      "reporterUserId": "user_a",
      "reason": "inappropriate_photos",
      "details": "...",
      "createdAt": "2025-01-01T12:30:00Z",
      "status": "pending"
    }
  }
}
```

### Real-Time & Encryption Flow

#### Message Send Flow
1. **Client A** composes message in ChatWindow.
2. **Client A** generates ephemeral key pair (if not already done).
3. **Client A** encrypts message with Client B's public key + nonce (TweetNaCl.js).
4. **Client A** sends encrypted blob + metadata to `/messages` (POST).
5. **Server** stores encrypted message (server can't decrypt).
6. **Server** notifies Client B via WebSocket: "New message from Client A."
7. **Client B** fetches encrypted message (client-side decryption with Client B's private key).
8. **Client B** renders plaintext message in UI + "🔒 Encrypted" indicator.

#### Public Key Exchange
1. **On first message attempt**: Client A requests Client B's public key.
2. **Server**: Retrieves Client B's public key from user profile.
3. **Client A**: Caches key locally.
4. **Client A**: Encrypts message using cached key.
5. **Server**: Never stores private keys; only public keys for handshake.

#### Real-Time Updates (WebSocket)
- **Socket.io** for bi-directional communication.
- **Rooms**: Each user gets a personal room (`/users/{user_id}`).
- **Events**:
  - `message:new` → Notify participant of new message.
  - `user:online` → Participant came online.
  - `user:offline` → Participant went offline.
  - `map:user-moved` → Participant location updated (blurred).
  - `chat:typing` → "User is typing..."

### Deployment

- **Frontend**: Replit (Vite build) or Vercel.
- **Backend**: Replit Node.js server.
- **Database**: Replit Database (JSON).
- **Maps**: Mapbox GL JS (free tier: 50k requests/month).
- **Domain**: Custom domain (safemap.app or equivalent).

---

## API Endpoints (REST)

### Auth
```
POST /auth/signup
  body: { email, password, timezone }
  returns: { userId, 2faRequired: true, qrCode }

POST /auth/verify-2fa
  body: { userId, totp }
  returns: { sessionToken }

POST /auth/login
  body: { email, password }
  returns: { userId, 2faRequired: true }

POST /auth/backup-codes
  headers: { Authorization: sessionToken }
  returns: { codes: [8 codes] }

POST /auth/logout
  headers: { Authorization: sessionToken }
  returns: { success: true }
```

### Users
```
GET /users/nearby?lat={lat}&lng={lng}&radius=5000&filter=2fa_only
  returns: { users: [{ id, avatar, headline, distance, tags, is2faVerified }] }

GET /users/:id
  returns: { id, headline, age, gender, bio, tags, photos, is2faVerified, isOnline }

PUT /users/:id
  body: { headline, bio, tags, privacy }
  returns: { success: true, updatedFields }

POST /users/:id/photos
  body: { file (multipart) }
  returns: { photoId, url }

POST /users/:id/block
  headers: { Authorization: sessionToken }
  returns: { success: true }

POST /users/:id/report
  headers: { Authorization: sessionToken }
  body: { reason, details }
  returns: { reportId }
```

### Messages
```
POST /messages
  body: { conversationId, encryptedContent, senderPublicKey, expiresAt }
  headers: { Authorization: sessionToken }
  returns: { messageId, timestamp }

GET /conversations
  headers: { Authorization: sessionToken }
  returns: { conversations: [{ id, participantId, lastMessage, timestamp, unreadCount }] }

GET /conversations/:id/messages?offset=0&limit=50
  headers: { Authorization: sessionToken }
  returns: { messages: [{ id, senderId, encryptedContent, timestamp }] }

DELETE /messages/:id
  headers: { Authorization: sessionToken }
  returns: { success: true }
```

### Privacy
```
PUT /privacy/location-blur
  body: { blurRadiusMeters: 200 }
  headers: { Authorization: sessionToken }
  returns: { success: true }

PUT /privacy/ghost-mode
  body: { enabled: boolean }
  headers: { Authorization: sessionToken }
  returns: { success: true }

GET /sessions
  headers: { Authorization: sessionToken }
  returns: { sessions: [{ id, deviceName, location, ipAddress, lastActive }] }

POST /sessions/:id/logout
  headers: { Authorization: sessionToken }
  returns: { success: true }

POST /export
  headers: { Authorization: sessionToken }
  returns: { downloadUrl }
```

---

## Security Considerations

### Client-Side Encryption
- **Library**: TweetNaCl.js (Sodium native crypto).
- **Algorithm**: Curve25519 for key exchange, Salsa20 for encryption, Poly1305 for authentication.
- **Key Storage**: Keep in browser memory; clear on logout.
- **No Server Decryption**: Server never has access to plaintext.

### Password Storage
- **Bcrypt** with salt (min 12 rounds).
- **HTTPS only** (enforce in deployment).

### 2FA
- **TOTP** (Time-based One-Time Password).
- **Backup codes** generated on setup, stored hashed on server.
- **Seed**: Base32-encoded, shared only once.

### Sessions
- **JWT or opaque tokens** with expiration (1 month).
- **Session revocation**: User can sign out of any device.
- **Rate limiting**: Prevent brute-force attacks (5 failed logins = 15min lockout).

### Data Privacy
- **Location is blurred server-side** before client fetch (no exact coordinates in API).
- **No analytics tracking** beyond basic metrics (opt-in only).
- **No third-party integrations** (no ads, no data brokers).
- **Encrypted backups** for data export.

---

## Performance & Scalability

### Caching
- **Browser cache**: User profiles, map tiles.
- **Server-side**: Recent conversations, user locations (short TTL).

### WebSocket Management
- **Reconnection logic**: Exponential backoff.
- **Message queuing**: If offline, queue locally; sync when back online.
- **Max concurrent connections**: Monitor for stability.

### Database Optimization
- **Indexing**: userId, conversationId, timestamp for fast queries.
- **Archival**: Messages older than 90 days can be compressed or deleted.
- **Pagination**: Fetch messages in batches (50 at a time).

### Map Rendering
- **Mapbox clustering**: Built-in optimization for large marker sets.
- **Debounce**: Pan/zoom events to reduce API calls.
- **Vector tiles**: Faster rendering than raster.

---

## Testing Strategy

### Unit Tests
- Crypto functions (encrypt/decrypt, key exchange).
- Validators (email, password, TOTP).
- State management (Redux/Context).

### Integration Tests
- Auth flow (signup, 2FA, login).
- Message send/receive.
- Privacy settings updates.

### E2E Tests (Cypress/Playwright)
- Full user journeys (signup → profile → discover → message).
- Mobile responsiveness.
- Accessibility (axe-core).

### Security Tests
- Penetration testing (OWASP Top 10).
- SQL injection attempts (if using SQL later).
- XSS prevention.
- CSRF token validation.

---

## Monitoring & Analytics

### Metrics to Track
- **Sign-ups & DAU** (daily active users).
- **Map engagement** (pins viewed, filters used).
- **Message volume** (messages sent/received).
- **Error rates** (crashes, failed requests).
- **2FA adoption** (% with 2FA enabled).

### Logging
- **Error logs**: Aggregated via Sentry or similar.
- **User actions**: Non-PII events (not message content or locations).
- **Performance**: Page load times, API latency.

### Privacy-Preserving Analytics
- **Client-side only**: No third-party tracking.
- **Anonymized**: No IP addresses or user IDs in logs.
- **Opt-in**: Users can disable analytics in settings.

---

## Roadmap

### MVP (Phase 1 – Q1 2025)
- Auth + 2FA (TOTP).
- Map with user discovery.
- Profile creation & viewing.
- Messaging with E2E encryption.
- Ghost mode (UI, basic logic).

### Phase 2 (Q2 2025)
- Advanced privacy dashboard.
- Disappearing messages.
- Device session management.
- Photo blur toggle.
- Report & block improvements.
- Email 2FA as backup.

### Phase 3 (Q3 2025)
- Social features (favorites, notes on profiles).
- Message search.
- Admin moderation tools.
- Analytics dashboard.
- Mobile app (React Native or Flutter).

### Future (Post-MVP)
- Video calling (encrypted, WebRTC).
- Groups / group chats.
- STI testing status (verified badges from partner clinics).
- Community events calendar.
- Integration with LGBTQ+ health orgs.

---

**This is a living document. Update as product evolves.**
