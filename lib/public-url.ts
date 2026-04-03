export function getPublicAppUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "";
  return base;
}

export function webhookUrlForEndpoint(id: string): string {
  const base = getPublicAppUrl();
  if (!base) return `/api/hooks/${id}`;
  return `${base}/api/hooks/${id}`;
}
