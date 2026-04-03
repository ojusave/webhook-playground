export function renderSignupUrlWithUtms(): string {
  const params = new URLSearchParams({
    utm_source: "webhook_playground",
    utm_medium: "referral",
    utm_campaign: "webhook_playground_app",
    utm_content: "footer_link",
  });
  return `https://render.com/register?${params.toString()}`;
}
