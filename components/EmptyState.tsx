export function EmptyState({ hookUrl }: { hookUrl: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/50 px-8 py-16 text-center">
      <div
        className="mb-4 h-2 w-2 rounded-full bg-accent/80 animate-pulse"
        aria-hidden
      />
      <p className="text-lg font-medium text-content">Waiting for requests…</p>
      <p className="mt-2 max-w-md text-sm text-content-secondary">
        Send HTTP traffic to your webhook URL, or use the test button above. Example:
      </p>
      <pre className="mt-4 max-w-full overflow-x-auto rounded-lg border border-border bg-[var(--bg-base)] p-4 text-left font-mono text-xs text-content-secondary">
        {`curl -X POST '${hookUrl}' \\\n  -H 'Content-Type: application/json' \\\n  -d '{"hello":"world"}'`}
      </pre>
    </div>
  );
}
