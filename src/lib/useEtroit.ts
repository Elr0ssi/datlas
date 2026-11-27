"use client";

import { useEffect, useState } from "react";

/** Vrai quand l'écran est plus étroit que `largeur` pixels (une seule colonne). Faux au rendu serveur. */
export function useEtroit(largeur = 1080) {
  const [etroit, setEtroit] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${largeur}px)`);
    const lit = () => setEtroit(mq.matches);
    lit();
    mq.addEventListener("change", lit);
    return () => mq.removeEventListener("change", lit);
  }, [largeur]);
  return etroit;
}
