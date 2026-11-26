import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Faq, Fil, JsonLd, schemaFaq, schemaFil } from "@/components/seo/Elements";
import { ficheRessource, pagesRessources, ressourceParSlug, type LigneProd } from "@/data/seo/ressources";
import { aNom, avec, cap, nf } from "@/data/seo/francais";
import { SITE_URL, urlAbs } from "@/lib/site";
import "@/components/concept/concept.css";
import "@/components/seo/seo.css";

export const dynamicParams = false;
export const generateStaticParams = () => pagesRessources().map((r) => ({ produit: r.slug }));

/** Une quantité lisible : 798 455 265 t → « 798,5 millions de tonnes ». */
function qte(v: number, unite: string): string {
  const u = unite === "t" ? "tonnes" : unite === "ha" ? "hectares" : unite;
  if (Math.abs(v) >= 1e9) return `${nf(v / 1e9, 2)} milliards de ${u}`;
  if (Math.abs(v) >= 1e6) return `${nf(v / 1e6, 1)} millions de ${u}`;
  if (Math.abs(v) >= 1e3) return `${nf(v / 1e3, 1)} milliers de ${u}`;
  return `${nf(v)} ${u}`;
}
const court = (v: number, unite: string) => (Math.abs(v) >= 1e6 ? `${nf(v / 1e6, 1)} M ${unite}` : `${nf(v)} ${unite}`);
const evo = (v: number | null) => (v === null ? "–" : `${v > 0 ? "+" : ""}${nf(v, 0)} %`);
/** « de blé », « d'huile d'olive », « d'avocats ». */
const de = (n: string) => (/^[aeiouyhâàéèêîïôûœ]/i.test(n) ? `d’${n}` : `de ${n}`);
const nomDe = (l: LigneProd) => (l.lien ? <Link href={l.lien}>{l.fr}</Link> : l.fr);

export async function generateMetadata({ params }: { params: Promise<{ produit: string }> }): Promise<Metadata> {
  const r = ressourceParSlug((await params).produit);
  const f = r ? ficheRessource(r) : null;
  if (!r || !f) return {};
  const [a, b] = f.producteurs;
  const nom = r.nom.toLowerCase();
  return {
    title: { absolute: `Production mondiale ${de(nom)} (${f.annee}) : premiers producteurs | Datlas` },
    description: `${r.nom} : ${f.total ? qte(f.total.valeur, f.unite) : "production"} dans le monde en ${f.annee}. ${a ? `En tête : ${avec(a.fr)}` : ""}${b ? `, devant ${avec(b.fr)}` : ""}. Classement par pays et rendements, données FAOSTAT.`.slice(0, 158),
    alternates: { canonical: `/ressources/${r.slug}` },
    openGraph: { type: "article", url: urlAbs(`/ressources/${r.slug}`), title: `Production mondiale ${de(nom)} (${f.annee})` },
  };
}

