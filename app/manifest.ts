import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rauhan Sheikh",
    short_name: "Rauhan",
    description: "Software developer focused on backend reliability, database architecture, and resilient web software.",
    start_url: "/",
    display: "standalone",
    background_color: "#7DBEFA",
    theme_color: "#7DBEFA",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
