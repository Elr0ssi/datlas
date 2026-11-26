import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { classement, totalMonde } from "@/data/ressources/calc";
import { ressourcesActives } from "@/data/ressources/catalogue";
import { nomZone } from "@/data/ressources/noms";
import type { EntreeIndex, JeuRessource } from "@/data/ressources/types";
import type { LigneClassement } from "@/data/ressources/calc";
import { slugDe } from "./francais";
import { paysParNom } from "./pays";

/* ═══════════════════════════════════════════════════════════════════════════
   UNE PAGE PAR RESSOURCE (/ressources/<produit>)

   « Production mondiale de blé », « premier producteur de cacao » : une page
   lisible sans JavaScript par ressource importée, lue dans les mêmes fichiers
   FAOSTAT que le globe. Les totaux « monde » sont recalculés (somme des
   entités publiées) et le disent ; aucune valeur n'est estimée ici.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface PageRessource {
  slug: string;
  id: string;
  nom: string;
  chemin: string;
}

const lire = <T,>(f: string): T => JSON.parse(readFileSync(join(process.cwd(), "public/ressources", f), "utf8")) as T;

let cacheListe: PageRessource[] | null = null;
export function pagesRessources(): PageRessource[] {
  if (cacheListe) return cacheListe;
  const index = lire<{ ressources: EntreeIndex[] }>("index.json").ressources;
  cacheListe = ressourcesActives(index).map((r) => ({ slug: slugDe(r.nomFr), id: r.id, nom: r.nomFr, chemin: r.chemin }));
  return cacheListe;
}
export const ressourceParSlug = (slug: string) => pagesRessources().find((r) => r.slug === slug);

export interface LigneProd extends LigneClassement {
  fr: string;
  lien: string | null;
}

export interface Fiche {
  r: PageRessource;
  jeu: JeuRessource;
  annee: number;
  unite: string;
  total: { valeur: number; entites: number } | null;
  total10: { valeur: number; entites: number } | null;
  total1961: { valeur: number; entites: number } | null;
  producteurs: LigneProd[];
  rendements: LigneProd[];
  uniteRendement: string | null;
}

const enrichir = (l: LigneClassement, J: JeuRessource): LigneProd => {
  const z = J.zones.find((x) => x.m49 === l.m49)!;
  const p = z.ne ? paysParNom(z.ne) : undefined;
  return { ...l, fr: nomZone(z), lien: p ? `/pays/${p.slug}` : null };
};

export function ficheRessource(r: PageRessource): Fiche | null {
  let jeu: JeuRessource;
  try {
    jeu = lire<JeuRessource>(`${r.id}.json`);
  } catch {
    return null;
  }
  const ind = jeu.indicateurs.production ? "production" : Object.keys(jeu.indicateurs)[0];
  if (!ind) return null;
  /* La dernière année qui a un total : l'année la plus récente vraiment publiée. */
  let annee = jeu.annees[1];
  while (annee > jeu.annees[0] && !totalMonde(jeu, ind, annee)) annee--;
  const producteurs = classement(jeu, ind, annee).map((l) => enrichir(l, jeu));
  const gros = new Set(producteurs.slice(0, 25).map((l) => l.m49));
  const rendements = jeu.indicateurs.rendement
    ? classement(jeu, "rendement", annee).filter((l) => gros.has(l.m49)).map((l) => enrichir(l, jeu))
    : [];
  return {
    r,
    jeu,
    annee,
    unite: jeu.indicateurs[ind]?.unite ?? "",
    total: totalMonde(jeu, ind, annee),
    total10: totalMonde(jeu, ind, annee - 10),
    total1961: totalMonde(jeu, ind, jeu.annees[0]),
    producteurs,
    rendements,
    uniteRendement: jeu.indicateurs.rendement?.unite ?? null,
  };
}
