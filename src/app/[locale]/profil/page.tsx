'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useProgress, getXpTitle, XP_TITLES, loadXpHistory, XpDayRecord } from '@/hooks/useProgress';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useChallengeStats, TypeStat } from '@/hooks/useChallengeStats';
import { CHALLENGES } from '@/lib/challenges-data';
import { computeBadges, BADGE_SERIES_META, BADGE_SERIES_ORDER, BadgeSeries, BadgeData, BadgeDef } from '@/lib/badges';
import { BadgeChip } from '@/components/BadgeChip';

// ── badge progress helpers ────────────────────────────────────────────────────

function getBadgeProgress(badge: BadgeDef, data: BadgeData): number {
  const idx = parseInt(badge.id.slice(1)) - 1;
  switch (badge.series) {
    case 'ritualiste': { const t = [7,30,100,200,365][idx]; return Math.min(data.maxStreak/t, 0.98); }
    case 'grinder':    { const t = [5,10,25,50,100,150,200,250,300,400,500][idx]; return Math.min(data.totalChallenges/t, 0.98); }
    case 'main': {
      const thr = [50,150,400,800,1500,2500,4000,6000,9000,13000];
      const prv = [0,50,150,400,800,1500,2500,4000,6000,9000];
      return Math.min(Math.max((data.totalXp-prv[idx])/(thr[idx]-prv[idx]),0), 0.98);
    }
    case 'faucon':    { const t = [5,10,20,50][idx]; return Math.min(data.maxConsecutiveCorrect/t, 0.98); }
    case 'justesse': {
      const minC = [20,50,100,75,50][idx];
      const rate = [0.60,0.70,0.80,0.90,0.95][idx];
      const cp = Math.min(data.totalChallenges/minC, 1);
      const rp = data.totalChallenges > 0 ? Math.min((data.totalCorrect/data.totalChallenges)/rate, 1) : 0;
      return Math.min(cp*0.4+rp*0.6, 0.98);
    }
    case 'specialiste': {
      const types = ['gto','icm','reads','calculation','all'];
      if (idx < 4) return Math.min((data.typeStats[types[idx]]?.correct??0)/10, 0.98);
      const avg = ['gto','icm','reads','calculation','decision'].reduce((s,t)=>s+Math.min((data.typeStats[t]?.correct??0)/10,1),0)/5;
      return Math.min(avg, 0.98);
    }
    default: return 0;
  }
}

function getBadgeHint(badge: BadgeDef, data: BadgeData, isEn: boolean): string {
  const idx = parseInt(badge.id.slice(1)) - 1;
  switch (badge.series) {
    case 'ritualiste': { const t=[7,30,100,200,365][idx]; const l=t-data.maxStreak; return isEn?`${l} more day${l>1?'s':''}`:`${l} jour${l>1?'s':''} de plus`; }
    case 'grinder':    { const t=[5,10,25,50,100,150,200,250,300,400,500][idx]; const l=t-data.totalChallenges; return isEn?`${l} more`:`${l} défis`; }
    case 'main':       { const t=[50,150,400,800,1500,2500,4000,6000,9000,13000][idx]; return `${(t-data.totalXp).toLocaleString(isEn?'en-US':'fr-FR')} XP`; }
    case 'faucon':     { const t=[5,10,20,50][idx]; return isEn?`${t-data.maxConsecutiveCorrect} more correct`:`${t-data.maxConsecutiveCorrect} de plus d'affilée`; }
    default: return isEn?badge.condEn:badge.condFr;
  }
}

// ── weekly helpers ────────────────────────────────────────────────────────────

function getWeekDates(): string[] {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday
  const monday = new Date(d); monday.setDate(d.getDate()+diff); monday.setHours(0,0,0,0);
  return Array.from({length:7}, (_,i) => {
    const x = new Date(monday); x.setDate(monday.getDate()+i);
    return x.toISOString().split('T')[0];
  });
}

