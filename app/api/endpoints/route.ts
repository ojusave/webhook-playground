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
          "DATABASE_URL is not set. Link Render Postgres to this web service (Blueprint render.yaml).",
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
            "Database tables are missing. Check the deploy log: preDeployCommand must complete (Migrations applied.).",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        error: "database_error",
        message:
          "Could not use the database. Confirm Postgres is linked and the latest deploy’s preDeploy step succeeded.",
      },
      { status: 503 }
    );
  }

  const url = webhookUrlForEndpoint(id);

  return NextResponse.json({ id, url });
}
