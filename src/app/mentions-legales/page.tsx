import type { Metadata } from "next";
import Link from "next/link";
import { PageDoc } from "@/components/legal/PageDoc";
import { EDITEUR, HEBERGEUR, MAJ_LEGAL, SOUS_TRAITANTS } from "@/data/legal";

export const metadata: Metadata = {
  title: { absolute: "Mentions légales | Datlas" },
  description: "Éditeur, directeur de la publication, hébergeur, propriété intellectuelle, liens et contact de Datlas : toutes les informations légales du site.",
  alternates: { canonical: "/mentions-legales" },
};

export default function Page() {
  const identite = [
    `Datlas est édité par ${EDITEUR.forme}${EDITEUR.denomination ? `, ${EDITEUR.denomination}` : ""}.`,
    ...(EDITEUR.siege ? [`Siège : ${EDITEUR.siege}.`] : []),
    ...(EDITEUR.immatriculation ? [`Immatriculation : ${EDITEUR.immatriculation}.`] : []),
  ].join(" ");
  return (
    <PageDoc
      chemin="/mentions-legales"
      titre="Mentions légales"
      chapo="Qui édite Datlas, qui l'héberge, et comment nous joindre. Ces informations sont fournies en application de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN)."
      maj={MAJ_LEGAL}
      sections={[
        {
          id: "editeur",
          titre: "Éditeur du site",
          blocs: [
            identite,
            "Les éléments d'identification de l'éditeur sont détenus par l'hébergeur du site, auquel ils ont été communiqués lors de l'ouverture du service d'hébergement.",
            { noeud: <p>Pour toute demande, y compris d&apos;ordre juridique : <Link href="/contact">formulaire de contact</Link>. Chaque message est lu et reçoit une réponse lorsqu&apos;une adresse e-mail est indiquée.</p> },
          ],
        },
        {
          id: "directeur-publication",
          titre: "Directeur de la publication",
          blocs: [`Le directeur de la publication est ${EDITEUR.directeur}. Il est joignable par le formulaire de contact.`],
        },
        {
          id: "hebergeur",
          titre: "Hébergeur",
          blocs: [
            { tableau: { entetes: ["Rôle", "Prestataire", "Coordonnées"], lignes: [
              ["Hébergement du site", HEBERGEUR.nom, <>{HEBERGEUR.adresse} · <a href={HEBERGEUR.site} rel="noopener">{HEBERGEUR.site.replace("https://", "")}</a></>],
              ["Base de données et comptes", "Supabase Inc.", <>Données hébergées dans l&apos;Union européenne (Francfort, Allemagne) · <a href="https://supabase.com" rel="noopener">supabase.com</a></>],
            ] } },
            { noeud: <p>La liste complète des prestataires qui traitent des données pour notre compte figure dans la <Link href="/confidentialite#destinataires">politique de confidentialité</Link> ({SOUS_TRAITANTS.length} prestataires).</p> },
          ],
        },
        {
          id: "objet",
          titre: "Objet du site",
          blocs: [
            "Datlas est un site d'information et d'apprentissage gratuit : il rassemble des données publiques sur l'économie, la démographie, les conflits et les ressources du monde, les présente sur des globes interactifs, des classements et des articles, et propose un forum de discussion et un carnet de révision.",
            "Datlas n'affiche aucune publicité et ne vend aucune donnée.",
          ],
        },
        {
          id: "propriete-intellectuelle",
          titre: "Propriété intellectuelle",
          blocs: [
            "La structure du site, ses textes, ses visualisations, sa charte graphique et son logo sont protégés par le droit d'auteur et appartiennent à l'éditeur, sauf mention contraire.",
            "Vous pouvez citer un chiffre, un graphique ou un court extrait, à condition de mentionner « Datlas » et de renvoyer par un lien vers la page d'origine. Toute reproduction intégrale ou commerciale nécessite un accord préalable, à demander par le formulaire de contact (objet « Presse, partenariat, réutilisation »).",
            "Les données statistiques restent la propriété de leurs producteurs (Banque mondiale, FMI, Nations Unies, FAO, INSEE, Eurostat…) et sont soumises à leurs propres licences, rappelées sur la page Sources.",
            "Les fonds de carte proviennent de Natural Earth (domaine public).",
          ],
        },
        {
          id: "liens",
          titre: "Liens hypertextes",
          blocs: [
            "Le site renvoie vers des sources extérieures (institutions statistiques, publications officielles, presse). L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
            "Les liens vers Datlas sont libres, sans autorisation préalable, à condition de ne pas présenter le site dans un cadre trompeur ou dénigrant.",
          ],
        },
        {
          id: "donnees-personnelles",
          titre: "Données personnelles et cookies",
          blocs: [
            { noeud: <p>Le traitement de vos données est décrit dans la <Link href="/confidentialite">politique de confidentialité</Link>, et les traceurs déposés dans votre navigateur dans la <Link href="/cookies">politique de cookies</Link>. Datlas ne dépose aucun cookie publicitaire ni de mesure d&apos;audience.</p> },
          ],
        },
        {
          id: "contenus-utilisateurs",
          titre: "Contenus publiés par les utilisateurs",
          blocs: [
            { noeud: <p>Les messages du forum sont publiés sous la responsabilité de leurs auteurs. Tout contenu manifestement illicite peut être signalé depuis le message lui-même ou par le <Link href="/contact?objet=signalement">formulaire de signalement</Link> ; la procédure est décrite dans la <Link href="/moderation">charte de modération</Link>.</p> },
          ],
        },
        {
          id: "droit-applicable",
          titre: "Droit applicable",
          blocs: [
            { noeud: <p>Le site et les présentes mentions sont soumis au droit français. Les conditions d&apos;utilisation complètes figurent dans les <Link href="/cgu">conditions générales d&apos;utilisation</Link>.</p> },
          ],
        },
      ]}
    />
  );
}
