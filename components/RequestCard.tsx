"use client";

import { useMemo, useState } from "react";
import type { StoredRequest } from "@/lib/types";
import { CopyButton } from "./CopyButton";
import { JsonHighlight } from "./JsonHighlight";
import { MethodBadge } from "./MethodBadge";

function relativeTime(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function RequestCard({ req }: { req: StoredRequest }) {
  const [open, setOpen] = useState(false);
  const isJson = useMemo(() => {
    const ct = req.content_type?.toLowerCase() ?? "";
    if (ct.includes("application/json")) return true;
    if (!req.body?.trim()) return false;
    try {
      JSON.parse(req.body);
      return true;
    } catch {
      return false;
    }
  }, [req.body, req.content_type]);

  const headerEntries = Object.entries(req.headers ?? {});

  return (
    <div className="animate-slide-in rounded-xl border border-border bg-surface-raised shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <MethodBadge method={req.method} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className="font-mono text-xs text-content-secondary"
              title={req.received_at}
            >
              {relativeTime(req.received_at)}
            </span>
            <span className="text-xs text-content-tertiary">
              {req.source_ip ?? "—"}
            </span>
            <span className="truncate font-mono text-xs text-content-tertiary">
              {req.content_type ?? "no content-type"}
            </span>
          </div>
        </div>
        <span className="shrink-0 text-content-tertiary" aria-hidden>
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-border px-4 py-4">
          {headerEntries.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-content-tertiary">
                Headers
              </h4>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[280px] text-left font-mono text-xs">
                  <tbody>
                    {headerEntries.map(([k, v]) => (
                      <tr key={k} className="border-b border-border last:border-0">
                        <td className="whitespace-nowrap px-3 py-2 text-accent">
                          {k}
                        </td>
                        <td className="break-all px-3 py-2 text-content-secondary">
                          {v}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h4 className="text-xs font-medium uppercase tracking-wide text-content-tertiary">
                Body
              </h4>
              {req.body ? (
                <CopyButton text={req.body} label="Copy body" className="!py-1 !text-xs" />
              ) : null}
            </div>
            <div className="max-h-96 overflow-auto rounded-lg border border-border bg-[var(--bg-base)] p-3">
              {req.body ? (
                isJson ? (
                  <JsonHighlight json={req.body} />
                ) : (
                  <pre className="whitespace-pre-wrap break-words font-mono text-xs text-content">
                    {req.body}
                  </pre>
                )
              ) : (
                <p className="font-mono text-xs text-content-tertiary">(empty)</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
