# Lockr - GitHub Copilot Instructions

## Project Overview

Lockr is a privacy-focused gay dating app with a clean map interface and end-to-end encrypted chats. This project prioritizes user safety, SOGI (Sexual Orientation/Gender Identity) data protection, and LGBTQ+ community security.

**Stack:**
- Frontend: React + TypeScript + Vite
- Backend: Node.js/Express
- Database: PostgreSQL or similar
- Encryption: Web Crypto API for E2EE messaging
- Maps: Interactive location-based discovery

## Core Mission & Values

This project serves LGBTQ+ users in contexts where privacy and safety are paramount. Every technical decision must reflect this reality:

1. **Privacy-First Mandate**: No telemetry, no tracking, no third-party data sharing
2. **SOGI Data Protection**: Treat all user identity data as high-risk sensitive information
3. **End-to-End Encryption**: Direct messages must be E2EE by default
4. **Accessibility**: ADHD-accessible design patterns throughout
5. **Secure Pride Standards**: Uncompromising vigilance protecting marginalized communities

## Security Standards

### SOGI Data Protection (Critical)

SOGI data exposure can result in harassment, violence, discrimination, or death in hostile legal environments. This is not hyperbole—it is organizational responsibility.

**Collection Rules:**
- Collect only when necessary, document business justification
- Make collection optional whenever possible
- Minimize scope (e.g., pronouns, not full identity disclosure)
- Set automatic data retention/expiration policies

**Encryption Mandate:**
- At Rest: AES-256-GCM for all SOGI data in storage
- In Transit: TLS 1.3+ for all network communication
- Key Management: Prefer client-side key derivation (user password → encryption key)
- No Plaintext Logging: Never log SOGI data in debug logs, audit trails, or error messages

**Access Control:**
- Role-Based Access Control (RBAC) with principle of least privilege
- Engineering team does NOT need production SOGI data for testing
- Audit trail: log who accessed SOGI data, when, and why
- Regular quarterly access reviews

**Third-Party Sharing:**
- Absolute prohibition: Never share, sell, or transfer SOGI data to external parties
- Even with consent: User consent may be coercive in hostile legal environments
- No cloud services that access SOGI data without explicit, limited contracts

### Privacy Protection

**No Telemetry:**
- Never suggest code implementing external telemetry, crash reporting, analytics, or user tracking
- No unencrypted data storage or transmission
- No collection of usage patterns, keystroke monitoring, or activity logs

**Identity Protection:**
- Do not enforce real-name policies for account creation or public profiles
- Allow pseudonymous accounts
- Support anonymous browsing modes where appropriate

**Client-Side Preference:**
- Prefer client-side, browser-only capabilities to minimize server-side attack surface
- Use Web Crypto API for cryptography when possible
- Keep server logic minimal

### Authentication & Security

- Session-based tokens (not permanent credentials)
- Rate limiting on authentication endpoints to prevent account enumeration/brute force
- Support account recovery mechanisms that don't rely solely on email/phone
- Implement defense in depth:
  - Input validation on client AND server
  - Content Security Policy (CSP) headers
  - HTTPS with HSTS (HTTP Strict-Transport-Security)
  - CORS configured correctly (no wildcards for sensitive endpoints)

## Code Standards

### Production-Ready Code (SWE-bench Verified Standard)

All code must be production-ready without modification:

**Functional Correctness:**
- Solves the stated problem directly
- Handles edge cases: null inputs, empty collections, network timeouts, permission errors
- Preserves system invariants
- Returns appropriate types

**Integration Reliability:**
- Works within existing workspace (package.json, tsconfig.json, vite.config.ts)
- Follows project conventions (naming, error handling, architectural patterns)
- Minimizes dependencies (use existing project libraries)
- No external setup required

**Verification Checklist:**
Before finalizing code, confirm:
- ✅ Syntax: Compiles without errors
- ✅ Dependencies: Imports only available packages
- ✅ Edge Cases: Handles null, empty, boundary conditions gracefully
- ✅ Error Handling: Errors caught, logged appropriately (no sensitive data), fail gracefully
- ✅ Unit Tests: Code would pass basic unit tests
- ✅ Project Style: Follows established conventions
- ✅ Security: No SQL injection, XSS, unencrypted transmission, credential leaks
- ✅ Integration: Works with existing codebase

### Development Commands

**Frontend (React/Vite):**
```bash
cd client
npm install          # Install dependencies
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Lint code
npm test             # Run tests (if configured)
```

**Backend (Node.js):**
```bash
cd server
npm install          # Install dependencies
npm run dev          # Development server with hot reload
npm start            # Production server
npm test             # Run tests
npm run lint         # Lint code
```

**Full Stack:**
```bash
# Run both frontend and backend concurrently
npm run dev:all      # If configured
```

### Code Patterns

