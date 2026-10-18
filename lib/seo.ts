import type { Metadata } from "next";

export const SITE_URL = "https://rauhansheikh.com";
export const SITE_NAME = "Rauhan Sheikh";

/** Trim to a search-snippet friendly length without cutting mid-word. */
export function clamp(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[.,;:—-]+$/, "") + "…";
}

/**
 * Full per-page metadata. Setting openGraph/twitter explicitly matters: a page that
 * omits them silently inherits the homepage's og:title, og:description and og:url.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  ogTitle,
  extra,
}: {
  title: string | { absolute: string };
  description: string;
  path: string;
  type?: "website" | "article";
  ogTitle?: string;
  extra?: Record<string, unknown>;
}): Metadata {
  const desc = clamp(description);
  const shareTitle = ogTitle ?? (typeof title === "string" ? title : title.absolute);
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description: desc,
      type,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      ...extra,
    } as Metadata["openGraph"],
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: desc,
      creator: "@rauhan_sheikh",
    },
  };
}

/** Longest-fitting title (<= 60 chars) from the candidates, falling back to the last. */
export function fitTitle(...candidates: string[]): string {
  return candidates.find((c) => c.length <= 60) ?? candidates[candidates.length - 1];
}

/** schema.org BreadcrumbList for nested pages. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
