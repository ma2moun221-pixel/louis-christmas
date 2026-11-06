import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1  -> موقع ثابت بمجلد out (لـ GitHub Pages أو أي استضافة ملفات)
 * PAGES_BASE_PATH  -> المجلد الفرعي، مثلاً /louis-christmas
 * بدونهم بيشتغل عادي على DigitalOcean (npm run build && npm start)
 */
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(staticExport
    ? { output: "export", basePath, images: { unoptimized: true }, trailingSlash: true }
    : {
        async redirects() {
          // الصفحة القديمة /stays صارت قسم بالصفحة الرئيسية
          return [{ source: "/stays", destination: "/#contact", permanent: false }];
        },
      }),
};

export default nextConfig;
