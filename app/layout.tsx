import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import CommandPalette from "@/components/public/CommandPalette";
import { db } from "@/lib/db";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Rauhan Sheikh — Software Developer",
  description:
    "Rauhan Sheikh is a software developer building reliable backends, resilient database architecture, and web software that has to actually work.",
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    title: "Rauhan Sheikh — Software Developer",
    description:
      "Rauhan Sheikh is a software developer building reliable backends, resilient database architecture, and web software that has to actually work.",
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rauhan Sheikh — Software Developer",
    description:
      "Rauhan Sheikh is a software developer building reliable backends, resilient database architecture, and web software that has to actually work.",
    creator: "@rauhan_sheikh",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch active navigation items and site settings from database
  let navItems: { label: string; href: string }[] = [];
  let availabilityBadge = "Open to opportunities";
  let availabilityActive = true;

  try {
    const [dbNav, dbSettings] = await Promise.all([
      db.navigationItem.findMany({
        where: { isEnabled: true },
        orderBy: { order: "asc" },
      }),
      db.siteSetting.findMany({
        where: {
          key: { in: ["availability_badge", "availability_active"] },
        },
      }),
    ]);

    if (dbNav.length > 0) {
      navItems = dbNav.map((n) => ({ label: n.label, href: n.href }));
    }

    dbSettings.forEach((s) => {
      if (s.key === "availability_badge") availabilityBadge = s.value;
      if (s.key === "availability_active") availabilityActive = s.value !== "false";
    });
  } catch (error) {
    // Graceful fallback if database is loading
    navItems = [
      { label: "Work", href: "/work" },
      { label: "Experience", href: "/experience" },
      { label: "Writing", href: "/writing" },
      { label: "Now", href: "/now" },
      { label: "About", href: "/about" },
      { label: "Resume", href: "/resume" },
      { label: "Contact", href: "/contact" },
    ];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Rauhan Sheikh",
        url: SITE_URL,
        jobTitle: "Software Developer",
        image: `${SITE_URL}/avatar-tile.png`,
        description: "Software developer focused on backend reliability, database architecture, and resilient web software.",
        sameAs: [
          "https://github.com/rauhan-sheikh",
          "https://linkedin.com/in/rauhan-sheikh",
          "https://x.com/rauhan_sheikh",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Rauhan Sheikh",
        description: "Software developer focused on backend reliability, database architecture, and resilient web software.",
        inLanguage: "en",
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-body bg-background text-primary min-h-screen flex flex-col justify-between">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header
            navItems={navItems}
            availabilityBadge={availabilityBadge}
            availabilityActive={availabilityActive}
          />
          <div className="flex-1">{children}</div>
          <Footer />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
