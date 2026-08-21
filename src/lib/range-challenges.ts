export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const;

export function getHand(row: number, col: number): string {
  if (row === col) return RANKS[row] + RANKS[row];
  if (row < col) return RANKS[row] + RANKS[col] + 's'; // suited = upper triangle
  return RANKS[col] + RANKS[row] + 'o';                // offsuit = lower triangle
}

export interface RangeChallenge {
  id: string;
  title: string;
  tag: string;
  difficulty: 1 | 2 | 3;
  context: string;
  instruction: string;
  openPct: string;
  correctRange: string[];
  explanation: string;
}

// ─── BTN Open ~40% ────────────────────────────────────────────────────────────

const BTN_OPEN: string[] = [
  '22','33','44','55','66','77','88','99','TT','JJ','QQ','KK','AA',
  'A2s','A3s','A4s','A5s','A6s','A7s','A8s','A9s','ATs','AJs','AQs','AKs',
  'K2s','K3s','K4s','K5s','K6s','K7s','K8s','K9s','KTs','KJs','KQs',
  'Q4s','Q5s','Q6s','Q7s','Q8s','Q9s','QTs','QJs',
  'J6s','J7s','J8s','J9s','JTs',
  'T7s','T8s','T9s',
  '97s','98s','87s','86s','76s','75s','65s','64s','54s','53s','43s',
  'A4o','A5o','A6o','A7o','A8o','A9o','ATo','AJo','AQo','AKo',
  'K9o','KTo','KJo','KQo',
  'Q9o','QTo','QJo',
  'J9o','JTo','T9o','98o',
];

// ─── CO Open ~25% ─────────────────────────────────────────────────────────────

const CO_OPEN: string[] = [
  '22','33','44','55','66','77','88','99','TT','JJ','QQ','KK','AA',
  'A2s','A3s','A4s','A5s','A6s','A7s','A8s','A9s','ATs','AJs','AQs','AKs',
  'K7s','K8s','K9s','KTs','KJs','KQs',
  'Q7s','Q8s','Q9s','QTs','QJs',
  'J8s','J9s','JTs',
  'T8s','T9s',
  '97s','98s','87s','76s',
  'ATo','AJo','AQo','AKo',
  'KTo','KJo','KQo',
  'QTo','QJo',
  'JTo',
];

// ─── UTG Open ~13% ────────────────────────────────────────────────────────────

const UTG_OPEN: string[] = [
  '77','88','99','TT','JJ','QQ','KK','AA',
  'A2s','A3s','A4s','A5s',
  'ATs','AJs','AQs','AKs',
  'KTs','KJs','KQs',
  'QTs','QJs',
  'JTs','T9s','98s',
  'ATo','AJo','AQo','AKo',
  'KQo',
];

// ─── SB 3-bet vs BTN (polarisé, ~12%) ─────────────────────────────────────────

const SB_3BET_VS_BTN: string[] = [
  // Value forte
  'QQ','KK','AA','AKs','AQs','AKo',
  // JJ semi-valeur
  'JJ',
  // Bluffs avec bloqueurs
  'A2s','A3s','A4s','A5s',
  'K3s','K4s','K5s',
  '54s','65s','43s',
];

// ─── BTN 3-bet vs CO (polarisé, ~13%) ─────────────────────────────────────────

const BTN_3BET_VS_CO: string[] = [
  // Value
  'JJ','QQ','KK','AA',
  'AQs','AKs','AKo',
  // TT borderline valeur
  'TT',
  // Bluffs avec bloqueurs
  'A2s','A3s','A4s','A5s',
  'K3s','K4s',
  '54s','65s','76s',
];

// ─── Challenge list ────────────────────────────────────────────────────────────

