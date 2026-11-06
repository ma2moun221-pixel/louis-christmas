import type { MetadataRoute } from "next";
import { event } from "@/lib/event";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: event.siteUrl, changeFrequency: "daily", priority: 1 }];
}
