// ─── Types ────────────────────────────────────────────────────────────────────

export interface HandOption {
  label: string;
  isOptimal: boolean;
  feedback: string;
}

export interface HandStep {
  id: string;
  street: 'preflop' | 'flop' | 'turn' | 'river';
  board: string[];
  pot: string;
  heroStack: string;
  narrative: string;
  question: string;
  options: HandOption[];
  lessonHint?: string;
}

export interface HandVillain {
  name: string;
  emoji: string;
  style: string;
  vpip: number;
  pfr: number;
  description: string;
  tendency: string;
}

export interface HandScript {
  id: string;
  level: 'debutant' | 'intermediaire' | 'avance' | 'expert' | 'professionnel';
  title: string;
  concept: string;
  villain: HandVillain;
  setup: {
    heroHand: string[];
    position: string;
    blinds: string;
    effectiveStack: string;
    gameType: 'cash' | 'tournament';
  };
  steps: HandStep[];
  lesson: string;
  xp: number;
}

// ─── Les mains scriptées ───────────────────────────────────────────────────────

export const HAND_SCRIPTS: Record<string, HandScript> = {

  // ══════════════════════════════════════════════════════════════════════════════
  // DÉBUTANT, "La value-bet avec les Kings"
  // Concept : raiser en preflop, value-bet 3 streets sur board dry
  // ══════════════════════════════════════════════════════════════════════════════
  debutant: {
    id: 'deb-main-01',
    level: 'debutant',
    title: 'La value-bet avec les Kings',
    concept: 'Raiser en preflop, extraire de la valeur sur 3 streets',
    villain: {
      name: 'Marcel le Fish',
      emoji: '🐟',
      style: 'Fish passif',
      vpip: 58,
      pfr: 8,
      description: 'Joue beaucoup de mains, appelle trop, ne raise presque jamais.',
      tendency: 'Il appelle facilement mais ne bluff jamais. S\'il raise, il a quelque chose.',
    },
    setup: {
      heroHand: ['K♠', 'K♥'],
      position: 'BTN (Bouton)',
      blinds: '1€/2€',
      effectiveStack: '100BB (200€)',
      gameType: 'cash',
    },
    steps: [
      {
        id: 'step1',
        street: 'preflop',
        board: [],
        pot: '3BB',
        heroStack: '100BB',
        narrative: 'Marcel est en UTG. Il limp (appelle 1BB). Tout le monde folde. Tu es au Bouton avec K♠K♥. La SB et BB font leurs blindes.',
        question: 'Marcel a limpé. Tu as K♠K♥ au Bouton. Que fais-tu ?',
        options: [
          {
            label: 'Limp derrière, attendre le flop sans dévoiler',
            isOptimal: false,
            feedback: 'Erreur classique. Limper avec KK laisse entrer des mains bon marché qui peuvent battre tes Kings par accident. Tu perds de la valeur et tu joues OOP dans un pot multipersonnes. Avec une paire premium, on RAISE toujours.',
          },
          {
            label: 'Raise à 7BB (14€)',
            isOptimal: true,
            feedback: 'Parfait. Raiser à 6-7BB isole Marcel (tu veux jouer têt-à-tête avec KK), construit le pot, et prend l\'initiative. C\'est la décision qui maximise ton profit sur le long terme.',
          },
          {
            label: 'Raise à 15BB, punir le limp',
            isOptimal: false,
            feedback: 'Trop gros. Un raise à 15BB fait folder toutes les mains que tu bats. Tu veux que Marcel appelle avec ses mains inférieures (AT, KQ, 77...). 6-7BB est le sizing optimal pour extraire de la valeur.',
          },
          {
            label: 'All-in préflop, KK est trop fort',
            isOptimal: false,
            feedback: 'All-in préflop sur une table de cash à 1/2€ fait folder tout le monde immédiatement. Tu ne gagnes que les blindes. Laisse Marcel appeler avec ses mains inférieures.',
          },
        ],
        lessonHint: 'Avec une main premium (AA, KK, QQ, AK), on raise TOUJOURS. Le but est d\'isoler et de construire le pot.',
      },
      {
        id: 'step2',
        street: 'flop',
        board: ['J♦', '7♣', '2♠'],
        pot: '16BB',
        heroStack: '93BB',
        narrative: 'Marcel appelle. Le flop tombe J♦-7♣-2♠ (trois couleurs différentes, aucun tirage possible). Marcel check.',
        question: 'Flop J-7-2 arc-en-ciel. Marcel check. Tu as K♠K♥. Que fais-tu ?',
        options: [
          {
            label: 'Check derrière, piéger Marcel',
            isOptimal: false,
            feedback: 'Mauvaise idée. Checker avec KK ici laisse Marcel voir la turn gratuitement avec des mains comme A7, Q7, 98. Tu perds de la valeur ET tu exposes tes Kings à un "bad beat" inutile. On ne "piège" que dans des cas très spécifiques.',
          },
          {
            label: 'Bet 5BB (30% du pot)',
            isOptimal: false,
            feedback: 'Trop petit. Marcel appelle avec n\'importe quelle paire ou tirage pour 5BB. Un bet aussi petit extrait moins de valeur et n\'informe pas sur sa main. Vise 50-66% du pot.',
          },
          {
            label: 'Bet 10BB (60% du pot)',
            isOptimal: true,
            feedback: 'Excellent. 60% du pot est le sizing standard de value-bet sur un board sec. Marcel appellera avec J-X, 7-X, et ses paires inférieures. Tu extrais de la valeur ET tu protèges KK contre les overcards.',
          },
          {
            label: 'All-in, prendre le pot maintenant',
            isOptimal: false,
            feedback: 'Sur J-7-2 arc-en-ciel avec KK, un all-in précoce fait folder toutes les mains qui t\'auraient payé (JT, J9, 77...). Étale les bets sur 3 streets pour extraire un maximum.',
          },
        ],
        lessonHint: 'Sur un board sec sans tirage, value-bette entre 50-66% du pot avec ta main forte.',
      },
      {
        id: 'step3',
        street: 'turn',
        board: ['J♦', '7♣', '2♠', '4♥'],
        pot: '36BB',
        heroStack: '83BB',
        narrative: 'Marcel appelle le flop. La turn est le 4♥, une carte complètement neutre. Marcel check à nouveau.',
        question: 'Turn 4♥, aucun changement. Marcel check. Continue à value-better ?',
        options: [
          {
            label: 'Check, garder le pot petit avec KK',
            isOptimal: false,
            feedback: 'Non. La turn 4 n\'a rien changé. Tu as toujours la meilleure main face à Marcel. Checker ici laisse des mains comme J9, J8 voir la river gratuitement et potentiellement se faire deux paires. Continue à extraire.',
          },
          {
            label: 'Bet 18BB (50% du pot)',
            isOptimal: true,
            feedback: 'Parfait. Continuer à value-better avec 50% est idéal sur la turn. Marcel avec Jx va appeler. Il te paie pour apprendre la leçon. Si la river est un J, tu réévalues, mais pour l\'instant tu es largement devant.',
          },
          {
            label: 'Bet 36BB (pot entier)',
            isOptimal: false,
            feedback: 'Pot bet ici peut faire folder Marcel (il a peut-être J-X faible qui fold face à une grosse pression). 50% pot est suffisant pour extraire de la valeur sans effrayer.',
          },
          {
            label: 'All-in, 83BB dans le pot',
            isOptimal: false,
            feedback: 'All-in turn pour 83BB dans un pot de 36BB (overbet 2.3x) va faire folder tout sauf les sets et J-X fort. Tu construis mieux le pot en bettant 50% turn et laissant la river pour finir.',
          },
        ],
        lessonHint: 'La value-bet se fait sur 3 streets. Chaque street est une opportunité de faire payer Marcel pour ses mains inférieures.',
      },
      {
        id: 'step4',
        street: 'river',
        board: ['J♦', '7♣', '2♠', '4♥', '9♣'],
        pot: '72BB',
        heroStack: '65BB',
        narrative: 'Marcel appelle encore. La river est le 9♣. Marcel réfléchit... et bet 36BB (50% du pot). Ta première réaction : il a quelque chose ?',
        question: 'River 9♣. Marcel bet 36BB (50% pot). Tu as K♠K♥. Que fais-tu ?',
        options: [
          {
            label: 'Fold, Marcel a sûrement J-9 ou mieux',
            isOptimal: false,
            feedback: 'Mauvais fold. Marcel est un fish qui appelle 3 streets, il ne fold pas facilement mais il ne bluff pas non plus. Sa range sur le river inclut beaucoup de J-X (J8, J6...) et même 2-X qu\'il joue comme du bluff. KK bat tout ça.',
          },
          {
            label: 'Call, KK est trop fort pour folder',
            isOptimal: true,
            feedback: 'Correct. Face à un fish passif, son bet river représente souvent une main de showdown value (Jx, 7x, 9x). Tu bats tout sauf J9, 99, 77, 22. Ces combinaisons sont rares. KK en fréquence bat largement sa range de bet. Call.',
          },
          {
            label: 'Raise à 100BB (all-in)',
            isOptimal: false,
            feedback: 'Raise est possible mais risqué. Si Marcel bet river pour valeur, il peut appeler un raise seulement avec J9, 99 (full house), 77, 22. Ces mains te battent. Le call simple extrait et se protège du raise-bluff inexistant de Marcel.',
          },
        ],
        lessonHint: 'Contre un fish passif, faites confiance à votre main forte. Il bet river pour valeur ou par habitude, rarement comme bluff.',
      },
    ],
    lesson: 'La value-bet en 3 streets avec une main premium est la base du profit au poker. KK sur J-7-2 : raise preflop, c-bet flop, bet turn, call river. Cette séquence extraite de Marcel est le cœur du jeu gagnant en débutant.',
    xp: 120,
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // INTERMÉDIAIRE, "Le flush draw et les pot odds"
  // Concept : semi-bluff, calcul des pot odds, valeur river
  // ══════════════════════════════════════════════════════════════════════════════
  intermediaire: {
    id: 'int-main-01',
    level: 'intermediaire',
    title: 'Le flush draw et les pot odds',
    concept: 'Semi-bluff avec equity, calculer les pot odds, value-bet quand le flush arrive',
    villain: {
      name: 'Kevin le TAG',
      emoji: '📊',
      style: 'TAG (Tight Aggressive)',
      vpip: 22,
      pfr: 18,
      description: 'Joue peu de mains mais les joue agressivement. Bet pour valeur, fold au bluff si la board change.',
      tendency: 'Il c-bet beaucoup mais abandonne facilement face à de la résistance. Ses hands de valeur sont faciles à identifier.',
    },
    setup: {
      heroHand: ['A♣', 'K♣'],
      position: 'CO (Cutoff)',
      blinds: '2€/5€',
      effectiveStack: '100BB (500€)',
      gameType: 'cash',
    },
    steps: [
      {
        id: 'step1',
        street: 'preflop',
        board: [],
        pot: '7BB',
        heroStack: '100BB',
        narrative: 'Kevin open raise à 3BB depuis UTG. Les joueurs entre vous foldent. Tu es en CO avec A♣K♣.',
        question: 'Kevin (TAG) open 3BB UTG. Tu es en CO avec A♣K♣. Que fais-tu ?',
        options: [
          {
            label: 'Fold, Kevin UTG représente une main très forte',
            isOptimal: false,
            feedback: 'Trop tight. AKs est une des meilleures mains au poker. Même face à un TAG UTG (range forte : AA-JJ, AK, AQ), tu as ~35-40% d\'equity. Et tu as la position sur Kevin. Ne fold jamais AKs.',
          },
          {
            label: 'Call, jouer en position post-flop',
            isOptimal: false,
            feedback: 'Acceptable mais sous-optimal. AKs a assez d\'equity pour 3-better. En callant, tu caches ta main mais tu laisses les blindes entrer. Le 3-bet extrait plus de valeur et prend l\'initiative.',
          },
          {
            label: '3-bet à 10BB',
            isOptimal: true,
            feedback: 'Excellent ! AKs est un 3-bet évident contre un TAG : tu as une main forte, tu as la position, et si Kevin folde (ce qu\'il fait souvent avec JJ-QQ, AQ), tu gagnes le pot immédiatement. S\'il 4-bet, tu peux call ou fold selon le sizing.',
          },
          {
            label: '3-bet all-in, AK est trop fort pour juste 3-better',
            isOptimal: false,
            feedback: 'Trop agressif préflop. Un all-in à 100BB fait folder toutes les mains sauf AA et KK. Tu perds la valeur d\'AKs post-flop. 3-bet standard à 3x le raise de Kevin.',
          },
        ],
        lessonHint: 'AKs est dans le top 5% des mains. 3-bet systématiquement contre un open TAG, surtout en position.',
      },
      {
        id: 'step2',
        street: 'flop',
        board: ['Q♣', '8♣', '3♦'],
        pot: '22BB',
        heroStack: '90BB',
        narrative: 'Kevin appelle le 3-bet. Flop : Q♣-8♣-3♦. Tu as le nut flush draw (A♣K♣) + deux overcards. Kevin check.',
        question: 'Q♣-8♣-3♦. Tu as A♣K♣ : flush draw + overcards. Kevin check. Que fais-tu ?',
        options: [
          {
            label: 'Check derrière, attendre le flush',
            isOptimal: false,
            feedback: 'Mauvaise passivité. Tu as l\'initiative (3-betteur), tu as une main avec énorme equity (9 outs flush + 6 outs overcards ≈ 54% equity sur 2 cartes !). Le check laisse Kevin améliorer gratuitement. C-bet s\'impose.',
          },
          {
            label: 'Bet 11BB (50% pot), semi-bluff',
            isOptimal: true,
            feedback: 'Parfait. C\'est le semi-bluff classique : tu représentes une main forte (tu as 3-betté), tu as 54% d\'equity si callé, et Kevin peut folder QJ, Q9, 8x immédiatement. Double bénéfice : valeur si call, fold equity si peur.',
          },
          {
            label: 'Bet 22BB (pot entier)',
            isOptimal: false,
            feedback: 'Sizing trop gros comme semi-bluff. Pot bet pousse Kevin à folder ses mains moyennes mais aussi à seulement call avec ses meilleures mains. 50% pot est plus efficace : plus de calls de mains que tu domines.',
          },
          {
            label: 'All-in, pression maximale',
            isOptimal: false,
            feedback: 'Shove flop avec un draw, même nut flush draw, n\'est pas optimal. Kevin avec QQ, Q8 va t\'appeler et tu seras ~35% favori. Étale le semi-bluff sur plusieurs streets.',
          },
        ],
        lessonHint: 'Un semi-bluff combine equity réelle (le draw) + fold equity (la pression). C\'est plus profitable qu\'un pur bluff.',
      },
      {
        id: 'step3',
        street: 'turn',
        board: ['Q♣', '8♣', '3♦', '5♠'],
        pot: '44BB',
        heroStack: '79BB',
        narrative: 'Kevin appelle. Turn : 5♠, carte neutre, aucun flush. Kevin check encore.',
        question: 'Turn 5♠ (neutre). Kevin check. Tu as toujours le flush draw. Bet ou check ?',
        options: [
          {
            label: 'Check, conserve les chips si le flush rate',
            isOptimal: false,
            feedback: 'Checking ici abandonne ta fold equity. Kevin qui a checké deux fois peut avoir Q-X médiocre, 8-X, ou même un float. Un second barrel te permet de le pousser à folder ou de tirer le flush sur la river avec plus de valeur.',
          },
          {
            label: 'Bet 22BB (50% pot), second barrel',
            isOptimal: true,
            feedback: 'Excellent second barrel ! Tu as encore 9 outs pour le flush (18% sur river × implied odds). Kevin avec Q-X moyen va souvent fold face à cette pression. Et si il appelle, tu as encore une chance de toucher.',
          },
          {
            label: 'All-in 79BB, force le fold ou l\'all-in',
            isOptimal: false,
            feedback: 'Overbet all-in turn va te faire appeler uniquement par des mains qui te battent (QQ, Q8s, sets). Un sizing de 50% pot est bien plus profitable.',
          },
          {
            label: 'Bet 10BB, bet petit pour voir la river moins cher',
            isOptimal: false,
            feedback: 'Bet petit donne à Kevin un prix très intéressant pour appeler avec n\'importe quelle paire. 50% pot est le bon équilibre pour avoir de la fold equity.',
          },
        ],
        lessonHint: 'Un second barrel sur une turn neutre maintient la pression et peut faire folder des mains qui te battraient au showdown.',
      },
      {
        id: 'step4',
        street: 'river',
        board: ['Q♣', '8♣', '3♦', '5♠', 'T♣'],
        pot: '88BB',
        heroStack: '57BB',
        narrative: 'Kevin appelle encore. River : T♣, le flush est arrivé ! Tu as le NUT FLUSH (A♣K♣). Kevin réfléchit... et check.',
        question: 'River T♣, tu as le nut flush (A♣K♣). Kevin check. Comment joues-tu ?',
        options: [
          {
            label: 'Check derrière, sécurise le pot',
            isOptimal: false,
            feedback: 'Erreur ! Tu as le NUT FLUSH, la main la plus forte possible. Kevin a appelé deux streets, il a quelque chose. Checker ici laisse toute cette valeur sur la table. Avec la nuts, on bet TOUJOURS pour la valeur.',
          },
          {
            label: 'Bet 30BB (34% pot), petit pour induire un call',
            isOptimal: false,
            feedback: 'Trop petit avec la main la plus forte. Un petit bet peut induire un call de mains faibles mais laisse trop de valeur. Kevin qui a callé deux barrels ne va pas se plier à 30BB.',
          },
          {
            label: 'Bet 57BB (all-in, 65% pot)',
            isOptimal: true,
            feedback: 'Parfait ! All-in avec le nut flush est le move optimal. Kevin a callé deux streets, il a Q-X ou mieux. Face à un all-in "raisonnable" de 65% pot, il va souvent appeler. Tu extrais le maximum avec la meilleure main possible.',
          },
          {
            label: 'Bet 88BB (overbet 100% pot)',
            isOptimal: false,
            feedback: 'Un overbet peut marcher mais est risqué. Kevin voit une main très forte et peut folder Q-X médiocre. L\'all-in de 65% pot extrait mieux car il a l\'air d\'un bluff ou d\'un bet de valeur "normal".',
          },
        ],
        lessonHint: 'Avec la main la plus forte (nuts), on bet toujours pour la valeur. La peur de "faire peur" est l\'erreur du débutant.',
      },
    ],
    lesson: 'Le semi-bluff avec AKs sur un board à draw est l\'une des lignes les plus profitables du poker. Tu combines equity réelle (le flush draw) avec fold equity (ta représentation de main forte). Quand le flush arrive : bet toujours pour le maximum.',
    xp: 140,
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // AVANCÉ, "Le 3-bet bluff et le multi-street bluff"
  // Concept : 3-bet avec suited connector, c-bet sur board favorable, triple barrel
  // ══════════════════════════════════════════════════════════════════════════════
  avance: {
    id: 'adv-main-01',
    level: 'avance',
    title: 'Le bluff de A à Z',
    concept: '3-bet bluff avec suited connector, bluff multi-streets cohérent',
    villain: {
      name: 'Thomas le TAG solide',
      emoji: '🎯',
      style: 'TAG solide',
      vpip: 24,
      pfr: 20,
      description: 'Régulier solide. Range d\'open tight, fold souvent face à un 3-bet sans value main.',
      tendency: 'Fold to 3-bet : 68%. C-bet fréquent mais abandonne au double barrel sans top pair ou mieux.',
    },
    setup: {
      heroHand: ['6♠', '5♠'],
      position: 'BTN (Bouton)',
      blinds: '2€/5€',
      effectiveStack: '100BB',
      gameType: 'cash',
    },
    steps: [
      {
        id: 'step1',
        street: 'preflop',
        board: [],
        pot: '3BB',
        heroStack: '100BB',
        narrative: 'Thomas open raise à 3BB depuis le CO. Tu es en BTN avec 6♠5♠.',
        question: 'Thomas open CO (fold to 3-bet: 68%). Tu as 6♠5♠ BTN. Que fais-tu ?',
        options: [
          {
            label: 'Fold, 65s est trop faible contre une range CO',
            isOptimal: false,
            feedback: '65s est parfait comme 3-bet bluff ! Il a de l\'equity si callé (straight draws, flush draws), il ne bloque pas les fortes mains de Thomas (il n\'a pas d\'As), et Thomas fold 68% face à un 3-bet. C\'est une erreur de ne pas exploiter ça.',
          },
          {
            label: 'Call, jouer en position post-flop',
            isOptimal: false,
            feedback: 'Appeler est défendable mais sous-optimal. Le call laisse entrer SB/BB, dilue ton avantage positionnel, et tu joues 65s sans initiative. Le 3-bet bluff avec 65s est plus profitable à long terme.',
          },
          {
            label: '3-bet à 9BB, bluff avec suited connector',
            isOptimal: true,
            feedback: 'Move parfait. 65s est un excellent 3-bet bluff : equity suffisante si callé (55% des fois il fold = profit immédiat), tu as position, et 65 ne bloque aucune main forte de Thomas. La structure parfaite du bluff.',
          },
          {
            label: '3-bet all-in 100BB, pression maximale',
            isOptimal: false,
            feedback: 'All-in préflop avec 65s est une erreur. Thomas call avec AA/KK et tu es 30% favori. Le 3-bet à 9BB obtient le même fold equity avec beaucoup moins de risque.',
          },
        ],
        lessonHint: '65s est le 3-bet bluff parfait : equity si callé + pas de blockers sur les mains fortes + suited (peut faire flush).',
      },
      {
        id: 'step2',
        street: 'flop',
        board: ['K♦', '8♣', '3♥'],
        pot: '19BB',
        heroStack: '91BB',
        narrative: 'Thomas appelle le 3-bet. Flop K♦-8♣-3♥ (board dry, pas de tirage). Thomas check.',
        question: 'K-8-3 arc-en-ciel. Thomas check. Tu as 6♠5♠ (rien). Que fais-tu ?',
        options: [
          {
            label: 'Check derrière, pas de main, pas de bet',
            isOptimal: false,
            feedback: 'Mauvaise passivité. Tu as 3-betté : ta range représente beaucoup de Kx, AA, QQ. Thomas a checké sur un board K-8-3, il est probablement faible (JJ-TT, AQ, AJ). Ne pas c-better abandonne l\'initiative pour rien.',
          },
          {
            label: 'Bet 9BB (47% pot), c-bet standard',
            isOptimal: true,
            feedback: 'C\'est le c-bet classique du 3-betteur. Sur K-8-3, ta range représente KK, AA, AK, KQ. Thomas check = souvent rien (99-JJ, AQ). Un c-bet de 47% va le faire folder 60%+ du temps. Profit immédiat. Et si il appelle, le barrel suivant peut finir le travail.',
          },
          {
            label: 'Bet 19BB (pot entier)',
            isOptimal: false,
            feedback: 'Pot bet est trop gros comme bluff. Tu risques trop pour le même résultat. 40-50% pot obtient le même fold equity à moindre coût.',
          },
          {
            label: 'All-in, committ entièrement',
            isOptimal: false,
            feedback: 'All-in flop avec rien sur K-8-3 est une erreur massive. Thomas avec AK, KQ ou même KJ va t\'appeler et tu es <20% favori. Pas d\'equity = pas d\'overbet.',
          },
        ],
        lessonHint: 'Le 3-betteur a un avantage de range sur ce board. Un c-bet sur K-8-3 représente une main très forte.',
      },
      {
        id: 'step3',
        street: 'turn',
        board: ['K♦', '8♣', '3♥', '2♠'],
        pot: '37BB',
        heroStack: '82BB',
        narrative: 'Thomas appelle. Turn : 2♠. Thomas check encore.',
        question: 'Turn 2♠ (neutre). Thomas check 2 fois. Continue le bluff ?',
        options: [
          {
            label: 'Check, arrête le bluff, trop risqué',
            isOptimal: false,
            feedback: 'Thomas a checké deux fois sur K-8-3-2. Sa range est maintenant très polarisée : mains piège (KK, 88, 33) ou mains faibles (JJ, TT, AQ). Si tu check aussi, tu lui donnes une chance de bluffer ou de voir la river gratuitement. Continue.',
          },
          {
            label: 'Bet 19BB (51% pot), second barrel',
            isOptimal: true,
            feedback: 'Excellent. Le second barrel est crucial ici. Thomas qui a callé le flop avec JJ-TT ou AQ est maintenant sous pression maximale. Beaucoup de joueurs TAG foldent face à un second barrel. Ta story est cohérente : KK, AA, AK barrellent 2 streets.',
          },
          {
            label: 'All-in 82BB',
            isOptimal: false,
            feedback: 'Overbet turn est viable dans certains spots mais ici avec rien, le risque est trop grand. Le barrel standard de 50% obtient le même résultat à moindre coût. S\'il fold, parfait. S\'il call, tu peux encore bluffer river.',
          },
          {
            label: 'Bet 10BB, petit pour garder le bluff moins cher',
            isOptimal: false,
            feedback: 'Bet trop petit qui donne un prix excellent à Thomas pour appeler avec n\'importe quelle paire. Le sizing de 50% pot est nécessaire pour avoir de la fold equity.',
          },
        ],
        lessonHint: 'Un bluff cohérent sur 2 streets est difficile à caller sans une main très forte. La pression multi-streets est une arme puissante.',
      },
      {
        id: 'step4',
        street: 'river',
        board: ['K♦', '8♣', '3♥', '2♠', 'J♣'],
        pot: '75BB',
        heroStack: '63BB',
        narrative: 'Thomas appelle encore. River J♣. Thomas check pour la 3ème fois. Il a probablement un J, une paire de 8 ou joue piège avec un set.',
        question: 'River J♣. Thomas check 3 fois. Tu as toujours rien. Triple barrel ou check ?',
        options: [
          {
            label: 'Check, abandon, tu as raté le bluff',
            isOptimal: false,
            feedback: 'Check river abandonne. Tu n\'as aucune showdown value avec 65. Au showdown tu perds. Si Thomas a JJ, TT, 99, AJ, il fold face à une mise. Le triple barrel termine ce que tu as commencé. Et s\'il a KX, il fold aussi.',
          },
          {
            label: 'Bet 40BB (53% pot), triple barrel',
            isOptimal: true,
            feedback: 'C\'est la conclusion logique de ton histoire. 3 streets de mise représentent une main extrêmement forte (KK, AA, AK). Thomas qui a callé deux fois avec JJ-TT ou AJ doit maintenant se demander si 40BB vaut le risque face à "potentiellement KK". Beaucoup foldent.',
          },
          {
            label: 'All-in 63BB (overbet)',
            isOptimal: false,
            feedback: 'Overbet river bluff peut fonctionner sur certains boards mais ici sur K-8-3-2-J, Thomas avec KJ ou JJ va t\'appeler d\'un all-in mais peut folder face à un bet taille.',
          },
          {
            label: 'Bet 15BB (petit bluff)',
            isOptimal: false,
            feedback: 'Un bet à 15BB n\'a aucune fold equity. Thomas call facilement avec n\'importe quelle paire. Si tu bluffes river, la mise doit être suffisamment grande pour le pousser à folder, minimum 40-50% pot.',
          },
        ],
        lessonHint: 'Un triple barrel représente une main de valeur extrême. La cohérence de la story force les adversaires à se demander s\'ils peuvent se permettre de caller.',
      },
    ],
    lesson: 'Le bluff réussi n\'est pas de la chance, c\'est une histoire cohérente racontée sur 3 streets. 65s est parfait car il ne bloque pas les mains fortes. Chaque bet représente quelque chose de crédible. La clé : ne jamais abandonner à mi-chemin sans raison.',
    xp: 160,
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // EXPERT, "Set sur board dangereux"
  // Concept : jouer un set sur un board très connecté, protection vs valeur
  // ══════════════════════════════════════════════════════════════════════════════
  expert: {
    id: 'exp-main-01',
    level: 'expert',
    title: 'Le set sur board connecté',
    concept: 'Jouer un set sur un board dangereux : protection, sizing, decisions difficiles',
    villain: {
      name: 'Alex le Régulier',
      emoji: '📈',
      style: 'Régulier solide (NL100)',
      vpip: 26,
      pfr: 22,
      description: 'Bon joueur, joue en position, valorise son equity. Peut bluffer mais pas de manière irrationnelle.',
      tendency: 'C-bet range large sur les boards qu\'il "possède". Double barrel avec strong draws et value. Triple barrel uniquement avec valeur ou nuts bluff.',
    },
    setup: {
      heroHand: ['9♥', '9♦'],
      position: 'BB (Big Blind)',
      blinds: '2€/5€',
      effectiveStack: '100BB',
      gameType: 'cash',
    },
    steps: [
      {
        id: 'step1',
        street: 'preflop',
        board: [],
        pot: '7BB',
        heroStack: '98BB',
        narrative: 'Alex open raise 3BB depuis le BTN. SB fold. Tu es en BB avec 9♥9♦.',
        question: 'Alex BTN open 3BB. Tu es BB avec 99. Défendre ou fold ?',
        options: [
          {
            label: 'Fold, 99 hors position c\'est difficile',
            isOptimal: false,
            feedback: '99 est bien trop fort pour folder face à un open BTN. La range BTN d\'Alex est très large. Tu as assez d\'equity pour défendre. Fold serait massif overcautious.',
          },
          {
            label: 'Call, défendre le BB',
            isOptimal: true,
            feedback: 'Correct. 99 est une défense standard en BB contre un BTN open. Tu ne veux pas 3-better car Alex plie sa range. Call et jouer post-flop en cherchant ton set (probabilité ~11%). Si tu le touches, c\'est souvent de la valeur massive.',
          },
          {
            label: '3-bet à 10BB, 99 est assez fort',
            isOptimal: false,
            feedback: '3-bet avec 99 est possible mais compliqué OOP. Alex peut 4-bet/call avec TT-AA et tu es dans une situation délicate. Call est plus simple et garde le pot contrôlé.',
          },
          {
            label: '3-bet all-in, 99 est une paire premium',
            isOptimal: false,
            feedback: 'All-in préflop avec 99 est une grosse erreur. Alex call avec TT+ et tu es 80/20 perdant. 99 ne vaut pas 100BB en préflop.',
          },
        ],
        lessonHint: '99 en BB contre BTN : call défensif standard. Le set mining justifie le call.',
      },
      {
        id: 'step2',
        street: 'flop',
        board: ['9♠', 'T♦', '8♠'],
        pot: '7BB',
        heroStack: '97BB',
        narrative: 'Tu as le SET DE NEUF ! Mais le board 9-T-8 est extrêmement dangereux : straight possible (QJ, J7, 76...), flush draw pique possible. Alex c-bet 4BB (57% pot).',
        question: 'SET sur 9-T-8 bicolore, board ultra-dangereux. Alex c-bet 4BB. Que fais-tu ?',
        options: [
          {
            label: 'Call, ne dévoile pas ta force, slowplay',
            isOptimal: false,
            feedback: 'Slowplay ici serait une erreur grave. Sur T-9-8 avec un flush draw et des straights possibles, chaque carte de turn peut compléter QJ (straight), J7, ou le flush. En callant, tu laisses de l\'equity gratuite à Alex. RAISE pour protéger.',
          },
          {
            label: 'Check-raise à 16BB',
            isOptimal: true,
            feedback: 'Exact ! Le check-raise est le move optimal sur ce board. Raisons : 1) Tu protèges contre les draws (QJ, flush), 2) Tu extrais de la valeur d\'un board qu\'Alex "possède" (TT, 98, T9), 3) Tu construis le pot avec la main la plus forte probable. Check-raise, pas slowplay.',
          },
          {
            label: 'Raise direct à 16BB',
            isOptimal: false,
            feedback: 'Tu n\'as pas l\'initiative, tu es OOP et Alex a c-betté. La bonne mécanique est CHECK d\'abord (permettre le c-bet), puis RAISE. Le check-raise est plus surprenant et extrait plus de valeur.',
          },
          {
            label: 'All-in directement',
            isOptimal: false,
            feedback: 'All-in flop sur un pot de 7BB avec 97BB derrière est déséquilibré. Alex va fold tout sauf TT, 98, T9. Check-raise first, puis joue par streets.',
          },
        ],
        lessonHint: 'Sur un board dangereux avec un set, RAISE pour protéger ET extraire. Le slowplay est l\'ennemi sur les boards connectés.',
      },
      {
        id: 'step3',
        street: 'turn',
        board: ['9♠', 'T♦', '8♠', 'J♠'],
        pot: '39BB',
        heroStack: '89BB',
        narrative: 'Alex call le check-raise. Turn J♠, catastrophique ! Cette carte complète QJ (straight) ET le flush pique est maintenant possible. Alex check.',
        question: 'J♠ turn, straight et flush possible. Tu as un set (mais perd face à QJ et flush). Alex check. Que fais-tu ?',
        options: [
          {
            label: 'Check, trop de dangers, contrôler le pot',
            isOptimal: false,
            feedback: 'Checker laisse Alex voir gratuitement une river qui peut compléter un full house pour lui (TT, JJ si il les a). Et surtout, tu as encore la meilleure main probable. Si Alex avait la straight, il betterait. Son check = il est souvent sur un draw ou TT-type.',
          },
          {
            label: 'Bet 20BB (51% pot), continues à extraire',
            isOptimal: true,
            feedback: 'Correct. Alex a check-callé le flop. Son range inclut T-X, 8-X, flush draws. Face à un J♠, ces mains ne s\'améliorent pas toujours. Un bet de 50% pot : 1) extrait de la valeur, 2) charge les flush draws le prix correct, 3) te donne de l\'info sur la force d\'Alex.',
          },
          {
            label: 'Bet all-in 89BB, committ maintenant',
            isOptimal: false,
            feedback: 'All-in turn est trop violent. Si Alex a QJ (straight) ou le flush complété... bien. Mais il peut aussi fold des mains que tu bats. Bet sizing approprié permet de continuer si callé.',
          },
          {
            label: 'Fold, trop de mains nous battent',
            isOptimal: false,
            feedback: 'FOLD avec un SET ? Jamais sur la turn. Tu as 9♥9♦9♠ = SET. La seule main qui te bat présentement est QJ (straight) et le J♠T♠-type (flush). Ces combos sont possibles mais pas certains face à un check d\'Alex.',
          },
        ],
        lessonHint: 'Un set reste une main forte même sur un board dangereux. Continue à extraire avec un sizing approprié.',
      },
      {
        id: 'step4',
        street: 'river',
        board: ['9♠', 'T♦', '8♠', 'J♠', '9♣'],
        pot: '79BB',
        heroStack: '69BB',
        narrative: 'Alex call. River : 9♣, QUADS ! Tu as quatre 9. Impossible d\'être battu (sauf straight flush). Alex bet all-in 69BB dans un pot de 79BB.',
        question: 'QUADS de Neuf. River 9♣. Alex all-in 69BB. Que fais-tu ?',
        options: [
          {
            label: 'Fold, il peut avoir un straight flush',
            isOptimal: false,
            feedback: 'Fold avec des quads ? La seule main qui bat les quads est un straight flush (Q♠T♠ ou J♠8♠ sur ce board). Ces combos sont extrêmement rares. Call obligatoire dans 99.9% des cas.',
          },
          {
            label: 'Call, quads sont invincibles',
            isOptimal: true,
            feedback: 'Évidemment call ! Alex peut avoir QJ (straight), flush, ou bluff, tu les bats tous avec des quads. Une seule main possible te bat : le straight flush (Q♠J♠ sur board T♠-8♠-J♠-9♣... impossible avec J♠ sur le board). Call. Empoches le pot.',
          },
          {
            label: 'Raise all-in, c\'est déjà all-in impossible',
            isOptimal: false,
            feedback: 'Alex est déjà all-in ! Tu ne peux que call ou fold. Le call est l\'unique bonne réponse.',
          },
        ],
        lessonHint: 'Les quads battent tout sauf le straight flush. Ne pas folder des quads en dehors du straight flush évident est une règle absolue.',
      },
    ],
    lesson: 'Le set mining paye quand tu touches. Mais sur un board dangereux (9-T-8-J-9), la clé est de PROTEGER le set dès le flop avec un check-raise, puis de continuer à extraire même quand le board devient dangereux. La patience est récompensée : river quads.',
    xp: 175,
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // PROFESSIONNEL, "River polarized overbet"
  // Concept : overbet river avec range polarisée, bluff/value au même sizing
  // ══════════════════════════════════════════════════════════════════════════════
  professionnel: {
    id: 'pro-main-01',
    level: 'professionnel',
    title: 'L\'overbet river polarisé',
    concept: 'Range polarisée, overbet river identique pour value et bluff, nuts advantage',
    villain: {
      name: 'Marco le GTO',
      emoji: '🤖',
      style: 'Régulier GTO NL500',
      vpip: 28,
      pfr: 24,
      description: 'Solide, défend bien, sait différencier value de bluff. Peut folder au bon endroit.',
      tendency: 'Défend face aux petits bets mais struggle face aux overbets qui le forcent à prendre des décisions difficiles sur sa range entière.',
    },
    setup: {
      heroHand: ['A♠', 'Q♣'],
      position: 'BTN (Bouton)',
      blinds: '5€/10€',
      effectiveStack: '100BB',
      gameType: 'cash',
    },
    steps: [
      {
        id: 'step1',
        street: 'preflop',
        board: [],
        pot: '15BB',
        heroStack: '100BB',
        narrative: 'Tu open BTN à 3BB. Marco défend le BB. Pot 7BB.',
        question: 'BTN open AQo à 3BB. Marco défend BB. Situation standard. Quel open ?',
        options: [
          {
            label: 'Limp BTN, jouer passif',
            isOptimal: false,
            feedback: 'Jamais limpé au BTN avec AQo. Open raise systématiquement pour prendre l\'initiative préflop.',
          },
          {
            label: 'Open 3BB, standard BTN',
            isOptimal: true,
            feedback: 'Correct. Open 3BB au BTN avec AQo est le standard. Tu prends l\'initiative, construis le pot, et tu es en position pour tout le reste de la main.',
          },
          {
            label: 'Open 5BB, punir les défenses larges',
            isOptimal: false,
            feedback: '5BB est trop gros au BTN. Ça réduit ta profitabilité en faisant folder des mains que tu domines et en levant le prix de chaque pot. 2.5-3BB est standard.',
          },
          {
            label: '3-bet all-in, AQo est premium',
            isOptimal: false,
            feedback: 'AQo ne justifie pas un shove préflop à 100BB. C\'est une main de valeur post-flop, pas un shove préflop.',
          },
        ],
        lessonHint: 'BTN open range est large. AQo est dans le top 10% des mains, open systématiquement.',
      },
      {
        id: 'step2',
        street: 'flop',
        board: ['A♦', 'K♣', '7♠'],
        pot: '7BB',
        heroStack: '97BB',
        narrative: 'Flop A♦-K♣-7♠ (dry, tu as top pair top kicker). Marco check.',
        question: 'A-K-7 arc-en-ciel. Tu as AQ (top pair top kicker). Marco check. Que fais-tu ?',
        options: [
          {
            label: 'Check derrière, slowplay TPTK',
            isOptimal: false,
            feedback: 'TPTK sur A-K-7 mérite un bet. Marco peut avoir A-X (AJ, AT, A9) qui va appeler. Checker cache ta main mais perd de la valeur.',
          },
          {
            label: 'Bet 3BB (43% pot)',
            isOptimal: true,
            feedback: 'Bon sizing. Sur A-K-7 sec, un bet de 40-50% pot est standard. Tu extrais de la valeur des Ax de Marco, protèges contre les gutshots, et prends l\'initiative. Simple et efficace.',
          },
          {
            label: 'Bet 7BB (pot entier)',
            isOptimal: false,
            feedback: 'Pot bet est trop gros sur un board sec. 40-50% extrait la même valeur des mains qui callent et garde les bluffs rentables dans ta range.',
          },
          {
            label: 'All-in 97BB',
            isOptimal: false,
            feedback: 'All-in flop avec TPTK fait folder tout. Tu veux construire le pot graduellement sur 3 streets.',
          },
        ],
        lessonHint: 'Sur un board sec avec TPTK, bet pour la valeur et la protection. 40-50% pot est suffisant.',
      },
      {
        id: 'step3',
        street: 'turn',
        board: ['A♦', 'K♣', '7♠', '2♥'],
        pot: '13BB',
        heroStack: '94BB',
        narrative: 'Marco call. Turn 2♥, carte complètement neutre. Marco check.',
        question: 'Turn 2♥ (neutre). Marco check. Continues à value-better ?',
        options: [
          {
            label: 'Check derrière, pot control avec TPTK',
            isOptimal: false,
            feedback: 'Non. La turn neutre n\'a rien changé. Marco a callé le flop, il a quelque chose (Ax, K-X, 7-X ou un gutshot). Continue à extraire avec un bet turn.',
          },
          {
            label: 'Bet 7BB (54% pot)',
            isOptimal: true,
            feedback: 'Parfait. Second barrel de value sur une turn neutre. Marco avec A-J, A-T, K-Q va appeler. Tu construis le pot pour un overbet river polarisé, la vraie décision est sur la river.',
          },
          {
            label: 'Bet 13BB (pot entier)',
            isOptimal: false,
            feedback: 'Pot bet turn est trop gros, fait folder des mains qui paient un bet normal. Et tu veux garder des chips pour un overbet river significatif.',
          },
          {
            label: 'Bet 4BB (petit)',
            isOptimal: false,
            feedback: 'Trop petit, donne un prix excellent à Marco pour tout appeler. 50% pot est le bon équilibre.',
          },
        ],
        lessonHint: 'Continue à construire le pot sur la turn. Le sizing turn prépare l\'overbet river.',
      },
      {
        id: 'step4',
        street: 'river',
        board: ['A♦', 'K♣', '7♠', '2♥', 'J♦'],
        pot: '27BB',
        heroStack: '87BB',
        narrative: 'Marco call. River J♦, potentiellement dangereux (QT straight possible, mais rare). Marco check. Tu as AQ (top pair + kicker broadway). Dans ta range polarisée ici : tu aurais AK (value), AJ (value), ou des bluffs (55, 66). Ton image : tight, credible.',
        question: 'River J♦. Marco check. Tu as AQ. Quel sizing pour maximiser ?',
        options: [
          {
            label: 'Check derrière, sécurise la main',
            isOptimal: false,
            feedback: 'Check river avec AQ laisse énormément de valeur sur la table. Marco a callé 2 streets, il a un Ax ou KX qui paye la river. Checker est une fuite de valeur majeure.',
          },
          {
            label: 'Bet 15BB (55% pot)',
            isOptimal: false,
            feedback: 'Sizing standard mais sous-optimal ici. Sur A-K-7-2-J avec ta range polarisée (AK, AJ vs bluffs), un overbet est bien plus profitable. Marco doit défendre contre un range de nuts/bluff, ça force des décisions difficiles.',
          },
          {
            label: 'Overbet 55BB (200% pot)',
            isOptimal: true,
            feedback: 'Excellent ! L\'overbet polarisé est le concept clé du niveau Pro. Ta range sur A-K-7-2-J est : AK (deux paires), AJ (deux paires), et bluffs. Un overbet de 200% pot force Marco à défendre uniquement ses meilleures mains. AQ extrait massivement d\'un KX ou AJ qui n\'arrive pas à folder.',
          },
          {
            label: 'All-in 87BB (322% pot)',
            isOptimal: false,
            feedback: 'Trop grand. Un overbet de 200-250% est optimal. L\'all-in peut faire folder des mains qui payeraient un overbet raisonnable. Calibrer le sizing est crucial.',
          },
        ],
        lessonHint: 'L\'overbet river fonctionne quand ta range est polarisée (nuts ou bluff) et que villain doit défendre sa range entière contre un sizing qui lui coûte cher.',
      },
    ],
    lesson: 'L\'overbet river polarisé est l\'un des outils les plus avancés du poker. Sur A-K-7-2-J, ta range de BTN (AK, AJ vs bluffs) justifie un sizing de 200% pot. Ce sizing force Marco à prendre des décisions difficiles sur toute sa range, là où un bet normal ne le dérange pas.',
    xp: 190,
  },
};

// ─── Scripts supplémentaires par niveau ───────────────────────────────────────

const DEB_MAIN_02: HandScript = {
  id: 'deb-main-02',
  level: 'debutant',
  title: 'Le set de 7 : value-bet en cascade',
  concept: 'Isoler un limpeur, extraire de la valeur sur 3 streets avec un set',
  villain: {
    name: 'Patrick le Limper',
    emoji: '🐌',
    style: 'Fish passif',
    vpip: 55,
    pfr: 8,
    description: 'Limp avec beaucoup de mains, joue passif post-flop.',
    tendency: 'Appelle trop facilement mais ne raise presque jamais. Ses raises = main forte.',
  },
  setup: {
    heroHand: ['7♣', '7♦'],
    position: 'CO (Cutoff)',
    blinds: '1€/2€',
    effectiveStack: '100BB (200€)',
    gameType: 'cash',
  },
  steps: [
    {
      id: 'step1',
      street: 'preflop',
      board: [],
      pot: '3BB',
      heroStack: '100BB',
      narrative: 'Patrick limp depuis UTG. Tout le monde folde. Tu es au CO avec 7♣7♦.',
      question: 'Patrick a limpé. Tu as 7♣7♦ au CO. Que fais-tu ?',
      options: [
        { label: 'Fold, trop de monde derrière toi', isOptimal: false, feedback: '77 est profitable contre un fish. Folder est trop conservateur, le set de 7 est un piège à chips contre Patrick.' },
        { label: 'Limp derrière, pot petit', isOptimal: false, feedback: 'Limper laisse entrer SB/BB à bas prix et tu perds l\'initiative. Avec 77, on raise pour isoler le fish.' },
        { label: 'Raise à 8BB, isoler Patrick', isOptimal: true, feedback: 'Parfait. Raiser isole Patrick, prend l\'initiative, et si tu touches un set tu extrais le maximum en position.' },
        { label: 'Raise à 20BB, punir le limp', isOptimal: false, feedback: 'Trop gros. Patrick va folder les mains qu\'il aurait appelées (KX, AX faibles). 7-8BB est le sizing optimal.' },
      ],
      lessonHint: 'Avec une paire 22-99, on raise pour isoler les limpeurs faibles et jouer en position.',
    },
    {
      id: 'step2',
      street: 'flop',
      board: ['7♠', 'K♦', '3♣'],
      pot: '18BB',
      heroStack: '92BB',
      narrative: 'Patrick appelle. Flop 7♠-K♦-3♣. SET DE SEPT ! Patrick check.',
      question: 'SET sur K-7-3 sec. Patrick check. Que fais-tu ?',
      options: [
        { label: 'Check derrière, piéger Patrick', isOptimal: false, feedback: 'Slowplay risqué. Patrick peut avoir KX et te payer plusieurs streets. Ne lui donne pas une turn gratuite. Bet pour la valeur !' },
        { label: 'Bet 5BB (28% pot)', isOptimal: false, feedback: 'Trop petit. Patrick appelle avec n\'importe quoi pour 5BB. Vise 50-60% pour maximiser la valeur du set.' },
        { label: 'Bet 11BB (60% pot)', isOptimal: true, feedback: 'Excellent. 60% pot est le sizing standard. KX va appeler, 3X aussi. Tu extrais de la valeur et protèges contre les overcards.' },
        { label: 'All-in 92BB', isOptimal: false, feedback: 'All-in flop fait folder tout sauf un King fort ou mieux. Étale sur 3 streets, Patrick te paiera beaucoup plus en total.' },
      ],
      lessonHint: 'Sur un board sec avec un set, value-bet 50-65% du pot. Pas besoin d\'overbet.',
    },
    {
      id: 'step3',
      street: 'turn',
      board: ['7♠', 'K♦', '3♣', '9♥'],
      pot: '40BB',
      heroStack: '81BB',
      narrative: 'Patrick appelle. Turn 9♥ (neutre). Patrick check.',
      question: 'Turn 9♥. Patrick check. Continue à value-better ?',
      options: [
        { label: 'Check, garder le pot petit', isOptimal: false, feedback: 'Non. Patrick avec KX continue à payer. Checker laisse des mains comme T8 voir la river gratuitement.' },
        { label: 'Bet 20BB (50% pot)', isOptimal: true, feedback: 'Parfait. Second barrel à 50% pot. Patrick avec K8, KT, KJ va appeler. Tu construis le pot pour le bet river.' },
        { label: 'Bet 40BB (pot entier)', isOptimal: false, feedback: 'Pot bet peut paniquer Patrick et faire folder des KX marginaux. 50% extrait mieux.' },
        { label: 'All-in 81BB', isOptimal: false, feedback: 'Overbet turn (2x pot) fait folder tout sauf une main très forte. 50% turn puis 65% river extrait beaucoup plus.' },
      ],
      lessonHint: 'Value-bet en cascade : 60% flop → 50% turn → 65% river.',
    },
    {
      id: 'step4',
      street: 'river',
      board: ['7♠', 'K♦', '3♣', '9♥', '2♣'],
      pot: '80BB',
      heroStack: '61BB',
      narrative: 'Patrick appelle encore. River 2♣ (neutre). Patrick check pour la 3ème fois.',
      question: 'River 2♣. Patrick check. Comment termines-tu ?',
      options: [
        { label: 'Check derrière, prend le pot', isOptimal: false, feedback: 'Fuite de valeur massive. Patrick a appelé 2 streets, il a quelque chose. Value-bet toujours sur la river avec un set.' },
        { label: 'Bet 25BB (31% pot)', isOptimal: false, feedback: 'Trop petit. Patrick aurait aussi appelé 50BB avec son KX. Tu laisses de la valeur sur la table.' },
        { label: 'Bet 52BB (65% pot)', isOptimal: true, feedback: 'Parfait. 65% pot river avec un set. KX va appeler. En total tu auras extrait 11+20+52 = 83BB de bets nets sur un pot initial de 3BB, c\'est la value-bet parfaite.' },
        { label: 'All-in 61BB', isOptimal: false, feedback: 'L\'all-in est légèrement supérieur mais peut faire folder les KX marginaux. 65% pot reste optimal pour maximiser les calls.' },
      ],
      lessonHint: 'Ne laissez jamais d\'argent sur la table contre un fish qui a appelé 3 streets.',
    },
  ],
  lesson: 'Le set mining paye doublement : tu touches un set environ 1 fois sur 8, mais quand tu le touches contre un fish qui limp-call, tu extrais presque toujours 3 streets de valeur. La clé : raise preflop pour construire le pot, puis bet systématiquement flop-turn-river.',
  xp: 120,
};

const DEB_MAIN_03: HandScript = {
  id: 'deb-main-03',
  level: 'debutant',
  title: 'Ne bluffez pas un calling station',
  concept: 'Identifier un fish appelant et ajuster : moins bluffer, plus value-bet',
  villain: {
    name: 'Bernard le Matic',
    emoji: '🎰',
    style: 'Calling station',
    vpip: 72,
    pfr: 5,
    description: 'Appelle presque toutes les mises, joue passivement, ne bluff jamais.',
    tendency: 'Inutile de le bluffer, il appelle. Par contre, il paie vos bonnes mains indéfiniment.',
  },
  setup: {
    heroHand: ['Q♦', 'J♠'],
    position: 'BTN (Bouton)',
    blinds: '1€/2€',
    effectiveStack: '100BB (200€)',
    gameType: 'cash',
  },
  steps: [
    {
      id: 'step1',
      street: 'preflop',
      board: [],
      pot: '3BB',
      heroStack: '100BB',
      narrative: 'Bernard limp UTG. Tout le monde folde. Tu es au BTN avec Q♦J♠.',
      question: 'Bernard a limpé. Tu as QJo au BTN. Que fais-tu ?',
      options: [
        { label: 'Fold, QJ sans couleur c\'est faible', isOptimal: false, feedback: 'QJo au BTN contre un fish est une main à jouer. Tu as la position et une main connectée.' },
        { label: 'Limp derrière', isOptimal: false, feedback: 'Limper avec QJo au BTN perd l\'initiative. Raise pour isoler Bernard et jouer en position avec l\'avantage.' },
        { label: 'Raise à 8BB, isoler Bernard', isOptimal: true, feedback: 'Correct. Raiser à 7-8BB isole Bernard, prend l\'initiative, et tu joues en position. QJo contre un fish est profitable si tu ajustes : value-bet tes bonnes mains, ne bluff jamais.' },
        { label: 'Raise à 15BB', isOptimal: false, feedback: 'Trop gros. 8BB est suffisant pour isoler Bernard. Inutile d\'ouvrir le pot à 15BB avec une main de semi-valeur.' },
      ],
      lessonHint: 'Isoler un fish en position est toujours profitable avec une main playable.',
    },
    {
      id: 'step2',
      street: 'flop',
      board: ['J♦', '8♣', '3♠'],
      pot: '18BB',
      heroStack: '92BB',
      narrative: 'Bernard appelle. Flop J♦-8♣-3♠. TOP PAIR ! Bernard check.',
      question: 'J-8-3 sec. Tu as QJ (top pair). Bernard check. Que fais-tu ?',
      options: [
        { label: 'Check derrière, le piège avec top pair', isOptimal: false, feedback: 'Erreur. Checker avec top pair contre un calling station est une fuite de valeur. Il va appeler tes bets avec J-X moyen, 8-X, 3-X, value-bet !' },
        { label: 'Bet 9BB (50% pot)', isOptimal: true, feedback: 'Parfait. C-bet de valeur à 50% pot. Bernard va appeler avec JT, J7, 8X, et même des paires inférieures. C\'est exactement ce que tu veux.' },
        { label: 'Bet 18BB (pot entier)', isOptimal: false, feedback: 'Trop gros. Bernard peut folder ses mains faibles face à un pot bet, alors qu\'il t\'aurait payé 50%. Sur un board sec, 50% est optimal.' },
        { label: 'All-in 92BB', isOptimal: false, feedback: 'All-in avec top pair fait folder tout. Ne jamais overbetter contre un calling station, il te paie sur 3 streets avec des bets standards.' },
      ],
      lessonHint: 'Contre un calling station, value-bet systématiquement avec tes bonnes mains. Ne jamais bluffer.',
    },
    {
      id: 'step3',
      street: 'turn',
      board: ['J♦', '8♣', '3♠', 'Q♠'],
      pot: '36BB',
      heroStack: '83BB',
      narrative: 'Bernard appelle. Turn Q♠, DEUX PAIRES ! (Reines + Valets). Bernard check.',
      question: 'Turn Q : tu as deux paires QJ. Bernard check. Continue ?',
      options: [
        { label: 'Check, deux paires c\'est assez fort pour ralentir', isOptimal: false, feedback: 'Mauvaise idée. Deux paires sur J-8-3-Q contre Bernard ? Il a probablement QX ou JX qui va te payer. Value-bet toujours.' },
        { label: 'Bet 18BB (50% pot)', isOptimal: true, feedback: 'Parfait. Second barrel à 50% avec deux paires. Bernard avec JT, Q8, Q7, il appelle. Tu construis le pot pour la river.' },
        { label: 'Bet 36BB (pot entier)', isOptimal: false, feedback: 'Pot bet peut faire folder des QX et JX faibles de Bernard. 50% extrait mieux de sa large calling range.' },
        { label: 'All-in 83BB', isOptimal: false, feedback: 'Overbet 2x pot avec deux paires contre un calling station. Il appelle uniquement avec un set ou mieux. Étale la valeur.' },
      ],
      lessonHint: 'Deux paires = value-bet systématique. La cascade de bets est la clé contre les fish.',
    },
    {
      id: 'step4',
      street: 'river',
      board: ['J♦', '8♣', '3♠', 'Q♠', '5♦'],
      pot: '72BB',
      heroStack: '65BB',
      narrative: 'Bernard appelle encore. River 5♦ (neutre). Bernard bet 20BB dans le pot de 72BB.',
      question: 'River 5♦. Bernard bet 20BB (28% pot). Tu as deux paires QJ. Que fais-tu ?',
      options: [
        { label: 'Fold, il a sûrement mieux', isOptimal: false, feedback: 'Bernard est un calling station : il ne bet pas pour bluffer. Mais son petit bet river (28% pot) ressemble à un bet de valeur mince avec J-X ou Q-X. Tu le bats avec deux paires.' },
        { label: 'Call, deux paires battent ses hands moyennes', isOptimal: true, feedback: 'Correct. Bernard avec JT, J8, Q7, Q4 bet petit river pour la valeur. Tu as deux paires, tu bats tout ça. Call est la bonne décision.' },
        { label: 'Raise à 50BB', isOptimal: false, feedback: 'Raise risqué. Si Bernard bet river, il a quelque chose. Un raise peut le pousser à folder ses mains moyennes ou, pire, call/raise avec un set qui te bat. Call est suffisant.' },
        { label: 'All-in 65BB', isOptimal: false, feedback: 'All-in river vs un calling station qui a betté = il appelle avec tout ce qui te bat. Le call simple est l\'option optimale ici.' },
      ],
      lessonHint: 'Contre un fish passif, son petit bet river = valeur mince. Call avec une main forte.',
    },
  ],
  lesson: 'La règle d\'or contre les calling stations : value-bet maximal avec vos bonnes mains, JAMAIS de bluff. Bernard t\'a payé 3 streets de value-bets, c\'est la définition du jeu gagnant contre ce profil de joueur.',
  xp: 120,
};

const INT_MAIN_02: HandScript = {
  id: 'int-main-02',
  level: 'intermediaire',
  title: 'Le squeeze préflop',
  concept: 'Squeezar avec une main forte face à un open + caller pour isoler',
  villain: {
    name: 'Karim le TAG + Paul le Fish',
    emoji: '📊',
    style: 'TAG (CO) + Fish (BTN)',
    vpip: 22,
    pfr: 18,
    description: 'Karim joue tight-agressif. Paul est un fish qui cold-call trop souvent.',
    tendency: 'Karim fold souvent face aux squeezes (60%+ du temps). Paul fold quasi-systématiquement.',
  },
  setup: {
    heroHand: ['A♣', 'K♦'],
    position: 'BB (Big Blind)',
    blinds: '2€/5€',
    effectiveStack: '100BB (500€)',
    gameType: 'cash',
  },
  steps: [
    {
      id: 'step1',
      street: 'preflop',
      board: [],
      pot: '10BB',
      heroStack: '98BB',
      narrative: 'Karim open 3BB CO. Paul call BTN. SB fold. Tu es BB avec A♣K♦.',
      question: 'Karim open CO, Paul call BTN. Tu as AKo en BB. Que fais-tu ?',
      options: [
        { label: 'Fold, AK vs 2 joueurs c\'est risqué', isOptimal: false, feedback: 'AKo est dans le top 2% des mains. Folder est une erreur grave. Tu as une main premium avec la possibilité de squeezar un pot multi-way.' },
        { label: 'Call, jouer en 3-way', isOptimal: false, feedback: 'Call possible mais sous-optimal. AKo est trop fort pour juste appeler. Le squeeze extrait beaucoup plus de valeur et réduit le nombre d\'adversaires.' },
        { label: 'Squeeze à 14BB', isOptimal: true, feedback: 'Excellent ! Le squeeze parfait. Karim va folder ~60% du temps (JJ, TT, AQ, KQ). Paul va folder quasi-systématiquement. Et si quelqu\'un call, tu as AKo en BB avec l\'info des ranges. L\'EV est fortement positive.' },
        { label: 'Squeeze all-in 100BB', isOptimal: false, feedback: 'All-in préflop force Karim à call uniquement avec AA, KK. Trop gros. Le squeeze à 14BB obtient la même fold equity pour bien moins de risque.' },
      ],
      lessonHint: 'Le squeeze (3-bet vs open + caller) fonctionne car le caller a une range large et va souvent folder.',
    },
    {
      id: 'step2',
      street: 'flop',
      board: ['K♠', '7♣', '2♦'],
      pot: '30BB',
      heroStack: '84BB',
      narrative: 'Karim appelle le squeeze (Paul folde). Flop K♠-7♣-2♦. TOP PAIR TOP KICKER ! Karim check.',
      question: 'K-7-2 sec. Tu as AK (top pair top kicker). Karim check. Que fais-tu ?',
      options: [
        { label: 'Check, slowplay TPTK', isOptimal: false, feedback: 'Pas de slowplay avec TPTK vs un TAG. Karim a KQ, KJ, K9, QQ dans sa range et va payer tes bets. Value-bet systématiquement.' },
        { label: 'Bet 12BB (40% pot)', isOptimal: false, feedback: 'Acceptable mais undersizing. 50-60% pot extrait plus de valeur des mains qui appellent et protège mieux contre les draws (bien qu\'il y en ait peu ici).' },
        { label: 'Bet 18BB (60% pot)', isOptimal: true, feedback: 'Parfait. C-bet standard avec TPTK sur board sec. Karim avec KQ, KJ va appeler. Tu bâtis le pot pour un turn et river profitables. Simple et efficace.' },
        { label: 'Bet 30BB (pot entier)', isOptimal: false, feedback: 'Trop gros. Karim va folder KJ, KT face à un pot bet. 60% extrait la même valeur des mains fortes et garde les mains faibles dans le pot.' },
      ],
      lessonHint: 'TPTK sur board sec = value-bet systématique. 50-60% pot est le sizing optimal.',
    },
    {
      id: 'step3',
      street: 'turn',
      board: ['K♠', '7♣', '2♦', 'J♥'],
      pot: '66BB',
      heroStack: '66BB',
      narrative: 'Karim appelle. Turn J♥ (potentiellement utile pour KJ/QJ de Karim). Karim check.',
      question: 'Turn J. Karim check. Continue à value-better avec AK ?',
      options: [
        { label: 'Check, J peut avoir aidé Karim', isOptimal: false, feedback: 'Même si J aide KJ de Karim, tu as TPTK avec A comme kicker. Tu bats KJ, KQ, K9. Continue à extraire, Karim a callé le flop, il a quelque chose.' },
        { label: 'Bet 33BB (50% pot)', isOptimal: true, feedback: 'Bien joué. Second barrel de value à 50%. Karim avec KQ, KJ va continuer. Et si Karim a KJ maintenant deux paires, il va payer. Tu es devant dans sa range globale.' },
        { label: 'Bet 66BB (all-in)', isOptimal: false, feedback: 'All-in turn est trop violent. Karim va caller uniquement avec KK, 77, 22 (sets) ou KJ deux paires, mains qui te battent. Bet sizing pour extraire, pas pour éliminer.' },
        { label: 'Bet 15BB (petit)', isOptimal: false, feedback: 'Trop petit. Donne un prix excellent à Karim pour appeler avec des tirages ou des mains médiocres. 50% pot est le bon équilibre.' },
      ],
      lessonHint: 'Contre un TAG qui a callé le flop, le second barrel extrait la valeur de son top pair. Ne ralentis pas.',
    },
    {
      id: 'step4',
      street: 'river',
      board: ['K♠', '7♣', '2♦', 'J♥', '4♣'],
      pot: '132BB',
      heroStack: '33BB',
      narrative: 'Karim appelle! River 4♣ (neutre). Karim check.',
      question: 'River 4♣. Karim check. Tu as AK et 33BB derrière dans un pot de 132BB. Bet ou check ?',
      options: [
        { label: 'Check derrière, prend le pot', isOptimal: false, feedback: 'Tu as 33BB et Karim a callé 2 streets. Checker laisse de la valeur. Un bet all-in (25% du pot) sur la river est presque toujours appelé par KQ, KJ.' },
        { label: 'Bet all-in 33BB (25% pot)', isOptimal: true, feedback: 'Parfait. All-in de 33BB dans un pot de 132BB = 25% pot. C\'est un bet river "ultra thin value" que Karim call facilement avec KQ, KJ, K9. Tu extrais le maximum de tes chips restants.' },
        { label: 'Bet 15BB seulement', isOptimal: false, feedback: 'Garder 18BB derrière après la river ne sert à rien. Si tu vas bet, bet all-in tes 33BB, Karim appelle les 15BB aussi facilement que les 33BB.' },
        { label: 'Check, Karim peut raise', isOptimal: false, feedback: 'Si Karim check-raise sur cette river avec 33BB pot, c\'est très inhabituel de sa part et tu peux call. Mais la probabilité est très faible, bet tes chips restants.' },
      ],
      lessonHint: 'En position débarcadère (peu de chips derrière), misez toujours vos chips restants si vous avez une main de valeur.',
    },
  ],
  lesson: 'Le squeeze préflop transforme un pot 3-way en duel. Avec AKo, tu builds le pot contre un adversaire que tu domines. La séquence : squeeze → c-bet → turn barrel → river all-in est le chemin de valeur maximal.',
  xp: 140,
};

const INT_MAIN_03: HandScript = {
  id: 'int-main-03',
  level: 'intermediaire',
  title: 'Tirer un tirage : pot odds et semi-bluff',
  concept: 'Calculer les pot odds, jouer un tirage comme semi-bluff, value-bet quand il arrive',
  villain: {
    name: 'David le TAG solide',
    emoji: '🎯',
    style: 'TAG (Tight Aggressive)',
    vpip: 21,
    pfr: 17,
    description: 'Joue serré-agressif. C-bet fréquent mais peut abandonner face à la résistance.',
    tendency: 'Double barrel avec valeur ou tirage fort. Abandonne rarement avec le top pair mais peut folder le milieu de sa range.',
  },
  setup: {
    heroHand: ['T♣', '9♣'],
    position: 'BTN (Bouton)',
    blinds: '2€/5€',
    effectiveStack: '100BB (500€)',
    gameType: 'cash',
  },
  steps: [
    {
      id: 'step1',
      street: 'preflop',
      board: [],
      pot: '7BB',
      heroStack: '97BB',
      narrative: 'Tu open BTN à 3BB avec T♣9♣. David défend en BB. Pot 7BB.',
      question: 'David défend BB. Tu as T♣9♣ au BTN. Open raise standard ?',
      options: [
        { label: 'Fold, T9s peut attendre une meilleure position', isOptimal: false, feedback: 'T9s au BTN est une main excellente. Position + connecteur suitée = open systématique. Folder serait trop tight.' },
        { label: 'Limp BTN, jouer petit', isOptimal: false, feedback: 'On ne limp jamais au BTN. Open raise pour prendre l\'initiative et avoir un sizing avantage post-flop.' },
        { label: 'Open 3BB, standard BTN', isOptimal: true, feedback: 'Correct. T9s au BTN est un open systématique. Tu as position, une main connectée qui peut faire straights et flushes, et l\'initiative préflop.' },
        { label: 'Open 5BB, T9s mérite un grand raise', isOptimal: false, feedback: '5BB est trop gros. T9s est une bonne main mais pas premium. 2.5-3BB est le sizing standard au BTN.' },
      ],
      lessonHint: 'T9s au BTN : open toujours. Position + suited connector = main très profitable.',
    },
    {
      id: 'step2',
      street: 'flop',
      board: ['8♣', '7♦', 'Q♥'],
      pot: '7BB',
      heroStack: '97BB',
      narrative: 'Flop 8♣-7♦-Q♥. Tu as un OPEN-ENDED STRAIGHT DRAW (6 ou J pour la quinte). David check.',
      question: '8-7-Q avec open-ended straight draw. David check. Que fais-tu ?',
      options: [
        { label: 'Check derrière, attends de toucher', isOptimal: false, feedback: 'Mauvaise passivité. Tu as l\'initiative et 8 outs pour la quinte (≈ 32% de toucher sur 2 cartes). C-bet comme semi-bluff : tu gagnes si David folde OU si tu touches la quinte.' },
        { label: 'Bet 4BB (57% pot)', isOptimal: true, feedback: 'Excellent semi-bluff. Tu as 8 outs + l\'initiative. David peut folder TT, JJ, J9 face à ton c-bet. Et si il appelle, tu as toujours ~32% d\'equity sur 2 cartes. Double bénéfice : fold equity + equity réelle.' },
        { label: 'Bet 7BB (pot entier)', isOptimal: false, feedback: 'Trop gros comme semi-bluff. 57% pot obtient la même fold equity pour moitié prix, ce qui rend la ligne plus profitable.' },
        { label: 'All-in, pression maximale', isOptimal: false, feedback: 'All-in avec seulement un tirage sur un pot de 7BB n\'est pas optimal. Tu risques 97BB pour un pot de 7BB avec seulement 32% d\'equity si callé.' },
      ],
      lessonHint: 'Le semi-bluff combine deux façons de gagner : fold equity immédiate + amélioration possible.',
    },
    {
      id: 'step3',
      street: 'turn',
      board: ['8♣', '7♦', 'Q♥', '6♣'],
      pot: '15BB',
      heroStack: '93BB',
      narrative: 'David appelle. Turn 6♣, la QUINTE EST ARRIVÉE ! (T-9-8-7-6). David check.',
      question: 'Turn 6♣, tu as la QUINTE ! David check. Comment joues-tu ?',
      options: [
        { label: 'Check derrière, slowplay la quinte', isOptimal: false, feedback: 'Erreur. Sur ce board connecté (8-7-6), des draws existent encore (flush clubs, quinte supérieure avec J9). Value-bet systématiquement pour protéger ET extraire.' },
        { label: 'Bet 8BB (53% pot)', isOptimal: true, feedback: 'Parfait. Value-bet avec la quinte sur un board dangereux. David avec Q-X, 8-X va appeler. Et les draws paient le bon prix pour continuer. Tu extrais ET tu charges les draws.' },
        { label: 'Bet 15BB (pot entier)', isOptimal: false, feedback: 'Pot bet est viable mais peut faire folder les Q-X qui t\'auraient payé. 50-60% pot extrait mieux de sa range globale.' },
        { label: 'All-in 93BB', isOptimal: false, feedback: 'All-in turn pour 93BB dans un pot de 15BB (6x pot) va folder tout sauf sets et quintes supérieures. Étale la valeur.' },
      ],
      lessonHint: 'Avec la main la plus forte sur un board connecté, value-bet pour protéger et extraire simultanément.',
    },
    {
      id: 'step4',
      street: 'river',
      board: ['8♣', '7♦', 'Q♥', '6♣', 'J♣'],
      pot: '31BB',
      heroStack: '85BB',
      narrative: 'David appelle. River J♣, flush clubs complété ! Tu as toujours la quinte (T-9-8-7-6). David bet 20BB.',
      question: 'River J♣ (flush pique). David bet 20BB (65% pot). Ta quinte est-elle encore bonne ?',
      options: [
        { label: 'Fold, le flush le bat', isOptimal: false, feedback: 'Tu as une quinte (T-9-8-7-6). Le flush clubs te bat seulement si David a deux clubs. Mais quelle est la probabilité ? Il a callé le flop et turn, peut-être avait-il le flush draw. Pas immédiatement évident qu\'il l\'a touché.' },
        { label: 'Call, ta quinte bat la majorité de sa range', isOptimal: true, feedback: 'Correct. David a callé deux streets, puis bet river. Sa range inclut Q-X (vaut moins que ta quinte), J-X (idem), des deux paires, et peut-être le flush. Mais la quinte est assez forte pour call 20BB dans un pot de 31BB (pot odds 2.55:1, tu dois gagner 28% du temps, ta quinte gagne bien plus souvent).' },
        { label: 'Raise à 55BB, ta quinte est très forte', isOptimal: false, feedback: 'Raise risqué. Si David a le flush (K♣X♣ ou A♣X♣), il re-raise. Le call extrait la valeur si tu bats sa range et limite les pertes si tu es battu.' },
        { label: 'All-in 85BB', isOptimal: false, feedback: 'All-in river vs son bet pourrait faire folder ses Q-X mais le flush (s\'il l\'a) appelle. Le call simple est plus profitable en EV.' },
      ],
      lessonHint: 'Une quinte est une main forte. Calculez si la range adverse vous bat avant de folder.',
    },
  ],
  lesson: 'Le semi-bluff avec un tirage est l\'une des lignes les plus profitables au poker. T9s sur 8-7-Q : bet pour la fold equity, touche la quinte en turn, value-bet pour le maximum. Chaque bet avait une raison, le tirage puis la main faite.',
  xp: 140,
};

const ADV_MAIN_02: HandScript = {
  id: 'adv-main-02',
  level: 'avance',
  title: 'Le check-raise semi-bluff OOP',
  concept: 'Jouer agressivement hors position avec un flush draw fort',
  villain: {
    name: 'Pierre le TAG agressif',
    emoji: '🎯',
    style: 'TAG agressif',
    vpip: 25,
    pfr: 21,
    description: 'C-bet large, double barrel fréquent, mais peut abandonner face à une résistance.',
    tendency: 'C-bet 75% des boards en position. Fold to check-raise : 45%. Abandon au double barrel si runner-runner arrive.',
  },
  setup: {
    heroHand: ['A♦', '8♦'],
    position: 'BB (Big Blind)',
    blinds: '2€/5€',
    effectiveStack: '100BB (500€)',
    gameType: 'cash',
  },
  steps: [
    {
      id: 'step1',
      street: 'preflop',
      board: [],
      pot: '7BB',
      heroStack: '98BB',
      narrative: 'Pierre open 3BB au BTN. SB fold. Tu es BB avec A♦8♦.',
      question: 'Pierre open BTN. Tu as A8s en BB. Défendre ou folder ?',
      options: [
        { label: 'Fold, A8s OOP c\'est difficile', isOptimal: false, feedback: 'A8s est une défense standard en BB vs BTN open. Tu as l\'avantage du nut flush draw et A♦ comme overcard. Folder serait trop tight contre un BTN range large.' },
        { label: 'Call, jouer en position défavorable', isOptimal: true, feedback: 'Correct. Call en BB avec A8s. Tu auras le nut flush draw sur tous les boards diamonds, et A comme overcard. La position est désavantageuse mais la main a assez d\'equity.' },
        { label: '3-bet à 10BB', isOptimal: false, feedback: 'Possible mais A8s est davantage un call que 3-bet. Si tu 3-bet et il call, tu joues OOP avec une main marginale dans un pot gonflé.' },
        { label: '3-bet all-in 100BB', isOptimal: false, feedback: 'A8s ne justifie pas un shove préflop à 100BB. Appelle simplement et joue post-flop.' },
      ],
      lessonHint: 'A8s en BB vs BTN : call défensif standard. La main a de l\'equity et du potential.',
    },
    {
      id: 'step2',
      street: 'flop',
      board: ['Q♦', 'J♦', '3♣'],
      pot: '7BB',
      heroStack: '98BB',
      narrative: 'Flop Q♦-J♦-3♣. NUT FLUSH DRAW ! Pierre c-bet 4BB (57% pot).',
      question: 'Q♦-J♦-3♣. Tu as A♦8♦ : nut flush draw + gutshot (T). Pierre c-bet 4BB. Que fais-tu ?',
      options: [
        { label: 'Fold, tu n\'as rien de concret', isOptimal: false, feedback: 'Tu as 9 outs pour le flush + possibilité de pair tes As. Environ 38% d\'equity sur 2 cartes. Folder est une grosse erreur avec ces draws.' },
        { label: 'Call, joue le draw passivement', isOptimal: false, feedback: 'Call acceptable mais sous-optimal. Tu es OOP, tu donnes l\'initiative à Pierre pour le reste de la main. Le check-raise prend le contrôle.' },
        { label: 'Check-raise à 16BB', isOptimal: true, feedback: 'Move excellent. Le check-raise ici : 1) Pierre fold 45% du temps avec son c-bet range large (KT, 9X, AX faibles), tu gagnes le pot, 2) si il call, tu as ~38% d\'equity sur 2 cartes, 3) tu prends le contrôle de la main OOP. Double bénéfice classique du check-raise semi-bluff.' },
        { label: 'Check-raise all-in', isOptimal: false, feedback: 'Check-raise all-in avec seulement un draw est trop engageant. Si Pierre call avec QQ ou JJ (set), tu es ~36% favori. Le check-raise sizing de 16BB obtient le même fold equity pour beaucoup moins de risque.' },
      ],
      lessonHint: 'OOP avec un draw fort : le check-raise prend le contrôle là où le call vous laisse passivement suivre.',
    },
    {
      id: 'step3',
      street: 'turn',
      board: ['Q♦', 'J♦', '3♣', '5♦'],
      pot: '39BB',
      heroStack: '82BB',
      narrative: 'Pierre appelle. Turn 5♦, LE FLUSH DIAMANTS EST ARRIVÉ ! Tu as le NUT FLUSH. Pierre check.',
      question: 'Turn 5♦, NUT FLUSH ! Pierre check. Comment extraire le maximum ?',
      options: [
        { label: 'Check, slowplay pour piéger', isOptimal: false, feedback: 'Slowplay avec le nut flush OOP sur un board à draws est risqué. Pierre peut changer de plan et bluffer river, ou pire, river une main qui te bat. Value-bet systématiquement avec la main la plus forte.' },
        { label: 'Bet 20BB (51% pot)', isOptimal: true, feedback: 'Excellent ! Value-bet avec le nut flush. Pierre avec Q-X, J-X, ou une autre paire va appeler. Tu construis le pot pour un overbet river ou all-in final. Extraire sur 2 streets avec le nuts est le plan optimal.' },
        { label: 'Bet 39BB (pot entier)', isOptimal: false, feedback: 'Pot bet peut faire folder Pierre s\'il a une main moyenne. 50% pot extrait mieux de sa range globale en le gardant dans le pot.' },
        { label: 'All-in 82BB (2x pot)', isOptimal: false, feedback: 'Overbet turn avec le nuts peut marcher mais est trop isolant. Pierre fold avec ses mains moyennes. Construis le pot avec un bet standard.' },
      ],
      lessonHint: 'Avec le nut flush, value-bet systématiquement. Le slowplay coûte de la valeur.',
    },
    {
      id: 'step4',
      street: 'river',
      board: ['Q♦', 'J♦', '3♣', '5♦', '9♠'],
      pot: '79BB',
      heroStack: '62BB',
      narrative: 'Pierre appelle! River 9♠ (carte neutre). Pierre check.',
      question: 'River 9♠. Pierre check. Tu as le nut flush, 62BB derrière dans un pot de 79BB. Que fais-tu ?',
      options: [
        { label: 'Check derrière, pot déjà énorme', isOptimal: false, feedback: 'Jamais. Tu as le nut flush et Pierre a callé 2 streets. Il a quelque chose. Un bet river avec la main la plus forte est obligatoire.' },
        { label: 'Bet 35BB (44% pot)', isOptimal: false, feedback: 'Trop petit. Pierre a callé deux streets, il peut payer un overbet. Extrais le maximum avec le nut flush.' },
        { label: 'All-in 62BB (79% pot)', isOptimal: true, feedback: 'Parfait. All-in river avec le nut flush dans un gros pot. Pierre avec Q-X ou J-X ne peut pas facilement folder. Tu extrais le maximum avec la main la plus forte possible sur ce board.' },
        { label: 'Bet 20BB (25% pot), thin value', isOptimal: false, feedback: 'Trop timide. Pierre a callé toute la main, il paie un bet plus gros. L\'all-in maximise la valeur du nut flush.' },
      ],
      lessonHint: 'Avec le nut flush et un adversaire qui a callé toute la main, all-in river est le move optimal.',
    },
  ],
  lesson: 'Le check-raise semi-bluff OOP avec le nut flush draw est une ligne avancée puissante. Tu combines fold equity (le check-raise force Pierre à se demander s\'il est devant), equity réelle (9 outs), et prise de contrôle OOP. Quand le flush arrive : value-bet maximal.',
  xp: 160,
};

const ADV_MAIN_03: HandScript = {
  id: 'adv-main-03',
  level: 'avance',
  title: 'Exploiter le joueur trop tight',
  concept: 'Identifier un nit et abuser de ses tendances avec des c-bets et des barrells ciblés',
  villain: {
    name: 'René le Nit',
    emoji: '🦔',
    style: 'Nit ultra-serré',
    vpip: 11,
    pfr: 9,
    description: 'Joue seulement les meilleures mains. Fold à 95% face aux c-bets sans top pair+.',
    tendency: 'Ses défenses de BB sont quasi-premium. S\'il appelle un c-bet, il a quelque chose. S\'il raise, il a le top.',
  },
  setup: {
    heroHand: ['A♠', 'K♣'],
    position: 'CO (Cutoff)',
    blinds: '2€/5€',
    effectiveStack: '100BB (500€)',
    gameType: 'cash',
  },
  steps: [
    {
      id: 'step1',
      street: 'preflop',
      board: [],
      pot: '7BB',
      heroStack: '97BB',
      narrative: 'Tu open CO à 3BB avec A♠K♣. René défend BB. Note : René est VPIP 11, PFR 9.',
      question: 'René le nit défend BB face à ton open CO. Comment tu te positionnes mentalement ?',
      options: [
        { label: 'Fold, René a probablement mieux que AK', isOptimal: false, feedback: 'René défend BB avec ~15% de sa range. Contre un open CO, il défend QQ+, AK, peut-être JJ et AQ. AKo domine beaucoup de sa range défensive.' },
        { label: 'Open normal, c\'est l\'action standard', isOptimal: true, feedback: 'Correct. Open 3BB CO avec AKo est parfaitement standard. L\'information clé est que René est un nit (VPIP 11), ça va changer ta stratégie post-flop : tu peux c-bet plus souvent car sa range défensive est étroite et il fold beaucoup.' },
        { label: '4-bet bluff, René ne peut pas défendre', isOptimal: false, feedback: 'Il n\'y a pas eu de 3-bet. Tu ouvres simplement la pot avec un raise standard.' },
        { label: 'Limp pour minimiser le risque', isOptimal: false, feedback: 'On ne limp jamais en CO avec AKo. Open raise systématiquement pour prendre l\'initiative.' },
      ],
      lessonHint: 'Connaître le style de ton adversaire AVANT le flop change ta stratégie post-flop.',
    },
    {
      id: 'step2',
      street: 'flop',
      board: ['7♦', '5♣', '2♥'],
      pot: '7BB',
      heroStack: '97BB',
      narrative: 'Flop 7♦-5♣-2♥ (board bas, sec). Tu as AK, deux overcards, aucune paire. René check.',
      question: '7-5-2 arc-en-ciel. Tu as AK (deux overcards). René (nit) check. Que fais-tu ?',
      options: [
        { label: 'Check derrière, tu n\'as rien', isOptimal: false, feedback: 'Erreur d\'abandon. René est un nit qui défend BB avec une range premium. Mais même QQ-JJ sur 7-5-2 peut check-fold face à un c-bet. Ta range de CO représente beaucoup de mains sur ce board. C-bet pour exploiter son fold to c-bet de 95%.' },
        { label: 'C-bet 4BB (57% pot)', isOptimal: true, feedback: 'Exactement le bon move. René fold 95% des c-bets sans top pair. Sur 7-5-2, il a rarement une paire. Même QQ-JJ vont souvent fold face à ton c-bet qui représente 77, 55, 22 (sets) ou 7X. Tu gagnes le pot immédiatement 80%+ du temps.' },
        { label: 'C-bet 7BB (pot entier)', isOptimal: false, feedback: 'Pot bet c\'est trop gros contre un nit sur un board bas. 50-60% obtient la même fold equity (95% = il fold presque toujours) pour moitié prix.' },
        { label: 'All-in 97BB, représente le set', isOptimal: false, feedback: 'Overbet all-in est inutile quand un simple c-bet fait folder René 95% du temps. Tu dépenses beaucoup plus que nécessaire.' },
      ],
      lessonHint: 'Contre un nit, c-bet systématiquement sur les boards bas. Il fold avec QQ-JJ sur 7-5-2.',
    },
    {
      id: 'step3',
      street: 'turn',
      board: ['7♦', '5♣', '2♥', 'J♠'],
      pot: '15BB',
      heroStack: '93BB',
      narrative: 'René appelle ! Il a quelque chose (avec son VPIP 11, s\'il défend ET appelle, c\'est sérieux). Turn J♠. René check.',
      question: 'René a callé le flop ET check le turn. Il a probablement JJ-TT, 77, 55, 22. Que fais-tu ?',
      options: [
        { label: 'C-bet second barrel 8BB (53% pot)', isOptimal: false, feedback: 'Attention. René est un nit qui a appelé le flop sur 7-5-2. Avec son VPIP de 11, si il appelle un c-bet sur ce board, il a quelque chose de très fort (77, 55, 22, JJ, TT). Double barrel contre un nit qui a montré de la résistance est une erreur.' },
        { label: 'Check derrière, stop le bluff', isOptimal: true, feedback: 'Correct ! René nit a appelé ton c-bet sur 7-5-2. Sa range est maintenant très narrow : 77, 55, 22, JJ, TT, peut-être 65s. Continuer à bluffer contre ce range est -EV. Check derrière, contrôle le pot et vois la river.' },
        { label: 'All-in 93BB, force un fold impossible', isOptimal: false, feedback: 'René avec 77, 55, 22 (set) ne fold jamais face à un all-in. Tu brûles tes chips contre une main qui te bat.' },
        { label: 'Bet 3BB (20% pot), very small bet', isOptimal: false, feedback: 'Un micro-bet face à un nit qui a appelé donne un prix excellent pour continuer avec son set. Si tu bluffes, bet assez pour avoir de la fold equity (René n\'en a presque pas de toute façon).' },
      ],
      lessonHint: 'Un nit qui appelle un c-bet a une vraie main. Savoir stopper un bluff face à la résistance est crucial.',
    },
    {
      id: 'step4',
      street: 'river',
      board: ['7♦', '5♣', '2♥', 'J♠', 'A♦'],
      pot: '15BB',
      heroStack: '93BB',
      narrative: 'Tu as checké le turn. River A♦, AS ! Tu as maintenant top pair avec AK sur 7-5-2-J-A. René check.',
      question: 'River A♦, tu as TPTK (pair d\'As avec K kicker). René check. Quelle décision ?',
      options: [
        { label: 'Check derrière, René a un set, A ne t\'aide pas', isOptimal: false, feedback: 'Si René a 77/55/22 (set), il a un full house avec l\'As sur le board, ce qui te bat quand même. Mais si il a JJ-TT, tu les bats maintenant avec ta paire d\'As. Et René peut avoir A-X qui paie ton bet.' },
        { label: 'Bet 10BB (67% pot), value avec l\'As', isOptimal: true, feedback: 'Correct ! Tu as spiké le top pair sur la river. René avec JJ, TT, AQ (qui a callé le flop sur l\'espoir) va payer. Oui, les sets te battent encore, mais ils représentent seulement 6 combos. Sa range globale perd face à ta paire d\'As.' },
        { label: 'Bet all-in 93BB, l\'As change tout', isOptimal: false, feedback: 'All-in avec une paire d\'As contre un nit qui a callé 2 fois est trop agressif. René ne fold pas ses sets. Un bet de 65-70% pot extrait la valeur des TT-JJ et AQ sans overbetter.' },
        { label: 'Check-raise s\'il bet', isOptimal: false, feedback: 'Il a checké. Bet pour la valeur, ne lui donne pas la possibilité de checker derrière avec ses mains moyennes.' },
      ],
      lessonHint: 'Spiker le top pair sur la river après avoir contrôlé le pot transforme un bluff raté en value-bet profitable.',
    },
  ],
  lesson: 'Exploiter un nit requiert de la nuance : c-bet systématiquement sur les boards bas (il fold 95%), mais arrêter immédiatement quand il montre de la résistance (il a quelque chose). Quand le board t\'aide enfin (As sur la river), reprends la main offensive.',
  xp: 160,
};

const EXP_MAIN_02: HandScript = {
  id: 'exp-main-02',
  level: 'expert',
  title: 'Le 4-bet bluff avec A5s',
  concept: 'Utiliser les blockers pour 4-bet bluffer au bon moment avec la bonne main',
  villain: {
    name: 'Christine la Reg',
    emoji: '📈',
    style: 'Régulière NL200',
    vpip: 26,
    pfr: 22,
    description: '3-bet range : QQ+, AK + quelques bluffs (A5s, A4s, K5s). Fold to 4-bet : 55%.',
    tendency: 'Sa range de 3-bet value est dense en Ax. Si tu as A dans ta main, tu bloques AA et AK, réduisant ses combos de call à un 4-bet.',
  },
  setup: {
    heroHand: ['A♠', '5♠'],
    position: 'BTN (Bouton)',
    blinds: '5€/10€',
    effectiveStack: '100BB (1000€)',
    gameType: 'cash',
  },
  steps: [
    {
      id: 'step1',
      street: 'preflop',
      board: [],
      pot: '15BB',
      heroStack: '97BB',
      narrative: 'Tu open BTN à 3BB. Christine 3-bet BB à 11BB. Tu as A♠5♠.',
      question: 'Christine 3-bet BB. Tu as A5s BTN. Fold, call, ou 4-bet bluff ?',
      options: [
        { label: 'Fold, A5s ne vaut pas grand chose face à un 3-bet', isOptimal: false, feedback: 'Folder est une option mais tu rates l\'opportunité d\'un excellent 4-bet bluff. A5s a toutes les propriétés du bluff parfait : A bloque AA et AK, 5 ne bloque pas sa range de value, et suited offre de l\'equity si callé.' },
        { label: 'Call le 3-bet, jouer post-flop en position', isOptimal: false, feedback: 'Call possible mais sous-optimal. A5s OOP vs call = main difficile à jouer. Le 4-bet bluff extrait plus de valeur en exploitant son fold to 4-bet (55%).' },
        { label: '4-bet bluff à 26BB', isOptimal: true, feedback: 'Move d\'expert. A5s est la main idéale pour 4-bet bluffer : 1) A♠ bloque AA (6 → 3 combos) et AK (16 → 8 combos), réduisant les mains qui callent ton 4-bet, 2) 5 ne bloque pas son range de value (QQ, KK), 3) suited = equity si callé sur les bons boards. Christine fold 55% → EV positif immédiat.' },
        { label: '4-bet all-in 100BB', isOptimal: false, feedback: 'All-in force Christine à call uniquement avec AA (qu\'elle a rarement avec ton A blocker). 26BB obtient le même fold equity pour beaucoup moins de risque. Si elle call le 4-bet, tu joues post-flop avec position et equity.' },
      ],
      lessonHint: 'Les meilleurs 4-bet bluffs ont un A (bloque AA et AK) et ne bloquent pas la range de value adverse.',
    },
    {
      id: 'step2',
      street: 'flop',
      board: ['A♣', '7♦', '2♠'],
      pot: '53BB',
      heroStack: '71BB',
      narrative: 'Christine appelle le 4-bet ! Flop A♣-7♦-2♠. Tu as A♠5♠ : PAIRE D\'AS ! Christine check.',
      question: 'A-7-2 sec, tu as A5 (paire d\'As avec 5 kicker). Christine check. Que fais-tu ?',
      options: [
        { label: 'Check derrière, tu avais bluffé, maintenant c\'est compliqué', isOptimal: false, feedback: 'Tu es passé de 4-bet bluff à value bet ! Tu as top pair sur A-7-2. Christine avec KK ou QQ (mains qu\'elle call un 4-bet avec) n\'a pas amélioré. C-bet pour la valeur.' },
        { label: 'C-bet 25BB (47% pot)', isOptimal: true, feedback: 'Parfait. Tu te retrouves avec top pair après un 4-bet bluff, c\'est le meilleur cas. Christine avec KK ou QQ va appeler (elle a une main forte). Tu représentes AK, AQ, AA, mains cohérentes avec ton 4-bet. C-bet standard.' },
        { label: 'All-in 71BB (pot entier+)', isOptimal: false, feedback: 'All-in flop avec top pair faible kicker (5) peut te mettre en difficulté si Christine a AK ou AQ. Extrait graduellement avec des bets sizing de 45-55% pot.' },
        { label: 'Bet 53BB (pot entier)', isOptimal: false, feedback: 'Pot bet trop gros. Christine fold KK face à un pot bet sur A-7-2 (elle met à ta range AK, AA). 45-50% extrait mieux de ses KK, QQ.' },
      ],
      lessonHint: 'Quand un bluff préflop devient valeur post-flop, ajuste ton plan et value-bet systématiquement.',
    },
    {
      id: 'step3',
      street: 'turn',
      board: ['A♣', '7♦', '2♠', '5♣'],
      pot: '103BB',
      heroStack: '46BB',
      narrative: 'Christine appelle. Turn 5♣, DEUX PAIRES ! (As + 5). Christine check.',
      question: 'Turn 5♣, tu as DEUX PAIRES (A5). Christine check. Extraire le maximum ?',
      options: [
        { label: 'Check, pot control avec deux paires', isOptimal: false, feedback: 'Pas de pot control avec deux paires face à Christine. Elle a KK ou QQ, elle paie. Value-bet pour extraire le maximum de ses overpairs.' },
        { label: 'Bet 30BB (29% du stack), thin value', isOptimal: false, feedback: 'Trop petit. Christine avec KK paiera facilement. Avec 46BB derrière dans un pot de 103BB, va chercher son stack entier.' },
        { label: 'All-in 46BB (45% pot)', isOptimal: true, feedback: 'Parfait. All-in turn avec deux paires est le move optimal. Christine avec KK ou QQ est dans une position de call difficile mais probable. Tu as deux paires, elle a une overpair. Elle paie souvent un all-in "raisonnable" de 45% pot.' },
        { label: 'Check-raise si elle bet', isOptimal: false, feedback: 'Elle a checké. Ne lui donne pas la chance de checker derrière. Bet tes chips directement, tu as deux paires, c\'est une main de value.' },
      ],
      lessonHint: 'Quand tu touches deux paires et que peu de chips restent, all-in est presque toujours optimal.',
    },
    {
      id: 'step4',
      street: 'river',
      board: ['A♣', '7♦', '2♠', '5♣', 'K♦'],
      pot: '145BB',
      heroStack: '0BB',
      narrative: '(Analyse post-main) Christine call l\'all-in et reveal K♦K♥. River K♦ : elle touche un set de Kings ! Tu perds avec deux paires. Était-ce une erreur ?',
      question: 'Christine avait KK et a touché le set au river. Était-ce une erreur de jouer ainsi ?',
      options: [
        { label: 'Oui, j\'aurais dû folder le turn face à son check-call', isOptimal: false, feedback: 'Non. Son check-call au flop et au turn est parfaitement logique avec KK. Tu ne pouvais pas prédire qu\'elle toucherait un set au river (probabilité ~4%). Ta ligne était correcte à chaque décision.' },
        { label: 'Non, chaque décision était +EV malgré le résultat', isOptimal: true, feedback: 'Exactement. La qualité des décisions se mesure à l\'EV au moment de la prise de décision, pas au résultat. 4-bet bluff avec A5s (correct), c-bet top pair (correct), all-in turn deux paires vs overpair (correct). Le river K est de la variance pure, tu avais +EV à chaque étape.' },
        { label: 'Peut-être, le 4-bet bluff initial était risqué', isOptimal: false, feedback: 'Le 4-bet bluff avec A5s est une ligne standard et profitable à ce niveau. Elle fold 55% du temps = EV positive. Et quand elle call, tu joues post-flop en position avec une main qui peut améliorer, comme ce qui s\'est passé.' },
      ],
      lessonHint: 'Au poker, l\'EV se mesure au moment de la décision, pas à partir du résultat. Variance et qualité de décision sont deux choses séparées.',
    },
  ],
  lesson: 'Le 4-bet bluff avec A5s illustre parfaitement l\'usage des blockers : A réduit les combos de AA et AK adverses, rendant le bluff plus profitable. Quand la main s\'est transformée en top pair puis deux paires, la ligne exploitative est devenue value. Le résultat (set de rois au river) n\'invalide pas la qualité des décisions.',
  xp: 175,
};

const EXP_MAIN_03: HandScript = {
  id: 'exp-main-03',
  level: 'expert',
  title: 'Le blocking bet OOP : contrôler la river',
  concept: 'Utiliser un petit bet river pour contrôler la taille du pot contre un adversaire agressif',
  villain: {
    name: 'Antoine le Bluffeur',
    emoji: '🎭',
    style: 'LAG bluffeur',
    vpip: 32,
    pfr: 28,
    description: 'Joue large et agressif. Bluff river fréquemment, surtout face aux checks OOP.',
    tendency: 'Quand tu check OOP river, il bet ~80% du temps avec des sizings de 70-100% pot pour extraire de la valeur ou bluffer.',
  },
  setup: {
    heroHand: ['K♦', 'Q♦'],
    position: 'BB (Big Blind)',
    blinds: '2€/5€',
    effectiveStack: '100BB (500€)',
    gameType: 'cash',
  },
  steps: [
    {
      id: 'step1',
      street: 'preflop',
      board: [],
      pot: '7BB',
      heroStack: '98BB',
      narrative: 'Antoine open 3BB BTN. SB fold. Tu as K♦Q♦ en BB.',
      question: 'Antoine open BTN. Tu as KQs en BB. Défendre ou 3-bet ?',
      options: [
        { label: 'Fold, KQ OOP c\'est dur', isOptimal: false, feedback: 'KQs est trop fort pour folder vs un BTN open large. Tu as une main premium qui peut toucher top pair ou flush draw.' },
        { label: 'Call, jouer en position défavorable', isOptimal: true, feedback: 'Correct. Call en BB avec KQs. Tu peux 3-better aussi, mais call garde plus de mains d\'Antoine dans le pot et est plus simple OOP. KQs a assez d\'equity pour défendre.' },
        { label: '3-bet à 10BB', isOptimal: false, feedback: 'Viable mais KQs joue bien en call. Si tu 3-bet et il call, tu es OOP dans un gros pot avec une main de valeur mais pas premium.' },
        { label: '3-bet all-in', isOptimal: false, feedback: 'KQs ne justifie pas un shove préflop contre un BTN open standard.' },
      ],
      lessonHint: 'KQs en BB vs BTN open : call ou 3-bet, les deux sont profitables. Le call est plus conservateur.',
    },
    {
      id: 'step2',
      street: 'flop',
      board: ['K♠', '8♦', '4♣'],
      pot: '7BB',
      heroStack: '98BB',
      narrative: 'Flop K♠-8♦-4♣. TOP PAIR ! Antoine c-bet 4BB (57% pot).',
      question: 'K-8-4 sec. Tu as KQ (top pair, Q kicker). Antoine c-bet. Que fais-tu ?',
      options: [
        { label: 'Fold, il représente une main forte', isOptimal: false, feedback: 'Folder top pair face à un c-bet standard sur un board sec ? Jamais. Tu as TPTK (enfin, top pair avec Q kicker). Call au minimum.' },
        { label: 'Call, jouer le pot contrôlé', isOptimal: false, feedback: 'Call est acceptable mais passif. Avec top pair vs un LAG, le check-raise peut extraire plus de valeur et prendre le contrôle.' },
        { label: 'Check-raise à 16BB', isOptimal: true, feedback: 'Excellent. Check-raise OOP avec top pair contre un LAG : 1) tu extrais la valeur de sa range de c-bet large (il bet avec 8X, gutshots, overcards), 2) tu prends le contrôle de la main, 3) tu te protèges contre ses bluffs futurs en augmentant le pot sur tes termes.' },
        { label: 'Check-raise all-in', isOptimal: false, feedback: 'All-in flop avec top pair sur un pot de 7BB + 4BB = 11BB... tu aurais 100BB dans le pot. Trop engageant avec seulement top pair.' },
      ],
      lessonHint: 'OOP contre un LAG : le check-raise prend le contrôle là où le call vous expose aux bluffs futurs.',
    },
    {
      id: 'step3',
      street: 'turn',
      board: ['K♠', '8♦', '4♣', 'Q♠'],
      pot: '39BB',
      heroStack: '82BB',
      narrative: 'Antoine appelle. Turn Q♠, DEUX PAIRES ! (Kings + Queens). Antoine check.',
      question: 'Turn Q, deux paires. Antoine check. Extraire ou contrôler ?',
      options: [
        { label: 'Check derrière, tu as deux paires, le pot est déjà gros', isOptimal: false, feedback: 'Mauvais pot control. Antoine check peut signifier qu\'il a une main moyenne (8X, 4X, un gutshot) et tu rates de la valeur. Avec deux paires, bet pour extraire.' },
        { label: 'Bet 20BB (51% pot)', isOptimal: true, feedback: 'Parfait. Second barrel de value. Antoine avec 8-X, K-X, ou un draw va appeler. Tu construis le pot pour une décision river importante. Note : Q♠ amène aussi un flush draw pique, bet protège aussi contre ça.' },
        { label: 'Bet 39BB (pot entier)', isOptimal: false, feedback: 'Pot bet peut faire folder des mains médiocres qui t\'auraient payé. 50% extrait mieux.' },
        { label: 'All-in 82BB', isOptimal: false, feedback: 'Overbet turn avec deux paires, possible si Antoine a une main forte aussi (K8, KQ, sets), mais trop violent pour extraire le maximum de sa range globale.' },
      ],
      lessonHint: 'Deux paires = value systématique. 50% pot turn est le sizing standard.',
    },
    {
      id: 'step4',
      street: 'river',
      board: ['K♠', '8♦', '4♣', 'Q♠', '2♦'],
      pot: '79BB',
      heroStack: '62BB',
      narrative: 'Antoine appelle. River 2♦ (neutre). Tu es OOP avec deux paires. Antoine (bluffeur) est en position, si tu check, il va probablement bet 60-80% pot.',
      question: 'River 2♦. Tu es OOP avec deux paires. Antoine bet s\'il voit un check. Stratégie ?',
      options: [
        { label: 'Check, le piège, il bluff et tu check-raise', isOptimal: false, feedback: 'Risqué. Antoine peut bluffer mais aussi value-better KJ, K9 qui te bat. S\'il bluff et tu call, même résultat qu\'un blocking bet. S\'il value et tu call, tu perds autant. Le check-raise rate si il check derrière ou bet pour valeur.' },
        { label: 'Bet 25BB (32% pot), blocking bet', isOptimal: true, feedback: 'Excellent blocking bet ! En bettant petit river OOP, tu : 1) empêches Antoine de faire un gros bluff de 60BB (il raise ou call tes 25BB), 2) extrais de la valeur des mains moyennes (8X, 4X) qui callent 25BB, 3) définis ta main comme valeur, pas peur. C\'est l\'usage parfait du blocking bet.' },
        { label: 'Bet all-in 62BB (79% pot)', isOptimal: false, feedback: 'All-in river OOP avec deux paires contre un LAG est risqué. S\'il a K8, KQ, ou un set, il call. Le blocking bet extrait mieux de sa range globale et limite tes pertes si tu es battu.' },
        { label: 'Bet 40BB (51% pot)', isOptimal: false, feedback: 'Sizing trop gros pour un blocking bet. 30-35% pot est la zone optimale : assez pour induire des calls de mains médiocres, pas assez pour les mettre all-in sur ses mains fortes.' },
      ],
      lessonHint: 'Le blocking bet OOP empêche les gros bluffs adverses et extrait de la valeur des mains médiocres.',
    },
  ],
  lesson: 'Le blocking bet river OOP est un outil avancé crucial contre les LAG. Au lieu de checker et subir un gros bluff (ou gros value), tu prends le contrôle avec un petit bet qui : 1) force Antoine à définir sa main, 2) extrait de la valeur mince, 3) protège contre les bluffs de 60%+ pot.',
  xp: 175,
};

const PRO_MAIN_02: HandScript = {
  id: 'pro-main-02',
  level: 'professionnel',
  title: 'GTO vs Exploit : savoir quand dévier',
  concept: 'Identifier les leaks adverses et dévier de la stratégie équilibrée pour maximiser l\'EV',
  villain: {
    name: 'Elena la Sur-foldante',
    emoji: '🕊️',
    style: 'Régulière qui fold trop',
    vpip: 24,
    pfr: 20,
    description: 'Joue solide mais a un leak : elle fold trop face aux overbets et aux triple barrells. Son fold to river bet est de 68% (GTO serait ~40%).',
    tendency: 'Fold to flop c-bet : 55%. Fold to turn barrel : 60%. Fold to river bet : 68%. Exploite avec des tailles de mises plus grandes que GTO.',
  },
  setup: {
    heroHand: ['J♦', 'T♦'],
    position: 'BTN (Bouton)',
    blinds: '5€/10€',
    effectiveStack: '100BB (1000€)',
    gameType: 'cash',
  },
  steps: [
    {
      id: 'step1',
      street: 'preflop',
      board: [],
      pot: '7BB',
      heroStack: '97BB',
      narrative: 'Tu open BTN à 3BB avec J♦T♦. Elena défend BB. Note : Elena fold trop face aux mises.',
      question: 'Elena défend BB. Tu as JTs BTN. Comment open et quelle stratégie post-flop prévoir ?',
      options: [
        { label: 'Open 2BB, minimise le risque', isOptimal: false, feedback: 'Sizing sous-optimal. 3BB est le standard. Et avec Elena qui fold trop, tu peux même ouvrir légèrement plus large que la GTO car tu exploites son fold equity élevée.' },
        { label: 'Open 3BB standard, puis jouer GTO post-flop', isOptimal: false, feedback: 'Open correct, mais la stratégie post-flop est sous-optimale. Contre Elena qui fold trop face aux mises, tu dois exploiter ce leak avec des bet sizings plus grands que GTO (pas moins).' },
        { label: 'Open 3BB, puis exploiter avec des gros sizings', isOptimal: true, feedback: 'Parfait. Open standard + plan d\'exploitation. Elena fold 68% face aux river bets (GTO = 40%). Ton avantage : bet plus souvent et plus grand que GTO, particulièrement en triple barrel. Chaque bet génère plus de folds que la norme.' },
        { label: 'Limp BTN, jouer sous le radar', isOptimal: false, feedback: 'On ne limp jamais au BTN. Open raise pour prendre l\'initiative.' },
      ],
      lessonHint: 'La connaissance des stats adverses permet de construire une stratégie exploitative avant même le flop.',
    },
    {
      id: 'step2',
      street: 'flop',
      board: ['Q♦', '9♠', '4♦'],
      pot: '7BB',
      heroStack: '97BB',
      narrative: 'Flop Q♦-9♠-4♦. Tu as J♦T♦ : OPEN-ENDED STRAIGHT DRAW + flush draw diamants ! Elena check.',
      question: 'Q♦-9♠-4♦. Tu as JT♦ : 15 outs (open-ender + flush draw). Elena check. Que fais-tu ?',
      options: [
        { label: 'Check derrière, trop tôt', isOptimal: false, feedback: 'Tu as 15 outs combinés (flush + open-ender) = environ 54% d\'equity sur 2 cartes. De plus, Elena fold 55% face aux c-bets. C-bet s\'impose.' },
        { label: 'C-bet 3BB (43% pot), sizing GTO standard', isOptimal: false, feedback: 'Acceptable mais sous-optimal contre Elena. Son fold to c-bet (55%) est proche de la GTO mais tu peux bet légèrement plus grand pour extraire plus quand elle folde avec ses mains marginales.' },
        { label: 'C-bet 5BB (71% pot), exploit sizing', isOptimal: true, feedback: 'Excellent sizing d\'exploitation. Légèrement au-dessus du GTO standard (40-50%) car Elena fold 55%. Elle fold maintenant QJ, QT, Q8, 9X, 4X, mains qu\'elle aurait callées un bet plus petit. Tu gagnes le pot plus souvent avec tes 54% d\'equity.' },
        { label: 'All-in 97BB, pression maximale', isOptimal: false, feedback: 'All-in flop est trop violent. Elena peut call avec QX qui te donne 54% d\'equity... attend, 54% tu es favori ! Mais tu construis mieux le pot avec un bet sizing calibré.' },
      ],
      lessonHint: 'Contre un joueur qui fold trop, augmenter légèrement le sizing de tes bluffs et semi-bluffs est plus profitable que le GTO.',
    },
    {
      id: 'step3',
      street: 'turn',
      board: ['Q♦', '9♠', '4♦', 'K♣'],
      pot: '17BB',
      heroStack: '92BB',
      narrative: 'Elena appelle. Turn K♣ (neutre pour toi, toujours 9 outs flush + 8 outs straight = 17 outs). Elena check.',
      question: 'Turn K (neutre). Tu as toujours 17 outs. Elena fold 60% face aux turn barrels. Que fais-tu ?',
      options: [
        { label: 'Check, trop de chips investis pour bluffer', isOptimal: false, feedback: 'Elena fold 60% face aux turn barrels, c\'est massif. Avec 17 outs, tu as ~36% d\'equity si callée. Bet+fold equity = continuer est +EV, arrêter est -EV.' },
        { label: 'Bet 8BB (47% pot), GTO sizing', isOptimal: false, feedback: 'Acceptable. Mais Elena fold 60% vs turn barrels (GTO = ~45%). Exploite avec un sizing légèrement plus grand pour générer plus de folds.' },
        { label: 'Bet 12BB (71% pot), exploit sizing', isOptimal: true, feedback: 'Sizing d\'exploitation optimal. Elena fold 60% = elle abandonne des mains comme Q9 type de flop-call. Tes 17 outs sur la river (si elle call) = 36% equity. L\'EV de ce barrel est très positive grâce à la combinaison fold equity + equity.' },
        { label: 'All-in 92BB (5.4x pot)', isOptimal: false, feedback: 'Overbet all-in obtient certes beaucoup de folds mais les mains qu\'Elena garde (QQ, 99, KK) dominent ta range actuelle. Sizing calibré est plus profitable.' },
      ],
      lessonHint: 'Quand un adversaire fold trop face aux barrels, augmenter le sizing génère plus de folds par dollar misé.',
    },
    {
      id: 'step4',
      street: 'river',
      board: ['Q♦', '9♠', '4♦', 'K♣', '2♦'],
      pot: '41BB',
      heroStack: '80BB',
      narrative: 'Elena appelle. River 2♦, le FLUSH DIAMANTS EST ARRIVÉ ! Tu as J♦T♦ = flush. Elena check.',
      question: 'River 2♦, NUT FLUSH. Elena fold 68% face aux river bets. Quel sizing ?',
      options: [
        { label: 'Bet 20BB (49% pot), GTO standard', isOptimal: false, feedback: 'Trop petit. Elena fold 68% face à n\'importe quel bet river. Et tu as le NUT FLUSH, tu veux extraire le maximum des 32% qui callent. Overbet pour exploiter les deux dimensions.' },
        { label: 'Bet 41BB (100% pot)', isOptimal: false, feedback: 'Bon sizing mais pas optimal contre Elena. Elle fold 68% des mains face à un pot bet. Un overbet de 120-150% extrait plus des 32% qui callent tout en maintenant la même fold equity.' },
        { label: 'Overbet 65BB (159% pot), exploit maximal', isOptimal: true, feedback: 'Le sizing optimal contre Elena. Raisonnement : elle fold 68% de toute façon → l\'overbet ne change pas beaucoup sa fold frequency. Mais les 32% qui callent paient 65BB au lieu de 41BB. EV total = 68% × 41BB gagnés + 32% × (41BB + 65BB) gagnés. L\'overbet maximise l\'EV contre quelqu\'un qui fold trop.' },
        { label: 'Check, induire son bluff', isOptimal: false, feedback: 'Elena a montré qu\'elle check-fold souvent. Checker lui donne une chance de checker derrière avec une main qu\'elle aurait payée un bet. Avec le nut flush, bet toujours.' },
      ],
      lessonHint: 'Contre un adversaire qui fold trop, overbet river pour extraire plus des rares fois qu\'il call. La fold frequency ne change pas beaucoup mais les gains quand il call augmentent.',
    },
  ],
  lesson: 'La déviation GTO → exploit est une compétence pro. Contre Elena (fold trop), la stratégie optimale est : gros bet partout pour générer des folds fréquents + overbet river avec le nuts pour extraire des rares calls. L\'EV total dépasse de loin le jeu GTO standard.',
  xp: 190,
};

const PRO_MAIN_03: HandScript = {
  id: 'pro-main-03',
  level: 'professionnel',
  title: 'Hand reading avancé et fold difficile',
  concept: 'Utiliser le hand reading pour identifier une range adverse et prendre une décision de fold contre-intuitive',
  villain: {
    name: 'Luca le GTO avancé',
    emoji: '🤖',
    style: 'Régulier high stakes',
    vpip: 27,
    pfr: 23,
    description: 'Joue proche du GTO mais avec des deviations exploitatives ciblées. Range très bien construite.',
    tendency: 'Ne check-raise pas sans une main de la top 15% de sa range. Ses check-raises en IP sont presque jamais des bluffs purs, toujours au moins equity + valeur.',
  },
  setup: {
    heroHand: ['A♠', 'Q♦'],
    position: 'CO (Cutoff)',
    blinds: '5€/10€',
    effectiveStack: '100BB (1000€)',
    gameType: 'cash',
  },
  steps: [
    {
      id: 'step1',
      street: 'preflop',
      board: [],
      pot: '7BB',
      heroStack: '97BB',
      narrative: 'Tu open CO à 3BB avec A♠Q♦. Luca défend BTN. Pot 7BB.',
      question: 'Luca défend BTN. Tu as AQo au CO. Quelle est ta stratégie post-flop ?',
      options: [
        { label: 'Jouer GTO : c-bet 40% pot systématiquement', isOptimal: false, feedback: 'GTO c-bet frequency varie selon le board. AQo CO : c-bet les boards qui favorisent ta range CO (boards hauts), check les boards bas où Luca BTN a range advantage.' },
        { label: 'Jouer exploitatif : c-bet toujours pour profiter de son image', isOptimal: false, feedback: 'C-bet systématique est sous-optimal. Les bons joueurs como Luca exploitent les joueurs qui c-bet trop souvent (en check-raise bluffant plus). Calibre ta c-bet frequency selon le board.' },
        { label: 'Open standard, puis lire le board pour décider', isOptimal: true, feedback: 'Bonne approche. AQo CO : open 3BB, puis analyse le board pour décider : boards hauts (A, K) = c-bet fréquent (tu as l\'avantage de range) ; boards bas (7-8-2) = check plus souvent (BTN a de meilleures ranges basses).' },
        { label: 'C-bet uniquement quand tu touches', isOptimal: false, feedback: 'Trop passif et transparent. Ta range de c-bet doit inclure des bluffs pour être équilibrée. Ne c-bet que quand tu touches = devenir lisible.' },
      ],
      lessonHint: 'Le hand reading commence dès le préflop : imagine les ranges de l\'adversaire selon sa position et son action.',
    },
    {
      id: 'step2',
      street: 'flop',
      board: ['A♦', 'J♠', '7♣'],
      pot: '7BB',
      heroStack: '97BB',
      narrative: 'Flop A♦-J♠-7♣. TOP PAIR top kicker. Luca check.',
      question: 'A-J-7 : tu as AQ (TPTK). Tu as range advantage sur ce board. Luca check. C-bet ?',
      options: [
        { label: 'Check derrière, trap Luca', isOptimal: false, feedback: 'Mauvais slowplay. Sur A-J-7, ta range CO (AK, AQ, AJ, AA, KK) domines. Luca BTN a plus de JX, 7X dans sa range. Value-bet systématiquement avec ton avantage de range.' },
        { label: 'C-bet 3BB (43% pot)', isOptimal: true, feedback: 'Correct et standard. Sur A-J-7 avec range advantage, c-bet petit (40-45%) permet d\'inclure plus de bluffs dans ta range tout en extrayant de la valeur des JX, 7X, et AX de Luca.' },
        { label: 'C-bet 7BB (pot entier)', isOptimal: false, feedback: 'Pot bet sur A-J-7 réduit les combos que Luca peut call (il fold J9, J8, 7X faibles qui auraient payé 3BB). Small bet est plus rentable avec l\'avantage de range.' },
        { label: 'All-in 97BB', isOptimal: false, feedback: 'Overbet all-in flop avec TPTK n\'est jamais la bonne ligne. Construit le pot graduellement.' },
      ],
      lessonHint: 'Sur un board où tu as range advantage, c-bet avec un petit sizing pour inclure plus de bluffs et maximiser les calls.',
    },
    {
      id: 'step3',
      street: 'turn',
      board: ['A♦', 'J♠', '7♣', 'J♦'],
      pot: '13BB',
      heroStack: '94BB',
      narrative: 'Luca appelle. Turn J♦, le board paire ! (A-J-J-7). Luca check-raise ! Tu bettes 7BB, il raise à 22BB.',
      question: 'Turn J♦ board paire. Tu bettes 7BB. Luca check-raise à 22BB. Tu as AQ. Que fais-tu ?',
      options: [
        { label: 'Call, AQ est encore une bonne main sur A-J-J-7', isOptimal: false, feedback: 'Réfléchis à la range de Luca BTN qui check-raise le turn sur A-J-J-7 après avoir callé le flop A-J-7. Ses mains : AJ (full house !), 77 (full house), JX (trips !), A7s. Toutes ces mains te battent. AQ a seulement deux paires (AA+QQ... non, tu as A+Q). En fait AQ sur A-J-J board = paire d\'As avec Q kicker. Luca a presque toujours une main qui te domine ici.' },
        { label: 'Fold, le check-raise représente une main qui me bat', isOptimal: true, feedback: 'Correct et courageux. Range de Luca BTN après call flop A-J-7 ET check-raise turn J♦ : AJ (full house), A7s (full house), 77 (quads!), JT, J9, J8 (trips). Ton AQ a une paire d\'As, tu perds face à TOUTE cette range. Malgré TPTK, c\'est un fold correct. Le hand reading prime sur l\'attachement à ta main.' },
        { label: 'Re-raise all-in, il bluff peut-être', isOptimal: false, feedback: 'Luca a une tendance décrite comme "ne check-raise pas sans top 15% de sa range". Sur A-J-J-7, son check-raise est value-heavy. Re-raise serait un erreur massive.' },
      ],
      lessonHint: 'Le hand reading force parfois des folds difficiles avec des mains qui semblent fortes mais perdent face à la range adverse.',
    },
    {
      id: 'step4',
      street: 'river',
      board: ['A♦', 'J♠', '7♣', 'J♦', '4♣'],
      pot: '57BB',
      heroStack: '87BB',
      narrative: '(Tu as foldé le turn. Luca montre A♦J♥, FULL HOUSE ! Tu avais bien lu.) River hypothétique : si tu avais callé, river 4♣ arrive. Luca bet all-in 94BB.',
      question: 'Si tu avais callé le check-raise, river 4♣, Luca bet all-in. Que fais-tu avec AQ ?',
      options: [
        { label: 'Call, pot odds intéressants', isOptimal: false, feedback: 'Tu as paire d\'As avec Q kicker face à un all-in river sur A-J-J-7-4 contre quelqu\'un qui a check-raise le turn. Sa range = AJ, 77, JX. Tu perds face à tout ça. Le fold de turn était la bonne décision, ici tu confirmes seulement la perte.' },
        { label: 'Fold, confirme que le fold turn était correct', isOptimal: true, feedback: 'Exactement. Luca avait AJ (full house). Ton fold turn a économisé 87BB. Cet exercice confirme que le hand reading correct sauve une fortune. La valeur d\'un bon fold dépasse souvent la valeur d\'une bonne value-bet.' },
        { label: 'Je n\'aurais pas dû folder le turn', isOptimal: false, feedback: 'Si tu avais callé le turn (22BB), puis callé la river (94BB), tu aurais perdu 116BB supplémentaires. Le fold au turn était la décision qui a minimisé les pertes contre un full house.' },
      ],
      lessonHint: 'Un bon fold sauve autant qu\'une bonne value-bet. Le hand reading est la compétence qui différencie les bons joueurs des grands.',
    },
  ],
  lesson: 'Le hand reading avancé permet de prendre des folds difficiles avec des mains fortes. Sur A-J-J-7, Luca BTN check-raise le turn : sa range dominante est AJ, 77, JX, toutes supérieures à ta paire d\'As. Folder TPTK face à un check-raise cohérent est une compétence pro qui préserve le stack. Le résultat (AJ full house) confirme l\'analyse.',
  xp: 190,
};

// ─── DÉBUTANT mains 04-08 ─────────────────────────────────────────────────────

const DEB_MAIN_04: HandScript = {
  id: 'deb-main-04',
  level: 'debutant',
  title: 'Ne pas slowplay les Aces',
  concept: 'Raiser les Aces preflop, ne pas limper',
  villain: { name: 'Marcel le Fish', emoji: '🐟', style: 'Fish passif', vpip: 58, pfr: 8, description: 'Joue beaucoup de mains, appelle trop.', tendency: 'Il appelle facilement mais ne bluff jamais.' },
  setup: { heroHand: ['A♠', 'A♦'], position: 'UTG', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'preflop', board: [], pot: '3BB', heroStack: '100BB',
      narrative: 'Tu es UTG avec A♠-A♦. La meilleure main au poker.',
      question: 'UTG avec AA. Que fais-tu ?',
      options: [
        { label: 'Limper (call 2€)', isOptimal: false, feedback: 'ERREUR classique. Limper AA invite tout le monde à venir bon marché. Tu veux construire un pot avec la meilleure main. Si le board vient K-Q-J connecto, Marcel peut te battre avec JT payé 2€. Raiser protège ta main ET construit le pot.' },
        { label: 'Raise à 6BB (3x)', isOptimal: true, feedback: 'Parfait. Raise standard avec AA. Tu construis le pot, tu élimine les mains marginales, et tu arrives en tête-à-tête ou HU contre Marcel avec les cotes en ta faveur. Pas de triche, pas de slowplay, extraire de la valeur directement.' },
        { label: 'All-in direct', isOptimal: false, feedback: 'Trop fort, Marcel fold tout sauf AA-KK et tu ne gagnes que les blinds. Raise standard, puis continue à extraire street par street.' },
      ],
      lessonHint: 'Avec une main premium, construire le pot dès le preflop.',
    },
    {
      id: 'step2', street: 'flop', board: ['7♣', '3♦', '2♠'], pot: '13BB', heroStack: '97BB',
      narrative: 'Marcel call. Flop 7♣-3♦-2♠ rainbow. Board sec, AA toujours meilleure main.',
      question: 'Flop 7-3-2 rainbow. Marcel check. Tu bettes combien ?',
      options: [
        { label: 'Check derrière, board sec, je suis serein', isOptimal: false, feedback: 'Ne jamais slowplay AA sans raison. Marcel peut avoir 87s, 56s, ou une paire de 7 qui paiera une mise. En checkant tu donnes carte gratuite pour améliorer les tirages éventuels.' },
        { label: 'C-bet 6BB (46% pot)', isOptimal: true, feedback: 'Correct. Bet moyen sur board sec. Marcel avec toute paire ou tout tirage paiera. Tu protèges et extrais en même temps.' },
        { label: 'C-bet 13BB (pot)', isOptimal: false, feedback: 'Pot bet peut faire folder des mains faibles qui auraient payé moins. Bet 40-50% est plus efficace pour garder Marcel dans le pot.' },
      ],
      lessonHint: 'Value-bet systématiquement avec la meilleure main, même sur board sec.',
    },
  ],
  lesson: 'Ne jamais limper AA. Raiser preflop, value-bet chaque street. Le slowplay coûte de l\'argent : les mains moyennes qui vous battent se paient à petit prix si vous les laissez entrer.',
  xp: 60,
};

const DEB_MAIN_05: HandScript = {
  id: 'deb-main-05',
  level: 'debutant',
  title: 'Identifier une main de tirage',
  concept: 'Reconnaitre un flush draw et calculer ses outs',
  villain: { name: 'Sophie la Récréative', emoji: '🌸', style: 'Récréative', vpip: 45, pfr: 12, description: 'Joue pour s\'amuser, aime les suites et les couleurs.', tendency: 'Elle bet ses tirages mais check ses mains faites.' },
  setup: { heroHand: ['A♥', '7♥'], position: 'BTN', blinds: '1€/2€', effectiveStack: '80BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'flop', board: ['K♥', 'J♥', '3♦'], pot: '10BB', heroStack: '77BB',
      narrative: 'Sophie bet 5BB sur K♥-J♥-3♦. Tu as A♥-7♥ : un flush draw avec 9 outs.',
      question: 'Tu as flush draw (9 outs). Sophie bet 5BB dans 10BB. Tu as les cotes pour continuer ?',
      options: [
        { label: 'Fold, je n\'ai rien pour l\'instant', isOptimal: false, feedback: 'Erreur : tu as 9 outs pour la couleur (flush). Avec 9 outs, tu as ~36% de chances d\'améliorer sur 2 cartes. Sophie bet 5BB dans 15BB total (33% pot), tu as les cotes pour call et parfois pour raise bluff.' },
        { label: 'Call, j\'ai les cotes avec mon tirage', isOptimal: true, feedback: 'Correct. 9 outs × 4 = ~36% d\'améliorer (règle du 4-2). Sophie bet 5BB pour un pot de 15BB après call = tu paies 25% du pot pour 36% d\'equity. Cotes correctes pour continuer.' },
        { label: 'Raise all-in, je représente le top pair', isOptimal: false, feedback: 'Raise semi-bluff est jouable en avancé, mais pour débutant, le call simple sur tirage fort est la ligne la plus simple et correcte.' },
      ],
      lessonHint: 'Règle du 4-2 : outs × 4 sur le flop = % d\'améliorer sur 2 cartes. 9 outs = ~36%.',
    },
    {
      id: 'step2', street: 'turn', board: ['K♥', 'J♥', '3♦', '2♣'], pot: '20BB', heroStack: '72BB',
      narrative: 'Turn 2♣ : aucune amélioration. Sophie bet 12BB.',
      question: 'Turn blank, Sophie bet 12BB. Maintenant tu as 9 outs × 2 = 18% sur la river. Que fais-tu ?',
      options: [
        { label: 'Call, j\'ai encore des chances', isOptimal: true, feedback: 'Correct si les cotes sont là. Sophie bet 12BB dans un pot de 32BB après call = tu paies 27% pour 18% d\'equity. Les cotes ne sont pas parfaites mais A♥ comme nut flush draw ET possibilité de pair d\'As justifient un call tight ici.' },
        { label: 'Fold, 18% c\'est trop peu', isOptimal: false, feedback: 'Le fold n\'est pas une erreur majeure ici, mais avec le nut flush draw (A♥ garantit la meilleure couleur possible) et la paire d\'As comme out supplémentaire, le call est légèrement préférable selon les cotes.' },
        { label: 'Raise all-in, semi-bluff', isOptimal: false, feedback: 'Trop risqué pour un débutant. Sophie bet fort, elle a probablement une main faite (KX, JX). Restez en mode call ou fold sur les tirages.' },
      ],
      lessonHint: 'Turn : outs × 2 = % d\'améliorer. Le nut flush draw (avec l\'As) a plus de valeur car on ne peut jamais être battu par une couleur adverse.',
    },
  ],
  lesson: 'Les tirages (flush draw, straight draw) ont de la valeur car ils s\'améliorent. Apprenez la règle du 4-2 : outs × 4 sur le flop, outs × 2 sur le turn. Payez les tirages seulement quand les cotes sont correctes.',
  xp: 70,
};

const DEB_MAIN_06: HandScript = {
  id: 'deb-main-06',
  level: 'debutant',
  title: 'Protéger sa main avec un raise',
  concept: 'Raiser pour réduire le champ et protéger ses avantages',
  villain: { name: 'Théo le Chasseur', emoji: '🏹', style: 'Chaser passif', vpip: 50, pfr: 6, description: 'Joue toutes les mains mais ne fait que call.', tendency: 'Il paie tous les tirages jusqu\'au bout. Folde rarement.' },
  setup: { heroHand: ['Q♠', 'Q♣'], position: 'CO', blinds: '1€/2€', effectiveStack: '90BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'preflop', board: [], pot: '3BB', heroStack: '90BB',
      narrative: 'CO avec Q♠-Q♣. Théo est en BB, connu pour caller toutes les mains.',
      question: 'CO avec QQ. Théo est BB et call tout. Que fais-tu ?',
      options: [
        { label: 'Limp pour piéger Théo', isOptimal: false, feedback: 'Contre un caller passif, le slowplay est inutile. Théo call de toute façon, autant faire payer plus cher ses 76s et K3o. En limpant tu permets aux autres de venir gratis aussi.' },
        { label: 'Raise à 7BB (3.5x)', isOptimal: true, feedback: 'Bien. Face à un caller passif, sizez légèrement plus gros (3.5x au lieu de 3x). Théo callera quand même avec beaucoup de mains, et vous gagnez plus quand vous avez le meilleur preflop. QQ perd contre AA et KK, les faire payer cher réduit les chances de voir ces mains.' },
        { label: 'Raise à 3BB standard', isOptimal: false, feedback: 'Correct mais contre Théo qui call tout, vous pouvez size up à 3.5-4x pour extraire plus. Il paiera pareil.' },
      ],
      lessonHint: 'Face aux callers passifs (VPIP élevé, PFR faible), augmentez légèrement le sizing pour extraire plus.',
    },
    {
      id: 'step2', street: 'flop', board: ['8♦', '5♣', '2♥'], pot: '15BB', heroStack: '83BB',
      narrative: 'Théo call. Flop 8♦-5♣-2♥ rainbow, board très sec, QQ domines tout.',
      question: 'Théo check. Flop sec favorable. Tu bettes ?',
      options: [
        { label: 'Check derrière, j\'attends le turn', isOptimal: false, feedback: 'Ne checkez pas avec QQ sur 8-5-2. Théo peut avoir 65, 87, 55, des mains qui paieront un bet mais s\'améliorent sur turn/river gratuits.' },
        { label: 'C-bet 8BB (53% pot)', isOptimal: true, feedback: 'Parfait. Bet ~50-55% pot sur board sec avec overpair. Théo paiera avec toute paire (88, 55, 22 sont rares), tout 8, tout 5, et il aime appeler. Vous extraire de la valeur maintenant.' },
        { label: 'All-in 83BB', isOptimal: false, feedback: 'Overkill. Les mains qui vous battent (très rares sur ce board) vous paieront quand même avec un bet raisonnable. Les mains faibles que vous voulez faire payer folderont face à un all-in.' },
      ],
      lessonHint: 'Sur board sec avec overpair, value-bet à 50% du pot. Simple et efficace.',
    },
  ],
  lesson: 'Les Queens sont une main premium qui se joue simplement : raise preflop, c-bet sur les boards sans As ni Roi. Face aux callers passifs, augmentez légèrement le sizing, ils paieront pareil mais vous gagnez plus.',
  xp: 65,
};

const DEB_MAIN_07: HandScript = {
  id: 'deb-main-07',
  level: 'debutant',
  title: 'Quand folder une grosse main',
  concept: 'Reconnaître quand un adversaire représente une main supérieure',
  villain: { name: 'Gérard le Nit', emoji: '🦀', style: 'Nit ultra-tight', vpip: 12, pfr: 10, description: 'Ne joue que des mains premium. Raise = très forte main.', tendency: 'Il ne bluff jamais. Si Gérard raise, il a le top de sa range.' },
  setup: { heroHand: ['A♣', 'K♦'], position: 'BTN', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'preflop', board: [], pot: '3BB', heroStack: '100BB',
      narrative: 'BTN avec A♣-K♦. Gérard (UTG, Nit VPIP 12%) raise à 6BB.',
      question: 'Gérard Nit raise UTG à 6BB. Tu es BTN avec AK. Que fais-tu ?',
      options: [
        { label: 'Fold, Gérard a probablement AA ou KK', isOptimal: false, feedback: 'Trop tight. Même contre un Nit UTG (range : AA, KK, QQ, JJ, AKs, AKo), AK a ~40% d\'equity vs AA/KK et domine QQ/JJ/AQs. Le 3-bet ou call sont tous deux corrects. Fold AK face à un raise UTG est une erreur.' },
        { label: 'Call, voir le flop en position', isOptimal: true, feedback: 'Correct pour débutant. En position avec AK, vous pouvez voir le flop et décider selon que vous touchez ou non. Si flop vient A-high ou K-high, vous value-bettez. Sinon, vous pouvez folder face à continuation-bet.' },
        { label: '3-bet à 18BB', isOptimal: false, feedback: 'Aussi jouable mais plus avancé. Vs un Nit, le 3-bet peut vous mettre dans une situation difficile si il 4-bet (il a souvent AA/KK). Le call en position est plus simple pour débutant.' },
      ],
      lessonHint: 'AK = main premium mais pas une paire. Contre un Nit UTG, call en position et jouez le flop.',
    },
    {
      id: 'step2', street: 'flop', board: ['Q♦', '7♣', '2♠'], pot: '13BB', heroStack: '94BB',
      narrative: 'Flop Q♦-7♣-2♠. Vous avez rien (AK = ace-high). Gérard bet 10BB.',
      question: 'Board Q-7-2, vous avez rien avec AK. Gérard bet 10BB. Fold ?',
      options: [
        { label: 'Call, j\'ai encore deux overcards', isOptimal: false, feedback: 'Contre Gérard Nit sur Q-7-2, ses mains probables sont QQ (set), AA (overpair), KK (overpair), toutes vous battent. Vos 6 outs (3 As + 3 Rois) vous donnent ~24% d\'equity, mais avec ses cotes vous ne devriez pas call.' },
        { label: 'Fold, Gérard a probablement une main supérieure', isOptimal: true, feedback: 'Correct. Contre un Nit VPIP 12% qui raise UTG et bet ce flop, sa range est quasi-uniquement QQ+, AA, KK. Vous avez 0% d\'equity vs QQ (set). Folder AK sur un flop qui ne vous touche pas face à un Nit est la bonne décision, même si c\'est difficile.' },
        { label: 'Raise bluff all-in', isOptimal: false, feedback: 'Gérard Nit ne fold jamais ses overpaires sur ce board. Bluffer un Nit est une erreur classique, il ne bluff pas donc il ne pense pas que vous bluffez non plus.' },
      ],
      lessonHint: 'Adapter sa stratégie au profil de l\'adversaire. Contre un Nit qui bet, il a presque toujours une main forte. Folder une bonne main face à une range dominante n\'est pas une faiblesse, c\'est du bon sens.',
    },
  ],
  lesson: 'Lire le profil de l\'adversaire est crucial. Un Nit (VPIP 12%) qui raise UTG et bet le flop a une range très forte : overpaires, top set. Même avec AK, folder sur un board non touché contre cette range est correct. L\'information sur l\'adversaire vaut autant que les cartes.',
  xp: 75,
};

