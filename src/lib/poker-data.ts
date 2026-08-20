export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

export interface Card {
  rank: Rank;
  suit: Suit;
  isRed: boolean;
}

export interface HandRanking {
  rank: number;
  name: string;
  nameEn: string;
  description: string;
  example: Card[];
  probability: string;
  frequency: string;
  emoji: string;
}

export interface PokerPosition {
  name: string;
  abbr: string;
  description: string;
  strategy: string;
  advantage: 'bad' | 'neutral' | 'good' | 'best';
}

export interface StartingHand {
  hand: string;
  category: 'premium' | 'strong' | 'playable' | 'speculative' | 'weak';
  action: string;
  equity: number;
  note: string;
}

export interface FamousHand {
  id: string;
  title: string;
  players: string[];
  year: number;
  tournament: string;
  potSize: string;
  description: string;
  heroHand: Card[];
  villainHand: Card[];
  board: Card[];
  heroAction: string;
  result: string;
  lesson: string;
  epicness: number;
}

export interface PokerTip {
  id: string;
  level: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  category: string;
  title: string;
  content: string;
  icon: string;
}

// ─── HAND RANKINGS ───────────────────────────────────────────────────────────

export const HAND_RANKINGS: HandRanking[] = [
  {
    rank: 1,
    name: 'Quinte Flush Royale',
    nameEn: 'Royal Flush',
    description: 'As, Roi, Dame, Valet, 10 de la même couleur. La main parfaite, absolument imbattable.',
    example: [
      { rank: 'A', suit: '♠', isRed: false },
      { rank: 'K', suit: '♠', isRed: false },
      { rank: 'Q', suit: '♠', isRed: false },
      { rank: 'J', suit: '♠', isRed: false },
      { rank: '10', suit: '♠', isRed: false },
    ],
    probability: '0.000154%',
    frequency: '1 sur 649 740 mains',
    emoji: '👑',
  },
  {
    rank: 2,
    name: 'Quinte Flush',
    nameEn: 'Straight Flush',
    description: '5 cartes consécutives de la même couleur. La deuxième main la plus forte possible.',
    example: [
      { rank: '9', suit: '♥', isRed: true },
      { rank: '8', suit: '♥', isRed: true },
      { rank: '7', suit: '♥', isRed: true },
      { rank: '6', suit: '♥', isRed: true },
      { rank: '5', suit: '♥', isRed: true },
    ],
    probability: '0.00139%',
    frequency: '1 sur 72 193 mains',
    emoji: '🔥',
  },
  {
    rank: 3,
    name: 'Carré',
    nameEn: 'Four of a Kind',
    description: '4 cartes du même rang. Quasi-invincible, perdez très rarement avec ça.',
    example: [
      { rank: 'A', suit: '♠', isRed: false },
      { rank: 'A', suit: '♥', isRed: true },
      { rank: 'A', suit: '♦', isRed: true },
      { rank: 'A', suit: '♣', isRed: false },
      { rank: 'K', suit: '♠', isRed: false },
    ],
    probability: '0.0240%',
    frequency: '1 sur 4 165 mains',
    emoji: '⚡',
  },
  {
    rank: 4,
    name: 'Full House',
    nameEn: 'Full House',
    description: 'Un brelan + une paire. Très forte main, souvent gagnante aux showdowns.',
    example: [
      { rank: 'K', suit: '♠', isRed: false },
      { rank: 'K', suit: '♥', isRed: true },
      { rank: 'K', suit: '♦', isRed: true },
      { rank: 'Q', suit: '♠', isRed: false },
      { rank: 'Q', suit: '♣', isRed: false },
    ],
    probability: '0.144%',
    frequency: '1 sur 694 mains',
    emoji: '🏠',
  },
  {
    rank: 5,
    name: 'Couleur',
    nameEn: 'Flush',
    description: '5 cartes de la même couleur non consécutives. Très souvent gagnante.',
    example: [
      { rank: 'A', suit: '♦', isRed: true },
      { rank: 'J', suit: '♦', isRed: true },
      { rank: '9', suit: '♦', isRed: true },
      { rank: '6', suit: '♦', isRed: true },
      { rank: '2', suit: '♦', isRed: true },
    ],
    probability: '0.197%',
    frequency: '1 sur 508 mains',
    emoji: '🎨',
  },
  {
    rank: 6,
    name: 'Quinte',
    nameEn: 'Straight',
    description: '5 cartes consécutives de couleurs différentes. La roue (A-2-3-4-5) est la plus basse.',
    example: [
      { rank: '8', suit: '♠', isRed: false },
      { rank: '7', suit: '♥', isRed: true },
      { rank: '6', suit: '♦', isRed: true },
      { rank: '5', suit: '♣', isRed: false },
      { rank: '4', suit: '♠', isRed: false },
    ],
    probability: '0.392%',
    frequency: '1 sur 255 mains',
    emoji: '➡️',
  },
  {
    rank: 7,
    name: 'Brelan',
    nameEn: 'Three of a Kind',
    description: '3 cartes du même rang. Bonne main, souvent gagnante en showdown.',
    example: [
      { rank: 'J', suit: '♠', isRed: false },
      { rank: 'J', suit: '♥', isRed: true },
      { rank: 'J', suit: '♦', isRed: true },
      { rank: 'A', suit: '♣', isRed: false },
      { rank: '7', suit: '♠', isRed: false },
    ],
    probability: '2.11%',
    frequency: '1 sur 47 mains',
    emoji: '3️⃣',
  },
  {
    rank: 8,
    name: 'Double Paire',
    nameEn: 'Two Pair',
    description: 'Deux paires différentes. Fréquente, attention aux boards dangereux.',
    example: [
      { rank: 'A', suit: '♠', isRed: false },
      { rank: 'A', suit: '♥', isRed: true },
      { rank: 'K', suit: '♦', isRed: true },
      { rank: 'K', suit: '♣', isRed: false },
      { rank: 'Q', suit: '♠', isRed: false },
    ],
    probability: '4.75%',
    frequency: '1 sur 21 mains',
    emoji: '2️⃣',
  },
  {
    rank: 9,
    name: 'Paire',
    nameEn: 'One Pair',
    description: 'Deux cartes du même rang. La main la plus commune. Sachez quand la jouer.',
    example: [
      { rank: 'Q', suit: '♠', isRed: false },
      { rank: 'Q', suit: '♥', isRed: true },
      { rank: 'A', suit: '♦', isRed: true },
      { rank: '8', suit: '♣', isRed: false },
      { rank: '3', suit: '♠', isRed: false },
    ],
    probability: '42.3%',
    frequency: '1 sur 2,37 mains',
    emoji: '✌️',
  },
  {
    rank: 10,
    name: 'Carte Haute',
    nameEn: 'High Card',
    description: 'Aucune combinaison. La carte la plus haute compte. La plupart du temps, c\'est un bluff ou un fold.',
    example: [
      { rank: 'A', suit: '♠', isRed: false },
      { rank: 'K', suit: '♥', isRed: true },
      { rank: 'J', suit: '♦', isRed: true },
      { rank: '7', suit: '♣', isRed: false },
      { rank: '2', suit: '♠', isRed: false },
    ],
    probability: '50.1%',
    frequency: '1 sur 2 mains',
    emoji: '🃏',
  },
];

// ─── POSITIONS ────────────────────────────────────────────────────────────────

export const POSITIONS: PokerPosition[] = [
  {
    name: 'Under The Gun',
    abbr: 'UTG',
    description: 'Premier à parler avant le flop. La pire position, vous devez agir avant tout le monde.',
    strategy: 'Jouez uniquement vos meilleures mains (AA, KK, QQ, JJ, AK, AQs). La position coûte cher ici.',
    advantage: 'bad',
  },
  {
    name: 'UTG+1 / Middle Position',
    abbr: 'MP',
    description: 'Légèrement meilleur, mais toujours early position. Encore beaucoup de joueurs à agir après vous.',
    strategy: 'Élargissez légèrement votre range : ajoutez TT, 99, AJs, KQs, AQo.',
    advantage: 'bad',
  },
  {
    name: 'Hijack',
    abbr: 'HJ',
    description: 'On commence à voir la lumière. 3 joueurs après vous au lieu de 6.',
    strategy: 'Ajoutez 88, 77, ATs, KJs, QJs, JTs. Votre range s\'élargit sensiblement.',
    advantage: 'neutral',
  },
  {
    name: 'Cutoff',
    abbr: 'CO',
    description: 'Excellente position. Seulement le BTN et les blinds après vous.',
    strategy: 'Range très large : 66+, A2s+, K9s+, QTs+, JTs, T9s, 98s, A9o+, KJo+, QJo.',
    advantage: 'good',
  },
  {
    name: 'Button',
    abbr: 'BTN',
    description: 'LA meilleure position au poker. Vous parlez en dernier à chaque street post-flop.',
    strategy: 'Open très large (40-50% des mains). Vous contrôlez le jeu. Profitez-en au maximum.',
    advantage: 'best',
  },
  {
    name: 'Small Blind',
    abbr: 'SB',
    description: 'Position désavantageuse post-flop malgré l\'avantage pré-flop partiel.',
    strategy: 'Position difficile. Défendez environ 40% de votre range en face d\'une raise BTN.',
    advantage: 'neutral',
  },
  {
    name: 'Big Blind',
    abbr: 'BB',
    description: 'Vous avez déjà misé 1 BB. Vous défendez souvent votre investissement.',
    strategy: 'Vous obtenez un discount. Défendez large (environ 50% face à une raise standard).',
    advantage: 'neutral',
  },
];

// ─── STARTING HANDS ──────────────────────────────────────────────────────────

export const STARTING_HANDS: StartingHand[] = [
  { hand: 'AA', category: 'premium', action: 'Toujours relancer, jamais limper', equity: 85, note: 'La main de départ la plus forte. Relancez toujours pre-flop.' },
  { hand: 'KK', category: 'premium', action: 'Toujours relancer', equity: 82, note: 'Attention uniquement à un As au flop.' },
  { hand: 'QQ', category: 'premium', action: 'Toujours relancer', equity: 80, note: 'Attention aux overcards A, K au flop.' },
  { hand: 'JJ', category: 'premium', action: 'Relancer, parfois 4-bet call', equity: 77, note: 'Difficile à jouer face aux overcards.' },
  { hand: 'AKs', category: 'premium', action: 'Toujours 3-bet / 4-bet', equity: 67, note: 'Meilleure main post-flop, draws puissants.' },
  { hand: 'TT', category: 'strong', action: 'Relancer, call 3-bet en position', equity: 75, note: 'Très forte mais vulnérable aux overcards.' },
  { hand: 'AQs', category: 'strong', action: 'Relancer, 3-bet contre CO/BTN', equity: 66, note: 'Excellente en position, délicate OOP.' },
  { hand: 'AKo', category: 'strong', action: 'Toujours relancer, 3-bet parfois', equity: 65, note: 'Puissante mais pas aussi forte que AKs.' },
  { hand: '99', category: 'strong', action: 'Relancer, appeler le 3-bet prudemment', equity: 72, note: 'Bonne main, prudence face aux 3-bets.' },
  { hand: 'AJs', category: 'strong', action: 'Relancer BTN/CO, call HJ', equity: 63, note: 'Très jouable en position.' },
  { hand: 'KQs', category: 'strong', action: 'Relancer, 3-bet parfois', equity: 61, note: 'Excellents draws, bonne value.' },
  { hand: '88', category: 'playable', action: 'Relancer, set mining', equity: 69, note: 'Jouez pour les sets.' },
  { hand: 'ATs', category: 'playable', action: 'Relancer position, call EP', equity: 61, note: 'Bon en position.' },
  { hand: 'KJs', category: 'playable', action: 'Relancer position', equity: 59, note: 'Bons draws, bonne valeur.' },
  { hand: 'QJs', category: 'playable', action: 'Relancer position', equity: 57, note: 'Hand de drawing puissante.' },
  { hand: 'JTs', category: 'playable', action: 'En position uniquement', equity: 56, note: 'Excellents draws.' },
  { hand: 'AQo', category: 'playable', action: 'Relancer, attention OOP', equity: 64, note: 'Puissant mais délicat sans position.' },
  { hand: '77', category: 'speculative', action: 'Set mining', equity: 66, note: 'Bonne si vous pouvez voir le flop pas cher.' },
  { hand: '66', category: 'speculative', action: 'Set mining seulement', equity: 63, note: 'Cherchez les sets cheap.' },
  { hand: 'T9s', category: 'speculative', action: 'Position, multi-way', equity: 54, note: 'Très bon en multiway en position.' },
  { hand: '98s', category: 'speculative', action: 'Position seulement', equity: 52, note: 'Drawing hand, besoin de position.' },
  { hand: 'A2s-A5s', category: 'speculative', action: 'Défense des blindes, late position', equity: 58, note: 'Potentiel de nut flush draw.' },
  { hand: 'KQo', category: 'playable', action: 'Relancer position', equity: 59, note: 'Bien mais pas aussi fort que KQs.' },
  { hand: '55-22', category: 'weak', action: 'Set mining seulement, pot odds', equity: 60, note: 'Besoin de gros implied odds.' },
];

// ─── FAMOUS HANDS ────────────────────────────────────────────────────────────

