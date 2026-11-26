import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLong, Chapitre, Compteur, Figure, ListeQuestions } from "@/articles/dette/cadre";
import { Cles } from "@/components/ressources/article/Cles";
import type { ChapitreDef, Suggestion } from "@/articles/dette/cadre";
import { Continents, Courbe, Producteurs } from "@/components/ressources/article/Graphes";
import { JsonLd, schemaFaq, schemaFil } from "@/components/seo/Elements";
import { USAGES } from "@/data/ressources/usages";
import { analyseRessource, type Analyse, type Producteur } from "@/data/seo/ressourcesAnalyse";
import { pagesRessources, ressourceParSlug } from "@/data/seo/ressources";
import { aNom, avec, cap, deNom, nf } from "@/data/seo/francais";
import { SITE_URL, urlAbs } from "@/lib/site";

/* ═══════════════════════════════════════════════════════════════════════════
   L'ARTICLE D'UNE RESSOURCE (/ressources/<produit>)

   Le même format que l'article sur la dette de la France : un grand chiffre,
   un sommaire qui suit la lecture, des chapitres qui répondent chacun à une
   question, des figures qu'on manipule. Toutes les valeurs sont lues dans les
   fichiers FAOSTAT (src/data/seo/ressourcesAnalyse.ts).
   ═══════════════════════════════════════════════════════════════════════════ */

export const dynamicParams = false;
export const generateStaticParams = () => pagesRessources().map((r) => ({ produit: r.slug }));

/** « de blé », « d’huile d’olive », « d’avocats ». */
const de = (n: string) => (/^[aeiouyhâàéèêîïôûœ]/i.test(n) ? `d’${n}` : `de ${n}`);
function qte(v: number, unite: string): string {
  const u = unite === "t" ? "tonnes" : unite === "ha" ? "hectares" : unite;
  if (Math.abs(v) >= 1e9) return `${nf(v / 1e9, 2)} milliards de ${u}`;
  if (Math.abs(v) >= 1e6) return `${nf(v / 1e6, 1)} millions de ${u}`;
  if (Math.abs(v) >= 1e3) return `${nf(v / 1e3, 1)} milliers de ${u}`;
  return `${nf(v)} ${u}`;
}
const enT = (v: number) => (v >= 1e9 ? `${nf(v / 1e9, 2)} Md t` : v >= 1e6 ? `${nf(v / 1e6, 1)} M t` : v >= 1e3 ? `${nf(v / 1e3, 1)} k t` : `${nf(v)} t`);
const evo = (v: number) => `${v > 0 ? "+" : ""}${nf(v, 0)} %`;

function chargement(slug: string): { a: Analyse; nom: string } | null {
  const r = ressourceParSlug(slug);
  const a = r ? analyseRessource(r) : null;
  if (!r || !a || !a.producteurs.length) return null;
  return { a, nom: r.nom.toLowerCase() };
}

/** D'où vient l'avance d'un grand producteur : de ses surfaces, de son rendement, ou des deux. Lu dans les rangs. */
function moteur(p: Producteur, a: Analyse): string {
  const s = p.rangSurface;
  const r = p.rangRdt;
  const nom = cap(avec(p.fr));
  if (s && r && s <= 5 && r <= Math.max(5, Math.round(a.nRdt * 0.2)))
    return `${nom} cumule les deux atouts : ${s === 1 ? "la plus grande surface" : `la ${s}e surface`} (${qte(p.surface!, "ha")}) et un rendement ${r <= a.nRdt / 10 ? "parmi les plus élevés" : "élevé"} (${nf(p.rdt!)} ${a.uniteRdt}, ${r}e sur ${a.nRdt}).`;
  if (s && s <= 5 && (!r || r > a.nRdt / 3))
    return `L'avance ${deNom(p.fr)} tient d'abord à ses surfaces : ${s === 1 ? "la plus grande du monde" : `${s}e surface mondiale`} (${qte(p.surface!, "ha")}), avec un rendement ${r ? `plus modeste (${nf(p.rdt!)} ${a.uniteRdt}, ${r}e sur ${a.nRdt})` : "non publié"}.`;
  if (r && r <= a.nRdt / 4)
    return `${nom} produit beaucoup sur une surface ${s ? `moins étendue (${s}e)` : "limitée"} grâce à un rendement élevé : ${nf(p.rdt!)} ${a.uniteRdt}, ${r}e sur ${a.nRdt}.`;
  if (p.rdt && a.uniteRdt) return `${nom} combine ${s ? `une surface classée ${s}e` : "sa surface"} et un rendement de ${nf(p.rdt)} ${a.uniteRdt}${r ? ` (${r}e sur ${a.nRdt})` : ""}.`;
  return `${nom} pèse ${nf(p.part ?? 0, 1)} % de la production mondiale.`;
}

