# Atlas du Moyen-Orient : intégration du lot « datlas-world-conflits-middle-east-v1 »

Lot reçu le 17 novembre 2026 (brief d'origine et README dans `data/sources/conflits/moyen-orient/`).

## Ce qui a été intégré

| Livré | Où | Remarque |
|---|---|---|
| `datlas-middle-east.json` (7 dossiers, 33 lieux, 35 jalons, 6 relations, 17 sources) | `src/data/conflits/moyen-orient/` | Tirets cadratins retirés et « DATLAS World » écrit « Datlas » dans les textes ; aucune valeur modifiée. |
| GeoJSON des lieux et des relations | `public/data/` | Ordre `[longitude, latitude]` vérifié contre le JSON. |
| Explorer + carte Leaflet | `src/components/conflits/moyen-orient/` | Réécrits dans le langage de Datlas (en-tête, sélecteurs, cartes arrondies, violet) au lieu du thème vert du prototype. |
| Route `/map/conflicts` | `/conflits/moyen-orient` | Adresse en français comme le reste du site ; `/map/conflicts` redirige (temporairement) vers elle. |
| `tests/validate_datlas_data.py` | `tests/` | Chemin du JSON adapté. |

## Décisions

- **Adaptateur plutôt que fusion.** Le modèle du lot diffère de l'inventaire mondial (`src/data/conflits`, 68 fiches, codes VIZ-C-*). Il est lu par `src/data/conflits/moyenOrient.ts`, qui porte toutes les règles de lecture (filtre d'année, « Non documenté », pas de total régional). La page `/conflits` et son globe ne sont pas modifiés ; elle renvoie vers l'atlas.
- **Carte client seulement** (`dynamic(..., { ssr: false })`). Les textes des dossiers, la méthode et les sources sont rendus par le serveur sous la carte (SEO, lecture sans JavaScript). Pas de balisage `Article` (ce n'est pas une page éditoriale) ; un fil d'Ariane `BreadcrumbList`.
- **Liens entre dossiers** : arcs en pointillé, sans flèche, légendés « Lien explicatif, pas un trajet » et décrits au survol. Les flèches du prototype ont été retirées pour ne suggérer aucun mouvement.
- **Repères** : un centre de ville est un disque plein ; une région, un passage ou une mer, un disque à bord pointillé (« approximatif »).
- **Filtre d'année** : masque les dossiers ouverts après l'année, les jalons, les chiffres (`asOf` et `periodStart`) et les relations postérieurs. Il ne reconstruit ni frontière ni front.
- **Chiffres** : valeur, unité, périmètre, période, date d'arrêt, organisme et lien ; « vérifié à l'arrêt du 17 nov. 2026 » (le lot n'a pas de date de vérification par indicateur : c'est la date d'arrêt du lot). Une valeur `null` s'affiche « Non documenté ».
- **« Signaler une erreur »** : le site n'a pas d'adresse de contact. Le bouton rédige le signalement (dossier, indicateur, valeur, source, date) à copier dans le forum ; aucun envoi automatique.
- **Fond de carte** : CARTO Positron (jour) / Dark Matter (nuit), données OpenStreetMap, attribution affichée. À remplacer par un fournisseur sous contrat avant un fort trafic (conditions d'utilisation de CARTO et des serveurs OSM).
- **Adresse partageable** : `?dossier=gaza&annee=2024`.

## Tests

- `npm run conflits:tester-moyen-orient` : validateur Python du lot + règles de l'adaptateur (aucun élément postérieur à l'année sur 2011-2026, source de chaque chiffre, effectifs jamais inventés, relations légendées, 33 lieux valides).
- `npm run conflits:tester-atlas -- http://localhost:3300` (serveur lancé) : les 7 dossiers et leurs 4 rubriques s'ouvrent sur bureau et mobile, chaque chiffre affiché a un lien source, filtre 2012, légende, redirection `/map/conflicts`, aucune erreur JavaScript.
- Non régression : `npm run conflits:tester-navigation` (page /conflits), `npm run build`.

## Reste à faire (proposé)

- Faire relire chaque chiffre avant publication ; historiser les versions du lot.
- Fiches SEO par dossier (`/conflits/moyen-orient/gaza`…), avec titres et résumés uniques.
- Frontières officielles et zones contestées avec mention des limites ; regroupement des points si le nombre de lieux augmente.
- Enrichissement par UCDP GED après analyse de licence et de précision spatiale ; jamais un suivi de positions.
