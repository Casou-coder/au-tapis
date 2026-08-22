'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useLocale } from 'next-intl';

// ─── Data ─────────────────────────────────────────────────────────────────────

type Level = 'debutant' | 'intermediaire' | 'avance';

interface Term {
  term: string;
  category: string;
  level: Level;
  definition: string;
  definitionEn: string;
  example?: string;
  exampleEn?: string;
}

const TERMS: Term[] = [
  // ── Fondamentaux / Fundamentals
  { term: 'All-in', category: 'Fondamentaux', level: 'debutant',
    definition: 'Miser la totalité de ses jetons restants en une seule mise.',
    definitionEn: 'Betting all of your remaining chips in a single bet.',
    example: 'Tu as 50BB, tu push all-in préflop avec AA.',
    exampleEn: 'You have 50BB, you push all-in preflop with AA.' },
  { term: 'Blind', category: 'Fondamentaux', level: 'debutant',
    definition: 'Mise obligatoire placée avant la distribution des cartes. La Small Blind (SB) est la moitié de la Big Blind (BB).',
    definitionEn: 'A forced bet placed before cards are dealt. The Small Blind (SB) is half of the Big Blind (BB).',
    example: 'Aux blinds 1€/2€ : SB = 1€, BB = 2€.',
    exampleEn: 'At blinds €1/€2: SB = €1, BB = €2.' },
  { term: 'Buy-in', category: 'Fondamentaux', level: 'debutant',
    definition: 'Montant de jetons avec lequel on entre à une table. En cash game, généralement 100 big blinds.',
    definitionEn: 'The amount of chips you buy in for at a table. In cash game, typically 100 big blinds.',
    example: 'Table NL100 (blinds 0.50€/1€) : buy-in standard = 100€.',
    exampleEn: 'NL100 table (blinds €0.50/€1): standard buy-in = €100.' },
  { term: 'Check', category: 'Fondamentaux', level: 'debutant',
    definition: 'Passer son action sans miser, uniquement possible si personne n\'a misé avant vous.',
    definitionEn: 'Passing your action without betting, only possible if no one has bet before you.',
    example: 'Tu es BB, personne ne raise préflop, tu peux check.',
    exampleEn: 'You are BB, nobody raised preflop, you can check.' },
  { term: 'Fold', category: 'Fondamentaux', level: 'debutant',
    definition: 'Se coucher, abandonner sa main et les mises déjà placées dans le pot.',
    definitionEn: 'To muck your hand and forfeit any bets already placed in the pot.',
    example: 'Face à un gros raise avec 72o, tu fold.',
    exampleEn: 'Facing a big raise with 72o, you fold.' },
  { term: 'Call', category: 'Fondamentaux', level: 'debutant',
    definition: 'Suivre la mise d\'un adversaire en payant le même montant.',
    definitionEn: 'Matching an opponent\'s bet by paying the same amount.',
    example: 'Adversaire mise 10BB, tu call 10BB.',
    exampleEn: 'Opponent bets 10BB, you call 10BB.' },
  { term: 'Raise', category: 'Fondamentaux', level: 'debutant',
    definition: 'Augmenter la mise courante. Le sizing standard est 2.5x à 3x le montant précédent.',
    definitionEn: 'Increasing the current bet. Standard sizing is 2.5x to 3x the previous amount.',
    example: 'Adversaire open 3BB, tu raise à 9BB (3-bet).',
    exampleEn: 'Opponent opens 3BB, you raise to 9BB (3-bet).' },
  { term: 'Pot', category: 'Fondamentaux', level: 'debutant',
    definition: 'Total des mises accumulées sur la table lors d\'une main.',
    definitionEn: 'The total of all bets accumulated on the table during a hand.',
    example: 'Après les blinds et un raise à 3BB : pot = 4.5BB.',
    exampleEn: 'After blinds and a raise to 3BB: pot = 4.5BB.' },
  { term: 'Board', category: 'Fondamentaux', level: 'debutant',
    definition: 'Les cartes communes au centre de la table, partagées par tous les joueurs.',
    definitionEn: 'The community cards in the center of the table, shared by all players.',
    example: 'Flop A♥K♦7♣ = les 3 premières cartes du board.',
    exampleEn: 'Flop A♥K♦7♣ = the first 3 cards of the board.' },
  { term: 'Flop', category: 'Fondamentaux', level: 'debutant',
    definition: 'Les 3 premières cartes communes retournées simultanément.',
    definitionEn: 'The first 3 community cards turned face up simultaneously.',
    example: 'Préflop terminé → le dealer retourne le flop.',
    exampleEn: 'Preflop action done → dealer reveals the flop.' },
  { term: 'Turn', category: 'Fondamentaux', level: 'debutant',
    definition: 'La 4e carte commune, retournée après le flop.',
    definitionEn: 'The 4th community card, revealed after the flop.',
    example: 'Flop A-K-7, tour de mise, puis le turn (4e carte).',
    exampleEn: 'Flop A-K-7, betting round, then the turn (4th card).' },
  { term: 'River', category: 'Fondamentaux', level: 'debutant',
    definition: 'La 5e et dernière carte commune. Dernière chance de mise avant le showdown.',
    definitionEn: 'The 5th and final community card. Last chance to bet before the showdown.',
    example: 'Board final A-K-7-2-J après la river.',
    exampleEn: 'Final board A-K-7-2-J after the river.' },
  { term: 'Showdown', category: 'Fondamentaux', level: 'debutant',
    definition: 'Révélation des cartes en fin de main pour déterminer le gagnant.',
    definitionEn: 'Revealing cards at the end of a hand to determine the winner.',
    example: 'Après la river bet/call, les joueurs retournent leurs cartes au showdown.',
    exampleEn: 'After the river bet/call, players reveal their cards at showdown.' },
  { term: 'Pot odds', category: 'Fondamentaux', level: 'debutant',
    definition: 'Rapport entre la mise à payer et le pot total. Permet de calculer si un call est rentable.',
    definitionEn: 'The ratio between the bet you must call and the total pot. Used to determine if a call is profitable.',
    example: 'Pot 20BB, adversaire bet 10BB : pot odds = 10/40 = 25% d\'equity minimum requis.',
    exampleEn: 'Pot 20BB, opponent bets 10BB: pot odds = 10/40 = 25% minimum equity required.' },
  { term: 'Outs', category: 'Fondamentaux', level: 'debutant',
    definition: 'Cartes restantes dans le deck qui améliorent votre main.',
    definitionEn: 'Cards remaining in the deck that improve your hand.',
    example: 'Flush draw = 9 outs. Règle du 4-2 : 9×4=36% sur 2 cartes, 9×2=18% sur 1 carte.',
    exampleEn: 'Flush draw = 9 outs. Rule of 4-2: 9×4=36% with 2 cards to come, 9×2=18% with 1.' },
  { term: 'Nuts', category: 'Fondamentaux', level: 'debutant',
    definition: 'La meilleure main possible sur un board donné. Impossible d\'être battu.',
    definitionEn: 'The best possible hand on a given board. Impossible to be beaten.',
    example: 'Board A♥K♦Q♣J♠T♥ : JT en main = quinte Broadway = les nuts.',
    exampleEn: 'Board A♥K♦Q♣J♠T♥: JT in hand = Broadway straight = the nuts.' },
  { term: 'Stack', category: 'Fondamentaux', level: 'debutant',
    definition: 'Quantité totale de jetons qu\'un joueur possède à la table.',
    definitionEn: 'The total amount of chips a player has at the table.',
    example: '100BB de stack = 100 fois la big blind.',
    exampleEn: '100BB stack = 100 times the big blind.' },
  { term: 'Effective stack', category: 'Fondamentaux', level: 'debutant',
    definition: 'Le plus petit stack entre deux joueurs, le montant réellement en jeu entre eux.',
    definitionEn: 'The smaller stack between two players — the amount actually at stake between them.',
    example: 'Tu as 100BB, adversaire a 60BB : effective stack = 60BB.',
    exampleEn: 'You have 100BB, opponent has 60BB: effective stack = 60BB.' },

  // ── Positions
  { term: 'BTN (Button)', category: 'Positions', level: 'debutant',
    definition: 'La meilleure position au poker. Le joueur au bouton agit en dernier postflop sur toutes les streets.',
    definitionEn: 'The best position in poker. The button player acts last postflop on every street.',
    example: 'BTN peut ouvrir ~40% des mains en 6-max.',
    exampleEn: 'BTN can open ~40% of hands in 6-max.' },
  { term: 'SB (Small Blind)', category: 'Positions', level: 'debutant',
    definition: 'Agit en premier postflop sur toutes les streets. Position la plus difficile.',
    definitionEn: 'Acts first postflop on every street. The most difficult position.',
    example: 'SB doit jouer OOP contre tous les joueurs actifs postflop.',
    exampleEn: 'SB must play OOP against all active players postflop.' },
  { term: 'BB (Big Blind)', category: 'Positions', level: 'debutant',
    definition: 'Dernier à parler préflop, premier à parler postflop (après SB). A déjà investi 1BB donc défend large.',
    definitionEn: 'Last to speak preflop, first postflop (after SB). Already invested 1BB so defends wide.',
    example: 'BB doit défendre ~45% de sa range face à un open BTN.',
    exampleEn: 'BB must defend ~45% of their range vs a BTN open.' },
  { term: 'UTG (Under the Gun)', category: 'Positions', level: 'debutant',
    definition: 'Premier joueur à parler préflop. Position la plus défavorable, 5 joueurs actifs derrière.',
    definitionEn: 'First player to act preflop. Most unfavorable position with 5 active players behind.',
    example: 'UTG ouvre seulement ~14% des mains en 6-max.',
    exampleEn: 'UTG opens only ~14% of hands in 6-max.' },
  { term: 'CO (Cutoff)', category: 'Positions', level: 'intermediaire',
    definition: 'Position juste avant le bouton. Très avantageuse, seulement BTN et les blinds derrière.',
    definitionEn: 'Position just before the button. Very advantageous with only BTN and blinds behind.',
    example: 'CO peut ouvrir ~26% des mains.',
    exampleEn: 'CO can open ~26% of hands.' },
  { term: 'HJ (Hijack)', category: 'Positions', level: 'intermediaire',
    definition: 'Deux positions avant le bouton. Range d\'ouverture ~18%.',
    definitionEn: 'Two positions before the button. Opening range ~18%.',
    example: 'HJ ouvre plus large que UTG, moins que CO.',
    exampleEn: 'HJ opens wider than UTG, tighter than CO.' },
  { term: 'IP (In Position)', category: 'Positions', level: 'debutant',
    definition: 'Agir après son adversaire lors de chaque street. Avantage informationnel majeur.',
    definitionEn: 'Acting after your opponent on every street. Major informational advantage.',
    example: 'BTN est IP contre SB et BB.',
    exampleEn: 'BTN is IP against SB and BB.' },
  { term: 'OOP (Out Of Position)', category: 'Positions', level: 'debutant',
    definition: 'Agir avant son adversaire. Désavantage car on agit sans information sur sa décision.',
    definitionEn: 'Acting before your opponent. A disadvantage since you act without information about their decision.',
    example: 'BB est OOP contre tous les joueurs postflop.',
    exampleEn: 'BB is OOP against all players postflop.' },

  // ── Stats & HUD
  { term: 'VPIP', category: 'Stats & HUD', level: 'intermediaire',
    definition: 'Voluntarily Put money In Pot. % des mains où un joueur investit volontairement de l\'argent préflop (call ou raise). Mesure la looseness.',
    definitionEn: 'Voluntarily Put money In Pot. % of hands where a player voluntarily invests money preflop (call or raise). Measures looseness.',
    example: 'VPIP 25% = solide. VPIP 50%+ = fish. VPIP 12% = nit.',
    exampleEn: 'VPIP 25% = solid. VPIP 50%+ = fish. VPIP 12% = nit.' },
  { term: 'PFR', category: 'Stats & HUD', level: 'intermediaire',
    definition: 'Pre-Flop Raise. % des mains où un joueur raise préflop. Mesure l\'agressivité préflop.',
    definitionEn: 'Pre-Flop Raise. % of hands where a player raises preflop. Measures preflop aggression.',
    example: 'PFR = VPIP idéalement. Un écart VPIP-PFR élevé = beaucoup de limp/call (passif).',
    exampleEn: 'PFR should ideally equal VPIP. A large VPIP-PFR gap = lots of limp/call (passive).' },
  { term: 'AF (Aggression Factor)', category: 'Stats & HUD', level: 'avance',
    definition: 'Facteur d\'agressivité postflop : (bet + raise) / call. Plus il est élevé, plus le joueur est agressif.',
    definitionEn: 'Postflop aggression factor: (bet + raise) / call. Higher means more aggressive.',
    example: 'AF 3+ = très agressif. AF 1 = équilibré. AF < 1 = passif.',
    exampleEn: 'AF 3+ = very aggressive. AF 1 = balanced. AF < 1 = passive.' },
  { term: 'Fold to C-bet', category: 'Stats & HUD', level: 'intermediaire',
    definition: '% du temps qu\'un joueur fold face à un continuation bet. > 60% = peut être floaté/bluffé.',
    definitionEn: '% of time a player folds to a continuation bet. > 60% = can be floated/bluffed.',
    example: 'Fold to C-bet 70% : betez toujours contre ce joueur sur le flop.',
    exampleEn: 'Fold to C-bet 70%: always bet against this player on the flop.' },
  { term: '3-bet %', category: 'Stats & HUD', level: 'intermediaire',
    definition: 'Fréquence à laquelle un joueur re-raise préflop. Normal : 5-9%. > 12% = 3-bet light.',
    definitionEn: 'How often a player re-raises preflop. Normal: 5-9%. > 12% = light 3-bet.',
    example: '3-bet 3% = très tight (que les mains premium). 3-bet 12% = range large.',
    exampleEn: '3-bet 3% = very tight (only premium hands). 3-bet 12% = wide range.' },
  { term: 'WSD (Went to Showdown)', category: 'Stats & HUD', level: 'avance',
    definition: '% des mains allant jusqu\'au showdown. Élevé = calling station. Bas = fold souvent.',
    definitionEn: '% of hands going to showdown. High = calling station. Low = folds often.',
    example: 'WSD 30%+ = paye trop. WSD 20%- = trop tight en river.',
    exampleEn: 'WSD 30%+ = pays off too much. WSD 20%- = too tight on river.' },
  { term: 'W$WSF (Won $ When Saw Flop)', category: 'Stats & HUD', level: 'avance',
    definition: '% des mains gagnées quand le joueur a vu le flop. > 50% = bon taux postflop.',
    definitionEn: '% of hands won when the player saw the flop. > 50% = good postflop win rate.',
    example: 'W$WSF 55% = joueur difficile à exploiter postflop.',
    exampleEn: 'W$WSF 55% = player difficult to exploit postflop.' },
  { term: 'bb/100', category: 'Stats & HUD', level: 'intermediaire',
    definition: 'Winrate exprimé en big blinds gagnées par 100 mains. Mesure standard de la rentabilité.',
    definitionEn: 'Win rate expressed in big blinds won per 100 hands. Standard profitability measure.',
    example: '5 bb/100 = excellent. 0-2 bb/100 = breakeven. Négatif = perdant.',
    exampleEn: '5 bb/100 = excellent. 0-2 bb/100 = breakeven. Negative = losing.' },

  // ── Stratégie / Strategy
  { term: 'C-bet (Continuation Bet)', category: 'Stratégie', level: 'debutant',
    definition: 'Miser sur le flop après avoir été le dernier raiser préflop, qu\'on ait touché le board ou non.',
    definitionEn: 'Betting the flop after being the last preflop raiser, whether or not you hit the board.',
    example: 'Tu raise préflop avec AK, flop vient 7-3-2. Tu c-bet 50% pot pour représenter AX.',
    exampleEn: 'You raise preflop with AK, flop comes 7-3-2. You c-bet 50% pot to represent AX.' },
  { term: 'Value bet', category: 'Stratégie', level: 'debutant',
    definition: 'Miser avec une main forte pour obtenir des calls de mains moins fortes.',
    definitionEn: 'Betting with a strong hand to get calls from weaker hands.',
    example: 'Tu as AA sur un flop A-7-2, tu value-bet pour extraire des mains comme K7, A9.',
    exampleEn: 'You have AA on a flop A-7-2, you value-bet to extract from hands like K7, A9.' },
  { term: 'Bluff', category: 'Stratégie', level: 'debutant',
    definition: 'Miser ou raiser avec une main faible pour faire folder l\'adversaire.',
    definitionEn: 'Betting or raising with a weak hand to make the opponent fold.',
    example: 'Tu n\'as rien sur le river, mais tu bet 80% pot pour représenter une main forte.',
    exampleEn: 'You have nothing on the river, but you bet 80% pot to represent a strong hand.' },
  { term: 'Semi-bluff', category: 'Stratégie', level: 'intermediaire',
    definition: 'Bluffer avec une main qui a des outs pour s\'améliorer. Double valeur : fold equity + equity de tirage.',
    definitionEn: 'Bluffing with a hand that has outs to improve. Double value: fold equity + drawing equity.',
    example: 'Bet avec un flush draw, si l\'adversaire fold, tu gagnes. Sinon tu as 36% d\'amélioration.',
    exampleEn: 'Bet with a flush draw; if opponent folds you win. Otherwise you have 36% to improve.' },
  { term: 'Slow play', category: 'Stratégie', level: 'intermediaire',
    definition: 'Jouer passivement avec une main très forte pour piéger l\'adversaire.',
    definitionEn: 'Playing passively with a very strong hand to trap the opponent.',
    example: 'Tu as un set et tu check pour induire un bluff de l\'adversaire.',
    exampleEn: 'You have a set and you check to induce a bluff from the opponent.' },
  { term: 'Check-raise', category: 'Stratégie', level: 'intermediaire',
    definition: 'Checker en premier puis raiser quand l\'adversaire bet. Arme offensive ou défensive.',
    definitionEn: 'Checking first then raising when the opponent bets. An offensive or defensive weapon.',
    example: 'Tu checks avec un set, l\'adversaire c-bet, tu check-raise 3x pour charger le pot.',
    exampleEn: 'You check with a set, opponent c-bets, you check-raise 3x to build the pot.' },
  { term: 'Donk bet', category: 'Stratégie', level: 'avance',
    definition: 'Miser en étant OOP avant que l\'adversaire (le raiser préflop) puisse c-bet.',
    definitionEn: 'Betting while OOP before the opponent (preflop raiser) can c-bet.',
    example: 'Tu es BB, l\'adversaire a ouvert CO. Flop vient. Tu bet avant qu\'il ne c-bet = donk bet.',
    exampleEn: 'You are BB, opponent opened CO. Flop comes. You bet before they can c-bet = donk bet.' },
  { term: 'Float', category: 'Stratégie', level: 'avance',
    definition: 'Caller un c-bet avec l\'intention de voler le pot sur le turn si l\'adversaire abandonne.',
    definitionEn: 'Calling a c-bet with the intention of stealing the pot on the turn if the opponent gives up.',
    example: 'Tu calls le c-bet avec rien, l\'adversaire check le turn, tu bet et prends le pot.',
    exampleEn: 'You call the c-bet with nothing, opponent checks the turn, you bet and take the pot.' },
  { term: 'Barrel', category: 'Stratégie', level: 'intermediaire',
    definition: 'Miser plusieurs streets consécutives. Double barrel = bet flop + turn. Triple barrel = toutes les streets.',
    definitionEn: 'Betting multiple consecutive streets. Double barrel = bet flop + turn. Triple barrel = all streets.',
    example: 'C-bet flop, bet turn, bet river = triple barrel bluff.',
    exampleEn: 'C-bet flop, bet turn, bet river = triple barrel bluff.' },
  { term: 'Squeeze', category: 'Stratégie', level: 'avance',
    definition: '3-bet quand il y a eu un open + un ou plusieurs callers. Les callers sont "pris en sandwich".',
    definitionEn: '3-bet when there has been an open + one or more callers. Callers are "squeezed".',
    example: 'BTN open, CO call, tu squeeze depuis BB, les callers sont dans une position inconfortable.',
    exampleEn: 'BTN opens, CO calls, you squeeze from BB — callers are in an uncomfortable spot.' },
  { term: 'Isolate', category: 'Stratégie', level: 'intermediaire',
    definition: 'Raiser pour jouer en tête à tête (HU) contre un adversaire spécifique, souvent un fish.',
    definitionEn: 'Raising to play heads-up (HU) against a specific opponent, often a fish.',
    example: 'Fish limp, tu iso-raise pour jouer HU contre lui et exploiter ses erreurs.',
    exampleEn: 'Fish limps, you iso-raise to play HU against them and exploit their mistakes.' },
  { term: 'Overbet', category: 'Stratégie', level: 'avance',
    definition: 'Miser plus que la taille du pot. Stratégie polarisée : soit les nuts, soit un bluff pur.',
    definitionEn: 'Betting more than the pot size. Polarized strategy: either the nuts or a pure bluff.',
    example: 'Pot 30BB, tu bet 45BB (150%) = surbet polarisé.',
    exampleEn: 'Pot 30BB, you bet 45BB (150%) = polarized overbet.' },
  { term: 'Thin value', category: 'Stratégie', level: 'avance',
    definition: 'Value-bet sur la river avec une main marginale qui bat seulement une partie de la range de call adverse.',
    definitionEn: 'Value-betting the river with a marginal hand that only beats part of the opponent\'s calling range.',
    example: 'Paire de 9 sur un board K-9-5-2-J : bet thin si l\'adversaire call beaucoup.',
    exampleEn: 'Pair of 9s on a K-9-5-2-J board: thin value bet if the opponent calls a lot.' },

  // ── Concepts avancés / Advanced concepts
  { term: 'EV (Expected Value)', category: 'Concepts avancés', level: 'intermediaire',
    definition: 'Valeur espérée d\'une action, en moyenne sur le long terme. L\'objectif est de maximiser l\'EV.',
    definitionEn: 'Expected value of an action, on average over the long run. The goal is to maximize EV.',
    example: 'Push avec 60% d\'equity pour 100BB = EV = +20BB en moyenne.',
    exampleEn: 'Push with 60% equity for 100BB = EV = +20BB on average.' },
  { term: 'Equity', category: 'Concepts avancés', level: 'intermediaire',
    definition: '% de chances qu\'a votre main de gagner à l\'abattage, en prenant en compte toutes les cartes possibles.',
    definitionEn: '% chance your hand has of winning at showdown, accounting for all possible cards.',
    example: 'AA vs KK préflop = 82% equity pour AA.',
    exampleEn: 'AA vs KK preflop = 82% equity for AA.' },
  { term: 'Range', category: 'Concepts avancés', level: 'intermediaire',
    definition: 'L\'ensemble des mains possibles qu\'un joueur peut avoir dans une situation donnée.',
    definitionEn: 'The complete set of possible hands a player can have in a given situation.',
    example: 'Range UTG = {AA-TT, AKs, AQs, AKo}, mains premium seulement.',
    exampleEn: 'UTG range = {AA-TT, AKs, AQs, AKo}, premium hands only.' },
  { term: 'GTO (Game Theory Optimal)', category: 'Concepts avancés', level: 'avance',
    definition: 'Stratégie d\'équilibre théorique qui ne peut pas être exploitée. Rend l\'adversaire indifférent entre ses options.',
    definitionEn: 'A theoretically balanced strategy that cannot be exploited. Makes the opponent indifferent between their options.',
    example: 'Une stratégie GTO bluff à la fréquence exacte pour que l\'adversaire ne gagne rien à call ou fold.',
    exampleEn: 'A GTO strategy bluffs at the exact frequency that makes the opponent indifferent to calling or folding.' },
  { term: 'ICM (Independent Chip Model)', category: 'Concepts avancés', level: 'avance',
    definition: 'Modèle calculant la valeur monétaire réelle des jetons en tournoi. 1 jeton gagné vaut moins que 1 jeton perdu.',
    definitionEn: 'Model calculating the real monetary value of chips in tournament play. 1 chip won is worth less than 1 chip lost.',
    example: 'Avec 3 joueurs et 1er=60%, 2e=30%, 3e=10% : push/fold optimal change vs cash game.',
    exampleEn: 'With 3 players and 1st=60%, 2nd=30%, 3rd=10%: optimal push/fold changes vs cash game.' },
  { term: 'Implied odds', category: 'Concepts avancés', level: 'intermediaire',
    definition: 'Gains futurs potentiels si votre tirage se complète. Justifient de payer avec des pot odds défavorables.',
    definitionEn: 'Potential future winnings if your draw completes. Justify calling with unfavorable pot odds.',
    example: 'Les pot odds ne sont pas là pour call le tirage, mais si l\'adversaire a un gros stack et paiera river, les implied odds le justifient.',
    exampleEn: 'Pot odds alone don\'t justify the call, but if the opponent has a big stack and will pay on the river, implied odds justify it.' },
  { term: 'Fold equity', category: 'Concepts avancés', level: 'intermediaire',
    definition: 'L\'avantage gagné quand l\'adversaire fold face à votre bet/raise. Composante essentielle des bluffs.',
    definitionEn: 'The advantage gained when the opponent folds to your bet/raise. An essential component of bluffs.',
    example: 'Semi-bluff avec 30% d\'equity + 50% fold equity = très rentable.',
    exampleEn: 'Semi-bluff with 30% equity + 50% fold equity = very profitable.' },
  { term: 'SPR (Stack to Pot Ratio)', category: 'Concepts avancés', level: 'avance',
    definition: 'Rapport stack effectif / taille du pot au flop. Détermine les stratégies postflop optimales.',
    definitionEn: 'Effective stack / pot size on the flop. Determines optimal postflop strategies.',
    example: 'SPR 4 = pot de 25BB, stack de 100BB. SPR bas = committé avec overpair. SPR élevé = jeu plus spéculatif.',
    exampleEn: 'SPR 4 = 25BB pot, 100BB stack. Low SPR = committed with overpair. High SPR = more speculative play.' },
  { term: 'Polarisé', category: 'Concepts avancés', level: 'avance',
    definition: 'Range composée uniquement de mains très fortes ET de bluffs purs. Pas de mains moyennes.',
    definitionEn: 'Range composed only of very strong hands AND pure bluffs. No medium-strength hands.',
    example: 'River bet polarisé : soit les nuts, soit un bluff, pas de mains de call.',
    exampleEn: 'Polarized river bet: either the nuts or a bluff, no medium hands.' },
  { term: 'Merged', category: 'Concepts avancés', level: 'avance',
    definition: 'Range composée de mains de valeur de toutes les forces, sans bluffs purs. Misée pour extraire de valeur.',
    definitionEn: 'Range composed of value hands of all strengths, without pure bluffs. Bet for value extraction.',
    example: 'C-bet merged sur flop favorable : bet avec toutes tes mains qui ont de l\'equity.',
    exampleEn: 'Merged c-bet on a favorable flop: bet with all hands that have equity.' },
  { term: 'Blockers', category: 'Concepts avancés', level: 'avance',
    definition: 'Cartes dans votre main qui réduisent le nombre de combinaisons fortes dans la range adverse.',
    definitionEn: 'Cards in your hand that reduce the number of strong combinations in your opponent\'s range.',
    example: 'Avoir A♠ bloque AA (3 combos au lieu de 6) et les flush draws à pique dans la range adverse.',
    exampleEn: 'Holding A♠ blocks AA (3 combos instead of 6) and spade flush draws in the opponent\'s range.' },
  { term: 'Combo', category: 'Concepts avancés', level: 'intermediaire',
    definition: 'Combinaison spécifique d\'une main. AA = 6 combos. AKs = 4 combos. AKo = 12 combos.',
    definitionEn: 'A specific combination of a hand. AA = 6 combos. AKs = 4 combos. AKo = 12 combos.',
    example: 'Une paire pocket = C(4,2) = 6 combos. AK suited = 4 combos (une par couleur).',
    exampleEn: 'A pocket pair = C(4,2) = 6 combos. AK suited = 4 combos (one per suit).' },
  { term: 'Runout', category: 'Concepts avancés', level: 'intermediaire',
    definition: 'Les cartes qui viennent sur le turn et la river. "Favorable runout" = cartes qui aident ta main.',
    definitionEn: 'The cards that come on the turn and river. "Favorable runout" = cards that help your hand.',
    example: 'Tu as flush draw, le runout est 7♣-2♦ = cartes blanches, ton tirage n\'est pas arrivé.',
    exampleEn: 'You have a flush draw, the runout is 7♣-2♦ = blank cards, your draw didn\'t come in.' },
  { term: 'Backdoor', category: 'Concepts avancés', level: 'intermediaire',
    definition: 'Tirage qui nécessite à la fois le turn ET la river pour se compléter. Vaut environ 2-4 outs.',
    definitionEn: 'A draw that needs both the turn AND the river to complete. Worth approximately 2-4 outs.',
    example: 'Backdoor flush draw : tu n\'as qu\'une carte de couleur au flop, tu as besoin de 2 cartes consecutives.',
    exampleEn: 'Backdoor flush draw: you only have one suited card on the flop, you need 2 running cards.' },

  // ── Mains & Draws / Hands & Draws
  { term: 'Pocket pair', category: 'Mains & Draws', level: 'debutant',
    definition: 'Deux cartes de même rang dans la main (les cartes privées).',
    definitionEn: 'Two cards of the same rank in hand (hole cards).',
    example: '7♠7♦ en main = pocket sevens.',
    exampleEn: '7♠7♦ in hand = pocket sevens.' },
  { term: 'Set', category: 'Mains & Draws', level: 'debutant',
    definition: 'Brelan fait avec une pocket pair et une carte du board. Main très puissante.',
    definitionEn: 'Three of a kind made with a pocket pair and one board card. Very powerful hand.',
    example: 'Tu as 7♠7♦, board vient 7♣K♠2♥ = set de 7.',
    exampleEn: 'You have 7♠7♦, board comes 7♣K♠2♥ = set of 7s.' },
  { term: 'Trips', category: 'Mains & Draws', level: 'debutant',
    definition: 'Brelan fait avec une carte en main et une paire sur le board. Moins bien caché qu\'un set.',
    definitionEn: 'Three of a kind made with one hole card and a pair on the board. Less disguised than a set.',
    example: 'Board K♣K♦7♠, tu as K♥J♣ = trips de Rois.',
    exampleEn: 'Board K♣K♦7♠, you have K♥J♣ = trip Kings.' },
  { term: 'Overpair', category: 'Mains & Draws', level: 'debutant',
    definition: 'Une paire en main dont la valeur dépasse toutes les cartes du board.',
    definitionEn: 'A pocket pair that ranks higher than all cards on the board.',
    example: 'Tu as QQ, board vient J-8-3 = overpair.',
    exampleEn: 'You have QQ, board comes J-8-3 = overpair.' },
  { term: 'TPTK', category: 'Mains & Draws', level: 'debutant',
    definition: 'Top Pair Top Kicker. Paire avec la carte la plus haute du board ET le meilleur kicker possible.',
    definitionEn: 'Top Pair Top Kicker. Pair with the highest board card AND the best possible kicker.',
    example: 'Tu as AK, board K♠7♦2♣ = TPTK (paire de Rois avec As kicker).',
    exampleEn: 'You have AK, board K♠7♦2♣ = TPTK (pair of Kings with Ace kicker).' },
  { term: 'Flush draw', category: 'Mains & Draws', level: 'debutant',
    definition: 'Avoir 4 cartes de la même couleur, nécessite 1 carte pour compléter la couleur. 9 outs.',
    definitionEn: 'Having 4 cards of the same suit, needing 1 more card to complete the flush. 9 outs.',
    example: 'A♥J♥ sur board K♥7♥2♣ = flush draw à cœur.',
    exampleEn: 'A♥J♥ on board K♥7♥2♣ = heart flush draw.' },
  { term: 'OESD (Open-Ended Straight Draw)', category: 'Mains & Draws', level: 'debutant',
    definition: 'Tirage de suite ouvert des deux côtés. 8 outs.',
    definitionEn: 'A straight draw open on both ends. 8 outs.',
    example: '9-8-7-6 : un 5 ou un T complète la suite = 8 outs.',
    exampleEn: '9-8-7-6: a 5 or T completes the straight = 8 outs.' },
  { term: 'Gutshot', category: 'Mains & Draws', level: 'debutant',
    definition: 'Tirage de suite à trou intérieur. Seulement 4 outs, plus rare à compléter.',
    definitionEn: 'An inside straight draw. Only 4 outs, harder to complete.',
    example: '9-8-6-5 : seul un 7 complète la suite = 4 outs.',
    exampleEn: '9-8-6-5: only a 7 completes the straight = 4 outs.' },
  { term: 'Nut flush draw', category: 'Mains & Draws', level: 'intermediaire',
    definition: 'Tirage de couleur avec l\'As de la même couleur. Si complété, la couleur est forcément la plus haute.',
    definitionEn: 'A flush draw with the Ace of the same suit. If completed, the flush is necessarily the highest.',
    example: 'A♠J♦ sur board K♠7♠2♥ = nut flush draw à pique.',
    exampleEn: 'A♠J♦ on board K♠7♠2♥ = nut spade flush draw.' },
  { term: 'Combo draw', category: 'Mains & Draws', level: 'intermediaire',
    definition: 'Main qui combine plusieurs tirages simultanément. 12-15 outs, souvent favorite face à une paire.',
    definitionEn: 'A hand combining multiple draws simultaneously. 12-15 outs, often a favorite against one pair.',
    example: 'T♠9♠ sur J♠8♣2♠ = flush draw (9 outs) + OESD (8 outs) - redondances = ~15 outs.',
    exampleEn: 'T♠9♠ on J♠8♣2♠ = flush draw (9 outs) + OESD (8 outs) - redundancies = ~15 outs.' },
  { term: 'Broadways', category: 'Mains & Draws', level: 'debutant',
    definition: 'Cartes T, J, Q, K, A, les plus hautes. Les mains broadway sont des combinaisons de ces cartes.',
    definitionEn: 'Cards T, J, Q, K, A — the highest. Broadway hands are combinations of these cards.',
    example: 'KQ, AJ, QJs, KTs = mains broadway.',
    exampleEn: 'KQ, AJ, QJs, KTs = broadway hands.' },
  { term: 'Suited connectors', category: 'Mains & Draws', level: 'debutant',
    definition: 'Deux cartes consécutives de même couleur. Potentiel de suite ET de couleur.',
    definitionEn: 'Two consecutive cards of the same suit. Potential for both a straight AND a flush.',
    example: '9♥8♥, T♣9♣, J♦T♦ = suited connectors.',
    exampleEn: '9♥8♥, T♣9♣, J♦T♦ = suited connectors.' },

  // ── Types de joueurs / Player types
  { term: 'Fish', category: 'Types de joueurs', level: 'debutant',
    definition: 'Joueur débutant ou récréatif qui fait beaucoup d\'erreurs. VPIP très élevé, ne fold pas assez.',
    definitionEn: 'A beginner or recreational player who makes many mistakes. Very high VPIP, doesn\'t fold enough.',
    example: 'Fish : VPIP 55%, PFR 8%, fold to c-bet 25%.',
    exampleEn: 'Fish: VPIP 55%, PFR 8%, fold to c-bet 25%.' },
  { term: 'Nit', category: 'Types de joueurs', level: 'intermediaire',
    definition: 'Joueur ultra-tight qui ne joue que des mains premium. Facile à bluffer car il fold tout.',
    definitionEn: 'An ultra-tight player who only plays premium hands. Easy to bluff since they fold everything.',
    example: 'Nit : VPIP 12%, PFR 10%, ouvre seulement AA-JJ et AKs.',
    exampleEn: 'Nit: VPIP 12%, PFR 10%, opens only AA-JJ and AKs.' },
  { term: 'TAG (Tight-Aggressive)', category: 'Types de joueurs', level: 'intermediaire',
    definition: 'Style solide et gagnant : sélectif dans les mains jouées, agressif quand il entre.',
    definitionEn: 'A solid winning style: selective about which hands to play, aggressive when entering.',
    example: 'TAG : VPIP 22-26%, PFR 18-22%. Le profil de référence.',
    exampleEn: 'TAG: VPIP 22-26%, PFR 18-22%. The benchmark profile.' },
  { term: 'LAG (Loose-Aggressive)', category: 'Types de joueurs', level: 'avance',
    definition: 'Joue large et de façon très agressive. Difficile à lire, peut être très profitable ou très perdant.',
    definitionEn: 'Plays wide and very aggressively. Hard to read, can be very profitable or very losing.',
    example: 'LAG : VPIP 30-40%, PFR 25-35%. Exploite les faiblesses des ranges adverses.',
    exampleEn: 'LAG: VPIP 30-40%, PFR 25-35%. Exploits weaknesses in opponents\' ranges.' },
  { term: 'Calling station', category: 'Types de joueurs', level: 'intermediaire',
    definition: 'Joueur passif qui appelle tout mais ne raise jamais. Ne bluffez jamais contre lui, value-bettez large.',
    definitionEn: 'A passive player who calls everything but never raises. Never bluff against them, value-bet wide.',
    example: 'Calling station : VPIP 50%, PFR 5%, fold to c-bet 20%.',
    exampleEn: 'Calling station: VPIP 50%, PFR 5%, fold to c-bet 20%.' },
  { term: 'Reg (Régulier)', category: 'Types de joueurs', level: 'intermediaire',
    definition: 'Joueur régulier qui joue souvent et de façon correcte. Se distingue des récréatifs.',
    definitionEn: 'A regular player who plays often and correctly. Distinguished from recreational players.',
    example: 'Reg : VPIP 22-28%, PFR 18-24%, stats équilibrées.',
    exampleEn: 'Reg: VPIP 22-28%, PFR 18-24%, balanced stats.' },
  { term: 'Whale', category: 'Types de joueurs', level: 'intermediaire',
    definition: 'Gros fish avec un bankroll important, joue gros et fait d\'énormes erreurs. Très lucratif.',
    definitionEn: 'A big fish with a large bankroll, plays big stakes and makes huge mistakes. Very lucrative.',
    example: 'Whale en NL2000 avec les habitudes d\'un joueur NL50.',
    exampleEn: 'Whale in NL2000 with the habits of an NL50 player.' },

  // ── Tournois / Tournaments
  { term: 'Bubble', category: 'Tournois', level: 'intermediaire',
    definition: 'Moment juste avant que les joueurs restants atteignent les places payées.',
    definitionEn: 'The moment just before the remaining players reach the paid positions.',
    example: '100 joueurs payés, 101 restants = on est à la bubble.',
    exampleEn: '100 players paid, 101 remaining = we are on the bubble.' },
  { term: 'Push/fold', category: 'Tournois', level: 'intermediaire',
    definition: 'Stratégie en court stack (<15BB) : soit all-in, soit fold. Plus de place pour le jeu en post-flop.',
    definitionEn: 'Short stack strategy (<15BB): either all-in or fold. No room for postflop play.',
    example: 'Avec 12BB, AJ BTN = push all-in (pas de raise standard).',
    exampleEn: 'With 12BB, AJ BTN = push all-in (no standard raise).' },
  { term: 'Rebuy', category: 'Tournois', level: 'debutant',
    definition: 'Possibilité de racheter des jetons dans certains tournois, en cas d\'élimination ou stack bas.',
    definitionEn: 'The ability to buy back in during certain tournaments if eliminated or stack is low.',
    example: 'Tournoi rebuy pendant 1h : tu peux recharger si tu perds tous tes jetons.',
    exampleEn: 'Rebuy tournament for 1h: you can reload if you lose all your chips.' },
  { term: 'MTT', category: 'Tournois', level: 'debutant',
    definition: 'Multi-Table Tournament. Grand tournoi avec de nombreuses tables, structure de blindes croissante.',
    definitionEn: 'Multi-Table Tournament. Large tournament with many tables and a rising blind structure.',
    example: 'WSOP Main Event = MTT avec 10 000+ participants.',
    exampleEn: 'WSOP Main Event = MTT with 10,000+ participants.' },
  { term: 'SNG (Sit & Go)', category: 'Tournois', level: 'debutant',
    definition: 'Tournoi qui commence dès que la table est pleine (généralement 6 ou 9 joueurs). Très populaire pour pratiquer l\'ICM.',
    definitionEn: 'A tournament that starts as soon as the table is full (usually 6 or 9 players). Very popular for practicing ICM.',
    example: 'SNG 9-max : dernier inscrit démarre le tournoi.',
    exampleEn: 'SNG 9-max: last player to register starts the tournament.' },
  { term: 'Ante', category: 'Tournois', level: 'debutant',
    definition: 'Mise obligatoire payée par tous les joueurs à chaque main (en plus des blinds). Accélère l\'action.',
    definitionEn: 'A forced bet paid by all players each hand (in addition to blinds). Speeds up the action.',
    example: 'Big Blind Ante : seul le BB paye l\'ante = plus fluide.',
    exampleEn: 'Big Blind Ante: only the BB pays the ante = smoother flow.' },
];

