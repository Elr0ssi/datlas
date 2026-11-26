import type { Metadata } from "next";
import Link from "next/link";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Fil, JsonLd, schemaFil } from "@/components/seo/Elements";
import { ARTICLES } from "@/data/articles";
import { CATALOGUE_DETTE, estRedige } from "@/articles/dette/catalogue";
import { ANALYSES } from "@/data/dettes/analyses";
import { tousLesDossiers } from "@/data/dettes/dossiers";
import { INDICATEURS } from "@/data/seo/classements";
import { pagesRessources } from "@/data/seo/ressources";
import { pairesVedettes, paysParSlug, slugPaire, tousLesPays } from "@/data/seo/pays";
import { paysAvecRessources } from "@/data/seo/ressourcesAnalyse";
import { SITE_URL, urlAbs } from "@/lib/site";
import "@/components/concept/concept.css";
import "@/components/seo/seo.css";

export const metadata: Metadata = {
  title: { absolute: "Plan du site | Datlas" },
  description: "Toutes les pages de Datlas en un coup d'œil : rubriques, classements, ressources, pays, comparaisons, articles de dette publique et pages d'information.",
  alternates: { canonical: "/plan-du-site" },
};

function Bloc({ id, titre, liens, colonnes = false }: { id: string; titre: string; liens: [string, string][]; colonnes?: boolean }) {
  return (
    <section className="sg-sec" aria-labelledby={id}>
      <h2 id={id} className="sg-h2">{titre}</h2>
      <ul className={colonnes ? "sg-index" : "sg-liens"}>
        {liens.map(([l, h]) => (
          <li key={h}><Link href={h}>{l}</Link></li>
        ))}
      </ul>
    </section>
  );
}

export default function Page() {
  const pays = [...tousLesPays()].sort((a, b) => a.fr.localeCompare(b.fr, "fr"));
  const vus = new Set<string>();
  const paires: [string, string][] = [];
  for (const [a, b] of pairesVedettes(36)) {
    const s = slugPaire(a, b);
    if (vus.has(s)) continue;
    vus.add(s);
    paires.push([`${a.fr} ou ${b.fr}`, `/comparer/${s}`]);
  }
  return (
    <div className="cg sg">
      <EnTete />
      <JsonLd data={[schemaFil([{ label: "Accueil", url: SITE_URL }, { label: "Plan du site", url: urlAbs("/plan-du-site") }])]} />
      <main className="sg-page">
        <Fil items={[{ label: "Accueil", href: "/" }, { label: "Plan du site" }]} />
        <h1 className="sg-h1">Plan du site</h1>
        <p className="sg-intro">Toutes les pages de Datlas, rangées par usage. Chaque page répond à une question précise, et peut être citée telle quelle.</p>

        <Bloc id="pl-rub" titre="Les rubriques" liens={[["Accueil", "/"], ["Économie", "/economie"], ["Démographie", "/demographie"], ["Conflits", "/conflits"], ["Ressources", "/ressources"], ["Articles", "/articles"], ["Forum", "/forum"]]} />
        <Bloc id="pl-cl" titre="Les classements" liens={[["Tous les classements", "/classements"], ...INDICATEURS.map((i) => [i.titre, `/classements/${i.slug}`] as [string, string])]} />
        <Bloc id="pl-res" titre="La production mondiale, ressource par ressource" liens={pagesRessources().map((r) => [r.nom, `/ressources/${r.slug}`] as [string, string])} />
        <Bloc id="pl-res-pays" titre="Les ressources de chaque pays" colonnes liens={paysAvecRessources().map((s) => [paysParSlug(s)?.fr ?? s, `/pays/${s}/ressources`] as [string, string]).sort((x, y) => x[0].localeCompare(y[0], "fr"))} />
        <Bloc
          id="pl-dette"
          titre="La dette publique"
          liens={[
            ["La dette publique par pays", "/dette-publique"],
            ...CATALOGUE_DETTE.map((a) => [a.titre, a.url] as [string, string]),
            ...ANALYSES.map((a) => [a.titre, `/dette-publique/analyses/${a.slug}`] as [string, string]),
          ]}
        />
        <Bloc id="pl-dossiers" titre="Les dossiers de dette par pays" colonnes liens={tousLesDossiers().filter((d) => !estRedige(d.slug)).map((d) => [d.fr, `/dette-publique/${d.slug}`] as [string, string])} />
        <Bloc id="pl-art" titre="Les lectures" liens={ARTICLES.filter((a) => a.slug !== "dette-publique-france-2025-enjeux").map((a) => [a.title, `/articles/${a.slug}`] as [string, string])} />
        <Bloc id="pl-cmp" titre="Les comparaisons les plus recherchées" liens={[["Le comparateur", "/comparer"], ...paires]} />
        <Bloc id="pl-pays" titre="Les fiches pays" colonnes liens={[["Tous les pays", "/pays"], ...pays.map((p) => [p.fr, `/pays/${p.slug}`] as [string, string])]} />
        <Bloc
          id="pl-info"
          titre="Datlas et informations légales"
          liens={[
            ["À propos", "/a-propos"], ["Méthodologie", "/methodologie"], ["Méthodologie de la base", "/methodologie-donnees"], ["Sources", "/sources"], ["Contact", "/contact"],
            ["Mentions légales", "/mentions-legales"], ["Confidentialité", "/confidentialite"], ["Cookies", "/cookies"], ["CGU", "/cgu"], ["Modération", "/moderation"], ["Accessibilité", "/accessibilite"],
          ]}
        />
      </main>
      <Pied />
    </div>
  );
}
