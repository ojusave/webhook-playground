import { Pool } from "pg";
import { getPgSsl } from "./pgSsl.js";

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: getPgSsl(),
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});