const CATEGORIES_FR = ['Tous', 'Fondamentaux', 'Positions', 'Stats & HUD', 'Stratégie', 'Concepts avancés', 'Mains & Draws', 'Types de joueurs', 'Tournois'];
const CATEGORIES_EN = ['All', 'Fundamentals', 'Positions', 'Stats & HUD', 'Strategy', 'Advanced Concepts', 'Hands & Draws', 'Player Types', 'Tournaments'];
const CATEGORY_MAP_EN_TO_FR: Record<string, string> = {
  'All': 'Tous',
  'Fundamentals': 'Fondamentaux',
  'Positions': 'Positions',
  'Stats & HUD': 'Stats & HUD',
  'Strategy': 'Stratégie',
  'Advanced Concepts': 'Concepts avancés',
  'Hands & Draws': 'Mains & Draws',
  'Player Types': 'Types de joueurs',
  'Tournaments': 'Tournois',
};

const LEVEL_LABELS_FR: Record<Level, string> = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };
const LEVEL_LABELS_EN: Record<Level, string> = { debutant: 'Beginner', intermediaire: 'Intermediate', avance: 'Advanced' };
const LEVEL_COLORS: Record<Level, string> = { debutant: '#22c55e', intermediaire: '#3b82f6', avance: '#a855f7' };

