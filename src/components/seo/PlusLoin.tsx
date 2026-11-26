import Link from "next/link";
import "./seo.css";

/* « Pour aller plus loin » : avant le pied de page d'une rubrique, les pages détaillées qui en prolongent la lecture.
   Un lien par question précise (un classement, une ressource, un pays) : c'est aussi le chemin qu'empruntent les moteurs. */
export function PlusLoin({ titre = "Pour aller plus loin", groupes }: { titre?: string; groupes: { titre: string; liens: [string, string][] }[] }) {
  return (
    <nav className="pl-bloc" aria-label={titre}>
      <h2 className="sg-h2">{titre}</h2>
      {groupes.map((g) => (
        <div key={g.titre} className="pl-groupe">
          <p className="pl-t">{g.titre}</p>
          <ul className="sg-liens">
            {g.liens.map(([l, h]) => (
              <li key={h}><Link href={h}>{l}</Link></li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
