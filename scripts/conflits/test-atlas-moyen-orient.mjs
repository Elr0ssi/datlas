#!/usr/bin/env node
/* Test de l'atlas du Moyen-Orient (navigateur) : les 7 dossiers s'ouvrent (bureau et mobile), le filtre d'année ne laisse rien passer
   de postérieur, chaque chiffre porte un organisme et un lien, les liens sont légendés, l'ancienne adresse /map/conflicts redirige.
   Prérequis : un serveur lancé (npx next start -p 3300) et Playwright (PLAYWRIGHT, par défaut le module installé ou /opt/node-tools).
   Usage : node scripts/conflits/test-atlas-moyen-orient.mjs [http://localhost:3300] */
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3300";
const req = createRequire(import.meta.url);
let pw;
try { pw = req(process.env.PLAYWRIGHT ?? "playwright"); } catch { pw = req("/opt/node-tools/node_modules/playwright"); }
const atlas = JSON.parse(readFileSync(new URL("../../src/data/conflits/moyen-orient/datlas-middle-east.json", import.meta.url), "utf8"));
const b = await pw.chromium.launch({ args: ["--no-sandbox"] });
const erreurs = [];
try {
  for (const [nom, vue] of [["bureau", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
    const p = await b.newPage({ viewport: vue });
    p.on("pageerror", (e) => erreurs.push(`${nom}: ${e.message}`));
    await p.goto(`${base}/conflits/moyen-orient`, { waitUntil: "load" });
    await p.waitForSelector(".mo-liste .mo-dossier");
    // 1. Les 7 dossiers s'ouvrent, avec leurs quatre rubriques.
    for (const c of atlas.conflicts) {
      await p.locator(".mo-liste .mo-dossier", { hasText: c.shortTitle }).first().click();
      await p.waitForTimeout(150);
      assert.match(await p.locator(".mo-fiche").innerText(), new RegExp(c.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${nom} : ${c.id} s'ouvre`);
      for (const o of ["Chronologie", "Acteurs", "Sources", "Synthèse"]) await p.locator(".mo-onglets button", { hasText: o }).click();
      // 2. Chaque chiffre affiché porte un organisme et un lien.
      for (const m of await p.locator(".mo-mesure").all()) assert.ok(await m.locator(".mo-mesure-s a[href^='http']").count(), `${nom} : chiffre sourcé dans ${c.id}`);
      // 3. Aucun effectif inventé.
      await p.locator(".mo-onglets button", { hasText: "Acteurs" }).click();
      for (const t of await p.locator(".mo-acteur small").allInnerTexts()) assert.match(t, /Non documenté/, `${nom} : effectif non inventé dans ${c.id}`);
      await p.locator(".mo-onglets button", { hasText: "Synthèse" }).click();
    }
    await p.close();
  }
  // 4. Le filtre d'année : en 2012, seule la Syrie, et aucun jalon ni chiffre postérieur.
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`${base}/conflits/moyen-orient?dossier=syria&annee=2012`, { waitUntil: "load" });
  await p.waitForSelector(".mo-fiche .mo-onglets");
  assert.equal(await p.locator(".mo-liste .mo-dossier").count(), 2, "en 2012 : la vue d'ensemble et la Syrie");
  await p.locator(".mo-onglets button", { hasText: "Chronologie" }).click();
  for (const d of await p.locator(".mo-chrono time").evaluateAll((l) => l.map((x) => x.getAttribute("datetime")))) assert.ok(Number(d.slice(0, 4)) <= 2012, `jalon ${d} masqué en 2012`);
  await p.locator(".mo-onglets button", { hasText: "Synthèse" }).click();
  assert.equal(await p.locator(".mo-mesure").count(), 0, "aucun chiffre de 2025-2026 en 2012");
  // 5. La légende nomme les liens, l'adresse du prototype redirige.
  await p.goto(`${base}/conflits/moyen-orient`, { waitUntil: "load" });
  assert.match(await p.locator(".mo-legende").innerText(), /Lien explicatif, pas un trajet/);
  const r = await p.goto(`${base}/map/conflicts`, { waitUntil: "load" });
  assert.match(p.url(), /\/conflits\/moyen-orient/, "/map/conflicts redirige vers l'atlas");
  assert.ok(r.ok());
  assert.deepEqual(erreurs, [], "aucune erreur JavaScript");
  console.log("Atlas du Moyen-Orient : 7 dossiers ouverts (bureau et mobile), filtre d'année, sources, effectifs, légende et redirection : OK");
} finally {
  await b.close();
}
