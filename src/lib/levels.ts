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
    description: "Découvrez les règles du Texas Hold'em, apprenez la force des mains, comprenez les positions et maîtrisez les actions de base.",
    color: '#27ae60',
    gradient: 'from-green-900 to-green-700',
    borderColor: 'border-green-500',
    glowColor: 'rgba(39, 174, 96, 0.4)',
    icon: '🌱',
    modules: 8,
    estimatedHours: '3-5h',
    topics: ["Règles du Texas Hold'em", 'Hiérarchie des mains', 'Les positions', 'Les actions', 'Sélection de mains basique', 'Votre première main'],
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
    modules: 8,
    estimatedHours: '5-8h',
    topics: ['Pot Odds & Équité', 'Valeur Attendue (EV)', 'Charts de sélection de mains', 'Continuation Betting', 'Semi-bluff', 'Lecture de main basique', 'Bankroll Management'],
  },
  {
    id: 'avance',
    name: 'Avancé',
    subtitle: 'Penser comme un pro',
    description: "Entrez dans le monde du GTO, des ranges, des 3-bets, du blocage et du calcul d'équité avancé.",
    color: '#8e44ad',
    gradient: 'from-purple-900 to-purple-700',
    borderColor: 'border-purple-500',
    glowColor: 'rgba(142, 68, 173, 0.4)',
    icon: '🔮',
    modules: 9,
    estimatedHours: '8-12h',
    topics: ['Bases du GTO', 'Construction de range', '3-bets & 4-bets', 'Effets de blocage', 'ICM Tournois', 'Outs & Équité avancés', 'Multi-way Pots', 'Théorie du bet sizing'],
  },
  {
    id: 'expert',
    name: 'Expert',
    subtitle: 'La maîtrise totale',
    description: 'Raisonnement basé sur les solvers, ranges équilibrées, exploitation avancée, mental de champion.',
    color: '#c9a84c',
    gradient: 'from-yellow-900 to-yellow-700',
    borderColor: 'border-yellow-500',
    glowColor: 'rgba(201, 168, 76, 0.5)',
    icon: '⚡',
    modules: 9,
    estimatedHours: '12-20h',
    topics: ['Raisonnement Solver', 'Ranges Équilibrées', 'Exploitation Avancée', 'HUD & Stats', 'Jeu Mental', 'Sélection de Table', "Routines d'Étude", 'Analyse des Fuites'],
  },
  {
    id: 'professionnel',
    name: 'Professionnel',
    subtitle: "L'élite mondiale",
    description: "Hands légendaires, stratégies des grands pros, tournois majeurs, et les secrets du plus haut niveau.",
    color: '#e74c3c',
    gradient: 'from-red-900 to-red-800',
    borderColor: 'border-red-400',
    glowColor: 'rgba(231, 76, 60, 0.5)',
    icon: '👑',
    modules: 7,
    estimatedHours: '10-15h',
    topics: ['Mains Légendaires', 'Stratégies des Pros', 'WSOP & High Stakes', 'Cash Game vs Tournois', 'Poker Mentale Elite', 'Les Grands Secrets'],
    requiresLevel: 'expert',
    isLocked: true,
  },
];
