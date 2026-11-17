import type { Metadata } from "next";
import { AtlasMoyenOrient } from "@/components/conflits/moyen-orient/AtlasMoyenOrient";
import { ATLAS_MO, ARRET_MO, an, dateMO, nomPaysMO, statutMO } from "@/data/conflits/moyenOrient";
import { jsonLdString } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

const chemin = "/conflits/moyen-orient";

export const metadata: Metadata = {
  title: { absolute: "Conflits du Moyen-Orient : carte, chronologies et bilans sourcés | Datlas" },
  description:
    "Sept dossiers documentés sur les conflits du Moyen-Orient (Gaza, Cisjordanie, Liban, Syrie, Yémen et mer Rouge, Iran, Irak) : chronologies, acteurs, bilans datés et sourcés, carte non tactique.",
  alternates: { canonical: chemin },
  openGraph: { type: "website", url: `${SITE_URL}${chemin}`, title: "Atlas des conflits du Moyen-Orient | Datlas", description: "Chronologies, acteurs et bilans datés et sourcés, sur une carte non tactique." },
  robots: { index: true, follow: true },
};

/* Les textes des dossiers sont rendus par le serveur : ils se lisent et s'indexent sans attendre la carte. */
export default function Page() {
  const fil = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Conflits", item: `${SITE_URL}/conflits` },
      { "@type": "ListItem", position: 3, name: "Atlas du Moyen-Orient", item: `${SITE_URL}${chemin}` },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(fil) }} />
      <AtlasMoyenOrient>
        <section className="cg-section mo-textes" aria-labelledby="mo-dossiers-t">
          <div className="cg-wrap">
            <header className="v2-tete">
              <h2 id="mo-dossiers-t" className="v2-h2">Les {ATLAS_MO.conflicts.length} dossiers</h2>
              <p className="v2-sous">{`Photographie documentaire arrêtée au ${dateMO(ARRET_MO)}, à revalider à chaque nouvelle publication.`}</p>
            </header>
            <div className="mo-textes-l">
              {ATLAS_MO.conflicts.map((c) => (
                <article key={c.id} id={`dossier-${c.id}`} className="mo-texte">
                  <span className="mo-k"><i style={{ background: statutMO(c.status).couleur }} aria-hidden="true" />{statutMO(c.status).libelle} · depuis {an(c.started)} · {c.countries.map(nomPaysMO).join(", ")}</span>
                  <h3><a href={`${chemin}?dossier=${c.id}`}>{c.title}</a></h3>
                  <p>{c.overview}</p>
                  <p>{c.why}</p>
                </article>
              ))}
            </div>

            <div className="mo-methode">
              <div>
                <h3 className="mo-h3">Lire cette carte</h3>
                <ul className="mo-puces">
                  <li>{ATLAS_MO.safetyNote}</li>
                  <li>{ATLAS_MO.precisionPolicy}</li>
                  <li>{ATLAS_MO.countryCodeNote}</li>
                  <li>L’année filtre les dossiers, les jalons et les chiffres : rien de daté après elle n’est affiché. La carte n’est pas une reconstruction historique des frontières ni des fronts.</li>
                  <li>Aucun total régional n’est calculé : les périodes, les territoires et les méthodes diffèrent d’un chiffre à l’autre. Une valeur absente est « non documentée », jamais zéro.</li>
                </ul>
              </div>
              <div>
                <h3 className="mo-h3">Sources ({ATLAS_MO.sources.length})</h3>
                <ul className="mo-sources">
                  {ATLAS_MO.sources.map((s) => (
                    <li key={s.id}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">{s.organization}</a> · {s.title} · {dateMO(s.publishedOrUpdated)}
                    </li>
                  ))}
                </ul>
                <p className="mo-note">Fond de carte © OpenStreetMap, © CARTO.</p>
              </div>
            </div>
          </div>
        </section>
      </AtlasMoyenOrient>
    </>
  );
}
