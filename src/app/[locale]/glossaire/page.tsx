'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

type Level = 'debutant' | 'intermediaire' | 'avance';

interface Term {
  term: string;
  category: string;
  level: Level;
  definition: string;
  example?: string;
}

const TERMS: Term[] = [
  // ── Fondamentaux
  { term: 'All-in', category: 'Fondamentaux', level: 'debutant', definition: 'Miser la totalité de ses jetons restants en une seule mise.', example: 'Tu as 50BB, tu push all-in préflop avec AA.' },
  { term: 'Blind', category: 'Fondamentaux', level: 'debutant', definition: 'Mise obligatoire placée avant la distribution des cartes. La Small Blind (SB) est la moitié de la Big Blind (BB).', example: 'Aux blinds 1€/2€ : SB = 1€, BB = 2€.' },
  { term: 'Buy-in', category: 'Fondamentaux', level: 'debutant', definition: 'Montant de jetons avec lequel on entre à une table. En cash game, généralement 100 big blinds.', example: 'Table NL100 (blinds 0.50€/1€) : buy-in standard = 100€.' },
  { term: 'Check', category: 'Fondamentaux', level: 'debutant', definition: 'Passer son action sans miser, uniquement possible si personne n\'a misé avant vous.', example: 'Tu es BB, personne ne raise préflop, tu peux check.' },
  { term: 'Fold', category: 'Fondamentaux', level: 'debutant', definition: 'Se coucher, abandonner sa main et les mises déjà placées dans le pot.', example: 'Face à un gros raise avec 72o, tu fold.' },
  { term: 'Call', category: 'Fondamentaux', level: 'debutant', definition: 'Suivre la mise d\'un adversaire en payant le même montant.', example: 'Adversaire mise 10BB, tu call 10BB.' },
  { term: 'Raise', category: 'Fondamentaux', level: 'debutant', definition: 'Augmenter la mise courante. Le sizing standard est 2.5x à 3x le montant précédent.', example: 'Adversaire open 3BB, tu raise à 9BB (3-bet).' },
  { term: 'Pot', category: 'Fondamentaux', level: 'debutant', definition: 'Total des mises accumulées sur la table lors d\'une main.', example: 'Après les blinds et un raise à 3BB : pot = 4.5BB.' },
  { term: 'Board', category: 'Fondamentaux', level: 'debutant', definition: 'Les cartes communes au centre de la table, partagées par tous les joueurs.', example: 'Flop A♥K♦7♣ = les 3 premières cartes du board.' },
  { term: 'Flop', category: 'Fondamentaux', level: 'debutant', definition: 'Les 3 premières cartes communes retournées simultanément.', example: 'Préflop terminé → le dealer retourne le flop.' },
  { term: 'Turn', category: 'Fondamentaux', level: 'debutant', definition: 'La 4e carte commune, retournée après le flop.', example: 'Flop A-K-7, tour de mise, puis le turn (4e carte).' },
  { term: 'River', category: 'Fondamentaux', level: 'debutant', definition: 'La 5e et dernière carte commune. Dernière chance de mise avant le showdown.', example: 'Board final A-K-7-2-J après la river.' },
  { term: 'Showdown', category: 'Fondamentaux', level: 'debutant', definition: 'Révélation des cartes en fin de main pour déterminer le gagnant.', example: 'Après la river bet/call, les joueurs retournent leurs cartes au showdown.' },
  { term: 'Pot odds', category: 'Fondamentaux', level: 'debutant', definition: 'Rapport entre la mise à payer et le pot total. Permet de calculer si un call est rentable.', example: 'Pot 20BB, adversaire bet 10BB : pot odds = 10/40 = 25% d\'equity minimum requis.' },
  { term: 'Outs', category: 'Fondamentaux', level: 'debutant', definition: 'Cartes restantes dans le deck qui améliorent votre main.', example: 'Flush draw = 9 outs. Règle du 4-2 : 9×4=36% sur 2 cartes, 9×2=18% sur 1 carte.' },
  { term: 'Nuts', category: 'Fondamentaux', level: 'debutant', definition: 'La meilleure main possible sur un board donné. Impossible d\'être battu.', example: 'Board A♥K♦Q♣J♠T♥ : JT en main = quinte Broadway = les nuts.' },
  { term: 'Stack', category: 'Fondamentaux', level: 'debutant', definition: 'Quantité totale de jetons qu\'un joueur possède à la table.', example: '100BB de stack = 100 fois la big blind.' },
  { term: 'Effective stack', category: 'Fondamentaux', level: 'debutant', definition: 'Le plus petit stack entre deux joueurs, le montant réellement en jeu entre eux.', example: 'Tu as 100BB, adversaire a 60BB : effective stack = 60BB.' },

  // ── Positions
  { term: 'BTN (Button)', category: 'Positions', level: 'debutant', definition: 'La meilleure position au poker. Le joueur au bouton agit en dernier postflop sur toutes les streets.', example: 'BTN peut ouvrir ~40% des mains en 6-max.' },
  { term: 'SB (Small Blind)', category: 'Positions', level: 'debutant', definition: 'Agit en premier postflop sur toutes les streets. Position la plus difficile.', example: 'SB doit jouer OOP contre tous les joueurs actifs postflop.' },
  { term: 'BB (Big Blind)', category: 'Positions', level: 'debutant', definition: 'Dernier à parler préflop, premier à parler postflop (après SB). A déjà investi 1BB donc défend large.', example: 'BB doit défendre ~45% de sa range face à un open BTN.' },
  { term: 'UTG (Under the Gun)', category: 'Positions', level: 'debutant', definition: 'Premier joueur à parler préflop. Position la plus défavorable, 5 joueurs actifs derrière.', example: 'UTG ouvre seulement ~14% des mains en 6-max.' },
  { term: 'CO (Cutoff)', category: 'Positions', level: 'intermediaire', definition: 'Position juste avant le bouton. Très avantageuse, seulement BTN et les blinds derrière.', example: 'CO peut ouvrir ~26% des mains.' },
  { term: 'HJ (Hijack)', category: 'Positions', level: 'intermediaire', definition: 'Deux positions avant le bouton. Range d\'ouverture ~18%.', example: 'HJ ouvre plus large que UTG, moins que CO.' },
  { term: 'IP (In Position)', category: 'Positions', level: 'debutant', definition: 'Agir après son adversaire lors de chaque street. Avantage informationnel majeur.', example: 'BTN est IP contre SB et BB.' },
  { term: 'OOP (Out Of Position)', category: 'Positions', level: 'debutant', definition: 'Agir avant son adversaire. Désavantage car on agit sans information sur sa décision.', example: 'BB est OOP contre tous les joueurs postflop.' },

  // ── Stats & HUD
  { term: 'VPIP', category: 'Stats & HUD', level: 'intermediaire', definition: 'Voluntarily Put money In Pot. % des mains où un joueur investit volontairement de l\'argent préflop (call ou raise). Mesure la looseness.', example: 'VPIP 25% = solide. VPIP 50%+ = fish. VPIP 12% = nit.' },
  { term: 'PFR', category: 'Stats & HUD', level: 'intermediaire', definition: 'Pre-Flop Raise. % des mains où un joueur raise préflop. Mesure l\'agressivité préflop.', example: 'PFR = VPIP idéalement. Un écart VPIP-PFR élevé = beaucoup de limp/call (passif).' },
  { term: 'AF (Aggression Factor)', category: 'Stats & HUD', level: 'avance', definition: 'Facteur d\'agressivité postflop : (bet + raise) / call. Plus il est élevé, plus le joueur est agressif.', example: 'AF 3+ = très agressif. AF 1 = équilibré. AF < 1 = passif.' },
  { term: 'Fold to C-bet', category: 'Stats & HUD', level: 'intermediaire', definition: '% du temps qu\'un joueur fold face à un continuation bet. > 60% = peut être floaté/bluffé.', example: 'Fold to C-bet 70% : betez toujours contre ce joueur sur le flop.' },
  { term: '3-bet %', category: 'Stats & HUD', level: 'intermediaire', definition: 'Fréquence à laquelle un joueur re-raise préflop. Normal : 5-9%. > 12% = 3-bet light.', example: '3-bet 3% = très tight (que les mains premium). 3-bet 12% = range large.' },
  { term: 'WSD (Went to Showdown)', category: 'Stats & HUD', level: 'avance', definition: '% des mains allant jusqu\'au showdown. Élevé = calling station. Bas = fold souvent.', example: 'WSD 30%+ = paye trop. WSD 20%- = trop tight en river.' },
  { term: 'W$WSF (Won $ When Saw Flop)', category: 'Stats & HUD', level: 'avance', definition: '% des mains gagnées quand le joueur a vu le flop. > 50% = bon taux postflop.', example: 'W$WSF 55% = joueur difficile à exploiter postflop.' },
  { term: 'bb/100', category: 'Stats & HUD', level: 'intermediaire', definition: 'Winrate exprimé en big blinds gagnées par 100 mains. Mesure standard de la rentabilité.', example: '5 bb/100 = excellent. 0-2 bb/100 = breakeven. Négatif = perdant.' },

  // ── Stratégie de base
  { term: 'C-bet (Continuation Bet)', category: 'Stratégie', level: 'debutant', definition: 'Miser sur le flop après avoir été le dernier raiser préflop, qu\'on ait touché le board ou non.', example: 'Tu raise préflop avec AK, flop vient 7-3-2. Tu c-bet 50% pot pour représenter AX.' },
  { term: 'Value bet', category: 'Stratégie', level: 'debutant', definition: 'Miser avec une main forte pour obtenir des calls de mains moins fortes.', example: 'Tu as AA sur un flop A-7-2, tu value-bet pour extraire des mains comme K7, A9.' },
  { term: 'Bluff', category: 'Stratégie', level: 'debutant', definition: 'Miser ou raiser avec une main faible pour faire folder l\'adversaire.', example: 'Tu n\'as rien sur le river, mais tu bet 80% pot pour représenter une main forte.' },
  { term: 'Semi-bluff', category: 'Stratégie', level: 'intermediaire', definition: 'Bluffer avec une main qui a des outs pour s\'améliorer. Double valeur : fold equity + equity de tirage.', example: 'Bet avec un flush draw, si l\'adversaire fold, tu gagnes. Sinon tu as 36% d\'amélioration.' },
  { term: 'Slow play', category: 'Stratégie', level: 'intermediaire', definition: 'Jouer passivement avec une main très forte pour piéger l\'adversaire.', example: 'Tu as un set et tu check pour induire un bluff de l\'adversaire.' },
  { term: 'Check-raise', category: 'Stratégie', level: 'intermediaire', definition: 'Checker en premier puis raiser quand l\'adversaire bet. Arme offensive ou défensive.', example: 'Tu checks avec un set, l\'adversaire c-bet, tu check-raise 3x pour charger le pot.' },
  { term: 'Donk bet', category: 'Stratégie', level: 'avance', definition: 'Miser en étant OOP avant que l\'adversaire (le raiser préflop) puisse c-bet.', example: 'Tu es BB, l\'adversaire a ouvert CO. Flop vient. Tu bet avant qu\'il ne c-bet = donk bet.' },
  { term: 'Float', category: 'Stratégie', level: 'avance', definition: 'Caller un c-bet avec l\'intention de voler le pot sur le turn si l\'adversaire abandonne.', example: 'Tu calls le c-bet avec rien, l\'adversaire check le turn, tu bet et prends le pot.' },
  { term: 'Barrel', category: 'Stratégie', level: 'intermediaire', definition: 'Miser plusieurs streets consécutives. Double barrel = bet flop + turn. Triple barrel = toutes les streets.', example: 'C-bet flop, bet turn, bet river = triple barrel bluff.' },
  { term: 'Squeeze', category: 'Stratégie', level: 'avance', definition: '3-bet quand il y a eu un open + un ou plusieurs callers. Les callers sont "pris en sandwich".', example: 'BTN open, CO call, tu squeeze depuis BB, les callers sont dans une position inconfortable.' },
  { term: 'Isolate', category: 'Stratégie', level: 'intermediaire', definition: 'Raiser pour jouer en tête à tête (HU) contre un adversaire spécifique, souvent un fish.', example: 'Fish limp, tu iso-raise pour jouer HU contre lui et exploiter ses erreurs.' },
  { term: 'Overbet', category: 'Stratégie', level: 'avance', definition: 'Miser plus que la taille du pot. Stratégie polarisée : soit les nuts, soit un bluff pur.', example: 'Pot 30BB, tu bet 45BB (150%) = surbet polarisé.' },
  { term: 'Thin value', category: 'Stratégie', level: 'avance', definition: 'Value-bet sur la river avec une main marginale qui bat seulement une partie de la range de call adverse.', example: 'Paire de 9 sur un board K-9-5-2-J : bet thin si l\'adversaire call beaucoup.' },

  // ── Concepts avancés
  { term: 'EV (Expected Value)', category: 'Concepts avancés', level: 'intermediaire', definition: 'Valeur espérée d\'une action, en moyenne sur le long terme. L\'objectif est de maximiser l\'EV.', example: 'Push avec 60% d\'equity pour 100BB = EV = +20BB en moyenne.' },
  { term: 'Equity', category: 'Concepts avancés', level: 'intermediaire', definition: '% de chances qu\'a votre main de gagner à l\'abattage, en prenant en compte toutes les cartes possibles.', example: 'AA vs KK préflop = 82% equity pour AA.' },
  { term: 'Range', category: 'Concepts avancés', level: 'intermediaire', definition: 'L\'ensemble des mains possibles qu\'un joueur peut avoir dans une situation donnée.', example: 'Range UTG = {AA-TT, AKs, AQs, AKo}, mains premium seulement.' },
  { term: 'GTO (Game Theory Optimal)', category: 'Concepts avancés', level: 'avance', definition: 'Stratégie d\'équilibre théorique qui ne peut pas être exploitée. Rend l\'adversaire indifférent entre ses options.', example: 'Une stratégie GTO bluff à la fréquence exacte pour que l\'adversaire ne gagne rien à call ou fold.' },
  { term: 'ICM (Independent Chip Model)', category: 'Concepts avancés', level: 'avance', definition: 'Modèle calculant la valeur monétaire réelle des jetons en tournoi. 1 jeton gagné vaut moins que 1 jeton perdu.', example: 'Avec 3 joueurs et 1er=60%, 2e=30%, 3e=10% : push/fold optimal change vs cash game.' },
  { term: 'Implied odds', category: 'Concepts avancés', level: 'intermediaire', definition: 'Gains futurs potentiels si votre tirage se complète. Justifient de payer avec des pot odds défavorables.', example: 'Les pot odds ne sont pas là pour call le tirage, mais si l\'adversaire a un gros stack et paiera river, les implied odds le justifient.' },
  { term: 'Fold equity', category: 'Concepts avancés', level: 'intermediaire', definition: 'L\'avantage gagné quand l\'adversaire fold face à votre bet/raise. Composante essentielle des bluffs.', example: 'Semi-bluff avec 30% d\'equity + 50% fold equity = très rentable.' },
  { term: 'SPR (Stack to Pot Ratio)', category: 'Concepts avancés', level: 'avance', definition: 'Rapport stack effectif / taille du pot au flop. Détermine les stratégies postflop optimales.', example: 'SPR 4 = pot de 25BB, stack de 100BB. SPR bas = committé avec overpair. SPR élevé = jeu plus spéculatif.' },
  { term: 'Polarisé', category: 'Concepts avancés', level: 'avance', definition: 'Range composée uniquement de mains très fortes ET de bluffs purs. Pas de mains moyennes.', example: 'River bet polarisé : soit les nuts, soit un bluff, pas de mains de call.' },
  { term: 'Merged', category: 'Concepts avancés', level: 'avance', definition: 'Range composée de mains de valeur de toutes les forces, sans bluffs purs. Misée pour extraire de valeur.', example: 'C-bet merged sur flop favorable : bet avec toutes tes mains qui ont de l\'equity.' },
  { term: 'Blockers', category: 'Concepts avancés', level: 'avance', definition: 'Cartes dans votre main qui réduisent le nombre de combinaisons fortes dans la range adverse.', example: 'Avoir A♠ bloque AA (3 combos au lieu de 6) et les flush draws à pique dans la range adverse.' },
  { term: 'Combo', category: 'Concepts avancés', level: 'intermediaire', definition: 'Combinaison spécifique d\'une main. AA = 6 combos. AKs = 4 combos. AKo = 12 combos.', example: 'Une paire pocket = C(4,2) = 6 combos. AK suited = 4 combos (une par couleur).' },
  { term: 'Runout', category: 'Concepts avancés', level: 'intermediaire', definition: 'Les cartes qui viennent sur le turn et la river. "Favorable runout" = cartes qui aident ta main.', example: 'Tu as flush draw, le runout est 7♣-2♦ = cartes blanches, ton tirage n\'est pas arrivé.' },
  { term: 'Backdoor', category: 'Concepts avancés', level: 'intermediaire', definition: 'Tirage qui nécessite à la fois le turn ET la river pour se compléter. Vaut environ 2-4 outs.', example: 'Backdoor flush draw : tu n\'as qu\'une carte de couleur au flop, tu as besoin de 2 cartes consecutives.' },

  // ── Mains & Draws
  { term: 'Pocket pair', category: 'Mains & Draws', level: 'debutant', definition: 'Deux cartes de même rang dans la main (les cartes privées).', example: '7♠7♦ en main = pocket sevens.' },
  { term: 'Set', category: 'Mains & Draws', level: 'debutant', definition: 'Brelan fait avec une pocket pair et une carte du board. Main très puissante.', example: 'Tu as 7♠7♦, board vient 7♣K♠2♥ = set de 7.' },
  { term: 'Trips', category: 'Mains & Draws', level: 'debutant', definition: 'Brelan fait avec une carte en main et une paire sur le board. Moins bien caché qu\'un set.', example: 'Board K♣K♦7♠, tu as K♥J♣ = trips de Rois.' },
  { term: 'Overpair', category: 'Mains & Draws', level: 'debutant', definition: 'Une paire en main dont la valeur dépasse toutes les cartes du board.', example: 'Tu as QQ, board vient J-8-3 = overpair.' },
  { term: 'TPTK', category: 'Mains & Draws', level: 'debutant', definition: 'Top Pair Top Kicker. Paire avec la carte la plus haute du board ET le meilleur kicker possible.', example: 'Tu as AK, board K♠7♦2♣ = TPTK (paire de Rois avec As kicker).' },
  { term: 'Flush draw', category: 'Mains & Draws', level: 'debutant', definition: 'Avoir 4 cartes de la même couleur, nécessite 1 carte pour compléter la couleur. 9 outs.', example: 'A♥J♥ sur board K♥7♥2♣ = flush draw à cœur.' },
  { term: 'OESD (Open-Ended Straight Draw)', category: 'Mains & Draws', level: 'debutant', definition: 'Tirage de suite ouvert des deux côtés. 8 outs.', example: '9-8-7-6 : un 5 ou un T complète la suite = 8 outs.' },
  { term: 'Gutshot', category: 'Mains & Draws', level: 'debutant', definition: 'Tirage de suite à trou intérieur. Seulement 4 outs, plus rare à compléter.', example: '9-8-6-5 : seul un 7 complète la suite = 4 outs.' },
  { term: 'Nut flush draw', category: 'Mains & Draws', level: 'intermediaire', definition: 'Tirage de couleur avec l\'As de la même couleur. Si complété, la couleur est forcément la plus haute.', example: 'A♠J♦ sur board K♠7♠2♥ = nut flush draw à pique.' },
  { term: 'Combo draw', category: 'Mains & Draws', level: 'intermediaire', definition: 'Main qui combine plusieurs tirages simultanément. 12-15 outs, souvent favorite face à une paire.', example: 'T♠9♠ sur J♠8♣2♠ = flush draw (9 outs) + OESD (8 outs) - redondances = ~15 outs.' },
  { term: 'Broadways', category: 'Mains & Draws', level: 'debutant', definition: 'Cartes T, J, Q, K, A, les plus hautes. Les mains broadway sont des combinaisons de ces cartes.', example: 'KQ, AJ, QJs, KTs = mains broadway.' },
  { term: 'Suited connectors', category: 'Mains & Draws', level: 'debutant', definition: 'Deux cartes consécutives de même couleur. Potentiel de suite ET de couleur.', example: '9♥8♥, T♣9♣, J♦T♦ = suited connectors.' },

  // ── Types de joueurs
  { term: 'Fish', category: 'Types de joueurs', level: 'debutant', definition: 'Joueur débutant ou récréatif qui fait beaucoup d\'erreurs. VPIP très élevé, ne fold pas assez.', example: 'Fish : VPIP 55%, PFR 8%, fold to c-bet 25%.' },
  { term: 'Nit', category: 'Types de joueurs', level: 'intermediaire', definition: 'Joueur ultra-tight qui ne joue que des mains premium. Facile à bluffer car il fold tout.', example: 'Nit : VPIP 12%, PFR 10%, ouvre seulement AA-JJ et AKs.' },
  { term: 'TAG (Tight-Aggressive)', category: 'Types de joueurs', level: 'intermediaire', definition: 'Style solide et gagnant : sélectif dans les mains jouées, agressif quand il entre.', example: 'TAG : VPIP 22-26%, PFR 18-22%. Le profil de référence.' },
  { term: 'LAG (Loose-Aggressive)', category: 'Types de joueurs', level: 'avance', definition: 'Joue large et de façon très agressive. Difficile à lire, peut être très profitable ou très perdant.', example: 'LAG : VPIP 30-40%, PFR 25-35%. Exploite les faiblesses des ranges adverses.' },
  { term: 'Calling station', category: 'Types de joueurs', level: 'intermediaire', definition: 'Joueur passif qui appelle tout mais ne raise jamais. Ne bluffez jamais contre lui, value-bettez large.', example: 'Calling station : VPIP 50%, PFR 5%, fold to c-bet 20%.' },
  { term: 'Reg (Régulier)', category: 'Types de joueurs', level: 'intermediaire', definition: 'Joueur régulier qui joue souvent et de façon correcte. Se distingue des récréatifs.', example: 'Reg : VPIP 22-28%, PFR 18-24%, stats équilibrées.' },
  { term: 'Whale', category: 'Types de joueurs', level: 'intermediaire', definition: 'Gros fish avec un bankroll important, joue gros et fait d\'énormes erreurs. Très lucratif.', example: 'Whale en NL2000 avec les habitudes d\'un joueur NL50.' },

  // ── Tournois
  { term: 'Bubble', category: 'Tournois', level: 'intermediaire', definition: 'Moment juste avant que les joueurs restants atteignent les places payées.', example: '100 joueurs payés, 101 restants = on est à la bubble.' },
  { term: 'Push/fold', category: 'Tournois', level: 'intermediaire', definition: 'Stratégie en court stack (<15BB) : soit all-in, soit fold. Plus de place pour le jeu en post-flop.', example: 'Avec 12BB, AJ BTN = push all-in (pas de raise standard).' },
  { term: 'Rebuy', category: 'Tournois', level: 'debutant', definition: 'Possibilité de racheter des jetons dans certains tournois, en cas d\'élimination ou stack bas.', example: 'Tournoi rebuy pendant 1h : tu peux recharger si tu perds tous tes jetons.' },
  { term: 'MTT', category: 'Tournois', level: 'debutant', definition: 'Multi-Table Tournament. Grand tournoi avec de nombreuses tables, structure de blindes croissante.', example: 'WSOP Main Event = MTT avec 10 000+ participants.' },
  { term: 'SNG (Sit & Go)', category: 'Tournois', level: 'debutant', definition: 'Tournoi qui commence dès que la table est pleine (généralement 6 ou 9 joueurs). Très populaire pour pratiquer l\'ICM.', example: 'SNG 9-max : dernier inscrit démarre le tournoi.' },
  { term: 'Ante', category: 'Tournois', level: 'debutant', definition: 'Mise obligatoire payée par tous les joueurs à chaque main (en plus des blinds). Accélère l\'action.', example: 'Big Blind Ante : seul le BB paye l\'ante = plus fluide.' },
];

