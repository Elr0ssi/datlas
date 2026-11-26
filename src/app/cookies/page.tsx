import type { Metadata } from "next";
import Link from "next/link";
import { PageDoc } from "@/components/legal/PageDoc";
import { MAJ_LEGAL, STOCKAGE_NAVIGATEUR } from "@/data/legal";

export const metadata: Metadata = {
  title: { absolute: "Cookies et stockage local | Datlas" },
  description: "Un seul cookie (la session de connexion), aucun traceur publicitaire ni de mesure d'audience : la liste complète de ce que Datlas range dans votre navigateur.",
  alternates: { canonical: "/cookies" },
};

export default function Page() {
  return (
    <PageDoc
      chemin="/cookies"
      titre="Cookies et stockage local"
      chapo="Datlas ne vous suit pas. Pas de publicité, pas de mesure d'audience, pas de bouton de réseau social qui vous piste : c'est pourquoi le site ne vous présente aucun bandeau de consentement."
      maj={MAJ_LEGAL}
      sections={[
        {
          id: "principe",
          titre: "Pourquoi aucun bandeau de consentement",
          blocs: [
            "L'article 82 de la loi Informatique et Libertés et les lignes directrices de la CNIL n'exigent un consentement que pour les traceurs qui ne sont pas strictement nécessaires au service demandé : publicité, mesure d'audience non exemptée, partage sur les réseaux sociaux. Datlas n'en utilise aucun.",
            "Les éléments ci-dessous servent uniquement à faire fonctionner ce que vous demandez (rester connecté, garder votre carnet) ou à retenir vos propres réglages d'affichage. Ils ne sont lus par aucun tiers.",
          ],
        },
        {
          id: "liste",
          titre: "La liste complète",
          blocs: [
            { tableau: { entetes: ["Nom", "Type", "À quoi il sert", "Durée", "Nature"], lignes: STOCKAGE_NAVIGATEUR.map((s) => [s.nom, s.type, s.finalite, s.duree, s.necessaire]) } },
            "Le stockage local reste sur votre appareil : il n'est pas envoyé à nos serveurs à chaque page, contrairement à un cookie. Seul le carnet est copié dans votre compte, et seulement si vous êtes connecté.",
          ],
        },
        {
          id: "tiers",
          titre: "Aucun contenu tiers qui dépose des traceurs",
          blocs: [
            "Les polices de caractères sont servies par Datlas lui-même, les drapeaux sont dessinés par votre appareil et les fonds de carte sont des fichiers du site : en lisant une page, votre navigateur ne contacte aucun service de publicité, de statistiques ou de réseau social.",
          ],
        },
        {
          id: "gerer",
          titre: "Gérer ou supprimer ces éléments",
          blocs: [
            { liste: [
              "Se déconnecter supprime le cookie de session.",
              "Les réglages de votre navigateur permettent d'effacer les cookies et les « données de site » de Datlas (Chrome : Paramètres › Confidentialité et sécurité › Cookies ; Safari : Réglages › Safari › Avancé › Données de sites web ; Firefox : Paramètres › Vie privée et sécurité).",
              "Effacer les données du site supprime aussi le carnet gardé sans compte : pensez à vous connecter avant, pour le retrouver dans votre espace.",
            ] },
            { noeud: <p>Pour le traitement de vos données de compte, voir la <Link href="/confidentialite">politique de confidentialité</Link>.</p> },
          ],
        },
      ]}
    />
  );
}
