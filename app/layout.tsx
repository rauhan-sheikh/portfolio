import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import CommandPalette from "@/components/public/CommandPalette";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Rauhan Sheikh — Software Developer",
  description:
    "Personal Brand Platform for Rauhan Sheikh. I build things, break things, figure things out, and ship them. Focused on backend reliability, database architecture, and resilient web software.",
  metadataBase: new URL("https://rauhansheikh.com"),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    title: "Rauhan Sheikh — Software Developer",
    description:
      "Personal Brand Platform for Rauhan Sheikh. Building the parts of software that have to actually work.",
    type: "website",
    url: "https://rauhansheikh.com",
    siteName: "Rauhan Sheikh",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rauhan Sheikh — Software Developer",
    description: "Building the parts of software that have to actually work.",
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
        "@id": "https://rauhansheikh.com/#person",
        name: "Rauhan Sheikh",
        url: "https://rauhansheikh.com",
        jobTitle: "Software Developer",
        description: "Software developer focused on backend reliability, database architecture, and resilient web software.",
        sameAs: [
          "https://github.com/rauhan-sheikh",
          "https://linkedin.com/in/rauhan-sheikh",
          "https://x.com/rauhan_sheikh",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://rauhansheikh.com/#website",
        url: "https://rauhansheikh.com",
        name: "Rauhan Sheikh",
        description: "Software developer focused on backend reliability, database architecture, and resilient web software.",
        inLanguage: "en",
        publisher: {
          "@id": "https://rauhansheikh.com/#person",
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