export const RANGE_CHALLENGES: RangeChallenge[] = [
  {
    id: 'btn-open',
    title: 'Open BTN',
    tag: 'BTN · 40%',
    difficulty: 1,
    context: '6-max cash, 100BB. Tu es au BTN (Bouton), tout le monde fold avant toi.',
    instruction: 'Construis ta range d\'ouverture depuis le BTN. Clique les mains que tu ouvres.',
    openPct: '~40%',
    correctRange: BTN_OPEN,
    explanation: 'Depuis le BTN, tu as la position maximale en post-flop contre le seul adversaire potentiel (BB). Tu peux ouvrir très large (~40%) : toutes les paires, toutes les suited aces, les connectors suited jusqu\'à 43s, et des offsuit broadways jusqu\'à K9o+. Plus tu es en position, plus ta range s\'élargit.',
  },
  {
    id: 'co-open',
    title: 'Open CO',
    tag: 'CO · 25%',
    difficulty: 1,
    context: '6-max cash, 100BB. Tu es en CO (Cutoff), les joueurs UTG et HJ ont foldé.',
    instruction: 'Construis ta range d\'ouverture depuis le CO.',
    openPct: '~25%',
    correctRange: CO_OPEN,
    explanation: 'Depuis le CO, tu es en bonne position mais le BTN peut encore isoler. Ta range (~25%) reste large : toutes les paires, toutes les suited aces, mais tu élagues les suited kings faibles (K2s-K6s), les suited queens faibles et les offsuit légers. Tu gardes toujours une range polarisée avec des suited connectors pour équilibre.',
  },
  {
    id: 'utg-open',
    title: 'Open UTG',
    tag: 'UTG · 13%',
    difficulty: 2,
    context: '6-max cash, 100BB. Tu es UTG (Under The Gun), premier à parler.',
    instruction: 'Construis ta range d\'ouverture depuis UTG. Attention : 5 joueurs restent à parler.',
    openPct: '~13%',
    correctRange: UTG_OPEN,
    explanation: 'Depuis UTG, 5 adversaires peuvent encore entrer. Ta range se resserre drastiquement (~13%) : paires 77+ seulement, broadways suitées fortes (JTs+, KTs+, QTs+), quelques suited aces (ATs+ pour valeur, A2s-A5s comme bluffs avec bloqueur), et des offsuit broadways forts (ATo+, AKo/AQo/AJo, KQo). La sélection de mains stricte protège ta range face aux 3-bets.',
  },
  {
    id: 'sb-3bet-btn',
    title: '3-bet SB vs BTN',
    tag: 'SB · Polarisé · 12%',
    difficulty: 2,
    context: '6-max cash, 100BB. BTN ouvre à 3BB, folds à toi en SB.',
    instruction: 'Construis ta range de 3-bet depuis le SB contre une ouverture BTN. Range polarisée.',
    openPct: '~12%',
    correctRange: SB_3BET_VS_BTN,
    explanation: 'Le SB 3-bette de façon polarisée : valeur forte (QQ+, AKs, AQs, AKo) + bluffs avec bloqueurs. Les suited aces basses (A2s-A5s) sont idéales : elles bloquent les combos AK/AQ adverses, ont de l\'équité avec le tirage couleur, et sont trop faibles pour call. On évite les mains moyennes (JJ, TT, AQo) qu\'on préfère caller. La polarisation rend la range inexploitable.',
  },
  {
    id: 'btn-3bet-co',
    title: '3-bet BTN vs CO',
    tag: 'BTN · Polarisé · 13%',
    difficulty: 2,
    context: '6-max cash, 100BB. CO ouvre à 3BB, folds au BTN.',
    instruction: 'Construis ta range de 3-bet depuis le BTN contre le CO. Tu as la position.',
    openPct: '~13%',
    correctRange: BTN_3BET_VS_CO,
    explanation: 'Depuis le BTN vs CO, tu as la position post-flop ce qui permet une range de 3-bet légèrement plus large. Valeur : JJ+ (TT borderline), AQs+, AKo. Bluffs : A2s-A5s (bloqueurs), K3s-K4s (bloqueurs KK), suited connectors bas (54s, 65s, 76s) avec équité implicite. La position te permet de call aussi des mains comme TT ou AJs que tu 3-betterais depuis le SB.',
  },
];
