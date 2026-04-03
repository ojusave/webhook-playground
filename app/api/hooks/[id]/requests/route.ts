import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { rowToRequest } from "@/lib/request-row";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { rows: ep } = await pool.query(
    `SELECT id FROM endpoints WHERE id = $1 AND expires_at > NOW()`,
    [id]
  );
  if (!ep.length) {
    return NextResponse.json([]);
  }

  const { rows } = await pool.query(
    `SELECT * FROM requests WHERE endpoint_id = $1 ORDER BY received_at DESC`,
    [id]
  );

  return NextResponse.json(rows.map((r) => rowToRequest(r)));
}
