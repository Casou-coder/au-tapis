'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  streak: number;
  weekly_xp: number;
  hard_correct: number;
  hard_total: number;
  hard_accuracy: number;
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return monday.toISOString().split('T')[0];
}

function toDisplayName(email: string): string {
  return email.split('@')[0].slice(0, 14);
}

function toEntry(row: Record<string, unknown>): LeaderboardEntry {
  const hardTotal = Number(row.hard_total) || 0;
  const hardCorrect = Number(row.hard_correct) || 0;
  return {
    user_id: String(row.user_id),
    display_name: String(row.display_name),
    streak: Number(row.streak) || 0,
    weekly_xp: Number(row.weekly_xp) || 0,
    hard_correct: hardCorrect,
    hard_total: hardTotal,
    hard_accuracy: hardTotal >= 5 ? Math.round((hardCorrect / hardTotal) * 100) : 0,
  };
}

export function useLeaderboard() {
  const [streakBoard, setStreakBoard] = useState<LeaderboardEntry[]>([]);
  const [weeklyXpBoard, setWeeklyXpBoard] = useState<LeaderboardEntry[]>([]);
  const [hardBoard, setHardBoard] = useState<LeaderboardEntry[]>([]);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const [streakRes, weeklyRes, hardRes] = await Promise.all([
      supabase.from('leaderboard').select('*').order('streak', { ascending: false }).limit(10),
      supabase.from('leaderboard').select('*').order('weekly_xp', { ascending: false }).limit(10),
      supabase.from('leaderboard').select('*').gte('hard_total', 5).limit(100),
    ]);

    setStreakBoard((streakRes.data ?? []).map(toEntry));
    setWeeklyXpBoard((weeklyRes.data ?? []).map(toEntry));

    const hardSorted = (hardRes.data ?? [])
      .map(toEntry)
      .sort((a, b) => b.hard_accuracy - a.hard_accuracy)
      .slice(0, 10);
    setHardBoard(hardSorted);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setMyUserId(session?.user?.id ?? null);
    });
    fetchAll();
  }, [fetchAll]);

  const sync = useCallback(async ({
    streak,
    weeklyXp,
    hardCorrect,
    hardTotal,
  }: {
    streak: number;
    weeklyXp: number;
    hardCorrect: number;
    hardTotal: number;
  }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    await supabase.from('leaderboard').upsert({
      user_id: session.user.id,
      display_name: toDisplayName(session.user.email ?? 'joueur'),
      streak,
      weekly_xp: weeklyXp,
      week_start: getWeekStart(),
      hard_correct: hardCorrect,
      hard_total: hardTotal,
      updated_at: new Date().toISOString(),
    });

    await fetchAll();
  }, [fetchAll]);

  return { streakBoard, weeklyXpBoard, hardBoard, myUserId, loading, sync };
}