// ─── Component ────────────────────────────────────────────────────────────────

export default function GlossairePage() {
  const locale = useLocale();
  const isEn = locale === 'en';

  const CATEGORIES = isEn ? CATEGORIES_EN : CATEGORIES_FR;
  const LEVEL_LABELS = isEn ? LEVEL_LABELS_EN : LEVEL_LABELS_FR;

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    // Map EN category to FR for data filtering
    const frCategory = isEn ? (CATEGORY_MAP_EN_TO_FR[activeCategory] ?? activeCategory) : activeCategory;
    const allKey = isEn ? 'All' : 'Tous';
    return TERMS.filter(t => {
      const matchCat = activeCategory === allKey || t.category === frCategory;
      const q = search.toLowerCase();
      const def = isEn ? t.definitionEn : t.definition;
      const matchSearch = !q || t.term.toLowerCase().includes(q) || def.toLowerCase().includes(q);
      return matchCat && matchSearch;
    }).sort((a, b) => a.term.localeCompare(b.term, isEn ? 'en' : 'fr'));
  }, [search, activeCategory, isEn]);

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <main className="max-w-4xl mx-auto px-4 pt-28 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">{isEn ? 'Reference' : 'Référence'}</span>
            <span className="text-xs text-gray-500">{TERMS.length} {isEn ? 'terms' : 'termes'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            {isEn ? 'Poker Glossary' : 'Glossaire Poker'}
          </h1>
          <p className="text-gray-400">{isEn ? 'All poker terms explained clearly, from beginner to pro.' : 'Tous les termes du poker expliqués clairement, du débutant au pro.'}</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={isEn ? 'Search a term... (e.g. GTO, equity, c-bet)' : 'Rechercher un terme... (ex: GTO, equity, c-bet)'}
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
          {filtered.length} {isEn ? (filtered.length > 1 ? 'terms' : 'term') : ('terme' + (filtered.length > 1 ? 's' : ''))}{search ? ` ${isEn ? 'for' : 'pour'} "${search}"` : ''}
        </p>

        {/* Terms list */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => {
              const isOpen = expanded === t.term;
              const definition = isEn ? t.definitionEn : t.definition;
              const example = isEn ? (t.exampleEn ?? t.example) : t.example;
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
                      <span className="text-gray-600 text-xs hidden sm:block truncate">{definition.slice(0, 60)}…</span>
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
                          <p className="text-gray-300 text-sm leading-relaxed">{definition}</p>
                          {example && (
                            <div className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                              <span className="text-emerald-500 text-xs font-semibold">{isEn ? 'Example: ' : 'Exemple : '}</span>
                              <span className="text-gray-400 text-xs">{example}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 text-xs">{isEn ? CATEGORY_MAP_EN_TO_FR[activeCategory] ? activeCategory : t.category : t.category}</span>
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
              <p className="text-gray-500 text-lg mb-2">{isEn ? 'No terms found' : 'Aucun terme trouvé'}</p>
              <p className="text-gray-600 text-sm">{isEn ? 'Try another keyword or category.' : 'Essayez un autre mot-clé ou une autre catégorie.'}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
