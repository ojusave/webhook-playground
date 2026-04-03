"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { StoredRequest } from "@/lib/types";
import { CopyButton } from "./CopyButton";
import { CountdownTimer } from "./CountdownTimer";
import { EmptyState } from "./EmptyState";
import { ExpiredState } from "./ExpiredState";
import { RequestCard } from "./RequestCard";

export function Dashboard({
  endpointId,
  webhookUrl,
  expiresAtIso,
}: {
  endpointId: string;
  webhookUrl: string;
  expiresAtIso: string;
}) {
  const [requests, setRequests] = useState<StoredRequest[]>([]);
  const [expired, setExpired] = useState(false);
  const [testBusy, setTestBusy] = useState(false);
  const seenRef = useRef<Set<number>>(new Set());

  const mergeIncoming = useCallback((r: StoredRequest) => {
    setRequests((prev) => {
      if (seenRef.current.has(r.id)) return prev;
      seenRef.current.add(r.id);
      return [r, ...prev];
    });
  }, []);

  useEffect(() => {
    seenRef.current = new Set();
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/hooks/${endpointId}/requests`);
      if (!res.ok || cancelled) return;
      const data = (await res.json()) as StoredRequest[];
      if (cancelled) return;
      for (const r of data) seenRef.current.add(r.id);
      setRequests(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [endpointId]);

  useEffect(() => {
    const es = new EventSource(`/api/hooks/${endpointId}/events`);
    es.onmessage = (ev) => {
      try {
        const r = JSON.parse(ev.data) as StoredRequest;
        mergeIncoming(r);
      } catch {
        /* ignore */
      }
    };
    return () => es.close();
  }, [endpointId, mergeIncoming]);

  const onExpire = useCallback(() => setExpired(true), []);

  async function sendTest() {
    setTestBusy(true);
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test: true,
          message: "Hello from Webhook Playground!",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      /* network */
    } finally {
      setTestBusy(false);
    }
  }

  const count = requests.length;

  return (
    <div className="relative min-h-screen">
      {expired ? <ExpiredState /> : null}

      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="shrink-0 rounded-md p-1 text-content-secondary hover:bg-surface-overlay hover:text-content focus:outline-none focus-visible:shadow-focus"
              aria-label="Back to home"
            >
              ←
            </Link>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-content-tertiary">
                Webhook URL
              </p>
              <p className="truncate font-mono text-sm text-accent sm:text-base">
                {webhookUrl}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CopyButton text={webhookUrl} />
            <CountdownTimer expiresAtIso={expiresAtIso} onExpire={onExpire} />
            <span className="font-mono text-sm text-content-secondary">
              {count} / 100 requests
            </span>
            <button
              type="button"
              onClick={sendTest}
              disabled={expired || testBusy}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover focus:outline-none focus-visible:shadow-focus disabled:opacity-50"
            >
              {testBusy ? "Sending…" : "Send Test Request"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {count === 0 ? (
          <EmptyState hookUrl={webhookUrl} />
        ) : (
          <ul className="space-y-3">
            {requests.map((r) => (
              <li key={r.id}>
                <RequestCard req={r} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
