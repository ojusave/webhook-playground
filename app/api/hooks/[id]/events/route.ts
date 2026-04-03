import { Client } from "pg";
import { pool } from "@/lib/db";
import { rowToRequest } from "@/lib/request-row";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const url = process.env.DATABASE_URL;
  if (!url) {
    return new Response("Database not configured", { status: 503 });
  }

  const check = await pool.query(
    `SELECT id FROM endpoints WHERE id = $1 AND expires_at > NOW()`,
    [id]
  );
  if (!check.rowCount) {
    return new Response("Endpoint expired or not found", { status: 410 });
  }

  const encoder = new TextEncoder();
  const listenClient = new Client({ connectionString: url });

  const timers = {
    heartbeat: null as ReturnType<typeof setInterval> | null,
    expiry: null as ReturnType<typeof setInterval> | null,
  };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          /* closed */
        }
      };

      const shutdown = async () => {
        if (timers.heartbeat) clearInterval(timers.heartbeat);
        if (timers.expiry) clearInterval(timers.expiry);
        timers.heartbeat = null;
        timers.expiry = null;
        listenClient.removeAllListeners("notification");
        await listenClient.end().catch(() => {});
      };

      const onNotify = async (msg: { channel?: string; payload?: string }) => {
        if (msg.channel !== "new_request" || !msg.payload) return;
        try {
          const payload = JSON.parse(msg.payload) as {
            endpoint_id?: string;
            request_id?: number;
          };
          if (payload.endpoint_id !== id || payload.request_id == null) return;
          const { rows } = await pool.query(
            `SELECT * FROM requests WHERE id = $1 AND endpoint_id = $2`,
            [payload.request_id, id]
          );
          const row = rows[0];
          if (!row) return;
          send(`data: ${JSON.stringify(rowToRequest(row))}\n\n`);
        } catch (e) {
          console.error("SSE notify handler", e);
        }
      };

      try {
        await listenClient.connect();
        await listenClient.query("LISTEN new_request");
        listenClient.on("notification", onNotify);

        timers.heartbeat = setInterval(() => send(":heartbeat\n\n"), 30_000);

        timers.expiry = setInterval(async () => {
          const r = await pool.query(
            `SELECT 1 FROM endpoints WHERE id = $1 AND expires_at > NOW()`,
            [id]
          );
          if (!r.rowCount) {
            await shutdown();
            try {
              controller.close();
            } catch {
              /* noop */
            }
          }
        }, 5000);
      } catch (e) {
        console.error("SSE setup", e);
        await shutdown();
        try {
          controller.close();
        } catch {
          /* noop */
        }
      }
    },
    async cancel() {
      await listenClient.end().catch(() => {});
      if (timers.heartbeat) clearInterval(timers.heartbeat);
      if (timers.expiry) clearInterval(timers.expiry);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
