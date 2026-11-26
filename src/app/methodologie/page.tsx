import type { Metadata } from "next";
import Link from "next/link";
import { PageDoc } from "@/components/legal/PageDoc";
import { ETAPES } from "@/data/concept/conceptData";
import { MAJ_LEGAL } from "@/data/legal";

export const metadata: Metadata = {
  title: { absolute: "Méthodologie : sources, recoupement et usage de l'IA | Datlas" },
  description: "Comment Datlas choisit ses sources, recoupe et date chaque chiffre, traite les données manquantes, utilise l'IA sous relecture humaine et corrige ses erreurs.",
  alternates: { canonical: "/methodologie" },
};

export default function Page() {
  return (
    <PageDoc
      chemin="/methodologie"
      titre="Méthodologie"
      chapo="Un chiffre n'a de valeur que si l'on sait d'où il vient, à quelle date il se rapporte et ce qu'il mesure. Voici comment Datlas passe d'une publication officielle à une page que l'on peut citer."
      maj={MAJ_LEGAL}
      sections={[
        {
          id: "etapes",
          titre: "Les cinq étapes d'une publication",
          blocs: [{ tableau: { entetes: ["Étape", "Ce qui est fait"], lignes: ETAPES.map((e) => [`${e.n}. ${e.titre}`, e.ligne]) } }],
        },
        {
          id: "sources",
          titre: "Le choix des sources",
          blocs: [
            "Priorité aux producteurs officiels de statistiques : organisations internationales (Banque mondiale, FMI, Nations Unies, FAO), offices statistiques (INSEE, Eurostat) et administrations (Banque de France, Agence France Trésor). Pour les conflits, des inventaires de référence (UCDP, ACLED) et des documents de terrain, chaque fiche citant sa propre source.",
            { noeud: <p>La liste des sources, rubrique par rubrique, est tenue sur la page <Link href="/sources">Sources</Link>.</p> },
          ],
        },
        {
          id: "dates",
          titre: "Chaque chiffre garde sa date",
          blocs: [
            "Une valeur est toujours affichée avec l'année à laquelle elle se rapporte, qui n'est pas forcément l'année en cours : les instituts publient avec un an ou deux de décalage. Quand une page compare des pays, elle compare la même année, ou elle le dit.",
          ],
        },
        {
          id: "donnees-manquantes",
          titre: "Les données manquantes restent manquantes",
          blocs: [
            "Une année qu'une source ne publie pas pour un pays n'est ni estimée, ni extrapolée, ni remplacée par zéro : le pays sort du classement de cette année-là, et le tableau affiche « n.d. ». Les valeurs estimées ou imputées par la source elle-même (FAOSTAT par exemple) sont signalées comme telles.",
          ],
        },
        {
          id: "temps-reel",
          titre: "Les compteurs « en temps réel »",
          blocs: [
            "Aucune statistique mondiale n'est mesurée à la seconde. Les compteurs (PIB mondial, population, dépenses militaires, ressources) étalent sur l'année en cours la dernière valeur annuelle publiée, à un rythme constant depuis le 1er janvier. Ce sont des ordres de grandeur pédagogiques, et chaque compteur indique la valeur annuelle et la source dont il part.",
          ],
        },
        {
          id: "ia",
          titre: "Le rôle de l'intelligence artificielle",
          blocs: [
            "L'IA aide à structurer et à rédiger les textes, et à lire rapidement de gros volumes de documents. Elle ne choisit pas les sujets, ne produit aucun chiffre et n'en valide aucun : les valeurs affichées sont lues dans les fichiers des producteurs de données, et une personne relit chaque texte avant sa mise en ligne.",
            "Cette information est donnée dans un souci de transparence, conformément à l'esprit du règlement européen sur l'intelligence artificielle (règlement (UE) 2024/1689).",
          ],
        },
        {
          id: "base",
          titre: "La base de données",
          blocs: [
            { noeud: <p>La structure de la base, ses unités, ses contrôles automatiques et la couverture de chaque indicateur sont décrits sur la page <Link href="/methodologie-donnees">Méthodologie de la base de données</Link>.</p> },
          ],
        },
        {
          id: "independance",
          titre: "Indépendance",
          blocs: ["Datlas n'affiche aucune publicité, ne publie aucun contenu sponsorisé et ne reçoit aucun financement d'un acteur cité dans ses pages. Le choix des sujets et leur traitement relèvent de la seule rédaction."],
        },
        {
          id: "corrections",
          titre: "Corrections",
          blocs: [
            { noeud: <p>Une erreur ? Signalez-la par le <Link href="/contact?objet=erreur">formulaire de contact</Link> avec la page et, si possible, la source qui contredit le chiffre. Chaque signalement est vérifié sous sept jours ; s&apos;il est fondé, la page est corrigée et sa date de mise à jour change.</p> },
          ],
        },
      ]}
    />
  );
}
