"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/* ═══════════════════════════════════════════════════════════════════════════
   LA BARRE DE PROGRESSION DE NAVIGATION

   Un trait violet en haut de l'écran dès qu'on touche un lien interne, qui
   avance pendant le chargement et se termine quand la nouvelle page arrive :
   le clic répond tout de suite, même quand la page visée est lourde.
   ═══════════════════════════════════════════════════════════════════════════ */

export function Progression() {
  const chemin = usePathname();
  const [etat, setEtat] = useState<"repos" | "charge" | "fin">("repos");
  const avant = useRef(chemin);

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
      if (u.origin !== window.location.origin || u.pathname === window.location.pathname) return;
      setEtat("charge");
    };
    document.addEventListener("click", clic);
    return () => document.removeEventListener("click", clic);
  }, []);

  useEffect(() => {
    if (chemin === avant.current) return;
    avant.current = chemin;
    setEtat("fin");
    const t = window.setTimeout(() => setEtat("repos"), 380);
    return () => window.clearTimeout(t);
  }, [chemin]);

  /* Un garde-fou : si la navigation est abandonnée, la barre ne reste pas affichée. */
  useEffect(() => {
    if (etat !== "charge") return;
    const t = window.setTimeout(() => setEtat("repos"), 12000);
    return () => window.clearTimeout(t);
  }, [etat]);

  return <div className={`nv-barre nv-${etat}`} aria-hidden="true" />;
}
