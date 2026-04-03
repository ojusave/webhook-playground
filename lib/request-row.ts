import type { StoredRequest } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToRequest(row: Record<string, any>): StoredRequest {
  return {
    id: row.id,
    endpoint_id: row.endpoint_id,
    method: row.method,
    headers: row.headers,
    body: row.body,
    query_params: row.query_params,
    source_ip: row.source_ip,
    content_type: row.content_type,
    received_at:
      row.received_at instanceof Date
        ? row.received_at.toISOString()
        : String(row.received_at),
  };
}
