export type BadgeIcon = 'flame' | 'spade' | 'crown' | 'target' | 'circuit' | 'chips' | 'eye' | 'sigma' | 'book' | 'spark' | 'diamond';
export type BadgeSeries = 'ritualiste' | 'grinder' | 'architecte' | 'faucon' | 'specialiste' | 'bapteme' | 'justesse' | 'main';

export interface BadgeDef {
  id: string;
  series: BadgeSeries;
  nameFr: string;
  nameEn: string;
  condFr: string;
  condEn: string;
  color: string;
  icon: BadgeIcon;
  stars?: [number, number];
  tag?: string;
  check: (data: BadgeData) => boolean;
}

export interface BadgeData {
  maxStreak: number;
  totalChallenges: number;
  totalCorrect: number;
  totalXp: number;
  typeStats: Record<string, { correct: number; total: number }>;
  completedLevels: string[];
  maxConsecutiveCorrect: number;
  hasAnyChallenge: boolean;
  hasAnyDaily: boolean;
  hasAnyLevel: boolean;
}

export const BADGE_SERIES_META: Record<BadgeSeries, { label: string; labelFr: string; color: string }> = {
  bapteme:     { label: 'Baptism',     labelFr: 'Baptême',       color: '#94a3b8' },
  main:        { label: 'The Hand',    labelFr: 'La Main',       color: '#fbbf24' },
  ritualiste:  { label: 'Ritualist',   labelFr: 'Ritualiste',    color: '#f97316' },
  grinder:     { label: 'The Grinder', labelFr: 'Le Grinder',    color: '#22c55e' },
  architecte:  { label: 'Architect',   labelFr: 'Architecte',    color: '#a855f7' },
  faucon:      { label: 'Hawk Eye',    labelFr: 'Œil de Faucon', color: '#22d3ee' },
  specialiste: { label: 'Specialist',  labelFr: 'Spécialiste',   color: '#eab308' },
  justesse:    { label: 'La Justesse', labelFr: 'La Justesse',   color: '#f472b6' },
};

