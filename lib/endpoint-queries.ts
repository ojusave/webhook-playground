import { pool } from "@/lib/db";

export type EndpointRow = {
  id: string;
  expires_at: Date;
};

export async function getEndpoint(
  id: string
): Promise<EndpointRow | undefined> {
  const { rows } = await pool.query(
    `SELECT id, expires_at FROM endpoints WHERE id = $1`,
    [id]
  );
  return rows[0] as EndpointRow | undefined;
}
