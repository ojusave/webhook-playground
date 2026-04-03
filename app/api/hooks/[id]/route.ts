import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function resolveEndpoint(id: string) {
  const { rows } = await pool.query(
    `SELECT id, expires_at FROM endpoints WHERE id = $1`,
    [id]
  );
  return rows[0] as { id: string; expires_at: Date } | undefined;
}

function headersToObject(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

function queryToObject(searchParams: URLSearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

function getSourceIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

async function handleWebhook(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const endpoint = await resolveEndpoint(id);
  if (!endpoint || new Date(endpoint.expires_at) <= new Date()) {
    return NextResponse.json(
      { error: "Endpoint expired or not found" },
      { status: 410 }
    );
  }

  const method = req.method;
  let bodyText: string | null = null;
  if (method !== "GET" && method !== "HEAD") {
    try {
      bodyText = await req.text();
      if (bodyText === "") bodyText = null;
    } catch {
      bodyText = null;
    }
  }

  const headersJson = headersToObject(req.headers);
  const queryParams = queryToObject(req.nextUrl.searchParams);
  const contentType = req.headers.get("content-type");
  const sourceIp = getSourceIp(req);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: countRows } = await client.query(
      `SELECT COUNT(*)::int AS c FROM requests WHERE endpoint_id = $1`,
      [id]
    );
    const count = countRows[0]?.c ?? 0;
    if (count >= 100) {
      await client.query(
        `DELETE FROM requests WHERE id = (
          SELECT id FROM requests WHERE endpoint_id = $1 ORDER BY received_at ASC LIMIT 1
        )`,
        [id]
      );
    }
    const { rows: inserted } = await client.query(
      `INSERT INTO requests (
        endpoint_id, method, headers, body, query_params, source_ip, content_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        id,
        method,
        headersJson,
        bodyText,
        queryParams,
        sourceIp,
        contentType,
      ]
    );
    await client.query("COMMIT");

    const row = inserted[0];
    await pool.query(`SELECT pg_notify($1, $2)`, [
      "new_request",
      JSON.stringify({ endpoint_id: id, request_id: row.id }),
    ]);

    const payload = JSON.stringify({ status: "ok", message: "Webhook received" });
    if (method === "HEAD") {
      return new NextResponse(null, { status: 200 });
    }
    return new NextResponse(payload, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    client.release();
  }
}

export const GET = handleWebhook;
export const POST = handleWebhook;
export const PUT = handleWebhook;
export const PATCH = handleWebhook;
export const DELETE = handleWebhook;
export const HEAD = handleWebhook;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
    },
  });
}
