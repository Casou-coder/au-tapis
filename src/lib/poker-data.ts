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
    description: 'Premier à parler avant le flop. La pire position — vous devez agir avant tout le monde.',
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
  { hand: 'AKs', category: 'premium', action: 'Toujours 3-bet / 4-bet', equity: 67, note: 'Best hand post-flop, draws puissants.' },
  { hand: 'TT', category: 'strong', action: 'Relancer, call 3-bet en position', equity: 75, note: 'Très forte mais vulnérable aux overcards.' },
  { hand: 'AQs', category: 'strong', action: 'Relancer, 3-bet against CO/BTN', equity: 66, note: 'Excellente en position, délicate OOP.' },
  { hand: 'AKo', category: 'strong', action: 'Toujours relancer, 3-bet parfois', equity: 65, note: 'Puissante mais pas aussi forte que AKs.' },
  { hand: '99', category: 'strong', action: 'Relancer, call 3-bet cautiously', equity: 72, note: 'Bonne main, prudence face aux 3-bets.' },
  { hand: 'AJs', category: 'strong', action: 'Relancer BTN/CO, call HJ', equity: 63, note: 'Très jouable en position.' },
  { hand: 'KQs', category: 'strong', action: 'Relancer, 3-bet parfois', equity: 61, note: 'Excellents draws, bonne value.' },
  { hand: '88', category: 'playable', action: 'Relancer, set mining', equity: 69, note: 'Jouez pour les sets.' },
  { hand: 'ATs', category: 'playable', action: 'Relancer position, call EP', equity: 61, note: 'Bon en position.' },
  { hand: 'KJs', category: 'playable', action: 'Relancer position', equity: 59, note: 'Bons draws, bonne valeur.' },
  { hand: 'QJs', category: 'playable', action: 'Relancer position', equity: 57, note: 'Hand de drawing puissante.' },
  { hand: 'JTs', category: 'playable', action: 'Position only', equity: 56, note: 'Excellents draws.' },
  { hand: 'AQo', category: 'playable', action: 'Relancer, attention OOP', equity: 64, note: 'Puissant mais délicat sans position.' },
  { hand: '77', category: 'speculative', action: 'Set mining', equity: 66, note: 'Bonne si vous pouvez voir le flop pas cher.' },
  { hand: '66', category: 'speculative', action: 'Set mining seulement', equity: 63, note: 'Cherchez les sets cheap.' },
  { hand: 'T9s', category: 'speculative', action: 'Position, multi-way', equity: 54, note: 'Très bon en multiway en position.' },
  { hand: '98s', category: 'speculative', action: 'Position seulement', equity: 52, note: 'Drawing hand, besoin de position.' },
  { hand: 'A2s-A5s', category: 'speculative', action: 'Blind defense, late position', equity: 58, note: 'Nut flush draw potential.' },
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
    tournament: 'WSOP Main Event 2003 — Table Finale',
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
    title: 'Phil Ivey — Le Bluff Parfait',
    players: ['Phil Ivey', 'Paul Jackson'],
    year: 2005,
    tournament: 'Monte Carlo Millions',
    potSize: '$800,000',
    description: 'Phil Ivey, souvent considéré comme le meilleur joueur de poker de tous les temps, exécute un bluff en triple barrel d\'une précision chirurgicale contre Paul Jackson avec une high card. La lecture d\'Ivey est parfaite — il sait que Jackson ne peut pas call.',
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
    title: 'Isildur1 vs Durrrr — Le Pot à 1.1M$',
    players: ['Viktor "Isildur1" Blom', 'Tom "Durrrr" Dwan'],
    year: 2009,
    tournament: 'Full Tilt Poker — High Stakes Online',
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
    heroAction: 'AA all-in pré-flop — dominé jusqu\'au turn. K au flop donne un set à Dwan.',
    result: 'Dwan remporte le pot avec un Full House Kings full of 2s. Isildur1 sort avec AA crackés.',
    lesson: 'Même les mains les plus fortes peuvent être battues. Le variance management et le bankroll management sont essentiels au plus haut niveau.',
    epicness: 10,
  },
  {
    id: 'negreanu-wsop-2004',
    title: 'Daniel Negreanu — The Call Down',
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
    title: 'Johnny Chan — La Lenteur Légendaire',
    players: ['Johnny Chan', 'Erik Seidel'],
    year: 1988,
    tournament: 'WSOP Main Event 1988 — Table Finale',
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
    title: 'Antonius vs Dwan — Pot Monstrueux PLO',
    players: ['Patrik Antonius', 'Tom Dwan'],
    year: 2009,
    tournament: 'Full Tilt High Stakes — Pot Limit Omaha',
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
  { sizing: '1/4 pot', callAmount: '25%', breakEven: '20%', interpretation: 'Call très large — besoin de peu d\'équité' },
  { sizing: '1/3 pot', callAmount: '25%', breakEven: '25%', interpretation: 'Call standard — flush draws rentables' },
  { sizing: '1/2 pot', callAmount: '33%', breakEven: '25%', interpretation: 'Draws avec 9 outs = borderline' },
  { sizing: '2/3 pot', callAmount: '40%', breakEven: '29%', interpretation: 'Besoin de bons draws' },
  { sizing: '3/4 pot', callAmount: '43%', breakEven: '30%', interpretation: 'Flush draw seul insuffisant' },
  { sizing: 'Pot', callAmount: '50%', breakEven: '33%', interpretation: 'OESD + flush draw seulement' },
  { sizing: '1.5x pot', callAmount: '60%', breakEven: '40%', interpretation: 'Besoin de near-nuts ou equity massive' },
  { sizing: 'All-in (2x pot)', callAmount: '67%', breakEven: '40%', interpretation: 'Call très serré — near nuts requis' },
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

export interface Level {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  gradient: string;
  borderColor: string;
  glowColor: string;
  icon: string;
  modules: number;
  estimatedHours: string;
  topics: string[];
  requiresLevel?: string;
  isLocked?: boolean;
}

export const LEVELS: Level[] = [
  {
    id: 'debutant',
    name: 'Débutant',
    subtitle: 'Les fondamentaux',
    description: 'Découvrez les règles du Texas Hold\'em, apprenez la force des mains, comprenez les positions et maîtrisez les actions de base.',
    color: '#27ae60',
    gradient: 'from-green-900 to-green-700',
    borderColor: 'border-green-500',
    glowColor: 'rgba(39, 174, 96, 0.4)',
    icon: '🌱',
    modules: 6,
    estimatedHours: '3-5h',
    topics: ['Règles du Texas Hold\'em', 'Hiérarchie des mains', 'Les positions', 'Les actions', 'Sélection de mains basique', 'Votre première main'],
  },
  {
    id: 'intermediaire',
    name: 'Intermédiaire',
    subtitle: 'La stratégie prend forme',
    description: 'Maîtrisez les pot odds, la valeur attendue, la sélection de mains, les continuation bets et les bases du bluff.',
    color: '#2980b9',
    gradient: 'from-blue-900 to-blue-700',
    borderColor: 'border-blue-500',
    glowColor: 'rgba(41, 128, 185, 0.4)',
    icon: '🎯',
    modules: 7,
    estimatedHours: '5-8h',
    topics: ['Pot Odds & Équité', 'Valeur Attendue (EV)', 'Main Selection Charts', 'Continuation Betting', 'Semi-bluff', 'Hand Reading Basique', 'Bankroll Management'],
  },
  {
    id: 'avance',
    name: 'Avancé',
    subtitle: 'Penser comme un pro',
    description: 'Entrez dans le monde du GTO, des ranges, des 3-bets, du blocage et du calcul d\'équité avancé.',
    color: '#8e44ad',
    gradient: 'from-purple-900 to-purple-700',
    borderColor: 'border-purple-500',
    glowColor: 'rgba(142, 68, 173, 0.4)',
    icon: '🔮',
    modules: 8,
    estimatedHours: '8-12h',
    topics: ['GTO Basics', 'Range Construction', '3-bets & 4-bets', 'Blocking Effects', 'ICM Tournois', 'Outs & Équité avancés', 'Multi-way Pots', 'Bet Sizing Theory'],
  },
  {
    id: 'expert',
    name: 'Expert',
    subtitle: 'La maîtrise totale',
    description: 'Solver-based thinking, balanced ranges, exploitation avancée, mental game de champion.',
    color: '#c9a84c',
    gradient: 'from-yellow-900 to-yellow-700',
    borderColor: 'border-yellow-500',
    glowColor: 'rgba(201, 168, 76, 0.5)',
    icon: '⚡',
    modules: 8,
    estimatedHours: '12-20h',
    topics: ['Solver Thinking', 'Balanced Ranges', 'Exploitation Avancée', 'HUD & Stats', 'Mental Game', 'Table Selection', 'Study Routines', 'Leaks Analysis'],
  },
  {
    id: 'professionnel',
    name: 'Professionnel',
    subtitle: 'L\'élite mondiale',
    description: 'Hands légendaires, stratégies des grands pros, tournois majeurs, et les secrets du plus haut niveau.',
    color: '#e74c3c',
    gradient: 'from-red-900 to-red-800',
    borderColor: 'border-red-400',
    glowColor: 'rgba(231, 76, 60, 0.5)',
    icon: '👑',
    modules: 6,
    estimatedHours: '10-15h',
    topics: ['Mains Légendaires', 'Stratégies des Pros', 'WSOP & High Stakes', 'Cash Game vs Tournois', 'Poker Mentale Elite', 'Les Grands Secrets'],
    requiresLevel: 'expert',
    isLocked: true,
  },
];

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
    options: ['Fold — trop risqué', 'Call — jouons passivement', '3-bet — entre 9x et 12x', 'All-in direct'],
    correctIndex: 2,
    explanation: 'KK est la 2e main la plus forte. Vous devez 3-bet pour construire le pot et protéger contre les mains comme AK ou QQ.',
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
];
