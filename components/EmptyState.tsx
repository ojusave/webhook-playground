import { Container } from "render-dds";

export function EmptyState({ hookUrl }: { hookUrl: string }) {
  return (
    <Container
      variant="bordered"
      padding="lg"
      className="flex flex-col items-center justify-center border-dashed text-center"
    >
      <div
        className="mb-4 h-2 w-2 animate-pulse rounded-full bg-primary"
        aria-hidden
      />
      <p className="text-base font-medium text-foreground">Waiting for requests…</p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Send HTTP traffic to your webhook URL, or use{" "}
        <span className="text-foreground">Send test request</span> above.
        Example:
      </p>
      <pre className="font-mono-data mt-5 w-full max-w-full overflow-x-auto rounded-none border border-border bg-input-background p-4 text-left text-xs leading-relaxed text-muted-foreground">
        {`curl -X POST '${hookUrl}' \\\n  -H 'Content-Type: application/json' \\\n  -d '{"hello":"world"}'`}
      </pre>
    </Container>
  );
}
