"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TTLSelector } from "@/components/TTLSelector";

export default function HomePage() {
  const router = useRouter();
  const [ttl, setTtl] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createEndpoint() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ttlHours: ttl }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const data = (await res.json()) as { id: string };
      router.push(`/hooks/${data.id}`);
    } catch {
      setError("Could not create endpoint. Check DATABASE_URL and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-surface-raised p-8 shadow-xl">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-content">
            Webhook Playground
          </h1>
          <p className="mt-3 text-center text-sm leading-relaxed text-content-secondary">
            Capture, inspect, and debug HTTP requests in real time.
          </p>

          <div
            className="mt-8 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-content-secondary"
            role="status"
          >
            Your data is temporary. Endpoints auto-expire based on your chosen
            TTL. All payloads are automatically deleted. No accounts, no cookies,
            no tracking.
          </div>

          <div className="mt-8">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-content-tertiary">
              Endpoint lifetime
            </p>
            <div className="flex justify-center">
              <TTLSelector value={ttl} onChange={setTtl} />
            </div>
          </div>

          {error ? (
            <p className="mt-4 text-center text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={createEndpoint}
            disabled={busy}
            className="mt-8 w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white transition hover:bg-accent-hover focus:outline-none focus-visible:shadow-focus disabled:opacity-60"
          >
            {busy ? "Creating…" : "Create Endpoint"}
          </button>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-content-tertiary">
        <p>
          Built with Next.js. Deployed on{" "}
          <Link
            href="https://render.com"
            className="text-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Render
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
