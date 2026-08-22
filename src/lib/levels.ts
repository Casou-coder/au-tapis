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

export function getLevels(locale: string): Level[] {
  const isEn = locale === 'en';
  return [
    {
      id: 'debutant',
      name: isEn ? 'Beginner' : 'Débutant',
      subtitle: isEn ? 'The fundamentals' : 'Les fondamentaux',
      description: isEn
        ? "Discover Texas Hold'em rules, learn hand rankings, understand positions and master basic actions."
        : "Découvrez les règles du Texas Hold'em, apprenez la force des mains, comprenez les positions et maîtrisez les actions de base.",
      color: '#27ae60',
      gradient: 'from-green-900 to-green-700',
      borderColor: 'border-green-500',
      glowColor: 'rgba(39, 174, 96, 0.4)',
      icon: '🌱',
      modules: 8,
      estimatedHours: '3-5h',
      topics: isEn
        ? ["Texas Hold'em Rules", 'Hand Rankings', 'Positions', 'Actions', 'Basic Hand Selection', 'Your First Hand']
        : ["Règles du Texas Hold'em", 'Hiérarchie des mains', 'Les positions', 'Les actions', 'Sélection de mains basique', 'Votre première main'],
    },
    {
      id: 'intermediaire',
      name: isEn ? 'Intermediate' : 'Intermédiaire',
      subtitle: isEn ? 'Strategy takes shape' : 'La stratégie prend forme',
      description: isEn
        ? 'Master pot odds, expected value, hand selection, continuation bets and bluffing basics.'
        : 'Maîtrisez les pot odds, la valeur attendue, la sélection de mains, les continuation bets et les bases du bluff.',
      color: '#2980b9',
      gradient: 'from-blue-900 to-blue-700',
      borderColor: 'border-blue-500',
      glowColor: 'rgba(41, 128, 185, 0.4)',
      icon: '🎯',
      modules: 8,
      estimatedHours: '5-8h',
      topics: isEn
        ? ['Pot Odds', 'Expected Value (EV)', 'Range Construction', 'C-bet', 'Bluff & Semi-bluff', 'Board Texture']
        : ['Pot Odds & Équité', 'Valeur Attendue (EV)', 'Charts de sélection de mains', 'Continuation Betting', 'Semi-bluff', 'Lecture de main basique', 'Bankroll Management'],
    },
    {
      id: 'avance',
      name: isEn ? 'Advanced' : 'Avancé',
      subtitle: isEn ? 'The GTO mindset' : 'Penser comme un pro',
      description: isEn
        ? 'Dive into GTO basics, range construction, 3-bets, blockers, ICM, bet sizing and multiway pots.'
        : "Entrez dans le monde du GTO, des ranges, des 3-bets, du blocage et du calcul d'équité avancé.",
      color: '#8e44ad',
      gradient: 'from-purple-900 to-purple-700',
      borderColor: 'border-purple-500',
      glowColor: 'rgba(142, 68, 173, 0.4)',
      icon: '🔮',
      modules: 9,
      estimatedHours: '8-12h',
      topics: isEn
        ? ['GTO Basics', '3-bet/4-bet', 'Blockers', 'ICM', 'Bet Sizing', 'Multiway Pots']
        : ['Bases du GTO', 'Construction de range', '3-bets & 4-bets', 'Effets de blocage', 'ICM Tournois', 'Outs & Équité avancés', 'Multi-way Pots', 'Théorie du bet sizing'],
    },
    {
      id: 'expert',
      name: isEn ? 'Expert' : 'Expert',
      subtitle: isEn ? 'The elite level' : 'La maîtrise totale',
      description: isEn
        ? 'Solver thinking, balanced ranges, HUD reading, mental game and study routines to reach the top.'
        : 'Raisonnement basé sur les solvers, ranges équilibrées, exploitation avancée, mental de champion.',
      color: '#c9a84c',
      gradient: 'from-yellow-900 to-yellow-700',
      borderColor: 'border-yellow-500',
      glowColor: 'rgba(201, 168, 76, 0.5)',
      icon: '⚡',
      modules: 9,
      estimatedHours: '12-20h',
      topics: isEn
        ? ['Solver Thinking', 'Balanced Ranges', 'HUD Analysis', 'Mental Game', 'Study Routines', 'Live vs Online']
        : ['Raisonnement Solver', 'Ranges Équilibrées', 'Exploitation Avancée', 'HUD & Stats', 'Jeu Mental', 'Sélection de Table', "Routines d'Étude", 'Analyse des Fuites'],
    },
    {
      id: 'professionnel',
      name: isEn ? 'Professional' : 'Professionnel',
      subtitle: isEn ? "The champions' secrets" : "L'élite mondiale",
      description: isEn
        ? 'Legendary hands, WSOP champion strategies and the deepest secrets of the highest poker level.'
        : "Hands légendaires, stratégies des grands pros, tournois majeurs, et les secrets du plus haut niveau.",
      color: '#e74c3c',
      gradient: 'from-red-900 to-red-800',
      borderColor: 'border-red-400',
      glowColor: 'rgba(231, 76, 60, 0.5)',
      icon: '👑',
      modules: 7,
      estimatedHours: '10-15h',
      topics: isEn
        ? ['Legendary Hands', 'WSOP Champions', 'Highest Stakes', 'Exploitative Play', 'Tournament Strategy', 'Bankroll at the Top']
        : ['Mains Légendaires', 'Stratégies des Pros', 'WSOP & High Stakes', 'Cash Game vs Tournois', 'Poker Mentale Elite', 'Les Grands Secrets'],
      requiresLevel: 'expert',
      isLocked: true,
    },
  ];
}

// Keep LEVELS export for backwards compat (FR default)
export const LEVELS = getLevels('fr');
