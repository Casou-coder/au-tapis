export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const;

export function getHand(row: number, col: number): string {
  if (row === col) return RANKS[row] + RANKS[row];
  if (row < col) return RANKS[row] + RANKS[col] + 's';
  return RANKS[col] + RANKS[row] + 'o';
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

// ─── SB 3-bet vs BTN (polarized, ~12%) ────────────────────────────────────────

const SB_3BET_VS_BTN: string[] = [
  'QQ','KK','AA','AKs','AQs','AKo',
  'JJ',
  'A2s','A3s','A4s','A5s',
  'K3s','K4s','K5s',
  '54s','65s','43s',
];

// ─── BTN 3-bet vs CO (polarized, ~13%) ────────────────────────────────────────

const BTN_3BET_VS_CO: string[] = [
  'JJ','QQ','KK','AA',
  'AQs','AKs','AKo',
  'TT',
  'A2s','A3s','A4s','A5s',
  'K3s','K4s',
  '54s','65s','76s',
];

// ─── Challenge list ────────────────────────────────────────────────────────────

export const RANGE_CHALLENGES: RangeChallenge[] = [
  {
    id: 'btn-open',
    title: 'BTN Open',
    tag: 'BTN · 40%',
    difficulty: 1,
    context: '6-max cash, 100BB. You are on the BTN (Button), everyone folds to you.',
    instruction: 'Build your opening range from the BTN. Click the hands you open.',
    openPct: '~40%',
    correctRange: BTN_OPEN,
    explanation: 'From the BTN, you have maximum positional advantage post-flop against the only potential opponent (BB). You can open very wide (~40%): all pairs, all suited aces, suited connectors down to 43s, and offsuit broadways up to K9o+. The more position you have, the wider your range.',
  },
  {
    id: 'co-open',
    title: 'CO Open',
    tag: 'CO · 25%',
    difficulty: 1,
    context: '6-max cash, 100BB. You are in the CO (Cutoff), UTG and HJ have folded.',
    instruction: 'Build your opening range from the CO.',
    openPct: '~25%',
    correctRange: CO_OPEN,
    explanation: 'From the CO, you have a good position but the BTN can still isolate. Your range (~25%) stays wide: all pairs, all suited aces, but you trim weak suited kings (K2s–K6s), weak suited queens, and light offsuit hands. You always keep a polarized range with suited connectors for balance.',
  },
  {
    id: 'utg-open',
    title: 'UTG Open',
    tag: 'UTG · 13%',
    difficulty: 2,
    context: '6-max cash, 100BB. You are UTG (Under The Gun), first to act.',
    instruction: 'Build your opening range from UTG. Careful: 5 players are left to act.',
    openPct: '~13%',
    correctRange: UTG_OPEN,
    explanation: 'From UTG, 5 opponents can still enter. Your range tightens drastically (~13%): pairs 77+ only, strong suited broadways (JTs+, KTs+, QTs+), some suited aces (ATs+ for value, A2s–A5s as blockers), and strong offsuit broadways (ATo+, AKo/AQo/AJo, KQo). Strict hand selection protects your range against 3-bets.',
  },
  {
    id: 'sb-3bet-btn',
    title: 'SB 3-bet vs BTN',
    tag: 'SB · Polarized · 12%',
    difficulty: 2,
    context: '6-max cash, 100BB. BTN opens to 3BB, folds to you in SB.',
    instruction: 'Build your 3-bet range from SB against a BTN open. Polarized range.',
    openPct: '~12%',
    correctRange: SB_3BET_VS_BTN,
    explanation: 'SB 3-bets in a polarized manner: strong value (QQ+, AKs, AQs, AKo) + bluffs with blockers. Low suited aces (A2s–A5s) are ideal: they block AK/AQ combos, have equity via the flush draw, and are too weak to call. Avoid medium hands (JJ, TT, AQo) which you prefer to call. Polarization keeps the range unexploitable.',
  },
  {
    id: 'btn-3bet-co',
    title: 'BTN 3-bet vs CO',
    tag: 'BTN · Polarized · 13%',
    difficulty: 2,
    context: '6-max cash, 100BB. CO opens to 3BB, folds to BTN.',
    instruction: 'Build your 3-bet range from BTN against CO. You have position.',
    openPct: '~13%',
    correctRange: BTN_3BET_VS_CO,
    explanation: 'From BTN vs CO, having position post-flop allows a slightly wider 3-bet range. Value: JJ+ (TT borderline), AQs+, AKo. Bluffs: A2s–A5s (blockers), K3s–K4s (KK blockers), low suited connectors (54s, 65s, 76s) with implied equity. Position allows you to also call hands like TT or AJs that you would 3-bet from SB.',
  },
];