export const FAMOUS_HANDS: FamousHand[] = [
  {
    id: 'moneymaker-2003',
    title: 'Le Bluff qui a changé le poker',
    players: ['Chris Moneymaker', 'Sam Farha'],
    year: 2003,
    tournament: 'WSOP Main Event 2003, Table Finale',
    potSize: '$4,000,000 (prize pool)',
    description: 'Chris Moneymaker, comptable amateur ayant gagné sa place via un satellite à $39, affronte Sam Farha en heads-up lors des WSOP 2003. Moneymaker pull un bluff audacieux qui force Farha à folder ce qui semble être la meilleure main.',
    heroHand: [
      { rank: 'J', suit: '♠', isRed: false },
      { rank: '8', suit: '♣', isRed: false },
    ],
    villainHand: [
      { rank: 'Q', suit: '♦', isRed: true },
      { rank: '9', suit: '♦', isRed: true },
    ],
    board: [
      { rank: '10', suit: '♠', isRed: false },
      { rank: '9', suit: '♠', isRed: false },
      { rank: '2', suit: '♣', isRed: false },
      { rank: '6', suit: '♠', isRed: false },
      { rank: '8', suit: '♦', isRed: true },
    ],
    heroAction: 'All-in bluff sur la river avec une paire de 8 et un bas kicker',
    result: 'Farha fold sa paire de 9 meilleure. Moneymaker remporte le pot et finira champion du monde.',
    lesson: 'La représentation et la lecture des tendances adverses sont cruciales. Moneymaker avait analysé que Farha était vulnérable dans cette situation.',
    epicness: 10,
  },
  {
    id: 'ivey-bluff-2005',
    title: 'Phil Ivey, Le Bluff Parfait',
    players: ['Phil Ivey', 'Paul Jackson'],
    year: 2005,
    tournament: 'Monte Carlo Millions',
    potSize: '$800,000',
    description: 'Phil Ivey, souvent considéré comme le meilleur joueur de poker de tous les temps, exécute un bluff en triple barrel d\'une précision chirurgicale contre Paul Jackson avec une high card. La lecture d\'Ivey est parfaite, il sait que Jackson ne peut pas call.',
    heroHand: [
      { rank: '9', suit: '♦', isRed: true },
      { rank: '8', suit: '♦', isRed: true },
    ],
    villainHand: [
      { rank: 'J', suit: '♥', isRed: true },
      { rank: '6', suit: '♥', isRed: true },
    ],
    board: [
      { rank: 'A', suit: '♣', isRed: false },
      { rank: 'K', suit: '♠', isRed: false },
      { rank: '5', suit: '♦', isRed: true },
      { rank: '2', suit: '♣', isRed: false },
      { rank: '7', suit: '♦', isRed: true },
    ],
    heroAction: 'Bluff triple barrel représentant AA/KK/AK. Bet river $220,000.',
    result: 'Jackson fold. Ivey montre son bluff et sourit.',
    lesson: 'Les meilleurs bluffs racontent une histoire cohérente sur toutes les streets. Chaque bet doit représenter une main spécifique de manière crédible.',
    epicness: 10,
  },
  {
    id: 'isildur1-2009',
    title: 'Isildur1 vs Durrrr, Le Pot à 1.1M$',
    players: ['Viktor "Isildur1" Blom', 'Tom "Durrrr" Dwan'],
    year: 2009,
    tournament: 'Full Tilt Poker, High Stakes Online',
    potSize: '$1,107,085',
    description: 'Un des plus gros pots de l\'histoire du poker en ligne. Viktor Blom (Isildur1), 21 ans, affronte Tom Dwan dans ce qui devient le pot le plus spectaculaire jamais vu online. Les deux ont une part du pot avec des mains très fortes.',
    heroHand: [
      { rank: 'A', suit: '♠', isRed: false },
      { rank: 'A', suit: '♦', isRed: true },
    ],
    villainHand: [
      { rank: 'K', suit: '♣', isRed: false },
      { rank: 'K', suit: '♦', isRed: true },
    ],
    board: [
      { rank: 'K', suit: '♠', isRed: false },
      { rank: '2', suit: '♥', isRed: true },
      { rank: '2', suit: '♠', isRed: false },
      { rank: 'J', suit: '♦', isRed: true },
      { rank: '2', suit: '♦', isRed: true },
    ],
    heroAction: 'AA all-in pré-flop, dominé jusqu\'au turn. K au flop donne un set à Dwan.',
    result: 'Dwan remporte le pot avec un Full House Kings full of 2s. Isildur1 sort avec AA crackés.',
    lesson: 'Même les mains les plus fortes peuvent être battues. Le variance management et le bankroll management sont essentiels au plus haut niveau.',
    epicness: 10,
  },
  {
    id: 'negreanu-wsop-2004',
    title: 'Daniel Negreanu, The Call Down',
    players: ['Daniel Negreanu', 'John Juanda'],
    year: 2004,
    tournament: 'WSOP $2,500 Short-Handed NL Hold\'em',
    potSize: '$180,000',
    description: 'Negreanu lit parfaitement John Juanda et call avec une paire moyenne en sachant qu\'il est bon. Sa capacité à "voir" les cartes adverses lui vaut son surnom de "Kid Poker".',
    heroHand: [
      { rank: 'A', suit: '♥', isRed: true },
      { rank: '7', suit: '♥', isRed: true },
    ],
    villainHand: [
      { rank: 'K', suit: '♦', isRed: true },
      { rank: '9', suit: '♠', isRed: false },
    ],
    board: [
      { rank: '7', suit: '♦', isRed: true },
      { rank: '4', suit: '♣', isRed: false },
      { rank: '2', suit: '♠', isRed: false },
      { rank: '5', suit: '♥', isRed: true },
      { rank: 'J', suit: '♣', isRed: false },
    ],
    heroAction: 'Call river avec paire de 7 après avoir annoncé "tu as K-high"',
    result: 'Negreanu a raison. Il call et gagne le pot.',
    lesson: 'Les reads physiques et comportementaux sont un art. Observez tout : le timing, les mouvements, la respiration, les micro-expressions.',
    epicness: 9,
  },
  {
    id: 'chan-seidel-1988',
    title: 'Johnny Chan, La Lenteur Légendaire',
    players: ['Johnny Chan', 'Erik Seidel'],
    year: 1988,
    tournament: 'WSOP Main Event 1988, Table Finale',
    potSize: 'Championnat du Monde',
    description: 'Johnny Chan, champion en titre, affronte Erik Seidel en heads-up. Chan slowplay un set de manière si parfaite qu\'il force Seidel à bluffer et pousser avec une faible paire. Ce coup est immortalisé dans le film Rounders.',
    heroHand: [
      { rank: '9', suit: '♠', isRed: false },
      { rank: '9', suit: '♦', isRed: true },
    ],
    villainHand: [
      { rank: 'Q', suit: '♠', isRed: false },
      { rank: '7', suit: '♦', isRed: true },
    ],
    board: [
      { rank: '9', suit: '♥', isRed: true },
      { rank: '8', suit: '♣', isRed: false },
      { rank: '6', suit: '♣', isRed: false },
      { rank: '3', suit: '♦', isRed: true },
      { rank: 'J', suit: '♦', isRed: true },
    ],
    heroAction: 'Check, check, check... puis call all-in avec set de 9 sur la river.',
    result: 'Chan gagne son 2ème titre WSOP consécutif. Seidel sera plus tard un des meilleurs joueurs du monde.',
    lesson: 'Le slowplay est une arme puissante mais dangereuse. Utilisez-le quand vous êtes sûr que l\'adversaire va bluffer ou value-bet une main perdante.',
    epicness: 9,
  },
  {
    id: 'antonius-dwan-2009',
    title: 'Antonius vs Dwan, Pot Monstrueux PLO',
    players: ['Patrik Antonius', 'Tom Dwan'],
    year: 2009,
    tournament: 'Full Tilt High Stakes, Pot Limit Omaha',
    potSize: '$1,356,946',
    description: 'Le plus gros pot jamais diffusé à la télévision à l\'époque. Antonius et Dwan s\'affrontent dans ce qui restera comme l\'une des mains les plus explosives de l\'histoire du poker télévisé.',
    heroHand: [
      { rank: 'A', suit: '♠', isRed: false },
      { rank: 'A', suit: '♥', isRed: true },
    ],
    villainHand: [
      { rank: 'J', suit: '♥', isRed: true },
      { rank: '10', suit: '♥', isRed: true },
    ],
    board: [
      { rank: '7', suit: '♠', isRed: false },
      { rank: '6', suit: '♠', isRed: false },
      { rank: '5', suit: '♠', isRed: false },
      { rank: '8', suit: '♠', isRed: false },
      { rank: '9', suit: '♠', isRed: false },
    ],
    heroAction: 'All-in avec AA + redraw. Antonius avait AA, Dwan avait des draws massifs.',
    result: 'Une board complètement spectaculaire. Dwan remporte le pot avec une quinte flush.',
    lesson: 'En PLO, même AA peut être un underdog. Comprenez toujours votre equity réelle avant de pousser.',
    epicness: 10,
  },
];

// ─── PROBABILITY TABLES ──────────────────────────────────────────────────────

export const OUTS_TABLE = [
  { outs: 1, turnAndRiver: '4.3%', river: '2.2%', note: 'Backdoor runner-runner' },
  { outs: 2, turnAndRiver: '8.4%', river: '4.4%', note: 'Overcards contre une paire' },
  { outs: 3, turnAndRiver: '12.5%', river: '6.5%', note: 'Bottom set vs top set' },
  { outs: 4, turnAndRiver: '16.5%', river: '8.7%', note: 'Inside straight draw (gutshot)' },
  { outs: 5, turnAndRiver: '20.5%', river: '10.9%', note: 'Paire avec outs restants' },
  { outs: 6, turnAndRiver: '24.1%', river: '13.0%', note: 'Two overcards (2 suits each)' },
  { outs: 7, turnAndRiver: '27.8%', river: '15.2%', note: 'Inside straight + pair' },
  { outs: 8, turnAndRiver: '31.5%', river: '17.4%', note: 'Open-ended straight draw (OESD)' },
  { outs: 9, turnAndRiver: '35.0%', river: '19.6%', note: 'Flush draw' },
  { outs: 12, turnAndRiver: '45.0%', river: '26.1%', note: 'Flush draw + two overcards' },
  { outs: 15, turnAndRiver: '54.1%', river: '32.6%', note: 'OESD + flush draw' },
  { outs: 17, turnAndRiver: '59.8%', river: '37.0%', note: 'OESD + flush draw + pair' },
];

export const POT_ODDS_TABLE = [
  { sizing: '1/4 pot', callAmount: '25%', breakEven: '20%', interpretation: 'Call très large, besoin de peu d\'équité' },
  { sizing: '1/3 pot', callAmount: '25%', breakEven: '25%', interpretation: 'Call standard, flush draws rentables' },
  { sizing: '1/2 pot', callAmount: '33%', breakEven: '25%', interpretation: 'Draws avec 9 outs = borderline' },
  { sizing: '2/3 pot', callAmount: '40%', breakEven: '29%', interpretation: 'Besoin de bons draws' },
  { sizing: '3/4 pot', callAmount: '43%', breakEven: '30%', interpretation: 'Flush draw seul insuffisant' },
  { sizing: 'Pot', callAmount: '50%', breakEven: '33%', interpretation: 'OESD + flush draw seulement' },
  { sizing: '1.5x pot', callAmount: '60%', breakEven: '40%', interpretation: 'Besoin de near-nuts ou equity massive' },
  { sizing: 'All-in (2x pot)', callAmount: '67%', breakEven: '40%', interpretation: 'Call très serré, near nuts requis' },
];

// ─── POKER TIPS ───────────────────────────────────────────────────────────────

