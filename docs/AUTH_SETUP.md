# Auth & environment setup

ResumeAI uses **NextAuth (Auth.js v5)** with **Google OAuth** and **email +
password** (bcrypt), backed by MongoDB. Login is brute-force rate-limited
(5 attempts / 15 min per email+IP) and AI generation is rate-limited
(30 / hour per user) — both stored in Mongo, no extra infrastructure.

## Environment variables

Copy `.env.local.example` → `.env.local` and fill in:

| Variable             | Where to get it                                                        |
| -------------------- | --------------------------------------------------------------------- |
| `AUTH_SECRET`        | `npx auth secret` (or `openssl rand -base64 32`)                      |
| `AUTH_GOOGLE_ID`     | Google Cloud Console → APIs & Services → Credentials → OAuth client ID |
| `AUTH_GOOGLE_SECRET` | same OAuth client                                                      |
| `MONGODB_URL`        | MongoDB Atlas connection string                                       |
| `GEMINI_API_KEY`     | Google AI Studio API key                                              |

### Google OAuth

Create an OAuth 2.0 Client (type: Web application) and add these **Authorized
redirect URIs**:

```
http://localhost:3000/api/auth/callback/google
https://resume-ai-app.vercel.app/api/auth/callback/google
```

### Vercel

Add `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `MONGODB_URL`,
`GEMINI_API_KEY` to the project's Environment Variables. NextAuth auto-detects
the deployment URL; set `AUTH_URL=https://resume-ai-app.vercel.app` only if
callbacks misbehave behind a proxy.

## MongoDB connection note

If Node fails to resolve the Atlas SRV record locally (`querySrv ECONNREFUSED`)
even though `nslookup` works — common on Windows / VPN / corporate networks —
use a non-SRV connection string instead: Atlas → Connect → Drivers → version
"2.2.12 or earlier" gives a `mongodb://host1,host2,host3/...` URL with explicit
shard hosts and `replicaSet=`. It needs no SRV lookup and works everywhere.

## Code map

- `auth.ts` / `auth.config.ts` — NextAuth config (edge-safe split for middleware).
- `app/api/auth/[...nextauth]/route.ts` — auth route handlers.
- `lib/auth.ts` — `getCurrentUserId()` / `requireUserId()` (provider-agnostic seam).
- `lib/mongodb.ts` — native MongoClient for the adapter + credentials.
- `lib/rateLimit.ts` — Mongo-backed limiter (login + AI).
- `lib/actions/auth.actions.ts` — credentials sign-up.
- `middleware.ts` — NextAuth route protection.

## Security note

Server actions in `lib/actions/resume.actions.ts` derive the caller from the
session and enforce ownership (`assertResumeOwner`) — never trusting a
client-supplied `userId`. Resume **view** pages remain public by design
(share-by-URL).
