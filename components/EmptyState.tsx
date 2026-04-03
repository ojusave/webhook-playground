export function EmptyState({ hookUrl }: { hookUrl: string }) {
  return (
    <div className="render-panel flex flex-col items-center justify-center border-dashed px-6 py-14 text-center">
      <div
        className="mb-4 h-2 w-2 rounded-full bg-[var(--render-primary)] animate-pulse"
        aria-hidden
      />
      <p className="text-base font-medium text-[var(--text-primary)]">
        Waiting for requests…
      </p>
      <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
        Send HTTP traffic to your webhook URL, or use{" "}
        <span className="text-[var(--text-primary)]">Send test request</span>{" "}
        above. Example:
      </p>
      <pre className="mt-5 w-full max-w-full overflow-x-auto rounded-md border border-[var(--border-default)] bg-[var(--bg-canvas)] p-4 text-left font-mono text-xs leading-relaxed text-[var(--text-secondary)]">
        {`curl -X POST '${hookUrl}' \\\n  -H 'Content-Type: application/json' \\\n  -d '{"hello":"world"}'`}
      </pre>
    </div>
  );
}
