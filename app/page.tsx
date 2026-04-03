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
      const data = (await res.json().catch(() => ({}))) as {
        id?: string;
        message?: string;
      };
      if (!res.ok) {
        setError(
          typeof data.message === "string"
            ? data.message
            : "Could not create endpoint."
        );
        return;
      }
      if (!data.id) {
        setError("Invalid response from server.");
        return;
      }
      router.push(`/hooks/${data.id}`);
    } catch {
      setError("Could not reach the server. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="render-panel w-full max-w-lg p-8 shadow-xl">
          <h1 className="text-center text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Webhook Playground
          </h1>
          <p className="mt-2 text-center text-sm leading-relaxed text-[var(--text-secondary)]">
            Capture, inspect, and debug HTTP requests in real time.
          </p>

          <div
            className="mt-8 rounded-md border border-[var(--border-default)] bg-[var(--bg-canvas)] p-4 text-sm leading-relaxed text-[var(--text-secondary)]"
            role="status"
          >
            Your data is temporary. Endpoints auto-expire based on your chosen
            TTL. All payloads are automatically deleted. No accounts, no
            cookies, no tracking.
          </div>

          <div className="mt-8">
            <p className="mb-3 text-center render-label">Endpoint lifetime</p>
            <div className="flex justify-center">
              <TTLSelector value={ttl} onChange={setTtl} />
            </div>
          </div>

          {error ? (
            <p
              className="mt-4 text-center text-sm text-red-400/95"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={createEndpoint}
            disabled={busy}
            className="render-btn-primary mt-8 w-full"
          >
            {busy ? "Creating…" : "Create endpoint"}
          </button>
        </div>
      </main>

      <footer className="border-t border-[var(--border-default)] py-6 text-center text-xs text-[var(--text-tertiary)]">
        <p>
          Built with Next.js ·{" "}
          <Link
            href="https://render.com"
            className="text-[#79c0ff] hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Render
          </Link>
        </p>
      </footer>
    </div>
  );
}
