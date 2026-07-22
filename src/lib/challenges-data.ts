export type ChallengeLevel = 'debutant' | 'intermediaire' | 'avance' | 'expert' | 'professionnel';
export type ChallengeType = 'decision' | 'calculation' | 'reads' | 'gto' | 'icm';

export interface VillainProfile {
  name: string;
  emoji: string;
  style: string;
  vpip: number;
  pfr: number;
  description: string;
  tendency: string;
}

export interface ChallengeOption {
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Challenge {
  id: string;
  level: ChallengeLevel;
  difficulty: 1 | 2 | 3;
  type: ChallengeType;
  title: string;
  villain: VillainProfile;
  context: {
    gameType: 'cash' | 'tournament';
    blinds: string;
    position: string;
    effectiveStack: string;
    street: 'preflop' | 'flop' | 'turn' | 'river';
    pot: string;
    heroHand: [string, string];
    board: string[];
    action: string;
  };
  question: string;
  options: ChallengeOption[];
  lesson: string;
  mathNote?: string;
  xp: number;
}

// ─── VILLAINS LIBRARY ────────────────────────────────────────────────────────

const VILLAINS = {
  fish: {
    name: 'Le Fish Passif',
    emoji: '🐟',
    style: 'Loose-Passive',
    vpip: 58,
    pfr: 8,
    description: 'Joue énormément de mains mais ne relance jamais. Appelle tout.',
    tendency: 'Chase les draws jusqu\'à la river. Bet rare = vraie valeur.',
  },
  fishAgg: {
    name: 'Le Fish Agressif',
    emoji: '🦈',
    style: 'Loose-Aggressive',
    vpip: 52,
    pfr: 38,
    description: 'Mise et relance sans raison apparente. Pression constante.',
    tendency: 'Bluff fréquemment. Un call stoppe souvent son agressivité.',
  },
  nit: {
    name: 'Le Nit',
    emoji: '🧊',
    style: 'Tight-Passive',
    vpip: 11,
    pfr: 8,
    description: 'Joue presque rien, seulement AA/KK/QQ/AKs.',
    tendency: 'S\'il relance, il a une main monstre. Fold facilement.',
  },
  tag: {
    name: 'Le TAG',
    emoji: '🎯',
    style: 'Tight-Aggressive',
    vpip: 22,
    pfr: 18,
    description: 'Joueur régulier, sélectif et agressif. Joue bien.',
    tendency: 'Range 3-bet polarisée. C-bet fréquent, mais pas au hasard.',
  },
  lag: {
    name: 'Le LAG',
    emoji: '🔥',
    style: 'Loose-Aggressive',
    vpip: 34,
    pfr: 28,
    description: 'Joueur régulier avancé. Pression constante, range large.',
    tendency: '3-bet light souvent. Range de bluff calibrée. Difficile à lire.',
  },
  tilt: {
    name: 'Le Tilter',
    emoji: '😤',
    style: 'Erratique',
    vpip: 65,
    pfr: 45,
    description: 'Vient de perdre un gros pot. Joue en mode revenge.',
    tendency: 'Bluff excessif. Overbets fréquents. Capitule aux raises répétés.',
  },
  gto: {
    name: 'Le Régulier GTO',
    emoji: '🤖',
    style: 'Balanced',
    vpip: 24,
    pfr: 20,
    description: 'Joue proche de l\'équilibre théorique. Très difficile à exploiter.',
    tendency: 'Mix value et bluff à fréquences optimales. Pense en ranges.',
  },
  nitLive: {
    name: 'Le Nit Live',
    emoji: '👴',
    style: 'Tight-Passive (live)',
    vpip: 14,
    pfr: 6,
    description: 'Joue un poker live ultra-solide depuis 20 ans. 4-bet = AA.',
    tendency: 'Un 4-bet de sa part est toujours AA/KK. Fold tout le reste.',
  },
};

// ─── CHALLENGES ──────────────────────────────────────────────────────────────

export const CHALLENGES: Challenge[] = [

  // ══════════════════════════════════════════════════════════
  // DÉBUTANT (8 défis) — Règles, forces des mains, pot odds basiques
  // ══════════════════════════════════════════════════════════

  {
    id: 'deb-01',
    level: 'debutant',
    difficulty: 1,
    type: 'decision',
    title: 'Les Aces face à un board dangereux',
    villain: VILLAINS.fish,
    context: {
      gameType: 'cash',
      blinds: '1€/2€',
      position: 'BB vs BTN',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '12BB',
      heroHand: ['T♠', 'T♦'],
      board: ['A♠', 'K♣', '7♦'],
      action: 'Villain BTN a open 3BB, tu appelles en BB. Flop A-K-7 rainbow. Tu checks, villain bet 8BB.',
    },
    question: 'Tu tiens une paire de Tens face à un board A-K-7. Villain bet. Que fais-tu ?',
    options: [
      { label: 'Fold', isCorrect: true, explanation: 'Correct. Sur A-K-7 rainbow, ta paire de Tens est battue par n\'importe quel Ax ou Kx. Même un fish joue souvent Ax ou Kx. Le fold est la décision la plus sage ici.' },
      { label: 'Call', isCorrect: false, explanation: 'Appeler ne fait que reporter le problème. Tu seras OOP sur turn et river sans amélioration réaliste. Tu bats très peu de mains dans la range de villain.' },
      { label: 'Check-Raise', isCorrect: false, explanation: 'Dangereux. Tu as une main de bluff-catch au mieux, pas de la valeur. Un check-raise engage beaucoup de jetons avec une main probablement battue.' },
      { label: 'All-in', isCorrect: false, explanation: 'All-in avec TT sur A-K-7 est une énorme erreur. Tu es battu par AA, KK, AK, Ax, Kx — soit une grande partie de la range de villain.' },
    ],
    lesson: 'Sur un board A-K-7, TT n\'est pas une main de valeur. Apprendre à folder une main qui semblait forte preflop est une compétence cruciale.',
    xp: 50,
  },

  {
    id: 'deb-02',
    level: 'debutant',
    difficulty: 1,
    type: 'calculation',
    title: 'Compter ses outs',
    villain: VILLAINS.tag,
    context: {
      gameType: 'cash',
      blinds: '1€/2€',
      position: 'BTN vs BB',
      effectiveStack: '80BB',
      street: 'flop',
      pot: '10BB',
      heroHand: ['9♥', '8♥'],
      board: ['7♥', 'T♥', '2♠'],
      action: 'Tu es en position. Villain BB check, tu es à la décision après le check.',
    },
    question: 'Avec 9♥8♥ sur 7♥-T♥-2♠, combien as-tu d\'outs pour améliorer en straight ou flush ?',
    options: [
      { label: '9 outs (flush seulement)', isCorrect: false, explanation: 'Tu as effectivement 9 outs pour le flush, mais tu oublies les outs pour la suite ! La vraie réponse est plus haute.' },
      { label: '15 outs', isCorrect: true, explanation: 'Exact ! 9 outs flush (cœurs restants) + 8 outs straight (4 Valets + 4 Six) - 2 already-counted (J♥ et 6♥ sont dans les deux catégories). 9 + 8 - 2 = 15 outs clean.' },
      { label: '12 outs', isCorrect: false, explanation: 'Pas tout à fait. Rappelle-toi : tu cherches à la fois le flush ET la straight. Compte chaque carte qui améliore ta main en gagnante.' },
      { label: '17 outs', isCorrect: false, explanation: 'Tu comptes en double certaines cartes. Le J♥ et le 6♥ comptent UNE fois seulement même s\'ils complètent flush ET straight.' },
    ],
    lesson: 'Avec un combo draw (flush + straight draw), tes outs se cumulent mais il faut déduire les cartes qui complètent les deux draws simultanément.',
    mathNote: '15 outs ≈ 54% d\'équité au flop (règle du ×4). Tu es légèrement favori !',
    xp: 60,
  },

  {
    id: 'deb-03',
    level: 'debutant',
    difficulty: 1,
    type: 'decision',
    title: 'Valeur contre un calling station',
    villain: VILLAINS.fish,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'CO vs BB (fish)',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '25BB',
      heroHand: ['A♠', 'K♦'],
      board: ['A♥', '7♣', '2♦'],
      action: 'Tu open CO, fish appelle en BB. Flop A-7-2 rainbow. Villain check.',
    },
    question: 'Tu as top pair top kicker sur un board sec face à un calling station. Quelle est ta stratégie ?',
    options: [
      { label: 'Check pour induire (slowplay)', isCorrect: false, explanation: 'Erreur classique ! Contre un calling station qui paie tout, le slowplay est une perte de valeur. Il faut BET pour extraire le maximum.' },
      { label: 'Bet 75% du pot', isCorrect: true, explanation: 'Parfait. Contre un fish qui paie trop cher, on mise gros pour valeur. Il appellera avec n\'importe quelle paire, draw ou même overcards. Pas besoin de feinter.' },
      { label: 'Bet 25% du pot (small bet)', isCorrect: false, explanation: 'Trop petit. Un calling station paiera 75% aussi facilement que 25%. Tu te prives de valeur sans raison.' },
      { label: 'Check-raise si villain bet', isCorrect: false, explanation: 'Villain a checké. Et attendre qu\'il bluff pour check-raise est trop passif. Contre un fish, on extrait la valeur soi-même.' },
    ],
    lesson: 'Contre un calling station : BET BIG pour valeur. Le slowplay et les small bets sont des erreurs d\'EV. Adapte toujours ta stratégie au profil de l\'adversaire.',
    xp: 50,
  },

  {
    id: 'deb-04',
    level: 'debutant',
    difficulty: 1,
    type: 'calculation',
    title: 'Pot odds : appel ou fold ?',
    villain: VILLAINS.tag,
    context: {
      gameType: 'cash',
      blinds: '1€/2€',
      position: 'BTN vs CO',
      effectiveStack: '100BB',
      street: 'turn',
      pot: '20BB',
      heroHand: ['K♠', 'Q♠'],
      board: ['J♠', 'T♠', '4♥', '2♦'],
      action: 'Villain CO bet 10BB sur la turn. Tu es en position avec un flush draw (roi) + gutshot.',
    },
    question: 'Pot 20BB, bet 10BB. As-tu les pot odds pour appeler avec ton draw ?',
    options: [
      { label: 'Non, fold — les pot odds sont insuffisants', isCorrect: false, explanation: 'Recalcule. Pour appeler 10BB dans un pot de 30BB total (20+10), tu paies 10/30 = 33%. Avec 12+ outs au turn, tu as ~27% d\'équité PLUS les implied odds.' },
      { label: 'Oui, appel — tu as les pot odds directs', isCorrect: false, explanation: 'Les pot odds directs ne sont pas suffisants (33% requis vs ~27% d\'équité brute), mais les IMPLIED ODDS sauvent l\'appel ici.' },
      { label: 'Oui, appel — les implied odds justifient le call', isCorrect: true, explanation: 'Exact ! Tu paies 33% pour ~27% d\'équité directe. Mais si tu touches (flush ou straight), tu extrairas facilement plus contre un TAG. Les implied odds transforment ce call en +EV.' },
      { label: 'Raise — meilleure option', isCorrect: false, explanation: 'Un raise ici (semi-bluff) peut fonctionner, mais l\'appel est plus simple et correct. Le raise est une option avancée valide mais pas la "meilleure" pour un débutant.' },
    ],
    lesson: 'Les pot odds directs ne sont qu\'une partie du calcul. Les implied odds (ce que tu gagneras si tu touches) sont souvent ce qui rend un appel profitable.',
    mathNote: 'Pot odds = 10 / (20+10+10) = 25%. Equity K flush draw = ~12 outs × 2 = 24%. Très proche — les implied odds font pencher la balance.',
    xp: 70,
  },

