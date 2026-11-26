import "server-only";
import { ANALYSES } from "@/data/dettes/analyses";
import { CATALOGUE_DETTE } from "@/articles/dette/catalogue";
import { classementDe, INDICATEURS } from "@/data/seo/classements";
import { ficheRessource, pagesRessources } from "@/data/seo/ressources";
import { paysVedettes } from "@/data/seo/pays";
import { nf } from "@/data/seo/francais";
import { SITE_URL } from "@/lib/site";

/* llms.txt (https://llmstxt.org) : la carte du site écrite pour les assistants d'IA. Un titre, un résumé, puis des
   liens commentés vers les pages qui répondent chacune à une question précise. La version « full » ajoute les chiffres
   clés, lus dans la base au moment de la construction : rien n'y est écrit à la main. */

const u = (c: string) => `${SITE_URL}${c}`;

export function llmsCourt(): string {
  const l: string[] = [];
  l.push("# Datlas", "");
  l.push("> Datlas est un site francophone, gratuit et sans publicité, pour apprendre et retenir l'économie, la démographie, les conflits et les ressources du monde : globes interactifs, classements par pays, comparateur, articles de dette publique sourcés, forum et carnet de révision avec traduction en anglais. Chaque chiffre est daté et renvoie à sa source officielle (Banque mondiale, FMI, Nations Unies, FAOSTAT, INSEE, Eurostat).", "");
  l.push("Les pages sont en français. Pour citer un chiffre, renvoyez vers la page précise qui l'affiche : chaque section porte une ancre stable.", "");
  l.push("## Rubriques");
  l.push(`- [Économie](${u("/economie")}): PIB, PIB par habitant, dette, inflation, chômage, balance commerciale de 207 pays depuis 1960, sur un globe.`);
  l.push(`- [Démographie](${u("/demographie")}): population, natalité, mortalité, accroissement naturel et causes de décès par pays, Nations Unies WPP 2024.`);
  l.push(`- [Conflits](${u("/conflits")}): inventaire daté des conflits armés, violences armées et tensions géopolitiques, fiches sourcées.`);
  l.push(`- [Ressources](${u("/ressources")}): production, surface et rendement agricoles par pays de 1961 à 2024 (FAOSTAT).`);
  l.push(`- [Articles](${u("/articles")}): dossiers et analyses de dette publique, lectures économiques.`, "");
  l.push("## Classements par pays");
  for (const i of INDICATEURS) l.push(`- [${i.titre}](${u(`/classements/${i.slug}`)}): ${i.description}`);
  l.push(`- [Pays les plus endettés](${u("/dette-publique/analyses/pays-les-plus-endettes")}): dette publique en % du PIB.`, "");
  l.push("## Production mondiale par ressource");
  for (const r of pagesRessources()) l.push(`- [Production mondiale : ${r.nom}](${u(`/ressources/${r.slug}`)}): article complet : premiers producteurs, évolution depuis 1961, continents, rendements, usages, place de la France.`);
  l.push(`- Les ressources de chaque pays : ${u("/pays/<pays>/ressources")} (rang mondial, part, évolution sur dix ans, rendement), par exemple ${u("/pays/france/ressources")}.`);
  l.push("");
  l.push("## Dette publique");
  l.push(`- [La dette publique par pays](${u("/dette-publique")}): montants, % du PIB et évolution depuis 2000.`);
  for (const a of CATALOGUE_DETTE) l.push(`- [${a.titre}](${u(a.url)})`);
  for (const a of ANALYSES) l.push(`- [${a.titre}](${u(`/dette-publique/analyses/${a.slug}`)}): ${a.accroche}`);
  l.push("");
  l.push("## Pays et comparaisons");
  l.push(`- [Tous les pays](${u("/pays")}): une fiche par pays (population, PIB, dette, inflation, chômage, évolution depuis 1960).`);
  for (const p of paysVedettes(12)) l.push(`- [${p.fr}](${u(`/pays/${p.slug}`)})`);
  l.push(`- [Comparer des pays](${u("/comparer")}): face-à-face de deux à quatre pays ; toute paire a sa page, par exemple ${u("/comparer/chine-vs-etats-unis")}.`, "");
  l.push("## Méthode et confiance");
  l.push(`- [Méthodologie](${u("/methodologie")}): choix des sources, dates, données manquantes, rôle de l'IA, corrections.`);
  l.push(`- [Sources](${u("/sources")}): toutes les sources, rubrique par rubrique.`);
  l.push(`- [Méthodologie de la base](${u("/methodologie-donnees")}): structure et contrôles de la base de données.`);
  l.push(`- [À propos](${u("/a-propos")})`);
  l.push(`- [Contact](${u("/contact")})`, "");
  l.push("## Optional");
  l.push(`- [Chiffres clés complets](${u("/llms-full.txt")}): les classements et les productions mondiales en texte brut.`);
  l.push(`- [Plan du site](${u("/plan-du-site")})`);
  l.push(`- [Mentions légales](${u("/mentions-legales")}), [Confidentialité](${u("/confidentialite")}), [CGU](${u("/cgu")})`);
  return l.join("\n") + "\n";
}

export function llmsComplet(): string {
  const l: string[] = [llmsCourt(), "", "# Chiffres clés", ""];
  l.push("Valeurs lues dans la base de Datlas à la construction du site. Chaque ligne donne la dernière valeur publiée et son année ; la page indiquée donne le classement complet et la source.", "");
  for (const i of INDICATEURS) {
    const { lignes, annee } = classementDe(i);
    l.push(`## ${i.titre} (${annee}) · ${u(`/classements/${i.slug}`)}`);
    l.push(`Source : ${i.source}. ${i.definition}`);
    for (const x of lignes.slice(0, 10)) l.push(`${x.rang}. ${x.pays.fr} : ${i.fmt(x.m.v)} (${x.m.annee})`);
    const fr = lignes.find((x) => x.pays.slug === "france");
    if (fr) l.push(`France : ${fr.rang}e sur ${lignes.length}, ${i.fmt(fr.m.v)} (${fr.m.annee})`);
    l.push("");
  }
  for (const r of pagesRessources()) {
    const f = ficheRessource(r);
    if (!f || !f.total) continue;
    l.push(`## Production mondiale : ${r.nom} (${f.annee}) · ${u(`/ressources/${r.slug}`)}`);
    l.push(`Total recalculé (somme de ${f.total.entites} pays et territoires, FAOSTAT) : ${nf(f.total.valeur)} ${f.unite}.`);
    for (const x of f.producteurs.slice(0, 5)) l.push(`${x.rang}. ${x.fr} : ${nf(x.valeur)} ${f.unite}${x.part !== null ? ` (${nf(x.part, 1)} %)` : ""}`);
    l.push("");
  }
  return l.join("\n") + "\n";
}
