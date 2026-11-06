/**
 * بيضيف مسار الموقع قبل الملفات (صور، فيديو) لما يكون الموقع منشور بمجلد فرعي،
 * زي GitHub Pages: ma2moun221-pixel.github.io/louis-christmas
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string;
export function asset(path: string | null): string | null;
export function asset(path: string | null): string | null {
  if (!path || !path.startsWith("/")) return path;
  return basePath + path;
}
