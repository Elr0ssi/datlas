import type { Metadata } from "next";
import Link from "next/link";
import { PageDoc } from "@/components/legal/PageDoc";
import { MAJ_LEGAL } from "@/data/legal";

export const metadata: Metadata = {
  title: { absolute: "Charte de modération et signalement | Datlas" },
  description: "Règles du forum Datlas, comment signaler un contenu illicite, délais de traitement, mesures possibles et voies de recours (règlement européen DSA).",
  alternates: { canonical: "/moderation" },
};

export default function Page() {
  return (
    <PageDoc
      chemin="/moderation"
      titre="Charte de modération et signalement"
      chapo="Le forum de Datlas sert à discuter des chiffres : les contester, les sourcer, les comprendre. Cette charte dit ce qui y est permis, comment signaler un contenu et comment contester une décision. Elle applique le règlement (UE) 2022/2065 sur les services numériques (DSA) et la LCEN."
      maj={MAJ_LEGAL}
      sections={[
        {
          id: "esprit",
          titre: "L'esprit du forum",
          blocs: [
            { liste: [
              "On discute des chiffres et des idées, jamais des personnes.",
              "Une affirmation chiffrée s'accompagne, autant que possible, de sa source.",
              "Le désaccord est bienvenu ; le mépris, l'insulte et le harcèlement ne le sont pas.",
            ] },
          ],
        },
        {
          id: "interdits",
          titre: "Contenus interdits",
          blocs: [
            { tableau: { entetes: ["Motif de signalement", "Exemples"], lignes: [
              ["Contenu illicite", "Apologie du terrorisme ou de crimes, pédopornographie, menaces, diffamation, atteinte à la vie privée, contrefaçon, vente de produits illicites"],
              ["Haine ou harcèlement", "Propos racistes, sexistes, homophobes, attaques répétées contre une personne"],
              ["Spam", "Publicité non sollicitée, liens commerciaux, messages répétés ou automatisés"],
              ["Fausse information", "Chiffre inventé ou source falsifiée présentés comme authentiques"],
              ["Autre", "Données personnelles d'un tiers, usurpation d'identité, liens malveillants"],
            ] } },
          ],
        },
        {
          id: "signaler",
          titre: "Comment signaler un contenu",
          blocs: [
            "Deux voies, ouvertes à tous :",
            { liste: [
              "Depuis le forum : le bouton « Signaler » de chaque message, en choisissant le motif (compte nécessaire).",
              <span key="f">Sans compte : le <Link href="/contact?objet=signalement">formulaire de signalement</Link>, en indiquant le lien du message, le motif, une explication précise et votre adresse e-mail.</span>,
            ] },
            "Un signalement de contenu illicite doit, pour être pleinement recevable, préciser l'emplacement exact du contenu, les raisons pour lesquelles il serait illicite, et une déclaration de bonne foi. Signaler sciemment un contenu licite comme illicite pour le faire retirer est puni par la loi (LCEN, art. 6).",
          ],
        },
        {
          id: "traitement",
          titre: "Traitement et délais",
          blocs: [
            { liste: [
              "Chaque signalement est examiné par un modérateur humain ; aucune décision de retrait n'est prise par un système automatique.",
              "Contenu manifestement illicite (terrorisme, pédopornographie, menaces) : retrait prioritaire, dans les 24 heures, et transmission aux autorités lorsque la loi l'impose (plateforme PHAROS).",
              "Autres signalements : examen sous 7 jours.",
              "L'auteur du signalement est informé de la décision lorsqu'il a laissé une adresse e-mail.",
            ] },
          ],
        },
        {
          id: "mesures",
          titre: "Mesures possibles",
          blocs: [
            { liste: [
              "Maintien du message, si le signalement n'est pas fondé.",
              "Retrait du message.",
              "Avertissement au titulaire du compte.",
              "Suspension temporaire, puis fermeture du compte en cas de récidive ou d'infraction grave.",
            ] },
            "La personne concernée par une mesure en reçoit l'exposé des motifs (règlement DSA, art. 17) : le contenu visé, la règle enfreinte, la mesure prise et les voies de recours.",
          ],
        },
        {
          id: "recours",
          titre: "Contester une décision",
          blocs: [
            { noeud: <p>Vous pouvez contester une décision de modération, qu&apos;elle vise votre message ou votre signalement, dans les six mois, par le <Link href="/contact?objet=signalement">formulaire de contact</Link>. La contestation est réexaminée par une autre personne que celle qui a pris la première décision, et la réponse est motivée. Vous conservez la possibilité de saisir le juge.</p> },
          ],
        },
        {
          id: "point-de-contact",
          titre: "Point de contact unique (autorités et utilisateurs)",
          blocs: [
            { noeud: <p>Conformément aux articles 11 et 12 du règlement DSA, le point de contact des autorités et des utilisateurs est le <Link href="/contact">formulaire de contact</Link>, en français ou en anglais.</p> },
          ],
        },
      ]}
    />
  );
}