const DEB_MAIN_08: HandScript = {
  id: 'deb-main-08',
  level: 'debutant',
  title: 'Gérer sa bankroll : ne pas jouer scared',
  concept: 'Jouer le bon niveau de mise pour son bankroll',
  villain: { name: 'Rico le Régulier', emoji: '😐', style: 'Régulier', vpip: 24, pfr: 18, description: 'Joueur solide et standard.', tendency: 'Il joue correctement. Pas de grandes erreurs.' },
  setup: { heroHand: ['J♦', 'J♠'], position: 'SB', blinds: '5€/10€', effectiveStack: '30BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'preflop', board: [], pot: '15BB', heroStack: '30BB',
      narrative: 'SB avec J♦-J♠, 30BB effectifs. Rico raise BTN à 3BB. Tu es en SB.',
      question: 'SB avec JJ, 30BB. Rico raise à 3BB. Push all-in ou call ?',
      options: [
        { label: 'Call, voir le flop avec JJ', isOptimal: false, feedback: 'Avec seulement 30BB, JJ est trop forte pour call et voir un flop. Si vous callez et flop vient avec overcards (A, K, Q), vous êtes dans une situation difficile ne sachant pas si Rico a une overpaire. Avec 30BB, push ou fold.' },
        { label: 'All-in, JJ est trop forte pour ne pas push à 30BB', isOptimal: true, feedback: 'Correct ! À 30BB effective, JJ est un push clair. Votre FE (fold equity) + equity de la main justifient le push. Si Rico call avec AK, vous avez 55% d\'equity. S\'il fold, vous gagnez ses 3BB. C\'est automatique en short stack.' },
        { label: 'Fold, Rico représente une overpaire', isOptimal: false, feedback: 'Fold JJ à 30BB face à un raise BTN est une erreur majeure. Sa range de raise BTN inclut 22+, tous les broadways, JJ est bien devant cette range.' },
      ],
      lessonHint: 'En short stack (<40BB), les mains premium se poussent all-in plutôt que de voir des flops inconfortables.',
    },
  ],
  lesson: 'La gestion de bankroll influence votre style de jeu. En short stack (20-40BB), simplifiez : push or fold avec les mains fortes. Ne jouez pas des niveaux trop élevés pour votre bankroll, le "scared money" (jouer avec peur de perdre) cause de mauvaises décisions.',
  xp: 60,
};

