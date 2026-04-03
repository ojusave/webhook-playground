"use client";

import { ButtonGroup } from "render-dds";

const OPTIONS = [
  { hours: 1, label: "1 hour" },
  { hours: 6, label: "6 hours" },
  { hours: 24, label: "24 hours" },
] as const;

export function TTLSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (hours: number) => void;
}) {
  return (
    <ButtonGroup
      role="group"
      aria-label="Endpoint lifetime"
      className="rounded-none border border-border bg-card p-0.5"
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.hours;
        return (
          <button
            key={opt.hours}
            type="button"
            onClick={() => onChange(opt.hours)}
            className={`rounded-none px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active
                ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </ButtonGroup>
  );
}
