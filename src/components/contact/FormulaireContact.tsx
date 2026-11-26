"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { envoyerContact } from "@/app/contact/actions";
import { SUJETS, type EtatEnvoi } from "@/data/contact";

/* Le formulaire de contact. L'objet peut être choisi d'avance par l'adresse : /contact?objet=rgpd. */
export function FormulaireContact({ objet }: { objet?: string }) {
  const [etat, envoyer, enCours] = useActionState<EtatEnvoi | null, FormData>(envoyerContact, null);
  const [ouvert, setOuvert] = useState(0);
  const [page, setPage] = useState("");
  useEffect(() => {
    setOuvert(Date.now());
    try {
      const r = document.referrer ? new URL(document.referrer) : null;
      if (r && r.origin === window.location.origin) setPage(r.pathname);
    } catch {}
  }, []);
  const initial = objet && objet in SUJETS ? objet : "question";

  if (etat?.ok)
    return (
      <div className="ct-form" role="status">
        <p className="ct-msg ct-ok">{etat.message}</p>
        <Link href="/">Revenir à l&apos;accueil</Link>
      </div>
    );

  return (
    <form action={envoyer} className="ct-form" aria-label="Écrire à Datlas">
      <label>
        Objet
        <select name="sujet" defaultValue={initial} required>
          {Object.entries(SUJETS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <div className="ct-ligne">
        <label>
          Nom ou pseudo (facultatif)
          <input name="nom" autoComplete="name" maxLength={120} />
        </label>
        <label>
          E-mail pour la réponse
          <input name="email" type="email" autoComplete="email" maxLength={200} inputMode="email" />
        </label>
      </div>
      <label>
        Votre message
        <textarea name="message" required minLength={10} maxLength={5000} placeholder="Pour une erreur de chiffre : la page, le chiffre en cause et, si possible, la source qui le contredit." />
      </label>
      <label className="ct-piege" aria-hidden="true">
        Ne pas remplir
        <input name="site_web" tabIndex={-1} autoComplete="off" />
      </label>
      <input type="hidden" name="ouvert_le" value={ouvert} />
      <input type="hidden" name="page" value={page} />
      <label className="ct-case">
        <input type="checkbox" name="accord" required />
        <span>
          J&apos;ai compris que mon message et, si je la donne, mon adresse e-mail sont conservés pour traiter ma demande, puis supprimés au plus
          tard un an après sa clôture (<Link href="/confidentialite#contact">détails</Link>).
        </span>
      </label>
      {etat && !etat.ok && (
        <p className="ct-msg ct-ko" role="alert">
          {etat.message}
        </p>
      )}
      <button type="submit" className="ct-envoi" disabled={enCours}>
        {enCours ? "Envoi…" : "Envoyer le message"}
      </button>
      <p className="ct-aide">L&apos;adresse e-mail est nécessaire pour une demande RGPD ou un signalement : c&apos;est là que nous répondons.</p>
    </form>
  );
}
