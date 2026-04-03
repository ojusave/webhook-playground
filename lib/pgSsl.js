/**
 * Render Postgres requires TLS. Node's `pg` often needs relaxed cert verification
 * (see https://render.com/docs/postgresql-creating-connecting).
 * Set DATABASE_SSL_NO_VERIFY=1 to force this for any host (e.g. odd proxies).
 */
function getPgSsl() {
  const url = process.env.DATABASE_URL || "";
  if (!url) return undefined;
  if (process.env.DATABASE_SSL_NO_VERIFY === "1") {
    return { rejectUnauthorized: false };
  }
  if (process.env.RENDER === "true") {
    return { rejectUnauthorized: false };
  }
  if (url.includes("render.com")) {
    return { rejectUnauthorized: false };
  }
  return undefined;
}

module.exports = { getPgSsl };
