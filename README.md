# Webhook Playground

Temporary webhook URLs to capture, inspect, and debug HTTP requests in real time, inspired by RequestBin. **Designed to run on [Render](https://render.com) only** (Blueprint + Render Postgres).

![Screenshot placeholder](https://via.placeholder.com/800x450/13161c/9aa3b2?text=Webhook+Playground)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ojusave/webhook-playground)

One click: provisions **web service**, **Render Postgres**, and **cron** from [`render.yaml`](./render.yaml). Forks: change the `repo=` URL or set `NEXT_PUBLIC_BLUEPRINT_REPO_URL` when building so the landing-page button matches your GitHub repo.

## Deploy (manual)

Infrastructure is in **`render.yaml`**:

- **Web service:** `plan: standard`
- **Cron:** `plan: standard`, hourly cleanup
- **Render Postgres:** `plan: basic-256mb`; **`DATABASE_URL`** is injected into the web service and cron
- **Migrations:** `preDeployCommand: node scripts/migrate.js` (runs when `DATABASE_URL` is available)

Or: [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** → connect this repo → **Deploy**.

The platform sets **`RENDER_EXTERNAL_URL`** and related vars automatically ([default environment variables](https://render.com/docs/environment-variables)); the app uses that for full webhook URLs. Optional: **`NEXT_PUBLIC_APP_URL`** in the dashboard if you use a **custom domain** and want that host in links.

### Troubleshooting

- **TLS:** Postgres connections use TLS with settings appropriate for Render Postgres (`lib/pgSsl.js`).
- **Missing tables:** Open the deploy log and confirm **preDeploy** printed `Migrations applied.`
- **Wrong URL in UI:** Ensure you’re on the live service URL; set `NEXT_PUBLIC_APP_URL` if you use a custom domain.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- **PostgreSQL** via **`pg`** (raw SQL)
- **SSE** for live updates
- **`nanoid`** for endpoint IDs

## Data handling

- TTL: 1 / 6 / 24 hours; max **100** requests per endpoint; hourly cron deletes expired rows.
- **No accounts**, **no cookies**, **no tracking**; URL secrecy only.

## License

MIT
