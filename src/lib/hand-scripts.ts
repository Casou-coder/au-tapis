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
  // DÉBUTANT — "La value-bet avec les Kings"
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
            label: 'Limp derrière — attendre le flop sans dévoiler',
            isOptimal: false,
            feedback: 'Erreur classique. Limper avec KK laisse entrer des mains bon marché qui peuvent battre tes Kings par accident. Tu perds de la valeur et tu joues OOP dans un pot multipersonnes. Avec une paire premium, on RAISE toujours.',
          },
          {
            label: 'Raise à 7BB (14€)',
            isOptimal: true,
            feedback: 'Parfait. Raiser à 6-7BB isole Marcel (tu veux jouer têt-à-tête avec KK), construit le pot, et prend l\'initiative. C\'est la décision qui maximise ton profit sur le long terme.',
          },
          {
            label: 'Raise à 15BB — punir le limp',
            isOptimal: false,
            feedback: 'Trop gros. Un raise à 15BB fait folder toutes les mains que tu bats. Tu veux que Marcel appelle avec ses mains inférieures (AT, KQ, 77...). 6-7BB est le sizing optimal pour extraire de la valeur.',
          },
          {
            label: 'All-in préflop — KK est trop fort',
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
            label: 'Check derrière — piéger Marcel',
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
            label: 'All-in — prendre le pot maintenant',
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
        narrative: 'Marcel appelle le flop. La turn est le 4♥ — une carte complètement neutre. Marcel check à nouveau.',
        question: 'Turn 4♥ — aucun changement. Marcel check. Continue à value-better ?',
        options: [
          {
            label: 'Check — garder le pot petit avec KK',
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
            label: 'All-in — 83BB dans le pot',
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
            label: 'Fold — Marcel a sûrement J-9 ou mieux',
            isOptimal: false,
            feedback: 'Mauvais fold. Marcel est un fish qui appelle 3 streets — il ne fold pas facilement mais il ne bluff pas non plus. Sa range sur le river inclut beaucoup de J-X (J8, J6...) et même 2-X qu\'il joue comme du bluff. KK bat tout ça.',
          },
          {
            label: 'Call — KK est trop fort pour folder',
            isOptimal: true,
            feedback: 'Correct. Face à un fish passif, son bet river représente souvent une main de showdown value (Jx, 7x, 9x). Tu bats tout sauf J9, 99, 77, 22. Ces combinaisons sont rares. KK en fréquence bat largement sa range de bet. Call.',
          },
          {
            label: 'Raise à 100BB (all-in)',
            isOptimal: false,
            feedback: 'Raise est possible mais risqué. Si Marcel bet river pour valeur, il peut appeler un raise seulement avec J9, 99 (full house), 77, 22. Ces mains te battent. Le call simple extrait et se protège du raise-bluff inexistant de Marcel.',
          },
        ],
        lessonHint: 'Contre un fish passif, faites confiance à votre main forte. Il bet river pour valeur ou par habitude — rarement comme bluff.',
      },
    ],
    lesson: 'La value-bet en 3 streets avec une main premium est la base du profit au poker. KK sur J-7-2 : raise preflop, c-bet flop, bet turn, call river. Cette séquence extraite de Marcel est le cœur du jeu gagnant en débutant.',
    xp: 120,
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // INTERMÉDIAIRE — "Le flush draw et les pot odds"
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
            label: 'Fold — Kevin UTG représente une main très forte',
            isOptimal: false,
            feedback: 'Trop tight. AKs est une des meilleures mains au poker. Même face à un TAG UTG (range forte : AA-JJ, AK, AQ), tu as ~35-40% d\'equity. Et tu as la position sur Kevin. Ne fold jamais AKs.',
          },
          {
            label: 'Call — jouer en position post-flop',
            isOptimal: false,
            feedback: 'Acceptable mais sous-optimal. AKs a assez d\'equity pour 3-better. En callant, tu caches ta main mais tu laisses les blindes entrer. Le 3-bet extrait plus de valeur et prend l\'initiative.',
          },
          {
            label: '3-bet à 10BB',
            isOptimal: true,
            feedback: 'Excellent ! AKs est un 3-bet évident contre un TAG : tu as une main forte, tu as la position, et si Kevin folde (ce qu\'il fait souvent avec JJ-QQ, AQ), tu gagnes le pot immédiatement. S\'il 4-bet, tu peux call ou fold selon le sizing.',
          },
          {
            label: '3-bet all-in — AK est trop fort pour juste 3-better',
            isOptimal: false,
            feedback: 'Way too aggressive préflop. Un all-in à 100BB fait folder toutes les mains sauf AA et KK. Tu perds la valeur d\'AKs post-flop. 3-bet standard à 3x le raise de Kevin.',
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
            label: 'Check derrière — attendre le flush',
            isOptimal: false,
            feedback: 'Mauvaise passivité. Tu as l\'initiative (3-betteur), tu as une main avec énorme equity (9 outs flush + 6 outs overcards ≈ 54% equity sur 2 cartes !). Le check laisse Kevin améliorer gratuitement. C-bet s\'impose.',
          },
          {
            label: 'Bet 11BB (50% pot) — semi-bluff',
            isOptimal: true,
            feedback: 'Parfait. C\'est le semi-bluff classique : tu représentes une main forte (tu as 3-betté), tu as 54% d\'equity si callé, et Kevin peut folder QJ, Q9, 8x immédiatement. Double bénéfice : valeur si call, fold equity si peur.',
          },
          {
            label: 'Bet 22BB (pot entier)',
            isOptimal: false,
            feedback: 'Sizing trop gros comme semi-bluff. Pot bet pousse Kevin à folder ses mains moyennes mais aussi à seulement call avec ses meilleures mains. 50% pot est plus efficace : plus de calls de mains que tu domines.',
          },
          {
            label: 'All-in — pression maximale',
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
        narrative: 'Kevin appelle. Turn : 5♠ — carte neutre, aucun flush. Kevin check encore.',
        question: 'Turn 5♠ (neutre). Kevin check. Tu as toujours le flush draw. Bet ou check ?',
        options: [
          {
            label: 'Check — conserve les chips si le flush rate',
            isOptimal: false,
            feedback: 'Checking ici abandonne ta fold equity. Kevin qui a checké deux fois peut avoir Q-X médiocre, 8-X, ou même un float. Un second barrel te permet de le pousser à folder ou de tirer le flush sur la river avec plus de valeur.',
          },
          {
            label: 'Bet 22BB (50% pot) — second barrel',
            isOptimal: true,
            feedback: 'Excellent second barrel ! Tu as encore 9 outs pour le flush (18% sur river × implied odds). Kevin avec Q-X moyen va souvent fold face à cette pression. Et si il appelle, tu as encore une chance de toucher.',
          },
          {
            label: 'All-in 79BB — force le fold ou l\'all-in',
            isOptimal: false,
            feedback: 'Overbet all-in turn va te faire appeler uniquement par des mains qui te battent (QQ, Q8s, sets). Un sizing de 50% pot est bien plus profitable.',
          },
          {
            label: 'Bet 10BB — bet petit pour voir la river moins cher',
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
        narrative: 'Kevin appelle encore. River : T♣ — le flush est arrivé ! Tu as le NUT FLUSH (A♣K♣). Kevin réfléchit... et check.',
        question: 'River T♣ — tu as le nut flush (A♣K♣). Kevin check. Comment joues-tu ?',
        options: [
          {
            label: 'Check derrière — sécurise le pot',
            isOptimal: false,
            feedback: 'Erreur ! Tu as le NUT FLUSH, la main la plus forte possible. Kevin a appelé deux streets — il a quelque chose. Checker ici laisse toute cette valeur sur la table. Avec la nuts, on bet TOUJOURS pour la valeur.',
          },
          {
            label: 'Bet 30BB (34% pot) — petit pour induire un call',
            isOptimal: false,
            feedback: 'Trop petit avec la main la plus forte. Un petit bet peut induire un call de mains faibles mais laisse trop de valeur. Kevin qui a callé deux barrels ne va pas se plier à 30BB.',
          },
          {
            label: 'Bet 57BB (all-in — 65% pot)',
            isOptimal: true,
            feedback: 'Parfait ! All-in avec le nut flush est le move optimal. Kevin a callé deux streets — il a Q-X ou mieux. Face à un all-in "raisonnable" de 65% pot, il va souvent appeler. Tu extrais le maximum avec la meilleure main possible.',
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
  // AVANCÉ — "Le 3-bet bluff et le multi-street bluff"
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
            label: 'Fold — 65s est trop faible contre une range CO',
            isOptimal: false,
            feedback: '65s est parfait comme 3-bet bluff ! Il a de l\'equity si callé (straight draws, flush draws), il ne bloque pas les fortes mains de Thomas (il n\'a pas d\'As), et Thomas fold 68% face à un 3-bet. C\'est une erreur de ne pas exploiter ça.',
          },
          {
            label: 'Call — jouer en position post-flop',
            isOptimal: false,
            feedback: 'Appeler est défendable mais sous-optimal. Le call laisse entrer SB/BB, dilue ton avantage positionnel, et tu joues 65s sans initiative. Le 3-bet bluff avec 65s est plus profitable à long terme.',
          },
          {
            label: '3-bet à 9BB — bluff avec suited connector',
            isOptimal: true,
            feedback: 'Move parfait. 65s est un excellent 3-bet bluff : equity suffisante si callé (55% des fois il fold = profit immédiat), tu as position, et 65 ne bloque aucune main forte de Thomas. La structure parfaite du bluff.',
          },
          {
            label: '3-bet all-in 100BB — pression maximale',
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
            label: 'Check derrière — pas de main, pas de bet',
            isOptimal: false,
            feedback: 'Mauvaise passivité. Tu as 3-betté : ta range représente beaucoup de Kx, AA, QQ. Thomas a checké sur un board K-8-3 — il est probablement faible (JJ-TT, AQ, AJ). Ne pas c-better abandonne l\'initiative pour rien.',
          },
          {
            label: 'Bet 9BB (47% pot) — c-bet standard',
            isOptimal: true,
            feedback: 'C\'est le c-bet classique du 3-betteur. Sur K-8-3, ta range représente KK, AA, AK, KQ. Thomas check = souvent rien (99-JJ, AQ). Un c-bet de 47% va le faire folder 60%+ du temps. Profit immédiat. Et si il appelle, le barrel suivant peut finir le travail.',
          },
          {
            label: 'Bet 19BB (pot entier)',
            isOptimal: false,
            feedback: 'Pot bet est trop gros comme bluff. Tu risques trop pour le même résultat. 40-50% pot obtient le même fold equity à moindre coût.',
          },
          {
            label: 'All-in — committ entièrement',
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
            label: 'Check — arrête le bluff, trop risqué',
            isOptimal: false,
            feedback: 'Thomas a checké deux fois sur K-8-3-2. Sa range est maintenant très polarisée : mains piège (KK, 88, 33) ou mains faibles (JJ, TT, AQ). Si tu check aussi, tu lui donnes une chance de bluffer ou de voir la river gratuitement. Continue.',
          },
          {
            label: 'Bet 19BB (51% pot) — second barrel',
            isOptimal: true,
            feedback: 'Excellent. Le second barrel est crucial ici. Thomas qui a callé le flop avec JJ-TT ou AQ est maintenant sous pression maximale. Beaucoup de joueurs TAG foldent face à un second barrel. Ta story est cohérente : KK, AA, AK barrellent 2 streets.',
          },
          {
            label: 'All-in 82BB',
            isOptimal: false,
            feedback: 'Overbet turn est viable dans certains spots mais ici avec rien, le risque est trop grand. Le barrel standard de 50% obtient le même résultat à moindre coût. S\'il fold, parfait. S\'il call, tu peux encore bluffer river.',
          },
          {
            label: 'Bet 10BB — petit pour garder le bluff moins cher',
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
            label: 'Check — abandon, tu as raté le bluff',
            isOptimal: false,
            feedback: 'Check river abandonne. Tu n\'as aucune showdown value avec 65. Au showdown tu perds. Si Thomas a JJ, TT, 99, AJ — il fold face à une mise. Le triple barrel termine ce que tu as commencé. Et s\'il a KX, il fold aussi.',
          },
          {
            label: 'Bet 40BB (53% pot) — triple barrel',
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
            feedback: 'Un bet à 15BB n\'a aucune fold equity. Thomas call facilement avec n\'importe quelle paire. Si tu bluffes river, la mise doit être suffisamment grande pour le pousser à folder — minimum 40-50% pot.',
          },
        ],
        lessonHint: 'Un triple barrel représente une main de valeur extrême. La cohérence de la story force les adversaires à se demander s\'ils peuvent se permettre de caller.',
      },
    ],
    lesson: 'Le bluff réussi n\'est pas de la chance — c\'est une histoire cohérente racontée sur 3 streets. 65s est parfait car il ne bloque pas les mains fortes. Chaque bet représente quelque chose de crédible. La clé : ne jamais abandonner à mi-chemin sans raison.',
    xp: 160,
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // EXPERT — "Set sur board dangereux"
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
            label: 'Fold — 99 hors position c\'est difficile',
            isOptimal: false,
            feedback: '99 est bien trop fort pour folder face à un open BTN. La range BTN d\'Alex est très large. Tu as assez d\'equity pour défendre. Fold serait massif overcautious.',
          },
          {
            label: 'Call — défendre le BB',
            isOptimal: true,
            feedback: 'Correct. 99 est une défense standard en BB contre un BTN open. Tu ne veux pas 3-better car Alex plie sa range. Call et jouer post-flop en cherchant ton set (probabilité ~11%). Si tu le touches, c\'est souvent de la valeur massive.',
          },
          {
            label: '3-bet à 10BB — 99 est assez fort',
            isOptimal: false,
            feedback: '3-bet avec 99 est possible mais compliqué OOP. Alex peut 4-bet/call avec TT-AA et tu es dans une situation délicate. Call est plus simple et garde le pot contrôlé.',
          },
          {
            label: '3-bet all-in — 99 est une paire premium',
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
        question: 'SET sur 9-T-8 bicolore — board ultra-dangereux. Alex c-bet 4BB. Que fais-tu ?',
        options: [
          {
            label: 'Call — ne dévoile pas ta force, slowplay',
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
            feedback: 'Tu n\'as pas l\'initiative — tu es OOP et Alex a c-betté. La bonne mécanique est CHECK d\'abord (permettre le c-bet), puis RAISE. Le check-raise est plus surprenant et extrait plus de valeur.',
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
        narrative: 'Alex call le check-raise. Turn J♠ — catastrophique ! Cette carte complète QJ (straight) ET le flush pique est maintenant possible. Alex check.',
        question: 'J♠ turn — straight et flush possible. Tu as un set (mais perd face à QJ et flush). Alex check. Que fais-tu ?',
        options: [
          {
            label: 'Check — trop de dangers, control the pot',
            isOptimal: false,
            feedback: 'Checker laisse Alex voir gratuitement une river qui peut compléter un full house pour lui (TT, JJ si il les a). Et surtout, tu as encore la meilleure main probable. Si Alex avait la straight, il betterait. Son check = il est souvent sur un draw ou TT-type.',
          },
          {
            label: 'Bet 20BB (51% pot) — continues à extraire',
            isOptimal: true,
            feedback: 'Correct. Alex a check-callé le flop. Son range inclut T-X, 8-X, flush draws. Face à un J♠, ces mains ne s\'améliorent pas toujours. Un bet de 50% pot : 1) extrait de la valeur, 2) charge les flush draws le prix correct, 3) te donne de l\'info sur la force d\'Alex.',
          },
          {
            label: 'Bet all-in 89BB — committ maintenant',
            isOptimal: false,
            feedback: 'All-in turn est trop violent. Si Alex a QJ (straight) ou le flush complété... bien. Mais il peut aussi fold des mains que tu bats. Bet sizing approprié permet de continuer si callé.',
          },
          {
            label: 'Fold — trop de mains nous battent',
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
        narrative: 'Alex call. River : 9♣ — QUADS ! Tu as quatre 9. Impossible d\'être battu (sauf straight flush). Alex bet all-in 69BB dans un pot de 79BB.',
        question: 'QUADS de Neuf. River 9♣. Alex all-in 69BB. Que fais-tu ?',
        options: [
          {
            label: 'Fold — il peut avoir un straight flush',
            isOptimal: false,
            feedback: 'Fold avec des quads ? La seule main qui bat les quads est un straight flush (Q♠T♠ ou J♠8♠ sur ce board). Ces combos sont extrêmement rares. Call obligatoire dans 99.9% des cas.',
          },
          {
            label: 'Call — quads sont invincibles',
            isOptimal: true,
            feedback: 'Évidemment call ! Alex peut avoir QJ (straight), flush, ou bluff — tu les bats tous avec des quads. Une seule main possible te bat : le straight flush (Q♠J♠ sur board T♠-8♠-J♠-9♣... impossible avec J♠ sur le board). Call. Empoches le pot.',
          },
          {
            label: 'Raise all-in — c\'est déjà all-in impossible',
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
  // PROFESSIONNEL — "River polarized overbet"
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
            label: 'Limp BTN — jouer passif',
            isOptimal: false,
            feedback: 'Jamais limpé au BTN avec AQo. Open raise systématiquement pour prendre l\'initiative préflop.',
          },
          {
            label: 'Open 3BB — standard BTN',
            isOptimal: true,
            feedback: 'Correct. Open 3BB au BTN avec AQo est le standard. Tu prends l\'initiative, construis le pot, et tu es en position pour tout le reste de la main.',
          },
          {
            label: 'Open 5BB — punir les défenses larges',
            isOptimal: false,
            feedback: '5BB est trop gros au BTN. Ça réduit ta profitabilité en faisant folder des mains que tu domines et en levant le prix de chaque pot. 2.5-3BB est standard.',
          },
          {
            label: '3-bet all-in — AQo est premium',
            isOptimal: false,
            feedback: 'AQo ne justifie pas un shove préflop à 100BB. C\'est une main de valeur post-flop, pas un shove préflop.',
          },
        ],
        lessonHint: 'BTN open range est large. AQo est dans le top 10% des mains — open systématiquement.',
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
            label: 'Check derrière — slowplay TPTK',
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
        narrative: 'Marco call. Turn 2♥ — carte complètement neutre. Marco check.',
        question: 'Turn 2♥ (neutre). Marco check. Continues à value-better ?',
        options: [
          {
            label: 'Check derrière — pot control avec TPTK',
            isOptimal: false,
            feedback: 'Non. La turn neutre n\'a rien changé. Marco a callé le flop — il a quelque chose (Ax, K-X, 7-X ou un gutshot). Continue à extraire avec un bet turn.',
          },
          {
            label: 'Bet 7BB (54% pot)',
            isOptimal: true,
            feedback: 'Parfait. Second barrel de value sur une turn neutre. Marco avec A-J, A-T, K-Q va appeler. Tu construis le pot pour un overbet river polarisé — la vraie décision est sur la river.',
          },
          {
            label: 'Bet 13BB (pot entier)',
            isOptimal: false,
            feedback: 'Pot bet turn est trop gros — fait folder des mains qui paient un bet normal. Et tu veux garder des chips pour un overbet river significatif.',
          },
          {
            label: 'Bet 4BB (petit)',
            isOptimal: false,
            feedback: 'Trop petit — donne un prix excellent à Marco pour tout appeler. 50% pot est le bon équilibre.',
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
        narrative: 'Marco call. River J♦ — potentiellement dangereux (QT straight possible, mais rare). Marco check. Tu as AQ (top pair + kicker broadway). Dans ta range polarisée ici : tu aurais AK (value), AJ (value), ou des bluffs (55, 66). Ton image : tight, credible.',
        question: 'River J♦. Marco check. Tu as AQ. Quel sizing pour maximiser ?',
        options: [
          {
            label: 'Check derrière — sécurise la main',
            isOptimal: false,
            feedback: 'Check river avec AQ laisse énormément de valeur sur la table. Marco a callé 2 streets — il a un Ax ou KX qui paye la river. Checker est une fuite de valeur majeure.',
          },
          {
            label: 'Bet 15BB (55% pot)',
            isOptimal: false,
            feedback: 'Sizing standard mais sous-optimal ici. Sur A-K-7-2-J avec ta range polarisée (AK, AJ vs bluffs), un overbet est bien plus profitable. Marco doit défendre contre un range de nuts/bluff — ça force des décisions difficiles.',
          },
          {
            label: 'Overbet 55BB (200% pot)',
            isOptimal: true,
            feedback: 'Excellent ! L\'overbet polarisé est le concept clé du niveau Pro. Ta range sur A-K-7-2-J est : AK (deux paires), AJ (deux paires), et bluffs. Un overbet de 200% pot force Marco à défendre uniquement ses meilleures mains. AQ extrait massivement d\'un KX ou AJ qui n\'arrive pas à folder.',
          },
          {
            label: 'All-in 87BB (322% pot)',
            isOptimal: false,
            feedback: 'Too much. Un overbet de 200-250% est optimal. L\'all-in peut faire folder des mains qui payeraient un overbet raisonnable. Calibrer le sizing est crucial.',
          },
        ],
        lessonHint: 'L\'overbet river fonctionne quand ta range est polarisée (nuts ou bluff) et que villain doit défendre sa range entière contre un sizing qui lui coûte cher.',
      },
    ],
    lesson: 'L\'overbet river polarisé est l\'un des outils les plus avancés du poker. Sur A-K-7-2-J, ta range de BTN (AK, AJ vs bluffs) justifie un sizing de 200% pot. Ce sizing force Marco à prendre des décisions difficiles sur toute sa range, là où un bet normal ne le dérange pas.',
    xp: 190,
  },
};
