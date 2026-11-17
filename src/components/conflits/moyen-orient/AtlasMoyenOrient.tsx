"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Copy, ExternalLink, Flag, RotateCcw } from "lucide-react";
import { EnTete, Pied } from "@/components/concept/pieces";
import { Selecteur } from "@/components/concept/Selecteur";
import { useTheme } from "@/components/concept/Theme";
import {
  ATLAS_MO, ARRET_MO, ANNEE_MIN_MO, ANNEE_MAX_MO, PAYS_MO, STATUTS_MO, an, dateMO, dossierMO, dossiersMO, jalonsMO, liesMO, mesuresMO,
  nomPaysMO, relationsMO, sourceMO, statutMO, typeRelationMO, valeurMO, type DossierMO, type MesureMO,
} from "@/data/conflits/moyenOrient";
import "@/components/concept/concept.css";
import "@/components/concept/v2eco.css";
import "./atlas-mo.css";

/* ═══════════════════════════════════════════════════════════════════════════
   L'ATLAS DU MOYEN-ORIENT

   Filtres (pays, année, liens), liste des dossiers, carte, et la fiche du dossier : synthèse et chiffres datés et sourcés,
   chronologie, acteurs, sources. Les textes explicatifs sont rendus par le serveur dans la page (voir app/conflits/moyen-orient) ;
   ce composant ne porte que l'interaction. La carte est chargée côté client seulement.
   ═══════════════════════════════════════════════════════════════════════════ */

const Carte = dynamic(() => import("./CarteMoyenOrient"), {
  ssr: false,
  loading: () => <div className="mo-carte mo-attente">Chargement de la carte…</div>,
});

type Onglet = "synthese" | "chronologie" | "acteurs" | "sources";
const ONGLETS: [Onglet, string][] = [["synthese", "Synthèse"], ["chronologie", "Chronologie"], ["acteurs", "Acteurs"], ["sources", "Sources"]];
const TOUS = "Tous les pays";
const ANNEES = Array.from({ length: ANNEE_MAX_MO - ANNEE_MIN_MO + 1 }, (_, i) => ANNEE_MAX_MO - i);

