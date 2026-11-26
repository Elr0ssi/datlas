import type { Metadata } from "next";
import Link from "next/link";
import { PageDoc } from "@/components/legal/PageDoc";
import { sourcesEco } from "@/data/concept/conceptEconomie";
import { sourcesDemo } from "@/data/concept/conceptDemographie";
import { CADENCES_RESSOURCES } from "@/data/ressources/tempsReel";
import { SOURCES as SOURCES_CONFLITS, VERSION_ENRICHISSEMENT } from "@/data/conflits/fusion";
import { pagesRessources, ficheRessource } from "@/data/seo/ressources";
import { MAJ_LEGAL } from "@/data/legal";

export const metadata: Metadata = {
  title: { absolute: "Sources des données : Banque mondiale, FMI, ONU, FAO | Datlas" },
  description: "Toutes les sources de Datlas, rubrique par rubrique : Banque mondiale, FMI, Nations Unies, FAOSTAT, INSEE, Eurostat, inventaires de conflits, avec leur couverture.",
  alternates: { canonical: "/sources" },
};

const hote = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
};

export default function Page() {
  const conflits = Object.values(SOURCES_CONFLITS);
  const parSite = new Map<string, number>();
  for (const s of conflits) parSite.set(hote(s.url), (parSite.get(hote(s.url)) ?? 0) + 1);
  const sitesConflits = [...parSite].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const ressources = pagesRessources().map((r) => ({ r, f: ficheRessource(r) })).filter((x) => x.f);
  const exportFao = ressources[0]?.f?.jeu.source.date_export;

  return (
    <PageDoc
      chemin="/sources"
      titre="Sources des données"
      chapo="Chaque chiffre de Datlas vient d'une publication identifiable, citée sous le graphique qui l'affiche. Cette page les rassemble, rubrique par rubrique, avec ce que chacune couvre réellement."
      maj={MAJ_LEGAL}
      sections={[
        {
          id: "economie",
          titre: "Économie",
          blocs: [
            { tableau: { entetes: ["Indicateur", "Source", "Couverture"], lignes: sourcesEco().map((s) => [s.libelle, s.source, s.couverture]) } },
            { noeud: <p>Sur le site : <Link href="/economie">globe de l&apos;économie</Link>, <Link href="/classements">classements</Link>, <Link href="/pays">fiches pays</Link>.</p> },
          ],
        },
        {
          id: "demographie",
          titre: "Démographie",
          blocs: [
            { tableau: { entetes: ["Indicateur", "Source"], lignes: sourcesDemo().map((s) => [s.libelle, s.source]) } },
            { noeud: <p>Sur le site : <Link href="/demographie">globe de la démographie</Link>, <Link href="/classements/population">population par pays</Link>.</p> },
          ],
        },
        {
          id: "ressources",
          titre: "Ressources agricoles",
          blocs: [
            `FAOSTAT, la base statistique de l'Organisation des Nations Unies pour l'alimentation et l'agriculture, domaine « Crops and livestock products » (QCL)${exportFao ? `, fichiers exportés le ${new Date(exportFao).toLocaleDateString("fr-FR")}` : ""}. Chaque valeur garde son statut FAOSTAT : officielle, estimée, imputée, source externe.`,
            { tableau: { entetes: ["Ressource", "Années", "Page"], lignes: ressources.map(({ r, f }) => [r.nom, `${f!.jeu.annees[0]}–${f!.annee}`, <Link key={r.slug} href={`/ressources/${r.slug}`}>Production mondiale</Link>]) } },
          ],
        },
        {
          id: "temps-reel",
          titre: "Compteurs en temps réel",
          blocs: [
            "Les compteurs étalent sur l'année en cours la dernière valeur annuelle publiée. Leurs sources :",
            { tableau: { entetes: ["Compteur", "Source"], lignes: [
              ["PIB mondial", "Somme des PIB nationaux publiés (Banque mondiale, FMI)"],
              ["Population mondiale, naissances, décès", "Nations Unies, World Population Prospects 2024"],
              ["Dépenses militaires", "Environ 2,4 % du PIB mondial (SIPRI)"],
              ["Dépenses de santé", "Environ 9,5 % du PIB mondial (OMS)"],
              ["Dépenses d'éducation", "Environ 4,3 % du PIB mondial (UNESCO)"],
              ...CADENCES_RESSOURCES.map((c) => [c.label, <a key={c.id} href={c.source.url} rel="noopener">{c.source.nom}</a>]),
            ] } },
            { noeud: <p>Le principe de calcul est expliqué dans la <Link href="/methodologie#temps-reel">méthodologie</Link>.</p> },
          ],
        },
        {
          id: "conflits",
          titre: "Conflits et tensions",
          blocs: [
            `L'inventaire des conflits est éditorial : chaque fiche cite ses propres sources (${conflits.length} documents référencés${VERSION_ENRICHISSEMENT.date_arret ? `, arrêté au ${new Date(VERSION_ENRICHISSEMENT.date_arret).toLocaleDateString("fr-FR")}` : ""}). Les inventaires de référence sont ceux de l'Uppsala Conflict Data Program (UCDP) et de l'Armed Conflict Location & Event Data Project (ACLED).`,
            { tableau: { entetes: ["Site source", "Documents cités"], lignes: sitesConflits.map(([h, n]) => [h, String(n)]) } },
          ],
        },
        {
          id: "dette",
          titre: "Dette publique",
          blocs: [
            { liste: [
              "France : INSEE (dette trimestrielle de Maastricht, comptes nationaux), Banque de France, Agence France Trésor.",
              "Union européenne : Eurostat (dette et déficit au sens de Maastricht).",
              "Autres pays : FMI (Perspectives de l'économie mondiale) et Banque mondiale.",
            ] },
            { noeud: <p>Sur le site : <Link href="/dette-publique">la dette publique par pays</Link> et <Link href="/pays/france/dette-publique">la dette de la France</Link>.</p> },
          ],
        },
        {
          id: "cartes",
          titre: "Cartes et outils",
          blocs: [
            { liste: [
              "Fonds de carte et frontières : Natural Earth (domaine public).",
              "Traduction en anglais des passages sélectionnés : MyMemory (Translated S.r.l.).",
            ] },
          ],
        },
        {
          id: "licences",
          titre: "Licences et réutilisation",
          blocs: [
            "Les données de la Banque mondiale sont diffusées sous licence Creative Commons Attribution 4.0. Les autres producteurs (Nations Unies, FAO, INSEE, Eurostat, FMI) publient leurs propres conditions de réutilisation, qui demandent la mention de la source : ce sont elles qui s'appliquent à leurs données.",
            { noeud: <p>Pour citer un chiffre de Datlas : mentionnez Datlas et la source d&apos;origine, avec un lien vers la page. Une erreur ? <Link href="/contact?objet=erreur">Signalez-la</Link>.</p> },
          ],
        },
      ]}
    />
  );
}
