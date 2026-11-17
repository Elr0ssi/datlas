# DATLAS World — Atlas pédagogique des conflits du Moyen-Orient

**Prototype éditorial et technique | arrêté au 17 novembre 2026.**

Ce lot est conçu pour être copié dans le projet Next.js **`Elr0ssi/hub2gether-claude-Local`** (ancien *The Essential Data* / Vizualize), et travaillé dans Claude Code. La version accessible du dépôt contient déjà Next.js, React, TypeScript, `leaflet` et `react-leaflet`.

## Ce qui est livré

- `src/data/conflicts/datlas-middle-east.json` : **7 dossiers**, **33 repères GPS**, **35 événements chronologiques**, **6 relations géopolitiques**, **17 sources**.
- `src/components/conflicts/DatlasConflictExplorer.tsx` : interface filtres/pays/période, fiches, chiffres, acteurs et sources.
- `src/components/conflicts/DatlasConflictMap.tsx` : carte React Leaflet, **clic sur les pays (GeoJSON du dépôt existant)**, popups et lignes conceptuelles.
- `src/components/conflicts/datlas-conflicts.css` : mise en forme responsive.
- `src/app/map/conflicts/page.tsx` : nouvelle route Next.js statique et SEO.
- `public/data/*.geojson` : sorties GeoJSON des points et relations.
- `aperçu-datlas-conflits.html` : démonstration autonome avec Leaflet CDN, à ouvrir dans un navigateur avec accès Internet.
- `tests/validate_datlas_data.py` : validations du contenu et des relations.
- `CLAUDE_CODE_PROMPT.md` : brief d'intégration prêt à copier.

## Installation dans le dépôt

1. Copier les répertoires `src/...` et `public/...` de ce lot à la racine de l'application existante, sans remplacer les autres fichiers.
2. Vérifier les dépendances : `leaflet`, `react-leaflet`, `@types/leaflet` (déjà présentes dans le dépôt consulté).
3. Conserver `public/geo/ne_110m_admin_0_countries.geojson` du dépôt actuel : il permet de cliquer sur les pays. Si absent, la carte fonctionne sans contours géographiques.
4. Lancer `npm run dev`, puis ouvrir `http://localhost:3000/map/conflicts`.
5. En cas de conflit de route avec `src/app/map/[theme]/page.tsx`, privilégier la route statique `/map/conflicts` livrée ici et exclure `conflicts` du composant générique si nécessaire.
6. Ajouter dans la navigation la route `/map/conflicts` et **recalculer** sitemap, dates et canonicals après le rebranding vers le domaine effectif de DATLAS World.
7. Exécuter : `python3 tests/validate_datlas_data.py`.

> Ne pas écraser la page actuelle Conflits sans comparaison. Le code GitHub consulté date du 21 juillet 2026 : les développements locaux depuis cette date peuvent être différents.

## Règles de véracité obligatoires

- Les coordonnées sont des **centres de villes ou des points de passage approximatifs**. Elles ne donnent **aucune** localisation de troupes, base militaire, installation sensible, cible ou ligne de front en temps réel.
- Les **traits fléchés** montrent des liens éditoriaux (effets régionaux, échanges, contexte partagé). Ils **ne représentent pas** des trajectoires de missiles, de convois, de déplacements de combattants ou de personnes.
- Aucun « total des morts du Moyen-Orient » ne doit être calculé : **les périodes, territoires et méthodes diffèrent** entre indicateurs.
- Les données historiques et 2026 ont leur **date de référence**, un **périmètre** et une **source**. La date de l'article et la période mesurée sont distinctes.
- L'absence de chiffres (notamment effectifs de combattants) est volontaire. Les valeurs `null` indiquent « non documenté de manière fiable », et **non** zéro.
- En mode année passée, le filtre porte sur les épisodes et événements : **la carte n'est pas une reconstruction historique de frontières ou fronts**. Les mesures ultérieures à l'année sélectionnée sont masquées.
- La licence d'une source ne se propage **pas automatiquement** à toutes les autres. Vérifier les droits avant toute synchronisation ou republication automatisée.

## Données : définition du « détail ultra synthétique »

Chaque conflit contient un résumé de 2 phrases, les causes, les enjeux, les acteurs (rôles séparés de leurs effectifs), une chronologie de jalons, des lieux de navigation et des indicateurs datés sourcés. Chaque indicateur inclut `scope`, `periodStart`, `periodEnd`, `asOf`, `sourceId`, `notes`, afin d'éviter les comparaisons trompeuses.

## Les 7 premiers dossiers

1. Gaza — guerre et crise humanitaire.
2. Cisjordanie — violences, restrictions, déplacements.
3. Liban–Israël — épisodes 2023–2024 et 2026.
4. Syrie — guerre, renversement du régime Assad et transition en 2026.
5. Yémen / mer Rouge — guerre, côte ouest et détroit de Bab-el-Mandeb.
6. Iran / Israël / États-Unis — escalade et négociations de 2026.
7. Irak — héritage de l'État islamique et tensions régionales.

## Étapes recommandées après installation

- Refaire les panneaux selon le design system DATLAS existant ; ne pas introduire un nouveau langage visuel incompatible.
- Ajouter un moteur de recherche dans les dossiers, un regroupement des points et une vue mobile plein écran.
- Faire confirmer chaque chiffre avant publication ; prévoir une revue éditoriale et l'historisation des versions.
- Ajouter les frontières officielles et les zones contestées à partir de sources géographiques avec mentions des limites territoriales et de l'incertitude.
- Enrichir en événements historiques **sourcés** via UCDP GED (`https://ucdp.uu.se/downloads/`) après analyse de licence, codebook et précision spatiale ; ne jamais traiter l'API comme un suivi de positions tactiques.
- Décliner en fiches SEO : `/conflits/gaza`, `/conflits/liban-israel`, `/conflits/yemen-mer-rouge`, avec titres et résumés uniques, et liens vers les cartes.

## Cartes et performance

La démo utilise les fonds OSM standard à titre de prototype uniquement. Pour un site à fort trafic, choisir un fournisseur de tuiles conforme à ses conditions d'utilisation ; éviter les téléchargements massifs sur les serveurs communautaires OSM. Les sous-couches GeoJSON pré-calculées permettront à terme une meilleure performance que plusieurs milliers de marqueurs React isolés.
