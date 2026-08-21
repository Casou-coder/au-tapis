'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, AlertTriangle } from 'lucide-react';

type Severity = 'critique' | 'importante' | 'fréquente';

interface PokerError {
  title: string;
  mistake: string;
  why: string;
  fix: string;
  severity: Severity;
}

const SEVERITY_STYLES: Record<Severity, string> = {
  critique:   'bg-red-500/20 text-red-400 border border-red-500/30',
  importante: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  fréquente:  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
};

const LEVELS = [
  { id: 'debutant',      label: 'Débutant',       emoji: '🌱', color: '#27ae60', href: '/debutant' },
  { id: 'intermediaire', label: 'Intermédiaire',   emoji: '🎯', color: '#2980b9', href: '/intermediaire' },
  { id: 'avance',        label: 'Avancé',          emoji: '🔮', color: '#8e44ad', href: '/avance' },
  { id: 'expert',        label: 'Expert',          emoji: '⚡', color: '#c9a84c', href: '/expert' },
  { id: 'pro',           label: 'Pro',             emoji: '👑', color: '#e74c3c', href: '/professionnel' },
];

const ERRORS: Record<string, PokerError[]> = {
  debutant: [
    { title: 'Jouer trop de mains', mistake: "Entrer dans le pot avec n'importe quelles deux cartes", why: "La sélection préflop est la base de tout. Jouer 80% des mains garantit de perdre à long terme.", fix: "Commencez avec les 15-20% meilleures mains. UTG = top 12%, BTN = top 35%. La patience est un avantage.", severity: 'critique' },
    { title: 'Slowplay systématique', mistake: "Checker une main très forte pour 'piéger' l'adversaire", why: "Le slowplay donne des cartes gratuites qui battent votre main et réduit le pot. C'est -EV dans 90% des cas.", fix: "Avec une main forte, bettez et construisez le pot. Le piège est une exception rare, pas la règle.", severity: 'critique' },
    { title: 'Ignorer la position', mistake: "Jouer les mêmes mains en UTG et au BTN", why: "La position vous donne un avantage informationnel énorme. Une main jouable en position devient -EV hors position.", fix: "Resserrez votre range en early position, élargissez au BTN et CO. La position vaut souvent plus que les cartes.", severity: 'critique' },
    { title: 'Call, call, call sans plan', mistake: "Appeler toutes les mises sans stratégie pour les streets suivantes", why: "Chaque call doit avoir une raison : draw avec odds, top pair solide, read spécifique. Caller par défaut perd.", fix: "Avant de caller, demandez : quelle est ma main au river ? Comment vais-je jouer turn et river ?", severity: 'importante' },
    { title: 'Sizing uniforme', mistake: "Toujours miser 50% du pot quelle que soit la situation", why: "Un sizing fixe rend votre jeu lisible. L'adversaire sait toujours si vous avez une bonne ou mauvaise main.", fix: "Adaptez : value bet 75-100% sur boards secs, 33-50% pour protection, bluff avec un sizing crédible.", severity: 'importante' },
    { title: 'Bluffer les calling stations', mistake: "Tenter des bluffs contre des joueurs qui n'abandonnent jamais", why: "Un bluff n'a de valeur que si l'adversaire peut folder. Bluffer un fish qui appelle tout = brûler de l'argent.", fix: "Identifiez d'abord le profil adverse. Réservez vos bluffs aux joueurs capables de fold.", severity: 'fréquente' },
    { title: 'Tilt après une bad beat', mistake: "Changer drastiquement son jeu après avoir perdu une grosse main", why: "La variance fait partie du poker. Jouer sous l'emprise de l'émotion amplifie les pertes exponentiellement.", fix: "Pause de 5-10 min après une bad beat. Évaluez vos décisions, pas vos résultats. La variance se moyenne.", severity: 'critique' },
  ],
  intermediaire: [
    { title: 'Pot odds ignorées', mistake: "Appeler sans vérifier si l'appel est +EV mathématiquement", why: "Chaque call avec un draw sans odds suffisants est une perte garantie à long terme.", fix: "Outs × 2 au turn, outs × 4 au flop = équité approchée. Comparez à (mise / pot+mise) × 100.", severity: 'critique' },
    { title: 'C-bet automatique', mistake: "Faire une continuation bet sur tous les flops après une relance préflop", why: "Un c-bet sans plan dépense des jetons inutilement. L'adversaire s'adapte et exploite votre fréquence.", fix: "Évaluez : le flop touche-t-il votre range ? Est-il bon pour bluffer ? Sinon, checkez et préservez votre range.", severity: 'importante' },
    { title: 'Overvalue top pair mauvais kicker', mistake: "Jouer A9 sur A♠7♦3♣ comme si c'était la nuts", why: "A9 est dominé par AJ, AQ, AK. Vous êtes prêt à stackoff contre les mains qui vous battent.", fix: "Jouez les top pairs avec mauvais kicker en pot-control. Évitez les gros pots 3-streets.", severity: 'critique' },
    { title: 'Ranges BB trop étroites', mistake: "Foldr trop souvent en big blind face aux steals", why: "Si vous foldez trop souvent en BB, vous offrez un profit immédiat garanti aux steals.", fix: "La BB doit défendre ~60-70% des mains face à une relance BTN. Calculez votre MDF (Minimum Defense Frequency).", severity: 'fréquente' },
    { title: 'Value bet trop petite', mistake: "Faire de petits bets avec des nuts pour 'ne pas faire fuir'", why: "Si l'adversaire est prêt à payer, un petit bet est EV négatif vs un gros bet. Vous laissez de l'argent.", fix: "En value, bettez grand (75-125% pot). L'adversaire doit payer cher pour voir votre main.", severity: 'importante' },
    { title: 'Bankroll management ignoré', mistake: "Jouer à des stakes dépassant 5% de son bankroll", why: "La variance peut éliminer un joueur gagnant si les stakes sont trop élevés par rapport à son bankroll.", fix: "Cash : max 5% du bankroll par table. MTT : max 2%. Montez les stakes progressivement et méthodiquement.", severity: 'critique' },
    { title: 'Lectures ignorées', mistake: "Jouer uniquement ses cartes sans observer les adversaires", why: "Le poker est un jeu d'information. Un adversaire qui over-bet river après check-call 2 streets est exploitable.", fix: "Notez les tendances : fréquence de fold, sizing en value vs bluff, timing tells. Exploitez les patterns.", severity: 'importante' },
  ],
  avance: [
    { title: 'GTO mal appliqué', mistake: "Jouer 'GTO' sans comprendre les fréquences d'équilibre", why: "Le GTO n'est pas 'jouer aléatoirement'. C'est maintenir des fréquences précises pour rester non-exploitable.", fix: "Apprenez les fréquences solver pour vos spots récurrents. La théorie sans chiffres est inutile.", severity: 'critique' },
    { title: '3-bet trop polarisé', mistake: "3-better seulement avec les nuts ou bluffs évidents", why: "Un range 3-bet lisible permet à l'adversaire de jouer parfaitement contre vous.", fix: "Mélangez : 3-bets value (QQ+, AK), semi-bluff (A5s, KQs), quelques mains borderline pour l'équilibre.", severity: 'importante' },
    { title: 'Blockers négligés', mistake: "Ne pas utiliser ses cartes en main pour choisir les bluffs", why: "Bluffer avec l'As en main réduit la probabilité que le villain ait une main forte. C'est un avantage ignoré.", fix: "Choisissez vos bluffs selon les blockers : A-x pour bloquer les nuts, K-x pour bloquer les strong ranges.", severity: 'fréquente' },
    { title: 'SPR mal géré', mistake: "Ne pas planifier le jeu en fonction du stack-to-pot ratio", why: "Un SPR de 2 sur le flop implique un stack-off. Un SPR de 10 nécessite plus de sélectivité.", fix: "Calculez SPR avant le flop : stack effectif / pot. SPR < 3 = OK stacker top pair. SPR > 8 = soyez sélectif.", severity: 'importante' },
    { title: 'Double barrel sans justification', mistake: "Continuer à bluffer turn sans évaluer si le villain peut folder", why: "Un double barrel coûte cher. Sans foldability et equity, c'est un leak significatif.", fix: "Evaluez : le villain peut-il folder ? Avez-vous equity ou blockers ? Non → checkez, préservez votre range.", severity: 'critique' },
    { title: 'ICM négligé en tournoi', mistake: "Jouer comme en cash game près du bubble ou en FT", why: "L'ICM change radicalement les équités. Être éliminé avec 90% d'equity peut être -EV en ICM.", fix: "Resserrez significativement votre range en spots ICM critiques. La survie a une valeur monétaire réelle.", severity: 'critique' },
    { title: 'Range advantage ignoré', mistake: "Ne pas exploiter les boards qui favorisent votre range", why: "Certains boards vous donnent un avantage de range structurel. Ne pas en profiter laisse de l'EV.", fix: "Sur les boards que vous couvrez mieux (KK2 en BTN vs BB), bettez plus fréquemment et avec plus de sizing.", severity: 'fréquente' },
  ],
  expert: [
    { title: 'Biais de résultat', mistake: "Juger ses décisions à l'aune des résultats plutôt que du raisonnement", why: "Une décision correcte peut avoir un mauvais résultat (variance). Le résultat ne valide pas la décision.", fix: "Analysez chaque décision indépendamment du résultat. Critère : était-ce +EV selon mes informations au moment de décider ?", severity: 'critique' },
    { title: 'Pas de routine d\'étude', mistake: "Jouer sans session d'analyse régulière avec solver", why: "Sans revue de main et solver work, les leaks persistent indéfiniment et coûtent des bb/100.", fix: "Pour 2h de jeu : 30min d'étude minimum. Spots récurrents → solver → implémentez les corrections.", severity: 'critique' },
    { title: 'Exploit sans read valide', mistake: "Dévier du GTO sans raison solide justifiant l'exploitation", why: "Exploiter sans read = erreur. Si votre read est faux, vous êtes exploitable sans le savoir.", fix: "Quantifiez : fréquence de fold observée > fréquence GTO ? Alors bluffez plus. Sinon, restez GTO.", severity: 'importante' },
    { title: 'Leak size ignoré', mistake: "Corriger les petites erreurs sans s'attaquer aux gros leaks", why: "Un leak de 5bb/100 mains est bien plus coûteux qu'un leak de 0.5bb/100.", fix: "Utilisez un HUD ou tracker. Identifiez vos 3 plus gros leaks par position et par street. Priorisez.", severity: 'critique' },
    { title: 'Tilt cognitif non-détecté', mistake: "Continuer à jouer en croyant être à son meilleur niveau alors que non", why: "Le tilt cognitif est le plus dangereux : vous pensez jouer correctement alors que vos décisions dévient.", fix: "Définissez un stop-loss de session (ex : -3 buy-ins). Respectez-le systématiquement, sans exception.", severity: 'importante' },
    { title: 'Table selection négligée', mistake: "S'asseoir à n'importe quelle table sans évaluer les adversaires", why: "Votre winrate dépend autant de votre niveau que de celui de vos adversaires. La sélection est du +EV pur.", fix: "Identifiez les fish avant de vous asseoir. Changez de table si la dynamique devient négative.", severity: 'fréquente' },
    { title: 'Sizing non-exploitatoire', mistake: "Utiliser des tailles de mises fixes sans adapter à l'adversaire", why: "Le sizing optimal varie selon le board, la range, et le profil adverse. Un sizing fixe est sous-optimal.", fix: "Contre calling stations : gros sizings en value. Contre les folders : petits bluffs fréquents suffisent.", severity: 'importante' },
  ],
  pro: [
    { title: 'Ratio étude/jeu déséquilibré', mistake: "Jouer 90% du temps sans étudier proportionnellement", why: "Les meilleurs joueurs du monde passent autant de temps à étudier qu'à jouer. La progression stagne sans étude.", fix: "Pour chaque session, réservez 25-33% du temps à l'étude post-session et aux solvers.", severity: 'critique' },
    { title: 'Volume au détriment de la qualité', mistake: "Maximiser le nombre de tables au détriment de la qualité de décision", why: "Au-delà d'un certain nombre de tables, le winrate par table chute. Volume × mauvaises décisions = perte.", fix: "Trouvez votre optimum : nombre de tables où vous maintenez 90%+ de qualité de décision.", severity: 'importante' },
    { title: 'Revue par les pairs absente', mistake: "Étudier seul sans confronter son analyse à d'autres bons joueurs", why: "Vos biais cognitifs persistent si vous ne les confrontez pas. Un regard extérieur accélère la progression.", fix: "Intégrez un groupe d'étude avec 2-4 joueurs de niveau proche ou supérieur. Revuez des mains ensemble.", severity: 'fréquente' },
    { title: 'Bankroll management relâché', mistake: "Jouer au-dessus de ses limites après une bonne série", why: "La variance à hauts stakes est décuplée. Une série de pertes peut être dévastatrice pour le BR.", fix: "Règle stricte : montez d'un stake avec 30+ buy-ins. Redescendez à 20 buy-ins si nécessaire. Sans exception.", severity: 'critique' },
    { title: 'Solver outputs mal interprétés', mistake: "Copier les solutions solver sans comprendre le raisonnement", why: "Les solvers donnent des fréquences pour des ranges idéales vs ranges idéales. L'application humaine diffère.", fix: "Comprenez le POURQUOI de chaque action solver. Adaptez en fonction des tendances humaines observées.", severity: 'critique' },
    { title: 'Mindset figé', mistake: "Croire que sa stratégie actuelle est optimale et ne plus se remettre en question", why: "Le poker évolue constamment. Ce qui était GTO il y a 2 ans peut être exploitable aujourd'hui.", fix: "Remettez en question vos schémas régulièrement. Suivez les updates des meilleurs pools (NL500+).", severity: 'importante' },
    { title: 'EV court terme vs méta', mistake: "Surexploiter certains plays très +EV à court terme", why: "Des plays très +EV à court terme vous rendent exploitable à long terme si surexploités dans des pools réguliers.", fix: "Maintenez des fréquences proches de l'équilibre même contre des adversaires exploitables dans des pools stables.", severity: 'fréquente' },
  ],
};

