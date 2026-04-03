"use client";

import Link from "next/link";

const primaryCtaClass =
  "mt-6 inline-flex h-10 w-full items-center justify-center whitespace-nowrap bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

export function ExpiredState() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/92 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md border border-border bg-card p-8 text-center shadow-xl">
        <h2 className="text-lg font-semibold text-foreground">
          This endpoint has expired.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          All data has been deleted.
        </p>
        <Link href="/" className={primaryCtaClass}>
          Create new endpoint
        </Link>
      </div>
    </div>
  );
}
