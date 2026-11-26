/* Les constantes et les types du socle démographique, sans ses données : un composant client peut les importer
   sans embarquer la base entière (1,6 Mo). Les sources sont celles que le socle publie (voir genere/socle-demographie.json). */

/** Les sept causes de décès que la base détaille, chacune en effectif
    annuel. Trois territoires sur les 219 n'en ont aucune (source ONU sans
    décomposition par cause) : leurs champs restent absents, pas à zéro. */
export const CAUSES_MORTALITE = [
  "suicide", "homicide", "conflict", "diabetes", "cancer", "maternal", "road",
] as const;
export type CauseMortalite = (typeof CAUSES_MORTALITE)[number];

export interface CountryDemographyData {
  /** Population au milieu de l'année. */
  population?: number;
  /** Taux de natalité, pour 1000 habitants. */
  birth_rate?: number;
  /** Taux de mortalité, pour 1000 habitants. */
  death_rate?: number;
  /** Accroissement naturel annuel (naissances moins décès), en personnes. */
  natural_change?: number;
  births_per_second?: number;
  deaths_per_second?: number;
  /** Solde migratoire net annuel, en personnes. */
  net_migration?: number;
  /** Naissances et décès de l'année, en effectif, pas un taux. */
  births_annual?: number;
  deaths_annual?: number;
  /** Décès annuels par cause : 1990-2019 mesurés (IHME GBD 2019), 2020-2026
      modélisés à parts de causes constantes (moyenne 2017-2019) appliquées
      aux décès totaux publiés par l'ONU pour l'année. */
  suicide_annual?: number;
  homicide_annual?: number;
  conflict_annual?: number;
  diabetes_annual?: number;
  cancer_annual?: number;
  maternal_annual?: number;
  road_annual?: number;
}

/** Les grandeurs comparables d'un pays à l'autre, celles que le globe peut
    colorer et que le classement peut trier. Les deux compteurs par seconde
    n'en font pas partie : ils n'ont de sens qu'agrégés sur le monde. */
export type DemographyMetricId =
  | "population"
  | "birth_rate"
  | "death_rate"
  | "natural_change"
  | "net_migration"
  | "births_annual"
  | "deaths_annual"
  | `${CauseMortalite}_annual`;

export interface DemographyYear {
  year: number;
  countries: Record<string, CountryDemographyData>;
}

/** Les sources de chaque grandeur, telles que les publie le socle généré. */
export const SOURCES_SOCLE_DEMO: Record<string, { indicateur: string; libelle: string; source: string }> = {
  "population": {
    "indicateur": "population_midyear",
    "libelle": "Population au milieu de l'année",
    "source": "ONU, World Population Prospects 2024"
  },
  "birth_rate": {
    "indicateur": "birth_rate_per_1000",
    "libelle": "Taux de natalité (pour 1000 habitants)",
    "source": "ONU, World Population Prospects 2024"
  },
  "death_rate": {
    "indicateur": "death_rate_per_1000",
    "libelle": "Taux de mortalité (pour 1000 habitants)",
    "source": "ONU, World Population Prospects 2024"
  },
  "natural_change": {
    "indicateur": "natural_change_annual",
    "libelle": "Accroissement naturel annuel (naissances moins décès)",
    "source": "ONU, World Population Prospects 2024"
  },
  "births_per_second": {
    "indicateur": "births_per_second",
    "libelle": "Naissances par seconde",
    "source": "ONU, World Population Prospects 2024"
  },
  "deaths_per_second": {
    "indicateur": "deaths_per_second",
    "libelle": "Décès par seconde",
    "source": "ONU, World Population Prospects 2024"
  },
  "net_migration": {
    "indicateur": "net_migration_annual",
    "libelle": "Solde migratoire net annuel",
    "source": "ONU, World Population Prospects 2024"
  },
  "births_annual": {
    "indicateur": "births_annual",
    "libelle": "Naissances annuelles",
    "source": "ONU, World Population Prospects 2024"
  },
  "deaths_annual": {
    "indicateur": "deaths_annual",
    "libelle": "Décès annuels",
    "source": "ONU, World Population Prospects 2024"
  },
  "suicide_annual": {
    "indicateur": "suicide_annual",
    "libelle": "Décès par suicide",
    "source": "IHME Global Burden of Disease 2019 (1990-2019) ; modèle Datlas à parts de causes constantes × décès totaux ONU (2020-2026)"
  },
  "homicide_annual": {
    "indicateur": "homicide_annual",
    "libelle": "Décès par homicide",
    "source": "IHME Global Burden of Disease 2019 (1990-2019) ; modèle Datlas à parts de causes constantes × décès totaux ONU (2020-2026)"
  },
  "conflict_annual": {
    "indicateur": "conflict_annual",
    "libelle": "Décès liés aux conflits",
    "source": "IHME Global Burden of Disease 2019 (1990-2019) ; modèle Datlas à parts de causes constantes × décès totaux ONU (2020-2026)"
  },
  "diabetes_annual": {
    "indicateur": "diabetes_annual",
    "libelle": "Décès liés au diabète",
    "source": "IHME Global Burden of Disease 2019 (1990-2019) ; modèle Datlas à parts de causes constantes × décès totaux ONU (2020-2026)"
  },
  "cancer_annual": {
    "indicateur": "cancer_annual",
    "libelle": "Décès par cancer",
    "source": "IHME Global Burden of Disease 2019 (1990-2019) ; modèle Datlas à parts de causes constantes × décès totaux ONU (2020-2026)"
  },
  "maternal_annual": {
    "indicateur": "maternal_annual",
    "libelle": "Mortalité maternelle",
    "source": "IHME Global Burden of Disease 2019 (1990-2019) ; modèle Datlas à parts de causes constantes × décès totaux ONU (2020-2026)"
  },
  "road_annual": {
    "indicateur": "road_annual",
    "libelle": "Décès par accident de la route",
    "source": "IHME Global Burden of Disease 2019 (1990-2019) ; modèle Datlas à parts de causes constantes × décès totaux ONU (2020-2026)"
  }
};
