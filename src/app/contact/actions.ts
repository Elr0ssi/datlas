"use server";

import { clientServeur } from "@/lib/supabase/serveur";
import { SUJETS, type EtatEnvoi, type Sujet } from "@/data/contact";

/* L'envoi d'un message depuis /contact. Le message est rangé dans la base (table « contacts »), lisible seulement
   par l'éditeur depuis le tableau de bord : aucune adresse personnelle n'est exposée sur le site. */

const propre = (v: FormDataEntryValue | null, max: number) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s.slice(0, max) : null;
};

export async function envoyerContact(_: EtatEnvoi | null, f: FormData): Promise<EtatEnvoi> {
  /* Le piège à robots : un champ invisible qu'un humain laisse vide, et un délai minimal avant l'envoi. */
  if (propre(f.get("site_web"), 200)) return { ok: true, message: "Merci, votre message est bien parti." };
  const ouvert = Number(f.get("ouvert_le") ?? 0);
  if (ouvert && Date.now() - ouvert < 2500) return { ok: false, message: "Envoi trop rapide : relisez votre message, puis renvoyez-le." };

  const sujet = propre(f.get("sujet"), 20) as Sujet | null;
  if (!sujet || !(sujet in SUJETS)) return { ok: false, message: "Choisissez l'objet de votre message." };
  const message = propre(f.get("message"), 5000);
  if (!message || message.length < 10) return { ok: false, message: "Votre message est trop court (10 caractères au moins)." };
  const email = propre(f.get("email"), 200);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, message: "Cette adresse e-mail ne semble pas valide." };
  if ((sujet === "rgpd" || sujet === "signalement") && !email)
    return { ok: false, message: "Pour cette demande, laissez une adresse e-mail : c'est là que nous vous répondrons." };
  if (f.get("accord") !== "on") return { ok: false, message: "Cochez la case d'information sur vos données pour envoyer le message." };

  const sb = await clientServeur();
  if (!sb) return { ok: false, message: "L'envoi est momentanément indisponible. Réessayez un peu plus tard." };
  const { data: compte } = await sb.auth.getUser();
  const { error } = await sb.from("contacts").insert({
    sujet,
    message,
    email,
    nom: propre(f.get("nom"), 120),
    page: propre(f.get("page"), 500),
    profil_id: compte.user?.id ?? null,
  });
  if (error) return { ok: false, message: "L'envoi n'a pas abouti. Réessayez dans un instant." };
  return { ok: true, message: "Merci, votre message est bien parti. Nous répondons à l'adresse indiquée, en général sous quelques jours ouvrés." };
}
