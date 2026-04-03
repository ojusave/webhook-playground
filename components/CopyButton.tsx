"use client";

import { useState } from "react";

export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      setDone(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-content transition hover:border-border-strong hover:bg-surface-overlay focus:outline-none focus-visible:shadow-focus ${className}`}
    >
      {done ? "Copied" : label}
    </button>
  );
}
