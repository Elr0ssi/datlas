import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Faq, Fil, JsonLd, schemaFaq, schemaFil } from "@/components/seo/Elements";
import { classementDe, indicateurParSlug, INDICATEURS } from "@/data/seo/classements";
import { drapeau } from "@/lib/drapeau";
import { aNom, avec } from "@/data/seo/francais";
import { SITE_URL, urlAbs } from "@/lib/site";
import "@/components/concept/concept.css";
import "@/components/seo/seo.css";

export const dynamicParams = false;
export const generateStaticParams = () => INDICATEURS.map((i) => ({ indicateur: i.slug }));

export async function generateMetadata({ params }: { params: Promise<{ indicateur: string }> }): Promise<Metadata> {
  const ind = indicateurParSlug((await params).indicateur);
  if (!ind) return {};
  const { lignes, annee } = classementDe(ind);
  const top = lignes.slice(0, 3).map((l) => `${l.pays.fr} (${ind.fmt(l.m.v)})`).join(", ");
  return {
    title: { absolute: `${ind.titre} (${annee}) | Datlas` },
    description: `${ind.court} par pays en ${annee} : ${top}… Le classement complet de ${lignes.length} pays, sourcé.`.slice(0, 158),
    alternates: { canonical: `/classements/${ind.slug}` },
    openGraph: { type: "article", url: urlAbs(`/classements/${ind.slug}`), title: `${ind.titre} (${annee})`, description: ind.description },
  };
}

export default async function Page({ params }: { params: Promise<{ indicateur: string }> }) {
  const ind = indicateurParSlug((await params).indicateur);
  if (!ind) notFound();
  const { lignes, annee } = classementDe(ind);
  const premier = lignes[0];
  const dernier = lignes[lignes.length - 1];
  const france = lignes.find((l) => l.pays.slug === "france");
  const url = urlAbs(`/classements/${ind.slug}`);

  const faq = [
    {
      q: ind.question,
      r: `D'après la dernière valeur publiée, le premier rang revient ${aNom(premier.pays.fr)} (${ind.fmt(premier.m.v)} en ${premier.m.annee}), devant ${avec(lignes[1].pays.fr)} (${ind.fmt(lignes[1].m.v)}) et ${avec(lignes[2].pays.fr)} (${ind.fmt(lignes[2].m.v)}).`,
    },
    {
      q: `Quel pays a ${ind.nom} ${ind.bas} ?`,
      r: `Le dernier rang revient ${aNom(dernier.pays.fr)}, avec ${ind.fmt(dernier.m.v)} en ${dernier.m.annee}, sur les ${lignes.length} pays pour lesquels la donnée est publiée.`,
    },
    ...(france
      ? [{ q: `Où se situe la France pour ${ind.nom} ?`, r: `La France est ${france.rang === 1 ? "1re" : `${france.rang}e`} sur ${lignes.length}, avec ${ind.fmt(france.m.v)} en ${france.m.annee}.` }]
      : []),
    { q: `Comment ${ind.nom} est-il mesuré ?`, r: `${ind.definition} Source : ${ind.source}.` },
  ];

  const schema = [
    schemaFil([
      { label: "Accueil", url: SITE_URL },
      { label: "Classements", url: urlAbs("/classements") },
      { label: ind.court, url },
    ]),
    {
      "@type": "Dataset",
      name: `${ind.titre} (${annee})`,
      description: ind.description,
      url,
      inLanguage: "fr",
      temporalCoverage: String(annee),
      spatialCoverage: "Monde",
      variableMeasured: ind.court,
      isAccessibleForFree: true,
      creator: { "@type": "Organization", name: "Datlas", url: SITE_URL },
      citation: ind.source,
    },
    {
      "@type": "ItemList",
      name: `${ind.titre} (${annee})`,
      numberOfItems: lignes.length,
      itemListElement: lignes.slice(0, 20).map((l) => ({ "@type": "ListItem", position: l.rang, name: `${l.pays.fr} : ${ind.fmt(l.m.v)}`, url: urlAbs(`/pays/${l.pays.slug}`) })),
    },
    schemaFaq(faq),
  ];

  return (
    <div className="cg sg">
      <EnTete />
      <JsonLd data={schema} />
      <main className="sg-page">
        <Fil items={[{ label: "Accueil", href: "/" }, { label: "Classements", href: "/classements" }, { label: ind.court }]} />
        <h1 className="sg-h1">
          {ind.titre} <span>({annee})</span>
        </h1>
        <p className="sg-intro">
          En tête : {avec(premier.pays.fr)} ({ind.fmt(premier.m.v)}), devant {avec(lignes[1].pays.fr)} et {avec(lignes[2].pays.fr)}. {lignes.length} pays sont
          classés, chacun à sa dernière valeur publiée. {ind.definition}
        </p>
        <div className="sg-cta">
          <Link href={ind.rubrique.href} className="sg-bouton">{ind.rubrique.label}</Link>
          <Link href="/comparer" className="sg-bouton sg-bouton-2">Comparer des pays</Link>
        </div>

        <section className="sg-sec" aria-labelledby="sg-cl">
          <h2 id="sg-cl" className="sg-h2">Le classement complet</h2>
          <div className="sg-tab-w">
            <table className="sg-tab">
              <thead>
                <tr>
                  <th scope="col">Rang</th>
                  <th scope="col">Pays</th>
                  <th scope="col">{ind.court}</th>
                  <th scope="col">Année</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((l) => (
                  <tr key={l.pays.slug}>
                    <td>{l.rang}</td>
                    <th scope="row">
                      <Link href={`/pays/${l.pays.slug}`}>{drapeau(l.pays.iso2)} {l.pays.fr}</Link>
                    </th>
                    <td>{ind.fmt(l.m.v)}</td>
                    <td>{l.m.annee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="sg-note">
            Source : {ind.source}. Chaque pays figure à sa dernière valeur publiée ; un pays sans donnée n&apos;est pas classé. Voir la{" "}
            <Link href="/methodologie">méthodologie</Link>.
          </p>
        </section>

        <section className="sg-sec">
          <Faq titre={`Questions sur ${ind.nom}`} questions={faq} />
        </section>

        <section className="sg-sec" aria-labelledby="sg-autres">
          <h2 id="sg-autres" className="sg-h2">Les autres classements</h2>
          <ul className="sg-liens">
            {INDICATEURS.filter((i) => i.slug !== ind.slug).map((i) => (
              <li key={i.slug}><Link href={`/classements/${i.slug}`}>{i.court}</Link></li>
            ))}
            <li><Link href="/dette-publique/analyses/pays-les-plus-endettes">Dette publique</Link></li>
          </ul>
        </section>
      </main>
      <Pied />
    </div>
  );
}
