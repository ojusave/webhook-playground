# Webhook Playground

Temporary webhook URLs to capture, inspect, and debug HTTP requests in real time — inspired by RequestBin, built for Render.

![Screenshot placeholder](https://via.placeholder.com/800x450/13161c/9aa3b2?text=Webhook+Playground)

## Deploy to Render

1. Fork or clone this repository and push it to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New** → **Blueprint**.
3. Connect the repository. Render detects `render.yaml` at the repo root.
4. Click **Deploy Blueprint**. Render provisions the web service, PostgreSQL database, and hourly cleanup cron job.

Webhook URLs use the **incoming request host** (`Host`, `X-Forwarded-Host`, `X-Forwarded-Proto`), so you get correct `https://…onrender.com` links **without** setting any public URL env var after deploy.

Optional: set **`NEXT_PUBLIC_APP_URL`** only if you need to override (for example a custom domain that should appear instead of the default Render hostname).

No manual database setup is required: migrations run as part of the web service build.

## Local development

```bash
npm install
```

Create a PostgreSQL database locally and set:

```bash
export DATABASE_URL="postgres://user:pass@localhost:5432/webhook_playground"
```

Optional: **`NEXT_PUBLIC_APP_URL`** if you must force a specific base URL; otherwise the app infers `http://localhost:3000` from request headers during `npm run dev`.

Run migrations, then the dev server:

```bash
node scripts/migrate.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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
