import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Faq, Fil, JsonLd, schemaFaq, schemaFil } from "@/components/seo/Elements";
import { TablePays, type LigneRP } from "@/components/ressources/article/TablePays";
import { paysAvecRessources, ressourcesDuPays, serieDuPays } from "@/data/seo/ressourcesAnalyse";
import { paysParSlug } from "@/data/seo/pays";
import { deNom, nf } from "@/data/seo/francais";
import { drapeau } from "@/lib/drapeau";
import { SITE_URL, urlAbs } from "@/lib/site";
import "@/components/concept/concept.css";
import "@/components/seo/seo.css";

/* ═══════════════════════════════════════════════════════════════════════════
   LES RESSOURCES D'UN PAYS (/pays/<pays>/ressources)

   Pour chaque ressource suivie : le rang mondial du pays, sa part, son
   évolution sur dix ans, son rendement face au producteur médian. Ses
   « points forts » sont ceux où il se classe dans le top 10 ou pèse au moins
   5 % du monde : tout est lu dans les fichiers FAOSTAT.
   ═══════════════════════════════════════════════════════════════════════════ */

export const dynamicParams = false;
export const generateStaticParams = () => paysAvecRessources().map((slug) => ({ slug }));

const rangTxt = (r: number) => (r === 1 ? "1er" : `${r}e`);
const nomRes = (n: string) => n.toLowerCase();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = paysParSlug(slug);
  const l = ressourcesDuPays(slug);
  if (!p || !l.length) return {};
  const forts = l.filter((x) => x.p.rang <= 10).slice(0, 3).map((x) => `${nomRes(x.r.nom)} (${rangTxt(x.p.rang)})`);
  return {
    title: { absolute: `Ressources ${deNom(p.fr)} : production agricole et classement | Datlas` },
    description: `${l.length} ressources suivies par Datlas sont produites dans ce pays${forts.length ? `. Points forts : ${forts.join(", ")}` : ""}. Rang mondial, part et évolution, FAOSTAT.`.slice(0, 158),
    alternates: { canonical: `/pays/${slug}/ressources` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = paysParSlug(slug);
  const liste = ressourcesDuPays(slug);
  if (!p || !liste.length) notFound();
  const forts = liste.filter((x) => x.p.rang <= 10 || (x.p.part ?? 0) >= 5);
  const meilleur = liste[0];
  const url = urlAbs(`/pays/${slug}/ressources`);

  const lignes: LigneRP[] = liste.map((x) => ({
    slug: x.r.slug,
    nom: x.r.nom,
    annee: x.annee,
    unite: x.unite,
    rang: x.p.rang,
    n: x.n,
    valeur: x.p.valeur,
    part: x.p.part,
    evolution: x.p.evolution,
    rdt: x.p.rdt,
    rangRdt: x.p.rangRdt,
    nRdt: x.nRdt,
    uniteRdt: x.uniteRdt,
    medianeRdt: x.medianeRdt,
    serie: serieDuPays(x.r, x.p.m49),
  }));

  const hausses = liste.filter((x) => x.p.evolution !== null && x.p.evolution > 0).sort((a, b) => b.p.evolution! - a.p.evolution!);
  const faq = [
    { q: `Quelles sont les principales productions agricoles ${deNom(p.fr)} ?`, r: `Parmi les ${liste.length} ressources suivies, les meilleurs classements ${deNom(p.fr)} sont : ${liste.slice(0, 3).map((x) => `${nomRes(x.r.nom)} (${rangTxt(x.p.rang)} sur ${x.n})`).join(", ")}. Source : FAOSTAT, ${meilleur.annee}.` },
    ...(forts.length
      ? [{ q: `Quels sont les points forts ${deNom(p.fr)} dans la production mondiale ?`, r: forts.map((x) => `${x.r.nom} : ${rangTxt(x.p.rang)}${x.p.part !== null ? `, ${nf(x.p.part, 1)} % du monde` : ""}`).join(" ; ") + "." }]
      : []),
    ...(hausses.length ? [{ q: `Quelle production ${deNom(p.fr)} progresse le plus ?`, r: `Sur dix ans, la plus forte hausse concerne ${nomRes(hausses[0].r.nom)} (+${nf(hausses[0].p.evolution!, 0)} %).` }] : []),
  ];

  const schema = [
    schemaFil([
      { label: "Accueil", url: SITE_URL },
      { label: "Pays", url: urlAbs("/pays") },
      { label: p.fr, url: urlAbs(`/pays/${slug}`) },
      { label: "Ressources", url },
    ]),
    {
      "@type": "Dataset",
      name: `Production agricole ${deNom(p.fr)} : classement mondial par ressource`,
      description: `Rang mondial, production, part du monde, évolution sur dix ans et rendement ${deNom(p.fr)} pour ${liste.length} ressources, d'après FAOSTAT.`,
      url,
      inLanguage: "fr",
      spatialCoverage: p.fr,
      isAccessibleForFree: true,
      creator: { "@type": "Organization", name: "Datlas", url: SITE_URL },
      isBasedOn: "https://www.fao.org/faostat/en/#data/QCL",
    },
    schemaFaq(faq),
  ];

  return (
    <div className="cg sg">
      <EnTete />
      <JsonLd data={schema} />
      <main className="sg-page">
        <Fil items={[{ label: "Accueil", href: "/" }, { label: "Pays", href: "/pays" }, { label: p.fr, href: `/pays/${slug}` }, { label: "Ressources" }]} />
        <h1 className="sg-h1">
          <span className="sg-drap">{drapeau(p.iso2)}</span>Les ressources <span>{deNom(p.fr)}</span>
        </h1>
        <p className="sg-intro">
          {liste.length} ressources suivies par Datlas sont produites dans ce pays. Le meilleur classement {deNom(p.fr)} : {nomRes(meilleur.r.nom)}, {rangTxt(meilleur.p.rang)} producteur
          mondial sur {meilleur.n}
          {meilleur.p.part !== null ? ` (${nf(meilleur.p.part, 1)} % du monde)` : ""}.
          {forts.length > 1 ? ` Au total, ${forts.length} ressources figurent dans le top 10 mondial ou dépassent 5 % de la production.` : ""}
        </p>
        <div className="sg-cta">
          <Link href={`/pays/${slug}`} className="sg-bouton">La fiche {deNom(p.fr)}</Link>
          <Link href="/ressources" className="sg-bouton sg-bouton-2">Le globe des ressources</Link>
        </div>

        {forts.length > 0 && (
          <section className="sg-sec" aria-labelledby="rp-forts">
            <h2 id="rp-forts" className="sg-h2">Ses points forts</h2>
            <div className="ra-forts">
              {forts.slice(0, 8).map((x) => (
                <Link key={x.r.slug} href={`/ressources/${x.r.slug}`} className="ra-fort">
                  <small>{x.r.nom}</small>
                  <b>{rangTxt(x.p.rang)} mondial</b>
                  <span>{x.p.part !== null ? `${nf(x.p.part, 1)} % de la production` : `sur ${x.n} producteurs`}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="sg-sec" aria-labelledby="rp-tout">
          <h2 id="rp-tout" className="sg-h2">Toutes ses ressources</h2>
          <TablePays lignes={lignes} />
          <p className="sg-note">
            Source : FAOSTAT, Crops and livestock products (QCL). Le rang compare le pays aux autres producteurs la même année ; le rendement n&apos;est classé que parmi les
            producteurs qui pèsent au moins 0,1 % du total. Voir la <Link href="/methodologie">méthodologie</Link>.
          </p>
        </section>

        <section className="sg-sec">
          <Faq titre={`Questions sur les ressources ${deNom(p.fr)}`} questions={faq} />
        </section>
      </main>
      <Pied />
    </div>
  );
}
