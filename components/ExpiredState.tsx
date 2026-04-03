"use client";

import Link from "next/link";

export function ExpiredState() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-base)]/90 px-4 backdrop-blur-sm">
      <div className="max-w-md rounded-xl border border-border bg-surface-raised p-8 text-center shadow-xl">
        <h2 className="text-xl font-semibold text-content">
          This endpoint has expired.
        </h2>
        <p className="mt-2 text-sm text-content-secondary">
          All data has been deleted.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover focus:outline-none focus-visible:shadow-focus"
        >
          Create New Endpoint
        </Link>
      </div>
    </div>
  );
}