function faqDe(a: Analyse, nom: string) {
  const [p1, p2, p3] = a.producteurs;
  const f: { q: string; r: string }[] = [
    { q: `Quel pays produit le plus ${de(nom)} ?`, r: `${cap(avec(p1.fr))}, avec ${qte(p1.valeur, a.unite)} en ${a.annee}${p1.part !== null ? `, soit ${nf(p1.part, 1)} % du total` : ""}${p2 ? `, devant ${avec(p2.fr)}` : ""}${p3 ? ` et ${avec(p3.fr)}` : ""}. Source : FAOSTAT.` },
    { q: `Quelle est la production mondiale ${de(nom)} ?`, r: `${qte(a.total, a.unite)} en ${a.annee}, total recalculé par Datlas en additionnant les ${a.entites} pays et territoires publiés par FAOSTAT (ce n'est pas un total officiel).` },
    { q: `La production ${de(nom)} est-elle concentrée ?`, r: `Les trois premiers producteurs réalisent ${nf(a.concentration.top3, 0)} % de la production mondiale, et les dix premiers ${nf(a.concentration.top10, 0)} %, sur ${a.nProducteurs} pays producteurs.` },
  ];
  const meilleur = a.rendements[0];
  if (meilleur && a.uniteRdt) f.push({ q: `Quel pays a le meilleur rendement ${de(nom)} ?`, r: `Parmi les 25 premiers producteurs, le rendement le plus élevé revient ${aNom(meilleur.fr)} : ${nf(meilleur.rdt!)} ${a.uniteRdt} en ${a.annee}${a.medianeRdt ? `, contre ${nf(a.medianeRdt)} ${a.uniteRdt} pour le producteur médian` : ""}.` });
  if (a.france) f.push({ q: `Quelle est la place de la France dans la production ${de(nom)} ?`, r: `La France a produit ${qte(a.france.valeur, a.unite)} en ${a.annee}, ce qui la place au ${a.france.rang === 1 ? "1er" : `${a.france.rang}e`} rang mondial sur ${a.nProducteurs}.` });
  return f;
}

export async function generateMetadata({ params }: { params: Promise<{ produit: string }> }): Promise<Metadata> {
  const c = chargement((await params).produit);
  if (!c) return {};
  const { a, nom } = c;
  const [p1, p2] = a.producteurs;
  return {
    title: { absolute: `Production mondiale ${de(nom)} (${a.annee}) : premiers producteurs | Datlas` },
    description: `${a.r.nom} : ${qte(a.total, a.unite)} dans le monde en ${a.annee}. En tête : ${avec(p1.fr)}${p2 ? `, devant ${avec(p2.fr)}` : ""}. Classement, évolution depuis ${a.a0}, rendements.`.slice(0, 158),
    alternates: { canonical: `/ressources/${a.r.slug}` },
    openGraph: { type: "article", url: urlAbs(`/ressources/${a.r.slug}`), title: `Production mondiale ${de(nom)} (${a.annee})` },
  };
}

