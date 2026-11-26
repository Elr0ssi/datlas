import "server-only";
import { classement, obs, totalMonde } from "@/data/ressources/calc";
import { nomZone } from "@/data/ressources/noms";
import type { Continent, JeuRessource } from "@/data/ressources/types";
import { ficheRessource, pagesRessources, type PageRessource } from "./ressources";
import { paysParNom } from "./pays";

/* ═══════════════════════════════════════════════════════════════════════════
   L'ANALYSE D'UNE RESSOURCE, ET DES RESSOURCES D'UN PAYS

   Tout est calculé à partir des fichiers FAOSTAT déjà importés : séries de
   production, de surface et de rendement. Aucune valeur n'est estimée ni
   interpolée ; une année absente reste absente. Les « avantages » d'un pays
   sont lus dans les données (sa surface, son rendement, son rang), jamais
   affirmés sans chiffre.
   ═══════════════════════════════════════════════════════════════════════════ */

export const UNITES: Record<string, string> = { t: "t", ha: "ha", "kg/ha": "kg/ha", "kg/An": "kg/animal", "g/An": "g/animal" };
const libRdt = (u: string) => (u.endsWith("/An") ? "Rendement par animal" : "Rendement");

export interface Point {
  annee: number;
  v: number;
}

export interface Producteur {
  m49: string;
  fr: string;
  /** La page des ressources du pays, si le pays a une fiche. */
  lien: string | null;
  slugPays: string | null;
  continent: Continent | null;
  rang: number;
  valeur: number;
  part: number | null;
  evolution: number | null;
  serie: Point[];
  surface: number | null;
  rangSurface: number | null;
  rdt: number | null;
  rangRdt: number | null;
}

export interface Analyse {
  r: PageRessource;
  annee: number;
  a0: number;
  unite: string;
  uniteRdt: string | null;
  libelleRdt: string;
  aSurface: boolean;
  monde: Point[];
  entites: number;
  total: number;
  producteurs: Producteur[];
  nProducteurs: number;
  nRdt: number;
  nSurface: number;
  concentration: { top1: number; top3: number; top5: number; top10: number };
  continents: { annee: number; parts: { continent: Continent; valeur: number; part: number }[] }[];
  hausses: Producteur[];
  baisses: Producteur[];
  rendements: Producteur[];
  medianeRdt: number | null;
  france: Producteur | null;
  source: JeuRessource["source"];
}

const CONTINENTS: Continent[] = ["Asie", "Europe", "Amériques", "Afrique", "Océanie"];

function serie(J: JeuRessource, m49: string, ind: string): Point[] {
  const s = J.series[m49]?.[ind];
  if (!s) return [];
  const out: Point[] = [];
  s.v.forEach((v, i) => {
    if (v !== null && v !== undefined) out.push({ annee: J.annees[0] + i, v });
  });
  return out;
}

const cache = new Map<string, Analyse | null>();