const CATEGORIES = ['Tous', 'Fondamentaux', 'Positions', 'Stats & HUD', 'Stratégie', 'Concepts avancés', 'Mains & Draws', 'Types de joueurs', 'Tournois'];
const LEVEL_LABELS: Record<Level, string> = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };
const LEVEL_COLORS: Record<Level, string> = { debutant: '#22c55e', intermediaire: '#3b82f6', avance: '#a855f7' };

// ─── Component ────────────────────────────────────────────────────────────────

export default function GlossairePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return TERMS.filter(t => {
      const matchCat = activeCategory === 'Tous' || t.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
      return matchCat && matchSearch;
    }).sort((a, b) => a.term.localeCompare(b.term, 'fr'));
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <main className="max-w-4xl mx-auto px-4 pt-28 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Référence</span>
            <span className="text-xs text-gray-500">{TERMS.length} termes</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Glossaire Poker
          </h1>
          <p className="text-gray-400">Tous les termes du poker expliqués clairement, du débutant au pro.</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher un terme... (ex: GTO, equity, c-bet)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeCategory === cat ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${activeCategory === cat ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: activeCategory === cat ? '#34d399' : '#6b7280',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-gray-600 text-xs mb-4">
          {filtered.length} terme{filtered.length > 1 ? 's' : ''}{search ? ` pour "${search}"` : ''}
        </p>

        {/* Terms list */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => {
              const isOpen = expanded === t.term;
              return (
                <motion.div
                  key={t.term}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${isOpen ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}` }}
                >
                  <button
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 transition-colors"
                    style={{ background: isOpen ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)' }}
                    onClick={() => setExpanded(isOpen ? null : t.term)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-bold text-white text-sm shrink-0">{t.term}</span>
                      <span className="text-gray-600 text-xs hidden sm:block truncate">{t.definition.slice(0, 60)}…</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: LEVEL_COLORS[t.level] + '15', color: LEVEL_COLORS[t.level], border: `1px solid ${LEVEL_COLORS[t.level]}30` }}
                      >
                        {LEVEL_LABELS[t.level]}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-500 text-xs"
                      >
                        ▼
                      </motion.span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-1 space-y-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <p className="text-gray-300 text-sm leading-relaxed">{t.definition}</p>
                          {t.example && (
                            <div className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                              <span className="text-emerald-500 text-xs font-semibold">Exemple : </span>
                              <span className="text-gray-400 text-xs">{t.example}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 text-xs">{t.category}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-2">Aucun terme trouvé</p>
              <p className="text-gray-600 text-sm">Essayez un autre mot-clé ou une autre catégorie.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