export default function ErreursPage() {
  const [activeLevel, setActiveLevel] = useState('debutant');
  const level = LEVELS.find(l => l.id === activeLevel)!;
  const errors = ERRORS[activeLevel];

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#e8f5e9]">
      <main id="main-content" className="pt-24 pb-20 px-4 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> Accueil
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <AlertTriangle size={13} />
            Erreurs à éviter
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
            Erreurs Fréquentes
          </h1>
          <p className="text-gray-400 text-lg">
            Les fuites les plus courantes à chaque niveau, et comment les corriger.
          </p>
        </motion.div>

        {/* Level tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {LEVELS.map(l => (
            <button
              key={l.id}
              onClick={() => setActiveLevel(l.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeLevel === l.id ? 'text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/8'
              }`}
              style={activeLevel === l.id ? { background: l.color + '30', border: `1px solid ${l.color}50`, color: l.color } : {}}
            >
              <span>{l.emoji}</span> {l.label}
            </button>
          ))}
        </div>

        {/* Errors grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLevel}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {errors.map((err, i) => (
              <motion.div
                key={err.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/8 hover:border-white/15 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-white font-bold text-sm leading-snug">{err.title}</h3>
                  <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${SEVERITY_STYLES[err.severity]}`}>
                    {err.severity}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <p className="text-gray-500 font-medium mb-0.5">❌ L&apos;erreur</p>
                    <p className="text-gray-300 leading-relaxed">{err.mistake}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-0.5">🤔 Pourquoi c&apos;est une erreur</p>
                    <p className="text-gray-400 leading-relaxed">{err.why}</p>
                  </div>
                  <div className="pt-1 border-t border-white/8">
                    <p className="text-gray-500 font-medium mb-0.5">✅ La correction</p>
                    <p className="text-green-300/80 leading-relaxed">{err.fix}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center justify-between p-5 rounded-2xl bg-white/3 border border-white/8"
        >
          <div>
            <p className="text-white font-semibold text-sm">{errors.length} erreurs identifiées pour le niveau {level.label}</p>
            <p className="text-gray-500 text-xs mt-0.5">Travaillez ces corrections dans les modules de cours.</p>
          </div>
          <Link
            href={level.href}
            className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ background: level.color + '30', border: `1px solid ${level.color}50` }}
          >
            Cours {level.label} →
          </Link>
        </motion.div>

      </main>
    </div>
  );
}