export default async function Page({ params }: { params: Promise<{ produit: string }> }) {
  const r = ressourceParSlug((await params).produit);
  const f = r ? ficheRessource(r) : null;
  if (!r || !f || !f.producteurs.length) notFound();
  const nom = r.nom.toLowerCase();
  const top = f.producteurs.slice(0, 20);
  const [p1, p2, p3] = f.producteurs;
  const part3 = f.producteurs.slice(0, 3).reduce((s, l) => s + (l.part ?? 0), 0);
  const evo10 = f.total && f.total10 ? ((f.total.valeur - f.total10.valeur) / f.total10.valeur) * 100 : null;
  const fois1961 = f.total && f.total1961 && f.total1961.valeur > 0 ? f.total.valeur / f.total1961.valeur : null;
  const france = f.producteurs.find((l) => l.m49 === "250");
  const meilleurRdt = f.rendements[0];
  const url = urlAbs(`/ressources/${r.slug}`);
  const src = f.jeu.source;

  const faq = [
    { q: `Quel pays produit le plus ${de(nom).replace(/^de /, "de ")} ?`, r: `${cap(avec(p1.fr))}, avec ${qte(p1.valeur, f.unite)} en ${f.annee}${p1.part !== null ? `, soit ${nf(p1.part, 1)} % du total` : ""}${p2 ? `, devant ${avec(p2.fr)} (${qte(p2.valeur, f.unite)})` : ""}${p3 ? ` et ${avec(p3.fr)} (${qte(p3.valeur, f.unite)})` : ""}. Source : FAOSTAT.` },
    ...(f.total ? [{ q: `Quelle est la production mondiale ${de(nom)} ?`, r: `${qte(f.total.valeur, f.unite)} en ${f.annee}, total recalculé par Datlas en additionnant les ${f.total.entites} pays et territoires publiés par FAOSTAT (ce n'est pas un total officiel).${evo10 !== null ? ` C'est ${evo10 >= 0 ? "une hausse" : "une baisse"} de ${nf(Math.abs(evo10), 0)} % en dix ans.` : ""}` }] : []),
    ...(meilleurRdt && f.uniteRendement ? [{ q: `Quel pays a le meilleur rendement ${de(nom)} ?`, r: `Parmi les 25 premiers producteurs, le rendement le plus élevé revient ${aNom(meilleurRdt.fr)} : ${nf(meilleurRdt.valeur)} ${f.uniteRendement} en ${f.annee}.` }] : []),
    ...(france ? [{ q: `Quelle est la place de la France dans la production ${de(nom)} ?`, r: `La France a produit ${qte(france.valeur, f.unite)} en ${f.annee}, ce qui la place au ${france.rang === 1 ? "1er" : `${france.rang}e`} rang mondial sur ${f.producteurs.length}.` }] : []),
  ];

  const schema = [
    schemaFil([
      { label: "Accueil", url: SITE_URL },
      { label: "Ressources", url: urlAbs("/ressources") },
      { label: r.nom, url },
    ]),
    {
      "@type": "Dataset",
      name: `Production mondiale ${de(nom)} par pays, ${f.jeu.annees[0]}-${f.annee}`,
      description: `Production${f.jeu.indicateurs.surface ? ", surface récoltée" : ""}${f.jeu.indicateurs.rendement ? " et rendement" : ""} ${de(nom)} par pays, d'après FAOSTAT.`,
      url,
      inLanguage: "fr",
      temporalCoverage: `${f.jeu.annees[0]}/${f.annee}`,
      spatialCoverage: "Monde",
      isAccessibleForFree: true,
      creator: { "@type": "Organization", name: "Datlas", url: SITE_URL },
      isBasedOn: src.url,
      citation: src.nom,
    },
    schemaFaq(faq),
  ];

  return (
    <div className="cg sg">
      <EnTete />
      <JsonLd data={schema} />
      <main className="sg-page">
        <Fil items={[{ label: "Accueil", href: "/" }, { label: "Ressources", href: "/ressources" }, { label: r.nom }]} />
        <h1 className="sg-h1">
          Production mondiale {de(nom)} <span>({f.annee})</span>
        </h1>
        <p className="sg-intro">
          {f.total ? `Le monde a produit ${qte(f.total.valeur, f.unite)} ${de(nom)} en ${f.annee}. ` : ""}
          Premier producteur : {avec(p1.fr)}{p2 ? `, devant ${avec(p2.fr)}` : ""}{p3 ? ` et ${avec(p3.fr)}` : ""}
          {part3 > 0 ? ` ; à eux trois, ${nf(part3, 0)} % de la production.` : "."}
          {fois1961 && fois1961 > 1.05 ? ` La production a été multipliée par ${nf(fois1961, 1)} depuis ${f.jeu.annees[0]}.` : ""}
        </p>
        <div className="sg-cta">
          <Link href={`/ressources?produit=${r.id}`} className="sg-bouton">Voir sur le globe</Link>
          <Link href="/classements" className="sg-bouton sg-bouton-2">Tous les classements</Link>
        </div>

        <section className="sg-sec" aria-labelledby="sg-prod">
          <h2 id="sg-prod" className="sg-h2">Les premiers producteurs {de(nom)}</h2>
          <div className="sg-tab-w">
            <table className="sg-tab">
              <thead>
                <tr>
                  <th scope="col">Rang</th>
                  <th scope="col">Pays</th>
                  <th scope="col">Production {f.annee}</th>
                  <th scope="col">Part du total</th>
                  <th scope="col">Sur 10 ans</th>
                </tr>
              </thead>
              <tbody>
                {top.map((l) => (
                  <tr key={l.m49}>
                    <td>{l.rang}</td>
                    <th scope="row">{nomDe(l)}</th>
                    <td>{court(l.valeur, f.unite)}{l.flag !== "A" && l.flag !== " " ? <small>{l.flag === "E" ? "estimée" : l.flag === "I" ? "imputée" : l.flag === "X" ? "source externe" : ""}</small> : null}</td>
                    <td>{l.part === null ? "–" : `${nf(l.part, 1)} %`}</td>
                    <td>{evo(l.evolution)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {f.rendements.length > 0 && f.uniteRendement && (
          <section className="sg-sec" aria-labelledby="sg-rdt">
            <h2 id="sg-rdt" className="sg-h2">Les meilleurs rendements parmi les grands producteurs</h2>
            <div className="sg-tab-w">
              <table className="sg-tab">
                <thead>
                  <tr>
                    <th scope="col">Pays</th>
                    <th scope="col">Rendement {f.annee}</th>
                  </tr>
                </thead>
                <tbody>
                  {f.rendements.slice(0, 10).map((l) => (
                    <tr key={l.m49}>
                      <th scope="row">{nomDe(l)}</th>
                      <td>{nf(l.valeur)} {f.uniteRendement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="sg-sec">
          <Faq titre={`Questions sur la production ${de(nom)}`} questions={faq} />
        </section>

        <section className="sg-sec" aria-labelledby="sg-autres">
          <h2 id="sg-autres" className="sg-h2">Les autres ressources</h2>
          <ul className="sg-liens">
            {pagesRessources().filter((x) => x.slug !== r.slug).map((x) => (
              <li key={x.slug}><Link href={`/ressources/${x.slug}`}>{x.nom}</Link></li>
            ))}
          </ul>
        </section>

        <p className="sg-note">
          Source : <a href={src.url} rel="noopener">{src.nom}</a>{src.date_export ? `, export du ${new Date(src.date_export).toLocaleDateString("fr-FR")}` : ""}. Les totaux mondiaux sont
          recalculés par Datlas (somme des pays et territoires publiés) ; l&apos;agrégat « Chine » de FAOSTAT est exclu pour ne pas compter deux fois la Chine
          continentale et Taïwan. Voir la <Link href="/methodologie">méthodologie</Link>.
        </p>
      </main>
      <Pied />
    </div>
  );
}
