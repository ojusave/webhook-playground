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
      className="inline-flex rounded-md border border-[var(--border-default)] bg-[var(--surface-default)] p-0.5"
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
            className={`rounded-[4px] px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
              active
                ? "bg-[var(--render-primary)] font-semibold text-[#0d1117] shadow-sm"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
