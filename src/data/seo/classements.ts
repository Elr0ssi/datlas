import "server-only";
import { tousLesPays, type FichePays, type Mesure } from "./pays";
import { fmtHabCourt, fmtMdCourt, nf } from "./francais";

/* ═══════════════════════════════════════════════════════════════════════════
   LES CLASSEMENTS PAR INDICATEUR (/classements/<indicateur>)

   Une page par question que l'on pose à un moteur : « classement PIB par
   pays », « pays les plus peuplés », « taux de chômage par pays »… Chaque
   page reprend la dernière valeur publiée pour chaque pays, avec son année :
   rien n'est estimé, et un pays sans donnée n'apparaît pas.

   La dette publique n'a pas de page ici : elle a déjà son classement, plus
   riche, dans /dette-publique/analyses. Une seconde page ferait doublon.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Indicateur {
  slug: string;
  /** « le PIB » : pour les phrases. */
  nom: string;
  /** « PIB » : pour les titres et les colonnes. */
  court: string;
  titre: string;
  description: string;
  definition: string;
  source: string;
  rubrique: { label: string; href: string };
  lire: (f: FichePays) => Mesure | undefined;
  fmt: (v: number) => string;
  /** « le plus élevé » / « la plus forte » */
  haut: string;
  bas: string;
  question: string;
}

