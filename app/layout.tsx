import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rauhan Sheikh | Full Stack Engineer",
  description:
    "Full Stack Engineer with 2 years experience building scalable web applications using Node.js, TypeScript, and Next.js.",
  metadataBase: new URL("https://rauhansheikh.com"),
  openGraph: {
    title: "Rauhan Sheikh | Full Stack Engineer",
    description:
      "Full Stack Engineer with 2 years experience building scalable web applications using Node.js, TypeScript, and Next.js.",
    type: "website",
    url: "https://rauhansheikh.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rauhan Sheikh | Full Stack Engineer",
    description:
      "Full Stack Engineer with 2 years experience building scalable web applications using Node.js, TypeScript, and Next.js.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-body bg-background text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