export const POKER_TIPS: PokerTip[] = [
  {
    id: 'tip-1',
    level: 'debutant',
    category: 'Sélection de mains',
    title: 'La patience est une vertu',
    content: 'Les débutants jouent trop de mains. En moyenne, un bon joueur joue seulement 15-25% de ses mains pré-flop. Le reste, c\'est des folds. La discipline de ne PAS jouer est aussi importante que de savoir comment jouer.',
    icon: '⏰',
  },
  {
    id: 'tip-2',
    level: 'debutant',
    category: 'Position',
    title: 'La position, c\'est le pouvoir',
    content: 'Être en position (parler en dernier) est un avantage énorme. Vous voyez ce que font vos adversaires avant de décider. Toujours. Jouez plus de mains en position, moins out of position.',
    icon: '🎯',
  },
  {
    id: 'tip-3',
    level: 'debutant',
    category: 'Taille des mises',
    title: 'Vos mises donnent de l\'information',
    content: 'Variez vos tailles de mises, mais pas en fonction de la force de vos mains. Si vous bet toujours 3x avec AA et 2x avec les mains moyennes, vos adversaires vous liront comme un livre.',
    icon: '📏',
  },
  {
    id: 'tip-4',
    level: 'intermediaire',
    category: 'Pot Odds',
    title: 'La règle des 2 et 4',
    content: 'Pour calculer rapidement vos chances : multipliez vos outs par 4 pour avoir votre équité sur 2 streets (turn + river), ou par 2 pour une seule street. 9 outs flush draw = ~36% sur 2 streets.',
    icon: '🧮',
  },
  {
    id: 'tip-5',
    level: 'intermediaire',
    category: 'Aggression',
    title: 'L\'agressivité est rentable',
    content: 'Au poker, vous pouvez gagner de deux façons : avoir la meilleure main, ou faire folder l\'adversaire. Les joueurs passifs ne peuvent gagner que d\'une façon. Soyez sélectivement agressif.',
    icon: '⚔️',
  },
  {
    id: 'tip-6',
    level: 'avance',
    category: 'GTO',
    title: 'Balanced vs Exploitative',
    content: 'Le GTO (Game Theory Optimal) vous rend non-exploitable. L\'exploitative play maximise contre des adversaires spécifiques. Contre les fish, exploitez. Contre les regs, approchez-vous du GTO.',
    icon: '⚖️',
  },
  {
    id: 'tip-7',
    level: 'avance',
    category: 'Ranges',
    title: 'Pensez en ranges, pas en mains',
    content: 'Les pros ne pensent pas "qu\'a-t-il?" mais "quelle est sa range dans cette situation?". Une range est l\'ensemble des mains possibles. Chaque action filtre et raffine la range adverse.',
    icon: '🎲',
  },
  {
    id: 'tip-8',
    level: 'expert',
    category: 'Mental Game',
    title: 'Gérer le tilt',
    content: 'Le tilt (jouer emotionnellement après une mauvaise beat) coûte plus cher que toutes les erreurs techniques combinées. Identifiez vos triggers, prenez des pauses, fixez des stop-loss quotidiens.',
    icon: '🧠',
  },
  {
    id: 'tip-9',
    level: 'expert',
    category: 'Bankroll',
    title: 'Gestion du bankroll',
    content: 'Rule of thumb : 20-30 buy-ins pour les cash games, 100+ pour les tournois. Ne montez pas de limites si vous n\'avez pas le bankroll. La variance existe et des downswings de 10+ buy-ins sont normaux.',
    icon: '💰',
  },
];

// ─── LEVEL CONFIG ─────────────────────────────────────────────────────────────

export type { Level } from './levels';
export { LEVELS } from './levels';

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  level: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    level: 'debutant',
    question: 'Quelle est la main la plus forte au poker ?',
    options: ['Carré d\'As', 'Quinte Flush Royale', 'Full House As sur Roi', 'Quinte Flush'],
    correctIndex: 1,
    explanation: 'La Quinte Flush Royale (A-K-Q-J-10 de la même couleur) est la main absolue, imbattable et la plus rare.',
  },
  {
    id: 'q2',
    level: 'debutant',
    question: 'Vous avez KK. Un joueur UTG relance 3x. Que faites-vous ?',
    options: ['Fold, trop risqué', 'Call, jouons passivement', '3-bet, entre 9x et 12x', 'All-in direct'],
    correctIndex: 2,
    explanation: 'KK est la 2e main la plus forte. Vous devez 3-bet pour construire le pot et protéger contre les mains comme AK ou QQ.',
  },
  {
    id: 'q_d3',
    level: 'debutant',
    question: "Vous êtes au BTN. Pourquoi agir en position (en dernier) est-il un avantage ?",
    options: ['Vous payez moins de blinds', 'Vous voyez les actions adverses avant de décider', 'Vous recevez de meilleures cartes', 'Vous pouvez voir le flop gratuitement'],
    correctIndex: 1,
    explanation: "Agir en dernier vous donne une information précieuse : vous savez si vos adversaires ont checké, misé ou relancé avant votre tour. Cette asymétrie d'information est l'un des avantages les plus puissants au poker.",
  },
  {
    id: 'q_d4',
    level: 'debutant',
    question: "Quelle est la différence principale entre un call et un raise préflop ?",
    options: ['Aucune différence', 'Le call suit la mise adverse ; le raise la surpasse et force les autres à payer plus', 'Le raise est toujours la meilleure option', 'Le call est interdit avec une bonne main'],
    correctIndex: 1,
    explanation: "Call = vous égalisez la mise actuelle. Raise = vous augmentez la mise, construisez le pot et mettez la pression sur vos adversaires. Avec une main forte, le raise est généralement préférable pour maximiser la valeur.",
  },
  {
    id: 'q_d5',
    level: 'debutant',
    question: "Qu'est-ce qu'un 'showdown' au poker ?",
    options: ['La phase de distribution des cartes', "La révélation des mains à la fin d'une main quand plusieurs joueurs sont encore actifs", 'Le moment où les blinds augmentent', 'La mise finale obligatoire'],
    correctIndex: 1,
    explanation: "Le showdown survient à la fin d'une main quand plusieurs joueurs restent actifs après la river. Ils retournent leurs cartes et la meilleure combinaison de 5 cartes (parmi les 2 en main + 5 du board) gagne le pot.",
  },
  {
    id: 'q3',
    level: 'intermediaire',
    question: 'Le pot est de 100€. Votre adversaire bet 50€. Quels pot odds avez-vous ?',
    options: ['25%', '33%', '50%', '67%'],
    correctIndex: 1,
    explanation: 'Call 50€ pour gagner 150€ (pot + bet). Pot odds = 50/150 = 33%. Votre équité doit dépasser 33% pour call de manière rentable.',
  },
  {
    id: 'q4',
    level: 'intermediaire',
    question: 'Vous avez un flush draw au flop (9 outs). Quelle est votre équité approximative sur 2 streets ?',
    options: ['18%', '27%', '36%', '45%'],
    correctIndex: 2,
    explanation: 'La règle des 2 et 4 : 9 outs × 4 = 36% sur turn + river. C\'est l\'approximation rapide des pros.',
  },
  {
    id: 'q_i3',
    level: 'intermediaire',
    question: "Qu'est-ce que le 'fold equity' ?",
    options: ["L'equity perdue quand vous foldez", 'La probabilité que votre adversaire fold face à votre mise ou relance', 'Le pourcentage de mains à folder', "L'equity résiduelle d'un tirage"],
    correctIndex: 1,
    explanation: "Le fold equity est la probabilité que votre adversaire abandonne face à votre agression. Il justifie les semi-bluffs et les 3-bets légers : vous pouvez gagner le pot immédiatement sans être la meilleure main.",
  },
  {
    id: 'q_i4',
    level: 'intermediaire',
    question: "Sur un board A♠K♦7♥ rainbow, vous avez ouvert préflop. Quelle est votre approche de c-bet ?",
    options: ['Ne jamais c-bet avec un board aussi haut', 'C-bet souvent car votre range contient AK, AQ, AA — vous avez le range advantage', 'Checker systématiquement pour piéger', 'All-in uniquement avec deux paires ou mieux'],
    correctIndex: 1,
    explanation: "Sur A-K-7 rainbow, votre range d'ouverture contient AK, AQ, AA, KK — des mains qui touchent fortement ce board. Votre range advantage vous permet de c-bet souvent avec un petit sizing pour extraire de la valeur et bluffer efficacement.",
  },
  {
    id: 'q_i5',
    level: 'intermediaire',
    question: "Un joueur passif (VPIP 45%, PFR 5%) bet 75% du pot au turn. Que suggère généralement ce bet ?",
    options: ['Un bluff probable', 'Une main très forte — les joueurs passifs ne bettent gros que pour valeur', 'Un tirage en cours', 'Un sizing aléatoire sans signification'],
    correctIndex: 1,
    explanation: "Les joueurs passifs (fort VPIP, faible PFR) ont tendance à ne pas bluffer. Quand ils bettent gros, c'est presque toujours avec une main forte (set, two pair, TPTK). Contre eux, respectez leurs gros bets et foldez les mains marginales.",
  },
  {
    id: 'q5',
    level: 'avance',
    question: 'Qu\'est-ce que l\'effet de blocage (blocker) en poker ?',
    options: [
      'Bloquer la vue des cartes adverses',
      'Avoir une carte qui réduit les combos de l\'adversaire dans une range spécifique',
      'Mise qui bloque les 3-bets adverses',
      'Position qui bloque l\'action',
    ],
    correctIndex: 1,
    explanation: 'Avoir un As dans sa main réduit le nombre de combos AA et AK dans la range adverse, ce qui peut influencer vos décisions de bluff ou de value.',
  },
  {
    id: 'q_a2',
    level: 'avance',
    question: "Vous avez J♠T♠ sur un flop T♥8♦6♠. Quelle est la meilleure description de votre situation ?",
    options: ['Bluff pur sans equity', 'Top pair avec gutshot (9 complète la quinte) — main à forte equity à jouer agressivement', 'Main de slowplay uniquement', 'Tirage flush uniquement'],
    correctIndex: 1,
    explanation: "JTs sur T-8-6 = TPTK + gutshot (9 complète J-T-9-8-7). C'est une main avec de multiples façons de gagner. Sur un board coordonné, bettez plutôt que de slowplay pour protéger votre equity et extraire de la valeur.",
  },
  {
    id: 'q_a3',
    level: 'avance',
    question: "Pourquoi inclure des bluffs dans sa range de 4-bet est-il nécessaire pour être non-exploitable ?",
    options: ['Les 4-bet bluffs ne devraient jamais exister', "Si vous ne 4-bettez que les nuts, les adversaires foldent toujours et ne payent jamais vos mains premium", 'Pour jouer plus de mains par heure', 'Pour impressionner vos adversaires'],
    correctIndex: 1,
    explanation: "Si vous ne 4-bettez qu'AA et KK, les adversaires identifient rapidement votre range et foldent systématiquement. Les 4-bet bluffs (idéalement avec blockers : A5s, KQs) forcent les adversaires à prendre de mauvaises décisions.",
  },
  {
    id: 'q_a4',
    level: 'avance',
    question: "Qu'est-ce que le MDF (Minimum Defense Frequency) ?",
    options: ['Le pourcentage de mains à ouvrir en UTG', 'La fréquence minimale à laquelle vous devez défendre face à une mise pour ne pas être exploitable', 'La fréquence optimale de c-bet', 'Le nombre de tables conseillé en multi-tabling'],
    correctIndex: 1,
    explanation: "MDF = 1 - (bet / (pot + bet)). Face à un bet 50% pot : MDF = 67%. Vous devez défendre au moins 67% de votre range. En dessous, l'adversaire peut bluffer 100% de sa range profitablement.",
  },
  {
    id: 'q_a5',
    level: 'avance',
    question: "Sur un board pairé (A♠A♦7♥), quel joueur a généralement le range advantage ?",
    options: ['Le caller (BB) car il défend plus de mains', "L'ouvreur / 3-betteur, dont la range peut contenir AA et Ax plus fréquemment que celle du caller", 'Les deux joueurs ont le même avantage', "Dépend uniquement du sizing utilisé"],
    correctIndex: 1,
    explanation: "Sur A-A-7, l'ouvreur peut avoir AA (rare mais présent dans sa range). Le caller a typiquement fold AA contre un 3-bet ou call, donc sa représentation est différente. Cet avantage de range permet à l'ouvreur d'overbetter fréquemment.",
  },
  {
    id: 'q6',
    level: 'expert',
    question: 'En ICM (Independent Chip Model), pourquoi est-il souvent mauvais d\'appeler un all-in borderline proche de la bulle ?',
    options: [
      'Les jetons ne valent pas leur valeur nominale en tournoi',
      'L\'adversaire a toujours les meilleures mains',
      'Les blinds sont trop élevés',
      'La règle ICM interdit ces calls',
    ],
    correctIndex: 0,
    explanation: 'En ICM, les jetons que vous gagnez valent moins que ceux que vous perdez, car la survival equity (rester en vie) est précieuse. Doubler ne double pas votre prize equity.',
  },
  {
    id: 'q_e2',
    level: 'expert',
    question: "Qu'est-ce que le 'Nash Equilibrium' appliqué au poker ?",
    options: ['Jouer toujours la même action avec toutes les mains', "Un état où aucun joueur ne peut améliorer son EV en changeant unilatéralement sa stratégie", 'Toujours jouer GTO quelles que soient les tendances adverses', 'Une stratégie purement exploitative'],
    correctIndex: 1,
    explanation: "L'équilibre de Nash est le fondement mathématique du GTO poker. Chaque joueur joue une stratégie optimale face à celle de l'adversaire, telle qu'aucune déviation unilatérale ne peut améliorer l'espérance. Les solvers cherchent cet équilibre.",
  },
  {
    id: 'q_e3',
    level: 'expert',
    question: "Comment construire une range de 3-bet équilibrée en position face à un CO open ?",
    options: ['3-bettez uniquement AA et KK pour valeur pure', '3-bettez des mains premium (AA-QQ, AKs) + des bluffs avec blockers et equity résiduelle (A5s, KQs)', 'Faites du 3-bet avec toutes les mains suited pour la variété', '3-bettez aléatoirement pour rester imprévisible'],
    correctIndex: 1,
    explanation: "Une range 3-bet IP équilibrée : value (AA, KK, QQ, AKs) + bluffs sélectionnés avec blockers (A5s, A4s — réduisent les combos AA/AK adverses) et equity résiduelle. Cette construction rend l'adversaire indifférent entre call et fold.",
  },
  {
    id: 'q_e4',
    level: 'expert',
    question: "Après 30 000 mains en downswing, quelle est la réponse professionnelle appropriée ?",
    options: ['Monter de stakes pour récupérer les pertes plus vite', 'Analyser les leaks potentiels, maintenir le bankroll management, et accepter la variance normale', 'Arrêter le poker pour une longue période', 'Jouer plus heures par jour pour compenser'],
    correctIndex: 1,
    explanation: "Un downswing de 30 000 mains est dans la variance normale au poker. La réponse professionnelle : reviewer les spots difficiles pour identifier les leaks, vérifier que votre EV winrate reste positif, et maintenir une bankroll saine (20+ buy-ins minimum).",
  },
  {
    id: 'q_e5',
    level: 'expert',
    question: "Pourquoi le 'node locking' dans un solver est-il un outil d'étude puissant ?",
    options: ['Cela accélère le calcul du solver', "Cela permet de forcer l'adversaire à jouer une stratégie fixe (exploitable) et voir la réponse optimale contre lui", 'Cela simplifie les calculs GTO en réduisant les options', 'Cela est réservé à l\'analyse de tournois uniquement'],
    correctIndex: 1,
    explanation: "Le node locking force l'adversaire dans le solver à jouer une stratégie non-optimale (ex: fold trop souvent sur la river). Le solver recalcule alors la stratégie exploitative optimale contre cette tendance. C'est l'outil idéal pour modéliser l'exploitation d'un profil de joueur spécifique.",
  },
];

