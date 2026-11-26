import type { Metadata } from "next";
import Link from "next/link";
import { PageDoc } from "@/components/legal/PageDoc";
import { FormulaireContact } from "@/components/contact/FormulaireContact";
import { MAJ_LEGAL } from "@/data/legal";

export const metadata: Metadata = {
  title: { absolute: "Contact : écrire à Datlas | Datlas" },
  description: "Une question, une erreur dans un chiffre, une demande RGPD ou un contenu à signaler : écrivez à l'équipe de Datlas, chaque message est lu.",
  alternates: { canonical: "/contact" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ objet?: string }> }) {
  const { objet } = await searchParams;
  return (
    <PageDoc
      chemin="/contact"
      type="ContactPage"
      titre="Nous écrire"
      chapo="Chaque message est lu par une personne. Pour une erreur de chiffre, donnez la page et la source qui la contredit : c'est ce qui permet de corriger vite."
      maj={MAJ_LEGAL}
      sections={[
        {
          id: "formulaire",
          titre: "Le formulaire",
          blocs: [{ noeud: <FormulaireContact objet={objet} /> }],
        },
        {
          id: "delais",
          titre: "Délais de réponse",
          blocs: [
            { tableau: { entetes: ["Demande", "Délai"], lignes: [
              ["Contenu manifestement illicite", "24 heures"],
              ["Erreur dans un chiffre", "Vérification sous 7 jours, correction publiée sur la page si elle est fondée"],
              ["Demande RGPD (accès, suppression…)", "Un mois au plus"],
              ["Autres questions", "Quelques jours ouvrés"],
            ] } },
          ],
        },
        {
          id: "autres-pages",
          titre: "Avant d'écrire",
          blocs: [
            { liste: [
              <span key="1">D&apos;où vient un chiffre : la page <Link href="/sources">Sources</Link> et la <Link href="/methodologie">méthodologie</Link>.</span>,
              <span key="2">Vos données : la <Link href="/confidentialite">politique de confidentialité</Link>.</span>,
              <span key="3">Signaler un message du forum : la <Link href="/moderation">charte de modération</Link>.</span>,
              <span key="4">Qui édite le site : les <Link href="/mentions-legales">mentions légales</Link>.</span>,
            ] },
          ],
        },
      ]}
    />
  );
}
