# Lockr (SafeMap)

## Overview

Lockr is a privacy-first, map-based social discovery and dating app targeting the LGBTQ+ community. The application features real-time location-based user discovery with a strong emphasis on security and privacy features including encrypted messaging, blurred geolocation, and mandatory authentication. Built as a full-stack TypeScript application with a React frontend and Express backend, connected to a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled using Vite
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS v4 with custom design tokens matching the SafeMap brand (Midnight Indigo theme, Arcane Teal, Candle Gold accent colors)
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for interactive elements
- **Mobile-First**: Designed for mobile with bottom navigation bar and drawer-based interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Session Management**: Express-session with MemoryStore (development) or connect-pg-simple (production)
- **Authentication**: Session-based auth with bcryptjs password hashing
- **API Design**: RESTful JSON API at `/api/*` endpoints

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` - shared between client and server
- **Key Tables**: users, profiles, locations, conversations, messages, blockedUsers
- **Migrations**: Managed via `drizzle-kit push`

### Key Features
- **Map Discovery**: Real-time map showing nearby users with privacy-aware location blurring (configurable 100m-1km radius)
- **User Profiles**: Photos, bio, tags, gender, age with verification badges
- **Messaging**: Conversation-based chat with real-time polling
- **Ghost Mode**: Hide from map while maintaining chat access
- **User Blocking**: Full blocking functionality for safety

### Project Structure
```
client/           # React frontend
  src/
    components/   # Reusable UI components
    pages/        # Route pages (MapHome, Messages, Profile, etc.)
    hooks/        # Custom React hooks for data fetching
    lib/          # Utilities, API client, mock data
server/           # Express backend
  index.ts        # Entry point with middleware setup
  routes.ts       # API route definitions
  storage.ts      # Database access layer
  db.ts           # Drizzle database connection
shared/           # Shared code between client/server
  schema.ts       # Drizzle schema definitions
```

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connected via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Frontend Libraries
- **Vaul**: Drawer component for mobile-friendly profile sheets
- **Embla Carousel**: Touch-friendly carousels
- **React Day Picker**: Date selection
- **Recharts**: Data visualization (charts)

### Build & Development
- **Vite**: Frontend bundler with HMR
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption (optional, has default for development)

## Recent Changes (Dec 31, 2025)

### Passport/Wallet Profile UI
- Added new PassportProfile component with leather texture gradient backgrounds (#2d1810 to #0d0805)
- Gold accent color (#F8B654) for branding and embossed elements
- Flipbook-style photo gallery with page-turn animations using Framer Motion
- Printed-photo styling with sepia filters and shadow effects

### Photo Album System
- Added `albums` and `photos` database tables for organized photo storage
- Added `isVerified` field to profiles schema
- Photo upload via Replit Object Storage with presigned URLs
- Primary photo selection with automatic profile update
- Album organization with privacy settings

### API Routes Added
- GET/POST /api/albums - Album management
- PATCH/DELETE /api/albums/:albumId - Album updates
- GET/POST /api/photos - Photo management
- POST /api/photos/:photoId/primary - Set primary photo
- DELETE /api/photos/:photoId - Photo deletion
- Object storage upload routes integrated