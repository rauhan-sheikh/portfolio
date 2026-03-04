import { redirect, notFound } from "next/navigation";

const links: Record<string, string> = {
  github: "https://github.com/rauhan-sheikh",
  linkedin: "https://www.linkedin.com/in/rauhan-sheikh/",
  twitter: "https://twitter.com/rauhan_sheikh",
  x: "https://x.com/rauhan_sheikh",
  instagram: "https://www.instagram.com/rauhan_sheikh/",
  email: "mailto:hello@rauhansheikh.com",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const url = links[slug];

  if (!url) {
    notFound();
  }

  redirect(url);
}
