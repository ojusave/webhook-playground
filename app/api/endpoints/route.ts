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
    // $2 and $3 must be separate bindings: Postgres errors if $2 is used for
    // both an integer column and in "NOW() + $2 * interval" ("inconsistent types for parameter $2").
    await pool.query(
      `INSERT INTO endpoints (id, ttl_hours, expires_at)
       VALUES ($1, $2, NOW() + $3 * INTERVAL '1 hour')`,
      [id, ttlHours, ttlHours]
    );
  } catch (e) {
    console.error("POST /api/endpoints", e);
    const code =
      typeof e === "object" && e !== null && "code" in e
        ? String((e as { code?: string }).code)
        : "";
    if (code === "42P01") {
      return NextResponse.json(
        {
          error: "schema_missing",
          message:
            "Database tables are missing. On Render, check deploy logs for preDeploy (migrations). Run: node scripts/migrate.js with DATABASE_URL set.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        error: "database_error",
        message:
          "Could not use the database. On Render: confirm Postgres is linked (DATABASE_URL) and the latest deploy ran migrations (preDeploy). Locally: set DATABASE_URL, run node scripts/migrate.js.",
      },
      { status: 503 }
    );
  }

  const url = webhookUrlForEndpoint(id, req.headers);

  return NextResponse.json({ id, url });
}
