import type { Metadata } from "next";
import Link from "next/link";
import { PageDoc } from "@/components/legal/PageDoc";
import { MAJ_LEGAL } from "@/data/legal";

export const metadata: Metadata = {
  title: { absolute: "Conditions générales d'utilisation | Datlas" },
  description: "Les règles d'utilisation de Datlas : accès gratuit, compte, forum, carnet, traduction, données et sources, propriété intellectuelle, responsabilité.",
  alternates: { canonical: "/cgu" },
};

export default function Page() {
  return (
    <PageDoc
      chemin="/cgu"
      titre="Conditions générales d'utilisation"
      chapo="Ce que Datlas vous offre, ce que nous attendons de vous, et ce que chacun peut faire des contenus. Utiliser le site vaut acceptation de ces conditions."
      maj={MAJ_LEGAL}
      sections={[
        {
          id: "objet",
          titre: "Objet et acceptation",
          blocs: [
            "Les présentes conditions encadrent l'accès et l'utilisation de Datlas, site d'information et d'apprentissage qui présente des données publiques sur l'économie, la démographie, les conflits et les ressources du monde (globes interactifs, classements, comparateur, articles), ainsi qu'un forum, un carnet de révision et un outil de traduction.",
            "Elles s'appliquent à tout visiteur. La création d'un compte suppose leur acceptation expresse.",
          ],
        },
        {
          id: "acces",
          titre: "Accès au site",
          blocs: [
            "La consultation est libre et gratuite, sans publicité. Les frais de connexion à Internet restent à votre charge.",
            "L'éditeur s'efforce d'assurer l'accès au site en continu, sans obligation de résultat : le service peut être interrompu pour maintenance, mise à jour ou cas de force majeure, sans indemnité.",
          ],
        },
        {
          id: "compte",
          titre: "Compte utilisateur",
          blocs: [
            "Un compte, gratuit, permet de publier sur le forum, d'enregistrer des articles et de retrouver son carnet sur tous ses appareils. Il est réservé aux personnes de 15 ans et plus (ou plus jeunes avec l'accord d'un parent).",
            "Vous vous engagez à fournir une adresse e-mail valide, à garder votre mot de passe confidentiel et à ne pas créer de compte au nom d'un tiers. Vous êtes responsable de l'usage fait de votre compte.",
            { noeud: <p>Vous pouvez demander la clôture de votre compte à tout moment depuis le <Link href="/contact?objet=rgpd">formulaire de contact</Link>. L&apos;éditeur peut suspendre ou fermer un compte qui enfreint ces conditions, après avertissement sauf en cas d&apos;infraction grave (voir la <Link href="/moderation">charte de modération</Link>).</p> },
          ],
        },
        {
          id: "forum",
          titre: "Forum et contenus publiés",
          blocs: [
            "Vous restez l'auteur de vos messages et en êtes responsable. En publiant, vous accordez à l'éditeur une licence gratuite et non exclusive pour les afficher sur le site, pour la durée de leur publication.",
            "Sont interdits : les contenus illicites (incitation à la haine ou à la violence, apologie du terrorisme, contenus pédopornographiques, harcèlement, diffamation, atteinte à la vie privée), la publication de données personnelles d'autrui, la contrefaçon, le spam et la publicité non sollicitée, l'usurpation d'identité, les liens malveillants.",
            { noeud: <p>Les règles de modération, la manière de signaler un contenu et les voies de recours sont détaillées dans la <Link href="/moderation">charte de modération</Link>.</p> },
          ],
        },
        {
          id: "carnet-traduction",
          titre: "Carnet de révision et traduction",
          blocs: [
            "Le carnet garde les traductions et passages que vous choisissez de conserver, sur votre appareil et, si vous êtes connecté, dans votre compte. Il est privé : personne d'autre ne peut le consulter.",
            "La traduction automatique est fournie à titre d'aide à l'apprentissage, par un service tiers (MyMemory). Elle peut contenir des erreurs et ne doit pas servir de traduction officielle. Elle est limitée à 500 caractères par demande et peut être momentanément indisponible.",
          ],
        },
        {
          id: "donnees-sources",
          titre: "Données, sources et limites",
          blocs: [
            { noeud: <p>Les chiffres proviennent d&apos;institutions citées sous chaque graphique et récapitulées sur la page <Link href="/sources">Sources</Link> ; la manière dont ils sont traités est décrite dans la <Link href="/methodologie">méthodologie</Link>. Ils sont présentés avec leur année et leur périmètre, mais peuvent être révisés par leurs producteurs.</p> },
            "Les contenus de Datlas ont une vocation d'information et d'apprentissage. Ils ne constituent ni un conseil financier, ni un conseil en investissement, ni un avis juridique ou médical.",
          ],
        },
        {
          id: "propriete",
          titre: "Propriété intellectuelle et réutilisation",
          blocs: [
            "Les textes, visualisations, la mise en forme et la marque Datlas sont protégés. Vous pouvez citer un chiffre, un graphique ou un court extrait en mentionnant « Datlas » et en renvoyant vers la page d'origine.",
            "L'extraction systématique du contenu (aspiration massive, reproduction de la base) est interdite sans accord écrit, sous réserve des droits des producteurs de données sur leurs propres jeux.",
          ],
        },
        {
          id: "usages-interdits",
          titre: "Usages interdits",
          blocs: [
            { liste: [
              "Tenter d'accéder sans autorisation aux comptes d'autrui ou aux systèmes du site.",
              "Perturber le service (envois automatisés, surcharge volontaire, contournement des limites).",
              "Utiliser le site pour diffuser des contenus illicites ou trompeurs.",
            ] },
          ],
        },
        {
          id: "responsabilite",
          titre: "Responsabilité",
          blocs: [
            "L'éditeur met tout en œuvre pour que les informations soient exactes et à jour, sans pouvoir garantir l'absence d'erreur. Sa responsabilité ne saurait être engagée pour une décision prise sur la seule base des contenus du site, pour une interruption du service, ni pour le contenu des sites extérieurs vers lesquels il renvoie.",
            { noeud: <p>Une erreur ? Signalez-la par le <Link href="/contact?objet=erreur">formulaire de contact</Link> : chaque signalement est vérifié et, s&apos;il est fondé, corrigé sur la page.</p> },
          ],
        },
        {
          id: "modification",
          titre: "Modification des conditions",
          blocs: ["Ces conditions peuvent être modifiées pour suivre l'évolution du site ou de la loi. La version en vigueur est celle publiée sur cette page, avec sa date de mise à jour."],
        },
        {
          id: "droit-applicable",
          titre: "Droit applicable et litiges",
          blocs: [
            "Les présentes conditions sont soumises au droit français. En cas de différend, une solution amiable est recherchée en priorité, par le formulaire de contact.",
            "Le service étant gratuit et fourni hors de toute relation commerciale, les règles de médiation de la consommation ne s'appliquent pas. À défaut d'accord amiable, les tribunaux français compétents peuvent être saisis.",
          ],
        },
      ]}
    />
  );
}
