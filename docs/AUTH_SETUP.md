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

## Local DNS note (optional)

If `npm run dev` logs `querySrv ECONNREFUSED` for the Atlas SRV record even
though `nslookup -type=SRV _mongodb._tcp.<cluster>` works, Node's resolver is
refusing SRV queries (common on Windows / VPN / corporate networks). Set
`DNS_SERVERS` in `.env.local` to a resolver that answers SRV — e.g.
`DNS_SERVERS=172.16.172.10`. Applied in `lib/dns-setup.ts`; leave it **unset on
Vercel**.

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
