import type { Metadata } from "next";
import Link from "next/link";
import { PageDoc } from "@/components/legal/PageDoc";
import { EDITEUR, MAJ_LEGAL, SOUS_TRAITANTS } from "@/data/legal";

export const metadata: Metadata = {
  title: { absolute: "Politique de confidentialité (RGPD) | Datlas" },
  description: "Données collectées par Datlas, finalités, bases légales, durées, destinataires, transferts et vos droits RGPD : une politique complète et lisible.",
  alternates: { canonical: "/confidentialite" },
};

export default function Page() {
  return (
    <PageDoc
      chemin="/confidentialite"
      titre="Politique de confidentialité"
      chapo="Lire Datlas ne demande aucune donnée personnelle. Cette page décrit, traitement par traitement, ce qui est collecté quand vous créez un compte, publiez, enregistrez ou nous écrivez, et comment exercer vos droits. Elle applique le règlement (UE) 2016/679 (RGPD) et la loi Informatique et Libertés."
      maj={MAJ_LEGAL}
      sections={[
        {
          id: "en-bref",
          titre: "L'essentiel en cinq points",
          blocs: [
            { liste: [
              "Aucune publicité, aucun outil de mesure d'audience, aucun traceur tiers, aucune revente de données.",
              "Sans compte, rien n'est enregistré sur vous : vos préférences restent dans votre navigateur.",
              "Avec un compte : votre e-mail, votre pseudo et ce que vous publiez ou enregistrez, rien de plus.",
              "Les données de compte sont hébergées dans l'Union européenne (Francfort).",
              "Vous pouvez à tout moment obtenir, corriger ou faire supprimer vos données.",
            ] },
          ],
        },
        {
          id: "responsable",
          titre: "Responsable du traitement",
          blocs: [
            `Le responsable du traitement est l'éditeur de Datlas, ${EDITEUR.forme}${EDITEUR.denomination ? ` (${EDITEUR.denomination})` : ""}, représentée par son représentant légal.`,
            { noeud: <p>Pour toute question sur vos données : <Link href="/contact?objet=rgpd">formulaire de contact, objet « Exercer mes droits »</Link>. Datlas n&apos;est pas tenu de désigner un délégué à la protection des données (DPO) : la personne chargée des demandes est le responsable du traitement lui-même.</p> },
          ],
        },
        {
          id: "traitements",
          titre: "Données traitées, finalités et bases légales",
          blocs: [
            { tableau: { entetes: ["Situation", "Données", "Finalité", "Base légale (art. 6 RGPD)"], lignes: [
              ["Consultation du site", "Adresse IP, navigateur, page demandée, date (journaux techniques de l'hébergeur)", "Servir les pages, assurer la sécurité, prévenir les abus", "Intérêt légitime : faire fonctionner et protéger le site"],
              ["Création de compte et connexion", "Adresse e-mail, mot de passe (stocké sous forme chiffrée, jamais lisible), ou identifiant Google si vous choisissez cette option ; pseudo généré ou choisi", "Créer et sécuriser votre compte", "Exécution du service demandé (contrat)"],
              ["Profil", "Pseudo, courte présentation facultative", "Afficher votre nom sur le forum", "Exécution du service demandé"],
              ["Forum", "Messages, réponses, liens de source, votes, signalements", "Faire vivre les discussions, modérer", "Exécution du service demandé ; intérêt légitime pour la modération"],
              ["Favoris et carnet", "Articles enregistrés, traductions et passages gardés, niveau de révision", "Vous permettre de retrouver et réviser vos contenus sur tous vos appareils", "Exécution du service demandé"],
              ["Traduction d'un passage", "Le texte sélectionné, sans lien avec votre identité", "Vous donner la traduction anglaise", "Exécution du service demandé"],
              ["Formulaire de contact", "Objet, message, e-mail et nom si vous les donnez, page d'origine", "Répondre à votre demande, traiter un signalement ou une demande RGPD", "Intérêt légitime ; obligation légale pour les signalements et demandes RGPD"],
            ] } },
            "Aucune décision automatisée ni aucun profilage n'est réalisé à partir de ces données.",
          ],
        },
        {
          id: "durees",
          titre: "Durées de conservation",
          blocs: [
            { tableau: { entetes: ["Données", "Durée"], lignes: [
              ["Compte, profil, favoris, carnet", "Tant que le compte existe ; suppression dans un délai d'un mois après votre demande de clôture"],
              ["Compte inactif", "Suppression après trois ans sans connexion, précédée d'un message d'avertissement si une adresse e-mail est connue"],
              ["Messages du forum", "Tant que le compte existe ; à sa suppression, les messages sont effacés ou anonymisés (« membre supprimé ») pour ne pas casser les discussions"],
              ["Signalements", "Un an après leur traitement"],
              ["Messages de contact", "Le temps de traiter la demande, puis un an au plus après sa clôture"],
              ["Demandes d'exercice de droits", "Cinq ans, pour pouvoir justifier de leur traitement"],
              ["Journaux techniques de l'hébergeur", "Selon la politique de l'hébergeur, quelques jours à quelques semaines"],
            ] } },
          ],
        },
        {
          id: "destinataires",
          titre: "Destinataires et sous-traitants",
          blocs: [
            "Vos données ne sont accessibles qu'à l'éditeur et, pour la modération, aux modérateurs du forum. Elles ne sont ni vendues, ni louées, ni cédées. Les prestataires suivants les traitent pour notre compte, sur nos instructions :",
            { tableau: { entetes: ["Prestataire", "Rôle", "Données concernées", "Localisation et garanties"], lignes: SOUS_TRAITANTS.map((s) => [
              <a key={s.nom} href={s.lien} rel="noopener">{s.nom}</a>, s.role, s.donnees, `${s.lieu}. ${s.garanties}`,
            ]) } },
            "Les messages publiés sur le forum sont publics : ils sont lisibles par tous les visiteurs, avec votre pseudo.",
          ],
        },
        {
          id: "transferts",
          titre: "Transferts hors de l'Union européenne",
          blocs: [
            "Les données de compte sont stockées dans l'Union européenne. Certains prestataires (hébergement du site, connexion avec Google) sont établis aux États-Unis : les transferts éventuels sont encadrés par le Data Privacy Framework UE–États-Unis (décision d'adéquation du 10 juillet 2023) et par les clauses contractuelles types de la Commission européenne.",
          ],
        },
        {
          id: "navigateur",
          titre: "Cookies et stockage dans votre navigateur",
          blocs: [
            { noeud: <p>Datlas ne dépose qu&apos;un cookie, celui de la session quand vous êtes connecté, et range quelques préférences dans le stockage local de votre navigateur. Aucun n&apos;exige de consentement, car aucun ne sert à vous suivre. Le détail, élément par élément, est sur la page <Link href="/cookies">Cookies et stockage local</Link>.</p> },
          ],
        },
        {
          id: "droits",
          titre: "Vos droits",
          blocs: [
            "Vous disposez des droits suivants sur vos données :",
            { liste: [
              "Accès : obtenir une copie de vos données (art. 15).",
              "Rectification : corriger une donnée inexacte ; votre pseudo et votre présentation se modifient aussi directement dans votre espace (art. 16).",
              "Effacement : faire supprimer votre compte et vos données (art. 17).",
              "Limitation : geler un traitement le temps d'une vérification (art. 18).",
              "Portabilité : recevoir vos contenus (messages, favoris, carnet) dans un format lisible par machine (art. 20).",
              "Opposition : vous opposer à un traitement fondé sur l'intérêt légitime (art. 21).",
              "Directives post-mortem : indiquer ce que deviennent vos données après votre décès (loi Informatique et Libertés, art. 85).",
            ] },
            { noeud: <p>Pour exercer un droit : <Link href="/contact?objet=rgpd">formulaire de contact, objet « Exercer mes droits sur mes données »</Link>, en indiquant l&apos;adresse e-mail de votre compte. Nous répondons dans un délai d&apos;un mois, prolongeable de deux mois pour une demande complexe ; nous pouvons demander une confirmation depuis l&apos;adresse du compte pour vérifier qu&apos;il s&apos;agit bien de vous.</p> },
            { noeud: <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr/fr/plaintes" rel="noopener">www.cnil.fr/fr/plaintes</a>, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.</p> },
          ],
        },
        {
          id: "contact",
          titre: "Messages envoyés par le formulaire de contact",
          blocs: [
            "Le formulaire enregistre l'objet, votre message, la page d'où vous venez et, seulement si vous les donnez, votre nom et votre adresse e-mail. Ces informations servent exclusivement à traiter votre demande. Elles ne sont jamais utilisées pour vous envoyer de la publicité ni ajoutées à une liste de diffusion.",
          ],
        },
        {
          id: "securite",
          titre: "Sécurité",
          blocs: [
            { liste: [
              "Connexion chiffrée (HTTPS) sur tout le site.",
              "Mots de passe jamais stockés en clair (hachage par le service d'authentification).",
              "Cloisonnement des données dans la base : chaque compte ne peut lire et modifier que ses propres favoris et son propre carnet ; les messages de contact ne sont lisibles par aucun visiteur.",
              "Limites de débit contre les envois en rafale sur le forum et le formulaire de contact.",
            ] },
            "En cas de violation de données présentant un risque pour vos droits, la CNIL est notifiée dans les 72 heures et vous êtes informé si le risque est élevé.",
          ],
        },
        {
          id: "mineurs",
          titre: "Mineurs",
          blocs: ["La lecture du site est ouverte à tous. La création d'un compte est réservée aux personnes de 15 ans et plus ; en dessous, l'accord d'un titulaire de l'autorité parentale est nécessaire (loi Informatique et Libertés, art. 45)."],
        },
        {
          id: "modifications",
          titre: "Modifications de cette politique",
          blocs: ["Cette politique peut évoluer avec le site. La date de dernière mise à jour figure en haut de la page ; en cas de changement important, les titulaires d'un compte en sont informés."],
        },
      ]}
    />
  );
}