// ─── INTERMÉDIAIRE mains 04-08 ────────────────────────────────────────────────

const INT_MAIN_04: HandScript = {
  id: 'int-main-04',
  level: 'intermediaire',
  title: 'Le 3-bet léger en position',
  concept: '3-bet avec des mains semi-premium pour voler le pot ou isoler',
  villain: { name: 'Damien l\'Aggro', emoji: '🔥', style: 'TAG agressif', vpip: 28, pfr: 22, description: 'Raise beaucoup preflop, continue-bets souvent.', tendency: 'Il fold aux 3-bets 55% du temps. Sa range d\'open est large.' },
  setup: { heroHand: ['A♣', '5♣'], position: 'BTN', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'preflop', board: [], pot: '3BB', heroStack: '100BB',
      narrative: 'Damien ouvre CO à 3BB. Tu es BTN avec A♣-5♣.',
      question: 'Damien (Aggro, fold-to-3bet 55%) ouvre CO. Tu as A5s BTN. Que fais-tu ?',
      options: [
        { label: 'Fold, A5s n\'est pas assez fort', isOptimal: false, feedback: 'A5s BTN est un 3-bet classique contre un opener large. Voici pourquoi : (1) Damien fold 55% aux 3-bets = profit immédiat fréquent. (2) Quand il call, vous jouez en position avec une main qui a des outs (A, flush draw, steal d\'equity). (3) A5s bloque AK/AQ dans sa range.' },
        { label: 'Call, voir le flop en position', isOptimal: false, feedback: 'Call est défendable mais le 3-bet est plus profitable contre Damien. En callant vous permettez aux blinds d\'entrer, réduisant votre avantage de position. Le 3-bet isole Damien et profite de son fold equity élevé.' },
        { label: '3-bet à 9BB', isOptimal: true, feedback: 'Correct. A5s BTN est parfait pour le 3-bet léger : (1) Fold equity contre Damien, (2) Si call, vous jouez HU en position, (3) A bloque ses combos AK/AQ premium, (4) 5♣A♣ a du potentiel (flush, paire d\'As). Sizing 3x son open = 9BB.' },
      ],
      lessonHint: 'Le 3-bet léger (bluff-3bet) fonctionne avec des mains qui ont de la valeur résiduelle si callées : suited aces, suited connectors.',
    },
    {
      id: 'step2', street: 'flop', board: ['A♦', '8♣', '3♣'], pot: '19BB', heroStack: '91BB',
      narrative: 'Damien call. Flop A♦-8♣-3♣. Tu touches top pair ET flush draw. Damien check.',
      question: 'Flop A-8-3 deux trèfles. Tu as TPTK + nut flush draw. Damien check. Tu bettes ?',
      options: [
        { label: 'Check derrière, trap sur ce board fort', isOptimal: false, feedback: 'Trop passif avec deux draws et TPTK. Sur A-8-3 deux trèfles, Damien peut avoir 8X, 3X, ou KQ de trèfles. Vous voulez charger le pot maintenant quand vous avez max equity.' },
        { label: 'C-bet 10BB (52%)', isOptimal: true, feedback: 'Parfait. Avec TPTK + nut flush draw vous avez ~68% d\'equity contre n\'importe quelle main. C-bet charging : vous extraire de la valeur ET protégez. Si Damien raise, vous pouvez re-raise ou call selon le sizing.' },
        { label: 'Check-raise si Damien bet', isOptimal: false, feedback: 'Damien a checké, donc vous agissez. Bet directement avec cette main monstre, ne donnez pas de carte gratuite.' },
      ],
      lessonHint: 'TPTK + flush draw = monster draw. Bettez fort pour charger le pot quand votre equity est maximale.',
    },
  ],
  lesson: 'Le 3-bet léger en position (avec A5s, suited connectors, A2s-A5s) exploite les ouvreurs larges qui fold souvent. Ces mains ont de la valeur résiduelle quand callées. La clé : avoir de la fold equity ET des outs pour les fois où l\'adversaire call.',
  xp: 100,
};

