/* ═══════════════════════════════════════════════════════════════════════════
   À QUOI SERT CHAQUE RESSOURCE

   Du texte, pas des données : aucun chiffre ici. Les usages décrits sont les
   grands débouchés connus de chaque produit ; les quantités, elles, viennent
   toutes des fichiers FAOSTAT et s'affichent dans les graphiques.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Usages {
  /** Les grands débouchés, du plus courant au plus spécialisé. */
  usages: string[];
  /** Ce dont dépend la production : climat, sol, élevage, savoir-faire. */
  conditions: string;
}

export const USAGES: Record<string, Usages> = {
  "qcl-wheat": {
    usages: [
      "Alimentation humaine : farine pour le pain, les pâtes (blé dur), les biscuits, la semoule et le boulgour.",
      "Alimentation animale, surtout les grains de moindre qualité meunière.",
      "Usages industriels : amidon, gluten, et une part transformée en bioéthanol dans certains pays.",
    ],
    conditions: "Le blé pousse en climat tempéré et semi-aride. Les grandes plaines céréalières (Chine du Nord, Inde gangétique, plaines russes et ukrainiennes, Grandes Plaines américaines, Europe de l'Ouest) concentrent l'essentiel de la récolte ; les rendements dépendent surtout de l'irrigation, des engrais et du régime des pluies.",
  },
  "qcl-rice": {
    usages: [
      "Alimentation humaine avant tout : c'est la céréale de base d'une grande partie de l'Asie, consommée en grain.",
      "Farines, nouilles, galettes et boissons fermentées.",
      "Sous-produits : paille et son utilisés pour l'alimentation animale et comme combustible.",
    ],
    conditions: "Le riz demande de la chaleur et beaucoup d'eau : il est cultivé surtout en rizières inondées, dans les deltas et les plaines de mousson d'Asie, d'où vient la très grande majorité de la production mondiale.",
  },
  "qcl-quinoa": {
    usages: [
      "Graine consommée comme une céréale (bien qu'elle n'en soit pas une) : en grain, en farine, en flocons.",
      "Produit d'exportation devenu prisé pour sa richesse en protéines.",
    ],
    conditions: "Originaire des hauts plateaux andins, le quinoa supporte l'altitude, le froid et des sols pauvres : sa production reste concentrée en Bolivie et au Pérou, malgré des essais de culture sur d'autres continents.",
  },
  "qcl-cereals-n-e-c": {
    usages: [
      "Céréales que FAOSTAT ne classe dans aucune autre catégorie : grains secondaires et cultures locales.",
      "Alimentation humaine et animale, selon les régions.",
    ],
    conditions: "Cette catégorie regroupe des céréales mineures dont la composition varie d'un pays à l'autre : les comparaisons entre pays doivent être lues avec prudence.",
  },
  "qcl-potatoes": {
    usages: [
      "Alimentation humaine : consommée fraîche, ou transformée en frites, chips, purée et flocons.",
      "Fécule (amidon) pour l'alimentation et l'industrie (papier, textile).",
      "Alimentation animale et plants pour la saison suivante.",
    ],
    conditions: "Culture de climat frais, très productive à l'hectare, la pomme de terre s'est diffusée sur tous les continents ; la Chine et l'Inde dominent en volume, l'Europe du Nord-Ouest en rendement.",
  },
  "qcl-tomatoes": {
    usages: [
      "Consommation en frais.",
      "Transformation industrielle : concentré, sauces, purées, ketchup, conserves.",
    ],
    conditions: "La tomate aime la chaleur et l'ensoleillement. Les rendements les plus élevés viennent des cultures sous serre, où l'on contrôle la température, l'eau et la lumière.",
  },
  "qcl-avocados": {
    usages: [
      "Fruit consommé frais, en salade ou en purée (guacamole).",
      "Huile d'avocat pour l'alimentation et la cosmétique.",
    ],
    conditions: "L'avocatier pousse en climat tropical et subtropical, et demande beaucoup d'eau. Le Mexique domine largement, suivi par d'autres pays d'Amérique latine et d'Afrique de l'Est, souvent tournés vers l'exportation.",
  },
  "qcl-olive-oil": {
    usages: [
      "Huile alimentaire, crue ou de cuisson, pilier des cuisines méditerranéennes.",
      "Cosmétique, savonnerie et pharmacie.",
    ],
    conditions: "L'olivier est l'arbre du climat méditerranéen : étés chauds et secs, hivers doux. La production se concentre autour de la Méditerranée, Espagne en tête, et varie fortement d'une année à l'autre selon les sécheresses et l'alternance des récoltes.",
  },
  "qcl-sunflower-seed-oil-crude": {
    usages: [
      "Huile alimentaire de cuisson et de friture, et ingrédient de l'industrie agroalimentaire (margarines, plats préparés).",
      "Tourteau de pressage utilisé pour l'alimentation animale.",
      "Usages industriels et, en partie, biocarburants.",
    ],
    conditions: "Le tournesol se cultive dans les plaines tempérées à étés chauds : la mer Noire (Ukraine, Russie) concentre une grande partie de la production mondiale d'huile, ce qui rend le marché sensible à la situation de cette région.",
  },
  "qcl-cocoa-beans": {
    usages: [
      "Chocolat : les fèves fermentées et séchées sont broyées en pâte de cacao.",
      "Beurre de cacao (chocolaterie, cosmétique) et poudre de cacao.",
    ],
    conditions: "Le cacaoyer ne pousse qu'en zone équatoriale humide. L'Afrique de l'Ouest, Côte d'Ivoire et Ghana en tête, fournit l'essentiel des fèves, souvent produites par de petites exploitations familiales ; la production est sensible aux maladies des arbres et aux aléas climatiques.",
  },
  "qcl-chillies-and-peppers-dry-capsicum-spp-pimenta-spp-raw": {
    usages: [
      "Épices : piment en poudre, paprika, flocons.",
      "Colorants alimentaires naturels et oléorésines.",
      "Une partie entre dans la composition de sauces et de condiments.",
    ],
    conditions: "Les piments se cultivent en climat chaud ; l'Asie du Sud, Inde en tête, domine la production de piments séchés.",
  },
  "qcl-wine": {
    usages: [
      "Boisson consommée sur le marché intérieur et largement exportée.",
      "Distillation en eaux-de-vie (cognac, armagnac, brandy) et vinaigre.",
    ],
    conditions: "La vigne demande un climat tempéré chaud et des étés secs. L'Europe du Sud (Italie, France, Espagne) produit l'essentiel du vin mondial, et les volumes varient fortement d'un millésime à l'autre selon le gel, la grêle et la sécheresse.",
  },
  "qcl-meat-of-chickens-fresh-or-chilled": {
    usages: [
      "Viande consommée fraîche ou transformée (découpes, plats préparés, charcuterie de volaille).",
      "Sous-produits valorisés en aliments pour animaux.",
    ],
    conditions: "L'élevage de poulets de chair est très industrialisé : cycles courts, aliments à base de maïs et de soja. La production suit la demande des grands marchés (États-Unis, Chine, Brésil) et dépend du prix des céréales et des épizooties comme la grippe aviaire.",
  },
  "qcl-meat-of-pig-with-the-bone-fresh-or-chilled": {
    usages: [
      "Viande fraîche et charcuterie (jambon, saucisses, lard).",
      "Graisses, gélatine et sous-produits pour l'industrie.",
    ],
    conditions: "La Chine produit et consomme à elle seule une très grande part du porc mondial. La production dépend du prix des aliments et des épizooties : la peste porcine africaine a fortement réduit le cheptel chinois à la fin des années 2010.",
  },
  "qcl-meat-of-ducks-fresh-or-chilled": {
    usages: [
      "Viande de canard consommée fraîche, rôtie, confite ou fumée.",
      "En France, une partie des canards est élevée pour le foie gras, la viande (magrets, confits) en étant un débouché.",
    ],
    conditions: "L'élevage de canards est très concentré en Asie de l'Est, Chine en tête.",
  },
  "qcl-meat-of-camels-fresh-or-chilled": {
    usages: [
      "Viande consommée dans les régions arides d'Afrique et du Moyen-Orient.",
      "Le dromadaire est aussi élevé pour son lait, le transport et sa laine.",
    ],
    conditions: "Le dromadaire est l'animal des zones arides et semi-arides : la production se concentre dans la Corne de l'Afrique, le Sahel et la péninsule Arabique, souvent dans des élevages pastoraux.",
  },
  "qcl-raw-milk-of-cattle": {
    usages: [
      "Lait de consommation.",
      "Transformation en fromages, beurre, yaourts, crème et poudre de lait.",
      "Ingrédients pour l'industrie alimentaire (lactosérum, caséines).",
    ],
    conditions: "La production laitière dépend de la taille du troupeau et de la productivité par vache, très variable : élevée dans les élevages spécialisés d'Amérique du Nord et d'Europe, plus faible là où domine un élevage plus extensif.",
  },
  "qcl-hen-eggs-in-shell-fresh": {
    usages: [
      "Œufs de consommation, en coquille.",
      "Ovoproduits (œufs liquides, en poudre) pour la boulangerie, la pâtisserie et l'industrie alimentaire.",
    ],
    conditions: "La production d'œufs suit la taille des élevages de poules pondeuses ; la Chine domine nettement. Les épidémies de grippe aviaire peuvent faire chuter brusquement la production d'un pays.",
  },
};