export default async function Page({ params }: { params: Promise<{ produit: string }> }) {
  const c = chargement((await params).produit);
  if (!c) notFound();
  const { a, nom } = c;
  const r = a.r;
  const [p1, p2, p3] = a.producteurs;
  const url = urlAbs(`/ressources/${r.slug}`);
  const usages = USAGES[r.id];
  const premier = a.monde[0];
  const fois = premier && premier.v > 0 ? a.total / premier.v : null;
  const src = { source: `${a.source.nom}${a.source.date_export ? `, export du ${new Date(a.source.date_export).toLocaleDateString("fr-FR")}` : ""}`, url: a.source.url };
  const asie = (an: number) => a.continents.find((x) => x.annee === an)?.parts.find((p) => p.continent === "Asie")?.part;
  const cont0 = a.continents[0];
  const contN = a.continents[a.continents.length - 1];
  const tete = (d: typeof contN) => [...d.parts].sort((x, y) => y.part - x.part)[0];
  const faq = faqDe(a, nom);

  const chapitres: ChapitreDef[] = [
    { id: "essentiel", court: "L'essentiel" },
    { id: "producteurs", court: "Qui produit" },
    { id: "evolution", court: "Depuis " + a.a0 },
    { id: "comparaison", court: "Les grands producteurs" },
    ...(a.continents.length > 1 ? [{ id: "continents", court: "Par continent" }] : []),
    { id: "avantages", court: "D'où vient l'avance" },
    ...(a.hausses.length || a.baisses.length ? [{ id: "dynamiques", court: "Qui progresse" }] : []),
    ...(usages ? [{ id: "usages", court: "À quoi ça sert" }] : []),
    ...(a.france ? [{ id: "france", court: "La France" }] : []),
    { id: "questions", court: "Questions" },
  ];
  const autres = pagesRessources().filter((x) => x.slug !== r.slug);
  const suggestions: Suggestion[] = [
    ...(p1.lien ? [{ href: p1.lien, titre: `Les ressources ${deNom(p1.fr)}`, rubrique: "Pays" }] : []),
    ...autres.slice(0, 2).map((x) => ({ href: `/ressources/${x.slug}`, titre: `Production mondiale ${de(x.nom.toLowerCase())}`, rubrique: "Ressource" })),
    { href: `/ressources?produit=${r.id}`, titre: `${r.nom} sur le globe`, rubrique: "Globe" },
  ];

  const schema = [
    schemaFil([
      { label: "Accueil", url: SITE_URL },
      { label: "Ressources", url: urlAbs("/ressources") },
      { label: r.nom, url },
    ]),
    {
      "@type": "Article",
      headline: `Production mondiale ${de(nom)} (${a.annee})`,
      url,
      inLanguage: "fr",
      about: r.nom,
      author: { "@type": "Organization", name: "Datlas", url: SITE_URL },
      publisher: { "@type": "Organization", name: "Datlas", url: SITE_URL },
      isBasedOn: a.source.url,
    },
    {
      "@type": "Dataset",
      name: `Production mondiale ${de(nom)} par pays, ${a.a0}-${a.annee}`,
      description: `Production${a.aSurface ? ", surface récoltée" : ""}${a.uniteRdt ? " et rendement" : ""} ${de(nom)} par pays, d'après FAOSTAT.`,
      url,
      inLanguage: "fr",
      temporalCoverage: `${a.a0}/${a.annee}`,
      spatialCoverage: "Monde",
      isAccessibleForFree: true,
      creator: { "@type": "Organization", name: "Datlas", url: SITE_URL },
      isBasedOn: a.source.url,
    },
    schemaFaq(faq),
  ];

  const top = a.producteurs.slice(0, 15).map((p) => ({ fr: p.fr, lien: p.lien, valeur: p.valeur, part: p.part, evolution: p.evolution, rdt: p.rdt, rangRdt: p.rangRdt, surface: p.surface, rangSurface: p.rangSurface }));
  const decimales = a.total >= 1e9 ? 2 : 1;
  const [echelle, abr] = a.total >= 1e9 ? [1e9, "Md t"] : a.total >= 1e6 ? [1e6, "M t"] : [1e3, "k t"];

  return (
    <>
      <JsonLd data={schema} />
      <ArticleLong
        actif="Ressources"
        methode="/methodologie"
        fil={[{ label: "Accueil", href: "/" }, { label: "Ressources", href: "/ressources" }, { label: r.nom }]}
        surtitre={`Production mondiale ${de(nom)} en ${a.annee}`}
        chiffre={
          <>
            <Compteur valeur={a.total / echelle} decimales={decimales} />
            <small>{abr}</small>
          </>
        }
        chapo={
          <>
            <b>{cap(avec(p1.fr))}</b> en tête, devant {avec(p2?.fr ?? "")}{p3 ? ` et ${avec(p3.fr)}` : ""}. {a.nProducteurs} pays producteurs, données FAOSTAT.
          </>
        }
        chapitres={chapitres}
        suggestions={suggestions}
        sources={`${a.source.nom}. Totaux mondiaux recalculés par Datlas (somme des pays publiés), l'agrégat « Chine » de FAOSTAT exclu pour ne pas compter deux fois la Chine continentale et Taïwan.`}
      >
        <Chapitre
          id="essentiel"
          titre={`Production mondiale ${de(nom)} : les chiffres clés`}
          reponse={
            <>
              Le monde a produit <b>{qte(a.total, a.unite)}</b> {de(nom)} en {a.annee}
              {fois && fois > 1.05 ? <>, {nf(fois, 1)} fois plus qu&apos;en {premier.annee}</> : null}.
            </>
          }
        >
          <Cles
            cartes={[
              { icone: "globe" as const, valeur: a.unite === "t" ? enT(a.total) : qte(a.total, a.unite), libelle: `produits dans le monde en ${a.annee}`, texte: `Somme des ${a.entites} pays et territoires publiés par FAOSTAT.` },
              { icone: "couronne" as const, valeur: `${nf(p1.part ?? 0, 1)} %`, libelle: `de la production pour ${avec(p1.fr)}`, texte: `Premier producteur mondial, avec ${qte(p1.valeur, a.unite)}.` },
              { icone: "couches" as const, valeur: `${nf(a.concentration.top3, 0)} %`, libelle: "pour les trois premiers", texte: `Les dix premiers : ${nf(a.concentration.top10, 0)} %.` },
              ...(fois ? [{ icone: "hausse" as const, valeur: `× ${nf(fois, 1)}`, libelle: `depuis ${premier.annee}`, texte: `${qte(premier.v, a.unite)} en ${premier.annee}.` }] : []),
              { icone: "barres" as const, valeur: String(a.nProducteurs), libelle: "pays producteurs", texte: `Classés à leur valeur ${a.annee}.` },
              ...(a.medianeRdt && a.uniteRdt ? [{ icone: "pousse" as const, valeur: `${nf(a.medianeRdt)} ${a.uniteRdt}`, libelle: `${a.libelleRdt.toLowerCase()} médian`, texte: `Parmi les ${a.nRdt} producteurs qui pèsent au moins 0,1 %.` }] : []),
            ]}
          />
        </Chapitre>

        <Chapitre
          id="producteurs"
          titre={`Quels pays produisent le plus ${de(nom)} ?`}
          reponse={
            <>
              {cap(avec(p1.fr))} ({nf(p1.part ?? 0, 1)} %), {avec(p2?.fr ?? "")}{p3 ? <> et {avec(p3.fr)}</> : null} produisent ensemble{" "}
              <b>{nf(a.concentration.top3, 0)} %</b> {de(nom)} du monde.
            </>
          }
        >
          <Figure
            id="premiers-producteurs"
            titre={`Les 15 premiers producteurs ${de(nom)}`}
            legende="Triez par production, part du total, évolution sur dix ans, rendement ou surface ; touchez un pays pour le détail."
            source={src}
          >
            <Producteurs lignes={top} unite={a.unite} uniteRdt={a.uniteRdt} libelleRdt={a.libelleRdt} annee={a.annee} nRdt={a.nRdt} />
          </Figure>
        </Chapitre>

        <Chapitre
          id="evolution"
          titre={`Production mondiale ${de(nom)} depuis ${a.a0}`}
          reponse={
            premier ? (
              <>
                De {qte(premier.v, a.unite)} en {premier.annee} à <b>{qte(a.total, a.unite)}</b> en {a.annee}.
              </>
            ) : undefined
          }
        >
          <Figure id="production-mondiale" titre={`Production mondiale ${de(nom)}, ${a.a0}-${a.annee}`} legende="Parcourez la courbe pour lire chaque année. Total recalculé à partir des pays publiés." source={src}>
            <Courbe series={[{ nom: "Monde", points: a.monde }]} unite={a.unite} />
          </Figure>
        </Chapitre>

        <Chapitre
          id="comparaison"
          titre={`Les grands producteurs ${de(nom)}, année par année`}
          reponse={<>Allumez ou éteignez les pays, et passez en indice pour comparer leur croissance depuis leur première année publiée.</>}
        >
          <Figure id="grands-producteurs" titre={`Production ${de(nom)} des premiers pays`} legende="Une année que la source ne publie pas pour un pays coupe sa courbe." source={src}>
            <Courbe series={a.producteurs.slice(0, 8).filter((p) => p.serie.length).map((p) => ({ nom: p.fr, points: p.serie }))} unite={a.unite} base100 />
          </Figure>
        </Chapitre>

        {a.continents.length > 1 && (
          <Chapitre
            id="continents"
            titre={`La production ${de(nom)} par continent`}
            reponse={
              <>
                {tete(contN).continent} produit <b>{nf(tete(contN).part, 0)} %</b> {de(nom)} du monde en {contN.annee}
                {tete(cont0).continent !== tete(contN).continent ? <>, quand {tete(cont0).continent} dominait en {cont0.annee} ({nf(tete(cont0).part, 0)} %)</> : asie(cont0.annee) !== undefined && asie(contN.annee) !== undefined ? <> ; l&apos;Asie pesait {nf(asie(cont0.annee)!, 0)} % en {cont0.annee}</> : null}.
              </>
            }
          >
            <Figure id="continents-graphe" titre={`Part de chaque continent dans la production ${de(nom)}`} legende="Somme des pays et entités historiques de chaque continent, à quelques dates repères." source={src}>
              <Continents dates={a.continents} />
            </Figure>
          </Chapitre>
        )}

        <Chapitre id="avantages" titre={`D'où vient l'avance des premiers producteurs ${de(nom)} ?`} reponse={<>Produire beaucoup, c&apos;est cultiver ou élever à grande échelle, obtenir de hauts rendements, ou les deux. Voici ce que disent les données pour les trois premiers.</>}>
          <div className="ra-avantages">
            {a.producteurs.slice(0, 3).map((p) => (
              <div key={p.m49} className="ra-avantage">
                <b className="ra-av-t">
                  {p.rang}. {p.fr}
                </b>
                <p>{moteur(p, a)}</p>
                {p.lien && (
                  <p>
                    <a href={p.lien}>Toutes ses ressources →</a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </Chapitre>

        {(a.hausses.length > 0 || a.baisses.length > 0) && (
          <Chapitre id="dynamiques" titre={`Qui progresse, qui recule dans la production ${de(nom)} ?`} reponse={<>Évolution sur dix ans ({a.annee - 10}-{a.annee}), parmi les pays qui pèsent au moins 0,5 % du total.</>}>
            <div className="ra-mouv">
              {a.hausses.length > 0 && (
                <div>
                  <h3>Les plus fortes hausses</h3>
                  <ol>
                    {a.hausses.map((p) => (
                      <li key={p.m49}>
                        {p.lien ? <a href={p.lien}>{p.fr}</a> : p.fr} <b className="ra-plus">{evo(p.evolution!)}</b>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {a.baisses.length > 0 && (
                <div>
                  <h3>Les plus fortes baisses</h3>
                  <ol>
                    {a.baisses.map((p) => (
                      <li key={p.m49}>
                        {p.lien ? <a href={p.lien}>{p.fr}</a> : p.fr} <b className="ra-moins">{evo(p.evolution!)}</b>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </Chapitre>
        )}

        {usages && (
          <Chapitre id="usages" titre={`À quoi sert la production ${de(nom)} ?`} reponse={<>{usages.conditions}</>}>
            <ul className="ra-usages">
              {usages.usages.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </Chapitre>
        )}

        {a.france && (
          <Chapitre
            id="france"
            titre={`La France dans la production mondiale ${de(nom)}`}
            reponse={
              <>
                La France est <b>{a.france.rang === 1 ? "1re" : `${a.france.rang}e`}</b> sur {a.nProducteurs}, avec {qte(a.france.valeur, a.unite)} en {a.annee}
                {a.france.evolution !== null ? <> ({evo(a.france.evolution)} sur dix ans)</> : null}.
              </>
            }
          >
            <Figure id="france-graphe" titre={`Production ${de(nom)} de la France`} legende="Parcourez la courbe pour lire chaque année." source={src}>
              <Courbe series={[{ nom: "France", points: a.france.serie }]} unite={a.unite} />
            </Figure>
            <p>
              <a href="/pays/france/ressources">Toutes les ressources de la France →</a>
            </p>
          </Chapitre>
        )}

        <Chapitre id="questions" titre={`Questions sur la production ${de(nom)}`}>
          <ListeQuestions questions={faq} />
        </Chapitre>
      </ArticleLong>
    </>
  );
}
