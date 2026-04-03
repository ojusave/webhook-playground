import type { BadgeProps } from "render-dds";
import { Badge } from "render-dds";

const METHOD_VARIANT: Record<string, BadgeProps["variant"]> = {
  GET: "blue",
  POST: "purple",
  PUT: "yellow",
  PATCH: "yellow",
  DELETE: "red",
};

export function MethodBadge({ method }: { method: string }) {
  const m = method.toUpperCase();
  const variant = METHOD_VARIANT[m] ?? "default";
  return (
    <Badge
      variant={variant}
      size="sm"
      className="shrink-0 font-mono font-medium normal-case tracking-normal"
    >
      {m}
    </Badge>
  );
}