**React/TypeScript:**
- Use functional components with hooks
- Prefer TypeScript strict mode
- Use proper typing (avoid `any` unless absolutely necessary)
- Component file structure: `ComponentName.tsx`, `ComponentName.module.css`
- Use React Context or state management for global state (avoid prop drilling)

**API Design:**
- RESTful conventions where appropriate
- Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- JSON request/response format
- Versioned endpoints if applicable (`/api/v1/...`)
- Input validation on all endpoints

**Error Handling:**
- Never expose stack traces to users in production
- Log errors server-side (without sensitive data)
- Return user-friendly error messages
- Handle async errors with try/catch

**Testing:**
- Write unit tests for business logic
- Use table-driven tests when possible
- Test edge cases and error conditions
- Mock external dependencies (APIs, databases)

## Accessibility & UX Standards

### Low-Cognitive-Load Design

Design for neurodivergent users (ADHD, autism spectrum):

**Core Principles:**
- Modular, single-function components (one clear responsibility)
- Predictable patterns (users anticipate behavior)
- Minimal decision overhead (sensible defaults, fewer options)
- Clear, direct language (no jargon, no metaphor, explicit intent)
- Fail gracefully (informative, actionable errors)

**Typography:**
- Sans-serif fonts: Inter, Arial, Verdana, Helvetica
- Avoid script/cursive/decorative fonts for body text
- Line spacing: 1.5-2.0 for readability
- Dark mode and low-stimulation color schemes

**Visual Design:**
- Avoid visual overload (one image per key idea)
- Consistent spacing and alignment
- High contrast: WCAG AA minimum (4.5:1 for body text)
- Break up large text blocks (3-4 sentences max per paragraph)

**Navigation:**
- Maximum 2 clicks from main page to any feature
- Clear, descriptive link text (avoid "click here")
- Multiple navigation routes (breadcrumbs, sitemap, search)
- Interactive elements behave consistently

**Sensory Considerations:**
- Provide options for reduced motion
- Avoid auto-playing media
- Allow users to control sensory input (animations, sounds, notifications)

## Decision Authority

### Tier 1: Fully Autonomous (No Escalation)
Proceed independently:
- Code architecture, module structure, interface design
- Refactoring, optimization, bug fixes
- Writing tests, validation commands, verification procedures
- Recommending libraries/frameworks (after verification)
- Creating documentation, checklists, procedural guides
- Security implementation following established Secure Pride standards

### Tier 2: Conditional Autonomy (Document, Then Act)
Document reasoning before proceeding:
- Data schema or persistence model changes
- Security, encryption, or authentication decisions
- UX, accessibility, or interface changes
- Third-party service integration
- Infrastructure or deployment changes

Use Decision Template format:
```markdown
**Decision:** [Brief title]
**Context:** [Problem and constraints]
**Options Considered:** [List with pros/cons]
**Decision:** [Chosen option and reasoning]
**Rationale:** [Alignment with Secure Pride values, trade-offs, risks mitigated]
```

### Tier 3: Requires Explicit Approval (Escalate)
Wait for explicit confirmation:
- SOGI data handling decisions
- External system access requests (credentials, API keys)
- Third-party data sharing integrations
- Policy or legal interpretation questions
- Organizational direction decisions
- Deviation from security standards

## Repository Structure

```
Lockr/
├── .github/                    # GitHub configuration
│   └── copilot-instructions.md # This file
├── client/                     # React frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── styles/             # Global styles
│   │   └── utils/              # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Node.js backend
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   └── utils/              # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── shared/                     # Shared code between client/server
├── script/                     # Build/deployment scripts
└── attached_assets/            # Static assets
```

## Key Guidelines

1. **Follow privacy-first principles in all code**
2. **Prioritize SOGI data protection above all else**
3. **Write production-ready code that works immediately**
4. **Design for ADHD-accessible patterns**
5. **Test before suggesting** - verify capabilities exist
6. **Document significant decisions** using decision template
7. **Escalate when handling SOGI data** or security-critical decisions
8. **Maintain existing code structure** and conventions
9. **Minimize attack surface** - prefer client-side solutions
10. **Never compromise on encryption** or data protection

## Error Recovery

When builds fail or suggestions don't work:

1. **Analyze immediately**: Read error messages, stack traces, logs
2. **Identify root cause**: Missing dependency? Configuration error? Version incompatibility?
3. **Propose mindful fix**: Address underlying problem, not symptom
4. **Provide recovery steps**: Exact commands and verification checklist
5. **Document the learning**: Update docs so error doesn't repeat

## Contact & Contribution

For questions about Secure Pride standards, see the main [Secure Pride Copilot Instructions](https://github.com/SecurePride/copilot-instructions).

**Project Maintainer:** @mazze93  
**Organization:** Secure Pride  
**Mission:** Privacy-first cybersecurity for LGBTQ+ communities

---

*These instructions reflect the Secure Pride Stonewall Standard: uncompromising vigilance protecting marginalized communities.*
