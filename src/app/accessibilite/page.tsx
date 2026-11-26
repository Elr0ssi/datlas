import type { Metadata } from "next";
import Link from "next/link";
import { PageDoc } from "@/components/legal/PageDoc";
import { MAJ_LEGAL } from "@/data/legal";

export const metadata: Metadata = {
  title: { absolute: "Accessibilité | Datlas" },
  description: "État de l'accessibilité de Datlas : mesures prises (clavier, contrastes, textes alternatifs, tableaux de données), limites connues et comment nous signaler un obstacle.",
  alternates: { canonical: "/accessibilite" },
};

export default function Page() {
  return (
    <PageDoc
      chemin="/accessibilite"
      titre="Accessibilité"
      chapo="Datlas veut que ses données soient lisibles par tous, y compris au clavier, avec un lecteur d'écran ou sur un petit écran. Voici où nous en sommes, sans enjoliver."
      maj={MAJ_LEGAL}
      sections={[
        {
          id: "etat",
          titre: "État de conformité",
          blocs: [
            "Le site n'a pas encore fait l'objet d'un audit complet selon le référentiel général d'amélioration de l'accessibilité (RGAA 4.1) : son niveau de conformité n'est donc pas déclaré. Les mesures ci-dessous sont appliquées à chaque nouvelle page.",
          ],
        },
        {
          id: "mesures",
          titre: "Mesures en place",
          blocs: [
            { liste: [
              "Chaque globe et chaque graphique a son équivalent en tableau de données lisible, classable et consultable au clavier.",
              "Navigation entièrement possible au clavier, focus visible, menus qui s'ouvrent aussi à la prise de focus.",
              "Thème clair et thème sombre, contrastes de texte vérifiés.",
              "Animations réduites lorsque le système demande de limiter les mouvements.",
              "Structure de titres cohérente (un seul titre principal par page), fil d'Ariane, sommaire sur les pages longues.",
              "Textes alternatifs sur les éléments graphiques porteurs d'information ; éléments décoratifs masqués aux lecteurs d'écran.",
              "Mise en page adaptée aux téléphones, sans défilement horizontal.",
            ] },
          ],
        },
        {
          id: "limites",
          titre: "Limites connues",
          blocs: [
            { liste: [
              "La manipulation directe des globes 3D (rotation, zoom) suppose un pointeur ou un écran tactile ; l'information équivalente est disponible dans les tableaux.",
              "Certains compteurs animés en temps réel peuvent être annoncés de manière répétitive par un lecteur d'écran.",
            ] },
          ],
        },
        {
          id: "signaler",
          titre: "Signaler un obstacle",
          blocs: [
            { noeud: <p>Si un contenu vous est inaccessible, dites-le nous par le <Link href="/contact">formulaire de contact</Link> : nous vous transmettrons l&apos;information sous une autre forme et corrigerons la page. Si vous n&apos;obtenez pas de réponse satisfaisante, vous pouvez saisir le Défenseur des droits (<a href="https://www.defenseurdesdroits.fr" rel="noopener">defenseurdesdroits.fr</a>).</p> },
          ],
        },
      ]}
    />
  );
}