const INT_MAIN_05: HandScript = {
  id: 'int-main-05',
  level: 'intermediaire',
  title: 'C-bet vs check en position',
  concept: 'Décider quand c-beter et quand checker en position',
  villain: { name: 'Isabelle la Calling Station', emoji: '📞', style: 'Calling Station', vpip: 52, pfr: 8, description: 'Paye tout mais ne bluff jamais. Ne raise qu\'avec le top.', tendency: 'Elle fold rarement mais check-raise avec les nuts.' },
  setup: { heroHand: ['K♣', 'Q♦'], position: 'BTN', blinds: '1€/2€', effectiveStack: '80BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'flop', board: ['K♦', '7♠', '2♣'], pot: '12BB', heroStack: '77BB',
      narrative: 'Tu as KQ BTN, Isabelle BB a callé. Flop K♦-7♠-2♣. Isabelle check.',
      question: 'Top pair bonne kicker, Isabelle Calling Station check. Tu fais quoi ?',
      options: [
        { label: 'Check, trap la calling station', isOptimal: false, feedback: 'Erreur classique. Contre une calling station, JAMAIS de slowplay. Elle paiera tout bet avec KX, 7X, flush draw. En checkant vous perdez de la valeur et donnez carte gratuite.' },
        { label: 'C-bet 7BB (58%)', isOptimal: true, feedback: 'Parfait. Contre Isabelle, value-bet avec TPTK est automatique. Elle callera avec K9, K8, K7, toute paire de 7, parfois 2X. Bettez chaque street pour extraire le maximum.' },
        { label: 'C-bet 2BB (petit bleed)', isOptimal: false, feedback: 'Trop petit. Elle paiera 7BB aussi facilement que 2BB. Maximisez votre sizing face à une calling station.' },
      ],
      lessonHint: 'Contre les calling stations, value-bet large et fréquent. Ne bluffez jamais, ne slowplayez jamais.',
    },
    {
      id: 'step2', street: 'turn', board: ['K♦', '7♠', '2♣', 'Q♠'], pot: '26BB', heroStack: '70BB',
      narrative: 'Isabelle call. Turn Q♠, tu fais deux paires ! Isabelle check.',
      question: 'Turn Q : tu as K-K-Q-Q (deux paires TPTP). Isabelle check. Tu bettes combien ?',
      options: [
        { label: 'Bet 14BB (54%)', isOptimal: true, feedback: 'Bien. Deux paires sur K-7-2-Q : Isabelle a maintenant KX qui paire le board aussi, ou QX nouvellement. Elle paiera la même fréquence. Bet ~50-55% continue à extraire. Attention aux tirages de couleur à pique.' },
        { label: 'Bet 26BB (pot)', isOptimal: false, feedback: 'Possible mais pot-bet peut réduire ses calls avec les mains marginales. 50-60% garde plus de sa range dans le pot.' },
        { label: 'Check, sécuriser', isOptimal: false, feedback: 'Deux paires sur ce board est toujours une main forte. Isabelle ne check-raise que les nuts (ici elle devrait avoir KK ou QQ pour dominer, très rare). Continuez à value-bet.' },
      ],
      lessonHint: 'Contre les callers passifs, value-bet toutes les streets avec toute main forte. Pas de slowplay, pas de fancy play.',
    },
  ],
  lesson: 'Face aux calling stations : value-bet maximum, ne bluffez jamais, ne slowplayez jamais. Ces joueurs vous paient avec des mains que les réguliers folderaient. Votre profit vient de l\'extraction de valeur sur 3 streets, pas des bluffs.',
  xp: 90,
};

