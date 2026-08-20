'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShieldAlert, Heart, Brain, TrendingDown, Phone, ExternalLink,
  CheckCircle, AlertTriangle, Clock, Banknote, Users, BarChart3,
  Monitor, Eye, Crosshair, Sword, TrendingUp
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45 } }),
};

const mentalTips = [
  {
    icon: Clock,
    title: 'Fixe des limites de temps',
    body: "Avant de jouer, decide combien de temps tu y consacreras. Pose une alarme. Respecte-la meme en cas de bonne serie : le tilt ne frappe pas que quand tu perds.",
  },
  {
    icon: Banknote,
    title: 'Joue uniquement ce que tu peux perdre',
    body: "Le bankroll management n'est pas une option. Ne joue jamais avec l'argent du loyer, des courses ou d'une epargne. Une regle simple : si la perte te ferait stresser, c'est trop.",
  },
  {
    icon: Brain,
    title: "Reconnais le tilt avant qu'il t'ecrase",
    body: "Le tilt, jouer sous l'emprise de l'emotion, est la premiere cause de perte. Si tu sens la frustration monter : pause obligatoire. 10 minutes minimum. Reviens quand ton raisonnement est clair.",
  },
  {
    icon: BarChart3,
    title: 'Evalue ton jeu sur le long terme',
    body: "Une session ne dit rien. Une semaine non plus. Juge tes decisions sur leur qualite, pas sur leur resultat. La variance fait partie du jeu : un mauvais resultat n'est pas forcement une mauvaise decision.",
  },
  {
    icon: Users,
    title: 'Ne joue pas pour fuir',
    body: "Le poker comme exutoire au stress, a l'ennui ou aux problemes personnels est un signal d'alerte. Le jeu doit etre un loisir conscient, pas une echappatoire.",
  },
  {
    icon: Heart,
    title: 'Parle de ta pratique autour de toi',
    body: "Isoler sa pratique est un signe preoccupant. Si tu caches combien de temps ou d'argent tu joues, c'est le moment de t'interroger honnetement.",
  },
];

const howToPlayTips = [
  {
    icon: Monitor,
    title: 'Commence sans argent reel',
    body: "Avant de toucher a une mise, joue en play money : sur des sites gratuits, avec des amis, ou ici sur Forged Poker. La mecanique des mises, les positions, les ranges : tout ca s'apprend sans risquer un centime. N'engage de l'argent reel que quand les regles sont devenues automatiques.",
  },
  {
    icon: TrendingUp,
    title: "Le jeu en ligne est un vrai outil d'apprentissage",
    body: "Ne sous-estime pas le poker online. En live, tu joues peut-etre 30 mains par heure. En ligne, c'est 60 a 80, voire plusieurs tables en parallele. Ce volume accelere est un avantage unique : tu rencontres plus de situations, plus vite, et tu corriges plus vite. Le live apprend la lecture humaine ; le online apprend la discipline mathematique. Les deux sont indispensables.",
  },
  {
    icon: Eye,
    title: 'Lis tes adversaires en permanence',
    body: "Chaque information compte. En live : le timing d'une relance, un regard vers les jetons apres avoir vu sa main, une respiration qui change. En ligne : le sizing inhabituel, une decision prise trop vite ou trop lentement. Un bon joueur n'observe pas seulement ses cartes : il observe la table entiere, a chaque street, meme quand il est couche.",
  },
  {
    icon: Crosshair,
    title: 'Comprends pour exploiter',
    body: "L'objectif n'est pas de jouer tes cartes : c'est de jouer ton adversaire. Un joueur trop passif qui appelle toutes tes mises ? Value-bet large sur chaque main forte, reduis tes bluffs a zero face a lui. Un joueur qui fold trop sur le flop ? Bet plus souvent en continuation. L'exploitation consciente de ces tendances, c'est ce qui separe un joueur moyen d'un joueur rentable.",
  },
  {
    icon: Sword,
    title: 'Le bluff est un outil, pas un style',
    body: "Bluffer n'a de sens que si ton adversaire est capable de folder : bluffer un calling station, c'est bruler de l'argent. Un bon bluff raconte une histoire coherente avec l'ensemble de la main : ta position, le board, ton sizing depuis le debut. Ne bluffe jamais par ennui, par frustration ou pour voir. Chaque bluff doit avoir une raison precise.",
  },
  {
    icon: TrendingDown,
    title: 'Sur une main forte, construis le pot',
    body: "Beaucoup de debutants slowplay leurs meilleures mains par peur de faire fuir l'adversaire. C'est une erreur frequente et couteuse. Si ton adversaire est pret a payer, laisse-le payer : bet, relance, construis le pot tot. Le poker n'est pas un jeu ou l'on se cache quand on est fort : c'est un jeu ou l'on sait quand montrer sa force et en tirer le maximum.",
  },
];

