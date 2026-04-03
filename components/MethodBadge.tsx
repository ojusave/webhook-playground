const STYLES: Record<string, string> = {
  GET: "bg-[#3B82F6]/15 text-[#3B82F6]",
  POST: "bg-[#8B5CF6]/15 text-[#8B5CF6]",
  PUT: "bg-[#F59E0B]/15 text-[#F59E0B]",
  PATCH: "bg-[#F97316]/15 text-[#F97316]",
  DELETE: "bg-[#EF4444]/15 text-[#EF4444]",
};

export function MethodBadge({ method }: { method: string }) {
  const m = method.toUpperCase();
  const cls = STYLES[m] ?? "bg-[#6B7280]/15 text-[#6B7280]";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 font-mono text-xs font-medium ${cls}`}
    >
      {m}
    </span>
  );
}
