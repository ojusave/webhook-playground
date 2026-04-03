"use client";

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
    <div
      className="inline-flex rounded-lg border border-border bg-surface p-1"
      role="group"
      aria-label="Endpoint lifetime"
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.hours;
        return (
          <button
            key={opt.hours}
            type="button"
            onClick={() => onChange(opt.hours)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:shadow-focus ${
              active
                ? "bg-accent text-white shadow-sm"
                : "text-content-secondary hover:bg-surface-overlay hover:text-content"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