const warningSignals = [
  "Tu joues avec de l'argent prevu pour d'autres depenses",
  "Tu empruntes pour financer ta pratique",
  "Tu passes de plus en plus de temps a jouer malgre tes obligations",
  "Tu ressens le besoin de cacher ta pratique a tes proches",
  'Tu continues a jouer pour "recuperer" tes pertes (chasing losses)',
  "Tu ressens de l'irritabilite ou de l'anxiete quand tu ne joues pas",
  "Le jeu prend le dessus sur ton sommeil, ton travail, tes relations",
];

const resources = [
  {
    name: 'Joueurs Info Service',
    description: "Ligne d'ecoute nationale, anonyme et gratuite, specialisee jeu problematique",
    contact: '09 74 75 13 13',
    url: 'https://www.joueurs-info-service.fr',
    type: 'phone',
  },
  {
    name: 'Addictaide',
    description: "Portail national d'information et d'orientation sur les addictions",
    contact: 'addictaide.fr',
    url: 'https://www.addictaide.fr',
    type: 'web',
  },
  {
    name: 'Alcool Info Service / Drogues Info Service',
    description: "Ecoute, information et orientation pour toutes les addictions comportementales",
    contact: '0 800 23 13 13',
    url: 'https://www.drogues-info-service.fr',
    type: 'phone',
  },
];

