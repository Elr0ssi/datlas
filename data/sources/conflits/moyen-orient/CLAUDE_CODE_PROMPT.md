# Prompt prêt à transmettre à Claude Code

Tu travailles dans le projet **DATLAS World** (ancien *Vizualize / The Essential Data*), dépôt GitHub historiquement nommé `hub2gether-claude-Local` ; ce n'est PAS une application de sport. La branche GitHub inspectée peut être plus ancienne que le code local : **lis d'abord les fichiers existants et compare avant de fusionner**.

## Mission

Intégrer le prototype `/map/conflicts` joint au projet en conservant le design, les composants et l'architecture actuels. Priorité absolue : **clarté géographique, chronologie simple, provenance de chaque chiffre**, puis finition UX.

## Livrables attendus

1. Une carte du Moyen-Orient avec zoom, **filtres pays/année**, contrôle de visibilité des liens, légende accessible et bouton de réinitialisation.
2. Clic sur un **pays/repère** → choisir un dossier lié ; clic sur un **conflit** → affiche résumé, causes, acteurs, chiffres vérifiés, chronologie, sources et sujets liés.
3. Marqueurs de lieux **publics et approximatifs uniquement**. Ne jamais générer de positions de troupes, fronts en cours, itinéraires militaires ou cibles en temps réel.
4. Liens conceptuels entre conflits, **étiquetés et clairement distincts de trajectoires physiques**. Les flèches n'impliquent aucune direction de mouvement réel.
5. Chiffres porteurs de `periodStart`, `periodEnd`, `asOf`, `scope`, `sourceId`. Afficher « Non documenté » quand `null` ; jamais de total régional trompeur.
6. Un mode « événement / période » avec chronologie ; ne pas représenter les fronts historiques sans données polygonales historiées et validées.
7. Interfaces mobiles, clavier, performance, SEO (titre, canonical à ajuster au vrai domaine, balisage d'article uniquement sur des pages éditoriales, source links) et tests.
8. Documenter les décisions, l'état des composants précédents, et proposer les tests à passer pour intégrer sans régression.

## Contraintes techniques

- Next.js App Router + TypeScript + Leaflet/React Leaflet déjà présents.
- Utiliser `/src/data/conflicts/datlas-middle-east.json` comme source initiale, avec un adaptateur si le modèle métier local diffère.
- Ne **pas** détruire la carte actuelle si une version locale avancée existe : fusionner fonctionnalités et garder une route de prévisualisation.
- Les données sont une **photographie arrêtée au 17/11/2026**, à revalider à chaque nouvelle publication.
- Rendre le composant de carte client uniquement (`dynamic(..., { ssr: false })`), sans casser le SSR des explications textuelles.
- Prévoir un bouton « Signaler une erreur » et une date de vérification par indicateur.
- Aucune dépendance à une API payante ou authentifiée dans ce premier lot.

## Checklist d'acceptation

- Les 7 dossiers s'ouvrent sur desktop et mobile.
- Le filtre année n'affiche pas d'événements ou de mesures datés après l'année sélectionnée.
- Chaque chiffre affiche un organisme et un lien source.
- Aucun acteur sans effectifs documentés ne se retrouve avec un nombre inventé ou égal à zéro.
- Les relations ne sont jamais présentées comme des routes militaires.
- Les 33 lieux ont des coordonnées GeoJSON valides dans l'ordre `[longitude, latitude]`.
- Pas de marqueur ou ligne sans légende.
- Les URL canoniques et le nom DATLAS World sont cohérents.

Commence par lire `README.md`, vérifier `tests/validate_datlas_data.py`, inspecter le code local existant, puis propose et effectue une intégration incrémentale sans supprimer de fonctionnalités actuelles.
