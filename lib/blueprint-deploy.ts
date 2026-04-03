/**
 * One-click Blueprint deploy on Render. Override when you fork:
 * NEXT_PUBLIC_BLUEPRINT_REPO_URL=https://github.com/you/webhook-playground
 */
export const BLUEPRINT_REPO_URL =
  process.env.NEXT_PUBLIC_BLUEPRINT_REPO_URL?.trim() ||
  "https://github.com/ojusave/webhook-playground";

export function getBlueprintDeployUrl(): string {
  const u = new URL("https://render.com/deploy");
  u.searchParams.set("repo", BLUEPRINT_REPO_URL);
  return u.toString();
}
