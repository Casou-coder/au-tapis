// Hints displayed during the challenge (one per challenge).
// Phrased as simple, accessible explanations of the underlying concept.
export const CHALLENGE_HINTS: Record<string, string> = {

  // ── Débutant ────────────────────────────────────────────────────────────────

  'deb-01': "Sur un tableau avec des cartes hautes comme un As ou un Roi, votre paire peut se retrouver derrière la main de l'adversaire.",
  'deb-02': "Un 'out' est une carte qui, si elle sort, vous permet de compléter votre meilleure combinaison.",
  'deb-03': "Un adversaire qui paye toutes les mises sans réfléchir est le moment idéal pour miser gros avec vos bonnes mains.",
  'deb-04': "Pour savoir si un appel est rentable, comparez le prix à payer avec ce que vous pourriez gagner si vous réussissez.",
  'deb-05': "Un joueur qui joue très peu de mains et relance fort en a presque toujours une vraiment bonne.",
  'deb-06': "Même si vous observez le comportement de l'adversaire, la force de votre propre main reste la priorité.",
  'deb-07': "Agir en dernier (être 'en position') est un avantage énorme — vous voyez l'action adverse avant de décider.",
  'deb-08': "Avant de décider, identifiez toujours exactement la combinaison que vous formez avec vos cartes et celles du tableau.",
  'deb-09': "Entrer dans un pot en limp (appeler 1 BB) sans relancer laisse l'initiative et l'avantage aux autres joueurs.",
  'deb-10': "Un 'set' (brelan de poche) est l'une des mains les plus fortes au poker — très difficile à battre.",
  'deb-11': "La 'règle du 4 et du 2' : multipliez vos outs par 4 au flop (2 cartes à venir) ou par 2 à la turn (1 carte).",
  'deb-12': "Avec une main pratiquement imbattable, l'objectif est d'extraire le maximum de jetons — pas de se cacher.",

  // ── Intermédiaire ────────────────────────────────────────────────────────────

  'int-01': "Un bluff est mathématiquement rentable quand l'adversaire se couche assez souvent — on peut calculer exactement à partir de quand.",
  'int-02': "Un 'semi-bluff', c'est miser avec un tirage : vous gagnez si l'adversaire se couche, ou en complétant votre main.",
  'int-03': "Un joueur 'en tilt' a perdu son calme et prend des décisions impulsives — ses mises ne suivent plus une logique normale.",
  'int-04': "Appeler avec une petite paire ('set mining') vise à toucher un brelan au flop et à gagner un énorme pot.",
  'int-05': "Sur un tableau avec des cartes consécutives, l'adversaire a plus de chances d'avoir une bonne main — la prudence s'impose.",
  'int-06': "Un 'squeeze' c'est une grosse relance face à un ouvreur et un appelant — le deuxième joueur est pris en étau.",
  'int-07': "Pour un appel rentable en fin de main, il faut que l'adversaire bluff assez souvent — calculable selon la taille de sa mise.",
  'int-08': "En grande blinde, vous avez déjà misé — vous avez un avantage de prix qui vous permet de défendre plus souvent.",
  'int-09': "Quand une nouvelle carte change le tableau, elle peut renforcer la main de l'adversaire — ajustez votre mise.",
  'int-10': "Un adversaire qui relance souvent rend votre propre relance contre lui plus souvent rentable.",
  'int-11': "Les 'reverse implied odds' : quand vous touchez, vous risquez de perdre encore plus si votre main est dominée.",
  'int-12': "Le tilt — jouer sous l'emprise de l'émotion — est l'une des causes de perte les plus évitables. La discipline reste votre atout.",

  // ── Avancé ───────────────────────────────────────────────────────────────────

  'adv-01': "Contre un adversaire qui joue trop de mains, relancer avec une main moyenne peut souvent le forcer à se coucher.",
  'adv-02': "Sur un tableau 'mouillé' (cartes proches), même les deux As risquent d'être rattrapés — une grosse mise protège.",
  'adv-03': "Un 'bloqueur' est une carte dans votre main qui empêche l'adversaire d'avoir certaines combinaisons — idéal pour bluffer.",
  'adv-04': "En tournoi, près des places payées, survivre vaut parfois plus que jouer pour maximiser vos chips.",
  'adv-05': "Un 'check-raise' est un piège puissant : vous passez d'abord, puis relancez quand l'adversaire mise.",
  'adv-06': "Le 'float' c'est appeler en position sans bonne main, avec l'intention de prendre le pot à la prochaine street.",
  'adv-07': "Une très grosse mise (overbet) signale soit une main très forte, soit un bluff — la bonne stratégie fait les deux.",
  'adv-08': "Un court stack en bulle de tournoi a souvent besoin de se coucher même avec une main correcte pour survivre.",
  'adv-09': "Quand vous ratez votre tirage en fin de main, miser peut être rentable si l'adversaire est susceptible de se coucher.",
  'adv-10': "Planifiez vos mises sur les trois streets à l'avance — une bonne main a un plan logique pour extraire des jetons.",
  'adv-11': "En tournoi avec un gros stack, vous pouvez pousser les joueurs avec peu de chips à se coucher, même sans bonne main.",
  'adv-12': "Les cartes consécutives de même couleur ('suited connectors') valent souvent la peine dans les pots à plusieurs joueurs.",

  // ── Expert ───────────────────────────────────────────────────────────────────

  'exp-01': "Le 'MDF' est le pourcentage minimum de vos mains que vous devez défendre pour ne pas être exploitable face aux bluffs.",
  'exp-02': "Pour être imprévisible, le ratio entre vos mises de valeur et vos bluffs doit correspondre exactement à la taille de votre mise.",
  'exp-03': "Quand une carte de turn profite plus à la gamme de l'adversaire qu'à la vôtre, checker vos mains fortes équilibre votre jeu.",
  'exp-04': "En finale de tournoi, chaque jetons vaut de l'argent réel — la prudence peut être plus précieuse que l'agressivité.",
  'exp-05': "Agir avant l'adversaire ('hors position') signifie que vous réalisez moins de valeur de votre main qu'en position.",
  'exp-06': "Sur un tableau qui frappe plus les mains de l'adversaire que les vôtres, laisser la pression de son côté est souvent optimal.",
  'exp-07': "Un adversaire qui se couche excessivement aux relances peut être attaqué avec une large gamme de mains.",
  'exp-08': "Sur un tableau sec où vous avez un gros avantage de gamme, miser souvent et petit extrait de la valeur efficacement.",
  'exp-09': "En GTO, quand call et fold ont le même résultat espéré, la solution est de faire les deux de façon aléatoire.",
  'exp-10': "En tournoi à trois joueurs, les all-ins avec des stacks moyens sont souvent justifiés malgré la pression ICM.",
  'exp-11': "Quand votre gamme contient plus de combinaisons maximales que celle de l'adversaire, vous pouvez miser plus gros.",
  'exp-12': "Contre un adversaire avec des tendances extrêmes, l'exploitation maximale bat une stratégie équilibrée.",

  // ── Professionnel ────────────────────────────────────────────────────────────

  'pro-01': "Avec plusieurs adversaires, même une bonne main devient vulnérable — contrôler la taille du pot est essentiel.",
  'pro-02': "En poker live, les tremblements involontaires trahissent presque toujours l'excitation d'un joueur qui tient une très bonne main.",
  'pro-03': "Certains adversaires 4-bettent exclusivement avec les deux As — dans ce cas, les deux Rois peuvent être couchés.",
  'pro-04': "Quand votre avantage de gamme est modéré, alterner entre checker et miser petit est plus équilibré qu'un seul choix.",
  'pro-05': "Chez un joueur novice, une très grosse mise n'a pas la même signification que chez un expert — méfiez-vous.",
  'pro-06': "En tournoi, les jetons ne valent pas la même chose qu'en cash game — leur valeur réelle dépend du classement et des gains.",
  'pro-07': "Face à un adversaire clairement irrationnel, votre capacité à 'lire' son comportement peut justifier un appel audacieux.",
  'pro-08': "Un bluff de 4-bet idéal utilise une carte qui bloque les meilleures mains adverses tout en conservant des chances si appelé.",
  'pro-09': "Un adversaire qui mise sur les trois streets représente un mélange de mains fortes et de bluffs — analysez la cohérence.",
  'pro-10': "Un bluff en fin de main doit utiliser le même sizing que vos mises de valeur pour rester imprévisible.",
  'pro-11': "Le 'SPR' (rapport stack/pot) guide votre plan de mise : SPR=5 signifie viser un all-in en trois streets.",
  'pro-12': "Un bon joueur adapte sa stratégie en temps réel quand l'adversaire commence à s'adapter à ses patterns.",
};
