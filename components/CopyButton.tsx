"use client";

import { useState } from "react";
import { Button } from "render-dds";

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
    <Button
      type="button"
      variant="outline"
      onClick={copy}
      className={`shrink-0 ${className}`}
    >
      {done ? "Copied" : label}
    </Button>
  );
}