const INT_MAIN_06: HandScript = {
  id: 'int-main-06',
  level: 'intermediaire',
  title: 'Défendre la BB avec des cotes',
  concept: 'Comprendre les pot odds pour défendre correctement la BB',
  villain: { name: 'Patrice le BTN', emoji: '🎪', style: 'TAG', vpip: 25, pfr: 20, description: 'Joueur solide en position, range large au bouton.', tendency: 'Il ouvre 40% de ses mains au BTN. C-bet fréquemment.' },
  setup: { heroHand: ['7♦', '6♦'], position: 'BB', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'preflop', board: [], pot: '3BB', heroStack: '99BB',
      narrative: 'Tu es BB avec 7♦-6♦. Patrice BTN ouvre à 3BB. Fold ou défendre ?',
      question: 'BB avec 76s. Patrice (40% BTN open) raise à 3BB. Tu dois payer 2BB pour pot de 5BB. Défends ?',
      options: [
        { label: 'Fold, 76 n\'est pas assez fort', isOptimal: false, feedback: 'Erreur. Vous payez 2BB pour pot de 5BB = cotes 2.5:1. Vs BTN range de 40%, 76s a ~40% d\'equity. L\'equity requise pour call = 2/(2+5) = 29%. Votre 40% d\'equity dépasse les 29% requis. Défendez.' },
        { label: 'Call, les cotes sont correctes', isOptimal: true, feedback: 'Correct. Math : vous payez 2BB pour pot de 5BB. Equity requise = 2/7 = 28.5%. 76s vs BTN range = ~39-40% equity. C\'est un call rentable même sans position. La main est connected et suited = playable.' },
        { label: '3-bet squeeze', isOptimal: false, feedback: '3-bet avec 76s en BB face à BTN seul est défendable (semi-bluff) mais plus avancé. Pour ce niveau, le call simple en comprenant les cotes est la leçon principale.' },
      ],
      lessonHint: 'Equity requise pour call = montant à payer / (pot total après call). Si votre equity de main dépasse ce seuil, défendez.',
    },
    {
      id: 'step2', street: 'flop', board: ['8♦', '5♥', '2♠'], pot: '7BB', heroStack: '96BB',
      narrative: 'Flop 8♦-5♥-2♠. Tu as un double-gutshot (4 ou 9 = 8 outs). Patrice c-bet 4BB.',
      question: 'Tu as un double-gutshot (8 outs). Patrice bet 4BB. Cotes pour call ?',
      options: [
        { label: 'Fold, je n\'ai rien de fait', isOptimal: false, feedback: 'Avec 8 outs (double-gutshot : 4 ou 9 complète la suite), tu as 8×4 = 32% d\'equity sur 2 cartes. Patrice bet 4BB pour pot de 11BB = 27% du pot. Vos 32% > 27% requis. Call correct.' },
        { label: 'Call, j\'ai un double-gutshot avec cotes', isOptimal: true, feedback: 'Correct. 8 outs × 4 = 32% chance d\'amélioration. Vous payez 4BB pour pot de 11BB = 26.7% requis. 32% > 26.7%, donc call légèrement +EV. Sur le turn, réévaluez : 8×2 = 16%.' },
        { label: 'Raise bluff', isOptimal: false, feedback: 'Raise semi-bluff avec 8 outs est une option avancée. Pour l\'instant, maîtriser le calcul de cotes est suffisant.' },
      ],
      lessonHint: 'Double-gutshot = 8 outs (comme un open-ended). Calculez toujours : outs × 4 (flop) ou × 2 (turn) = % amélioration.',
    },
  ],
  lesson: 'La BB a un avantage : déjà investi, donc défend plus large. Utilisez les pot odds pour décider : equity requise = call / (pot après call). Si votre equity estimée dépasse ce seuil, défendez. 76s, 87s, 54s sont des défenses correctes en BB.',
  xp: 95,
};

