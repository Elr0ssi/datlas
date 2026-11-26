import Link from "next/link";
import { EnTete, Pied } from "@/components/concept/pieces";
import { JsonLd } from "@/components/seo/Elements";
import { SITE_URL } from "@/lib/site";
import "@/components/concept/concept.css";
import "./legal.css";

/* ═══════════════════════════════════════════════════════════════════════════
   UNE PAGE DE RÉFÉRENCE (mentions légales, confidentialité, cookies, CGU,
   modération, accessibilité, méthodologie, sources)

   Un titre, une date de mise à jour, un sommaire cliquable, puis des sections
   ancrées (/confidentialite#droits) : chaque réponse a sa propre adresse, que
   l'on peut citer, et qu'un moteur ou un assistant peut renvoyer telle quelle.
   Le texte reste du HTML ordinaire, lisible sans JavaScript.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Bloc =
  | string
  | { liste: (string | React.ReactNode)[] }
  | { tableau: { entetes: string[]; lignes: (string | React.ReactNode)[][] } }
  | { noeud: React.ReactNode };

export interface SectionDoc {
  id: string;
  titre: string;
  blocs: Bloc[];
}

export function PageDoc({
  chemin,
  titre,
  chapo,
  maj,
  sections,
  type = "WebPage",
  apres,
}: {
  /** L'adresse de la page, « /mentions-legales ». */
  chemin: string;
  titre: string;
  chapo?: string;
  /** La date de dernière mise à jour, au format AAAA-MM-JJ. */
  maj: string;
  sections: SectionDoc[];
  /** Le type schema.org de la page : WebPage, AboutPage, ContactPage… */
  type?: string;
  apres?: React.ReactNode;
}) {
  const url = `${SITE_URL}${chemin}`;
  const date = new Date(`${maj}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const schema = [
    {
      "@type": type,
      "@id": `${url}#page`,
      url,
      name: titre,
      ...(chapo ? { description: chapo } : {}),
      inLanguage: "fr",
      dateModified: maj,
      isPartOf: { "@type": "WebSite", name: "Datlas", url: SITE_URL },
      publisher: { "@type": "Organization", name: "Datlas", url: SITE_URL },
      hasPart: sections.map((s) => ({ "@type": "WebPageElement", name: s.titre, url: `${url}#${s.id}` })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: titre, item: url },
      ],
    },
  ];

  return (
    <div className="cg lg">
      <EnTete />
      <JsonLd data={schema} />
      <main className="lg-col lg-doc">
        <nav className="lg-fil" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{titre}</span>
        </nav>
        <h1 className="lg-h1">{titre}</h1>
        {chapo && <p className="lg-chapo">{chapo}</p>}
        <p className="lg-maj">
          Dernière mise à jour : <time dateTime={maj}>{date}</time>
        </p>

        {sections.length > 3 && (
          <nav className="lg-som" aria-label="Sommaire">
            <p>Sommaire</p>
            <ol>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.titre}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="lg-sec">
            <h2>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <a href={`#${s.id}`}>{s.titre}</a>
            </h2>
            {s.blocs.map((b, j) => {
              if (typeof b === "string") return <p key={j}>{b}</p>;
              if ("liste" in b)
                return (
                  <ul key={j}>
                    {b.liste.map((x, k) => (
                      <li key={k}>{x}</li>
                    ))}
                  </ul>
                );
              if ("tableau" in b)
                return (
                  <div key={j} className="lg-tab">
                    <table>
                      <thead>
                        <tr>
                          {b.tableau.entetes.map((h) => (
                            <th key={h} scope="col">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {b.tableau.lignes.map((l, k) => (
                          <tr key={k}>
                            {l.map((c, m) => (
                              <td key={m} data-label={b.tableau.entetes[m]}>{c}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              return <div key={j}>{b.noeud}</div>;
            })}
          </section>
        ))}
        {apres}
      </main>
      <Pied />
    </div>
  );
}
