/* Teste l'atlas du Moyen-Orient et ses règles de lecture : npm run conflits:tester-moyen-orient (via tsx). */
import assert from "node:assert/strict";
import {
  ATLAS_MO, an, dossiersMO, jalonsMO, mesuresMO, relationsMO, liesMO, sourceMO, lieuMO, valeurMO, typeRelationMO, RELATIONS_MO, STATUTS_MO,
} from "../../src/data/conflits/moyenOrient";

const A = ATLAS_MO;
// 1. Les 7 dossiers et les 33 lieux, aux coordonnées valides.
assert.equal(A.conflicts.length, 7, "7 dossiers");
assert.equal(A.places.length, 33, "33 lieux");
for (const p of A.places) {
  assert.ok(p.lat >= -90 && p.lat <= 90 && p.lng >= -180 && p.lng <= 180, `coordonnées de ${p.id}`);
  assert.equal(p.geographyOnly, true, `${p.id} est un repère géographique, pas une position`);
}
// 2. Le filtre d'année ne laisse passer AUCUN élément daté après l'année choisie.
for (let annee = 2011; annee <= 2026; annee++) {
  const vis = dossiersMO(annee);
  for (const c of vis) {
    assert.ok(an(c.started) <= annee, `${c.id} ouvert après ${annee}`);
    for (const e of jalonsMO(c, annee)) assert.ok(an(e.date) <= annee, `jalon ${e.title} après ${annee}`);
    for (const m of mesuresMO(c, annee)) assert.ok(an(m.asOf) <= annee, `mesure ${m.id} après ${annee}`);
    for (const l of liesMO(c, annee)) assert.ok(an(l.relation.start) <= annee && an(l.dossier.started) <= annee, `lien ${l.relation.id} après ${annee}`);
  }
  for (const r of relationsMO(vis, annee, null)) assert.ok(an(r.start) <= annee, `relation ${r.id} après ${annee}`);
}
assert.equal(dossiersMO(2012).map((c) => c.id).join(","), "syria", "en 2012, seule la Syrie est ouverte");
// 3. Chaque chiffre a un organisme et un lien source, une période, un périmètre.
for (const c of A.conflicts) for (const m of c.metrics) {
  const s = sourceMO(m.sourceId);
  assert.ok(s && s.organization && /^https?:\/\//.test(s.url), `source de ${m.id}`);
  assert.ok(m.periodStart && m.periodEnd && m.asOf && m.scope, `période et périmètre de ${m.id}`);
}
for (const c of A.conflicts) for (const e of c.timeline) assert.ok(sourceMO(e.sourceId)?.url, `source du jalon ${e.title}`);
// 4. Aucun effectif inventé : un effectif absent s'affiche « Non documenté », jamais 0.
for (const c of A.conflicts) {
  assert.equal(c.totalCombatantsEstimated, null);
  for (const a of c.actors) assert.equal(valeurMO(a.estimatedPersonnel as number | null), "Non documenté", `effectif de ${a.name}`);
}
assert.equal(valeurMO(0), "0", "un zéro réel reste zéro");
// 5. Les relations relient des lieux connus, ont un libellé et un type traduit : ce ne sont pas des routes.
for (const r of A.relationships) {
  assert.ok(lieuMO(r.fromPlaceId) && lieuMO(r.toPlaceId), `lieux de ${r.id}`);
  assert.ok(r.label && RELATIONS_MO[r.type], `libellé et type traduit de ${r.id}`);
  assert.ok(!/route|trajet|itinéraire|convoi|missile/i.test(typeRelationMO(r.type)));
}
// 6. Chaque statut a son libellé et sa couleur (la légende couvre tout ce qui est dessiné).
for (const c of A.conflicts) assert.ok(STATUTS_MO[c.status], `statut ${c.status} dans la légende`);
console.log(`Atlas du Moyen-Orient : ${A.conflicts.length} dossiers, ${A.places.length} lieux, ${A.relationships.length} relations, toutes les règles tiennent.`);
