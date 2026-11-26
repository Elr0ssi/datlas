import type { Metadata } from "next";
import Link from "next/link";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Fil, JsonLd, schemaFil } from "@/components/seo/Elements";
import { classementDe, INDICATEURS } from "@/data/seo/classements";
import { drapeau } from "@/lib/drapeau";
import { SITE_URL, urlAbs } from "@/lib/site";
import "@/components/concept/concept.css";
import "@/components/seo/seo.css";

export const metadata: Metadata = {
  title: { absolute: "Classements des pays du monde : PIB, population, chômage | Datlas" },
  description: "Tous les classements mondiaux de Datlas : PIB, PIB par habitant, population, inflation, chômage, natalité, mortalité, densité, dette publique.",
  alternates: { canonical: "/classements" },
};

export default function Page() {
  const blocs = INDICATEURS.map((i) => ({ i, ...classementDe(i) }));
  return (
    <div className="cg sg">
      <EnTete />
      <JsonLd
        data={[
          schemaFil([{ label: "Accueil", url: SITE_URL }, { label: "Classements", url: urlAbs("/classements") }]),
          { "@type": "CollectionPage", name: "Classements des pays du monde", url: urlAbs("/classements"), hasPart: INDICATEURS.map((i) => ({ "@type": "Dataset", name: i.titre, url: urlAbs(`/classements/${i.slug}`) })) },
        ]}
      />
      <main className="sg-page">
        <Fil items={[{ label: "Accueil", href: "/" }, { label: "Classements" }]} />
        <h1 className="sg-h1">Les classements <span>des pays du monde</span></h1>
        <p className="sg-intro">
          Qui produit le plus, qui compte le plus d&apos;habitants, où les prix montent le plus vite : chaque classement reprend la dernière valeur publiée par les
          institutions de référence, pays par pays, avec son année.
        </p>
        <section className="sg-sec">
          <div className="sg-grille">
            {blocs.map(({ i, lignes, annee }) => (
              <Link key={i.slug} href={`/classements/${i.slug}`} className="sg-carte sg-carte-lien">
                <p className="sg-carte-t">{i.court} <small>({annee})</small></p>
                <ol className="sg-podium">
                  {lignes.slice(0, 3).map((l) => (
                    <li key={l.pays.slug}>{drapeau(l.pays.iso2)} {l.pays.fr} <b>{i.fmt(l.m.v)}</b></li>
                  ))}
                </ol>
                <span className="sg-carte-plus">Les {lignes.length} pays →</span>
              </Link>
            ))}
            <Link href="/dette-publique/analyses/pays-les-plus-endettes" className="sg-carte sg-carte-lien">
              <p className="sg-carte-t">Dette publique</p>
              <p className="sg-carte-d">Les pays les plus endettés en % du PIB, et l&apos;évolution depuis 2000.</p>
              <span className="sg-carte-plus">Voir le classement →</span>
            </Link>
          </div>
        </section>
      </main>
      <Pied />
    </div>
  );
}