  {
    id: 'deb-05',
    level: 'debutant',
    difficulty: 2,
    type: 'decision',
    title: 'Ne pas surjouer une overpair',
    villain: VILLAINS.nit,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'BTN vs UTG (nit)',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '15BB',
      heroHand: ['Q♠', 'Q♦'],
      board: ['K♥', '8♣', '3♦'],
      action: 'Le nit open UTG 3BB. Tu 3-bet BTN 9BB. Il appelle. Flop K-8-3. Il check-raise ton c-bet de 8BB à 28BB.',
    },
    question: 'QQ sur K-8-3, le nit check-raise ton c-bet. Il a VPIP 11% / PFR 8%. Que fais-tu ?',
    options: [
      { label: 'Call — il peut bluffer', isCorrect: false, explanation: 'Un nit (VPIP 11%) ne check-raise presque jamais en bluff. Sa range de check-raise ici est KK, 88, 33, AK, KQ. Appeler avec QQ contre cette range est -EV.' },
      { label: 'Raise all-in — défends ton equity', isCorrect: false, explanation: 'Catastrophique. Tu vas all-in contre une range qui te domine massivement. Un nit check-raise IP = value ultra-nutted.' },
      { label: 'Fold — QQ est probablement battu', isCorrect: true, explanation: 'Correct. Contre un nit, le check-raise représente KK, 88, 33, AK, KQ minimum. QQ a très peu d\'equity face à cette range. Le fold conserve 72BB précieux.' },
      { label: 'Call puis fold au turn', isCorrect: false, explanation: 'Mieux que d\'aller all-in, mais tu brûles 28BB en sachant que tu seras souvent battu. Le fold direct est plus propre et moins coûteux.' },
    ],
    lesson: 'L\'adaptation au profil adversaire est essentielle. QQ est une très bonne main, mais contre un nit en check-raise, c\'est souvent le meilleur fold que tu feras de la soirée.',
    xp: 80,
  },

  {
    id: 'deb-06',
    level: 'debutant',
    difficulty: 2,
    type: 'reads',
    title: 'Lire le bet timing (live)',
    villain: VILLAINS.fishAgg,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'BB vs BTN',
      effectiveStack: '80BB',
      street: 'river',
      pot: '45BB',
      heroHand: ['J♦', 'J♠'],
      board: ['A♠', 'J♥', '4♣', '9♦', '2♠'],
      action: 'Tu as un set de Valets. Villain fish agressif misait sur chaque street. River 2♠. Il bet 35BB très rapidement, sans réfléchir.',
    },
    question: 'Villain bet river instantanément. Un fish agressif qui bet très vite sur river signifie généralement...',
    options: [
      { label: 'Il bluff — il faut call', isCorrect: false, explanation: 'Le bet rapide d\'un fish = souvent une main forte qu\'il veut mettre en jeu vite. C\'est l\'inverse du bluff réfléchi. Et surtout, tu as un SET — pas besoin de lire, tu call !' },
      { label: 'Il a une main forte — fold', isCorrect: false, explanation: 'Même si le bet rapide indique souvent de la valeur, tu as un SET DE VALETS. Tu bats quasi toute sa range. Folder un set est une erreur grave.' },
      { label: 'Il a souvent une main forte, mais toi tu as un set — call obligatoire', isCorrect: true, explanation: 'Exact ! L\'analyse du tell est juste (bet rapide = souvent value pour un fish), mais avec un set de Valets, tu bats tout sauf AA, 99, 22, ou J4. Call comfortable.' },
      { label: 'Raise all-in pour maximiser', isCorrect: false, explanation: 'Raise possible avec un set, mais contre un fish qui bet gros et fort, un call capture sa mise sans le faire fuir. Le raise peut faire partir les bluffs mais aussi ses mains de valeur moyenne.' },
    ],
    lesson: 'Les tells physiques informent, mais ne remplacent pas l\'analyse de ta propre main. Avec un set, tu calls quasi systématiquement — focus d\'abord sur ton équité, ensuite sur les tells.',
    xp: 75,
  },

  {
    id: 'deb-07',
    level: 'debutant',
    difficulty: 2,
    type: 'decision',
    title: 'La position change tout',
    villain: VILLAINS.lag,
    context: {
      gameType: 'cash',
      blinds: '1€/2€',
      position: 'SB vs BTN (LAG)',
      effectiveStack: '100BB',
      street: 'preflop',
      pot: '3BB',
      heroHand: ['K♦', 'J♠'],
      board: [],
      action: 'LAG BTN open 3BB. Action te parvient en SB.',
    },
    question: 'KJo en SB face à un open BTN d\'un LAG (VPIP 34%). Call, 3-bet ou fold ?',
    options: [
      { label: 'Call — bonne main, on reste en jeu', isCorrect: false, explanation: 'Appeler en SB avec KJo est problématique. Tu seras OOP (hors position) sur toutes les streets post-flop. Et KJo rate le flop 67% du temps.' },
      { label: '3-bet 9BB', isCorrect: true, explanation: 'Bonne option ! Contre un LAG qui open large depuis BTN, KJo a assez d\'equity pour 3-bet. Ça te donne l\'initiative et la possibilité de voler le pot preflop (il fold souvent à 3-bet).' },
      { label: 'Fold — main trop faible', isCorrect: false, explanation: 'Le fold est jouable mais un peu trop tight contre un LAG à 34% VPIP. KJo est dans le haut de ta range de défense vs BTN.' },
      { label: 'All-in preflop', isCorrect: false, explanation: 'Totalement disproportionné. All-in preflop avec KJo ne fait appeler que des mains qui te dominent (KK, AA, KQ, AJ+).' },
    ],
    lesson: 'La position est capitale. En SB vs BTN, même une main correcte comme KJo doit soit 3-bet pour l\'initiative, soit folder. L\'appel passif OOP est souvent la pire option.',
    xp: 70,
  },

  {
    id: 'deb-08',
    level: 'debutant',
    difficulty: 2,
    type: 'decision',
    title: 'Identifier une main de valeur au showdown',
    villain: VILLAINS.fish,
    context: {
      gameType: 'cash',
      blinds: '1€/2€',
      position: 'CO vs BB (fish)',
      effectiveStack: '80BB',
      street: 'river',
      pot: '40BB',
      heroHand: ['K♠', 'K♥'],
      board: ['K♦', '7♣', '7♠', '2♦', '9♠'],
      action: 'Board final : K-7-7-2-9. Tu as joué chaque street pour valeur. Villain check la river.',
    },
    question: 'Tu tiens K♠K♥ sur K-7-7-2-9. Quelle est ta main et faut-il bet ?',
    options: [
      { label: 'Full house — bet pour valeur maximale', isCorrect: true, explanation: 'Exact ! K-K-K-7-7 = Full House (Kings over Sevens). C\'est une main très forte. Villain (fish) a probablement 9x, 7x, ou 2x. Bet 60-75% pot pour extraire.' },
      { label: 'Trois Rois — check pour piéger', isCorrect: false, explanation: 'Tu as mieux que trois Rois ! Avec K♠K♥ sur K-7-7-2-9, tu fais K-K-K-7-7 = Full House. Et le piège (check) perd de la valeur contre un fish qui ne bluffera pas la river.' },
      { label: 'Full house — check (villain peut bluffer)', isCorrect: false, explanation: 'Un fish passif ne bluffent presque jamais. Checker avec un full house contre lui, c\'est perdre de la valeur. BET pour extraire sa paire, ses 7x, ses draws ratés.' },
      { label: 'Deux paires — fold si villain bet', isCorrect: false, explanation: 'Non — tu as un FULL HOUSE, pas deux paires. K♠K♥ + board K-7-7 = Full House Kings over Sevens. Impossible de folder ici.' },
    ],
    lesson: 'Reconnais toujours ta main correctement avant de décider. Un Full House se joue pour valeur maximale. Contre un fish, bet chaque street et ne te sous-estimez pas.',
    xp: 55,
  },

  // ══════════════════════════════════════════════════════════
  // INTERMÉDIAIRE (8 défis) — EV, c-bet, reads avancés, semi-bluff
  // ══════════════════════════════════════════════════════════

  {
    id: 'int-01',
    level: 'intermediaire',
    difficulty: 1,
    type: 'calculation',
    title: 'EV de la continuation bet',
    villain: VILLAINS.tag,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'CO vs BB (TAG)',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '20BB',
      heroHand: ['A♠', '5♦'],
      board: ['K♠', '8♦', '2♣'],
      action: 'Tu open CO, TAG BB appelle. Flop K-8-2 rainbow. Villain check. Stats villain : Fold to Cbet 72%.',
    },
    question: 'C-bet 10BB dans un pot de 20BB avec A5o air. Villain fold 72%. Est-ce +EV ?',
    options: [
      { label: 'Non, trop risqué de bluffer ici', isCorrect: false, explanation: 'Calcule d\'abord ! EV = (0.72 × 20) - (0.28 × 10) = 14.4 - 2.8 = +11.6BB. C\'est très +EV même sans équité.' },
      { label: 'Oui, +EV : environ +11.6BB en moyenne', isCorrect: true, explanation: 'Parfait. EV = P(fold) × pot_gagné - P(call) × mise = 0.72 × 20 - 0.28 × 10 = 14.4 - 2.8 = +11.6BB. La c-bet est très rentable ici.' },
      { label: 'Oui, mais seulement si tu as un draw', isCorrect: false, explanation: 'Le calcul EV ne nécessite pas de draw. Même air, si villain fold assez souvent (>33% sur une mise 50% pot), la c-bet est +EV.' },
      { label: 'Oui, +EV d\'environ +5BB', isCorrect: false, explanation: 'Recalcule : 0.72 × 20 = 14.4BB de gain moyen. 0.28 × 10 = 2.8BB de perte moyenne. Différence = +11.6BB, pas +5BB.' },
    ],
    lesson: 'La formule EV est : (P_fold × pot) - (P_call × mise). Si ce résultat est positif, la c-bet est profitable même sans main. C\'est le fondement du bluff mathématique.',
    mathNote: 'Seuil de rentabilité : tu dois que villain fold > mise/(mise+pot) = 10/30 = 33%. Avec 72% de fold, tu es bien au-dessus.',
    xp: 80,
  },

  {
    id: 'int-02',
    level: 'intermediaire',
    difficulty: 1,
    type: 'decision',
    title: 'Le semi-bluff : raise ou call ?',
    villain: VILLAINS.lag,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'BTN vs BB (LAG)',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '30BB',
      heroHand: ['6♥', '7♥'],
      board: ['5♥', '8♠', 'K♥'],
      action: 'Tu es IP. Villain BB (LAG) bet 20BB dans le pot de 30BB. Tu as open-ended straight draw + flush draw.',
    },
    question: 'Avec combo draw (15 outs) face à un bet LAG 67% pot, tu as le droit de...',
    options: [
      { label: 'Folder — trop risqué contre un LAG', isCorrect: false, explanation: 'Avec 15 outs, tu es presque 50/50 ! Folder ici c\'est refuser une situation très favorable. Le LAG représente souvent de l\'air sur un board comme celui-ci.' },
      { label: 'Caller — défendre et voir la turn', isCorrect: false, explanation: 'Le call est correct si tu veux jouer safe, mais tu laisses de l\'EV sur la table. Avec un combo draw, un raise capture les pots quand il fold ET garde l\'équité quand il call.' },
      { label: 'Raise — semi-bluff pour maximiser l\'EV totale', isCorrect: true, explanation: 'Excellent ! Avec 15 outs (~54% d\'equity au flop), un raise semi-bluff est optimal. Tu gagnes le pot quand il fold (equity immédiate) + tu as l\'équité si il call. Double bénéfice.' },
      { label: 'All-in — prends le pot maintenant', isCorrect: false, explanation: 'Possible mais souvent trop grand comme sizing. Un raise à 2-2.5x sa mise est plus adapté pour maximiser la pression sans surexposer quand il call avec une main forte.' },
    ],
    lesson: 'Le semi-bluff combine deux sources d\'EV : le fold equity (il se couche) et l\'equity réelle (si il call, tu peux encore gagner). C\'est plus puissant qu\'un bluff pur ou qu\'un call passif.',
    mathNote: '15 outs × 4 = 60% d\'equity. Tu es favori ! Même si villain call, tu gagnes souvent.',
    xp: 90,
  },

  {
    id: 'int-03',
    level: 'intermediaire',
    difficulty: 2,
    type: 'reads',
    title: 'Identifier le tilt',
    villain: VILLAINS.tilt,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'BTN vs BB (tilter)',
      effectiveStack: '90BB',
      street: 'river',
      pot: '60BB',
      heroHand: ['A♣', 'Q♦'],
      board: ['Q♠', '7♦', '2♣', '4♥', 'J♠'],
      action: 'Villain vient de perdre un buy-in complet il y a 10 minutes. Il a joué 80% des mains depuis. River J. Il overbet 3x pot (180BB) dans un pot de 60BB.',
    },
    question: 'Villain tilter, overbet river 3x avec ta top pair top kicker. Que fais-tu ?',
    options: [
      { label: 'Fold — overbet souvent = nuts', isCorrect: false, explanation: 'En théorie oui, mais contre un tilter émotionnel qui overbet pour "se venger", cette logique GTO ne s\'applique pas. Il peut overbet avec n\'importe quelle main médiocre.' },
      { label: 'Call — le tilt change les probabilités', isCorrect: true, explanation: 'Correct. Contre un joueur en tilt qui overbet, la range n\'est plus polarisée correctement. Il peut bet 3x pot avec une paire faible, un draw raté, ou par frustration. Ton TPTK tient souvent.' },
      { label: 'Raise all-in — pousse l\'avantage', isCorrect: false, explanation: 'Trop risqué. Il est en tilt mais peut quand même avoir KQ, JJ, ou 77. Un raise fait partir les mains qu\'il bluff et ne call que ses mains fortes. Le call est meilleur.' },
      { label: 'Fold — la board est trop dangereuse', isCorrect: false, explanation: 'Tu as AQ sur un board Q-7-2-4-J. Ta main est Q-Q-A-J-7 = TPTK. Folder face à un joueur en tilt avec cette main serait une erreur d\'exploitation massive.' },
    ],
    lesson: 'Les profils de joueurs modifient les stratégies optimales. Contre un tilter, les overbets sont moins fiables comme signal de force. L\'exploitation prime sur la théorie GTO.',
    xp: 85,
  },

  {
    id: 'int-04',
    level: 'intermediaire',
    difficulty: 2,
    type: 'calculation',
    title: 'Set mining : les implied odds',
    villain: VILLAINS.fish,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'BTN vs UTG (fish)',
      effectiveStack: '120BB',
      street: 'preflop',
      pot: '3BB',
      heroHand: ['5♣', '5♦'],
      board: [],
      action: 'Fish UTG open 3BB. Action te parvient sur le BTN avec 55. Stacks profonds à 120BB.',
    },
    question: 'Set mining avec 55 : appel 3BB avec des stacks de 120BB. Est-ce profitable ?',
    options: [
      { label: 'Non — 55 rate le set 88% du temps, fold', isCorrect: false, explanation: 'Correct que tu rates souvent, mais les implied odds changent tout ! Quand tu touches ton set (12%), tu extrairas facilement contre un fish.' },
      { label: 'Oui — la règle des 5/10 le confirme', isCorrect: true, explanation: 'Exact ! Règle des 5/10 : appeler profitable si stacks > 10-20x la mise. Ici 3BB d\'appel pour 120BB de stack = ratio 40:1. Largement suffisant pour le set mining contre un fish payeur.' },
      { label: 'Oui — 55 a 50% d\'equity contre n\'importe quelle main', isCorrect: false, explanation: 'L\'equity de 55 vs AK est ~55%, pas 50%. Mais ce n\'est pas la bonne raison d\'appeler ici. La vraie raison c\'est les implied odds du set.' },
      { label: 'Non — les pot odds directs sont insuffisants', isCorrect: false, explanation: 'Les pot odds directs sont en effet insuffisants. Mais les IMPLIED ODDS (ce que tu gagnes quand tu touches) compensent largement. C\'est l\'essence même du set mining.' },
    ],
    lesson: 'Le set mining se justifie par les implied odds, pas les pot odds directs. Règle pratique : stacks profonds (>15x la mise) + adversaire payeur = set mining profitable.',
    mathNote: 'Probabilité de toucher un set au flop : ~12% (1 chance sur 8.5). Besoin de gagner 8.5x la mise quand tu touches. Avec 120BB stack vs fish = largement atteint.',
    xp: 85,
  },

  {
    id: 'int-05',
    level: 'intermediaire',
    difficulty: 2,
    type: 'decision',
    title: 'C-bet sur board connecté : attention',
    villain: VILLAINS.lag,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'CO vs BB (LAG)',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '20BB',
      heroHand: ['A♦', 'K♣'],
      board: ['J♦', 'T♥', '9♣'],
      action: 'Tu open CO, LAG BB appelle. Flop J-T-9 tricolore (board ultra-connecté). Villain check.',
    },
    question: 'AKo sur J-T-9 connecté face à un LAG. Faut-il c-bet ?',
    options: [
      { label: 'Oui — tu as deux overcards et un gutshot', isCorrect: false, explanation: 'Le gutshot (Q) donne 4 outs et AK a quelques outs. Mais c-bet sur J-T-9 est très risqué : un LAG attaque ce board souvent, et ta range ne défend pas bien ici OOP.' },
      { label: 'Oui — toujours c-bet en position', isCorrect: false, explanation: 'Faux. C-bet en position est bon en général, mais sur J-T-9 (board très favorable à la range de défense du BB), un LAG check-raise ou float souvent. C-bet sélectif ici.' },
      { label: 'Non — check derrière pour contrôler le pot', isCorrect: true, explanation: 'Correct. Sur J-T-9 connecté, la range de BB défense contient beaucoup de J, T, 9, KQ, QJ, etc. Avec AK sur ce board, checker préserve tes jetons et garde le pot petit avec une main sans grosse équité.' },
      { label: 'Non — fold AK sur ce board', isCorrect: false, explanation: 'Fold ? Tu as encore AK avec un gutshot. Checker n\'est pas folder. Tu gardes ta main et attends une amélioration à moindre coût.' },
    ],
    lesson: 'La c-bet n\'est pas automatique. Sur les boards connectés (JT9, 678...), la range de l\'appelant est très forte. Checker pour contrôle est souvent la ligne la plus profitable.',
    xp: 90,
  },

  {
    id: 'int-06',
    level: 'intermediaire',
    difficulty: 2,
    type: 'decision',
    title: 'Le squeeze play',
    villain: VILLAINS.fishAgg,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'BB vs CO + BTN',
      effectiveStack: '100BB',
      street: 'preflop',
      pot: '13BB',
      heroHand: ['A♥', 'K♠'],
      board: [],
      action: 'Fish agressif CO open 3BB. BTN (fish passif) cold-call. Action te parvient en BB avec AKs.',
    },
    question: 'AKs en BB, open + cold-call devant toi. Squeeze, call ou fold ?',
    options: [
      { label: 'Call — voir le flop en position (tu seras OOP)', isCorrect: false, explanation: 'Attention : tu seras OOP contre deux joueurs si tu call. Et avec AKs, tu veux soit isoler, soit prendre le pot. Le call passif est la pire option.' },
      { label: 'Squeeze à 25-30BB', isCorrect: true, explanation: 'Excellent ! Le squeeze est parfait ici. Tu isoles contre des fish avec une main premium. Le cold-caller (BTN fish) a une range médiocre et fold souvent. Tu prends souvent le pot ou joues IP contre un seul adversaire.' },
      { label: 'Fold — trop de joueurs impliqués', isCorrect: false, explanation: 'Folder AKs est une grave erreur. C\'est dans le top 5% des mains. Tu as toujours une edge massive même en multiway.' },
      { label: 'Min-raise à 6BB', isCorrect: false, explanation: 'Trop petit. Un squeeze doit être suffisant pour forcer des folds (25-30BB minimum avec deux callers). Une min-raise invite les callers et réduit ton edge.' },
    ],
    lesson: 'Le squeeze est puissant car le cold-caller a une range faible (il n\'a pas 3-bet) et devra affronter deux actions négatives. C\'est une situation d\'exploitation classique.',
    xp: 95,
  },

  {
    id: 'int-07',
    level: 'intermediaire',
    difficulty: 3,
    type: 'calculation',
    title: 'Appel river : le ratio bluff/valeur',
    villain: VILLAINS.tag,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'BB vs BTN (TAG)',
      effectiveStack: '100BB',
      street: 'river',
      pot: '80BB',
      heroHand: ['K♦', 'T♦'],
      board: ['K♠', 'Q♦', 'J♦', '4♥', '2♠'],
      action: 'Board K-Q-J-4-2. Tu as TPTK (K avec kicker T). Villain TAG bet 60BB sur river.',
    },
    question: 'Pot 80BB, villain bet 60BB river. Pour que l\'appel soit +EV, quelle % de bluffs doit-il avoir ?',
    options: [
      { label: '20% de bluffs suffisent', isCorrect: false, explanation: 'Pas tout à fait. Calcule le MDF (Minimum Defense Frequency) : appel = 60 / (80+60+60) = 30%. Tu dois gagner 30% du temps pour casser même. Il faut donc 30% de bluffs minimum.' },
      { label: '30% de bluffs minimum', isCorrect: true, explanation: 'Exact ! Pot odds de l\'appel = 60 / (200) = 30%. Si villain bluff plus de 30% du temps sur cette ligne, tu appelles. Si moins, tu fold. KT sur K-Q-J est une bonne bluff-catcher ici.' },
      { label: '50% de bluffs — c\'est toujours 50/50', isCorrect: false, explanation: 'Non. La décision dépend du sizing de bet. Avec un bet de 75% pot, villain doit avoir ~42% de bluffs. Ici bet 75% pot = seuil ~43%, pas 50%.' },
      { label: '10% de bluffs — les pot odds sont bons', isCorrect: false, explanation: '10% de bluffs ne suffisent pas. Tu paies 60BB pour en gagner 140BB (pot + bet), soit 30% de win equity nécessaire. Si villain bluff seulement 10%, tu perdes 20% des appels.' },
    ],
    lesson: 'La formule pour le seuil d\'appel river : Appel_requis / (pot_total + appel). Si villain bluff plus que ce seuil = call. Moins = fold.',
    mathNote: 'Seuil = 60 / (80 + 60 + 60) = 60/200 = 30%. Si villain a ≥30% bluffs dans sa range → call +EV.',
    xp: 100,
  },

  {
    id: 'int-08',
    level: 'intermediaire',
    difficulty: 3,
    type: 'decision',
    title: 'Défendre les blinds vs steal',
    villain: VILLAINS.lag,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'BB vs BTN (LAG)',
      effectiveStack: '100BB',
      street: 'preflop',
      pot: '7.5BB',
      heroHand: ['Q♣', '7♦'],
      board: [],
      action: 'LAG BTN open 2.5BB (steal tentative, BTN range ~45%). Fold SB. Tu es en BB avec Q7o.',
    },
    question: 'Q7o en BB vs steal BTN d\'un LAG. Defender ou fold ?',
    options: [
      { label: 'Fold — Q7o n\'est pas défendable', isCorrect: false, explanation: 'Contre un BTN range de 45%, tu dois défendre environ 65-70% de tes mains en BB (MDF). Q7o est dans cette range de défense face à un open large.' },
      { label: 'Call — les pot odds en BB justifient le call', isCorrect: true, explanation: 'Correct. Tu paies 1.5BB pour un pot de 7.5BB = pot odds 20%. Avec position de BB discount et une range villain très large, Q7o a assez d\'equity pour défendre. Call correct.' },
      { label: '3-bet light à 9BB', isCorrect: false, explanation: 'Q7o n\'est pas idéal pour un 3-bet bluff. Tu veux des mains avec plus de blockers (A-x, K-x suited). Le call passif est mieux ici.' },
      { label: 'Fold — trop OOP post-flop', isCorrect: false, explanation: 'Oui tu seras OOP, mais le pot odds en BB (tu as déjà 1BB investi) rendent cette défense mathématiquement correcte. Le fold excessif en BB est une leak courante.' },
    ],
    lesson: 'Le Minimum Defense Frequency (MDF) te dit combien de mains tu dois défendre en BB pour ne pas être exploitable. Contre un open BTN large, Q7o est souvent dans la range à défendre.',
    mathNote: 'MDF en BB vs open 2.5BB : Pot 7.5BB, coût défense 1.5BB → MDF = 1 - (1.5/7.5) = 80% ! Tu dois défendre beaucoup.',
    xp: 95,
  },

  // ══════════════════════════════════════════════════════════
  // AVANCÉ (8 défis) — Ranges, 3-bet, ICM, protection, GTO intro
  // ══════════════════════════════════════════════════════════

  {
    id: 'adv-01',
    level: 'avance',
    difficulty: 1,
    type: 'decision',
    title: '3-bet light BvB',
    villain: VILLAINS.lag,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'SB vs BTN (LAG)',
      effectiveStack: '100BB',
      street: 'preflop',
      pot: '3BB',
      heroHand: ['Q♠', 'J♠'],
      board: [],
      action: 'LAG BTN open 3BB (steal range ~45%). Fold. SB à toi avec QJs.',
    },
    question: 'QJs en SB vs BTN steal d\'un LAG. Quelle est l\'action optimale ?',
    options: [
      { label: 'Fold — trop OOP post-flop', isCorrect: false, explanation: 'Folder QJs contre un BTN à 45% de range serait trop tight. Tu as une main avec beaucoup d\'équité et de potentiel.' },
      { label: 'Call — jouer en position (tu seras OOP !)', isCorrect: false, explanation: 'Appeler en SB te laisse OOP sur toutes les streets. Avec QJs, le 3-bet est préférable pour gagner l\'initiative et maximiser le fold equity.' },
      { label: '3-bet à 9BB — semi-bluff avec bonne equity', isCorrect: true, explanation: 'Correct ! QJs est une 3-bet parfaite en SB vs BTN LAG. Bonne connectivité, bonne equity si call, et tu force souvent le fold. Si il 4-bet, tu peux fold sans perdre trop.' },
      { label: '3-bet all-in — mets toute la pression', isCorrect: false, explanation: 'Trop aggressif. QJs est une main de semi-bluff 3-bet, pas un shove preflop. Un 3-bet calibré à 9BB est optimal.' },
    ],
    lesson: 'Les 3-bets légers en SB vs BTN sont cruciaux pour ne pas être exploitable. QJs est idéal : assez d\'equity pour survivre un call, assez de fold equity pour voler souvent.',
    xp: 90,
  },

  {
    id: 'adv-02',
    level: 'avance',
    difficulty: 1,
    type: 'decision',
    title: 'Protection sur board dangereux',
    villain: VILLAINS.fishAgg,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'BTN vs BB',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '20BB',
      heroHand: ['A♠', 'A♦'],
      board: ['8♥', '9♥', 'T♣'],
      action: 'Tu as 3-bet BTN avec AA. Fish agressif BB appelle. Flop 8-9-T tricolore. Villain check.',
    },
    question: 'AA sur un flop 8-9-T extrêmement connecté. Quelle est ta stratégie ?',
    options: [
      { label: 'Check pour induire — AA est toujours la meilleure main', isCorrect: false, explanation: 'Erreur. AA sur 8-9-T est vulnérable. Un fish agressif peut avoir 7-J (straight), 8-9 (two pair), ou beaucoup de draws qui prennent de l\'equity. Il faut protéger !' },
      { label: 'Bet petit (30%) — value et protection', isCorrect: false, explanation: 'Trop petit. Sur un board aussi humide, un petit bet invite les callers avec tous leurs draws. Tu veux une mise plus large pour les charger de payer leurs outs.' },
      { label: 'Overbet (120-150% pot) — protection maximale', isCorrect: true, explanation: 'Correct. Sur 8-9-T, un overbet est optimal avec AA. Tu forces les draws à payer un prix prohibitif, et tu extrais valeur maximum quand villain a un pair+draw. L\'overbet est la solution sur ce type de board.' },
      { label: 'All-in direct — ne laisse aucune chance', isCorrect: false, explanation: 'Possible, mais un overbet calibré laisse plus de chances d\'être appelé par des mains de valeur moyenne. L\'all-in force les folds des mains qui allaient payer un overbet.' },
    ],
    lesson: 'Les overpairs sur boards connectés (8-9-T, 6-7-8) doivent être protégées par des bets larges ou overbets. La protection prime sur l\'extraction ici.',
    xp: 100,
  },

  {
    id: 'adv-03',
    level: 'avance',
    difficulty: 2,
    type: 'gto',
    title: 'Blocker river bluff',
    villain: VILLAINS.gto,
    context: {
      gameType: 'cash',
      blinds: '5€/10€',
      position: 'BTN vs BB (GTO)',
      effectiveStack: '100BB',
      street: 'river',
      pot: '80BB',
      heroHand: ['A♠', '2♠'],
      board: ['K♠', 'Q♠', 'J♠', 'T♠', '7♦'],
      action: 'Board : K♠ Q♠ J♠ T♠ 7♦. Tu as A♠ dans ta main. Villain GTO check river.',
    },
    question: 'Tu tiens l\'A♠ sur un board à 4 piques. Quel est l\'impact de ce "blocker" ?',
    options: [
      { label: 'Aucun — tu n\'as pas de flush toi-même', isCorrect: false, explanation: 'L\'As de pique DANS ta main signifie que villain ne peut PAS avoir de Royal Flush (A♠ K♠ Q♠ J♠ T♠). Tu bloques la nuts ! C\'est un avantage de bluff énorme.' },
      { label: 'Tu bloques la nuts de villain — bluff optimal', isCorrect: true, explanation: 'Parfait. L\'A♠ dans ta main élimine la Royal Flush de la range de villain. Sa range de "nuts" est réduite, donc ton bluff a plus de chance de fonctionner. Les blockers transforment les spots de bluff.' },
      { label: 'Tu bloques tes propres combos — ne bluff pas', isCorrect: false, explanation: 'Tu bloques les combos de VILLAIN, pas les tiens. L\'A♠ élimine Royal Flush de sa range. Tu peux bluff plus librement car il a moins souvent le nuts.' },
      { label: 'Le board est trop dangereux pour bluffer', isCorrect: false, explanation: 'Contre un joueur GTO, un board monotone est paradoxalement un bon spot de bluff avec l\'As du suit. Il doit défendre face à ta range, et tu bloques ses meilleures mains.' },
    ],
    lesson: 'Un "blocker" est une carte dans ta main qui réduit la probabilité que villain ait une main spécifique. Tenir l\'As du suit sur un board monotone est un blocker puissant pour bluffer.',
    xp: 110,
  },

  {
    id: 'adv-04',
    level: 'avance',
    difficulty: 2,
    type: 'icm',
    title: 'ICM : bulle de tournoi',
    villain: VILLAINS.nit,
    context: {
      gameType: 'tournament',
      blinds: '1000/2000',
      position: 'BTN vs BB (nit)',
      effectiveStack: '22BB',
      street: 'preflop',
      pot: '3BB',
      heroHand: ['Q♠', 'J♦'],
      board: [],
      action: 'Tournoi 180 joueurs, top 18 payés. 19 joueurs restants (bulle !). Nit BB all-in 22BB. Stacks : Hero 28BB, BB 22BB, Avg 25BB.',
    },
    question: 'Sur la bulle, nit BB push all-in 22BB. Tu as QJo en BTN. Call ou fold ?',
    options: [
      { label: 'Call — QJo est favori contre la range push d\'un nit', isCorrect: false, explanation: 'En terms de chip EV, peut-être. Mais l\'ICM change tout. Sur la bulle, sobrer est plus précieux que des chips. Un nit push 22BB = range très forte (TT+, AK+). Tu es souvent en mauvaise posture.' },
      { label: 'Fold — l\'ICM tax est trop important ici', isCorrect: true, explanation: 'Correct ! Sur la bulle, chaque chip perdu = moins de valeur ICM. Contre un nit (range push < 5% des mains), QJo est souvent dominé (AJ+, KQ+, TT+). Le fold préserve ta valeur ICM.' },
      { label: 'Call — tu dois pousser l\'avantage en chips', isCorrect: false, explanation: 'L\'avantage chip EV et l\'avantage ICM EV sont différents. Sur la bulle, risquer de buster pour quelques chips est -EV ICM même si tu es chipeq favoris.' },
      { label: 'Fold — QJo est toujours mauvais', isCorrect: false, explanation: 'QJo n\'est pas mauvais en soi. La raison de folder ici est spécifiquement l\'ICM de bulle + la range étroite du nit, pas la faiblesse de QJo de manière générale.' },
    ],
    lesson: 'L\'ICM (Independent Chip Model) modifie les décisions push/fold en tournoi. Sur une bulle, ta valeur augmente même sans jouer. Être conservateur face aux shorts stacks est souvent optimal.',
    xp: 110,
  },

  {
    id: 'adv-05',
    level: 'avance',
    difficulty: 2,
    type: 'decision',
    title: 'Check-raise bluff sur board sec',
    villain: VILLAINS.lag,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'BB vs CO (LAG)',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '15BB',
      heroHand: ['4♦', '5♦'],
      board: ['A♠', 'J♣', '2♦'],
      action: 'LAG CO open, tu call BB. Flop A-J-2. Tu checks. Villain c-bet 10BB (stats : c-bet 80%, fold to check-raise 62%).',
    },
    question: 'Avec 4-5 suited (gutshot au 3) face à un LAG qui c-bet 80% et fold 62% aux check-raises, check-raise ou call ?',
    options: [
      { label: 'Call — attendre la turn', isCorrect: false, explanation: 'Le call fonctionne, mais calcule le check-raise. EV check-raise = 0.62 × 15 - 0.38 × 20 = 9.3 - 7.6 = +1.7BB. Plus rentable que le call passif.' },
      { label: 'Check-raise à 28BB — semi-bluff optimal', isCorrect: true, explanation: 'Correct ! Le check-raise semi-bluff est +EV ici. Fold equity élevée (62%), gutshot au 3 pour outs réels si call, et tu représentes AX ou JX fortement. Le LAG doit souvent fold.' },
      { label: 'Fold — tu n\'as rien', isCorrect: false, explanation: 'Folder n\'est jamais nécessaire avec un gutshot + backdoor flush draw. Et le fold equity élevé de villain rend le check-raise très profitable.' },
      { label: 'Donk bet — prends l\'initiative', isCorrect: false, explanation: 'Donk-betting ici (bet avant villain) est une ligne moins standard contre un LAG qui c-bet fort. Le check-raise capture mieux le fold equity.' },
    ],
    lesson: 'Le check-raise bluff fonctionne quand trois conditions sont réunies : fold equity élevée, hand avec outs réels (semi-bluff), et board favorable pour ta range défensive.',
    mathNote: 'EV = 0.62 × 15BB - 0.38 × 20BB = 9.3 - 7.6 = +1.7BB. Positif même sans compter l\'equity du gutshot.',
    xp: 115,
  },

  {
    id: 'adv-06',
    level: 'avance',
    difficulty: 3,
    type: 'decision',
    title: 'Float en position',
    villain: VILLAINS.tag,
    context: {
      gameType: 'cash',
      blinds: '2€/5€',
      position: 'BTN vs CO (TAG)',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '20BB',
      heroHand: ['J♠', 'T♠'],
      board: ['A♥', '7♠', '2♣'],
      action: 'TAG CO open, tu call BTN. Flop A-7-2. TAG c-bet 12BB. Stats : triple barrel seulement 28%.',
    },
    question: 'JTs sur A-7-2. TAG c-bet. Il continue seulement 28% sur turn. Faut-il "floater" (appeler pour steal la turn) ?',
    options: [
      { label: 'Non — tu n\'as rien sur ce board', isCorrect: false, explanation: 'Le "float" n\'a pas besoin que tu aies une main forte. L\'idée est d\'appeler le flop avec l\'intention de prendre le pot sur la turn quand villain check.' },
      { label: 'Oui — le float IP est rentable si villain abandon souvent', isCorrect: true, explanation: 'Exact ! Si villain continue seulement 28% sur turn, il abandonne 72% du temps. En appuyant turn (ou river), tu prends ce pot souvent. JTs a aussi des backdoor outs. Float profitable.' },
      { label: 'Raise flop — mieux que le float', isCorrect: false, explanation: 'Le raise sur A-7-2 avec JTs est risqué. Villain a un range d\'Ax fort. Le float est plus safe et presque aussi rentable.' },
      { label: 'Fold — perdre 12BB est mieux que risquer plus', isCorrect: false, explanation: 'Avec des backdoor draws et une opportunité de steal claire sur turn, folder est trop tight. Le float est une ligne profitable ici.' },
    ],
    lesson: 'Le "float" est une call au flop avec l\'intention de prendre le pot sur une street ultérieure. Fonctionne quand : tu es en position, villain check souvent la turn, et tu as des outs de secours.',
    xp: 115,
  },

  {
    id: 'adv-07',
    level: 'avance',
    difficulty: 3,
    type: 'gto',
    title: 'Range polarisation',
    villain: VILLAINS.gto,
    context: {
      gameType: 'cash',
      blinds: '5€/10€',
      position: 'BTN vs BB (GTO)',
      effectiveStack: '100BB',
      street: 'river',
      pot: '100BB',
      heroHand: ['A♣', 'K♣'],
      board: ['A♦', 'K♠', '7♣', '3♥', '2♠'],
      action: 'Board final A-K-7-3-2. Tu tiens le top two pair (AK). Tu es à la décision river, villain check.',
    },
    question: 'Avec AK (top two pair) sur A-K-7-3-2, quelle sizing river est optimale selon la théorie GTO ?',
    options: [
      { label: 'Petit bet (25-33%) — maximum de calls', isCorrect: false, explanation: 'Un petit bet polarise mal. Il invite des calls avec mains faibles mais pas assez pour justifier ses bluffs dans ta range. Sous-optimal GTO.' },
      { label: 'Bet moyen (66%) — équilibre', isCorrect: false, explanation: 'Le bet moyen est correct en général, mais sur un board low comme A-K-7-3-2, une sizing plus grande maximise l\'extraction avec un two pair qui n\'est pas nuts (KK et AA existent).' },
      { label: 'Overbet (150%+) avec mix value/bluff', isCorrect: true, explanation: 'Sur A-K-7-3-2, l\'overbet GTO est fréquent. Ta range IP a un avantage de range fort. L\'overbet maximise l\'extraction des mains de valeur et permet d\'inclure des bluffs (A5s, K5s) à fréquence optimale.' },
      { label: 'Check derrière — prendre le pot gratuitement', isCorrect: false, explanation: 'Checker avec top two pair et un avantage de range IP est -EV. Tu laisses de la valeur et tu ne punis pas les mains de milieu de range de villain.' },
    ],
    lesson: 'L\'overbet river est une arme GTO puissante IP quand ta range a un gros avantage de range (nuts advantage). Avec des bluffs inclus à la bonne fréquence, il devient très difficile à contrer.',
    xp: 120,
  },

  {
    id: 'adv-08',
    level: 'avance',
    difficulty: 3,
    type: 'icm',
    title: 'Exploiter un short stack en bulle',
    villain: VILLAINS.nit,
    context: {
      gameType: 'tournament',
      blinds: '2000/4000',
      position: 'BTN vs BB',
      effectiveStack: '15BB',
      street: 'preflop',
      pot: '6BB',
      heroHand: ['7♦', '8♦'],
      board: [],
      action: 'Tournoi, bulle dans 3 joueurs. BB très court (8BB). Villain BB est un nit qui fold beaucoup. Tu es BTN avec 40BB.',
    },
    question: 'Tu as un gros stack en bulle, BB court stack nit. Pousser 78s depuis BTN ?',
    options: [
      { label: 'Non — 78s est trop faible pour shove', isCorrect: false, explanation: 'En ICM de bulle avec un court stack nit en BB, tu peux shove très largement. 78s a assez d\'equity même si call.' },
      { label: 'Oui — le fold equity + ICM rendent le shove profitable', isCorrect: true, explanation: 'Parfait. Contre un nit court stack en bulle, tu peux shover quasi 100% de tes mains. Même 78s : si il call, tu as ~35% equity. Si il fold (probable), tu prends 12BB. L\'ICM de bulle amplifie ta pression.' },
      { label: 'Open 2.5BB — plus de contrôle', isCorrect: false, explanation: 'Un open 2.5BB laisse villain jouer post-flop. Le shove force une décision difficile pour lui en ICM. Mieux de shove ici.' },
      { label: 'Fold — 78s rate trop souvent', isCorrect: false, explanation: 'L\'équité de la main importe moins que le fold equity en bulle. Contre un nit court stack, le shove est presque toujours rentable peu importe la main.' },
    ],
    lesson: 'En bulle, les gros stacks doivent pousser l\'avantage sur les courts stacks, surtout les nitro. L\'ICM signifie que les courts stacks fold beaucoup pour survivre — exploite-le !',
    xp: 125,
  },

  // ══════════════════════════════════════════════════════════
  // EXPERT (8 défis) — GTO, solver lines, ICM avancé, équilibre
  // ══════════════════════════════════════════════════════════

  {
    id: 'exp-01',
    level: 'expert',
    difficulty: 1,
    type: 'gto',
    title: 'Minimum Defense Frequency',
    villain: VILLAINS.gto,
    context: {
      gameType: 'cash',
      blinds: '5€/10€',
      position: 'BB vs BTN',
      effectiveStack: '100BB',
      street: 'river',
      pot: '100BB',
      heroHand: ['K♦', '9♠'],
      board: ['A♠', 'K♥', '7♦', '3♣', '2♠'],
      action: 'Villain GTO bet 50BB sur river (50% pot).',
    },
    question: 'Face à un bet 50% pot en river, quelle fraction de ta range dois-tu défendre pour ne pas être exploitable ?',
    options: [
      { label: '50% de ta range', isCorrect: false, explanation: 'Pas tout à fait. La formule MDF dépend du sizing : MDF = pot / (pot + bet). Ici 100 / (100+50) = 66.7%.' },
      { label: '66.7% de ta range', isCorrect: true, explanation: 'Exact ! MDF = pot / (pot + bet) = 100 / 150 = 66.7%. Si tu défends moins, villain peut bluffer n\'importe quelle main et toujours être +EV. Ta K9 sur AK-7-3-2 est probablement dans ta range de défense.' },
      { label: '75% de ta range', isCorrect: false, explanation: 'Trop élevé. MDF pour bet 50% pot = 100/150 = 66.7%, pas 75%. (75% correspond à bet 33% pot).' },
      { label: '33% de ta range', isCorrect: false, explanation: 'Bien trop bas. Si tu défends seulement 33%, villain peut bluffer toutes ses mains et gagner 67% du temps. Son profit serait énorme.' },
    ],
    lesson: 'MDF = Pot / (Pot + Bet). Plus la mise est petite, plus tu dois défendre. Pour bet 50% pot → 66.7%. Pour bet 100% pot → 50%. Cette formule garantit l\'équilibre théorique.',
    mathNote: 'MDF universel : MDF = 1 / (1 + bet_size_fraction). Pour bet 0.5x pot : 1/(1+0.5) = 66.7%.',
    xp: 120,
  },

  {
    id: 'exp-02',
    level: 'expert',
    difficulty: 2,
    type: 'gto',
    title: 'Fréquence de bluff optimale',
    villain: VILLAINS.gto,
    context: {
      gameType: 'cash',
      blinds: '5€/10€',
      position: 'BTN vs BB',
      effectiveStack: '100BB',
      street: 'river',
      pot: '100BB',
      heroHand: ['5♣', '5♦'],
      board: ['A♠', 'K♦', 'Q♠', 'J♥', '2♠'],
      action: 'Tu veux bluffer river avec 55 (missed everything). Tu envisages un bet 75% pot (75BB).',
    },
    question: 'Pour être GTO-balanced avec un bet river 75% pot, quelle ratio bluff/valeur dois-tu avoir ?',
    options: [
      { label: '1 bluff pour 1 main de valeur (50/50)', isCorrect: false, explanation: 'Non. La formule du ratio bluff/valeur dépend du sizing. Pour bet 75% pot : ratio = bet/(bet+pot) = 75/175 = 42.8% bluffs → environ 3 valeurs pour 2 bluffs.' },
      { label: '1 bluff pour 2 mains de valeur (33% bluffs)', isCorrect: false, explanation: 'Proche mais pas exact. Pour un bet 75% pot, le ratio optimal est ~42.8% bluffs, soit presque 3 bluffs pour 4 valeurs.' },
      { label: '2 bluffs pour 3 mains de valeur (40% bluffs environ)', isCorrect: true, explanation: 'Correct ! Pour bet 75% pot : ratio bluffs = bet / (bet + pot) = 75 / 175 ≈ 43%. Soit environ 3 bluffs pour 4 valeurs. Si tu as plus de bluffs, villain devrait call. Si moins, villain devrait fold.' },
      { label: '1 bluff pour 3 mains de valeur (25% bluffs)', isCorrect: false, explanation: 'Trop peu. Avec 25% de bluffs et bet 75% pot, villain fait +EV en foldant systématiquement. Tu serais exploitable par un over-folder.' },
    ],
    lesson: 'Ratio de bluff GTO = bet_size / (bet_size + pot). Gardez ce ratio constant pour rendre villain indifférent entre call et fold. C\'est l\'équilibre de Nash appliqué au poker.',
    mathNote: 'Bet 75% pot → 43% bluffs. Bet 50% pot → 33% bluffs. Bet 100% pot → 50% bluffs. Plus tu bet gros, plus tu peux bluffer.',
    xp: 130,
  },

  {
    id: 'exp-03',
    level: 'expert',
    difficulty: 2,
    type: 'decision',
    title: 'Solver line : bet ou check turn ?',
    villain: VILLAINS.gto,
    context: {
      gameType: 'cash',
      blinds: '5€/10€',
      position: 'BTN vs BB',
      effectiveStack: '100BB',
      street: 'turn',
      pot: '40BB',
      heroHand: ['T♠', '9♠'],
      board: ['T♦', '9♦', '6♣', 'K♠'],
      action: 'Tu as bet flop, villain call. Turn K♠. Villain check.',
    },
    question: 'Deux paires (T9) sur T-9-6-K. Le K est une "scare card" pour ta range. Le solver préfère...',
    options: [
      { label: 'Bet gros — tu as toujours une main forte', isCorrect: false, explanation: 'Avec T9 sur T-9-6-K, tu as deux paires mais le K vient de frapper la range de villain (KQ, KJ, KT). Bet gros ici n\'est pas la ligne solver car tu dois aussi protéger ta range check.' },
      { label: 'Check — le K profite plus à la range de villain', isCorrect: true, explanation: 'Exact ! Le K sur turn favorise la range de BB défense (KQ, KJ, KT, K6s...). Le solver suggère souvent de checker T9 ici et de laisser villain bet sa range de valeur, puis de call/raise.' },
      { label: 'Bet petit (25%) — bloquer les draws', isCorrect: false, explanation: 'Bet petit sur cette texture n\'est pas optimal. Tu n\'as pas besoin de bloquer (peu de draws après le K), et tu under-bet ta main tout en donnant pot odds aux draws restants.' },
      { label: 'All-in — protéger contre les backdoor draws', isCorrect: false, explanation: 'All-in avec T9 sur T-9-6-K est massif et peu nécessaire. Les backdoor draws sont rares après le K. Check ou bet calibré sont les lignes correctes.' },
    ],
    lesson: 'Quand une "scare card" tombe et favorise la range de l\'adversaire, checker avec tes mains fortes (pour protéger ton range check) est souvent la ligne solver. Cela équilibre ta range sur turn.',
    xp: 130,
  },

  {
    id: 'exp-04',
    level: 'expert',
    difficulty: 2,
    type: 'icm',
    title: 'ICM final table 3-handed',
    villain: VILLAINS.tag,
    context: {
      gameType: 'tournament',
      blinds: '5000/10000',
      position: 'SB vs BB',
      effectiveStack: '30BB',
      street: 'preflop',
      pot: '15000',
      heroHand: ['A♠', 'T♦'],
      board: [],
      action: 'Final table 3 joueurs. Payouts : 1er 8000€, 2ème 4000€, 3ème 2500€. Stacks : Hero (SB) 30BB, BB 25BB, BTN 45BB. Villain BB push all-in 25BB.',
    },
    question: 'ATo vs push all-in 25BB en SB, final table 3-handed. L\'analyse ICM dit quoi ?',
    options: [
      { label: 'Call — ATo est favori HU contre une range push 25BB', isCorrect: false, explanation: 'Chip EV peut être favorable, mais l\'ICM dit autre chose. Si tu perds, tu passes de 30BB à ~5BB et ta valeur ICM chute drastiquement près du min-cash.' },
      { label: 'Fold — trop de valeur ICM à risquer', isCorrect: true, explanation: 'Correct ! En ICM 3-handed, chaque chip vaut différemment selon le payout. Risquer 25BB vs BTN qui a 45BB pour appeler BB est souvent -EV ICM même avec ATo. Le fold preserve une valeur ICM significative.' },
      { label: 'Call — les payouts sont assez serrés pour justifier', isCorrect: false, explanation: 'Même avec payouts serrés, appeler ici met ta survie en jeu. L\'écart entre 2ème (4000€) et 3ème (2500€) = 1500€ de différence à préserver.' },
      { label: 'Call — ATo domine la range push d\'un BB random', isCorrect: false, explanation: 'Domination de range ≠ décision ICM correcte. Le fait que tu sois favori en chips ne signifie pas que l\'appel est +EV en termes de gain réel en euros.' },
    ],
    lesson: 'L\'ICM Final Table transforme complètement les décisions. Même une main comme ATo peut être un fold correct car la valeur en euros de chaque chip dépend du payout structure et des stacks en jeu.',
    xp: 135,
  },

  {
    id: 'exp-05',
    level: 'expert',
    difficulty: 3,
    type: 'gto',
    title: 'Equity réalisation OOP vs IP',
    villain: VILLAINS.gto,
    context: {
      gameType: 'cash',
      blinds: '5€/10€',
      position: 'BB vs BTN',
      effectiveStack: '100BB',
      street: 'preflop',
      pot: '7.5BB',
      heroHand: ['K♦', 'Q♣'],
      board: [],
      action: 'BTN (GTO) open 2.5BB. Action en BB avec KQo.',
    },
    question: 'KQo en BB : pourquoi réalise-t-il moins son equity hors position qu\'en position ?',
    options: [
      { label: 'KQo a moins d\'equity hors position mathématiquement', isCorrect: false, explanation: 'Faux. L\'equity d\'une main est fixe (dépend des cartes, pas de la position). KQo a la même equity raw qu\'on soit IP ou OOP. C\'est la RÉALISATION qui change.' },
      { label: 'OOP tu dois bet/check en aveugle — l\'adversaire a plus d\'info', isCorrect: true, explanation: 'Exact ! Hors position, tu dois agir avant de voir la réaction de villain. IP, tu vois son check/bet avant d\'agir. Cette information permet à villain d\'extraire plus de valeur et toi de réaliser moins ton equity nominale.' },
      { label: 'La position ne change pas l\'equity réalisée', isCorrect: false, explanation: 'Si, beaucoup. Les études solver montrent que les mains OOP réalisent typiquement 5-10% de moins de leur equity nominale qu\'IP, à cause du désavantage informationnel.' },
      { label: 'KQo est dominé par la range BTN IP', isCorrect: false, explanation: 'KQo bat beaucoup de la range BTN. Ce n\'est pas une question de domination mais d\'equity réalisation affectée par la position.' },
    ],
    lesson: 'L\'equity réalisation est l\'% de l\'équité nominale qu\'une main réalise réellement dans le jeu. OOP, tu réalises moins car tu agis en aveugle. IP, tu extrais plus car tu as l\'information en dernier.',
    mathNote: 'Les solvers ajustent les ranges d\'appel OOP pour cette raison — tu as besoin de plus d\'equity nominale pour justifier un call OOP qu\'IP.',
    xp: 140,
  },

  {
    id: 'exp-06',
    level: 'expert',
    difficulty: 3,
    type: 'gto',
    title: 'Cbet sur board avec range disadvantage',
    villain: VILLAINS.gto,
    context: {
      gameType: 'cash',
      blinds: '5€/10€',
      position: 'BTN vs BB',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '20BB',
      heroHand: ['A♦', 'J♠'],
      board: ['9♦', '8♦', '7♣'],
      action: 'Tu as 3-bet BTN vs BB call. Flop 9-8-7 tricolore. Villain GTO check.',
    },
    question: 'Sur 9-8-7, la range de BB (défenseur de blind) contient beaucoup de 9-8, 7-8, 6-5... Tu as un range disadvantage. Quelle stratégie ?',
    options: [
      { label: 'C-bet souvent — tu as l\'initiative', isCorrect: false, explanation: 'L\'initiative ne suffit pas. Sur 9-8-7, BB call a plus de sets, straights et two pairs que toi. C-bet fréquent = exploitable.' },
      { label: 'Check quasi-systématiquement — range disadvantage', isCorrect: true, explanation: 'Correct. Sur un board qui favorise beaucoup plus la range de BB que la tienne (9-8-7 connected), la théorie GTO suggère de checker très souvent avec toute ta range pour équilibrer. Tu évites d\'être exploité.' },
      { label: 'C-bet petit (25%) avec toute ta range', isCorrect: false, explanation: 'Le "small bet with whole range" peut fonctionner sur certains boards, mais sur 9-8-7 avec range disadvantage sévère, même un small c-bet systématique est exploitable.' },
      { label: 'C-bet uniquement les nuts (sets, straights)', isCorrect: false, explanation: 'C-bet uniquement les nuts te rend transparent. Villain peut fold quand tu bet et call/raise librement. Tu as besoin d\'une range équilibrée — ou de checker quasi-tout.' },
    ],
    lesson: 'Quand la range de l\'adversaire "frappe" plus le flop que la tienne (range disadvantage), la solution GTO est souvent de checker fréquemment toute ta range. Contre-intuitif mais crucial.',
    xp: 140,
  },

  {
    id: 'exp-07',
    level: 'expert',
    difficulty: 3,
    type: 'decision',
    title: 'Exploitation maximale d\'un over-folder',
    villain: VILLAINS.nit,
    context: {
      gameType: 'cash',
      blinds: '5€/10€',
      position: 'BTN vs CO (nit)',
      effectiveStack: '100BB',
      street: 'preflop',
      pot: '3BB',
      heroHand: ['7♣', '8♣'],
      board: [],
      action: 'Nit CO open 3BB. Stats : Fold to 3-bet = 78%. Action te parvient BTN avec 78s.',
    },
    question: 'Face à un nit qui fold 78% aux 3-bets, comment maximiser le profit avec 78s ?',
    options: [
      { label: 'Call — jouer post-flop avec une main connectée', isCorrect: false, explanation: 'Le call perd le fold equity énorme (78%). Tu veux exploiter cette stat, pas l\'ignorer.' },
      { label: '3-bet petit (7BB) — maximiser les folds', isCorrect: false, explanation: 'Un sizing trop petit peut induire des calls. Tu veux un sizing qui maximise la pression tout en restant crédible. 9-10BB est plus optimal.' },
      { label: '3-bet à 10BB — exploite la tendance fold maximalement', isCorrect: true, explanation: 'Parfait. EV 3-bet = 0.78 × 4.5BB (profit si fold) - 0.22 × 10BB (si call) = 3.51 - 2.2 = +1.31BB. Et si tu joues, 78s a des outs. L\'exploitation est maximale à ce sizing.' },
      { label: '3-bet all-in — pression maximale', isCorrect: false, explanation: 'All-in va faire folder trop souvent les mains que tu pourrais battre si call. Le sizing 10BB est optimal pour capturer le fold equity sans sur-bloquer.' },
    ],
    lesson: 'L\'exploitation d\'un over-folder se fait en 3-bettant large (pas all-in), avec des mains qui ont de l\'equity si call (suited connectors). Tu récoltes le fold equity ET tu joues correctement si il call.',
    mathNote: 'EV = P(fold) × gain_si_fold - P(call) × coût_si_call. Avec 78% fold : EV = 0.78 × 4.5 - 0.22 × 10 = +1.31BB par 3-bet.',
    xp: 135,
  },

  {
    id: 'exp-08',
    level: 'expert',
    difficulty: 3,
    type: 'gto',
    title: 'Fréquence de bet sur différents boards',
    villain: VILLAINS.gto,
    context: {
      gameType: 'cash',
      blinds: '5€/10€',
      position: 'BTN vs BB',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '20BB',
      heroHand: ['A♣', 'A♠'],
      board: ['A♦', '2♠', '7♣'],
      action: 'Tu as 3-bet BTN. BB call. Flop A-2-7. Villain check.',
    },
    question: 'AA sur A-2-7 rainbow avec un range advantage énorme. Quelle fréquence de c-bet le solver prescrit-il ?',
    options: [
      { label: '100% — tu as toujours une main ou un bluff', isCorrect: false, explanation: 'C-bet 100% te rend transparent et exploitable. Villain peut alors over-fold les mains médiocres et call/raise uniquement les bonnes mains.' },
      { label: '33-40% — bet sélectif avec les meilleures mains', isCorrect: false, explanation: 'Trop peu. Sur A-2-7 avec range advantage, le solver bet souvent plus fréquemment avec un sizing petit pour extraire de toute la range de villain.' },
      { label: '70-80% avec un sizing petit (25-33%) — range bet', isCorrect: true, explanation: 'Exact ! Sur un board "dry" où tu as l\'avantage de range massif (A-2-7), le solver préfère bet souvent avec un petit sizing. Cela extrait de la valeur de toute la range de villain et maintient la pression.' },
      { label: '50% — équilibre parfait', isCorrect: false, explanation: '50% est une approximation, mais pas la réponse solver précise. Sur A-2-7 avec range advantage, la fréquence est plus haute avec un petit bet (range bet strategy).' },
    ],
    lesson: 'Sur les boards secs où tu as l\'avantage de range (A-2-7 pour le 3-betteur), le solver prescrit souvent un "range bet" : bet fréquent avec un petit sizing. Tout le contraire des boards connectés.',
    xp: 140,
  },

  // ══════════════════════════════════════════════════════════
  // PROFESSIONNEL (8 défis) — Spots complexes, live tells, multiway, décisions haute pression
  // ══════════════════════════════════════════════════════════

  {
    id: 'pro-01',
    level: 'professionnel',
    difficulty: 2,
    type: 'decision',
    title: 'Multiway : changer de stratégie',
    villain: VILLAINS.fishAgg,
    context: {
      gameType: 'cash',
      blinds: '5€/10€',
      position: 'UTG vs CO, BTN (fish agressif)',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '35BB',
      heroHand: ['A♦', 'J♦'],
      board: ['J♠', 'T♥', '8♦'],
      action: 'Tu open UTG, CO fish appelle, BTN fish appelle. Pot 35BB, 3 joueurs. Flop J-T-8. Tu dois agir en premier.',
    },
    question: 'Top pair en multiway sur un board connecté. Tu dois agir en premier. Bet ou check ?',
    options: [
      { label: 'Bet 70% — extrais la valeur maximum', isCorrect: false, explanation: 'En multiway, bet 70% pot avec top pair sur J-T-8 est risqué. Tu feras face à deux adversaires et l\'un d\'eux a souvent un draw fort, une straight, ou un two pair. Tu sur-investis.' },
      { label: 'Check — laisse les fish bet et peux fold/call', isCorrect: true, explanation: 'Correct. En multiway OOP sur un board connecté, checker avec top pair est souvent optimal. Tu protèges ta range, gardes le pot petit avec une main vulnérable, et peux répondre à l\'action des fish.' },
      { label: 'Bet petit (25%) — protection à bas prix', isCorrect: false, explanation: 'Un small bet multiway n\'accomplit rien de positif. Tu charges peu les draws, tu n\'isoles personne. Le check est généralement supérieur.' },
      { label: 'All-in — prends le pot maintenant', isCorrect: false, explanation: 'All-in avec top pair sur J-T-8 en multiway est dramatiquement sur-investi. Tu seras appelé par des mains qui te battent (straight, two pair, set).' },
    ],
    lesson: 'En multiway, les mains de valeur moyenne (top pair) se jouent souvent passivement. Pot control et check sont fréquents car la probabilité d\'un adversaire fort augmente avec le nombre de joueurs.',
    xp: 150,
  },

  {
    id: 'pro-02',
    level: 'professionnel',
    difficulty: 2,
    type: 'reads',
    title: 'Live tell : le tremblement',
    villain: VILLAINS.fishAgg,
    context: {
      gameType: 'cash',
      blinds: '5€/10€',
      position: 'BB vs BTN',
      effectiveStack: '150BB',
      street: 'river',
      pot: '80BB',
      heroHand: ['A♣', 'A♦'],
      board: ['A♥', 'K♠', 'Q♦', 'J♥', '2♣'],
      action: 'Board A-K-Q-J-2. Tu as bet chaque street. River 2. Villain fish sort ses jetons pour call et tremble légèrement en les poussant.',
    },
    question: 'Tu as un set d\'As. Villain tremble légèrement en callant. Que signifie ce tell live classique ?',
    options: [
      { label: 'Il est nerveux car il bluff — fold est trop tard', isCorrect: false, explanation: 'Les joueurs qui tremblement en bluffant sont rares et expérimentés. Pour la grande majorité des joueurs, le tremblement = excitation, donc une main forte.' },
      { label: 'Il a une main très forte — il est excité', isCorrect: true, explanation: 'Correct. Le tremblement en live poker est presque toujours un signe d\'excitation avec une main très forte. Pour un fish, c\'est quasi-certain. Ici sur A-K-Q-J-2, il a probablement une straight ou le full house.' },
      { label: 'Tremblement = nervosité = bluff possible', isCorrect: false, explanation: 'Non. La nervosité de bluffeur se manifeste autrement (éviter le regard, raideur). Le tremblement physique = adrénaline d\'une grosse main chez la plupart des joueurs.' },
      { label: 'Impossible de lire ce tell — ignore-le', isCorrect: false, explanation: 'Le tell est fiable, surtout contre un fish non expérimenté. Avec un set d\'As sur A-K-Q-J-2, tu as un full house et tu bats la plupart de ses "bonnes" mains de toute façon.' },
    ],
    lesson: 'Le tremblement en live poker est l\'un des tells les plus fiables : excitation d\'une forte main. Un joueur qui bluff tremble rarement. Combine toujours le tell avec l\'analyse de ta propre main.',
    xp: 150,
  },

  {
    id: 'pro-03',
    level: 'professionnel',
    difficulty: 3,
    type: 'decision',
    title: 'Fold KK face à un 4-bet live',
    villain: VILLAINS.nitLive,
    context: {
      gameType: 'tournament',
      blinds: '5000/10000',
      position: 'BTN vs BB (nit live)',
      effectiveStack: '80BB',
      street: 'preflop',
      pot: '70000',
      heroHand: ['K♠', 'K♦'],
      board: [],
      action: 'Tu 3-bet BTN à 30BB avec KK. Villain nit live (VPIP 14%, PFR 6%, 4-bet en 10h : 0 fois) 4-bet shove all-in 80BB.',
    },
    question: 'KK vs 4-bet all-in d\'un nit live qui n\'a jamais 4-betté en 10 heures. Fold possible ?',
    options: [
      { label: 'Non — fold KK est toujours une erreur', isCorrect: false, explanation: 'Faux. Contre un nit live avec 4-bet range virtuellement = AA seulement, fold KK est correct. L\'information live sur le joueur prime sur la théorie générique.' },
      { label: 'Oui — un nit live 4-bet = AA pratiquement toujours', isCorrect: true, explanation: 'Exact ! Face à un nit live qui n\'a pas 4-betté en 10 heures, son range 4-bet = AA avec une précision de ~95%+. KK est ~18% favori vs AA. Fold ici est un play légendaire d\'exploitation.' },
      { label: 'Call — tu as toujours KK et 18% d\'equity vs AA', isCorrect: false, explanation: 'Mathématiquement KK a 18% vs AA, donc techniquement call avec equity. Mais si sa range = AA à 95%, tu perds 80BB avec seulement 18% de chance de gagner. Fold est meilleur EV.' },
      { label: 'Call — le fold equity perdu ne vaut pas le risque', isCorrect: false, explanation: 'La notion de fold equity ne s\'applique pas ici (c\'est un push vs notre 3-bet). La vraie question : est-ce que 18% equity justifie de risquer 80BB ? Contre un nit, non.' },
    ],
    lesson: 'L\'un des plays les plus avancés du poker : folder KK face à un 4-bet d\'un adversaire identifié comme n\'ayant que AA en 4-bet range. Phil Ivey et Ike Haxton ont fait ce fold au WSOP. L\'exploitation prime.',
    xp: 175,
  },

  {
    id: 'pro-04',
    level: 'professionnel',
    difficulty: 3,
    type: 'gto',
    title: 'Bet sizing avec range disadvantage IP',
    villain: VILLAINS.gto,
    context: {
      gameType: 'cash',
      blinds: '10€/20€',
      position: 'BTN vs BB',
      effectiveStack: '100BB',
      street: 'flop',
      pot: '60BB',
      heroHand: ['K♠', 'J♦'],
      board: ['K♦', 'Q♦', 'J♠'],
      action: 'Tu open BTN, BB GTO appelle. Flop K-Q-J deux diamants. Villain check. Ton range advantage est faible ici car BB défend avec KQ, QJ, KJ, T9, etc.',
    },
    question: 'Sur K-Q-J deux couleurs, range advantage faible IP. Quelle stratégie de sizing est optimale ?',
    options: [
      { label: 'Gros bet (80-100%) — protection contre les draws', isCorrect: false, explanation: 'Sur K-Q-J avec un range advantage faible, bet gros est risqué. Villain peut check-raise avec ses meilleures mains (sets, straights) et tu sur-investis avec tes mains moyennes.' },
      { label: 'Mix : checker parfois, bet petit parfois (25-33%)', isCorrect: true, explanation: 'Exact ! Avec range advantage faible sur un board humide, le solver mix entre checker (pour protéger range check) et small bet (pour extraire et prévenir les backdoors). L\'équilibre est clé.' },
      { label: 'Check systématiquement — range disadvantage', isCorrect: false, explanation: 'Checker tout ne représente pas bien ta range (tu as KK, QQ, KQ, KJ fort). La stratégie mixte est plus équilibrée.' },
      { label: 'Bet moyen (50%) systématiquement', isCorrect: false, explanation: 'Bet systématique 50% pot te rend prévisible. Le solver préfère une stratégie mixte check/bet pour équilibrer la range sur ce type de board.' },
    ],
    lesson: 'Sur les boards humides avec range advantage modéré, la stratégie solver est souvent mixte : une partie de ta range check, une autre bet petit. Cela protège ta range check et extrait de la valeur sans sur-exposer.',
    xp: 165,
  },

  {
    id: 'pro-05',
    level: 'professionnel',
    difficulty: 3,
    type: 'reads',
    title: 'Bet sizing tell : l\'overbet du fish',
    villain: VILLAINS.fish,
    context: {
      gameType: 'cash',
      blinds: '5€/10€',
      position: 'CO vs BB (fish)',
      effectiveStack: '120BB',
      street: 'river',
      pot: '60BB',
      heroHand: ['Q♦', 'Q♣'],
      board: ['A♠', '7♦', '2♣', '4♥', 'J♠'],
      action: 'Board A-7-2-4-J. Tu as joué passivement avec QQ. Fish BB overbet river 3x pot (180BB dans un pot de 60BB).',
    },
    question: 'Fish overbet 3x pot river avec QQ (overpair sur board à Ace). Que faire ?',
    options: [
      { label: 'Fold — overbet = nuts chez n\'importe quel joueur', isCorrect: false, explanation: 'Chez un joueur GTO, oui. Mais chez un fish, l\'overbet peut signifier n\'importe quoi : une paire d\'As, un two pair, ou même une tentative de "faire peur".' },
      { label: 'Call — un fish overbet peut avoir n\'importe quelle main', isCorrect: true, explanation: 'Correct. Contre un fish, les overbets ne sont pas calibrés GTO. Il peut overbet avec A-x (il pense que c\'est une bonne main), une paire plus faible, ou par instinct. QQ bats beaucoup de sa range. Call.' },
      { label: 'Raise — tu montres de la force', isCorrect: false, explanation: 'Raise face à un fish overbet est risqué. S\'il a AX ou mieux, il call facilement ton raise. Mieux vaut call pour rester dans le pot sans sur-investir si il a une main forte.' },
      { label: 'Fold — l\'As sur board rend QQ non-viable', isCorrect: false, explanation: 'QQ sur A-7-2-4-J est une main de bluff-catch acceptable contre un fish. Tu bats les overbets de "value" médiocre qu\'il peut faire (KK, JJ, 77, 44).' },
    ],
    lesson: 'Les tells de sizing (overbet fish) ne signifient pas la même chose que les overbets GTO. Un fish qui overbet peut avoir n\'importe quelle main qu\'il juge "forte". Adapte ton read au profil du joueur.',
    xp: 160,
  },

  {
    id: 'pro-06',
    level: 'professionnel',
    difficulty: 3,
    type: 'icm',
    title: 'Chip EV vs ICM EV — la différence',
    villain: VILLAINS.tag,
    context: {
      gameType: 'tournament',
      blinds: '10000/20000',
      position: 'BTN vs BB',
      effectiveStack: '25BB',
      street: 'preflop',
      pot: '30000',
      heroHand: ['5♦', '5♣'],
      board: [],
      action: 'MTT, 6 joueurs restants, top 5 payés. Bulle ! Stack Hero : 25BB. Villain BB push all-in 20BB. Tu couvres légèrement.',
    },
    question: '55 vs push all-in 20BB sur la bulle (6 joueurs, 5 payés). Chip EV dit call, ICM dit ?',
    options: [
      { label: 'ICM dit call aussi — même conclusion', isCorrect: false, explanation: 'Non. 55 vs push range all-in est environ 50/50 en chip EV. Mais sur la bulle, perdre = buster sans payer. L\'ICM pénalise fortement les risques de buste.' },
      { label: 'ICM dit fold — préserver la valeur de bulle', isCorrect: true, explanation: 'Exact ! Sur la bulle, passer à chaque niveau de payout vaut de l\'argent réel. Avec 55 et un race 50/50, risquer de buster sans payer est -EV ICM même si Chip EV est neutre. Le fold préserve une valeur certaine.' },
      { label: 'ICM dit raise — dominer le push', isCorrect: false, explanation: 'Tu ne peux pas re-raise un all-in avec moins de chips (il push 20BB, tu couvres légèrement = call ou fold seulement).' },
      { label: 'ICM est identique au chip EV dans cette situation', isCorrect: false, explanation: 'Jamais. L\'ICM diverge toujours du chip EV en présence d\'un payout structure, et spécialement sur la bulle où buster = "busted".' },
    ],
    lesson: 'Le Chip EV et l\'ICM EV ne coïncident qu\'en tête-à-tête (HU). Avec un payout structure, l\'ICM favorise les décisions conservatrices sur la bulle et les situations à enjeu élevé.',
    mathNote: '55 vs push random ≈ 50% equity. Sur bulle, perdre = 0€. Gagner = ~+5BB. Le fold value (min-cash garanti) peut valoir plus que le call risqué.',
    xp: 170,
  },

  {
    id: 'pro-07',
    level: 'professionnel',
    difficulty: 3,
    type: 'decision',
    title: 'Le soul read — décision ultime',
    villain: VILLAINS.tilt,
    context: {
      gameType: 'cash',
      blinds: '10€/20€',
      position: 'CO vs BB (tilter)',
      effectiveStack: '200BB',
      street: 'river',
      pot: '300BB',
      heroHand: ['A♦', '2♦'],
      board: ['A♠', '7♣', '2♥', 'J♦', '8♠'],
      action: 'Villain en tilt depuis 2h. Board A-7-2-J-8. Tu as deux paires (A2). Villain overbet river 2x pot (600BB) dans un pot 3-bet.',
    },
    question: 'Deux paires (A2) face à un overbet 2x pot d\'un joueur en tilt connu pour bluffer. Call ou fold ?',
    options: [
      { label: 'Fold — overbet 2x pot = nuts même pour un tilter', isCorrect: false, explanation: 'Les tilters cassent les règles de sizing. Un joueur en tilt peut overbet 2x avec n\'importe quelle main par frustration ou impulsion. Le fold systématique = se faire exploiter.' },
      { label: 'Call — le tilt justifie le call avec deux paires', isCorrect: true, explanation: 'Correct. Avec un "soul read" fort sur un tilter qui overbet massivement sans raison GTO, appeler deux paires est justifié. Le tilt modifie le mapping sizing → range. Ton read vaut autant que les mathématiques ici.' },
      { label: 'Fold — deux paires ne battent pas grand chose', isCorrect: false, explanation: 'Deux paires battent toute paire simple, tous les bluffs et les mains de milieu de range. C\'est une main forte. Folder face à un tilter connu est trop passif.' },
      { label: 'Raise all-in — maximise si il bluff', isCorrect: false, explanation: 'Un raise ici engage tout ton stack (200BB). S\'il a le nuts, tu perds tout. Le call capture son bluff sans risquer plus que nécessaire.' },
    ],
    lesson: 'Le "soul read" est la capacité à dévier de la théorie pure grâce à une lecture précise du joueur. Contre un tilter, les règles standard de sizing ne s\'appliquent plus. L\'information live est souveraine.',
    xp: 180,
  },

  {
    id: 'pro-08',
    level: 'professionnel',
    difficulty: 3,
    type: 'gto',
    title: 'Construction de range 4-bet',
    villain: VILLAINS.lag,
    context: {
      gameType: 'cash',
      blinds: '10€/20€',
      position: 'BTN vs CO (LAG)',
      effectiveStack: '100BB',
      street: 'preflop',
      pot: '9BB',
      heroHand: ['A♦', '5♦'],
      board: [],
      action: 'LAG CO 3-bet ta range ouverte à 27BB. Tu envisages un 4-bet bluff.',
    },
    question: 'Pour 4-bet bluff vs LAG, quelle main est idéale et pourquoi ?',
    options: [
      { label: 'KK — valeur pure, pas un bluff', isCorrect: false, explanation: 'KK est une main de valeur pour 4-bet, pas un bluff. La question porte sur les bluffs de 4-bet, pas la valeur.' },
      { label: 'A5s — blocker Ace + suited + playability si call', isCorrect: true, explanation: 'Exact ! A5s est la main idéale pour 4-bet bluff : l\'As bloque AA/AK de villain (ses meilleures mains pour call/5-bet), le suited donne de la playability si call, et le 5 permet une straight. Classique blocker-bluff.' },
      { label: '72o — la main la plus faible = le meilleur bluff', isCorrect: false, explanation: 'Faux. 72o sans blocker ni equity est le pire choix. Les bons bluffs de 4-bet ont des blockers (As) et de l\'equity si call. 72o n\'a rien de tout ça.' },
      { label: 'QJs — bonne main mais pas optimale pour bluff 4-bet', isCorrect: false, explanation: 'QJs a de l\'equity mais ne bloque pas AA/AK efficacement. Il est mieux joué comme call de 3-bet (pour la playability post-flop) que comme bluff 4-bet.' },
    ],
    lesson: 'Un 4-bet bluff optimal combine : blocker des mains fortes adverses (As bloque AA/AK), equity si call (suited, connected), et suffisamment de fold equity. A5s, A4s, A3s sont les bluffs de 4-bet classiques.',
    xp: 175,
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export const CHALLENGE_LEVEL_ORDER: ChallengeLevel[] = [
  'debutant', 'intermediaire', 'avance', 'expert', 'professionnel'
];

export function getUserLevel(completedLevels: Record<string, boolean>): ChallengeLevel {
  if (completedLevels['expert']) return 'professionnel';
  if (completedLevels['avance']) return 'expert';
  if (completedLevels['intermediaire']) return 'avance';
  if (completedLevels['debutant']) return 'intermediaire';
  return 'debutant';
}

export function getChallengesForLevel(level: ChallengeLevel): Challenge[] {
  return CHALLENGES.filter(c => c.level === level);
}

// Sélection déterministe par date + userId pour que chaque user ait son propre défi
export function selectDailyChallenge(
  level: ChallengeLevel,
  completedIds: string[],
  userId: string,
  date: string, // format "YYYY-MM-DD"
): Challenge {
  const pool = getChallengesForLevel(level).filter(c => !completedIds.includes(c.id));
  const seed = [...(userId + date)].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const eligible = pool.length > 0 ? pool : getChallengesForLevel(level); // reset si tout fait
  return eligible[seed % eligible.length];
}