const INT_MAIN_07: HandScript = {
  id: 'int-main-07',
  level: 'intermediaire',
  title: 'Value-bet river thin',
  concept: 'Miser sur la river avec une main de valeur marginale',
  villain: { name: 'Julien le Spewy', emoji: '💸', style: 'Loose agressif', vpip: 40, pfr: 30, description: 'Joue large et bluff beaucoup.', tendency: 'Il appelle avec beaucoup de mains marginales. Range de call large.' },
  setup: { heroHand: ['A♠', '9♠'], position: 'CO', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'river', board: ['9♣', '6♦', '3♠', 'K♥', '2♦'], pot: '30BB', heroStack: '75BB',
      narrative: 'River K-9-6-3-2 board. Tu as A♠-9♠ (paire de 9 avec A kicker). Julien check.',
      question: 'River board pair, tu as 9 avec A kicker. Julien check. Value-bet thin ou check ?',
      options: [
        { label: 'Check, ma main est trop faible pour value-bet', isOptimal: false, feedback: 'Contre Julien (range large, call fréquent), tu bats ses KX? Non, K domine. Mais tu bats ses 8X, 7X, tous les bluffs ratés (QJ, JT sans paire), A-rag sans paire. Ta main est au milieu de sa range de call. Value-bet thin petit.' },
        { label: 'Bet 12BB (40% pot)', isOptimal: true, feedback: 'Correct. Value-bet thin avec paire de 9 contre Julien. Il call avec toutes les paires inferieures (88, 77, 66, 55, 44, 33, 22), les bluffs ratés (QJ, JT), et parfois A-rag. Sizing 40% = call facile pour ses mains marginales.' },
        { label: 'Bet 30BB (pot)', isOptimal: false, feedback: 'Trop grand. Pot-bet sur river avec paire de 9 isolera uniquement les mains qui vous battent (Kx). Contre Julien, bet thin petit pour extraire de ses mains marginales nombreuses.' },
      ],
      lessonHint: 'Value-bet thin = miser sur la river avec une main qui bat la moitié de la range de call adverse. Sizing petit (30-45%) pour maximiser les calls.',
    },
  ],
  lesson: 'La river value-bet thin est l\'une des compétences les plus avancées et lucratives. Contre des adversaires qui call large (loose), bettez avec des mains moyennes si elles battent leur range de call. Sizing petit = plus de calls, plus de valeur extraite.',
  xp: 100,
};

