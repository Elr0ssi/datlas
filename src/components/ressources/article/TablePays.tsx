"use client";

import { useState } from "react";
import { Courbe, court, type Pt } from "./Graphes";
import "./article.css";

/* Les ressources d'un pays : un tableau qu'on trie (rang relatif, part du monde, évolution, rendement), et chaque ligne
   s'ouvre sur la courbe de production du pays depuis la première année publiée. */

export interface LigneRP {
  slug: string;
  nom: string;
  annee: number;
  unite: string;
  rang: number;
  n: number;
  valeur: number;
  part: number | null;
  evolution: number | null;
  rdt: number | null;
  rangRdt: number | null;
  nRdt: number;
  uniteRdt: string | null;
  medianeRdt: number | null;
  serie: Pt[];
}

type Tri = "rang" | "part" | "evolution" | "rdt";
const nf = (v: number, d = 0) => v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
const rangTxt = (r: number) => (r === 1 ? "1er" : `${r}e`);

export function TablePays({ lignes }: { lignes: LigneRP[] }) {
  const [tri, setTri] = useState<Tri>("rang");
  const [ouvert, setOuvert] = useState<string | null>(null);
  const val = (l: LigneRP): number | null =>
    tri === "rang" ? -(l.rang / l.n) : tri === "part" ? l.part : tri === "evolution" ? l.evolution : l.rdt && l.medianeRdt ? l.rdt / l.medianeRdt : null;
  const triees = [...lignes].sort((a, b) => (val(b) ?? -Infinity) - (val(a) ?? -Infinity));
  const TRIS: { id: Tri; label: string }[] = [
    { id: "rang", label: "Meilleur rang" },
    { id: "part", label: "Part du monde" },
    { id: "evolution", label: "Progression sur 10 ans" },
    { id: "rdt", label: "Rendement face au médian" },
  ];
  return (
    <div className="ra-tp">
      <div className="ra-onglets" role="tablist" aria-label="Trier les ressources">
        {TRIS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tri === t.id} className={tri === t.id ? "ra-on" : undefined} onClick={() => setTri(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <ul className="ra-tp-l">
        {triees.map((l) => {
          const o = ouvert === l.slug;
          const fort = l.rang <= 3 ? "Podium mondial" : l.rang <= 10 ? "Top 10 mondial" : (l.part ?? 0) >= 5 ? "Poids lourd" : null;
          return (
            <li key={l.slug} className={o ? "ra-ouv" : undefined}>
              <button type="button" className="ra-tp-b" aria-expanded={o} onClick={() => setOuvert(o ? null : l.slug)}>
                <span className="ra-tp-n">
                  {l.nom}
                  {fort && <em className="ra-tag">{fort}</em>}
                </span>
                <span className="ra-tp-c">
                  <small>Rang</small>
                  <b>{rangTxt(l.rang)}</b>
                  <small>sur {l.n}</small>
                </span>
                <span className="ra-tp-c">
                  <small>Production {l.annee}</small>
                  <b>{court(l.valeur, l.unite)}</b>
                </span>
                <span className="ra-tp-c">
                  <small>Part du monde</small>
                  <b>{l.part === null ? "–" : `${nf(l.part, l.part < 1 ? 2 : 1)} %`}</b>
                </span>
                <span className="ra-tp-c">
                  <small>Sur 10 ans</small>
                  <b className={l.evolution === null ? undefined : l.evolution >= 0 ? "ra-plus" : "ra-moins"}>{l.evolution === null ? "–" : `${l.evolution > 0 ? "+" : ""}${nf(l.evolution, 0)} %`}</b>
                </span>
              </button>
              {o && (
                <div className="ra-tp-d">
                  {l.rdt !== null && l.uniteRdt && (
                    <p>
                      Rendement : <b>{nf(l.rdt)} {l.uniteRdt}</b>
                      {l.rangRdt ? ` (${rangTxt(l.rangRdt)} sur ${l.nRdt} grands producteurs)` : ""}
                      {l.medianeRdt ? `, contre ${nf(l.medianeRdt)} ${l.uniteRdt} pour le producteur médian.` : "."}
                    </p>
                  )}
                  {l.serie.length > 1 && <Courbe series={[{ nom: l.nom, points: l.serie }]} unite={l.unite} hauteur={220} />}
                  <a href={`/ressources/${l.slug}`} className="ra-lien">
                    La production mondiale, pays par pays →
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
