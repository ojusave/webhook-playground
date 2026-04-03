"use client";

import Link from "next/link";

export function ExpiredState() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-canvas)]/92 px-4 backdrop-blur-sm">
      <div className="render-panel max-w-md p-8 text-center shadow-xl">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          This endpoint has expired.
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          All data has been deleted.
        </p>
        <Link href="/" className="render-btn-primary mt-6 inline-flex w-full">
          Create new endpoint
        </Link>
      </div>
    </div>
  );
}