const INT_MAIN_08: HandScript = {
  id: 'int-main-08',
  level: 'intermediaire',
  title: 'Continuation bet sur board sec',
  concept: 'C-bet sur les boards favorables à la range du raiser',
  villain: { name: 'Thomas le Passif', emoji: '😴', style: 'Passif solide', vpip: 22, pfr: 8, description: 'Joue tight mais ne raise pas souvent. Appelle plus qu\'il ne raise.', tendency: 'Il folder facilement face aux c-bets sauf s\'il a top pair ou mieux.' },
  setup: { heroHand: ['A♦', 'K♣'], position: 'CO', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'flop', board: ['Q♣', '7♦', '2♥'], pot: '14BB', heroStack: '94BB',
      narrative: 'Tu as ouvert CO, Thomas BB a callé. Flop Q♣-7♦-2♥ rainbow. Thomas check. Tu as AK = air ici.',
      question: 'Tu as AK (air) sur Q-7-2 rainbow. Thomas check. C-bet bluff ou check ?',
      options: [
        { label: 'Check derrière, j\'ai rien', isOptimal: false, feedback: 'Sur Q-7-2 rainbow, ta range CO (AK, AQ, AJ, KK, QQ, JJ, TT, suited broadways) touche ce board souvent. Thomas BB check = il n\'a probablement pas grand chose. Un c-bet représente QQ, AQ, KK, toutes dans ta range. Thomas fold ses mains marginales.' },
        { label: 'C-bet 7BB (50%)', isOptimal: true, feedback: 'Parfait. C-bet 50% sur Q-7-2 rainbow avec AK. Ce board est favorable à ta range CO (AQ, AK touchent, QQ est dans ta range). Thomas BB a peu de QX dans sa range de call. Il foldra ses KX, JX, 8X. Tu gagnes 14BB souvent.' },
        { label: 'C-bet 14BB (pot)', isOptimal: false, feedback: 'Trop gros pour un bluff. 50% pot est suffisant sur board sec, Thomas foldra pareil avec ses mains marginales.' },
      ],
      lessonHint: 'La range advantage : si le board touche plus votre range que celle de l\'adversaire, c-bet avec toute votre range (valeur + bluffs).',
    },
  ],
  lesson: 'Le c-bet n\'est pas réservé aux mains fortes. Sur les boards qui favorisent votre range (Q-7-2 avec une range CO qui inclut AQ, KK, QQ), bettez même avec de l\'air. La clé : votre range représente plausiblement les mains qui font peur sur ce board.',
  xp: 85,
};

// ─── AVANCÉ mains 04-08 ───────────────────────────────────────────────────────

const ADV_MAIN_04: HandScript = {
  id: 'adv-main-04',
  level: 'avance',
  title: 'Le check-raise comme défense',
  concept: 'Utiliser le check-raise pour défendre sa range OOP',
  villain: { name: 'Cédric le TAGfish', emoji: '🐠', style: 'TAG Fish', vpip: 28, pfr: 24, description: 'C-bet presque toujours (85%). N\'ajuste pas face aux raises.', tendency: 'Il continue-bet trop souvent et fold au check-raise sauf top pair+.' },
  setup: { heroHand: ['8♣', '8♦'], position: 'BB', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'flop', board: ['8♠', 'K♦', '5♣'], pot: '14BB', heroStack: '93BB',
      narrative: 'BB avec 8♣-8♦. Cédric CO a ouvert, tu as callé. Flop 8♠-K♦-5♣ : tu as un SET de 8 !',
      question: 'Tu as set de 8 sur K-8-5. Cédric va probablement c-bet. Que fais-tu ?',
      options: [
        { label: 'Donk-bet (bet en premier sans attendre son c-bet)', isOptimal: false, feedback: 'Un donk-bet avec le set peut fonctionner mais perd de la valeur : Cédric ne c-bet plus (tu as "volé" sa mise) et tu révèles une main forte inhabituelle. Laisser Cédric c-bet sa range entière puis check-raise est plus profitable.' },
        { label: 'Check, puis call son c-bet', isOptimal: false, feedback: 'Call simple sur le set = slowplay passif. Cédric (c-bet 85%) va payer mais tu n\'extrais pas assez. Check-raise sur le flop est mieux : il continue avec KX, AK, et bluffs qui ont de l\'equity (flush draw, gutshot).' },
        { label: 'Check, puis check-raise son c-bet', isOptimal: true, feedback: 'Parfait. Check-raise avec set de 8 sur K-8-5. Cédric c-bet sa range entière (85%). Quand il c-bet, vous raise environ 3x son bet. Il continue avec KX, AK, peut-être 55 (full house draw), flush draws. Vous chargez le pot avec ~99% d\'equity.' },
      ],
      lessonHint: 'Check-raise avec les nuts ou near-nuts maximise la valeur contre les adversaires agressifs qui c-bet fort.',
    },
    {
      id: 'step2', street: 'turn', board: ['8♠', 'K♦', '5♣', 'J♠'], pot: '42BB', heroStack: '79BB',
      narrative: 'Cédric call le check-raise. Turn J♠ (tirage de couleur à pique). Cédric check.',
      question: 'Turn J♠ (2 piques). Tu as le meilleur set. Cédric check. Que fais-tu ?',
      options: [
        { label: 'Check, le tirage de couleur me fait peur', isOptimal: false, feedback: 'Votre set de 8 est toujours immense. Certes deux piques sur le board, mais vous avez 8♣-8♦ (pas de piques). Si une flush arrive, vous perdez que si Cédric a 2 piques, pas toute sa range. Bet fort pour faire payer ses tirages.' },
        { label: 'Bet 22BB (52%)', isOptimal: true, feedback: 'Correct. Bet ~50% pour charger le pot et faire payer les tirages de couleur (Cédric peut avoir AXs, QX piques). Sur K-8-5-J avec 2 piques, il paiera avec KX (top pair), JX (nouvellement touché), et les flush draws. Construisez le pot.' },
        { label: 'Bet 42BB all-in', isOptimal: false, feedback: 'Possible mais jam turn peut fold les mains marginales. Bet turn, jam river est plus extrayant si Cédric continue.' },
      ],
      lessonHint: 'Avec un set, bettez pour faire payer les tirages. Le set sera toujours favori face aux tirages (>75% equity).',
    },
  ],
  lesson: 'Le check-raise OOP est une arme défensive ET offensive. Face aux adversaires à fort taux de c-bet, check-raisez avec vos mains fortes (top set, deux paires, nut flush draw). Cela (1) débalancie leur c-bet, (2) extrait plus de valeur, (3) construit un pot énorme avec de l\'equity.',
  xp: 130,
};

const ADV_MAIN_05: HandScript = {
  id: 'adv-main-05',
  level: 'avance',
  title: 'Floating et double barrel',
  concept: 'Float sur le flop puis représenter sur le turn',
  villain: { name: 'Max le C-beteur', emoji: '🎰', style: 'Agressif unidimensionnel', vpip: 26, pfr: 22, description: 'C-bet 90% flop, check 70% turn après call.', tendency: 'Il bet fort le flop mais abandonne souvent le turn si callé. Ne defends pas bien.' },
  setup: { heroHand: ['J♠', 'T♠'], position: 'BTN', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'flop', board: ['A♥', '7♣', '2♦'], pot: '12BB', heroStack: '94BB',
      narrative: 'Max CO a ouvert, tu as callé BTN. Flop A♥-7♣-2♦ rainbow. Tu as JTs = rien sur ce board. Max c-bet 8BB.',
      question: 'Tu as JTs (air) sur A-7-2. Max c-bet 8BB (67% pot). Float ou fold ?',
      options: [
        { label: 'Fold, j\'ai rien sur ce board', isOptimal: false, feedback: 'Contre Max (c-bet 90%, abandon turn 70%), le float est profitable. Vous payez 8BB pour potentiellement voler le turn si Max check. Sur A-7-2 vous pouvez représenter l\'As sur le turn si la carte est neutre. Math : Max check-fold turn 70% × pot 28BB = EV positif.' },
        { label: 'Call, float pour voler le turn', isOptimal: true, feedback: 'Parfait. Float classique. Vous payez 8BB pour (1) voler le turn si Max check (70% fréquence), (2) améliorer à deux paires/tirage si turn favorable (J, T, ou connecteur). La position rend ça rentable.' },
        { label: 'Raise bluff', isOptimal: false, feedback: 'Raise air sur A-7-2 est aussi jouable mais représente une range limitée. Le float + bet turn est plus crédible car vous représentez l\'As "tardif".' },
      ],
      lessonHint: 'Le float fonctionne contre les joueurs qui c-bet fort mais abandonnent fréquemment sur le turn après un call.',
    },
    {
      id: 'step2', street: 'turn', board: ['A♥', '7♣', '2♦', 'K♠'], pot: '28BB', heroStack: '86BB',
      narrative: 'Max check comme prévu ! Turn K♠. Occasion de voler le pot.',
      question: 'Max check le turn comme prévu. Tu as toujours rien (JTs). Bet ou check ?',
      options: [
        { label: 'Check derrière, le K ne m\'aide pas', isOptimal: false, feedback: 'Vous avez flotté pour voler le turn, ne checkez pas derrière maintenant ! Max a checké, montrant de la faiblesse. Bet pour voler le pot. Sur A-7-2-K, votre range représente AK, AQ, AJ, KQ, toutes très crédibles.' },
        { label: 'Bet 16BB (57%)', isOptimal: true, feedback: 'Parfait. Double barrel (bet flop + turn après float) sur A-7-2-K. Max a c-bet le flop et checké le turn = il n\'a pas d\'As fort (AK, AQ auraient probablement bet/bet). Vous représentez maintenant AK, AQ, ou une main faite. Max foldra ses bluffs ratés et mains sans valeur.' },
        { label: 'Bet all-in', isOptimal: false, feedback: 'Surbet all-in est excessif. 50-60% pot représente votre valeur sans surpayer si Max décide de continuer avec une main marginal.' },
      ],
      lessonHint: 'Le float fonctionne quand l\'adversaire check le turn, c\'est le signal pour exécuter votre bluff. Betez avec une taille crédible.',
    },
  ],
  lesson: 'Le float (call flop + bet turn) exploite les joueurs qui c-bet sans continuation. Vous payez le flop pour une option : si l\'adversaire abandonne (check) le turn, vous volez le pot. En position, ce jeu est rentable contre les adversaires avec un taux d\'abandon turn élevé (60%+).',
  xp: 125,
};

const ADV_MAIN_06: HandScript = {
  id: 'adv-main-06',
  level: 'avance',
  title: 'Gérer une grosse décision de turn',
  concept: 'Analyser sa range et sa main face à un check-raise turn',
  villain: { name: 'Nadia la Tricky', emoji: '🦊', style: 'Tricky créative', vpip: 30, pfr: 24, description: 'Joue des lignes non standard. Check-raise beaucoup.', tendency: 'Son check-raise turn est mixte : value (60%) et bluff (40%).' },
  setup: { heroHand: ['K♠', 'Q♣'], position: 'CO', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'turn', board: ['K♦', 'J♠', '7♥', 'Q♦'], pot: '24BB', heroStack: '82BB',
      narrative: 'Tu as KQ CO, board K♦-J♠-7♥-Q♦. Tu as deux paires TPTP. Tu bettes 12BB, Nadia check-raise à 34BB.',
      question: 'Tu as KQ (deux paires) sur K-J-7-Q deux couleurs. Nadia check-raise turn à 34BB. Tu fais quoi ?',
      options: [
        { label: 'Fold, trop de mains qui me battent', isOptimal: false, feedback: 'KQ = deux paires tops sur K-J-7-Q. Nadia ne check-raise que des sets (KK, JJ, 77, QQ) et deux paires (KJ, KQ, QJ). Mais vous dominez QJ (vous avez KQ), et KK/QQ sont très peu de combos. Sa range de bluff (40%) inclut ATs avec flush draw, T9 de coeur, 89 de coeur. Avec deux paires fortes et blockers, réévaluez.' },
        { label: 'Call, évaluer la river', isOptimal: true, feedback: 'Correct dans cette situation. Call le check-raise et voir la river. Votre KQ bat ses bluffs (ATs, T9s, 89s avec tirage). Si river complète un tirage, vous pouvez folder. Si river brique, call ou value-bet selon le sizing. Vous avez 32 combos qui vous battent (sets) contre ~20 combos de bluff.' },
        { label: '3-bet all-in', isOptimal: false, feedback: '3-bet sur ce board peut fold ses bluffs (votre pire scénario) et vous coûter votre stack contre ses sets. Call et évaluer la river est plus prudent avec une main à l\'équité mixte.' },
      ],
      lessonHint: 'Quand confronté à un check-raise, analysez : combien de combos vous battent vs combien de bluffs existent ? Calculez l\'equity requise.',
    },
  ],
  lesson: 'Les décisions de turn check-raise nécessitent une analyse de range. Identifiez combien de combinaisons vous battent, combien sont des bluffs, et quelle est votre equity si vous êtes battu vs quand vous êtes en tête. Avec deux paires sur un board à deux couleurs, le call est souvent préférable au fold ou au 3-bet.',
  xp: 140,
};

const ADV_MAIN_07: HandScript = {
  id: 'adv-main-07',
  level: 'avance',
  title: 'Blockers et bluff river',
  concept: 'Utiliser les blockers pour optimiser les bluffs en river',
  villain: { name: 'Philippe le Défenseur', emoji: '🛡️', style: 'Défensif solide', vpip: 22, pfr: 18, description: 'Joueur solide qui défend bien ses bonnes mains.', tendency: 'Il fold fréquemment sur river (fold-to-river-bet 55%) sauf top pair+.' },
  setup: { heroHand: ['A♦', 'K♦'], position: 'BTN', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'river', board: ['Q♦', 'J♦', '2♣', '8♥', '5♠'], pot: '40BB', heroStack: '60BB',
      narrative: 'River Q♦-J♦-2♣-8♥-5♠. Tu as A♦-K♦ = air. Philippe check. La couleur à carreau n\'est pas venue (tu avais flush draw raté). Philippe check.',
      question: 'Tu as un flush draw raté (rien). Philippe check. Est-ce que tu bluffes avec AKdd ?',
      options: [
        { label: 'Check, j\'ai rien, trop dangereux de bluffer', isOptimal: false, feedback: 'AK de carreau a deux blockers importants : A♦ bloque la flush draw de Philippe à carreau (il ne peut pas avoir A♦-X♦) et K♦ bloque les combos AK dans sa range. Votre bluff est donc plus crédible et ses calls sont réduits. Bluffer ici a de la valeur.' },
        { label: 'Bet 28BB (70% pot)', isOptimal: true, feedback: 'Parfait. Bluff river avec blockers (A♦, K♦). Raisonnement : (1) A♦ réduit ses flush draws à carreau dans sa range de call, (2) K♦ bloque AK dans sa range de top pair, (3) Philippe fold 55% à la river. Vous représentez QQ, JJ, ou flush de carreaux. Sizing 70% = crédible.' },
        { label: 'Bet 60BB all-in', isOptimal: false, feedback: 'Overbet est possible avec un bluff mais face à Philippe (défenseur solide), 70% pot obtient les mêmes folds. L\'all-in peut trigger des calls héroïques avec les top pairs.' },
      ],
      lessonHint: 'Les blockers réduisent les mains fortes dans la range de call adverse, rendant les bluffs plus efficaces.',
    },
  ],
  lesson: 'Les blockers sont une dimension avancée du poker. Avoir A♦ empêche Philippe d\'avoir certains flush draws dans sa range de call. Avoir K♦ réduit ses AK. Bettez les bluffs river avec des mains qui bloquent les calls de l\'adversaire, pas seulement avec n\'importe quelle main.',
  xp: 145,
};

const ADV_MAIN_08: HandScript = {
  id: 'adv-main-08',
  level: 'avance',
  title: 'Range advantage et surbet',
  concept: 'Exploiter le range advantage avec des over-bets polarisés',
  villain: { name: 'Victor l\'équilibré', emoji: '⚖️', style: 'GTO approx', vpip: 24, pfr: 20, description: 'Joue de façon équilibrée, défend correctement.', tendency: 'Il ne fold pas souvent mais appelle avec précision.' },
  setup: { heroHand: ['Q♠', 'Q♦'], position: 'CO', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'river', board: ['Q♣', '8♦', '3♥', '7♠', '2♣'], pot: '30BB', heroStack: '70BB',
      narrative: 'River Q-8-3-7-2 board. Tu as Q♠-Q♦ = SET DE QUEENS ! Victor check.',
      question: 'Set de Queens sur Q-8-3-7-2. Victor check. Quelle taille de bet sur la river ?',
      options: [
        { label: 'Bet 15BB (50% pot)', isOptimal: false, feedback: 'Small bet avec un set est sous-optimal. Sur Q-8-3-7-2 (board non-connecté), votre range CO a un énorme range advantage. Les nuts ici sont sets/two pairs. Victor n\'a quasi-aucun set dans sa range BB. Vous devriez sur-beter pour extraire le maximum.' },
        { label: 'Bet 40BB (133% pot, surbet)', isOptimal: true, feedback: 'Correct. Sur un board où vous avez un fort range advantage (beaucoup de sets, deux paires) et Victor n\'a pas beaucoup de mains fortes, le surbet polarisé est optimal. Il paiera avec ses secondes paires (88, 77, Q8s) et foldra ses mains faibles. Le surbet extrait plus de valeur des mains moyennes qui appellent par peur du bluff.' },
        { label: 'All-in 70BB', isOptimal: false, feedback: 'All-in est peut-être un poil trop mais défendable. 130% surbet est souvent optimal ; l\'all-in (233%) peut fold quelques mains qui auraient callé 40BB.' },
      ],
      lessonHint: 'Le surbet (over-bet) est une arme quand vous avez un range advantage fort sur la river. Il extrait plus de valeur des mains moyennes.',
    },
  ],
  lesson: 'Les surbets (bets > pot) sont optimaux quand vous avez un range advantage fort sur un board sec. En CO sur Q-8-3-7-2, votre range contient beaucoup plus de sets et deux paires que la range BB. Utilisez des bets polarisés : soit des nuts (set), soit des bluffs purs, pas de mains moyennes.',
  xp: 135,
};

// ─── EXPERT mains 04-08 ───────────────────────────────────────────────────────

const EXP_MAIN_04: HandScript = {
  id: 'exp-main-04',
  level: 'expert',
  title: 'Construction de range optimale en BTN',
  concept: 'Construire une range BTN équilibrée (valeur + bluff)',
  villain: { name: 'Antoine le Solver', emoji: '🤖', style: 'GTO strict', vpip: 22, pfr: 18, description: 'Joue très proche du GTO théorique.', tendency: 'Il exploite peu mais défend parfaitement et ne fait pas d\'erreurs.' },
  setup: { heroHand: ['T♦', '8♦'], position: 'BTN', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'preflop', board: [], pot: '3BB', heroStack: '100BB',
      narrative: 'BTN avec T♦-8♦. Folds jusqu\'à vous. Antoine est SB, joueur GTO strict.',
      question: 'BTN avec T8s, tous fold. Antoine SB est GTO. Quelle est la bonne action ?',
      options: [
        { label: 'Fold, trop risqué vs un GTO player', isOptimal: false, feedback: 'T8s BTN est un open standard. BTN vs SB+BB, la range d\'open correcte est ~40% incluant T8s. Folder T8s serait too tight et laisserait de l\'EV sur la table.' },
        { label: 'Raise à 2.5BB', isOptimal: true, feedback: 'Correct. T8s fait partie de la range d\'open BTN. Contre Antoine GTO, vous ne pouvez pas exploiter ses faiblesses, donc ouvrez votre range théoriquement correcte. T8s a de la connectivité, du potentiel de tirage, et une équité décente.' },
        { label: 'Limp, pour équilibrer ma range', isOptimal: false, feedback: 'Le limp BTN n\'est pas standard en 6-max. Raisez avec votre range d\'open normale. Le limp crée des problèmes de range balance sans avantage clair.' },
      ],
      lessonHint: 'Vs GTO players, jouez votre range théoriquement correcte, ni trop tight ni trop loose.',
    },
    {
      id: 'step2', street: 'flop', board: ['9♦', '7♣', '4♦'], pot: '6BB', heroStack: '98BB',
      narrative: 'Antoine call SB. Flop 9♦-7♣-4♦. Tu as T♦-8♦ : open-ended + flush draw = 15 outs !',
      question: 'Antoine check. Tu as 15 outs (OESD + flush draw). C-bet ou check ?',
      options: [
        { label: 'Check derrière, semi-bluff trop dangereux', isOptimal: false, feedback: 'Avec 15 outs (8 straight + 9 flush - 2 doublés = ~15 uniques), tu as ~54% d\'equity sur 2 cartes ! C\'est plus une valeur main qu\'un bluff. C-bet est dominant.' },
        { label: 'C-bet 3.5BB (58%)', isOptimal: true, feedback: 'Parfait. Semi-bluff avec 15 outs = presque 55% d\'equity. Vous bettez avec quasi un coin-flip en votre faveur. Si Antoine call, vous avez massivement l\'equity. Si fold, vous gagnez le pot. Dans tous les cas, c\'est +EV.' },
        { label: 'Check-raise si Antoine bet', isOptimal: false, feedback: 'Antoine a checké donc c\'est à vous d\'agir. Bet directement avec ce monstre draw.' },
      ],
      lessonHint: '15 outs = ~54% equity sur 2 cartes (règle du 4 : 15×4=60%, ajusté = ~54%). C\'est une main offensive, pas un bluff.',
    },
  ],
  lesson: 'Un combo draw (straight draw + flush draw = 12-15 outs) est souvent favori contre une paire. Traitez ces mains comme des mains de valeur, pas des bluffs. C-bet avec eux, semi-bluff aggressively. L\'équité brute justifie le jeu.',
  xp: 160,
};

const EXP_MAIN_05: HandScript = {
  id: 'exp-main-05',
  level: 'expert',
  title: 'Equilibre de range en défense',
  concept: 'Défendre avec une fréquence correcte pour ne pas être exploitable',
  villain: { name: 'Rachel la Rangeuse', emoji: '📐', style: 'GTO avancée', vpip: 24, pfr: 20, description: 'Joue avec un équilibre de range parfait. Bet la bonne fréquence.', tendency: 'Elle bluff à la fréquence correcte pour vous rendre indifférent.' },
  setup: { heroHand: ['K♣', '7♣'], position: 'BB', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'river', board: ['K♦', '8♠', '3♥', '4♣', '2♠'], pot: '40BB', heroStack: '60BB',
      narrative: 'Board K♦-8♠-3♥-4♣-2♠. Tu as K♣-7♣ = top pair kicker moyenne. Rachel bet 30BB (75% pot).',
      question: 'Rachel bet 30BB (75% pot). Tu as K-7 sur K-8-3-4-2. Call ou fold ?',
      options: [
        { label: 'Fold, elle a souvent AK, KQ, un set', isOptimal: false, feedback: 'Math : Rachel bet 30BB pour pot de 70BB. Votre pot-odds = 30/(30+40+30) = 30%. Si Rachel bluff > 30%, c\'est un call profitable. Contre une GTO player qui bluff à fréquence correcte, vous DEVEZ appeler avec un certain % de votre range pour ne pas être exploitable.' },
        { label: 'Call, je dois appeler à la bonne fréquence', isOptimal: true, feedback: 'Correct. Avec 30% de pot-odds requis, vous devez call avec vos meilleures mains marginales pour balancer votre défense. K7 (top pair kicker moyenne) est une main à l\'intérieur de votre range de call. Rachel est censée être indifférente entre valeur et bluff avec les bons sizing.' },
        { label: 'Raise bluff', isOptimal: false, feedback: 'Raise K7 river sur K-8-3-4-2 n\'est pas optimal. Vous n\'avez pas assez de mains qui font un raise de valeur ici pour équilibrer. Call ou fold.' },
      ],
      lessonHint: 'Fréquence de défense = 1 - pot odds. Si odds requis = 30%, défendez 70% de votre range de catching.',
    },
  ],
  lesson: 'La théorie des jeux stipule que vous devez défendre à une fréquence correcte pour rendre l\'adversaire indifférent au bluff. Si ses pot odds sont 30%, défendez 70% de votre range dans cette situation. Sous-défendre rend vos bluffs vulnérables à l\'exploitation.',
  xp: 170,
};

