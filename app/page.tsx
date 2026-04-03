"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Link as DdsLink,
} from "render-dds";
import { TTLSelector } from "@/components/TTLSelector";
import { getBlueprintDeployUrl } from "@/lib/blueprint-deploy";
import { renderSignupUrlWithUtms } from "@/lib/render-signup-url";

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
        <div className="flex w-full max-w-lg flex-col items-stretch">
          <Card variant="elevated" className="w-full shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Webhook Playground
              </CardTitle>
              <CardDescription className="text-center text-base">
                Capture, inspect, and debug HTTP requests in real time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block text-center text-muted-foreground">
                  Endpoint lifetime
                </Label>
                <div className="flex justify-center">
                  <TTLSelector value={ttl} onChange={setTtl} />
                </div>
              </div>

              {error ? (
                <p className="text-center text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                type="button"
                className="w-full"
                onClick={createEndpoint}
                disabled={busy}
              >
                {busy ? "Creating…" : "Create endpoint"}
              </Button>
            </CardContent>
          </Card>

          <p
            className="mt-8 max-w-lg text-center text-sm leading-relaxed text-muted-foreground"
            role="note"
          >
            Your data is temporary. Endpoints auto-expire based on your chosen
            TTL. All payloads are automatically deleted. No accounts, no
            cookies, no tracking.
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href={getBlueprintDeployUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img
                src="https://render.com/images/deploy-to-render-button.svg"
                alt="Deploy to Render"
                width={175}
                height={40}
                className="h-10 w-auto"
              />
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>
          Built with Next.js ·{" "}
          <DdsLink href={renderSignupUrlWithUtms()} variant="default">
            Render
          </DdsLink>
        </p>
      </footer>
    </div>
  );
}
