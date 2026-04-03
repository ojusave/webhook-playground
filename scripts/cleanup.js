/**
 * Deletes expired endpoints (requests CASCADE).
 * Run hourly via Render Cron.
 */
const { Client } = require("pg");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    const { rowCount } = await client.query(
      `DELETE FROM endpoints WHERE expires_at < NOW()`
    );
    console.log(`Deleted ${rowCount} expired endpoint(s).`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
