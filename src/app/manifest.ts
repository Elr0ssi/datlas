import type { MetadataRoute } from "next";

/* Datlas posé sur l'écran d'accueil d'un téléphone : son nom, son icône, ses couleurs. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Datlas",
    short_name: "Datlas",
    description: "Maîtriser la géopolitique, l'économie et la démographie du monde, en jouant avec ses chiffres.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdfdfe",
    theme_color: "#5b2de0",
    lang: "fr",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcuts: [
      { name: "Mon carnet", url: "/carnet" },
      { name: "Économie", url: "/economie" },
      { name: "Démographie", url: "/demographie" },
    ],
  };
}