export const BADGES: BadgeDef[] = [
  // ── RITUALISTE ──────────────────────────────────────────────────────────────
  { id: 'r1', series: 'ritualiste', color: '#f97316', icon: 'flame', stars: [1, 5],
    nameFr: "L'Habitué",      nameEn: 'The Regular',
    condFr: '7 jours de suite',   condEn: '7 days in a row',
    check: d => d.maxStreak >= 7 },
  { id: 'r2', series: 'ritualiste', color: '#f97316', icon: 'flame', stars: [2, 5],
    nameFr: 'Le Ritualiste',  nameEn: 'The Ritualist',
    condFr: '30 jours de suite',  condEn: '30 days in a row',
    check: d => d.maxStreak >= 30 },
  { id: 'r3', series: 'ritualiste', color: '#f97316', icon: 'flame', stars: [3, 5],
    nameFr: 'Le Dévot',       nameEn: 'The Devout',
    condFr: '100 jours de suite', condEn: '100 days in a row',
    check: d => d.maxStreak >= 100 },
  { id: 'r4', series: 'ritualiste', color: '#f97316', icon: 'flame', stars: [4, 5],
    nameFr: "L'Inébranlable", nameEn: 'The Unbreakable',
    condFr: '200 jours de suite', condEn: '200 days in a row',
    check: d => d.maxStreak >= 200 },
  { id: 'r5', series: 'ritualiste', color: '#f97316', icon: 'flame', stars: [5, 5],
    nameFr: "L'Éternel",      nameEn: 'The Eternal',
    condFr: '365 jours de suite', condEn: '365 days in a row',
    check: d => d.maxStreak >= 365 },

  // ── GRINDER ─────────────────────────────────────────────────────────────────
  { id: 'g1',  series: 'grinder', color: '#22c55e', icon: 'spade', tag: '5',
    nameFr: 'Mise en Route', nameEn: 'Getting Started',
    condFr: '5 défis',  condEn: '5 challenges',  check: d => d.totalChallenges >= 5 },
  { id: 'g2',  series: 'grinder', color: '#22c55e', icon: 'spade', tag: '10',
    nameFr: 'Régulier',      nameEn: 'Regular',
    condFr: '10 défis', condEn: '10 challenges', check: d => d.totalChallenges >= 10 },
  { id: 'g3',  series: 'grinder', color: '#22c55e', icon: 'spade', tag: '25',
    nameFr: 'Le Grinder',    nameEn: 'The Grinder',
    condFr: '25 défis', condEn: '25 challenges', check: d => d.totalChallenges >= 25 },
  { id: 'g4',  series: 'grinder', color: '#22c55e', icon: 'spade', tag: '50',
    nameFr: 'Semi-Pro',      nameEn: 'Semi-Pro',
    condFr: '50 défis', condEn: '50 challenges', check: d => d.totalChallenges >= 50 },
  { id: 'g5',  series: 'grinder', color: '#22c55e', icon: 'spade', tag: '100',
    nameFr: 'Requin',        nameEn: 'Shark',
    condFr: '100 défis', condEn: '100 challenges', check: d => d.totalChallenges >= 100 },
  { id: 'g6',  series: 'grinder', color: '#22c55e', icon: 'spade', tag: '150',
    nameFr: 'Crusher',       nameEn: 'Crusher',
    condFr: '150 défis', condEn: '150 challenges', check: d => d.totalChallenges >= 150 },
  { id: 'g7',  series: 'grinder', color: '#22c55e', icon: 'spade', tag: '200',
    nameFr: 'High Roller',   nameEn: 'High Roller',
    condFr: '200 défis', condEn: '200 challenges', check: d => d.totalChallenges >= 200 },
  { id: 'g8',  series: 'grinder', color: '#22c55e', icon: 'spade', tag: '250',
    nameFr: 'Élite',         nameEn: 'Elite',
    condFr: '250 défis', condEn: '250 challenges', check: d => d.totalChallenges >= 250 },
  { id: 'g9',  series: 'grinder', color: '#22c55e', icon: 'spade', tag: '300',
    nameFr: 'Grand Maître',  nameEn: 'Grand Master',
    condFr: '300 défis', condEn: '300 challenges', check: d => d.totalChallenges >= 300 },
  { id: 'g10', series: 'grinder', color: '#22c55e', icon: 'spade', tag: '400',
    nameFr: 'Légende',       nameEn: 'Legend',
    condFr: '400 défis', condEn: '400 challenges', check: d => d.totalChallenges >= 400 },
  { id: 'g11', series: 'grinder', color: '#22c55e', icon: 'spade', tag: '500',
    nameFr: 'Forged',        nameEn: 'Forged',
    condFr: '500 défis', condEn: '500 challenges', check: d => d.totalChallenges >= 500 },

  // ── ARCHITECTE ──────────────────────────────────────────────────────────────
  { id: 'a1', series: 'architecte', color: '#a855f7', icon: 'crown',
    nameFr: 'Les Fondations', nameEn: 'The Foundations',
    condFr: 'Niveau Débutant terminé',      condEn: 'Beginner level complete',
    check: d => d.completedLevels.includes('debutant') },
  { id: 'a2', series: 'architecte', color: '#a855f7', icon: 'crown',
    nameFr: "L'Apprenti",    nameEn: 'The Apprentice',
    condFr: 'Niveau Intermédiaire terminé', condEn: 'Intermediate level complete',
    check: d => d.completedLevels.includes('intermediaire') },
  { id: 'a3', series: 'architecte', color: '#a855f7', icon: 'crown',
    nameFr: 'Le Stratège',   nameEn: 'The Strategist',
    condFr: 'Niveau Avancé terminé',        condEn: 'Advanced level complete',
    check: d => d.completedLevels.includes('avance') },
  { id: 'a4', series: 'architecte', color: '#a855f7', icon: 'crown',
    nameFr: 'Le Virtuose',   nameEn: 'The Virtuoso',
    condFr: 'Niveau Expert terminé',        condEn: 'Expert level complete',
    check: d => d.completedLevels.includes('expert') },
  { id: 'a5', series: 'architecte', color: '#a855f7', icon: 'crown',
    nameFr: 'Forged Pro',    nameEn: 'Forged Pro',
    condFr: 'Niveau Professionnel terminé', condEn: 'Professional level complete',
    check: d => d.completedLevels.includes('professionnel') },

  // ── ŒIL DE FAUCON ───────────────────────────────────────────────────────────
  { id: 'f1', series: 'faucon', color: '#22d3ee', icon: 'target',
    nameFr: 'Tireur',      nameEn: 'Sharpshooter',
    condFr: "5 corrects d'affilée",  condEn: '5 correct in a row',
    check: d => d.maxConsecutiveCorrect >= 5 },
  { id: 'f2', series: 'faucon', color: '#22d3ee', icon: 'target',
    nameFr: 'Sniper',      nameEn: 'Sniper',
    condFr: "10 corrects d'affilée", condEn: '10 correct in a row',
    check: d => d.maxConsecutiveCorrect >= 10 },
  { id: 'f3', series: 'faucon', color: '#22d3ee', icon: 'target',
    nameFr: 'Laser',       nameEn: 'Laser',
    condFr: "20 corrects d'affilée", condEn: '20 correct in a row',
    check: d => d.maxConsecutiveCorrect >= 20 },
  { id: 'f4', series: 'faucon', color: '#22d3ee', icon: 'target',
    nameFr: 'Infaillible', nameEn: 'Infallible',
    condFr: "50 corrects d'affilée", condEn: '50 correct in a row',
    check: d => d.maxConsecutiveCorrect >= 50 },

  // ── SPÉCIALISTE ─────────────────────────────────────────────────────────────
  { id: 's1', series: 'specialiste', color: '#eab308', icon: 'circuit',
    nameFr: 'Machine GTO',      nameEn: 'GTO Machine',
    condFr: '10 défis GTO réussis',     condEn: '10 GTO challenges passed',
    check: d => (d.typeStats['gto']?.correct ?? 0) >= 10 },
  { id: 's2', series: 'specialiste', color: '#eab308', icon: 'chips',
    nameFr: 'Architecte ICM',   nameEn: 'ICM Architect',
    condFr: '10 défis ICM réussis',     condEn: '10 ICM challenges passed',
    check: d => (d.typeStats['icm']?.correct ?? 0) >= 10 },
  { id: 's3', series: 'specialiste', color: '#eab308', icon: 'eye',
    nameFr: 'Lecteur de Tells', nameEn: 'Tell Reader',
    condFr: '10 défis Read réussis',    condEn: '10 Read challenges passed',
    check: d => (d.typeStats['reads']?.correct ?? 0) >= 10 },
  { id: 's4', series: 'specialiste', color: '#eab308', icon: 'sigma',
    nameFr: 'Le Calculateur',   nameEn: 'The Calculator',
    condFr: '10 défis Calcul réussis',  condEn: '10 Calc challenges passed',
    check: d => (d.typeStats['calculation']?.correct ?? 0) >= 10 },
  { id: 's5', series: 'specialiste', color: '#eab308', icon: 'book',
    nameFr: 'Encyclopédiste',   nameEn: 'Encyclopedist',
    condFr: 'Tous les types maîtrisés', condEn: 'All types mastered',
    check: d => ['gto', 'icm', 'reads', 'calculation', 'decision'].every(
      t => (d.typeStats[t]?.correct ?? 0) >= 10
    ) },

  // ── LA MAIN (XP) ────────────────────────────────────────────────────────────
  { id: 'm1',  series: 'main', color: '#fbbf24', icon: 'diamond',
    nameFr: 'High Card',           nameEn: 'High Card',
    condFr: '50 XP',               condEn: '50 XP',
    check: d => d.totalXp >= 50 },
  { id: 'm2',  series: 'main', color: '#fbbf24', icon: 'diamond',
    nameFr: 'Paire',               nameEn: 'One Pair',
    condFr: '150 XP',              condEn: '150 XP',
    check: d => d.totalXp >= 150 },
  { id: 'm3',  series: 'main', color: '#fbbf24', icon: 'diamond',
    nameFr: 'Double Paire',        nameEn: 'Two Pair',
    condFr: '400 XP',              condEn: '400 XP',
    check: d => d.totalXp >= 400 },
  { id: 'm4',  series: 'main', color: '#fbbf24', icon: 'diamond',
    nameFr: 'Brelan',              nameEn: 'Three of a Kind',
    condFr: '800 XP',              condEn: '800 XP',
    check: d => d.totalXp >= 800 },
  { id: 'm5',  series: 'main', color: '#fbbf24', icon: 'diamond',
    nameFr: 'Suite',               nameEn: 'Straight',
    condFr: '1 500 XP',            condEn: '1,500 XP',
    check: d => d.totalXp >= 1500 },
  { id: 'm6',  series: 'main', color: '#fbbf24', icon: 'diamond',
    nameFr: 'Couleur',             nameEn: 'Flush',
    condFr: '2 500 XP',            condEn: '2,500 XP',
    check: d => d.totalXp >= 2500 },
  { id: 'm7',  series: 'main', color: '#fbbf24', icon: 'diamond',
    nameFr: 'Full House',          nameEn: 'Full House',
    condFr: '4 000 XP',            condEn: '4,000 XP',
    check: d => d.totalXp >= 4000 },
  { id: 'm8',  series: 'main', color: '#fbbf24', icon: 'diamond',
    nameFr: 'Carré',               nameEn: 'Four of a Kind',
    condFr: '6 000 XP',            condEn: '6,000 XP',
    check: d => d.totalXp >= 6000 },
  { id: 'm9',  series: 'main', color: '#fbbf24', icon: 'diamond',
    nameFr: 'Quinte Flush',        nameEn: 'Straight Flush',
    condFr: '9 000 XP',            condEn: '9,000 XP',
    check: d => d.totalXp >= 9000 },
  { id: 'm10', series: 'main', color: '#fbbf24', icon: 'diamond',
    nameFr: 'Quinte Flush Royale', nameEn: 'Royal Flush',
    condFr: '13 000 XP',           condEn: '13,000 XP',
    check: d => d.totalXp >= 13000 },

  // ── LA JUSTESSE (précision) ──────────────────────────────────────────────────
  { id: 'j1', series: 'justesse', color: '#f472b6', icon: 'target',
    nameFr: 'Breakeven',      nameEn: 'Breakeven',
    condFr: '60% de réussite (20+ défis)',  condEn: '60% success rate (20+ challenges)',
    check: d => d.totalChallenges >= 20 && d.totalCorrect / d.totalChallenges >= 0.60 },
  { id: 'j2', series: 'justesse', color: '#f472b6', icon: 'target',
    nameFr: 'Hero Call',      nameEn: 'Hero Call',
    condFr: '70% de réussite (50+ défis)',  condEn: '70% success rate (50+ challenges)',
    check: d => d.totalChallenges >= 50 && d.totalCorrect / d.totalChallenges >= 0.70 },
  { id: 'j3', series: 'justesse', color: '#f472b6', icon: 'target',
    nameFr: 'Ligne Claire',   nameEn: 'Clean Line',
    condFr: '80% de réussite (100+ défis)', condEn: '80% success rate (100+ challenges)',
    check: d => d.totalChallenges >= 100 && d.totalCorrect / d.totalChallenges >= 0.80 },
  { id: 'j4', series: 'justesse', color: '#f472b6', icon: 'target',
    nameFr: 'Le Solver',      nameEn: 'The Solver',
    condFr: '90% de réussite (75+ défis)',  condEn: '90% success rate (75+ challenges)',
    check: d => d.totalChallenges >= 75 && d.totalCorrect / d.totalChallenges >= 0.90 },
  { id: 'j5', series: 'justesse', color: '#f472b6', icon: 'target',
    nameFr: 'Absolute Nuts',  nameEn: 'Absolute Nuts',
    condFr: '95% de réussite (50+ défis)',  condEn: '95% success rate (50+ challenges)',
    check: d => d.totalChallenges >= 50 && d.totalCorrect / d.totalChallenges >= 0.95 },

  // ── BAPTÊME ─────────────────────────────────────────────────────────────────
  { id: 'b1', series: 'bapteme', color: '#94a3b8', icon: 'spark',
    nameFr: 'Premier Sang', nameEn: 'First Blood',
    condFr: '1er défi complété',   condEn: '1st challenge done',
    check: d => d.hasAnyChallenge },
  { id: 'b2', series: 'bapteme', color: '#94a3b8', icon: 'spark',
    nameFr: 'Dans le Bain',  nameEn: 'Into the Deep',
    condFr: '1er défi quotidien',  condEn: '1st daily challenge',
    check: d => d.hasAnyDaily },
  { id: 'b3', series: 'bapteme', color: '#94a3b8', icon: 'spark',
    nameFr: 'Le Départ',     nameEn: 'The Departure',
    condFr: '1er niveau terminé',  condEn: '1st level complete',
    check: d => d.hasAnyLevel },
];

export function computeBadges(data: BadgeData): { badge: BadgeDef; earned: boolean }[] {
  return BADGES.map(badge => ({ badge, earned: badge.check(data) }));
}

export const BADGE_SERIES_ORDER: BadgeSeries[] = [
  'bapteme', 'main', 'ritualiste', 'grinder', 'architecte', 'faucon', 'specialiste', 'justesse',
];