export function AtlasMoyenOrient({ children }: { children?: React.ReactNode }) {
  const [theme] = useTheme();
  const [id, setId] = useState<string | null>(null);
  const [annee, setAnnee] = useState(ANNEE_MAX_MO);
  const [pays, setPays] = useState<string>(TOUS);
  const [liens, setLiens] = useState(true);
  const [onglet, setOnglet] = useState<Onglet>("synthese");

  const codePays = Object.entries(PAYS_MO).find(([, p]) => p.fr === pays)?.[0] ?? "tous";
  const visibles = useMemo(() => dossiersMO(annee, codePays), [annee, codePays]);
  const choisi = visibles.find((c) => c.id === id) ?? null;
  const relations = useMemo(() => (liens ? relationsMO(visibles, annee, choisi?.id ?? null) : []), [liens, visibles, annee, choisi]);
  const paysOptions = [TOUS, ...[...new Set(ATLAS_MO.conflicts.flatMap((c) => c.countries))].map(nomPaysMO).sort((a, b) => a.localeCompare(b, "fr"))];
  const statutsVus = [...new Set(visibles.map((c) => c.status))];

  /* L'adresse garde le dossier : ?dossier=gaza&annee=2024. */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const d = q.get("dossier");
    const a = Number(q.get("annee"));
    if (a >= ANNEE_MIN_MO && a <= ANNEE_MAX_MO) setAnnee(a);
    if (d && dossierMO(d)) setId(d);
  }, []);
  useEffect(() => {
    const q = new URLSearchParams();
    if (id) q.set("dossier", id);
    if (annee !== ANNEE_MAX_MO) q.set("annee", String(annee));
    const s = q.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
  }, [id, annee]);

  const ouvrir = (x: string | null) => { setId(x); setOnglet("synthese"); };
  const raz = () => { setId(null); setPays(TOUS); setAnnee(ANNEE_MAX_MO); setLiens(true); setOnglet("synthese"); };

  return (
    <div className="cg cg-eco cg-v2 mo">
      <EnTete actif="Conflits" />

      <section className="cg-section mo-haut">
        <div className="cg-wrap">
          <a className="mo-retour" href="/conflits"><ArrowLeft size={14} aria-hidden="true" /> Tous les conflits</a>
          <header className="v2-tete">
            <h1 className="v2-h2 mo-h1">Atlas du Moyen-Orient</h1>
            <p className="v2-sous">{`${ATLAS_MO.conflicts.length} dossiers · ${ATLAS_MO.places.length} repères · ${ATLAS_MO.sources.length} sources · données arrêtées au ${dateMO(ARRET_MO)}`}</p>
          </header>

          <div className="mo-barre" role="group" aria-label="Filtres de l'atlas">
            <label className="cg-an-choix">
              <span className="cg-an-choix-l">Pays</span>
              <Selecteur valeur={pays} options={paysOptions} onChange={(v) => { setPays(v); ouvrir(null); }} label="Pays" />
            </label>
            <label className="cg-an-choix">
              <span className="cg-an-choix-l">Année</span>
              <Selecteur valeur={annee} options={ANNEES} onChange={(v) => setAnnee(v)} label="Année de référence" />
            </label>
            <button type="button" className={`mo-bascule${liens ? " mo-bascule-on" : ""}`} aria-pressed={liens} onClick={() => setLiens((l) => !l)}>
              <i aria-hidden="true" /> Liens entre dossiers
            </button>
            <button type="button" className="mo-raz" onClick={raz}><RotateCcw size={14} aria-hidden="true" /> Réinitialiser</button>
            <span className="mo-n" aria-live="polite">{visibles.length} dossier{visibles.length > 1 ? "s" : ""} en {annee}</span>
          </div>

          <div className="mo-grille">
            <nav className="mo-liste" aria-label="Dossiers">
              <button type="button" className={`mo-dossier${!choisi ? " mo-dossier-on" : ""}`} onClick={() => ouvrir(null)}>
                <b>Vue d’ensemble</b>
                <small>Région Moyen-Orient</small>
              </button>
              {visibles.map((c) => (
                <button key={c.id} type="button" className={`mo-dossier${choisi?.id === c.id ? " mo-dossier-on" : ""}`} onClick={() => ouvrir(c.id)} aria-current={choisi?.id === c.id}>
                  <b><i style={{ background: statutMO(c.status).couleur }} aria-hidden="true" />{c.shortTitle}</b>
                  <small>{statutMO(c.status).libelle} · depuis {an(c.started)}</small>
                </button>
              ))}
              {visibles.length === 0 && <p className="mo-vide">Aucun dossier ouvert en {annee} pour ce pays.</p>}
            </nav>

            <div className="mo-centre">
              <Carte visibles={visibles} choisi={choisi} relations={relations} nuit={theme === "nuit"} onDossier={ouvrir} />
              <div className="mo-legende" aria-label="Légende">
                {statutsVus.map((s) => <span key={s}><i style={{ background: STATUTS_MO[s]?.couleur }} />{statutMO(s).libelle}</span>)}
                <span><i className="mo-lg-ville" />Centre de ville</span>
                <span><i className="mo-lg-zone" />Région ou passage (approximatif)</span>
                {liens && <span><i className="mo-lg-lien" />Lien explicatif, pas un trajet</span>}
              </div>
            </div>

            <article className="mo-fiche" aria-live="polite">
              {choisi ? <Fiche c={choisi} annee={annee} onglet={onglet} setOnglet={setOnglet} ouvrir={ouvrir} /> : <Ensemble annee={annee} visibles={visibles} ouvrir={ouvrir} />}
            </article>
          </div>
        </div>
      </section>

      {children}
      <Pied />
    </div>
  );
}

