/** Les objets possibles d'un message envoyé depuis /contact (la même liste que la contrainte de la table « contacts »). */
export const SUJETS = {
  question: "Une question sur le site",
  erreur: "Signaler une erreur dans un chiffre",
  rgpd: "Exercer mes droits sur mes données (RGPD)",
  signalement: "Signaler un contenu illicite (forum)",
  presse: "Presse, partenariat, réutilisation",
  autre: "Autre",
} as const;
export type Sujet = keyof typeof SUJETS;

export interface EtatEnvoi {
  ok: boolean;
  message: string;
}
