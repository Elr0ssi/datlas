"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/* ═══════════════════════════════════════════════════════════════════════════
   LA BARRE DE PROGRESSION DE NAVIGATION

   Un trait violet en haut de l'écran dès qu'on touche un lien interne, qui
   avance pendant le chargement et se termine quand la nouvelle page arrive :
   le clic répond tout de suite, même quand la page visée est lourde.

   Si la page tarde (plus d'un quart de seconde), le globe de Datlas apparaît
   par-dessus : il tourne, s'aplatit en carte, redevient globe, jusqu'à
   l'arrivée de la page. Une page déjà préchargée arrive avant lui : il ne se
   montre pas. Jamais à la première visite, qui s'affiche sans écran
   d'attente.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Le délai avant de montrer le globe : en deçà, la page arrive assez vite pour qu'un écran d'attente ralentisse. */
const DELAI_GLOBE = 250;

export function Progression() {
  const chemin = usePathname();
  const [etat, setEtat] = useState<"repos" | "charge" | "fin">("repos");
  const [globe, setGlobe] = useState(false);
  const avant = useRef(chemin);
  /* Vrai entre le clic sur un lien et l'arrivée de la page : seules ces navigations remontent en haut (le bouton retour, lui, retrouve la position quittée). */
  const parClic = useRef(false);

  useEffect(() => {
    const clic = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      let u: URL;
      try {
        u = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (u.origin !== window.location.origin || u.pathname === window.location.pathname || a.closest("[data-sans-chargement]")) return;
      parClic.current = !u.hash;
      setEtat("charge");
    };
    /* En capture : les liens de Next annulent le comportement par défaut du clic avant qu'il ne remonte au document. */
    document.addEventListener("click", clic, true);
    return () => document.removeEventListener("click", clic, true);
  }, []);

  useEffect(() => {
    if (chemin === avant.current) return;
    avant.current = chemin;
    /* La nouvelle page s'ouvre en haut, d'un coup, sans défilement visible : le voile la couvre encore. */
    if (parClic.current) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    parClic.current = false;
    setEtat("fin");
    const t = window.setTimeout(() => setEtat("repos"), 380);
    return () => window.clearTimeout(t);
  }, [chemin]);

  /* Un garde-fou : si la navigation est abandonnée, la barre ne reste pas affichée. */
  useEffect(() => {
    if (etat !== "charge") {
      setGlobe(false);
      return;
    }
    const g = window.setTimeout(() => setGlobe(true), DELAI_GLOBE);
    const t = window.setTimeout(() => setEtat("repos"), 8000);
    return () => {
      window.clearTimeout(g);
      window.clearTimeout(t);
    };
  }, [etat]);

  return (
    <>
      <div className={`nv-barre nv-${etat}`} aria-hidden="true" />
      <div className={`nv-voile${globe ? " nv-voile-on" : ""}`} role="status" aria-live="polite">
        {globe && (
          <>
            <svg className="nv-globe" viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <linearGradient id="nv-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#4318d1" />
                  <stop offset=".55" stopColor="#6d3df5" />
                  <stop offset="1" stopColor="#a77bff" />
                </linearGradient>
              </defs>
              <g className="nv-g-corps">
                <rect className="nv-g-disque" x="20" y="20" width="80" height="80" rx="40" />
                <g className="nv-g-lignes">
                  <path className="nv-g-par" d="M22 46h76M20 60h80M22 74h76" />
                  <ellipse className="nv-g-mer nv-m1" cx="60" cy="60" rx="38" ry="40" />
                  <ellipse className="nv-g-mer nv-m2" cx="60" cy="60" rx="38" ry="40" />
                  <path className="nv-g-axe" d="M34 26v68M47 22v76M60 20v80M73 22v76M86 26v68" />
                </g>
              </g>
              <circle className="nv-g-point" cx="96" cy="26" r="6" />
            </svg>
            <span className="nv-cache">Chargement de la page</span>
          </>
        )}
      </div>
    </>
  );
}
