"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════════════
   L'ENTRÉE DU COMPTE

   On ne lit que la présence d'une session, pas le profil : le nom ne vaut
   pas une requête sur chaque page du site. « Mon espace » suffit, et
   l'espace, lui, sait qui vous êtes.

   Elle s'affiche même quand les comptes ne sont pas branchés. Une entrée
   qui disparaît sans rien dire laisse chercher une porte qui n'existe
   plus ; la page de connexion, elle, explique ce qui manque.
   ═══════════════════════════════════════════════════════════════════════════ */

export function LienCompte({ className }: { className?: string }) {
  const [connecte, setConnecte] = useState(false);

  useEffect(() => {
    /* Sans cookie de session, personne n'est connecté : le client Supabase (plus de 200 Ko) n'est chargé que s'il y en a un. */
    if (!/(?:^|;\s*)sb-[^=]*-auth-token/.test(document.cookie)) return;
    let fin = () => {};
    let annule = false;
    void import("@/lib/supabase/navigateur").then(({ clientNavigateur }) => {
      const sb = clientNavigateur();
      if (!sb || annule) return;
      /* La session est lue dans le cookie, sans aller au serveur. */
      void sb.auth
        .getSession()
        .then((r: { data: { session: unknown } }) => setConnecte(Boolean(r.data.session)))
        .catch(() => {});
      const { data: ecoute } = sb.auth.onAuthStateChange((_e: string, session: unknown) =>
        setConnecte(Boolean(session))
      );
      fin = () => ecoute.subscription.unsubscribe();
    });
    return () => {
      annule = true;
      fin();
    };
  }, []);

  return (
    <Link href={connecte ? "/compte" : "/compte/connexion"} className={className}>
      {/* Deux libellés, un seul affiché : les barres étroites n'ont pas la
          place de « Se connecter ». */}
      <span className="lc-long">{connecte ? "Mon espace" : "Se connecter"}</span>
      <span className="lc-court">{connecte ? "Espace" : "Compte"}</span>
    </Link>
  );
}