function Ensemble({ annee, visibles, ouvrir }: { annee: number; visibles: DossierMO[]; ouvrir: (id: string) => void }) {
  return (
    <>
      <span className="mo-k">Vue d’ensemble · {annee}</span>
      <h2 className="mo-h2">Une région, plusieurs histoires</h2>
      <div className="ge-vedette mo-vedette">
        <span className="ge-vedette-l">Dossiers ouverts en {annee}</span>
        <span className="ge-vedette-v">{visibles.length}</span>
        <span className="ge-vedette-r">sur {ATLAS_MO.conflicts.length} dossiers documentés</span>
      </div>
      <ul className="mo-mini">
        {visibles.map((c) => (
          <li key={c.id}>
            <button type="button" onClick={() => ouvrir(c.id)}>
              <i style={{ background: statutMO(c.status).couleur }} aria-hidden="true" />
              <span><b>{c.shortTitle}</b><small>{c.overview}</small></span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mo-note">Chaque dossier a sa propre période et ses propres sources : les bilans ne s’additionnent pas d’un dossier à l’autre.</p>
    </>
  );
}

function Fiche({ c, annee, onglet, setOnglet, ouvrir }: { c: DossierMO; annee: number; onglet: Onglet; setOnglet: (o: Onglet) => void; ouvrir: (id: string | null) => void }) {
  const mesures = mesuresMO(c, annee);
  const jalons = jalonsMO(c, annee);
  const lies = liesMO(c, annee);
  const st = statutMO(c.status);
  return (
    <>
      <button type="button" className="mo-back" onClick={() => ouvrir(null)}><ArrowLeft size={14} aria-hidden="true" /> Vue d’ensemble</button>
      <span className="mo-k"><i style={{ background: st.couleur }} aria-hidden="true" />{st.libelle} · depuis {dateMO(c.started)}</span>
      <h2 className="mo-h2">{c.title}</h2>
      <p className="mo-chapo">{c.overview}</p>

      <div className="mo-onglets" role="tablist" aria-label="Rubriques du dossier">
        {ONGLETS.map(([o, l]) => (
          <button key={o} type="button" role="tab" aria-selected={onglet === o} className={onglet === o ? "mo-onglet-on" : undefined} onClick={() => setOnglet(o)}>{l}</button>
        ))}
      </div>

      {onglet === "synthese" && (
        <div role="tabpanel">
          <h3 className="mo-h3">En 30 secondes</h3>
          <p>{c.why}</p>
          <h3 className="mo-h3">Chiffres datés et sourcés</h3>
          {mesures.length ? mesures.map((m) => <Mesure key={m.id} m={m} dossier={c} />) : (
            <p className="mo-vide">{c.metrics.length ? `Aucun chiffre arrêté en ${annee} ou avant.` : "Non documenté : pas de bilan chiffré assez comparable dans cette version."}</p>
          )}
          <h3 className="mo-h3">Causes</h3>
          <ul className="mo-puces">{c.causes.map((x) => <li key={x}>{x}</li>)}</ul>
          {lies.length > 0 && (
            <>
              <h3 className="mo-h3">Sujets liés</h3>
              <ul className="mo-lies">
                {lies.map((l) => (
                  <li key={l.relation.id}>
                    <button type="button" onClick={() => ouvrir(l.dossier.id)}>
                      <b>{l.dossier.shortTitle}</b>
                      <small>{typeRelationMO(l.relation.type)} · {l.relation.label}</small>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {c.keywords.length > 0 && <div className="mo-tags">{c.keywords.map((k) => <span key={k}>{k}</span>)}</div>}
        </div>
      )}

      {onglet === "chronologie" && (
        <div role="tabpanel">
          <h3 className="mo-h3">Chronologie jusqu’à {annee}</h3>
          {jalons.length ? (
            <ol className="mo-chrono">
              {jalons.map((e) => {
                const s = sourceMO(e.sourceId);
                return (
                  <li key={`${e.date}-${e.title}`}>
                    <time dateTime={e.date}>{dateMO(e.date)}</time>
                    <b>{e.title}</b>
                    <p>{e.detail}</p>
                    {s && <a href={s.url} target="_blank" rel="noopener noreferrer">{s.organization} <ExternalLink size={11} aria-hidden="true" /></a>}
                  </li>
                );
              })}
            </ol>
          ) : <p className="mo-vide">Aucun jalon daté en {annee} ou avant.</p>}
        </div>
      )}

      {onglet === "acteurs" && (
        <div role="tabpanel">
          <h3 className="mo-h3">Acteurs et rôles</h3>
          {c.actors.map((a) => (
            <div key={a.name} className="mo-acteur">
              <b>{a.name}</b>
              <p>{a.role}</p>
              <small>Effectifs : {valeurMO(a.estimatedPersonnel as number | null)}{a.personnelNote ? `. ${a.personnelNote}` : ""}</small>
            </div>
          ))}
        </div>
      )}

      {onglet === "sources" && (
        <div role="tabpanel">
          <h3 className="mo-h3">Sources du dossier</h3>
          {c.sourceIds.map((sid) => {
            const s = sourceMO(sid);
            return s ? (
              <a key={sid} className="mo-source" href={s.url} target="_blank" rel="noopener noreferrer">
                <b>{s.organization}</b>
                <span>{s.title}</span>
                <small>{dateMO(s.publishedOrUpdated)} <ExternalLink size={11} aria-hidden="true" /></small>
              </a>
            ) : null;
          })}
          <h3 className="mo-h3">Précautions</h3>
          <p>{ATLAS_MO.safetyNote}</p>
          <Signaler sujet={`Dossier « ${c.title} »`} />
        </div>
      )}
    </>
  );
}

function Mesure({ m, dossier }: { m: MesureMO; dossier: DossierMO }) {
  const s = sourceMO(m.sourceId);
  return (
    <div className="mo-mesure">
      <strong>{valeurMO(m.value)} <small>{m.unit}</small></strong>
      <span className="mo-mesure-l">{m.label}</span>
      <span className="mo-mesure-m">
        {m.scope} · du {dateMO(m.periodStart)} au {dateMO(m.periodEnd)} · arrêté au {dateMO(m.asOf)}
      </span>
      {s && (
        <span className="mo-mesure-s">
          Source : <a href={s.url} target="_blank" rel="noopener noreferrer">{s.organization}</a> · vérifié à l’arrêt du {dateMO(ARRET_MO)}
        </span>
      )}
      {m.notes && <p>{m.notes}</p>}
      <Signaler sujet={`${dossier.shortTitle} · ${m.label} (${valeurMO(m.value)} ${m.unit}, ${s?.organization ?? m.sourceId}, au ${m.asOf})`} petit />
    </div>
  );
}

/** « Signaler une erreur » : le signalement est rédigé pour vous, à coller dans le forum. Aucun envoi automatique. */
function Signaler({ sujet, petit = false }: { sujet: string; petit?: boolean }) {
  const [ouvert, setOuvert] = useState(false);
  const [copie, setCopie] = useState(false);
  const texte = `Signalement d'erreur · Atlas du Moyen-Orient\n${sujet}\nCe qui me paraît faux :\nSource qui le montre :`;
  return (
    <div className={`mo-signaler${petit ? " mo-signaler-p" : ""}`}>
      <button type="button" onClick={() => setOuvert((o) => !o)} aria-expanded={ouvert}><Flag size={12} aria-hidden="true" /> Signaler une erreur</button>
      {ouvert && (
        <div className="mo-signaler-b">
          <textarea readOnly value={texte} rows={4} aria-label="Texte du signalement" />
          <div>
            <button type="button" onClick={() => { navigator.clipboard?.writeText(texte).then(() => setCopie(true)).catch(() => {}); }}>
              {copie ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />} {copie ? "Copié" : "Copier"}
            </button>
            <a href="/forum">Ouvrir le forum</a>
          </div>
        </div>
      )}
    </div>
  );
}

