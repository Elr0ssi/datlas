"use client";

import { BarChart3, Crown, Globe2, Layers, Sprout, TrendingUp } from "lucide-react";
import { ChiffresCles } from "@/articles/dette/cadre";

/* Les chiffres clés d'un article de ressource. Les icônes sont désignées par leur nom : une page serveur ne peut pas
   passer un composant (une fonction) à un composant client. */
const ICONES = { globe: Globe2, couronne: Crown, couches: Layers, hausse: TrendingUp, barres: BarChart3, pousse: Sprout };
export type NomIcone = keyof typeof ICONES;

export function Cles({ cartes }: { cartes: { icone: NomIcone; valeur: string; libelle: string; texte: string }[] }) {
  return <ChiffresCles cartes={cartes.map((c) => ({ ...c, icone: ICONES[c.icone] }))} />;
}
