/* À chaque changement de page, le contenu entre en fondu : la navigation se sent, sans délai ni saut.
   Un simple fondu d'opacité : une transformation ferait perdre leur place aux éléments fixes (en-tête, barre d'onglets). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="nv-entree">{children}</div>;
}
