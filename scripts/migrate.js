/**
 * Runs schema migrations. Invoked from Render preDeployCommand (see render.yaml).
 */
const { Client } = require("pg");
const { getPgSsl } = require("../lib/pgSsl.js");

const sql = `
CREATE TABLE IF NOT EXISTS endpoints (
  id TEXT PRIMARY KEY,
  ttl_hours INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  endpoint_id TEXT NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  headers JSONB,
  body TEXT,
  query_params JSONB,
  source_ip TEXT,
  content_type TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_requests_endpoint_id ON requests(endpoint_id);
CREATE INDEX IF NOT EXISTS idx_requests_received_at ON requests(endpoint_id, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_endpoints_expires_at ON endpoints(expires_at);
`;

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error(
      "DATABASE_URL is not set. Link Render Postgres to this service in the Blueprint."
    );
    process.exit(1);
  }
  const client = new Client({ connectionString: url, ssl: getPgSsl() });
  await client.connect();
  try {
    await client.query(sql);
    console.log("Migrations applied.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
