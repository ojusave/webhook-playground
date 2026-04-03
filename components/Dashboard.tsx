"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Container, Label } from "render-dds";
import type { StoredRequest } from "@/lib/types";
import { CopyButton } from "./CopyButton";
import { CountdownTimer } from "./CountdownTimer";
import { EmptyState } from "./EmptyState";
import { ExpiredState } from "./ExpiredState";
import { RequestCard } from "./RequestCard";

const backLinkClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-zinc-300 bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-zinc-600";

function BackIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

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

      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <Link
                href="/"
                className={backLinkClass}
                aria-label="Back to home"
              >
                <BackIcon />
              </Link>
              <div className="min-w-0">
                <Label>Webhook URL</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Incoming requests appear in the feed below.
                </p>
              </div>
            </div>
          </div>

          <Container variant="bordered" padding="sm" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="font-mono-data min-w-0 flex-1 break-all text-sm leading-relaxed text-primary">
              {webhookUrl}
            </p>
            <CopyButton text={webhookUrl} />
          </Container>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <CountdownTimer expiresAtIso={expiresAtIso} onExpire={onExpire} />
              <span className="inline-flex items-center gap-2 rounded-none border border-border bg-muted px-3 py-1 font-mono text-xs tabular-nums text-muted-foreground">
                <span className="text-muted-foreground">Requests</span>
                <span className="text-foreground">
                  {count}
                  <span className="text-muted-foreground"> / </span>
                  100
                </span>
              </span>
            </div>
            <Button
              type="button"
              onClick={sendTest}
              disabled={expired || testBusy}
              className="w-full sm:w-auto"
            >
              {testBusy ? "Sending…" : "Send test request"}
            </Button>
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
