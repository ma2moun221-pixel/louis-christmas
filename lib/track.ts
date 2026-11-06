type Fbq = (cmd: "track", name: string, params?: Record<string, unknown>) => void;
type Gtag = (cmd: "event", name: string, params?: Record<string, unknown>) => void;

/** بيبعت حدث لـ Meta Pixel و Google Analytics إذا كانوا مفعّلين، وإلا ما بيعمل إشي */
export function track(name: "Lead" | "Contact" | "InitiateCheckout", params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: Fbq; gtag?: Gtag };
  w.fbq?.("track", name, params);
  w.gtag?.("event", name.toLowerCase(), params);
}