// ─── MODULE QUIZZES ───────────────────────────────────────────────────────────

export const MODULE_QUIZZES: Record<string, { question: string; options: string[]; correctIndex: number; explanation: string }[]> = {

  // DÉBUTANT
  'debutant-regles': [
    { question: 'Combien de cartes communes sont révélées au total en Texas Hold\'em ?', options: ['3', '4', '5', '6'], correctIndex: 2, explanation: 'Le board comprend 5 cartes : 3 au flop, 1 au turn, 1 à la river.' },
    { question: 'Quelle est la première action possible au poker ?', options: ['Bet', 'Check ou Fold ou Call', 'All-in uniquement', 'Raise obligatoire'], correctIndex: 1, explanation: 'Préflop, le premier joueur peut fold, call (les blinds) ou raise. Les check ne sont possibles que si personne n\'a misé.' },
    { question: 'Que signifie "poster les blinds" ?', options: ['Regarder ses cartes en secret', 'Placer des mises obligatoires avant la distribution', 'Choisir sa position à la table', 'Décider de l\'ordre de jeu'], correctIndex: 1, explanation: 'Les blinds (small blind et big blind) sont des mises obligatoires placées avant la distribution pour garantir qu\'il y a toujours de l\'argent en jeu.' },
    { question: 'Qu\'est-ce que le showdown ?', options: ['La première mise du tour', 'La révélation des mains en fin de main quand plusieurs joueurs sont encore actifs', 'Une mise obligatoire supplémentaire', 'Le moment où les cartes sont distribuées'], correctIndex: 1, explanation: 'Le showdown a lieu après la river quand plusieurs joueurs n\'ont pas foldé. Chaque joueur retourne ses cartes et la meilleure combinaison de 5 cartes (2 en main + 5 du board) gagne le pot.' },
    { question: 'Préflop, dans quel ordre les joueurs agissent-ils ?', options: ['Le dealer agit en premier', 'Le joueur à gauche du big blind (UTG) agit en premier, puis dans le sens horaire', 'Le big blind agit toujours en premier', 'L\'ordre est tiré au sort'], correctIndex: 1, explanation: 'Préflop, l\'action commence à gauche du BB (UTG) et tourne dans le sens horaire. Le BB agit en dernier préflop, mais en premier postflop s\'il est le seul blind restant.' },
  ],

  'debutant-mains': [
    { question: 'Quelle main bat un Full House ?', options: ['Deux paires', 'Brelan', 'Carré', 'Quinte'], correctIndex: 2, explanation: 'Le carré (4 cartes de même rang) bat le full house. Seules la quinte flush et la quinte flush royale le battent aussi.' },
    { question: 'Vous avez 7♠7♦ et le board est 7♣K♠2♥. Quelle main avez-vous ?', options: ['Deux paires', 'Brelan', 'Set (brelan par la paire)', 'Quinte'], correctIndex: 2, explanation: 'Un SET est un brelan formé avec une paire en main + une carte du board. C\'est la main la plus cachée et dangereuse car difficile à lire.' },
    { question: 'Entre une couleur (flush) et une suite (straight), laquelle est plus forte ?', options: ['La suite', 'La couleur', 'Elles sont égales', 'Dépend des cartes'], correctIndex: 1, explanation: 'La couleur (5 cartes de même couleur) bat la suite (5 cartes consécutives). Plus une main est rare, plus elle est forte.' },
    { question: 'Qu\'est-ce qu\'un kicker et quand sert-il ?', options: ['Une carte spéciale du dealer', 'La carte la plus haute non pairée qui départage deux mains identiques', 'La première carte distribuée', 'Un bonus si vous faites une couleur'], correctIndex: 1, explanation: 'Le kicker est utilisé quand deux joueurs ont la même paire ou brelan. Exemple : A♠A♦K♥ bat A♣A♥J♦ car K > J. Le kicker peut faire la différence dans de nombreux pots.' },
    { question: 'Vous avez 7♠7♦7♣ (brelan) et votre adversaire a 8♠8♦8♣ (brelan d\'8). Qui gagne ?', options: ['Égalité — les brelans sont identiques', 'Vous gagnez — le 7 est impair', 'Votre adversaire gagne — le brelan de 8 est plus élevé', 'Le board décide'], correctIndex: 2, explanation: 'Pour les mains de même catégorie, la valeur du rang compte : brelan de 8 > brelan de 7. C\'est vrai pour toutes les mains : la paire la plus haute gagne, le full house avec le brelan le plus haut gagne, etc.' },
  ],

  'debutant-positions': [
    { question: 'Quelle est la meilleure position postflop en 6-max ?', options: ['Small Blind', 'Big Blind', 'UTG', 'Button (BTN)'], correctIndex: 3, explanation: 'Le BTN agit en dernier sur toutes les streets postflop. Cette information est un avantage majeur, vous voyez les actions adverses avant de décider.' },
    { question: 'Pourquoi la Small Blind est-elle la pire position ?', options: ['Elle paie plus de blinds', 'Elle agit en premier postflop sur toutes les streets', 'Elle ne peut pas raise', 'Elle voit moins de cartes'], correctIndex: 1, explanation: 'SB agit avant tous les joueurs actifs à chaque street postflop, sans information sur leurs actions. C\'est un désavantage structurel majeur.' },
    { question: 'En 6-max, combien de joueurs actifs maximum y a-t-il préflop après un open UTG si tout le monde call ?', options: ['3', '4', '5', '6'], correctIndex: 3, explanation: 'En 6-max : UTG, HJ, CO, BTN, SB, BB = 6 joueurs maximum. Si UTG open et tout le monde call, 6 joueurs voient le flop.' },
    { question: 'Qu\'est-ce que jouer "OOP" (Out Of Position) signifie concrètement ?', options: ['Jouer avec une mauvaise main', 'Agir avant vos adversaires postflop, sans information sur leurs intentions', 'Être en position de force', 'Avoir la meilleure position à table'], correctIndex: 1, explanation: 'OOP = vous agissez avant vos adversaires sur chaque street postflop. Vous devez décider sans savoir s\'ils vont checker, miser ou relancer. C\'est un désavantage structurel qui justifie un jeu plus conservateur.' },
    { question: 'Pourquoi le CO (CutOff) est-il une position favorable ?', options: ['Le CO paie la moitié du big blind', 'Le CO est juste avant le BTN — il a position sur la majorité des joueurs et une range d\'ouverture large', 'Le CO voit ses cartes en premier', 'Le CO peut checker gratuitement au flop'], correctIndex: 1, explanation: 'Le CO est la 2ème meilleure position (après le BTN). Il a position sur SB et BB postflop, et HJ/UTG ont souvent foldé. Cela permet d\'ouvrir une range large (environ 25-30% des mains en 6-max).' },
  ],

  'debutant-actions': [
    { question: 'Quand peut-on checker ?', options: ['Toujours', 'Uniquement si personne n\'a misé avant vous', 'Seulement préflop', 'Seulement avec une bonne main'], correctIndex: 1, explanation: 'Le check n\'est possible que si aucune mise n\'a été placée lors du tour courant. Sinon, vous devez call, raise ou fold.' },
    { question: 'Qu\'est-ce qu\'un "3-bet" ?', options: ['La troisième carte du board', 'Un raise du raise initial', 'Miser 3 fois les blinds', 'La troisième street'], correctIndex: 1, explanation: 'Open = 1ère mise. Re-raise = 2-bet. 3-bet = relance du re-raise. La numérotation compte les actions, pas les montants.' },
    { question: 'Vous avez misé 10BB, l\'adversaire raise à 30BB. Combien payez-vous pour call ?', options: ['30BB', '20BB', '10BB', '40BB'], correctIndex: 1, explanation: 'Vous avez déjà investi 10BB. Pour call, vous payez la différence : 30BB - 10BB = 20BB supplémentaires.' },
    { question: 'Qu\'est-ce qu\'un "4-bet" et quand l\'utiliser ?', options: ['Miser 4 fois les blinds', 'Relancer un 3-bet — la 4ème mise de la séquence, utilisée avec les mains premium ou comme bluff avec blockers', 'La 4ème street du poker', 'Un bet égal à 4% du stack'], correctIndex: 1, explanation: 'Open = 1ère mise, 3-bet = relance de l\'open, 4-bet = relance du 3-bet. On 4-bette avec les mains très fortes (AA, KK) et parfois des bluffs stratégiques comme A5s (blocker As) pour rester équilibré.' },
    { question: 'Quand peut-on "check-raise" et quel est le but ?', options: ['Uniquement au préflop', 'Checker puis relancer quand l\'adversaire mise — pour construire le pot avec une main forte ou comme bluff', 'Seulement si on a la meilleure main', 'Seulement sur la river'], correctIndex: 1, explanation: 'Le check-raise : vous checkez d\'abord, l\'adversaire mise, vous relancez. Avec une main forte, cela construit le pot et peut piéger l\'adversaire. Comme bluff (semi-bluff sur un tirage), cela donne de la fold equity.' },
  ],

  'debutant-selection': [
    { question: 'Quelle main est généralement trop faible pour ouvrir en UTG 6-max ?', options: ['AKo', 'QQ', '72o', 'AJs'], correctIndex: 2, explanation: '72o (sept-deux offsuit) est la pire main possible au Texas Hold\'em. En UTG avec 5 joueurs derrière, uniquement les mains premium sont jouables.' },
    { question: 'Pourquoi joue-t-on plus large au BTN qu\'en UTG ?', options: ['Les blinds sont plus petits', 'On a position sur tous les joueurs postflop', 'Les cartes sont meilleures', 'Il y a moins de joueurs'], correctIndex: 1, explanation: 'Au BTN, vous jouez en position sur TOUS les adversaires actifs postflop. Cet avantage compense des mains plus faibles.' },
    { question: 'Que signifie "s" dans "AKs" ?', options: ['Strong (fort)', 'Suited (de même couleur)', 'Short (court stack)', 'Semi-bluff'], correctIndex: 1, explanation: '"s" = suited = même couleur. AKs = As et Roi de même couleur. "o" = offsuit = couleurs différentes. AKs est légèrement meilleur que AKo car il peut faire une couleur.' },
    { question: 'Pourquoi les suited connectors comme 7♠8♠ ont-ils de la valeur malgré leur faiblesse brute ?', options: ['Ils gagnent souvent sans showdown', 'Ils peuvent faire des quintes et des couleurs cachées — des mains à forte valeur implicite (implied odds) qui piègent les adversaires', 'Ils bloquent les grosses mains adverses', 'Ils ont plus d\'equity que les grosses paires'], correctIndex: 1, explanation: 'Les suited connectors font des quintes et des couleurs difficiles à lire. Quand ils arrivent (environ 8-12% du temps), ils peuvent gagner le stack entier d\'un adversaire qui a une grosse paire. Leurs implied odds compensent leur faiblesse brute.' },
    { question: 'En 6-max, quelle est approximativement la range d\'ouverture recommandée au BTN ?', options: ['Uniquement les 10% de meilleures mains (TT+, AQs+)', 'Environ 40-50% des mains — le BTN joue très large grâce à sa position', 'Toutes les mains (100%)', 'La même range qu\'en UTG'], correctIndex: 1, explanation: 'Au BTN, vous avez position sur tous les joueurs actifs postflop. Cela justifie d\'ouvrir environ 40-50% des mains en 6-max. Plus la position est avantageuse, plus vous pouvez jouer large.' },
  ],

  // INTERMÉDIAIRE
  'intermediaire-potodds': [
    { question: 'Pot = 80BB, adversaire bet 40BB. Quelle equity minimale pour call ?', options: ['25%', '33%', '50%', '40%'], correctIndex: 1, explanation: 'Equity requise = call / (pot + call) = 40 / (80 + 40 + 40) = 40/160 = 25%... Attention : pot total après call = 80 + 40 + 40 = 160. Donc 40/160 = 25%. Hmm, recalculons : vous payez 40BB pour un pot de 120BB → 40/160 = 25%. Réponse : 33% correspond à une bet de 50% pot. Ici bet = 50% pot (40/80), donc equity requise ≈ 33%.' },
    { question: 'Vous avez un flush draw (9 outs) au flop. L\'adversaire bet 50% pot. Devriez-vous call ?', options: ['Non, 9 outs c\'est trop peu', 'Oui, 36% equity > 25% requis pour un bet 50% pot', 'Seulement si vous avez position', 'Jamais avec un tirage'], correctIndex: 1, explanation: '9 outs × 4 = 36% equity sur 2 cartes. Un bet 50% pot requiert 33% equity. 36% > 33% : call légèrement +EV.' },
    { question: 'Que sont les "implied odds" ?', options: ['Les cotes actuelles du pot', 'Les gains futurs potentiels si le tirage se complète', 'La probabilité de bluffer', 'Le ratio mise/stack'], correctIndex: 1, explanation: 'Les implied odds intègrent l\'argent que vous pourriez gagner sur les streets suivantes si votre tirage arrive. Ils justifient des calls défavorables en pot odds direct.' },
    { question: 'Pot = 100BB, adversaire mise all-in pour 200BB supplémentaires. Quelle equity minimale pour call ?', options: ['33%', '50%', '40%', '25%'], correctIndex: 2, explanation: 'Vous payez 200BB pour un pot total de 100 + 200 + 200 = 500BB. Equity requise = 200/500 = 40%. Si votre equity dépasse 40%, le call est +EV.' },
    { question: 'Quand les implied odds justifient-ils un call mathématiquement négatif en pot odds purs ?', options: ['Jamais — les pot odds sont toujours suffisants', 'Quand vous pouvez raisonnablement gagner assez sur les streets suivantes pour compenser le déficit actuel', 'Toujours avec un tirage flush', 'Uniquement si l\'adversaire est passif'], correctIndex: 1, explanation: 'Si vos pot odds directs sont 25% mais votre equity 20%, le call est -EV en isolation. Mais si, quand vous complétez, vous gagnez régulièrement un gros pot supplémentaire, les implied odds peuvent rendre le call +EV globalement.' },
  ],

  'intermediaire-ev': [
    { question: 'Votre EV est positive si...', options: ['Vous gagnez plus de 50% des mains', 'Votre gain espéré sur le long terme est positif', 'Vous ne bluffez jamais', 'Vous jouez uniquement les nuts'], correctIndex: 1, explanation: 'L\'EV (Expected Value) mesure le gain moyen sur le long terme, pas le résultat d\'une seule main. Une action +EV peut perdre à court terme mais gagne sur des milliers de mains.' },
    { question: 'Push all-in avec 55% d\'equity pour un pot de 100BB. Quelle est votre EV approximative ?', options: ['+5BB', '+10BB', '+55BB', '+100BB'], correctIndex: 1, explanation: 'EV ≈ 0.55 × 100 - 0.45 × 100 = 55 - 45 = +10BB (simplification sans compter les mises déjà investies).' },
    { question: 'Pourquoi une décision peut être +EV mais perdre à court terme ?', options: ['Parce que le poker est injuste', 'À cause de la variance, le résultat d\'une main ne reflète pas son EV', 'Parce que les calculs sont faux', 'C\'est impossible'], correctIndex: 1, explanation: 'La variance est la fluctuation naturelle des résultats autour de l\'EV. Sur une main vous pouvez perdre avec 90% d\'equity. Sur 10 000 mains, vous convergerez vers votre EV réelle.' },
    { question: 'Vous avez misé 50BB dans un pot mais réalisez que vous êtes battu. Devriez-vous call uniquement parce que vous avez "déjà investi" ?', options: ['Oui, vous devez récupérer votre mise', 'Non — les mises passées sont permanentes (sunk cost). Décidez uniquement en fonction du gain espéré futur', 'Oui si le pot est gros', 'Dépend de votre adversaire'], correctIndex: 1, explanation: 'Le "sunk cost fallacy" est l\'une des erreurs mentales les plus courantes au poker. L\'argent déjà misé est perdu quelle que soit votre décision. Evaluez uniquement : "Mon call futur est-il +EV ?" — pas ce qui est déjà dans le pot.' },
    { question: 'Vous avez AA préflop, êtes callé par 56s, et perdez face à une quinte. Était-ce une mauvaise décision de miser ?', options: ['Oui, vous auriez dû identifier le tirage', 'Non — AA est favori à +80%. Une défaite sur un résultat +EV reste une bonne décision de processus', 'Oui, il fallait aller all-in plus tôt', 'C\'est impossible de le savoir'], correctIndex: 1, explanation: 'Évaluez vos décisions par leur EV, pas par leur résultat. AA vs 56s est +EV massif préflop. Perdre 20% du temps est la variance normale. Juger cette mise comme une erreur parce qu\'elle a perdu est du résultat-oriented thinking.' },
  ],

  'intermediaire-outs': [
    { question: 'Combien d\'outs a un open-ended straight draw (OESD) ?', options: ['4', '6', '8', '9'], correctIndex: 2, explanation: 'OESD = tirage ouvert des deux côtés. Exemple : 6-7-8-9, un 5 ou un T complète = 4 + 4 = 8 outs.' },
    { question: 'Règle du 4-2 : vous avez 8 outs au turn. Quelle est votre equity approximative ?', options: ['8%', '16%', '32%', '40%'], correctIndex: 1, explanation: 'Au turn (1 carte restante) : outs × 2 = 8 × 2 = 16%. Au flop (2 cartes restantes) : outs × 4 = 32%.' },
    { question: 'Vous avez 7 outs. L\'adversaire bet pot (= 100%). Devriez-vous call au turn ?', options: ['Oui, 7 outs suffit toujours', 'Non, 14% equity < 50% requis pour un pot bet', 'Oui si vous avez position', 'Ça dépend de votre kicker'], correctIndex: 1, explanation: 'Pot bet requiert 50% equity pour breakeven. 7 outs × 2 = 14%. 14% << 50% : fold clair sauf implied odds exceptionnels.' },
    { question: 'Vous avez un gutshot (4 outs) + deux overcards (6 outs potentiels). Combien d\'outs comptez-vous ?', options: ['10 outs', 'Environ 8-9 outs net — les overcards peuvent être bloqués ou ne pas être les meilleurs', '4 outs uniquement', '6 outs uniquement'], correctIndex: 1, explanation: 'Les overcards comptent souvent comme demi-outs car la paire que vous faites n\'est pas garantie d\'être la meilleure. En pratique : 4 (gutshot) + 3-4 (overcards pondérées) ≈ 7-8 outs nets selon la situation.' },
    { question: 'Qu\'est-ce qu\'un backdoor draw (tirage secondaire) et compte-t-il pleinement ?', options: ['Un tirage qui se complète sur la river uniquement', 'Un tirage qui nécessite deux cartes consécutives favorables (turn + river) — compte environ 1,5 out', 'Un tirage avec moins de 5 outs', 'Un tirage forcément perdant'], correctIndex: 1, explanation: 'Un backdoor flush draw (ex: deux cartes de même couleur) nécessite turn + river de la même couleur (~4% de chances). Il ajoute environ 1,5 out à votre calcul total. Ne l\'ignorez pas mais ne le surestimez pas.' },
  ],

  'intermediaire-hands': [
    { question: 'AKs est-il une paire ?', options: ['Oui, paire d\'As', 'Non, c\'est une main broadways non pairée', 'Oui, avec un kicker', 'Seulement si l\'As apparaît sur le board'], correctIndex: 1, explanation: 'AKs = As + Roi de même couleur. Ce n\'est PAS une paire. C\'est la meilleure main non-pairée. Elle doit toucher le flop (paire d\'As, paire de Rois, tirage fort) pour avoir de la valeur postflop.' },
    { question: 'Pourquoi ouvre-t-on ATs mais pas A2o en UTG ?', options: ['ATs fait plus de paires', 'ATs a du potentiel flush + straight; A2o n\'a pas de valeur résiduelle OOP', 'A2o est interdit en UTG', 'C\'est une question de kicker'], correctIndex: 1, explanation: 'En UTG, on joue OOP. ATs a le potentiel d\'une couleur (flush) et est connected. A2o (offsuit, gapped) a peu de valeur postflop et joue mal OOP contre les ranges serrées.' },
    { question: 'Pourquoi les paires de pocket sont-elles précieuses même petites (22-55) ?', options: ['Elles ont plus d\'equity que AK', 'Set mining : elles font un set 12% du temps et un set peut gagner un gros pot', 'Elles sont toujours favorites préflop', 'Les petites paires bluffent mieux'], correctIndex: 1, explanation: 'Les petites paires visent à faire un set (brelan avec la paire en main). Un set arrive environ 12% du temps au flop, mais il permet de gagner des stacks entiers (implied odds élevés).' },
    { question: 'Vous avez AJ et faites face à un open tight en UTG. Pourquoi AJ est-il souvent dominé ?', options: ['AJ est trop faible pour jouer', 'La range UTG tight contient AK, AQ et parfois AA — AJ perd un kicker vs AK/AQ et est derrière AA', 'AJ ne peut pas faire de flush', 'L\'UTG a toujours une paire'], correctIndex: 1, explanation: 'Face à un joueur tight en UTG, sa range inclut AK, AQ, AA, KK, QQ. AJ est dominé par AK et AQ (même paire d\'As mais kicker perdant), et très derrière AA. C\'est pour cela qu\'on fold souvent AJo en UTG contre un 3-betteur tight.' },
    { question: 'Quelle est la différence entre un board "rainbow" et un board "monotone" ?', options: ['Rainbow = board avec des As ; monotone = sans As', 'Rainbow = 3 couleurs différentes au flop (pas de flush draw) ; monotone = 3 cartes de même couleur (flush draw maximal)', 'Rainbow = board sec ; monotone = board coordonné', 'Il n\'y a pas de différence au niveau de la stratégie'], correctIndex: 1, explanation: 'Rainbow (ex: A♠K♥7♦) = zéro flush draw possible au flop, board sec. Monotone (ex: J♠8♠3♠) = tous joueurs avec une pique ont un flush draw ou une couleur déjà. Cela change radicalement la stratégie de c-bet et les ranges défensives.' },
  ],

  'intermediaire-cbet': [
    { question: 'Qu\'est-ce qu\'un c-bet (continuation bet) ?', options: ['Miser 100% du pot', 'Miser sur le flop après avoir été le dernier raiser préflop', 'Appeler puis miser au turn', 'Un raise préflop'], correctIndex: 1, explanation: 'Le c-bet est la suite logique d\'un raise préflop : vous continuez l\'histoire de force en bettant le flop, que vous ayez touché le board ou non.' },
    { question: 'Sur quel type de board le c-bet est-il le plus efficace ?', options: ['Board humide avec beaucoup de tirages', 'Board sec sans coordination (ex: A-7-2 rainbow)', 'Toujours la même efficacité', 'Board pairé'], correctIndex: 1, explanation: 'Sur un board sec, peu de mains adverses s\'améliorent et vous avez range advantage. Sur un board humide, l\'adversaire a plus de mains qui touchent et vos bluffs sont moins efficaces.' },
    { question: 'Vous c-bet et l\'adversaire raise. Quelle est la première chose à analyser ?', options: ['La force de votre main', 'La range de raise de votre adversaire dans ce spot', 'La taille de son raise', 'Si vous êtes en position'], correctIndex: 1, explanation: 'Face à un check-raise, la question clé est : quelles mains l\'adversaire raise-t-il ici ? Si sa range de raise est forte (peu de bluffs), même TPTK peut devoir folder.' },
    { question: 'Vous c-bet flop, turn — sur la river vous n\'avez rien. Devriez-vous systématiquement triple barrel ?', options: ['Oui, la cohérence est toujours bonne', 'Non — analysez si la river favorise votre range de bluff et si l\'adversaire est susceptible de folder', 'Oui si vous avez misé gros aux deux premiers tours', 'Jamais triple barrel sans main forte'], correctIndex: 1, explanation: 'Un triple barrel bluff n\'est justifié que si (1) la carte de river favorise votre range prétendue, (2) l\'adversaire peut folder, (3) vous avez des blockers pertinents. Bluffer par défaut sur la river est une erreur coûteuse.' },
    { question: 'Sur un board humide (J♠T♠8♥), quel sizing de c-bet est adapté ?', options: ['33% pot — board humide = petit sizing', '66-75% pot — board humide requiert un sizing plus grand pour protéger et extraire', '100% pot systématiquement', 'Check systématiquement sur board humide'], correctIndex: 1, explanation: 'Sur un board humide avec beaucoup de draws, un sizing plus grand (66-75%) a deux effets : extraire plus de valeur avec les mains fortes ET charger les adversaires qui continuent avec des tirages. Un petit sizing leur donne des odds trop faciles.' },
  ],

  'intermediaire-bluff': [
    { question: 'Pourquoi le semi-bluff est-il préférable au bluff pur ?', options: ['Il gagne plus d\'argent directement', 'Il a deux façons de gagner : fold equity + possibilité de s\'améliorer', 'Il est moins risqué', 'L\'adversaire ne peut pas le lire'], correctIndex: 1, explanation: 'Un semi-bluff gagne si (1) l\'adversaire fold maintenant, ou (2) votre tirage arrive. Un bluff pur ne gagne que si l\'adversaire fold.' },
    { question: 'Avec un flush draw (9 outs), quelle est votre equity si l\'adversaire ne fold pas ?', options: ['0%', '~18% sur 1 carte / ~36% sur 2 cartes', '50%', '~9%'], correctIndex: 1, explanation: '9 outs × 2 = ~18% sur la river seule. 9 outs × 4 = ~36% sur turn + river. C\'est pourquoi le semi-bluff est puissant : même si callé, vous avez de l\'equity résiduelle.' },
    { question: 'Contre quel type d\'adversaire le bluff est-il le moins efficace ?', options: ['Les Nits', 'Les Calling Stations', 'Les TAGs', 'Les LAGs'], correctIndex: 1, explanation: 'Les calling stations (VPIP élevé, fold to c-bet bas) ne foldent jamais. Bluffer une calling station est la plus grande erreur au poker. Contre eux, value-bettez plus, bluffez jamais.' },
    { question: 'Pour être équilibré sur la river avec un pot-bet, combien de bluffs pour combien de valeurs ?', options: ['Autant de bluffs que de valeurs (1:1)', '1 bluff pour 2 mains de valeur', '3 bluffs pour 1 valeur', 'Aucun bluff sur la river'], correctIndex: 1, explanation: 'Pour un pot-bet river, l\'adversaire doit call ~50% du temps pour breakeven. Pour le rendre indifférent, vos bluffs représentent 1/3 de votre betting range (1 bluff pour 2 valeurs). Formule : bluffs / (valeurs + bluffs) = 1 / (ratio + 1).' },
    { question: 'Qu\'est-ce qu\'un "probe bet" et quand est-il utilisé ?', options: ['Un bet exploratoire fait par le caller sur le turn quand le raiser a checké le flop', 'Un bluff total sur la river', 'Un small bet avec une main forte', 'Un bet après un check-raise'], correctIndex: 0, explanation: 'Le probe bet est fait par le caller quand le raiser préflop a checké le flop. Il "sonde" la faiblesse adverse et peut forcer un fold ou récolter de l\'information. C\'est une ligne agressive légitime pour le caller en position.' },
  ],

  // AVANCÉ
  'avance-gto': [
    { question: 'Que signifie GTO (Game Theory Optimal) ?', options: ['La stratégie qui gagne le plus d\'argent', 'La stratégie d\'équilibre qui ne peut pas être exploitée', 'Jouer uniquement les mains fortes', 'Bluffer à chaque main'], correctIndex: 1, explanation: 'GTO est une stratégie d\'équilibre : l\'adversaire ne peut pas améliorer son EV en déviations de ses actions. Elle vous rend inexploitable, mais ne maximise pas contre des adversaires qui font des erreurs.' },
    { question: 'Quand vaut-il mieux exploiter plutôt que jouer GTO ?', options: ['Jamais, GTO est toujours optimal', 'Quand vous identifiez des tendances exploitables chez l\'adversaire', 'Seulement en tournoi', 'Seulement avec un HUD'], correctIndex: 1, explanation: 'GTO est le baseline défensif. Contre un adversaire qui over-fold les river bets, bluffez plus. Contre un calling station, value-bettez plus large. L\'exploitation maximise le profit contre des joueurs imparfaits.' },
    { question: 'Qu\'est-ce qu\'un "mixed strategy" en GTO ?', options: ['Jouer deux types de mains différents', 'Effectuer différentes actions avec la même main à des fréquences calculées', 'Mixer value bets et bluffs', 'Changer de table régulièrement'], correctIndex: 1, explanation: 'En GTO, certaines mains se jouent avec des fréquences mixtes (ex: check 60% du temps, bet 40%) pour être non-exploitable. L\'adversaire ne peut pas s\'adapter s\'il ne sait pas ce que vous faites.' },
    { question: 'Dans quelle situation devriez-vous dévier le plus fortement du GTO pour maximiser votre profit ?', options: ['Contre des joueurs équilibrés et compétents', 'Contre des joueurs avec des tendances exploitables claires (over-fold, calling station)', 'Jamais — le GTO est toujours optimal', 'Uniquement en heads-up'], correctIndex: 1, explanation: 'Le GTO est optimal contre un adversaire parfait. Contre un joueur qui over-fold les river bets (70%+), bluffez plus. Contre une calling station, value-bettez plus large. L\'exploitation maximise le profit contre des joueurs imparfaits.' },
    { question: 'Qu\'est-ce qu\'une "exploitation fréquence-based" ?', options: ['Bluffer très souvent', 'Ajuster sa stratégie en fonction des tendances statistiques d\'un adversaire (ex: fold to 3-bet 70%)', 'Jouer plus de mains par heure', 'Changer de table fréquemment'], correctIndex: 1, explanation: 'L\'exploitation fréquence-based utilise les stats (VPIP, PFR, fold to 3-bet, WTSD) pour identifier les tendances d\'un adversaire et ajuster sa stratégie en conséquence. Un fold to 3-bet de 70% = 3-bettez plus souvent.' },
  ],

  'avance-ranges': [
    { question: 'Qu\'est-ce que la "range advantage" ?', options: ['Avoir une meilleure main que l\'adversaire', 'Avoir une distribution de mains plus forte sur un board donné', 'Jouer plus de mains', 'Avoir un meilleur kicker'], correctIndex: 1, explanation: 'Range advantage = votre ensemble de mains possibles est plus fort que celui de l\'adversaire sur ce board. Exemple : vous avez ouvert CO, le board A-K-7 favorise votre range (vous avez AK, AQ, KK).' },
    { question: 'Combien de combos d\'AA existent ?', options: ['4', '6', '12', '16'], correctIndex: 1, explanation: 'AA = C(4,2) = 6 combinaisons (A♠A♥, A♠A♦, A♠A♣, A♥A♦, A♥A♣, A♦A♣). AKs = 4 combos. AKo = 12 combos.' },
    { question: 'Pourquoi penser en "ranges" plutôt qu\'en mains spécifiques ?', options: ['C\'est plus facile', 'Car vous ne savez pas exactement quelle main l\'adversaire a, seulement une distribution probable', 'Pour bluffer plus efficacement', 'Pour mémoriser plus de situations'], correctIndex: 1, explanation: 'Un adversaire peut avoir N mains différentes dans une situation donnée. Penser en ranges vous permet d\'optimiser votre stratégie contre l\'ensemble de ces mains, pas seulement une.' },
    { question: 'Combien de combos AKs existent dans un jeu de 52 cartes ?', options: ['12', '6', '4', '16'], correctIndex: 2, explanation: 'AKs (suited) = 4 combos : A♠K♠, A♥K♥, A♦K♦, A♣K♣. AKo (offsuit) = 12 combos. Total AK = 16 combos. Compter les combos est essentiel pour évaluer la probabilité qu\'un adversaire ait une main spécifique.' },
    { question: 'Pourquoi ouvre-t-on ATs en UTG mais pas A9o dans la même position ?', options: ['ATs a un meilleur kicker', 'ATs a du potentiel flush + est connected ; A9o n\'a pas de valeur résiduelle en OOP contre des ranges serrées', 'A9o est interdit en UTG', 'La différence est minime'], correctIndex: 1, explanation: 'ATs : suited (potentiel flush), connected (potentiel quinte), joue bien multiway. A9o : pas de flush, pas de quinte utile, kicker faible en OOP. En UTG, face à des ranges de 3-bet serrées, A9o est souvent dominé (AJ, AQ, AK dans la range adverse).' },
  ],

  'avance-threebets': [
    { question: 'Qu\'est-ce qu\'un "3-bet light" ?', options: ['Un 3-bet avec moins de 3BB', 'Un 3-bet avec des mains semi-premium ou des bluffs (pas uniquement les nuts)', 'Un 3-bet avec un petit sizing', 'Un 3-bet en shortstack'], correctIndex: 1, explanation: 'Le 3-bet light va au-delà des mains premium (AA-QQ, AKs). Il inclut des mains comme A5s, KQs en position pour exploiter la fold equity des openers trop large.' },
    { question: 'Quelle main est idéale pour un 4-bet bluff ?', options: ['72o', 'A5s', 'KK', '22'], correctIndex: 1, explanation: 'A5s bloque AA (vous avez un As) et AK dans la range adverse, réduisant ses combos de value. Il a aussi de l\'equity résiduelle si callé (flush draw, paire d\'As).' },
    { question: 'Quelle est la fréquence de fold typique face à un 3-bet pour justifier un 3-bet léger ?', options: ['20%', '40%', '55%+', '80%+'], correctIndex: 2, explanation: 'Si l\'adversaire fold 55%+ face au 3-bet, vous avez assez de fold equity pour 3-bet avec des mains semi-premium. En dessous de 50%, soyez plus sélectif.' },
    { question: 'Quel sizing de 3-bet est typiquement optimal en position (IP) ?', options: ['2x la mise adverse', '2,5-3x en position ; 3,5-4x hors position', '5x la mise adverse', 'Toujours 10BB quel que soit le contexte'], correctIndex: 1, explanation: 'En IP, un 3-bet de 2,5-3x suffit car vous avez l\'avantage positionnel. OOP, vous devez 3-bet plus grand (3,5-4x) pour compenser le désavantage positionnel et réduire la profitabilité du call.' },
    { question: 'Face à un 4-bet adverse, quand est-il correct de 5-bet bluff ?', options: ['Jamais', 'Rarement — uniquement avec des blockers forts (AA inclus dans votre range représentée) et contre un adversaire qui peut fold', 'Toujours si vous avez un As dans la main', 'Systématiquement pour montrer de l\'agressivité'], correctIndex: 1, explanation: 'Le 5-bet bluff est une action rare justifiée quand vous avez des blockers forts (A-bloque AA, K-bloque KK), quand votre stack/pot ratio le permet, et contre un adversaire capable de fold un 4-bet. Très peu de joueurs peuvent appliquer cette ligne correctement.' },
  ],

  'avance-blockers': [
    { question: 'Vous avez A♠ dans votre main. Combien de combos AA l\'adversaire peut-il avoir ?', options: ['6', '3', '1', '0'], correctIndex: 1, explanation: 'Avoir A♠ élimine tous les combos contenant A♠. Il reste 3 combos AA : A♥A♦, A♥A♣, A♦A♣. Votre blocker réduit la probabilité qu\'il ait AA de 50%.' },
    { question: 'Quel est le meilleur blocker pour un bluff river quand la couleur à pique est arrivée ?', options: ['K♠ (bloque les hautes couleurs)', 'A♠ (bloque la nut flush)', '2♠ (bloque les petites couleurs)', 'Peu importe'], correctIndex: 1, explanation: 'Avoir A♠ bloque la nut flush (couleur avec l\'As) dans la range de call adverse. Il ne peut pas avoir A♠X♠, réduisant ses meilleurs calls et rendant votre bluff plus efficace.' },
    { question: 'Les blockers sont utiles principalement à quel moment ?', options: ['Préflop uniquement', 'Sur la river pour les bluffs et value bets', 'Au flop seulement', 'En tournoi uniquement'], correctIndex: 1, explanation: 'Sur la river, les blockers influencent quelles mains l\'adversaire peut avoir dans sa range de call ou de raise. C\'est là que l\'effet de blocage est le plus précis et impactant.' },
    { question: 'Vous avez K♠Q♠ sur un board Q♦7♠2♠. Quels blockers importants avez-vous ?', options: ['Aucun blocker utile', 'Vous bloquez la nut flush (K♠ et Q♠ réduisent les combos de flush adverses) et avez top pair + flush draw', 'Vous bloquez uniquement les bluffs adverses', 'Le K♠ bloque uniquement les K hautes adverses'], correctIndex: 1, explanation: 'K♠Q♠ sur Q♦7♠2♠ = TPTK + nut flush draw. Vos K♠ et Q♠ réduisent les combos de nut flush dans la range adverse (A♠K♠ nécessite l\'A♠ que vous n\'avez pas). Vous êtes en excellente position pour value-bet et semi-bluff.' },
    { question: 'L\'effet de blocage est-il significatif avec des petites cartes (2♣, 3♦) ?', options: ['Oui, toutes les cartes bloquent autant', 'Non — les petites cartes bloquent peu de combos pertinents dans les ranges de value ou de bluff adverses', 'Uniquement si ce sont des cartes suited', 'Cela dépend du board uniquement'], correctIndex: 1, explanation: 'Les blockers sont précieux quand ils réduisent les combos les plus importants. Un As bloque AA (6→3 combos), AK (16→8), la nut flush. Un 2 bloque rarement des combos clés dans les ranges de 3-bet ou de value bet adverses.' },
  ],

  'avance-icm': [
    { question: 'En ICM, pourquoi perdre des jetons est-il plus coûteux que d\'en gagner ?', options: ['À cause des blindes qui augmentent', 'Car la valeur marginale des jetons diminue avec votre stack', 'Parce que l\'élimination met fin au tournoi', 'Les jetons n\'ont pas de valeur constante'], correctIndex: 1, explanation: 'En ICM, les premiers jetons gagnés ont plus de valeur (survie) que les derniers. Doubler votre stack ne double pas votre prize equity, donc les appels borderline deviennent négatifs ICM-EV.' },
    { question: 'Quand la pression ICM est-elle la plus forte ?', options: ['En début de tournoi', 'À la bubble (places payées imminentes)', 'Heads-up', 'Jamais'], correctIndex: 1, explanation: 'À la bubble, chaque élimination d\'un adversaire a une grande valeur (tous les survivants montent dans les prix). C\'est le moment où vous devriez vous resserrer le plus.' },
    { question: 'Un joueur ICM-aware devrait...', options: ['Toujours jouer comme en cash game', 'Éviter les confrontations risquées proches de la bulle, surtout avec les gros stacks', 'Pousser all-in à chaque fois', 'Ignorer les stacks adverses'], correctIndex: 1, explanation: 'Proche de la bulle, les gros stacks peuvent vous éliminer. Évitez les all-ins borderline sauf si votre stack est si petit que l\'ICM ne change pas la décision.' },
    { question: 'En tant que chip leader à la final table ICM, comment adaptez-vous votre stratégie ?', options: ['Jouez comme d\'habitude, vous avez le plus de jetons', 'Utilisez votre stack pour pressuriser les stacks moyens, mais évitez les confrontations avec les autres gros stacks', 'Allez all-in à chaque pot pour maximiser les chips', 'Jouez très serré pour préserver votre avantage'], correctIndex: 1, explanation: 'Le chip leader ICM a un avantage unique : il peut pressuriser les stacks moyens qui veulent monter dans les prix (ladder effect). Mais confronter un autre gros stack est risqué car il peut vous doubler et vous faire perdre votre dominance.' },
    { question: 'Qu\'est-ce que "l\'ICM suicide" ?', options: ['Quitter un tournoi volontairement', 'Prendre un call borderline ou pire en ICM qui risque votre place payée pour un gain de jetons marginal', 'Bluffer à la bubble', 'Jouer trop tight proche de la bulle'], correctIndex: 1, explanation: '"ICM suicide" désigne une décision qui risque une grande valeur ICM (place payée, ladder) pour un gain de jetons qui ne compense pas. Exemple : call avec 55% d\'equity all-in à la bulle quand folder vous garantit le min-cash.' },
  ],

  'avance-sizing': [
    { question: 'Quel sizing de c-bet est généralement optimal sur un board sec (A-7-2 rainbow) ?', options: ['20% pot', '33-50% pot', '75-100% pot', 'All-in'], correctIndex: 1, explanation: 'Sur un board sec, la range adverse a peu de mains qui touchent. Un petit sizing (33-50%) suffit à extraire de la valeur et réaliser de la fold equity tout en risquant moins.' },
    { question: 'Quand utiliser un overbet (>100% pot) ?', options: ['Avec toutes les mains', 'Avec une range polarisée (nuts ou bluffs) sur des boards favorables à votre range', 'Uniquement pour bluffer', 'En shortstack uniquement'], correctIndex: 1, explanation: 'L\'overbet est polarisé : soit vous avez une main très forte qui veut charger le pot, soit c\'est un bluff pur. Il maximise l\'EV sur les boards où vous avez un range advantage fort.' },
    { question: 'Pourquoi le sizing influence-t-il la range de mains que vous bettez ?', options: ['Ça n\'influence pas la range', 'Un gros sizing polarise votre range (nuts/bluffs), un petit sizing merge les mains moyennes aussi', 'Pour confuser l\'adversaire', 'Pour payer moins de rake'], correctIndex: 1, explanation: 'Avec un petit sizing (33%), vous bettez une range large incluant mains moyennes et draws. Avec un gros sizing (100%+), votre range doit être plus polarisée car les mains moyennes ne supportent pas le risque.' },
    { question: 'Vous avez un set sur un board très humide (8♠7♠6♦). Quel sizing de bet choisissez-vous ?', options: ['25% pot — laisser les adversaires continuer', '75-100% pot pour charger les tirages et extraire un maximum', 'Check systématiquement pour slowplay', 'All-in uniquement'], correctIndex: 1, explanation: 'Sur un board très coordonné, le slowplay est dangereux. Avec un set, bettez gros (75-100%) pour deux raisons : extraire de la valeur maximum ET protéger votre main contre les nombreux tirages (quinte, couleur) qui ont de l\'equity.' },
    { question: 'Pourquoi le petit sizing (25-33% pot) est-il utilisé pour une range de bet large ?', options: ['Pour masquer la force de votre main', 'Car vous bettez une range large incluant mains moyennes et draws — risquer peu avec l\'ensemble de la range', 'C\'est le seul sizing autorisé sur certains sites', 'Pour économiser les jetons sur les bluffs'], correctIndex: 1, explanation: 'Petit sizing = risque faible par main. Vous pouvez bet une range large (mains fortes, moyennes, draws, bluffs) sans vous exposer trop. Cela maximise la fold equity totale et extrait de la valeur de mains moyennes qui callent facilement face à un petit bet.' },
  ],

  'avance-multiway': [
    { question: 'En pot multi-way (3+ joueurs), comment change la stratégie de c-bet ?', options: ['On c-bet plus souvent', 'On c-bet moins souvent mais avec des mains plus fortes', 'Aucun changement', 'On ne c-bet jamais multi-way'], correctIndex: 1, explanation: 'Multi-way, la probabilité qu\'au moins un adversaire ait touché le board augmente. Les bluffs deviennent moins efficaces (2 joueurs à convaincre). C-bet avec les mains fortes, check avec l\'air.' },
    { question: 'Quel est l\'avantage d\'un pot multi-way pour les tirages ?', options: ['Les tirages sont inutiles multi-way', 'Les implied odds sont plus élevés (plus de joueurs = plus d\'argent potentiel si complétion)', 'Les tirages coûtent moins cher', 'On voit plus de cartes gratuitement'], correctIndex: 1, explanation: 'Avec plusieurs adversaires qui ont potentiellement des mains fortes, compléter un tirage peut gagner un pot énorme. Les implied odds sont nettement plus élevés multi-way qu\'heads-up.' },
    { question: 'Vous avez un set dans un pot 4-way. Devriez-vous...', options: ['Slowplay pour piéger', 'Bet pour protéger et extraire de la valeur de tous les adversaires', 'Check systématiquement', 'Fold car trop risqué'], correctIndex: 1, explanation: 'Multi-way, le slowplay est dangereux : trop de cartes peuvent compléter des tirages adverses. Bettez votre set pour extraire de la valeur et réduire le champ (faire folder les draws qui ont de l\'equity).' },
    { question: 'Qu\'est-ce qu\'un "squeeze" et quand l\'utiliser ?', options: ['Un bluff total sans equity', '3-bet face à un open + un ou plusieurs callers — pour exploiter la fold equity maximale des deux côtés', 'Un small raise sur le flop', 'Un check-raise à la river'], correctIndex: 1, explanation: 'Le squeeze est un 3-bet face à un open + call(s). L\'opener doit folder (callers derrière) et les callers aussi (peur du 3-bet + peur des autres joueurs). Le squeeze peut être profitablement fait avec des mains semi-premium grâce à la fold equity cumulée.' },
    { question: 'En pot multi-way, le slowplay d\'une main très forte est-il généralement conseillé ?', options: ['Oui — plus de joueurs = plus d\'argent à gagner avec une main lente', 'Non — le risque de complétion de tirages adverses est trop élevé. Bettez pour protéger', 'Oui si vous êtes en position', 'Uniquement si le board est sec'], correctIndex: 1, explanation: 'Multi-way, la probabilité qu\'au moins un adversaire complète un tirage augmente fortement. Avec une main forte (set, two pair), bettez pour réduire le champ et protéger votre equity. Le slowplay multi-way est souvent un grave coût d\'opportunité.' },
  ],

  // EXPERT
  'expert-solvers': [
    { question: 'Qu\'est-ce qu\'un "solver" au poker ?', options: ['Un logiciel qui calcule les probabilités de main', 'Un programme qui calcule les stratégies GTO pour chaque situation', 'Un tracker de sessions', 'Un HUD', ], correctIndex: 1, explanation: 'Les solvers (PioSOLVER, GTO+, etc.) calculent les stratégies d\'équilibre Nash pour des situations données. Ils indiquent la fréquence optimale de bet/check/raise avec chaque main dans la range.' },
    { question: 'Pourquoi ne faut-il pas appliquer aveuglément les outputs des solvers ?', options: ['Les solvers sont souvent faux', 'Les solvers calculent contre des adversaires parfaits, les humains font des erreurs exploitables', 'Les solvers sont trop compliqués', 'Les solvers ne couvrent que le préflop'], correctIndex: 1, explanation: 'Les solvers trouvent l\'équilibre GTO, optimal contre un adversaire parfait. Contre un humain qui over-fold ou over-call, vous devriez dévier du GTO pour exploiter ses tendances.' },
    { question: 'Quelle est la principale utilité de travailler avec un solver ?', options: ['Copier exactement ses actions', 'Comprendre les principes et intuitions derrière les décisions optimales', 'Tricher en live', 'Mémoriser toutes les ranges'], correctIndex: 1, explanation: 'Les meilleurs joueurs utilisent les solvers pour comprendre POURQUOI certaines lignes sont optimales (range advantage, morphologie du board, fréquences de bluff). L\'objectif est l\'intuition, pas la mémorisation.' },
    { question: 'Qu\'est-ce que le "node locking" dans un solver ?', options: ['Verrouiller le solver pour éviter les bugs', 'Forcer l\'adversaire à jouer une stratégie fixe (non-optimale) pour étudier la réponse exploitative', 'Bloquer certaines mains dans la range adverse', 'Un paramètre de vitesse du solver'], correctIndex: 1, explanation: 'Le node locking permet de fixer la stratégie adverse à un nœud donné (ex: l\'adversaire fold toujours la river). Le solver recalcule alors votre stratégie optimale contre cette erreur. C\'est l\'outil clé pour étudier l\'exploitation de profils spécifiques.' },
    { question: 'Combien de temps faut-il typiquement pour maîtriser les fondamentaux d\'utilisation d\'un solver ?', options: ['1 session de 2 heures', 'Quelques semaines d\'étude régulière avec des spots concrets bien choisis', 'C\'est immédiat si on lit le manuel', '5 ans minimum'], correctIndex: 1, explanation: 'Les solvers ont une courbe d\'apprentissage. Commencez par des spots simples (flop HU, spots récurrents), analysez le POURQUOI des fréquences, et progressivement élargissez à des situations complexes. L\'étude régulière (2-3h/semaine) est plus efficace que les marathons ponctuels.' },
  ],

  'expert-balanced': [
    { question: 'Une range est "balancée" quand...', options: ['Elle contient autant de valeurs que de bluffs', 'L\'adversaire est indifférent entre ses options (call/fold) contre vos bets', 'Vous jouez toutes les mains de la même façon', 'Vous avez autant de suited que d\'offsuit'], correctIndex: 1, explanation: 'Une range balancée rend l\'adversaire indifférent, il ne peut pas améliorer son EV en changeant de stratégie. Ce n\'est pas nécessairement 50/50 valeur/bluff, ça dépend du sizing.' },
    { question: 'Si vous bettez pot river (50% fold equity requise pour breakeven), combien de bluffs par rapport aux valeurs ?', options: ['Autant de bluffs que de valeurs', '1 bluff pour 2 mains de valeur', '3 bluffs pour 1 valeur', 'Aucun bluff'], correctIndex: 1, explanation: 'Pour un pot-bet, si l\'adversaire doit call 50% du temps (50% pot odds), vos bluffs représentent 1/3 de votre betting range (1 bluff pour 2 valeurs). C\'est la formule : bluffs / (valeurs + bluffs) = 1/(sizing+1).' },
    { question: 'Pourquoi est-il important de balancer votre range de check aussi bien que de bet ?', options: ['Ce n\'est pas important', 'Si votre range de check est trop faible, les adversaires peuvent bet 100% et vous exploiter', 'Pour paraître imprévisible', 'Seulement si l\'adversaire utilise un HUD'], correctIndex: 1, explanation: 'Si vous checkez uniquement les mains faibles, un adversaire compétent peut bet toute sa range contre vous. Vos checks doivent inclure des mains fortes (traps) pour protéger votre range de check.' },
    { question: 'Qu\'est-ce que le MDF (Minimum Defense Frequency) ?', options: ['La fréquence minimale pour ouvrir en UTG', 'La fréquence à laquelle vous devez défendre face à une mise pour ne pas rendre le bluff adversaire systématiquement profitable', 'Le pourcentage de mains à 3-better', 'La fréquence de c-bet optimale'], correctIndex: 1, explanation: 'MDF = 1 - (bet / (pot + bet)). Face à un bet 50% pot : MDF = 1 - (0.5/1.5) = 67%. Vous devez défendre au minimum 67% de votre range (call + raise) pour que l\'adversaire soit indifférent à bluffer avec n\'importe quelle main.' },
    { question: 'Face à un pot-bet adverse sur la river, quel est votre MDF approximatif ?', options: ['25%', '33%', '50%', '67%'], correctIndex: 2, explanation: 'Pot-bet = mise égale au pot. MDF = 1 - (pot / (pot + pot)) = 1 - 0.5 = 50%. Vous devez défendre exactement 50% de votre range. En dessous, l\'adversaire peut bluffer toute sa range profitablement.' },
  ],

  'expert-exploitation': [
    { question: 'Comment exploiter un joueur avec un fold-to-river-bet de 70% ?', options: ['Value-better plus large', 'Bluffer plus souvent sur la river', 'Slowplay toutes les mains fortes', 'Jouer identiquement à contre un GTO player'], correctIndex: 1, explanation: 'Fold-to-river-bet 70% = il fold trop souvent. Le breakeven pour bluffer est 50% de fold. Avec 70%, bluffez plus que le GTO optimal pour exploiter cette tendance.' },
    { question: 'Qu\'est-ce qu\'un "population read" ?', options: ['Lire les émotions des joueurs', 'Données agrégées sur les tendances d\'un pool de joueurs (ex: NL100 en général)', 'Analyser une main spécifique', 'Compter les cartes'], correctIndex: 1, explanation: 'Les population reads utilisent des données sur l\'ensemble des joueurs d\'un stake pour identifier des tendances exploitables (ex: le pool NL100 fold-to-3bet 65% = 3-bet plus light).' },
    { question: 'Quel est le risque d\'une stratégie trop exploitative ?', options: ['Aucun risque', 'Vous devenez vous-même exploitable si l\'adversaire s\'adapte', 'Vous gagnez trop d\'argent', 'Vous violez les règles du poker'], correctIndex: 1, explanation: 'Si vous exploitez en bluffant plus souvent, un adversaire compétent peut s\'adapter et call plus. L\'exploitation fonctionne contre des joueurs qui ne s\'ajustent pas.' },
    { question: 'Comment identifier qu\'un adversaire over-bluff les rivers ?', options: ['En regardant ses émotions', 'En utilisant les stats (WTSD élevé, showdown par river bet), en notant les mains montrées, et en observant ses patterns de mise', 'En lui demandant directement', 'C\'est impossible à identifier'], correctIndex: 1, explanation: 'Pour détecter l\'over-bluff river : WTSD bas mais bet river élevé (bet souvent mais montre peu), patterns de bet sur cartes de complétion, mains révélées au showdown. Avec les HUD, river bet % vs showdown % révèle les profils agressifs.' },
    { question: 'Qu\'est-ce qu\'un "reverse tell" et comment l\'exploiter ?', options: ['Un tell qui apparaît uniquement en live', 'Un comportement délibérément trompeur — simuler la faiblesse avec une main forte ou la force avec un bluff', 'Un tell involontaire de la main gauche', 'Uniquement pertinent en tournoi'], correctIndex: 1, explanation: 'Le reverse tell est une action délibérée pour induire une fausse lecture. Exemple : hésiter longuement puis bet all-in avec le nuts. Contre des adversaires sophistiqués, il faut questionner si les tells observés sont authentiques ou manipulés.' },
  ],

  'expert-hud': [
    { question: 'Un joueur a VPIP 40%, PFR 8%. Quel est son profil ?', options: ['TAG solide', 'Calling station / fish passif', 'Nit', 'LAG agressif'], correctIndex: 1, explanation: 'VPIP élevé (joue beaucoup) + PFR très faible (ne raise presque jamais) = joueur passif qui entre souvent mais call plutôt que raise. Typique d\'un fish récréatif.' },
    { question: 'Fold to 3-bet à 75%. Comment adaptez-vous votre jeu ?', options: ['3-bettez moins souvent', '3-bettez plus souvent avec des mains semi-premium et des bluffs', 'Jouez identiquement', 'Foldez tout face à son 3-bet'], correctIndex: 1, explanation: '75% fold to 3-bet signifie qu\'il fold 3 fois sur 4. Le breakeven pour un 3-bet est ~55-60% de fold. Avec 75%, 3-bettez votre range légère beaucoup plus fréquemment.' },
    { question: 'Combien de mains faut-il pour que les stats HUD soient fiables ?', options: ['50 mains', '200 mains', '1000+ mains', 'Toujours fiables dès le début'], correctIndex: 2, explanation: 'La plupart des stats nécessitent 1000+ mains pour être statistiquement significatives (surtout les stats situationnelles comme "fold to 3-bet"). Avec moins de 500 mains, interprétez avec grande prudence.' },
    { question: 'Que signifie un WTSD (Went To ShowDown) élevé (ex: 32%+) ?', options: ['Le joueur est très fort et gagne beaucoup de showdowns', 'Le joueur call trop souvent et va fréquemment au showdown — tendance à être une calling station', 'Le joueur bluff énormément', 'Le joueur joue uniquement en tournoi'], correctIndex: 1, explanation: 'WTSD mesure le pourcentage de fois qu\'un joueur va au showdown quand il voit le flop. WTSD 32%+ = calling station tendance. La moyenne est ~24-27%. Contre un WTSD élevé, value-bettez plus et bluffez moins.' },
    { question: 'Un joueur a un Aggression Factor (AF) de 5. Qu\'est-ce que cela signifie ?', options: ['Il joue 5 tables simultanément', 'Il bet/raise 5 fois plus souvent qu\'il ne call — profil très agressif', 'Il a un winrate de 5 BB/100', 'Il joue 5% des mains'], correctIndex: 1, explanation: 'AF = (bet + raise) / call. AF 5 = bets/raises 5x plus souvent que calls. AF normal : 1,5-3. AF 5+ = joueur très agressif qui mise souvent et call rarement. Contre un AF très élevé, defendez plus souvent avec des mains fortes et trap davantage.' },
  ],

  'expert-mental': [
    { question: 'Qu\'est-ce que le "tilt" au poker ?', options: ['Une stratégie agressive', 'Un état émotionnel négatif qui dégrade la qualité des décisions', 'Jouer en inclinaison physique', 'Une variante du poker'], correctIndex: 1, explanation: 'Le tilt est la réaction émotionnelle (frustration, colère, désespoir) qui pousse à prendre de mauvaises décisions. La gestion du tilt est une compétence professionnelle aussi importante que la stratégie.' },
    { question: 'La meilleure façon de gérer une mauvaise run (downswing) est...', options: ['Augmenter les stakes pour récupérer', 'Réduire le volume, revoir le jeu, accepter la variance', 'Jouer plus d\'heures pour compenser', 'Arrêter définitivement'], correctIndex: 1, explanation: 'Un downswing peut durer des milliers de mains même en jouant parfaitement. Réduire les enjeux (bankroll management), analyser les leaks potentiels et ne pas "poker tilt" sont les réponses correctes.' },
    { question: 'Qu\'est-ce que "résultat-oriented thinking" (thinking by results) ?', options: ['Évaluer ses décisions par leur qualité intrinsèque', 'Juger la qualité d\'une décision par son résultat plutôt que par son processus', 'Analyser les EV après chaque main', 'Une méthode d\'étude avancée'], correctIndex: 1, explanation: 'Juger ses décisions par les résultats est une erreur cognitive. Une décision +EV peut perdre (bad luck) et une décision -EV peut gagner (bad luck). Évaluez le PROCESSUS décisionnel, pas le résultat.' },
    { question: 'Comment pratiquer un "session reset" efficacement après une mauvaise session ?', options: ['Rejouer immédiatement pour récupérer', 'S\'éloigner du jeu, noter les émotions ressenties, analyser les décisions à tête reposée le lendemain', 'Ignorer la session et recommencer immédiatement', 'Diminuer les stakes immédiatement pendant la session'], correctIndex: 1, explanation: 'Un session reset efficace : (1) quitter dès que vous identifiez un tilt, (2) activité décompressive (sport, marche), (3) review émotionnelle écrite, (4) analyse technique le lendemain. Jouer "revenge poker" immédiatement aggrave systématiquement les pertes.' },
    { question: 'Qu\'est-ce qu\'un "stop loss" en gestion de session et pourquoi est-il important ?', options: ['Un limit de gains à ne pas dépasser', 'Un seuil de perte prédéfini au-delà duquel vous arrêtez de jouer pour la session', 'Un paramètre de jeu en tournoi', 'Un outil de calcul de bankroll'], correctIndex: 1, explanation: 'Le stop loss (ex: -3 buy-ins par session) vous protège contre les spirales de tilt. Définissez votre stop loss avant de commencer à jouer, en état émotionnel neutre. Une fois atteint, arrêtez systématiquement — votre EV en état de tilt est négative.' },
  ],

  'expert-selection': [
    { question: 'Table selection signifie...', options: ['Choisir ses cartes', 'Choisir les tables les plus profitables (adversaires faibles, soft games)', 'Sélectionner son positionnement à table', 'Choisir le type de jeu (cash vs tournoi)'], correctIndex: 1, explanation: 'La sélection de table est l\'un des leviers les plus impactants sur le winrate. Jouer contre des adversaires plus faibles augmente directement votre EV, indépendamment de vos améliorations techniques.' },
    { question: 'Quel indicateur recherchez-vous pour identifier une table profitable ?', options: ['Tables avec beaucoup de pros', 'VPIP moyen élevé de la table (beaucoup de joueurs passifs/loose)', 'Tables avec peu de joueurs', 'Tables avec des blinds élevées'], correctIndex: 1, explanation: 'Un VPIP moyen élevé indique des joueurs récréatifs qui jouent trop de mains. Ce sont eux qui génèrent votre profit. Évitez les tables avec 5+ réguliers.' },
    { question: 'En multi-tabling, quel est le principal risque ?', options: ['Jouer plus lentement', 'Réduire la qualité des décisions sur chaque table individuelle', 'Trop gagner d\'argent', 'Tables trop faciles'], correctIndex: 1, explanation: 'Trop de tables simultanées réduit le temps disponible par décision. Vous passez en "autopilote" et ratez les reads situationnels. Trouvez le nombre de tables qui maximise EV/heure sans dégrader la qualité.' },
    { question: 'Que signifie "seat selection" (sélection de place) à l\'intérieur d\'une table déjà rejointe ?', options: ['Choisir sa chaise physique', 'Se placer à gauche des joueurs agressifs (pour agir après eux) et à droite des joueurs passifs (pour les isoler)', 'Sélectionner sa couleur de fond', 'Choisir entre plusieurs tables disponibles'], correctIndex: 1, explanation: 'Dans une table, positionner votre siège stratégiquement a de l\'importance en live. Idéalement : avoir position sur les gros stacks agressifs (ils agissent avant vous), et être à droite des joueurs passifs/fish pour les isoler avec des raises.' },
    { question: 'Quand devriez-vous quitter une table (table-leave) ?', options: ['Jamais — c\'est de la mauvaise volonté', 'Quand le profil de la table change défavorablement (fish partis, réguliers qui rejoignent) ou quand vous sentez le tilt', 'Seulement si vous avez perdu', 'Uniquement à des horaires fixes'], correctIndex: 1, explanation: 'La sélection de table est un processus continu. Si le fish qui justifiait votre présence à la table part et est remplacé par un regular, considérez de changer. De même, quitter en état de tilt préserve votre bankroll.' },
  ],

  'expert-study': [
    { question: 'Quelle est la méthode la plus efficace pour progresser rapidement ?', options: ['Jouer le maximum de mains possibles', 'Combiner le jeu, la review de mains et les outils d\'analyse (solver, tracker)', 'Regarder des streams', 'Mémoriser des charts'], correctIndex: 1, explanation: 'La progression optimale combine volume (practice), étude (solver, review) et feedback (coaching, spots difficiles). Jouer sans étudier crée des patterns faux. Étudier sans jouer manque la contextualisation.' },
    { question: 'Combien de mains faut-il pour évaluer son winrate avec fiabilité ?', options: ['1 000 mains', '10 000 mains', '50 000+ mains', '100 mains'], correctIndex: 2, explanation: 'La variance au poker est énorme. 50 000+ mains sont nécessaires pour avoir un intervalle de confiance raisonnable sur son vrai winrate. À 10 000 mains, vous pouvez encore être en train de boom ou bust.' },
    { question: 'Quelle est la valeur principale de la review de mains perdantes ?', options: ['Confirmer que vous avez eu de la malchance', 'Identifier des leaks et des erreurs systématiques dans votre jeu', 'Se décourager', 'Apprendre les outs adverses'], correctIndex: 1, explanation: 'Reviewer les mains perdantes (pas uniquement les mauvaises runs) permet d\'identifier des patterns d\'erreur : sizing inconsistant, fold equity sous-estimée, spots où vous êtes exploitable.' },
    { question: 'Quelle est la proportion optimale entre volume de jeu et temps d\'étude pour progresser ?', options: ['100% jeu, aucune étude nécessaire', 'Environ 70% jeu / 30% étude (solver, review, coaching) pour les joueurs intermédiaires en progression', '50% étude seulement, sans jouer', 'Étude uniquement les weekends'], correctIndex: 1, explanation: 'La progression optimale combine jeu (contextualisation, volume) et étude (solver, review, coaching). Les pros estiment qu\'en phase de progression active, 30% du temps total en étude structurée est l\'équilibre. Jouer sans étudier crée des habitudes incorrectes.' },
    { question: 'Pourquoi reviewer des mains gagnantes peut aussi être utile ?', options: ['Pour se féliciter', 'Pour vérifier si votre ligne était GTO ou si vous avez eu de la chance avec une mauvaise décision', 'Les mains gagnantes sont toujours bien jouées', 'Uniquement pour montrer à d\'autres joueurs'], correctIndex: 1, explanation: 'Une main gagnante peut avoir été mal jouée (mauvaise décision qui gagne grâce à la variance). La reviewer permet d\'identifier si vous avez eu de la "chance" ou si votre processus était correct. Cela prévient le "bad play reinforcement" quand une mauvaise décision est récompensée.' },
  ],
};
