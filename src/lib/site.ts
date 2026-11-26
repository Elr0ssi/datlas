/* ═══════════════════════════════════════════════════════════════════════════
   L'ADRESSE PUBLIQUE DU SITE

   Toutes les adresses canoniques, le plan du site, les cartes de partage et
   llms.txt la reprennent. Dans l'ordre :
   1. NEXT_PUBLIC_SITE_URL, si elle est renseignée (le domaine choisi) ;
   2. sinon le domaine de production que Vercel fournit lui-même à la
      construction : le domaine personnalisé dès qu'il est branché au projet,
      l'adresse en .vercel.app avant cela ;
   3. sinon, en local, http://localhost:3000.
   Aucune adresse n'est donc jamais inventée ni empruntée à un autre site.
   ═══════════════════════════════════════════════════════════════════════════ */

const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : "http://localhost:3000")).replace(/\/$/, "");
export const NOM_SITE = "Datlas";
export const urlAbs = (chemin: string) => `${SITE_URL}${chemin.startsWith("/") ? chemin : `/${chemin}`}`;
