"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./article.css";

/* ═══════════════════════════════════════════════════════════════════════════
   LES GRAPHIQUES DES ARTICLES DE RESSOURCES

   Trois figures qu'on manipule : une courbe qu'on parcourt du doigt (plusieurs
   séries qu'on allume ou éteint), des barres de producteurs qu'on trie par
   indicateur, et la part des continents à quelques dates. Chaque figure garde
   son tableau de données lisible sans JavaScript.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Pt {
  annee: number;
  v: number;
}
export interface SerieG {
  nom: string;
  points: Pt[];
}

const nf = (v: number, d = 0) => v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
/** 140 100 000 t → « 140,1 M t » ; les unités de rendement restent en clair. */
export function court(v: number, u: string): string {
  if (Math.abs(v) >= 1e9) return `${nf(v / 1e9, 2)} Md ${u}`;
  if (Math.abs(v) >= 1e6) return `${nf(v / 1e6, 1)} M ${u}`;
  if (Math.abs(v) >= 1e4) return `${nf(v / 1e3, 0)} k ${u}`;
  return `${nf(v, v < 10 ? 1 : 0)} ${u}`;
}
const COULEURS = ["#7c4dff", "#ff5fae", "#20b486", "#f2a23a", "#3d8bfd", "#b06bff", "#e5484d", "#8c86ad"];

/* ── La courbe ──────────────────────────────────────────────────────────── */

