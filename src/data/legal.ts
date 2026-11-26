/* ═══════════════════════════════════════════════════════════════════════════
   LES FAITS JURIDIQUES DU SITE, EN UN SEUL ENDROIT

   Mentions légales, confidentialité, cookies et CGU reprennent ces valeurs :
   une seule source, pour qu'aucune page n'en contredise une autre.

   L'éditeur est une personne morale. Son nom n'est pas affiché sur le site ;
   ses éléments d'identification sont ceux du compte d'hébergement. Si la loi
   l'exige pour votre forme d'activité (édition à titre professionnel), il
   suffit de renseigner EDITEUR.denomination, EDITEUR.siege, EDITEUR.immatriculation :
   les pages les afficheront d'elles-mêmes.
   ═══════════════════════════════════════════════════════════════════════════ */

/** La date de dernière mise à jour commune aux pages légales (AAAA-MM-JJ). */
export const MAJ_LEGAL = "2026-11-26";

export const EDITEUR = {
  forme: "une personne morale",
  /** Laisser vide pour ne pas afficher de nom. */
  denomination: "",
  siege: "",
  immatriculation: "",
  directeur: "le représentant légal de la personne morale éditrice",
  contact: "/contact",
};

export const HEBERGEUR = {
  nom: "Vercel Inc.",
  adresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  site: "https://vercel.com",
};

/** Les prestataires qui traitent des données pour le compte de l'éditeur (sous-traitants au sens du RGPD). */
export const SOUS_TRAITANTS = [
  {
    nom: "Vercel Inc.",
    role: "Hébergement et diffusion du site (serveurs, réseau de distribution).",
    donnees: "Adresse IP et données techniques de connexion, le temps de servir la page et d'en assurer la sécurité.",
    lieu: "Réseau mondial, siège aux États-Unis",
    garanties: "Clauses contractuelles types de la Commission européenne et Data Privacy Framework UE–États-Unis.",
    lien: "https://vercel.com/legal/privacy-policy",
  },
  {
    nom: "Supabase Inc.",
    role: "Base de données et authentification des comptes (forum, favoris, carnet, messages de contact).",
    donnees: "Adresse e-mail, pseudo, contenus publiés ou enregistrés, jetons de session.",
    lieu: "Base hébergée dans l'Union européenne (Francfort, Allemagne)",
    garanties: "Accord de traitement des données (DPA) et clauses contractuelles types pour tout accès hors de l'UE.",
    lien: "https://supabase.com/privacy",
  },
  {
    nom: "Google (connexion avec Google)",
    role: "Uniquement si vous choisissez « Continuer avec Google » pour vous connecter.",
    donnees: "Adresse e-mail et identifiant de compte Google transmis à la connexion.",
    lieu: "Union européenne et États-Unis",
    garanties: "Data Privacy Framework UE–États-Unis et clauses contractuelles types.",
    lien: "https://policies.google.com/privacy",
  },
  {
    nom: "MyMemory (Translated S.r.l.)",
    role: "Traduction en anglais d'un passage que vous sélectionnez et choisissez de traduire.",
    donnees: "Le seul texte sélectionné (500 caractères au plus), envoyé par nos serveurs : ni votre adresse IP, ni votre identité ne sont transmises.",
    lieu: "Italie (Union européenne)",
    garanties: "Prestataire établi dans l'Union européenne.",
    lien: "https://mymemory.translated.net/doc/",
  },
];

/** Ce que le site range dans le navigateur. Aucun de ces éléments ne sert à la publicité ni à la mesure d'audience. */
export const STOCKAGE_NAVIGATEUR = [
  { nom: "sb-…-auth-token", type: "Cookie", finalite: "Garder la session ouverte quand vous êtes connecté.", duree: "Le temps de la session, renouvelé à chaque visite connectée ; supprimé à la déconnexion.", necessaire: "Oui, strictement nécessaire" },
  { nom: "datlas-theme", type: "Stockage local", finalite: "Retenir le thème clair ou sombre choisi.", duree: "Jusqu'à ce que vous l'effaciez", necessaire: "Préférence (fonctionnelle)" },
  { nom: "datlas-monnaie", type: "Stockage local", finalite: "Retenir la monnaie d'affichage des montants.", duree: "Jusqu'à ce que vous l'effaciez", necessaire: "Préférence (fonctionnelle)" },
  { nom: "datlas-carnet-v1", type: "Stockage local", finalite: "Garder sur l'appareil les traductions et passages de votre carnet, y compris sans compte.", duree: "Jusqu'à ce que vous les supprimiez", necessaire: "Service demandé" },
  { nom: "datlas-comparateur", type: "Stockage local", finalite: "Retenir les pays choisis dans le comparateur de votre espace personnel.", duree: "Jusqu'à ce que vous l'effaciez", necessaire: "Préférence (fonctionnelle)" },
  { nom: "datlas-tableau, datlas-globe-perso", type: "Stockage local", finalite: "Retenir la disposition de votre espace personnel et de votre globe.", duree: "Jusqu'à ce que vous l'effaciez", necessaire: "Préférence (fonctionnelle)" },
];
