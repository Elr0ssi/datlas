import type { Metadata } from "next";
import { PlusLoin } from "@/components/seo/PlusLoin";
import { ConflitsPage } from "@/components/conflits/ConflitsPage";
import { conflitsDuFichier } from "@/data/conflits";
import { articlesConflits, debatsConflits } from "@/data/conflits/lectures";
import { jsonLdString } from "@/lib/schema";

import { SITE_URL as siteUrl } from "@/lib/site";
const chemin = "/conflits";

export const metadata: Metadata = {
  title: { absolute: "Conflits dans le monde : la carte des conflits armés | Datlas" },
  description:
    "68 foyers de conflits armés, violences et tensions géopolitiques sur un globe interactif, par région. Fiches sourcées, inventaire du 31 octobre 2026.",
  keywords: ["conflits dans le monde", "carte des conflits", "guerres en cours", "conflits armés par pays", "tensions géopolitiques", "violences armées", "UCDP", "ACLED"],
  alternates: { canonical: chemin },
  openGraph: {
    type: "website",
    url: `${siteUrl}${chemin}`,
    title: "Conflits dans le monde : un inventaire sur un globe interactif",
    description: "Conflits armés, violences armées et tensions géopolitiques, par pays, avec leurs sources.",
  },
};

export default function Page() {
  const { inventaire, conflits } = conflitsDuFichier();
  const jeu = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Inventaire des foyers de conflits et de tensions dans le monde",
    description: `${inventaire.nombre_entrees} fiches éditoriales (conflits armés, violences armées, tensions géopolitiques), avec acteurs, situation et source. Compilation du ${inventaire.date_inventaire}, non exhaustive ; ce n'est pas un décompte officiel de guerres.`,
    url: `${siteUrl}${chemin}`,
    inLanguage: "fr-FR",
    dateModified: inventaire.date_inventaire,
    creator: { "@type": "Organization", name: "Datlas", url: siteUrl },
    isBasedOn: [
      { "@type": "Dataset", name: "UCDP", url: "https://ucdp.uu.se/downloads/" },
      { "@type": "Dataset", name: "ACLED", url: "https://acleddata.com/" },
    ],
  };
  const fil = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Conflits", item: `${siteUrl}${chemin}` },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jeu) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(fil) }} />
      <p className="sr-only">
        Cette page recense {inventaire.nombre_entrees} foyers de conflits armés, de violences armées et de tensions géopolitiques, répartis en cinq régions,
        d’après un inventaire éditorial du {inventaire.date_inventaire}. Ce n’est ni un décompte officiel de guerres ni un flux d’actualité : les fiches sont sourcées
        et à recouper avec UCDP et ACLED.
      </p>
      <ConflitsPage
        articles={articlesConflits()}
        debats={debatsConflits(conflits)}
        avantPied={
          <PlusLoin
            groupes={[
              { titre: "Pour comprendre", liens: [["Dépenses militaires et économie", "/economie"], ["Pays les plus endettés", "/dette-publique/analyses/pays-les-plus-endettes"], ["Tous les pays", "/pays"]] },
              { titre: "Datlas", liens: [["Méthodologie", "/methodologie"], ["Sources", "/sources"], ["Forum", "/forum"]] },
            ]}
          />
        }
      />
    </>
  );
}