export function Courbe({ series, unite, base100 = false, hauteur = 280 }: { series: SerieG[]; unite: string; base100?: boolean; hauteur?: number }) {
  const [actives, setActives] = useState<boolean[]>(() => series.map((_, i) => i < 5));
  const [indice, setIndice] = useState(false);
  const [curseur, setCurseur] = useState<number | null>(null);
  const zone = useRef<SVGSVGElement>(null);
  /* Sur un écran étroit, la courbe garde une hauteur lisible : le repère se resserre en largeur plutôt que de s'écraser. */
  const [etroit, setEtroit] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 640px)");
    const lire = () => setEtroit(m.matches);
    lire();
    m.addEventListener("change", lire);
    return () => m.removeEventListener("change", lire);
  }, []);
  const W = etroit ? 420 : 760;
  const H = etroit ? Math.round(hauteur * 0.95) : hauteur;
  const M = { g: 8, d: 8, h: 14, b: 26 };

  const visibles = useMemo(
    () =>
      series
        .map((s, i) => ({ s, i }))
        .filter(({ i }) => actives[i])
        .map(({ s, i }) => {
          if (!indice) return { s, i, pts: s.points };
          const ref = s.points[0]?.v;
          return { s, i, pts: ref ? s.points.map((p) => ({ annee: p.annee, v: (p.v / ref) * 100 })) : [] };
        }),
    [series, actives, indice],
  );
  const toutes = visibles.flatMap((x) => x.pts);
  const a0 = Math.min(...series.flatMap((s) => s.points.map((p) => p.annee)));
  const a1 = Math.max(...series.flatMap((s) => s.points.map((p) => p.annee)));
  const vmax = Math.max(1, ...toutes.map((p) => p.v)) * 1.06;
  const x = (a: number) => M.g + ((a - a0) / Math.max(1, a1 - a0)) * (W - M.g - M.d);
  const y = (v: number) => H - M.b - (v / vmax) * (H - M.h - M.b);
  const an = curseur ?? a1;

  const chemin = (pts: Pt[]) => {
    let d = "";
    let prec: number | null = null;
    for (const p of pts) {
      /* Une année absente casse le trait : on ne relie pas deux points qui ne se suivent pas. */
      d += `${prec !== null && p.annee === prec + 1 ? "L" : "M"}${x(p.annee).toFixed(1)} ${y(p.v).toFixed(1)}`;
      prec = p.annee;
    }
    return d;
  };
  const suit = (clientX: number) => {
    const r = zone.current?.getBoundingClientRect();
    if (!r) return;
    const px = ((clientX - r.left) / r.width) * W;
    const a = Math.round(a0 + ((px - M.g) / (W - M.g - M.d)) * (a1 - a0));
    setCurseur(Math.max(a0, Math.min(a1, a)));
  };
  const graduations = [a0, Math.round(a0 + (a1 - a0) / 3), Math.round(a0 + (2 * (a1 - a0)) / 3), a1];

  return (
    <div className="ra-courbe">
      <div className="ra-lecture" aria-live="polite">
        <b>{an}</b>
        {visibles.map(({ s, i, pts }) => {
          const p = pts.find((q) => q.annee === an);
          return (
            <span key={s.nom}>
              <i style={{ background: COULEURS[i % COULEURS.length] }} />
              {s.nom} <strong>{p ? (indice ? nf(p.v, 0) : court(p.v, unite)) : "n.d."}</strong>
            </span>
          );
        })}
      </div>
      <svg
        ref={zone}
        viewBox={`0 0 ${W} ${H}`}
        className="ra-svg"
        role="img"
        aria-label={`Évolution de ${a0} à ${a1}`}
        onPointerMove={(e) => suit(e.clientX)}
        onPointerDown={(e) => suit(e.clientX)}
        onPointerLeave={() => setCurseur(null)}
      >
        {[0.25, 0.5, 0.75, 1].map((k) => (
          <g key={k}>
            <line x1={M.g} x2={W - M.d} y1={y((vmax / 1.06) * k)} y2={y((vmax / 1.06) * k)} className="ra-grille" />
            <text x={M.g + 2} y={y((vmax / 1.06) * k) - 4} className="ra-axe">{indice ? nf((vmax / 1.06) * k, 0) : court((vmax / 1.06) * k, unite)}</text>
          </g>
        ))}
        {graduations.map((a) => (
          <text key={a} x={x(a)} y={H - 6} textAnchor={a === a0 ? "start" : a === a1 ? "end" : "middle"} className="ra-axe">{a}</text>
        ))}
        {visibles.map(({ s, i, pts }) => (
          <path key={s.nom} d={chemin(pts)} fill="none" stroke={COULEURS[i % COULEURS.length]} strokeWidth={i === 0 ? 2.6 : 2} strokeLinejoin="round" strokeLinecap="round" className="ra-trait" />
        ))}
        <line x1={x(an)} x2={x(an)} y1={M.h} y2={H - M.b} className="ra-curseur" />
        {visibles.map(({ s, i, pts }) => {
          const p = pts.find((q) => q.annee === an);
          return p ? <circle key={s.nom} cx={x(p.annee)} cy={y(p.v)} r={4.5} fill={COULEURS[i % COULEURS.length]} className="ra-point" /> : null;
        })}
      </svg>
      {(series.length > 1 || base100) && (
        <div className="ra-puces" role="group" aria-label="Séries affichées">
          {series.length > 1 &&
            series.map((s, i) => (
              <button
                key={s.nom}
                type="button"
                aria-pressed={actives[i]}
                className={actives[i] ? "ra-on" : undefined}
                onClick={() => setActives((t) => t.map((v, k) => (k === i ? !v : v)))}
              >
                <i style={{ background: COULEURS[i % COULEURS.length] }} />
                {s.nom}
              </button>
            ))}
          {base100 && (
            <button type="button" aria-pressed={indice} className={`ra-indice${indice ? " ra-on" : ""}`} onClick={() => setIndice(!indice)}>
              {indice ? "Volumes" : "Indice (départ = 100)"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Les producteurs, à trier ─────────────────────────────────────────────── */

export interface LigneProd {
  fr: string;
  lien: string | null;
  valeur: number;
  part: number | null;
  evolution: number | null;
  rdt: number | null;
  rangRdt: number | null;
  surface: number | null;
  rangSurface: number | null;
}
type Cle = "valeur" | "part" | "evolution" | "rdt" | "surface";

export function Producteurs({ lignes, unite, uniteRdt, libelleRdt, annee, nRdt }: { lignes: LigneProd[]; unite: string; uniteRdt: string | null; libelleRdt: string; annee: number; nRdt: number }) {
  const cles: { id: Cle; label: string }[] = [
    { id: "valeur", label: "Production" },
    { id: "part", label: "Part du total" },
    { id: "evolution", label: "Sur 10 ans" },
    ...(uniteRdt ? [{ id: "rdt" as Cle, label: libelleRdt }] : []),
    ...(lignes.some((l) => l.surface !== null) ? [{ id: "surface" as Cle, label: "Surface" }] : []),
  ];
  const [cle, setCle] = useState<Cle>("valeur");
  const [ouvert, setOuvert] = useState<string | null>(lignes[0]?.fr ?? null);
  const tri = [...lignes].filter((l) => l[cle] !== null).sort((a, b) => (b[cle] as number) - (a[cle] as number));
  const max = Math.max(...tri.map((l) => Math.abs(l[cle] as number)), 1);
  const fmt = (l: LigneProd) => {
    const v = l[cle] as number;
    if (cle === "valeur") return court(v, unite);
    if (cle === "part") return `${nf(v, 1)} %`;
    if (cle === "evolution") return `${v > 0 ? "+" : ""}${nf(v, 0)} %`;
    if (cle === "rdt") return `${nf(v)} ${uniteRdt}`;
    return court(v, "ha");
  };
  return (
    <div className="ra-prod">
      <div className="ra-onglets" role="tablist" aria-label="Trier les producteurs">
        {cles.map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={cle === c.id} className={cle === c.id ? "ra-on" : undefined} onClick={() => setCle(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <ol className="ra-barres">
        {tri.map((l, i) => {
          const v = l[cle] as number;
          const neg = v < 0;
          return (
            <li key={l.fr} className={ouvert === l.fr ? "ra-ouv" : undefined}>
              <button type="button" className="ra-ligne" aria-expanded={ouvert === l.fr} onClick={() => setOuvert(ouvert === l.fr ? null : l.fr)}>
                <span className="ra-r">{i + 1}</span>
                <span className="ra-n">{l.fr}</span>
                <span className="ra-z">
                  <span className={`ra-b${neg ? " ra-neg" : ""}`} style={{ width: `${(Math.abs(v) / max) * 100}%`, "--i": i } as React.CSSProperties} />
                </span>
                <span className="ra-v">{fmt(l)}</span>
              </button>
              {ouvert === l.fr && (
                <div className="ra-det">
                  <span>
                    Production {annee} <b>{court(l.valeur, unite)}</b>
                  </span>
                  {l.part !== null && (
                    <span>
                      Part du total <b>{nf(l.part, 1)} %</b>
                    </span>
                  )}
                  {l.evolution !== null && (
                    <span>
                      Sur 10 ans <b>{`${l.evolution > 0 ? "+" : ""}${nf(l.evolution, 0)} %`}</b>
                    </span>
                  )}
                  {l.rdt !== null && uniteRdt && (
                    <span>
                      {libelleRdt} <b>{nf(l.rdt)} {uniteRdt}</b>
                      {l.rangRdt ? <small> ({l.rangRdt}e sur {nRdt})</small> : null}
                    </span>
                  )}
                  {l.surface !== null && (
                    <span>
                      Surface <b>{court(l.surface, "ha")}</b>
                      {l.rangSurface ? <small> ({l.rangSurface}e)</small> : null}
                    </span>
                  )}
                  {l.lien && (
                    <a href={l.lien} className="ra-lien">
                      Toutes les ressources de ce pays →
                    </a>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ── Les continents ─────────────────────────────────────────────────────── */

export function Continents({ dates }: { dates: { annee: number; parts: { continent: string; valeur: number; part: number }[] }[] }) {
  const [sel, setSel] = useState(dates.length - 1);
  const d = dates[sel];
  const COUL: Record<string, string> = { Asie: "#7c4dff", Europe: "#3d8bfd", "Amériques": "#20b486", Afrique: "#f2a23a", "Océanie": "#ff5fae" };
  return (
    <div className="ra-cont">
      <div className="ra-onglets" role="tablist" aria-label="Année">
        {dates.map((x, i) => (
          <button key={x.annee} type="button" role="tab" aria-selected={i === sel} className={i === sel ? "ra-on" : undefined} onClick={() => setSel(i)}>
            {x.annee}
          </button>
        ))}
      </div>
      <div className="ra-pile" aria-hidden="true">
        {d.parts.filter((p) => p.part > 0).map((p) => (
          <span key={p.continent} style={{ flexGrow: p.part, background: COUL[p.continent] }} title={`${p.continent} : ${nf(p.part, 1)} %`} />
        ))}
      </div>
      <ul className="ra-cont-l">
        {d.parts.map((p) => (
          <li key={p.continent}>
            <i style={{ background: COUL[p.continent] }} />
            {p.continent}
            <b>{nf(p.part, 1)} %</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
