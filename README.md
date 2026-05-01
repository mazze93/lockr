<p align="center">
  <img src="https://raw.githubusercontent.com/mazze93/lockr/main/docs/assets/lockr-banner.jpg" alt="LOCKR — Privacy-Respecting Gay Dating" width="100%" />
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
  <img src="https://img.shields.io/badge/CodeQL-passing-green?style=flat-square&logo=github" />
  <img src="https://img.shields.io/badge/infra-Cloudflare-orange?style=flat-square&logo=cloudflare" />
  <img src="https://img.shields.io/badge/PRs-welcome-blueviolet?style=flat-square" />
</p>

---

## What Is LOCKR?

LOCKR is a privacy-first gay dating and social app designed for men who want to explore the scene without sacrificing their safety. No data mining. No surveillance capitalism. Just encrypted, consent-respecting connections — built by queer people, for queer people.

<p align="center">
  <img src="https://raw.githubusercontent.com/mazze93/lockr/main/docs/assets/lockr-features.jpg" alt="LOCKR — Safe, Secure, and Sexy" width="100%" />
</p>

---

## Core Features

| Feature | Details |
|---|---|
| 🔒 Encrypted Chat | End-to-end encrypted — nobody reads your messages but you |
| 👤 Anonymity | Pseudonymous profiles, no phone number required |
| 📍 Proximity Discovery | See guys nearby without exposing your exact location |
| ✅ 2FA Verified | Reduces bots and bad actors at the auth layer |
| 💉 Health Badges | Vaccination status, at-home test results, PrEP info |
| 🏷️ Community Tags | Filter by vibe — Leather, Jock, Discreet, and more |
| 🏳️‍🌈 Queer Resources | Crisis support, health links, and safety tools baked in |

---

## Privacy Architecture

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

| Layer | Technology |
|---|---|
| Frontend | Vite + React (TypeScript) |
| Backend | Node/Express + Drizzle ORM |
| Database | PostgreSQL |
| Auth | 2FA session management |
| Infrastructure | Cloudflare-proxied, zero-trust network posture |
| Security Scanning | CodeQL + Dependabot + `SECURITY.md` policy |

---

## Getting Started

```bash
git clone https://github.com/mazze93/lockr.git
cd lockr
npm install
cp .env.example .env
npm run dev
```

> **Requirements:** Node 18+, PostgreSQL, a Cloudflare account for deployment

---

## Security Policy

LOCKR takes security seriously. See [`SECURITY.md`](./SECURITY.md) for responsible disclosure guidelines and our threat model.

> ⚠️ Found a vulnerability? **Do not open a public issue.** Follow the process in `SECURITY.md`.

---

## Community Standards

All contributors and users are expected to uphold:

- **Consent** — in interaction design and in real life
- **Privacy** — other users' and your own
- **Respect** — no racism, fatphobia, transphobia, or discrimination of any kind

---

## Contributing

PRs welcome. Open an issue first for major feature changes. Contribution guidelines and issue templates live in `.github/`.

---

## License

MIT — free to use, fork, and build on. Attribution appreciated.

---

<p align="center">
  Made with 🔒 + 🏳️‍🌈 by <a href="https://github.com/mazze93">Mazze LeCzzare Frazer</a>
</p>

MIT — free to use, fork, and 
