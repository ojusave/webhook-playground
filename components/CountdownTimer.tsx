"use client";

import { useEffect, useRef, useState } from "react";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "0s";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function CountdownTimer({
  expiresAtIso,
  onExpire,
}: {
  expiresAtIso: string;
  onExpire?: () => void;
}) {
  const cb = useRef(onExpire);
  cb.current = onExpire;

  const [label, setLabel] = useState(() => {
    const end = new Date(expiresAtIso).getTime();
    return formatRemaining(end - Date.now());
  });

  useEffect(() => {
    const end = new Date(expiresAtIso).getTime();
    const tick = () => {
      const left = end - Date.now();
      if (left <= 0) {
        setLabel("0s");
        cb.current?.();
        return;
      }
      setLabel(formatRemaining(left));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAtIso]);

  return (
    <span className="font-mono text-sm tabular-nums text-content-secondary">
      Expires in {label}
    </span>
  );
}