export default function JeuResponsablePage() {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#e8f5e9]">

      <main className="pt-24 pb-20 px-4 max-w-3xl mx-auto" id="main-content">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldAlert size={13} />
            Jeu responsable
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            Jouer, oui, mais en connaissance de cause
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Forged Poker est un site d&apos;apprentissage sans argent réel. Mais le poker se pratique aussi en argent réel,
            et ça change tout. Cette page est là pour que tu abordes ça avec lucidité.
          </p>
        </motion.div>

        {/* Age warning */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mb-10 p-6 rounded-2xl border-2 border-red-500/30 bg-red-500/5"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
              <span className="text-2xl font-black text-red-400">18+</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg mb-2">Le poker en argent réel est réservé aux majeurs</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                En France, la participation à des jeux d&apos;argent est strictement interdite aux personnes de moins de 18 ans.
                Les sites de poker légaux en France sont régulés par l&apos;<strong className="text-gray-300">ANJ (Autorité Nationale des Jeux)</strong> et
                doivent vérifier l&apos;identité et l&apos;âge de leurs utilisateurs. Jouer sur un site non agréé ANJ est illégal.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Risks section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold text-white mb-2">Les risques du jeu d&apos;argent</h2>
          <p className="text-gray-400 text-sm mb-5 leading-relaxed">
            Le poker combine compétence et hasard. La compétence peut réduire la part du hasard,
            mais ne l&apos;élimine jamais. Même les meilleurs joueurs du monde traversent des périodes de perte prolongées.
            Ce que la plupart des gens sous-estiment :
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: TrendingDown,
                title: 'La variance',
                body: "À court terme, les résultats peuvent être très éloignés de l'espérance mathématique. Des mois entiers de pertes sont possibles même en jouant bien.",
              },
              {
                icon: Brain,
                title: 'Le biais cognitif',
                body: "Notre cerveau n'est pas câblé pour raisonner correctement sur la probabilité. On surestime les gains récents, on minimise les pertes.",
              },
              {
                icon: AlertTriangle,
                title: "L'addiction",
                body: "Le jeu stimule les mêmes circuits cérébraux que d'autres addictions. La dépendance peut s'installer progressivement, sans qu'on s'en rende compte.",
              },
              {
                icon: Users,
                title: "L'impact social",
                body: "Une pratique problématique détériore les relations, l'emploi et la santé mentale. L'entourage est souvent touché avant le joueur lui-même.",
              },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/8">
                <div className="flex items-center gap-2.5 mb-2">
                  <item.icon size={16} className="text-yellow-500 shrink-0" />
                  <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* How to play */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold text-white mb-1">Comment bien jouer</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Quelques principes que les bons joueurs intègrent tôt, et que les autres apprennent à la dure.
          </p>
          <div className="space-y-4">
            {howToPlayTips.map((tip, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex gap-4 p-4 rounded-xl bg-white/3 border border-white/8 hover:border-green-500/20 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <tip.icon size={16} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{tip.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{tip.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Mental prep */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold text-white mb-1">Préparation mentale</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Les meilleurs joueurs travaillent autant leur mental que leur technique. Ce n&apos;est pas de la philosophie :
            c&apos;est de la performance. Voici les bases.
          </p>
          <div className="space-y-4">
            {mentalTips.map((tip, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex gap-4 p-4 rounded-xl bg-white/3 border border-white/8 hover:border-yellow-500/20 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <tip.icon size={16} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{tip.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{tip.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Warning signals */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="mb-10 p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <AlertTriangle size={18} className="text-orange-400 shrink-0" />
            <h2 className="text-white font-bold text-lg">Signaux d&apos;alerte</h2>
          </div>
          <p className="text-gray-400 text-sm mb-5">
            Si tu te reconnais dans plusieurs de ces situations, il est important d&apos;en parler à un professionnel.
          </p>
          <ul className="space-y-2.5">
            {warningSignals.map((signal, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                {signal}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-gray-400">
            Un seul de ces signaux suffit à mériter une pause et une réflexion honnête.
          </p>
        </motion.section>

        {/* Resources */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold text-white mb-1">Ressources &amp; aide</h2>
          <p className="text-gray-400 text-sm mb-5">Gratuit, anonyme, sans jugement.</p>
          <div className="space-y-3">
            {resources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-white/8 hover:border-green-500/30 hover:bg-green-500/5 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  {r.type === 'phone'
                    ? <Phone size={16} className="text-green-400" />
                    : <ExternalLink size={16} className="text-green-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-semibold text-sm">{r.name}</span>
                    <ExternalLink size={11} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed mb-1">{r.description}</p>
                  <span className="text-green-400 text-sm font-mono font-semibold">{r.contact}</span>
                </div>
              </a>
            ))}
          </div>
        </motion.section>

        {/* Self-exclusion */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45 }}
          className="p-5 rounded-2xl bg-white/3 border border-white/10 mb-10"
        >
          <div className="flex items-start gap-3">
            <CheckCircle size={18} className="text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">Auto-exclusion</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tous les sites de poker agréés ANJ en France proposent un système d&apos;auto-exclusion : tu peux
                bloquer ton accès pour une durée choisie (7 jours, 1 mois, jusqu&apos;à 3 ans). C&apos;est une démarche
                de lucidité, pas de faiblesse. L&apos;ANJ propose également une exclusion globale sur tous les
                opérateurs agréés français via{' '}
                <a href="https://www.anj.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline underline-offset-2 hover:text-blue-300">
                  anj.fr
                </a>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm transition-all"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>

      </main>
    </div>
  );
}
