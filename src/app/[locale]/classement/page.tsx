'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Target, Trophy, Medal, Lock } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useLeaderboard, LeaderboardEntry } from '@/hooks/useLeaderboard';
import { useProgress } from '@/hooks/useProgress';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { CHALLENGES } from '@/lib/challenges-data';
import Link from 'next/link';

type Tab = 'streak' | 'weekly' | 'hard';

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: MEDAL_COLORS[rank - 1] + '20', color: MEDAL_COLORS[rank - 1], border: `1px solid ${MEDAL_COLORS[rank - 1]}40` }}
      >
        {rank <= 3 ? <Medal size={14} /> : rank}
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 shrink-0"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {rank}
    </div>
  );
}

function EntryRow({
  entry,
  rank,
  isMe,
  tab,
  isEn,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isMe: boolean;
  tab: Tab;
  isEn: boolean;
}) {
  const value = tab === 'streak'
    ? `${entry.streak} ${isEn ? (entry.streak > 1 ? 'days' : 'day') : ('jour' + (entry.streak > 1 ? 's' : ''))}`
    : tab === 'weekly'
    ? `${entry.weekly_xp} XP`
    : `${entry.hard_accuracy}%`;

  const subValue = tab === 'hard'
    ? `${entry.hard_correct}/${entry.hard_total} ${isEn ? 'correct' : 'correctes'}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.04 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
      style={{
        background: isMe
          ? 'rgba(202,163,60,0.08)'
          : rank <= 3
          ? `rgba(255,255,255,0.04)`
          : 'rgba(255,255,255,0.02)',
        border: isMe
          ? '1px solid rgba(202,163,60,0.3)'
          : rank <= 3
          ? `1px solid ${MEDAL_COLORS[rank - 1]}20`
          : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <RankBadge rank={rank} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: isMe ? '#c9a84c' : 'white' }}>
          {entry.display_name}
          {isMe && <span className="ml-2 text-xs text-yellow-500/60">{isEn ? '(you)' : '(vous)'}</span>}
        </p>
        {subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold" style={{ color: rank === 1 ? '#FFD700' : isMe ? '#c9a84c' : '#e8f5e9' }}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function EmptyState({ tab, isEn }: { tab: Tab; isEn: boolean }) {
  return (
    <div className="text-center py-12 text-gray-500">
      <p className="text-4xl mb-3">
        {tab === 'streak' ? '🔥' : tab === 'weekly' ? '⚡' : '🎯'}
      </p>
      <p className="text-sm">
        {tab === 'hard'
          ? (isEn
              ? 'Not enough data yet. Complete 5 hard challenges to appear here.'
              : 'Pas encore assez de données. Complétez 5 défis difficiles pour apparaître ici.')
          : (isEn
              ? 'No ranked players yet. Be the first!'
              : "Aucun joueur classé pour l'instant. Soyez le premier !")}
      </p>
    </div>
  );
}

export default function ClassementPage() {
  const locale = useLocale();
  const isEn = locale === 'en';

  const TABS: { id: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'streak', label: isEn ? 'Streak' : 'Série', icon: <Flame size={16} />, desc: isEn ? 'Consecutive days of completed challenges' : 'Jours consécutifs de défis complétés' },
    { id: 'weekly', label: isEn ? 'Weekly XP' : 'XP Semaine', icon: <Zap size={16} />, desc: isEn ? 'XP accumulated since Monday' : 'XP accumulés depuis lundi' },
    { id: 'hard', label: isEn ? 'Accuracy' : 'Précision', icon: <Target size={16} />, desc: isEn ? 'Success rate on hard questions (min. 5 attempted)' : 'Taux de réussite sur questions difficiles (min. 5 tentées)' },
  ];

  const [tab, setTab] = useState<Tab>('streak');
  const { streakBoard, weeklyXpBoard, hardBoard, myUserId, loading, sync } = useLeaderboard();
  const { progress } = useProgress();
  const { streak, history } = useDailyChallenge();

  // Sync user data on mount (once)
  useEffect(() => {
    if (!myUserId) return;
    const hardHistory = history.filter(h => {
      const c = CHALLENGES.find(ch => ch.id === h.challengeId);
      return c?.difficulty === 3;
    });
    sync({
      streak,
      weeklyXp: progress.weeklyXp || 0,
      hardCorrect: hardHistory.filter(h => h.correct).length,
      hardTotal: hardHistory.length,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserId]);

  const boards: Record<Tab, LeaderboardEntry[]> = {
    streak: streakBoard,
    weekly: weeklyXpBoard,
    hard: hardBoard,
  };

  const current = boards[tab];
  const activeTab = TABS.find(t => t.id === tab)!;

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <main className="max-w-2xl mx-auto px-4 pt-28 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(202,163,60,0.12)', border: '1px solid rgba(202,163,60,0.2)' }}>
              <Trophy size={20} className="text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              {isEn ? 'Leaderboard' : 'Classement'}
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            {isEn
              ? 'The best players of the week. Reset every Monday.'
              : 'Les meilleurs joueurs de la semaine. Réinitialisé chaque lundi.'}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: tab === t.id ? 'rgba(202,163,60,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${tab === t.id ? 'rgba(202,163,60,0.35)' : 'rgba(255,255,255,0.08)'}`,
                color: tab === t.id ? '#c9a84c' : '#6b7280',
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-500 text-xs mb-4">{activeTab.desc}</p>

        {/* Board */}
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))
          ) : current.length === 0 ? (
            <EmptyState tab={tab} isEn={isEn} />
          ) : (
            current.map((entry, i) => (
              <EntryRow
                key={entry.user_id}
                entry={entry}
                rank={i + 1}
                isMe={entry.user_id === myUserId}
                tab={tab}
                isEn={isEn}
              />
            ))
          )}
        </div>

        {/* CTA if not logged in */}
        {!myUserId && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 rounded-xl p-5 text-center"
            style={{ background: 'rgba(202,163,60,0.06)', border: '1px solid rgba(202,163,60,0.15)' }}
          >
            <Lock size={20} className="text-yellow-500/60 mx-auto mb-2" />
            <p className="text-sm text-gray-400 mb-3">
              {isEn
                ? 'Log in to appear on the leaderboard and track your progress.'
                : 'Connectez-vous pour apparaître dans le classement et suivre votre progression.'}
            </p>
            <Link
              href="/auth"
              className="inline-block px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold transition-all"
            >
              {isEn ? 'Log in' : 'Se connecter'}
            </Link>
          </motion.div>
        )}

        {/* Weekly info */}
        <p className="text-center text-gray-600 text-xs mt-8">
          {isEn
            ? 'Weekly XP reset every Monday · Accuracy calculated over the last 90 days'
            : 'XP Semaine remis à zéro chaque lundi · Précision calculée sur les 90 derniers jours'}
        </p>
      </main>
    </div>
  );
}
