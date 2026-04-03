import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { createEndpointId } from "@/lib/nanoid";
import { webhookUrlForEndpoint } from "@/lib/public-url";

export const dynamic = "force-dynamic";

const TTL_OPTIONS = new Set([1, 6, 24]);

export async function POST(req: Request) {
  let ttlHours = 1;
  try {
    const body = await req.json().catch(() => ({}));
    const t = Number(body?.ttlHours);
    if (TTL_OPTIONS.has(t)) ttlHours = t;
  } catch {
    ttlHours = 1;
  }

  const id = createEndpointId();
  await pool.query(
    `INSERT INTO endpoints (id, ttl_hours, expires_at)
     VALUES ($1, $2, NOW() + $2 * INTERVAL '1 hour')`,
    [id, ttlHours]
  );

  const url = webhookUrlForEndpoint(id, req.headers);

  return NextResponse.json({ id, url });
}