const LEVELS_FR = [
  { id: 'debutant', label: 'Débutant', emoji: '🟢', color: 'text-green-400', total: 8 },
  { id: 'intermediaire', label: 'Intermédiaire', emoji: '🔵', color: 'text-blue-400', total: 8 },
  { id: 'avance', label: 'Avancé', emoji: '🟣', color: 'text-purple-400', total: 9 },
  { id: 'expert', label: 'Expert', emoji: '🟡', color: 'text-yellow-400', total: 9 },
  { id: 'professionnel', label: 'Professionnel', emoji: '🔴', color: 'text-red-400', total: 7 },
];

const LEVELS_EN = [
  { id: 'debutant', label: 'Beginner', emoji: '🟢', color: 'text-green-400', total: 8 },
  { id: 'intermediaire', label: 'Intermediate', emoji: '🔵', color: 'text-blue-400', total: 8 },
  { id: 'avance', label: 'Advanced', emoji: '🟣', color: 'text-purple-400', total: 9 },
  { id: 'expert', label: 'Expert', emoji: '🟡', color: 'text-yellow-400', total: 9 },
  { id: 'professionnel', label: 'Professional', emoji: '🔴', color: 'text-red-400', total: 7 },
];

const TYPE_META_FR: { id: string; label: string; color: string }[] = [
  { id: 'decision',    label: '🎯 Décision',    color: '#3b82f6' },
  { id: 'calculation', label: '🔢 Calcul',       color: '#8b5cf6' },
  { id: 'reads',       label: '👁 Read',          color: '#22c55e' },
  { id: 'gto',         label: '🤖 GTO',           color: '#eab308' },
  { id: 'icm',         label: '💰 ICM',           color: '#f97316' },
];

const TYPE_META_EN: { id: string; label: string; color: string }[] = [
  { id: 'decision',    label: '🎯 Decision',    color: '#3b82f6' },
  { id: 'calculation', label: '🔢 Calculation', color: '#8b5cf6' },
  { id: 'reads',       label: '👁 Reading',      color: '#22c55e' },
  { id: 'gto',         label: '🤖 GTO',          color: '#eab308' },
  { id: 'icm',         label: '💰 ICM',          color: '#f97316' },
];

