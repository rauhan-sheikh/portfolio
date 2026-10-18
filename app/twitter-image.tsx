import { renderOg, OG_PAGES } from "@/lib/og";

export const alt = "Rauhan Sheikh — Software Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg(OG_PAGES.home);
}
