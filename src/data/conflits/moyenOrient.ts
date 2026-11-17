import atlas from "./moyen-orient/datlas-middle-east.json";

/* ═══════════════════════════════════════════════════════════════════════════
   L'ATLAS DU MOYEN-ORIENT : ADAPTATEUR ET RÈGLES DE LECTURE

   Le lot livré (datlas-middle-east.json, photographie arrêtée au 17 novembre 2026) a son propre modèle : on le lit ici, sans le
   recopier dans celui de l'inventaire mondial des conflits (src/data/conflits). Toutes les règles de véracité sont écrites ici, pour
   être testées (scripts/conflits/tester-moyen-orient.ts) et non dispersées dans l'interface :
   - une valeur absente reste « non documentée », jamais zéro ;
   - le filtre d'année masque tout ce qui est daté après elle (dossiers, jalons, mesures, relations) ;
   - aucun total régional n'est calculé ;
   - un lieu est un repère géographique civil, une relation un lien explicatif, jamais une trajectoire.
   ═══════════════════════════════════════════════════════════════════════════ */

export type AtlasMO = typeof atlas;
export type DossierMO = AtlasMO["conflicts"][number];
export type LieuMO = AtlasMO["places"][number];
export type MesureMO = DossierMO["metrics"][number];
export type JalonMO = DossierMO["timeline"][number];
export type RelationMO = AtlasMO["relationships"][number];
export type SourceMO = AtlasMO["sources"][number];

export const ATLAS_MO: AtlasMO = atlas;
export const ARRET_MO = atlas.editorialCutoff;
export const ANNEE_MIN_MO = Math.min(...atlas.conflicts.map((c) => an(c.started)));
export const ANNEE_MAX_MO = an(atlas.editorialCutoff);

export function an(iso: string): number {
  return Number(iso.slice(0, 4));
}

export const STATUTS_MO: Record<string, { libelle: string; couleur: string }> = {
  "hostilites-actives": { libelle: "Hostilités actives", couleur: "#e5484d" },
  "violences-persistantes": { libelle: "Violences persistantes", couleur: "#f08a24" },
  "cessez-le-feu-fragile": { libelle: "Trêve fragile", couleur: "#e8b923" },
  "insecurite-persistante": { libelle: "Insécurité persistante", couleur: "#a1887f" },
  "transition-fragile": { libelle: "Transition fragile", couleur: "#3a8ee6" },
  "tensions-regionales": { libelle: "Tensions régionales", couleur: "#8f6bf7" },
};
export const statutMO = (s: string) => STATUTS_MO[s] ?? { libelle: s, couleur: "#8b8fa3" };

/** Les codes pays du lot (PS est un identifiant cartographique, sans affirmation sur un statut territorial). */
export const PAYS_MO: Record<string, { fr: string; ne: string }> = {
  PS: { fr: "Territoires palestiniens", ne: "Palestine" },
  IL: { fr: "Israël", ne: "Israel" },
  LB: { fr: "Liban", ne: "Lebanon" },
  SY: { fr: "Syrie", ne: "Syria" },
  YE: { fr: "Yémen", ne: "Yemen" },
  IR: { fr: "Iran", ne: "Iran" },
  IQ: { fr: "Irak", ne: "Iraq" },
  US: { fr: "États-Unis", ne: "United States of America" },
};
export const nomPaysMO = (code: string) => PAYS_MO[code]?.fr ?? code;

export const RELATIONS_MO: Record<string, string> = {
  regional_spillover: "Débordement régional",
  regional_interdependence: "Interdépendance régionale",
  shared_historical_context: "Contexte historique partagé",
  trade_exposure: "Exposition des échanges",
};
export const typeRelationMO = (t: string) => RELATIONS_MO[t] ?? t.replace(/_/g, " ");

const sources = new Map(atlas.sources.map((s) => [s.id, s]));
export const sourceMO = (id: string): SourceMO | undefined => sources.get(id);
const lieux = new Map(atlas.places.map((p) => [p.id, p]));
export const lieuMO = (id: string): LieuMO | undefined => lieux.get(id);
export const dossierMO = (id: string | null): DossierMO | undefined => (id ? atlas.conflicts.find((c) => c.id === id) : undefined);

/** Les dossiers ouverts à l'année choisie, pour un pays (ou tous). */
export function dossiersMO(annee: number, pays: string | "tous" = "tous"): DossierMO[] {
  return atlas.conflicts.filter((c) => an(c.started) <= annee && (pays === "tous" || c.countries.includes(pays)));
}
/** Les jalons d'un dossier datés au plus tard l'année choisie. */
export const jalonsMO = (c: DossierMO, annee: number): JalonMO[] => c.timeline.filter((e) => an(e.date) <= annee);
/** Les mesures arrêtées au plus tard l'année choisie : jamais une mesure postérieure. */
export const mesuresMO = (c: DossierMO, annee: number): MesureMO[] => c.metrics.filter((m) => an(m.asOf) <= annee && an(m.periodStart) <= annee);
/** Les relations actives à l'année, entre deux dossiers visibles. */
export function relationsMO(visibles: DossierMO[], annee: number, choisi: string | null): RelationMO[] {
  const ids = new Set(visibles.map((c) => c.id));
  return atlas.relationships.filter(
    (r) => an(r.start) <= annee && ids.has(r.fromConflictId) && ids.has(r.toConflictId) && (!choisi || r.fromConflictId === choisi || r.toConflictId === choisi),
  );
}
/** Les dossiers reliés à un dossier : les « sujets liés ». */
export function liesMO(c: DossierMO, annee: number): { dossier: DossierMO; relation: RelationMO }[] {
  return atlas.relationships
    .filter((r) => an(r.start) <= annee && (r.fromConflictId === c.id || r.toConflictId === c.id))
    .map((r) => ({ dossier: dossierMO(r.fromConflictId === c.id ? r.toConflictId : r.fromConflictId)!, relation: r }))
    .filter((x) => x.dossier && an(x.dossier.started) <= annee);
}

/** Une valeur affichée : « Non documenté » quand elle manque, jamais 0. */
export function valeurMO(v: number | null | undefined): string {
  return v === null || v === undefined || !Number.isFinite(v) ? "Non documenté" : new Intl.NumberFormat("fr-FR").format(v);
}
export const dateMO = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