function XpChart({ history }: { history: XpDayRecord[] }) {
  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-gray-600 text-sm">
        {/* Translated in parent where locale is available */}
      </div>
    );
  }

  // Build a 30-day window
  const days = 30;
  const today = new Date();
  const dayMap = new Map<string, number>();
  history.forEach(h => dayMap.set(h.date, h.earned));

  const slots: { date: string; earned: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    slots.push({ date: key, earned: dayMap.get(key) ?? 0 });
  }

  const maxVal = Math.max(...slots.map(s => s.earned), 1);
  const chartH = 64;
  const barW = 8;
  const gap = 2;
  const totalW = slots.length * (barW + gap) - gap;

  return (
    <svg width="100%" viewBox={`0 0 ${totalW} ${chartH + 4}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {slots.map((slot, i) => {
        const h = slot.earned === 0 ? 2 : Math.max(4, (slot.earned / maxVal) * chartH);
        const x = i * (barW + gap);
        const y = chartH - h;
        const opacity = slot.earned === 0 ? 0.12 : 0.8;
        return (
          <rect key={slot.date} x={x} y={y} width={barW} height={h} rx={2}
            fill={slot.earned === 0 ? '#374151' : '#eab308'}
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}

export default function ProfilPage() {
  const locale = useLocale();
  const isEn = locale === 'en';
  const LEVELS = isEn ? LEVELS_EN : LEVELS_FR;
  const TYPE_META = isEn ? TYPE_META_EN : TYPE_META_FR;

  const { progress, getLevelProgress, resetProgress, isLevelUnlocked } = useProgress();
  const { history, streak, maxStreak, jokerAvailable, jokerApplied } = useDailyChallenge();
  const { typeStats, maxConsecutiveCorrect } = useChallengeStats();
  const [xpHistory, setXpHistory] = useState<XpDayRecord[]>([]);

  useEffect(() => {
    setXpHistory(loadXpHistory());
  }, []);

  const totalDefis = CHALLENGES.length;
  const completedDefis = history.filter(h => h.completed).length;
  const correctDefis = history.filter(h => h.correct).length;
  const successRate = completedDefis > 0 ? Math.round((correctDefis / completedDefis) * 100) : 0;
  const defiPct = Math.round((completedDefis / totalDefis) * 100);

  const totalCompleted = LEVELS.reduce((sum, l) => sum + getLevelProgress(l.id, l.total).completed, 0);
  const totalModules = LEVELS.reduce((sum, l) => sum + l.total, 0);

  const totalXp = progress.totalXp || 0;
  const currentTitle = getXpTitle(totalXp);
  const nextTitle = XP_TITLES.find(t => t.min > totalXp);
  const xpToNextTitle = nextTitle ? nextTitle.min - totalXp : 0;
  const titleProgress = nextTitle
    ? ((totalXp - currentTitle.min) / (nextTitle.min - currentTitle.min)) * 100
    : 100;

  const hasTypeStats = Object.keys(typeStats).length > 0;
  const totalAttempts = Object.values(typeStats).reduce((s, t) => s + t.total, 0);

  const completedLevelIds = LEVELS_FR.filter(l => {
    const prog = getLevelProgress(l.id, l.total);
    return prog.completed >= l.total && isLevelUnlocked(l.id);
  }).map(l => l.id);

  const totalCorrect = Object.values(typeStats).reduce((s, t) => s + t.correct, 0);

  const badgeData: BadgeData = {
    maxStreak,
    totalChallenges: totalAttempts,
    totalCorrect,
    totalXp,
    typeStats: typeStats as Record<string, { correct: number; total: number }>,
    completedLevels: completedLevelIds,
    maxConsecutiveCorrect,
    hasAnyChallenge: totalAttempts > 0,
    hasAnyDaily: completedDefis > 0,
    hasAnyLevel: completedLevelIds.length > 0,
  };

  const badgeResults = computeBadges(badgeData);
  const earnedCount = badgeResults.filter(b => b.earned).length;

  // Next badge targets
  const nextTargets = badgeResults
    .filter(b => !b.earned && ['ritualiste','grinder','main','faucon','justesse','specialiste'].includes(b.badge.series))
    .map(b => ({ badge: b.badge, prog: getBadgeProgress(b.badge, badgeData) }))
    .sort((a, b) => b.prog - a.prog)
    .slice(0, 4);

  // Weekly stats
  const weekDates = getWeekDates();
  const weekXp = xpHistory.filter(h => weekDates.includes(h.date)).reduce((s, h) => s + h.earned, 0);
  const weekDailyByDay = weekDates.map(d => history.some(h => h.date === d && h.completed));
  const weekDailyCount = weekDailyByDay.filter(Boolean).length;
  const DAY_LABELS_FR = ['L','M','M','J','V','S','D'];
  const DAY_LABELS_EN = ['M','T','W','T','F','S','S'];
  const dayLabels = isEn ? DAY_LABELS_EN : DAY_LABELS_FR;

  const groupedBadges = badgeResults.reduce((acc, b) => {
    if (!acc[b.badge.series]) acc[b.badge.series] = [];
    acc[b.badge.series].push(b);
    return acc;
  }, {} as Record<BadgeSeries, typeof badgeResults>);

  return (
    <div className="min-h-screen bg-[#0a0f0a]">

      <main id="main-content" className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center text-3xl mx-auto mb-4" aria-hidden="true">
            ♠
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
            {isEn ? 'My Progress' : 'Ma Progression'}
          </h1>

          <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5">
            <span className="text-yellow-400 font-bold">{totalCompleted}</span>
            <span className="text-gray-400 text-sm">/ {totalModules} {isEn ? 'modules completed' : 'modules terminés'}</span>
          </div>

          {/* XP & title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mt-5 w-full max-w-xs mx-auto"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg font-bold text-white">{currentTitle.emoji} {currentTitle.label}</span>
              <span className="text-yellow-400 font-bold text-sm">⚡ {totalXp.toLocaleString(isEn ? 'en-US' : 'fr-FR')} XP</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
                initial={{ width: 0 }}
                animate={{ width: `${titleProgress}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
            {nextTitle ? (
              <p className="text-gray-500 text-xs mt-1 text-right">{xpToNextTitle} XP {isEn ? 'until' : 'avant'} {nextTitle.emoji} {nextTitle.label}</p>
            ) : (
              <p className="text-yellow-400 text-xs mt-1 text-center font-medium">{isEn ? 'Maximum rank reached 👑' : 'Rang maximum atteint 👑'}</p>
            )}
          </motion.div>
        </motion.div>

        {/* XP over 30 days */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white text-sm">{isEn ? 'XP earned (last 30 days)' : 'XP gagnée (30 derniers jours)'}</h2>
            {xpHistory.length > 0 && (
              <span className="text-yellow-400 text-xs font-medium">
                +{xpHistory.slice(-30).reduce((s, d) => s + d.earned, 0).toLocaleString(isEn ? 'en-US' : 'fr-FR')} XP
              </span>
            )}
          </div>
          {xpHistory.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-gray-600 text-sm">
              {isEn ? 'Complete challenges to see your progress' : 'Complète des défis pour voir ta progression'}
            </div>
          ) : (
            <XpChart history={xpHistory} />
          )}
          <div className="flex justify-between text-gray-600 text-xs mt-1">
            <span>{isEn ? '30 days ago' : 'il y a 30j'}</span>
            <span>{isEn ? 'today' : "aujourd'hui"}</span>
          </div>
        </motion.div>

        {/* Global progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{isEn ? 'Overall progress' : 'Progression globale'}</span>
            <span>{Math.round((totalCompleted / totalModules) * 100)}%</span>
          </div>
          <div
            className="h-2 bg-white/10 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round((totalCompleted / totalModules) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={isEn ? 'Overall progress' : 'Progression globale'}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${(totalCompleted / totalModules) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Level progress */}
        <div className="space-y-3 mb-8">
          {LEVELS.map((level, i) => {
            const prog = getLevelProgress(level.id, level.total);
            const unlocked = isLevelUnlocked(level.id);

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">{level.emoji}</span>
                    <span className={`font-semibold text-sm ${level.color}`}>{level.label}</span>
                    {!unlocked && <span className="text-xs text-gray-500">🔒 {isEn ? 'Locked' : 'Verrouillé'}</span>}
                    {prog.completed === prog.total && unlocked && (
                      <span className="text-xs text-green-400 font-medium">✓ {isEn ? 'Done' : 'Terminé'}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {prog.completed}/{prog.total} {isEn ? 'modules' : 'modules'}
                  </span>
                </div>
                <div
                  className="h-1.5 bg-white/10 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={prog.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${isEn ? 'Progress' : 'Progression'} ${level.label}`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${prog.percentage}%`, background: unlocked ? '#eab308' : '#374151' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Daily challenges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">{isEn ? 'Daily challenges' : 'Défis quotidiens'}</h2>
            <Link href="/defis" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">{isEn ? 'See challenges →' : 'Voir les défis →'}</Link>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-400">{streak}</div>
              <div className="text-gray-500 text-xs mt-0.5">🔥 Streak</div>
              {jokerApplied && (
                <div className="text-[10px] text-cyan-400 mt-1" title={isEn ? 'Monthly joker used, streak protected' : 'Joker mensuel utilisé, streak protégé'}>
                  🛡 {isEn ? 'protected' : 'protégé'}
                </div>
              )}
              {jokerAvailable && !jokerApplied && (
                <div className="text-[10px] text-cyan-500/60 mt-1" title={isEn ? '1 joker available this month' : '1 joker disponible ce mois'}>
                  🛡
                </div>
              )}
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-white">{completedDefis}</div>
              <div className="text-gray-500 text-xs mt-0.5">{isEn ? 'completed' : 'complétés'}</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-green-400">{successRate}%</div>
              <div className="text-gray-500 text-xs mt-0.5">{isEn ? 'success rate' : 'réussite'}</div>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{completedDefis}/{totalDefis} {isEn ? 'challenges explored' : 'défis explorés'}</span>
            <span>{defiPct}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400"
              initial={{ width: 0 }}
              animate={{ width: `${defiPct}%` }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Cette semaine */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6"
        >
          <h2 className="font-bold text-white text-sm mb-4">{isEn ? 'This week' : 'Cette semaine'}</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">+{weekXp.toLocaleString(isEn ? 'en-US' : 'fr-FR')}</div>
              <div className="text-gray-500 text-xs">XP {isEn ? 'earned' : 'gagnée'}</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{weekDailyCount}<span className="text-gray-600 text-sm">/7</span></div>
              <div className="text-gray-500 text-xs">{isEn ? 'daily done' : 'défis du jour'}</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-400">{streak} 🔥</div>
              <div className="text-gray-500 text-xs">Streak</div>
            </div>
          </div>
          <div className="flex gap-1.5">
            {weekDailyByDay.map((done, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-full transition-all"
                  style={{
                    height: 6,
                    background: done ? '#f97316' : 'rgba(255,255,255,0.08)',
                    boxShadow: done ? '0 0 6px rgba(249,115,22,0.4)' : 'none',
                  }}
                />
                <span className="text-[9px] text-gray-600">{dayLabels[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats by type */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">{isEn ? 'Stats by type' : 'Statistiques par type'}</h2>
            {hasTypeStats && (
              <span className="text-gray-500 text-xs">{totalAttempts} {isEn ? (totalAttempts > 1 ? 'attempts' : 'attempt') : ('tentative' + (totalAttempts > 1 ? 's' : ''))}</span>
            )}
          </div>

          {!hasTypeStats ? (
            <p className="text-gray-600 text-sm text-center py-4">{isEn ? 'Complete challenges to see your stats by type' : 'Complète des défis pour voir tes stats par type'}</p>
          ) : (
            <div className="space-y-3">
              {TYPE_META.map(meta => {
                const stat: TypeStat | undefined = typeStats[meta.id];
                const rate = stat && stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;
                return (
                  <div key={meta.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">{meta.label}</span>
                      <span className="text-xs text-gray-500">
                        {stat ? `${stat.correct}/${stat.total}` : '—'}
                        {rate !== null && (
                          <span className="ml-1.5 font-medium" style={{ color: rate >= 70 ? '#4ade80' : rate >= 40 ? '#fbbf24' : '#f87171' }}>
                            {rate}%
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: stat ? meta.color : 'transparent' }}
                        initial={{ width: 0 }}
                        animate={{ width: rate !== null ? `${rate}%` : '0%' }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-white">{isEn ? 'Badges' : 'Badges'}</h2>
            <span className="text-gray-500 text-xs">{earnedCount} / {badgeResults.length}</span>
          </div>

          <div className="space-y-8">
            {BADGE_SERIES_ORDER.map(seriesKey => {
              const entries = groupedBadges[seriesKey];
              if (!entries?.length) return null;
              const meta = BADGE_SERIES_META[seriesKey];
              const seriesEarned = entries.filter(e => e.earned).length;
              return (
                <div key={seriesKey}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${meta.color}40, transparent)` }} />
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: meta.color }}>
                      {isEn ? meta.label : meta.labelFr}
                    </span>
                    <span className="text-gray-600 text-[10px]">{seriesEarned}/{entries.length}</span>
                    <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${meta.color}40, transparent)` }} />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {entries.map(({ badge, earned }) => (
                      <BadgeChip key={badge.id} badge={badge} earned={earned} isEn={isEn} size={76} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Dans le viseur */}
        {nextTargets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6"
          >
            <h2 className="font-bold text-white text-sm mb-4">
              {isEn ? 'In the crosshairs' : 'Dans le viseur'}
            </h2>
            <div className="space-y-4">
              {nextTargets.map(({ badge, prog }) => (
                <div key={badge.id} className="flex items-center gap-3">
                  <BadgeChip badge={badge} earned={false} isEn={isEn} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-gray-200 truncate">
                        {isEn ? badge.nameEn : badge.nameFr}
                      </span>
                      <span className="text-[10px] text-gray-500 ml-2 shrink-0">
                        {getBadgeHint(badge, badgeData, isEn)}
                      </span>
                    </div>
                    <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: badge.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${prog * 100}%` }}
                        transition={{ duration: 0.9, delay: 0.9 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reset */}
        <button
          onClick={() => {
            if (confirm(isEn
              ? 'Reset all your progress? This action is irreversible.'
              : 'Réinitialiser toute votre progression ? Cette action est irréversible.')) {
              resetProgress();
            }
          }}
          className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
        >
          {isEn ? 'Reset progress' : 'Réinitialiser la progression'}
        </button>
      </main>
    </div>
  );
}
