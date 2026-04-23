export function renderSignupUrlWithUtms(): string {
  const params = new URLSearchParams({
    utm_source: "github",
    utm_medium: "referral",
    utm_campaign: "ojus_demos",
    utm_content: "footer_link",
  });
  return `https://dashboard.render.com/register?${params.toString()}`;
}
