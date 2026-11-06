import type { MetadataRoute } from "next";
import { event } from "@/lib/event";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${event.siteUrl}/sitemap.xml`,
  };
}
