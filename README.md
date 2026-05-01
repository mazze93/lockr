<p align="center">
  <img src="docs/assets/lockr-banner.jpg" alt="LOCKR — Privacy-Respecting Gay Dating" width="100%" />
</p>

<h1 align="center">🔒 LOCKR</h1>
<p align="center">
  <strong>Privacy-Respecting Gay Dating</strong><br/>
  Encrypted. Anonymous. Built for the community.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/security-E2E%20Encrypted-teal?style=flat-square" />
  <img src="https://img.shields.io/badge/built%20for-queer%20community-purple?style=flat-square" />
</p>

---

## What Is LOCKR?

LOCKR is a privacy-first gay dating and social app designed for men who want to explore the scene without sacrificing their safety. No data mining. No surveillance capitalism. Just encrypted, consent-respecting connections.

<p align="center">
  <img src="docs/assets/lockr-features.jpg" alt="LOCKR Features — Safe, Secure, and Sexy" width="100%" />
</p>

---

## Core Features

- 🔒 **End-to-End Encrypted Chat** — Messages stay between you and him, always
- 👤 **Stay Anonymous** — No phone number required, pseudonymous profiles
- 📍 **See Guys Nearby** — Proximity-based discovery without broadcasting your exact location
- ✅ **2FA Verified Accounts** — Reduce bots and bad actors at the source
- 💉 **Health Badges** — Vaccination status, at-home test results, and queer health resources
- 🏷️ **Community Tags** — Leather, Jock, Discreet, and more — filter by vibe
- 🏳️‍🌈 **Built-In Queer Resources** — Safety links, PrEP access info, and crisis support baked in

---

## Privacy Architecture

LOCKR is built with a security-first mindset:

| Layer | Approach |
|---|---|
| Messaging | End-to-end encrypted (E2EE) |
| Identity | Pseudonymous — no real name required |
| Location | Approximate proximity only, never precise coordinates |
| Auth | 2FA enforced on verified accounts |
| Data | Minimal collection, no third-party ad tracking |
| Health Info | User-controlled badges, never stored server-side |

---

## Tech Stack

- **Frontend** — Vite + React (TypeScript)
- **Backend** — Node/Express server with Drizzle ORM
- **Database** — PostgreSQL
- **Auth** — 2FA-enforced session management
- **Infrastructure** — Cloudflare-proxied, zero-trust network posture
- **Security** — CodeQL scanning, dependency auditing, SECURITY.md policy enforced

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/mazze93/lockr.git
cd lockr

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run the dev server
npm run dev
```

---

## Security Policy

LOCKR takes security seriously. See [`SECURITY.md`](./SECURITY.md) for responsible disclosure guidelines and our threat model.

Found a vulnerability? **Do not open a public issue.** Follow the reporting process in `SECURITY.md`.

---

## Community Standards

LOCKR is built for queer people, by queer people. All contributors and users are expected to uphold:

- **Consent** — in interaction design and in real life
- **Privacy** — other users' and your own
- **Respect** — no racism, fatphobia, transphobia, or discrimination of any kind

---

## Contributing

PRs welcome. Open an issue first for major feature changes. Check `.github/` for contribution guidelines and issue templates.

---

## License

MIT — free to use, fork, and 
