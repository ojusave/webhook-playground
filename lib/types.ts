export type StoredRequest = {
  id: number;
  endpoint_id: string;
  method: string;
  headers: Record<string, string> | null;
  body: string | null;
  query_params: Record<string, string> | null;
  source_ip: string | null;
  content_type: string | null;
  received_at: string;
};
