import { SelectionApprentissage } from "@/components/apprentissage/SelectionApprentissage";
import { Progression } from "@/components/navigation/Progression";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { jsonLdString } from "@/lib/schema";
import "./globals.css";
import "./mobile.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

import { SITE_URL as siteUrl } from "@/lib/site";

/* L'écran entier : le fond de la page passe sous l'encoche et l'heure, comme sur une app. */
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#fdfdfe",
};

export const metadata: Metadata = {
  title: {
    default: "Datlas · Maîtriser le monde en données : apprendre en s'amusant",
    template: "%s | Datlas",
  },
  description:
    "Datlas vous fait maîtriser la géopolitique, l'économie, la démographie, les conflits et les ressources du monde : globes interactifs, classements, comparaisons et articles sourcés pour apprendre en jouant et retenir dans le temps, avec un carnet de révision et la traduction en anglais.",
  keywords: [
    "PIB par pays",
    "population par pays",
    "comparer deux pays",
    "dette publique par pays",
    "inflation par pays",
    "taux de chômage par pays",
    "classement des pays",
    "carte du monde interactive",
    "globe interactif",
    "données économiques mondiales",
    "données démographiques",
    "évolution du PIB depuis 1960",
    "population mondiale en temps réel",
    "statistiques par pays",
    "apprendre la géopolitique",
    "comprendre l'économie mondiale",
    "apprentissage ludique et interactif",
    "réviser avec des cartes",
    "apprendre l'anglais en lisant l'actualité",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "Datlas",
    locale: "fr_FR",
    url: siteUrl,
    title: "Datlas · Maîtriser le monde en données : apprendre en s'amusant",
    description:
      "Géopolitique, économie, démographie, conflits, ressources : apprendre de façon ludique et interactive, et retenir dans le temps.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Datlas · Maîtriser le monde en données : apprendre en s'amusant",
    description: "Géopolitique, économie, démographie : apprendre de façon ludique et interactive, et retenir dans le temps.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Datlas",
    description:
      "Apprendre le monde de façon ludique et interactive : géopolitique, économie, démographie, conflits et ressources, sur des globes, des classements et des articles sourcés, avec révision espacée et traduction en anglais.",
    url: siteUrl,
    inLanguage: "fr",
    copyrightHolder: { "@type": "Organization", name: "Datlas" },
    publisher: {
      "@type": "Organization",
      name: "Datlas",
      url: siteUrl,
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Datlas",
    url: siteUrl,
    description:
      "Plateforme d'apprentissage par les données : maîtriser la géopolitique, l'économie, la démographie, les conflits et les ressources du monde, de façon ludique et interactive, pour retenir dans le temps.",
    logo: { "@type": "ImageObject", url: `${siteUrl}/icon-512.png`, width: 512, height: 512 },
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: `${siteUrl}/contact`, availableLanguage: ["French", "English"] },
    publishingPrinciples: `${siteUrl}/methodologie`,
    correctionsPolicy: `${siteUrl}/methodologie#corrections`,
    ethicsPolicy: `${siteUrl}/methodologie#independance`,
    ownershipFundingInfo: `${siteUrl}/mentions-legales`,
    actionableFeedbackPolicy: `${siteUrl}/contact`,
    knowsAbout: ["Économie mondiale", "Produit intérieur brut", "Dette publique", "Démographie", "Population mondiale", "Conflits armés", "Géopolitique", "Production agricole mondiale"],
    sameAs: [],
  };

  return (
    <html lang="fr" suppressHydrationWarning className={inter.variable} data-concept="clair" data-scroll-behavior="smooth">
      <head>
        <meta name="theme-color" content="#fdfdfe" />
        {/* Le thème des pages Datlas, posé avant le premier rendu. Le défaut
            est le clair ; seul un choix explicite de la nuit le remplace. Sans
            ce passage, une page choisie en nuit apparaîtrait claire le temps
            d'une image, puis basculerait. Il ne fait rien d'autre que relire
            un choix déjà pris, et se tait si le stockage est fermé. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              /* Les anciennes clés (du temps où le site s'appelait autrement) passent une fois sous leur nom Datlas, sans perdre les réglages. */
              'try{var m={"visualize-theme-v2":"datlas-theme","visualize-monnaie":"datlas-monnaie","visualize-tableau-v4":"datlas-tableau","visualize-globe-perso-v3":"datlas-globe-perso","visualize-compare-v2":"datlas-comparateur"};for(var k in m){var v=localStorage.getItem(k);if(v!==null){if(localStorage.getItem(m[k])===null)localStorage.setItem(m[k],v);localStorage.removeItem(k)}}localStorage.removeItem("ted-dashboard-v1");if(localStorage.getItem("datlas-theme")==="nuit")delete document.documentElement.dataset.concept}catch(e){}',
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(organizationSchema) }}
        />
      </head>
      <body style={{ fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif" }}>
        <Progression />
        {children}
        <SelectionApprentissage />
      </body>
    </html>
  );
}
