import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { createEndpointId } from "@/lib/nanoid";
import { webhookUrlForEndpoint } from "@/lib/public-url";

export const dynamic = "force-dynamic";

const TTL_OPTIONS = new Set([1, 6, 24]);

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json(
      {
        error: "database_not_configured",
        message:
          "DATABASE_URL is not set. On Render, deploy with the Blueprint (render.yaml) so Render Postgres is linked. For local dev, set DATABASE_URL in .env.local (see env.example), run node scripts/migrate.js, then restart the dev server.",
      },
      { status: 503 }
    );
  }

  let ttlHours = 1;
  try {
    const body = await req.json().catch(() => ({}));
    const t = Number(body?.ttlHours);
    if (TTL_OPTIONS.has(t)) ttlHours = t;
  } catch {
    ttlHours = 1;
  }

  const id = createEndpointId();
  try {
    await pool.query(
      `INSERT INTO endpoints (id, ttl_hours, expires_at)
       VALUES ($1, $2, NOW() + $2 * INTERVAL '1 hour')`,
      [id, ttlHours]
    );
  } catch (e) {
    console.error("POST /api/endpoints", e);
    return NextResponse.json(
      {
        error: "database_error",
        message:
          "Could not connect to the database. On Render, confirm the web service has DATABASE_URL from the linked Postgres. Locally, check DATABASE_URL, that Postgres is reachable, and that migrations ran (node scripts/migrate.js).",
      },
      { status: 503 }
    );
  }

  const url = webhookUrlForEndpoint(id, req.headers);

  return NextResponse.json({ id, url });
}
