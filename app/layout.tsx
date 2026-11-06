import type { Metadata, Viewport } from "next";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "./globals.css";
import Analytics from "@/components/Analytics";
import { event } from "@/lib/event";

const description = `${event.titleAr} مع ${event.artists[0].nameAr} و${event.artists[1].roleAr} ${event.artists[1].nameAr} · ${event.dateAr} · ${event.venue.nameAr}، ${event.venue.cityAr} · العشاء مشمول · ${event.pricePerGuest} شيكل للشخص.`;

export const metadata: Metadata = {
  metadataBase: new URL(event.siteUrl),
  title: `${event.titleAr} | ${event.titleEn} · Full Volume Events`,
  description,
  alternates: { canonical: `${event.siteUrl}/` },
  openGraph: {
    type: "website",
    locale: "ar_PS",
    siteName: "Full Volume Events",
    title: `${event.titleAr} · ${event.dateAr}`,
    description,
    url: `${event.siteUrl}/`,
    images: [{ url: `${event.siteUrl}/og.jpg`, width: 1200, height: 630, alt: `${event.titleAr} · ${event.dateAr} · ${event.venue.nameAr}` }],
  },
  twitter: { card: "summary_large_image", images: [`${event.siteUrl}/og.jpg`] },
};

export const viewport: Viewport = {
  themeColor: "#230c10",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicEvent",
  name: `${event.titleEn} | ${event.titleAr}`,
  startDate: event.startsAt,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  description,
  image: [`${event.siteUrl}/og.jpg`],
  location: {
    "@type": "Place",
    name: event.venue.nameEn,
    address: {
      "@type": "PostalAddress",
      addressLocality: event.venue.cityEn,
      addressCountry: "PS",
    },
  },
  performer: event.artists.map((a) => ({ "@type": "Person", name: a.nameEn })),
  organizer: { "@type": "Organization", name: event.brand, url: event.siteUrl },
  offers: {
    "@type": "Offer",
    price: event.pricePerGuest,
    priceCurrency: "ILS",
    availability: "https://schema.org/InStock",
    url: `${event.siteUrl}/#tables`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* بيخلّي الحركات تشتغل بس إذا الـ JavaScript شغال، وإلا كل المحتوى بيضل ظاهر */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Analytics />
      </body>
    </html>
  );
}