export function analyseRessource(r: PageRessource): Analyse | null {
  if (cache.has(r.id)) return cache.get(r.id)!;
  const f = ficheRessource(r);
  if (!f || !f.total) {
    cache.set(r.id, null);
    return null;
  }
  const J = f.jeu;
  const annee = f.annee;
  const a0 = J.annees[0];
  const uniteRdt = J.indicateurs.rendement ? UNITES[J.indicateurs.rendement.unite] ?? J.indicateurs.rendement.unite : null;
  const aSurface = J.indicateurs.surface?.unite === "ha";

  /* Les classements de surface et de rendement, l'année de référence. Le rendement n'est classé que parmi les producteurs
     qui pèsent au moins 0,1 % du total : un rendement record sur trois hectares ne dit rien. */
  const cProd = f.producteurs;
  const significatifs = new Set(cProd.filter((l) => (l.part ?? 0) >= 0.1).map((l) => l.m49));
  const cSurf = aSurface ? classement(J, "surface", annee) : [];
  const cRdt = J.indicateurs.rendement ? classement(J, "rendement", annee).filter((l) => significatifs.has(l.m49)).map((l, i) => ({ ...l, rang: i + 1 })) : [];
  const rangDe = (c: { m49: string; rang: number; valeur: number }[], m49: string) => c.find((l) => l.m49 === m49) ?? null;

  const producteurs: Producteur[] = cProd.map((l) => {
    const z = J.zones.find((x) => x.m49 === l.m49)!;
    const p = z.ne ? paysParNom(z.ne) : undefined;
    const s = rangDe(cSurf, l.m49);
    const d = rangDe(cRdt, l.m49);
    return {
      m49: l.m49,
      fr: nomZone(z),
      lien: p ? `/pays/${p.slug}/ressources` : null,
      slugPays: p?.slug ?? null,
      continent: z.continent,
      rang: l.rang,
      valeur: l.valeur,
      part: l.part,
      evolution: l.evolution,
      serie: [],
      surface: s?.valeur ?? null,
      rangSurface: s?.rang ?? null,
      rdt: d?.valeur ?? null,
      rangRdt: d?.rang ?? null,
    };
  });
  for (const p of producteurs.slice(0, 12)) p.serie = serie(J, p.m49, "production");

  const monde: Point[] = [];
  for (let a = a0; a <= annee; a++) {
    const t = totalMonde(J, "production", a);
    if (t) monde.push({ annee: a, v: t.valeur });
  }

  const somme = (n: number) => producteurs.slice(0, n).reduce((s, p) => s + (p.part ?? 0), 0);

  /* Les parts par continent, à quelques dates repères : la somme des pays et entités historiques de chaque continent. */
  const reperes = [a0, 1980, 2000, 2010, annee].filter((a, i, t) => a >= a0 && a <= annee && t.indexOf(a) === i);
  const continents = reperes
    .map((a) => {
      const tot = new Map<Continent, number>();
      for (const z of J.zones) {
        if (z.type === "agregat" || z.type === "inconnu" || !z.continent) continue;
        const o = obs(J, z.m49, "production", a);
        if (o) tot.set(z.continent, (tot.get(z.continent) ?? 0) + o.valeur);
      }
      const s = [...tot.values()].reduce((x, y) => x + y, 0);
      return { annee: a, parts: CONTINENTS.map((c) => ({ continent: c, valeur: tot.get(c) ?? 0, part: s ? ((tot.get(c) ?? 0) / s) * 100 : 0 })) };
    })
    .filter((x) => x.parts.some((p) => p.valeur > 0));

  /* Les plus fortes hausses et baisses sur dix ans, parmi les producteurs qui pèsent au moins 0,5 % du total. */
  const comptent = producteurs.filter((p) => (p.part ?? 0) >= 0.5 && p.evolution !== null);
  const hausses = [...comptent].sort((a, b) => b.evolution! - a.evolution!).slice(0, 5);
  const baisses = [...comptent].sort((a, b) => a.evolution! - b.evolution!).filter((p) => p.evolution! < 0).slice(0, 5);

  const rendements = producteurs.filter((p) => p.rdt !== null && p.rang <= 25).sort((a, b) => b.rdt! - a.rdt!);
  const rdts = cRdt.map((l) => l.valeur).sort((a, b) => a - b);
  const medianeRdt = rdts.length ? rdts[Math.floor(rdts.length / 2)] : null;

  const a: Analyse = {
    r,
    annee,
    a0,
    unite: f.unite,
    uniteRdt,
    libelleRdt: libRdt(J.indicateurs.rendement?.unite ?? ""),
    aSurface,
    monde,
    entites: f.total.entites,
    total: f.total.valeur,
    producteurs,
    nProducteurs: producteurs.length,
    nRdt: cRdt.length,
    nSurface: cSurf.length,
    concentration: { top1: somme(1), top3: somme(3), top5: somme(5), top10: somme(10) },
    continents,
    hausses,
    baisses,
    rendements,
    medianeRdt,
    france: (() => {
      const p = producteurs.find((x) => x.m49 === "250");
      if (p && !p.serie.length) p.serie = serie(J, "250", "production");
      return p ?? null;
    })(),
    source: J.source,
  };
  cache.set(r.id, a);
  return a;
}

/* ── Les ressources d'un pays ─────────────────────────────────────────────── */

export interface LigneRessourcePays {
  r: PageRessource;
  annee: number;
  unite: string;
  p: Producteur;
  n: number;
  nRdt: number;
  uniteRdt: string | null;
  libelleRdt: string;
  medianeRdt: number | null;
}

let parPays: Map<string, LigneRessourcePays[]> | null = null;

function indexPays(): Map<string, LigneRessourcePays[]> {
  if (parPays) return parPays;
  parPays = new Map();
  for (const r of pagesRessources()) {
    const a = analyseRessource(r);
    if (!a) continue;
    for (const p of a.producteurs) {
      if (!p.slugPays) continue;
      const l = parPays.get(p.slugPays) ?? [];
      l.push({ r, annee: a.annee, unite: a.unite, p, n: a.nProducteurs, nRdt: a.nRdt, uniteRdt: a.uniteRdt, libelleRdt: a.libelleRdt, medianeRdt: a.medianeRdt });
      parPays.set(p.slugPays, l);
    }
  }
  for (const l of parPays.values()) l.sort((x, y) => x.p.rang / x.n - y.p.rang / y.n);
  return parPays;
}

/** Les ressources produites par un pays, de son meilleur classement (relatif) au moins bon. */
export const ressourcesDuPays = (slug: string) => indexPays().get(slug) ?? [];
export const paysAvecRessources = () => [...indexPays().keys()];

/** La série de production d'un pays pour une ressource (pour les courbes de la page pays). */
export function serieDuPays(r: PageRessource, m49: string): Point[] {
  const f = ficheRessource(r);
  return f ? serie(f.jeu, m49, "production") : [];
}
