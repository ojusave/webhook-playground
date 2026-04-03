# Webhook Playground

Temporary webhook URLs to capture, inspect, and debug HTTP requests in real time — inspired by RequestBin, built for Render.

![Screenshot placeholder](https://via.placeholder.com/800x450/13161c/9aa3b2?text=Webhook+Playground)

## Deploy to Render

Infrastructure is defined in **`render.yaml`** (Blueprint):

- **Web service** — `plan: standard` (paid instance; see [Render pricing](https://render.com/pricing)).
- **Cron** — `plan: standard` (paid).
- **Render Postgres** — `plan: basic-256mb` (flexible paid tier, not `free`). Database name `webhook_playground`; **`DATABASE_URL`** is injected automatically into the web service and the cron job.
- **Migrations** — `scripts/migrate.js` runs in the web service `buildCommand`.

Steps:

1. Fork or clone this repository and push it to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New** → **Blueprint**.
3. Connect the repository. Render reads `render.yaml` at the repo root.
4. Click **Deploy Blueprint**.

Webhook URLs use the **incoming request host** (`Host`, `X-Forwarded-Host`, `X-Forwarded-Proto`), so you get correct `https://…onrender.com` links without setting a public URL env var.

Optional: set **`NEXT_PUBLIC_APP_URL`** only if you need to override (for example a custom domain).

## Local development

Running `npm run dev` on your laptop does **not** use `render.yaml`; you need a Postgres instance and **`DATABASE_URL`** yourself (for example a local Postgres install or an external URL). Copy `env.example` to `.env.local` and set `DATABASE_URL`, then:

```bash
npm install
node scripts/migrate.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional: **`NEXT_PUBLIC_APP_URL`** if the inferred URL is wrong; otherwise the app uses request headers (e.g. `http://localhost:3000`).

### Database connection issues on Render

Render Postgres expects **TLS**. The app sets `pg` SSL options automatically when `RENDER=true` (see [connecting to Render Postgres](https://render.com/docs/postgresql-creating-connecting)). If you still see connection errors, add **`DATABASE_SSL_NO_VERIFY=1`** to the web service (and cron) environment in the Render dashboard.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling (UI aligned with Render’s DDS-style patterns: surfaces, borders, accent, focus rings)
- **PostgreSQL** via the **`pg`** driver (raw SQL, no ORM)
- **Server-Sent Events (SSE)** for live request updates
- **`nanoid`** for short endpoint IDs
- **JetBrains Mono** (data) + **Inter** (UI) via `next/font`

## Data handling

- Endpoints expire after the TTL you choose (1, 6, or 24 hours).
- Stored requests are capped at **100 per endpoint** (oldest dropped when full).
- A **cron job** deletes expired endpoints and their requests hourly (`scripts/cleanup.js`).
- **No accounts**, **no cookies**, **no tracking** — the random ID in the URL is the only access control.

## License

MIT
