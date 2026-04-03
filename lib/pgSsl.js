/**
 * Render Postgres requires TLS; node-pg needs relaxed verification for these certs.
 * This project is deployed on Render only; DATABASE_URL always points at Render Postgres.
 */
function getPgSsl() {
  if (!process.env.DATABASE_URL) return undefined;
  return { rejectUnauthorized: false };
}

module.exports = { getPgSsl };