export const INDICATEURS: Indicateur[] = [
  {
    slug: "pib",
    nom: "le PIB",
    court: "PIB",
    titre: "Classement des pays par PIB",
    description: "Le PIB de chaque pays du monde, du plus élevé au plus faible, en dollars courants, avec l'année de chaque valeur.",
    definition: "Le produit intérieur brut mesure la valeur de tout ce qui est produit dans un pays en une année. Il est exprimé ici en dollars américains courants, sans correction de l'inflation ni du coût de la vie.",
    source: "Banque mondiale (WDI) et FMI",
    rubrique: { label: "Globe de l'économie", href: "/economie" },
    lire: (f) => f.pib,
    fmt: fmtMdCourt,
    haut: "le plus élevé",
    bas: "le plus faible",
    question: "Quels sont les pays les plus riches du monde par PIB ?",
  },
  {
    slug: "pib-par-habitant",
    nom: "le PIB par habitant",
    court: "PIB par habitant",
    titre: "Classement des pays par PIB par habitant",
    description: "Le PIB par habitant de chaque pays, en dollars courants : le classement complet, du plus élevé au plus faible, avec l'année.",
    definition: "Le PIB par habitant divise la production annuelle d'un pays par sa population. C'est un indicateur de niveau de vie moyen, qui ne dit rien de la répartition des revenus.",
    source: "Banque mondiale (WDI) et FMI",
    rubrique: { label: "Globe de l'économie", href: "/economie" },
    lire: (f) => f.pibHab,
    fmt: (v) => `${nf(v)} $`,
    haut: "le plus élevé",
    bas: "le plus faible",
    question: "Quel pays a le PIB par habitant le plus élevé ?",
  },
  {
    slug: "population",
    nom: "la population",
    court: "Population",
    titre: "Classement des pays par population",
    description: "Les pays les plus peuplés du monde et les moins peuplés : la population de chaque pays, selon les Nations Unies.",
    definition: "La population totale au 1er juillet de l'année, toutes nationalités confondues, selon les estimations et projections des Nations Unies.",
    source: "Nations Unies, World Population Prospects 2024",
    rubrique: { label: "Globe de la démographie", href: "/demographie" },
    lire: (f) => f.population,
    fmt: fmtHabCourt,
    haut: "la plus nombreuse",
    bas: "la plus faible",
    question: "Quels sont les pays les plus peuplés du monde ?",
  },
  {
    slug: "inflation",
    nom: "l'inflation",
    court: "Inflation",
    titre: "Taux d'inflation par pays : le classement",
    description: "L'inflation annuelle de chaque pays, de la plus forte à la plus faible (ou négative), avec l'année de la mesure.",
    definition: "Le taux d'inflation mesure la hausse moyenne des prix à la consommation sur un an. Une valeur négative signale une baisse des prix (déflation).",
    source: "FMI et Banque mondiale",
    rubrique: { label: "Globe de l'économie", href: "/economie" },
    lire: (f) => f.inflation,
    fmt: (v) => `${nf(v, 1)} %`,
    haut: "la plus forte",
    bas: "la plus faible",
    question: "Quels pays ont l'inflation la plus forte ?",
  },
  {
    slug: "chomage",
    nom: "le taux de chômage",
    court: "Chômage",
    titre: "Taux de chômage par pays : le classement",
    description: "Le taux de chômage de chaque pays, du plus élevé au plus bas, en pourcentage de la population active, avec l'année.",
    definition: "Le taux de chômage rapporte le nombre de personnes sans emploi qui en cherchent un à la population active (personnes en emploi et chômeurs), selon les définitions harmonisées de l'Organisation internationale du travail.",
    source: "Banque mondiale (estimations OIT)",
    rubrique: { label: "Globe de l'économie", href: "/economie" },
    lire: (f) => f.chomage,
    fmt: (v) => `${nf(v, 1)} %`,
    haut: "le plus élevé",
    bas: "le plus bas",
    question: "Quels pays ont le taux de chômage le plus élevé ?",
  },
  {
    slug: "balance-commerciale",
    nom: "la balance commerciale",
    court: "Balance commerciale",
    titre: "Balance commerciale par pays : excédents et déficits",
    description: "Les plus gros excédents et déficits commerciaux du monde : la balance commerciale de chaque pays, en dollars courants.",
    definition: "La balance commerciale est la différence entre les exportations et les importations de biens et de services. Positive, c'est un excédent ; négative, un déficit.",
    source: "Banque mondiale (WDI)",
    rubrique: { label: "Globe de l'économie", href: "/economie" },
    lire: (f) => f.balance,
    fmt: (v) => `${v > 0 ? "+" : ""}${fmtMdCourt(v)}`,
    haut: "le plus fort excédent",
    bas: "le plus fort déficit",
    question: "Quels pays ont le plus gros excédent commercial ?",
  },
  {
    slug: "natalite",
    nom: "le taux de natalité",
    court: "Natalité",
    titre: "Taux de natalité par pays : le classement",
    description: "Le nombre de naissances pour 1 000 habitants dans chaque pays, du taux le plus élevé au plus bas, selon les Nations Unies.",
    definition: "Le taux brut de natalité rapporte le nombre de naissances vivantes de l'année à la population moyenne, pour 1 000 habitants.",
    source: "Nations Unies, World Population Prospects 2024",
    rubrique: { label: "Globe de la démographie", href: "/demographie" },
    lire: (f) => f.natalite,
    fmt: (v) => `${nf(v, 1)} ‰`,
    haut: "le plus élevé",
    bas: "le plus bas",
    question: "Quels pays ont le taux de natalité le plus élevé ?",
  },
  {
    slug: "mortalite",
    nom: "le taux de mortalité",
    court: "Mortalité",
    titre: "Taux de mortalité par pays : le classement",
    description: "Le nombre de décès pour 1 000 habitants dans chaque pays, du taux le plus élevé au plus bas, selon les Nations Unies.",
    definition: "Le taux brut de mortalité rapporte le nombre de décès de l'année à la population moyenne, pour 1 000 habitants. Il dépend fortement de l'âge moyen de la population.",
    source: "Nations Unies, World Population Prospects 2024",
    rubrique: { label: "Globe de la démographie", href: "/demographie" },
    lire: (f) => f.mortalite,
    fmt: (v) => `${nf(v, 1)} ‰`,
    haut: "le plus élevé",
    bas: "le plus bas",
    question: "Quels pays ont le taux de mortalité le plus élevé ?",
  },
  {
    slug: "densite",
    nom: "la densité de population",
    court: "Densité",
    titre: "Densité de population par pays : le classement",
    description: "Les pays les plus densément peuplés du monde, en habitants par km², d'après la population des Nations Unies.",
    definition: "La densité rapporte la population à la superficie, en habitants par kilomètre carré. La superficie est calculée d'après le fond de carte du site : c'est une valeur approchée, suffisante pour comparer les ordres de grandeur.",
    source: "Nations Unies (population) et Natural Earth (superficie)",
    rubrique: { label: "Globe de la démographie", href: "/demographie" },
    lire: (f) => (f.densite && f.population ? { v: f.densite, annee: f.population.annee } : undefined),
    fmt: (v) => `${nf(v, v < 10 ? 1 : 0)} hab./km²`,
    haut: "la plus forte",
    bas: "la plus faible",
    question: "Quels sont les pays les plus densément peuplés ?",
  },
];

export const indicateurParSlug = (slug: string) => INDICATEURS.find((i) => i.slug === slug);

export interface LigneRang {
  rang: number;
  pays: FichePays;
  m: Mesure;
}

/** Le classement complet : la dernière valeur publiée de chaque pays, de la plus élevée à la plus faible. */
export function classementDe(ind: Indicateur): { lignes: LigneRang[]; annee: number } {
  const avec = tousLesPays()
    .map((p) => ({ pays: p, m: ind.lire(p) }))
    .filter((x): x is { pays: FichePays; m: Mesure } => Boolean(x.m) && Number.isFinite(x.m!.v));
  avec.sort((a, b) => b.m.v - a.m.v || a.pays.fr.localeCompare(b.pays.fr, "fr"));
  /* L'année la plus fréquente : celle que l'on annonce dans le titre. */
  const compte = new Map<number, number>();
  for (const x of avec) compte.set(x.m.annee, (compte.get(x.m.annee) ?? 0) + 1);
  const annee = [...compte].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0]?.[0] ?? new Date().getFullYear();
  return { lignes: avec.map((x, i) => ({ rang: i + 1, ...x })), annee };
}
