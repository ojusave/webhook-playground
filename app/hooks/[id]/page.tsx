import { headers } from "next/headers";
import { ExpiredState } from "@/components/ExpiredState";
import { Dashboard } from "@/components/Dashboard";
import { getEndpoint } from "@/lib/endpoint-queries";
import { webhookUrlForEndpoint } from "@/lib/public-url";

export const dynamic = "force-dynamic";

export default async function HookPage({
  params,
}: {
  params: { id: string };
}) {
  const ep = await getEndpoint(params.id);
  const now = Date.now();
  if (!ep || new Date(ep.expires_at).getTime() <= now) {
    return <ExpiredState />;
  }

  const h = await headers();
  const webhookUrl = webhookUrlForEndpoint(ep.id, h);

  return (
    <Dashboard
      endpointId={ep.id}
      webhookUrl={webhookUrl}
      expiresAtIso={ep.expires_at.toISOString()}
    />
  );
}