const EXP_MAIN_06: HandScript = {
  id: 'exp-main-06',
  level: 'expert',
  title: 'ICM pressure en tournoi',
  concept: 'Adapter son jeu à la pression ICM en fin de tournoi',
  villain: { name: 'Sam le SNG Grinder', emoji: '🏆', style: 'Conscience ICM', vpip: 26, pfr: 22, description: 'Excellent dans les formats tournoi, exploite l\'ICM.', tendency: 'Il pousse ses avantages ICM agressivement. Connaît les push/fold parfaitement.' },
  setup: { heroHand: ['A♠', 'J♦'], position: 'BTN', blinds: '200/400', effectiveStack: '15BB', gameType: 'tournament' },
  steps: [
    {
      id: 'step1', street: 'preflop', board: [], pot: '600', heroStack: '15BB',
      narrative: 'Final table tournoi, 4 joueurs. Payouts : 1er=40%, 2e=25%, 3e=20%, 4e=15%. Tu as AJ BTN, 15BB. Sam SB a 20BB. BB a 10BB (short stack).',
      question: 'AJ, 15BB BTN, final table. En chips EV c\'est un push. Est-ce correct en ICM aussi ?',
      options: [
        { label: 'Push all-in, AJ 15BB est toujours un push', isOptimal: true, feedback: 'Correct. Même avec pression ICM, AJ à 15BB est un push sur les deux mesures (chips EV et ICM EV). L\'AJ vs call ranges de SB (TT+, AQs+, AKo) et BB (risque de losing BB) donne encore assez d\'equity pour justifier le push. Folder AJ 15BB serait too tight même en ICM.' },
        { label: 'Fold, l\'ICM punit les éliminations', isOptimal: false, feedback: 'L\'ICM punit moins que vous ne pensez avec AJ 15BB. Certes vous risquez l\'élimination, mais vos chip gains si non-callé (800 chips gratis en blinds) + equity vs range de call rend le push +$EV en ICM. AJ est trop fort pour folder à 15BB même en ICM.' },
        { label: 'Raise à 2.5BB, voir si Sam reraize', isOptimal: false, feedback: 'À 15BB, une "pot control" raise est dangereuse : vous êtes commis si quelqu\'un re-shove. En short stack, c\'est push or fold. Un raise non-all-in vous donne un prix pour call un re-shove, vous perdez le contrôle.' },
      ],
      lessonHint: 'En ICM, les décisions proches de chipEV restent valides. L\'ICM affecte principalement les spots très proches du chipEV breakeven.',
    },
  ],
  lesson: 'L\'ICM (Independent Chip Model) réduit votre EV réelle dans les tournois : éliminer un joueur vaut moins que doubler. Cependant, les mains fortes en short stack restent des pushs même en ICM. Étudiez les charts push/fold ICM pour connaître les seuils exacts par position et stack size.',
  xp: 165,
};

const EXP_MAIN_07: HandScript = {
  id: 'exp-main-07',
  level: 'expert',
  title: 'Multi-way pot dynamics',
  concept: 'Ajuster sa stratégie en pot à plusieurs joueurs',
  villain: { name: 'Les 2 Récréatifs', emoji: '🎉', style: 'Fish duo', vpip: 50, pfr: 10, description: 'Deux joueurs récréatifs dans le pot.', tendency: 'Ils ont des ranges très larges, check souvent, paient facilement.' },
  setup: { heroHand: ['A♠', 'Q♦'], position: 'CO', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'flop', board: ['Q♠', '6♥', '3♦'], pot: '18BB', heroStack: '92BB',
      narrative: 'Pot 3-ways : toi CO, deux Fish. Flop Q♠-6♥-3♦. Top pair As kicker. Les deux Fish checkent.',
      question: 'Top pair TPTK, pot 3-ways, les deux joueurs checkent. C-bet ou check ?',
      options: [
        { label: 'Check derrière, pot multi-way réduit l\'efficacité du c-bet', isOptimal: false, feedback: 'Certes les bluffs sont moins efficaces en multi-way (2 adversaires = 2x les chances qu\'un soit touché). Mais vous avez TPTK ! C\'est une main de valeur claire. En multi-way, bettez vos mains fortes, les bluffs s\'effondrent mais la valeur s\'additionne (deux payeurs potentiels).' },
        { label: 'C-bet 10BB (55%)', isOptimal: true, feedback: 'Correct. TPTK en multi-way : c-bet pour la valeur. Les Fish paieront avec Qx weak, 6x, 3x, et n\'importe quel tirage. En multi-way deux payeurs potentiels = encore plus de valeur. Ajustez : bettez avec les mains fortes, checkez l\'air et les tirages (le c-bet bluff est peu rentable multi-way).' },
        { label: 'Bet 18BB (pot)', isOptimal: false, feedback: 'Pot-bet peut réduire les callers. 50-60% extrait plus de valeur totale des deux Fish.' },
      ],
      lessonHint: 'En multi-way : abandonnez les bluffs, concentrez-vous sur la valeur. Les chances qu\'un joueur ait quelque chose sont plus élevées.',
    },
  ],
  lesson: 'Les pots multi-way changent la stratégie optimale : les bluffs c-bet deviennent moins rentables (2 joueurs à convaincre), mais la valeur se multiplie (2 payeurs potentiels). Concentrez votre betting range sur les mains fortes et abandonnez les semi-bluffs légers.',
  xp: 155,
};

const EXP_MAIN_08: HandScript = {
  id: 'exp-main-08',
  level: 'expert',
  title: 'Solver insights : x/r vs donk bet OOP',
  concept: 'Comprendre pourquoi le check-raise OOP surpasse le donk bet',
  villain: { name: 'Loïc le Théoricien', emoji: '📚', style: 'Solver based', vpip: 23, pfr: 19, description: 'Ses lignes sont derivées des solvers.', tendency: 'Il adapte son jeu à votre ligne. Difficile à exploiter.' },
  setup: { heroHand: ['A♣', 'A♥'], position: 'BB', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'flop', board: ['A♦', 'J♠', '6♣'], pot: '14BB', heroStack: '93BB',
      narrative: 'BB avec AA, board A♦-J♠-6♣. Top set. Loïc CO a ouvert, tu as callé. Il va c-beter.',
      question: 'Tu as top set sur A-J-6. Loïc va probablement c-bet. Donk-bet ou check-raise ?',
      options: [
        { label: 'Donk-bet (bet avant qu\'il c-bet)', isOptimal: false, feedback: 'Le donk-bet avec le set est une ligne non-équilibrée qui révèle trop d\'informations. Les solvers préfèrent le check-raise pour plusieurs raisons : (1) Loïc c-bet sa range entière incluant les bluffs et mains moyennes. (2) En check-raisez, vous chargez plus de combos dans le pot. (3) Vous équilibrez votre range de check OOP.' },
        { label: 'Check-raise si il c-bet', isOptimal: true, feedback: 'Correct et optimal selon les solvers. En checkant, vous incitez Loïc à c-bet sa range (AQ, AK, KK, flush draws, JX). Puis en raisez, vous chargez le pot avec toutes ces mains. Sizing check-raise : environ 3x son c-bet. Si c-bet 7BB, raisez à ~21BB.' },
        { label: 'Call le c-bet, check-raise le turn', isOptimal: false, feedback: 'Cette ligne (slowplay sur deux rues) est sous-optimale. Le check-raise flop extrait plus : Loïc a une range large au flop qui rétrécit au turn si vous callez. Attaquer le flop avec x/r est préférable.' },
      ],
      lessonHint: 'Le check-raise OOP avec les nuts permet d\'extraire de la valeur de la range entière de c-bet adverse, pas uniquement de ses mains fortes.',
    },
  ],
  lesson: 'Les solvers préfèrent le check-raise OOP au donk-bet car il exploite la range de c-bet large adverse. En checkant avec un top set, vous incitez l\'adversaire à bet tout sa range (bluffs inclus). Le check-raise extrait plus de valeur totale et préserve l\'équilibre de votre range de check.',
  xp: 175,
};

// ─── PROFESSIONNEL mains 04-08 ────────────────────────────────────────────────

const PRO_MAIN_04: HandScript = {
  id: 'pro-main-04',
  level: 'professionnel',
  title: 'Population reads vs exploitation individuel',
  concept: 'Choisir entre jouer GTO-approx et exploiter les tendances populationnelles',
  villain: { name: 'La population NL100', emoji: '🌐', style: 'Population average NL100', vpip: 24, pfr: 19, description: 'Joueur représentatif du pool NL100 online.', tendency: 'Fold-to-river-bet moyen : 52%. Over-fold les surbets.' },
  setup: { heroHand: ['6♣', '5♣'], position: 'BTN', blinds: '0.50€/1€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'river', board: ['K♦', 'Q♠', '7♥', '8♦', '2♣'], pot: '30BB', heroStack: '70BB',
      narrative: 'River K-Q-7-8-2 board. Tu as 65 = rien (open-ended raté). Population NL100 fold 52% à la river et over-fold aux surbets (65%).',
      question: 'Air complet sur K-Q-7-8-2. Population fold 52% to river bet. Est-ce que tu bluffes ?',
      options: [
        { label: 'Check, bluffer avec air est trop risqué', isOptimal: false, feedback: 'Si la population fold 52% à la river, un bet de 50% pot (donc besoin de 33% fold equity pour être +EV) sera profitable car 52% > 33%. Le bluff est mathématiquement rentable.' },
        { label: 'Bet 22BB (73%), taille standard', isOptimal: false, feedback: 'Correct mais la population fold encore plus face aux surbets (65%). Un surbet (100-150%) serait encore plus profitable ici car vous augmentez le gain tout en maintenant des folds élevés.' },
        { label: 'Surbet 45BB (150%), exploite leur over-fold', isOptimal: true, feedback: 'Optimal exploitation de population tendency. La population fold 65% aux surbets. Vous avez besoin de 45/(30+70) = 31% fold pour breakeven. Vous obtenez 65%. EV du bluff = 0.65 × 30BB - 0.35 × 45BB = 19.5 - 15.75 = +3.75BB. Surbet exploitant.' },
      ],
      lessonHint: 'Les population reads permettent d\'exploiter des tendances stables dans un pool de joueurs. Les surbets exploitent l\'over-fold aux grosses mises.',
    },
  ],
  lesson: 'Les population reads (données agrégées sur un pool) permettent des exploitations systématiques. Si le pool NL100 over-fold aux surbets, utilisez des surbets comme bluffs fréquemment. Cette exploitation est distincte de l\'exploitation individuelle, elle s\'applique à tout inconnu jusqu\'à preuve du contraire.',
  xp: 190,
};

const PRO_MAIN_05: HandScript = {
  id: 'pro-main-05',
  level: 'professionnel',
  title: 'Construction de range 4-bet équilibrée',
  concept: 'Construire une range de 4-bet équilibrée avec valeur et bluffs',
  villain: { name: 'Erwan le 3-beteur Aggro', emoji: '⚡', style: '3-bet light', vpip: 27, pfr: 23, description: '3-bet fréquemment (12% 3-bet rate). Range de 3-bet large.', tendency: 'Il 3-bet légèrement mais fold au 4-bet 60% du temps.' },
  setup: { heroHand: ['K♦', 'K♠'], position: 'CO', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'preflop', board: [], pot: '3BB', heroStack: '100BB',
      narrative: 'Tu ouvres CO, Erwan BTN 3-bet à 9BB. Tu as KK. 4-bet ?',
      question: 'KK face au 3-bet de Erwan (range large, fold 4-bet 60%). 4-bet ou call ?',
      options: [
        { label: 'Call le 3-bet, voir le flop avec KK', isOptimal: false, feedback: 'KK est trop fort pour call face à un 3-betteur large. En callant, vous entrez dans un flop inconnu avec KK, si As tombe vous devez souvent check-fold, perdant de l\'EV. 4-bet avec KK est standardisé dans toutes les formations avancées.' },
        { label: '4-bet à 22BB', isOptimal: true, feedback: 'Parfait. KK = 4-bet valeur. Erwan fold 60% = vous gagnez 9BB souvent. Quand il call/5-bet, vous avez 82% d\'equity vs sa range de call/5-bet (QQ+, AK). Sizing 4-bet : ~2.3x son 3-bet = 22BB depuis 9BB.' },
        { label: 'All-in direct', isOptimal: false, feedback: '100BB all-in preflop avec KK peut fold des mains qui auraient callé un 4-bet normal (QQ, JJ, AQ). Sizing 22BB extrait plus d\'EV totale.' },
      ],
      lessonHint: 'La range de 4-bet doit être polarisée : AA, KK, AKs en valeur ET des bluffs (A5s, A4s) pour ne pas être lisible.',
    },
    {
      id: 'step2', street: 'preflop', board: [], pot: '22BB', heroStack: '78BB',
      narrative: 'Hypothétique : tu as A5s au lieu de KK. Erwan 3-bet à 9BB. Tu considères un 4-bet bluff.',
      question: 'A5s face au 3-bet de Erwan. Quel rôle joue cette main dans ta range de 4-bet ?',
      options: [
        { label: 'Fold A5s, trop faible pour 4-bet', isOptimal: false, feedback: 'A5s est un 4-bet bluff idéal : (1) Blocker A réduit les combos AA dans sa range, (2) Si callé, vous avez de l\'equity résiduelle (flush draw, paire d\'As), (3) Fold equity car Erwan fold 60%.' },
        { label: '4-bet bluff A5s pour équilibrer ma range', isOptimal: true, feedback: 'Correct. A5s est le 4-bet bluff parfait pour plusieurs raisons : l\'As bloque ses combos AA/AK (les mains qui dominent votre 4-bet), le 5s donne de l\'equity résiduelle si callé, et vous équilibrez votre range avec valeur (KK+) et bluffs (A5s, A4s).' },
        { label: 'Call A5s pour voir le flop', isOptimal: false, feedback: 'Call A5s face à un 3-bet BTN est défendable mais le 4-bet bluff est plus rentable avec cette main spécifique (blocker A + fold equity).' },
      ],
      lessonHint: 'Range de 4-bet équilibrée = valeur (AA, KK, AKs) + bluffs avec blockers (A5s, A4s, A2s-A3s). Les bluffs bloquent les combos premium adverses.',
    },
  ],
  lesson: 'Construisez votre range de 4-bet de façon polarisée : valeur premium (AA, KK, QQ, AKs) + bluffs stratégiques (A5s, A4s qui bloquent AA/AK). Cette construction empêche l\'adversaire de vous lire et maximise l\'EV totale. Les bluffs de 4-bet idéaux ont des blockers ET une valeur résiduelle.',
  xp: 200,
};

const PRO_MAIN_06: HandScript = {
  id: 'pro-main-06',
  level: 'professionnel',
  title: 'Exploiter les timing tells et patterns',
  concept: 'Lire les timing tells et patterns de bet sizing pour exploiter',
  villain: { name: 'Mehdi le Régulier Leaky', emoji: '🔧', style: 'Régulier avec leaks', vpip: 24, pfr: 20, description: 'Joueur solide mais avec des timing tells discernables.', tendency: 'Il bet instantanément avec les nuts, prend du temps avec les bluffs. Overbet = toujours valeur.' },
  setup: { heroHand: ['T♠', '9♠'], position: 'BB', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'river', board: ['J♣', '8♦', '5♥', 'Q♠', '3♦'], pot: '40BB', heroStack: '60BB',
      narrative: 'River J-8-5-Q-3. Tu as T9s = straight (J-T-9-8-? non, Q-J-T-9-8 = straight Queen high). Mehdi bet instantanément 45BB (surbet 112%).',
      question: 'Tu as la quinte. Mehdi surbet instantanément 45BB. Sachant son tell (instant bet = nuts, overbet = toujours valeur). Que fais-tu ?',
      options: [
        { label: 'Fold, il a un meilleur straight ou flush', isOptimal: false, feedback: 'Sur J-8-5-Q-3, les nuts sont : straight (Q-J-T-9-8 = T9 exactement = ta main !). Tu AS la main nuts ! Mehdi peut avoir KT pour une higher straight? Non, Q est la plus haute carte, ta quinte Queen-high est les nuts absolus. Call ou raise.' },
        { label: 'Call, je veux voir la valeur sans l\'alerter', isOptimal: false, feedback: 'Tu as les NUTS absolus sur ce board. T9 = Q-J-T-9-8 = la meilleure main possible. Même si Mehdi a un tell "instant bet = nuts", sur ce board les seules mains qu\'il peut avoir qui vous battent n\'existent pas. Raise all-in pour maximiser.' },
        { label: 'Raise all-in, j\'ai les nuts absolus', isOptimal: true, feedback: 'Correct ! Tu as T9 = straight Queen-high = absolute nuts sur J-8-5-Q-3. Le raisonnement "instant bet = nuts" ne vous aide pas ici car vous avez aussi les nuts. Raise all-in pour extraire le maximum de Mehdi qui peut avoir KK, QQ, JJ ou une main forte qui paiera.' },
      ],
      lessonHint: 'Vérifiez toujours quelle est la main nuts sur le board avant d\'appliquer des tells adverses. Si vous avez les nuts, maximisez.',
    },
  ],
  lesson: 'Les timing tells (instant bet = nuts, delay = bluff) sont de l\'information exploitable mais ne changent pas votre equity réelle. Avant d\'agir sur un tell, identifiez si vous avez les nuts ou near-nuts. Un tell "adverse-nuts" ne protège pas contre votre propre main premium.',
  xp: 185,
};

const PRO_MAIN_07: HandScript = {
  id: 'pro-main-07',
  level: 'professionnel',
  title: 'Stratégies mixtes et fréquences',
  concept: 'Appliquer des stratégies mixtes pour rester non-exploitable',
  villain: { name: 'Clara la Trackeuse', emoji: '📊', style: 'Data-driven HUD user', vpip: 25, pfr: 21, description: 'Utilise un HUD avec statistiques très détaillées. Elle adapte son jeu à vos stats.', tendency: 'Si votre cbet% dépasse 75%, elle commence à float. Si < 50%, elle fold ses mains marginales moins.' },
  setup: { heroHand: ['9♦', '9♣'], position: 'CO', blinds: '1€/2€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'flop', board: ['A♣', '7♦', '3♥'], pot: '14BB', heroStack: '93BB',
      narrative: 'CO avec 99, Clara BB a callé. Flop A♣-7♦-3♥. Tu as une underpair. Clara check.',
      question: 'Underpair sur A-7-3 contre Clara qui trackera ton c-bet%. C-bet ou check ?',
      options: [
        { label: 'C-bet toujours, plus rentable à court terme', isOptimal: false, feedback: 'Si Clara tracke votre c-bet%, un taux de 80%+ la rend rentable de flotter. Sur A-7-3, les underpaires (99, TT) sont souvent checkées dans une stratégie équilibrée pour éviter d\'être trop predictable.' },
        { label: 'Check, underpair sur A-high, je prends le contrôle au turn', isOptimal: false, feedback: 'Check est viable mais si vous checkez 99 systématiquement sur A-high, Clara ajuste en bettant le turn avec sa range entière. Une stratégie mixte (bet parfois, check parfois) est optimale.' },
        { label: 'Mix : c-bet 40% du temps, check 60% avec 99 sur A-high', isOptimal: true, feedback: 'Correct. La stratégie mixte sur A-high avec une underpaire empêche Clara d\'ajuster. Parfois vous c-bet (représentez AX), parfois vous checkez pour protéger votre range de check. Un c-bet% de 60-65% sur ce board type reste dans une zone où Clara ne peut pas exploiter.' },
      ],
      lessonHint: 'Contre les trackeurs HUD, les stratégies mixtes (bet X% du temps) maintiennent vos statistiques dans des zones non-exploitables.',
    },
  ],
  lesson: 'Les stratégies mixtes sont la réponse aux adversaires qui utilisent des HUD pour exploiter vos patterns. Si votre c-bet% est trop élevé, ils floatent. Trop bas, ils fold moins. Les solvers recommandent des fréquences mixtes sur les boards ambigus pour rester non-exploitable à long terme.',
  xp: 195,
};

const PRO_MAIN_08: HandScript = {
  id: 'pro-main-08',
  level: 'professionnel',
  title: 'Tells physiques au poker live',
  concept: 'Lire les tells physiques au poker live',
  villain: { name: 'Bernard au Live', emoji: '🃏', style: 'Récréatif live', vpip: 55, pfr: 12, description: 'Joueur live récréatif avec de nombreux tells physiques.', tendency: 'Il regarde ses jetons quand il est fort. Il parle beaucoup quand il bluff. Tremblements = main monstre.' },
  setup: { heroHand: ['A♥', 'K♥'], position: 'BTN', blinds: '2€/5€', effectiveStack: '100BB', gameType: 'cash' },
  steps: [
    {
      id: 'step1', street: 'river', board: ['A♣', 'J♦', '7♠', '2♥', 'K♣'], pot: '150€', heroStack: '400€',
      narrative: 'River A-J-7-2-K. Tu as AK (two pair top). Bernard mise 100€ et commence à beaucoup parler : "Tu as quoi ? Je pense que t\'as une bonne main..."',
      question: 'Tu as deux paires tops. Bernard parle beaucoup (tell : bavardage = bluff). Il bet 100€. Que fais-tu ?',
      options: [
        { label: 'Fold, il représente une main forte', isOptimal: false, feedback: 'Son tell (bavardage = bluff) indique qu\'il ne dispose pas d\'une main forte. Deux paires TPTK contre un bluff probable = call ou raise. Ne foldez pas des deux paires contre un tell de bluff.' },
        { label: 'Call, mes deux paires battent ses bluffs', isOptimal: true, feedback: 'Correct. Le tell (bavardage = bluff) + deux paires tops = call clair. Sur A-J-7-2-K, les mains qui vous battent sont AJ (full), A7, AK (égalité), A2, JJ, 77, mais si Bernard parle beaucoup = il est nerveux = il bluff. Vos deux paires battent ses bluffs.' },
        { label: 'Raise all-in, je veux plus d\'informations', isOptimal: false, feedback: 'Raise pour "informations" est une erreur classique. Si son tell est correct (bavardage = bluff), il fold son bluff et vous ne gagnez que 100€ au lieu de lui faire appeler un raise plus gros. Call extrait plus si ses bluffs sont des mains marginales qui continueraient.' },
      ],
      lessonHint: 'Les tells live les plus fiables : bavardage sous pression = bluff, regard vers les jetons = forte main, tremblements de mains = main monstre (peur de se faire caller).',
    },
  ],
  lesson: 'Les tells physiques au poker live sont une source d\'information précieuse. Les plus fiables : (1) Parler sous pression = souvent bluff, (2) Fixer ses jetons = forte main prête à bet, (3) Tremblements = main exceptionnelle (excitation, pas peur). Ces tells ne sont pas infaillibles mais augmentent votre précision dans les décisions proches.',
  xp: 185,
};

// ─── Export unifié en tableaux ─────────────────────────────────────────────────

export const ALL_HAND_SCRIPTS: Record<string, HandScript[]> = {
  debutant: [HAND_SCRIPTS.debutant, DEB_MAIN_02, DEB_MAIN_03, DEB_MAIN_04, DEB_MAIN_05, DEB_MAIN_06, DEB_MAIN_07, DEB_MAIN_08],
  intermediaire: [HAND_SCRIPTS.intermediaire, INT_MAIN_02, INT_MAIN_03, INT_MAIN_04, INT_MAIN_05, INT_MAIN_06, INT_MAIN_07, INT_MAIN_08],
  avance: [HAND_SCRIPTS.avance, ADV_MAIN_02, ADV_MAIN_03, ADV_MAIN_04, ADV_MAIN_05, ADV_MAIN_06, ADV_MAIN_07, ADV_MAIN_08],
  expert: [HAND_SCRIPTS.expert, EXP_MAIN_02, EXP_MAIN_03, EXP_MAIN_04, EXP_MAIN_05, EXP_MAIN_06, EXP_MAIN_07, EXP_MAIN_08],
  professionnel: [HAND_SCRIPTS.professionnel, PRO_MAIN_02, PRO_MAIN_03, PRO_MAIN_04, PRO_MAIN_05, PRO_MAIN_06, PRO_MAIN_07, PRO_MAIN_08],
};
