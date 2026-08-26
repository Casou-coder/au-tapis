'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Challenge } from '@/lib/challenges-data';
import { supabase } from '@/lib/supabase';

const FAILED_KEY = 'poker-failed-challenges';
const STATS_KEY  = 'poker-type-stats';
const CONSEC_KEY = 'poker-consecutive';

export interface TypeStat {
  type: string;
  correct: number;
  total: number;
}

interface ConsecData { current: number; max: number }

interface RemoteStats {
  type_stats:          Record<string, TypeStat>;
  failed_ids:          string[];
  consecutive_current: number;
  consecutive_max:     number;
}

// ── localStorage helpers ────────────────────────────────────────────────────

function loadFailed(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(FAILED_KEY) || '[]'); }
  catch { return []; }
}
function saveFailed(ids: string[]) {
  try { localStorage.setItem(FAILED_KEY, JSON.stringify(ids)); } catch {}
}

function loadTypeStats(): Record<string, TypeStat> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{}'); }
  catch { return {}; }
}
function saveTypeStats(stats: Record<string, TypeStat>) {
  try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); } catch {}
}

function loadConsec(): ConsecData {
  if (typeof window === 'undefined') return { current: 0, max: 0 };
  try { return JSON.parse(localStorage.getItem(CONSEC_KEY) || '{"current":0,"max":0}'); }
  catch { return { current: 0, max: 0 }; }
}
function saveConsec(d: ConsecData) {
  try { localStorage.setItem(CONSEC_KEY, JSON.stringify(d)); } catch {}
}

function loadLocalAll(): RemoteStats {
  return {
    type_stats:          loadTypeStats(),
    failed_ids:          loadFailed(),
    consecutive_current: loadConsec().current,
    consecutive_max:     loadConsec().max,
  };
}

function saveLocalAll(s: RemoteStats) {
  saveTypeStats(s.type_stats);
  saveFailed(s.failed_ids);
  saveConsec({ current: s.consecutive_current, max: s.consecutive_max });
}

// ── merge two stat snapshots ─────────────────────────────────────────────────

function mergeStats(a: RemoteStats, b: RemoteStats): RemoteStats {
  const allTypes = new Set([...Object.keys(a.type_stats), ...Object.keys(b.type_stats)]);
  const type_stats: Record<string, TypeStat> = {};
  for (const t of allTypes) {
    const sa = a.type_stats[t] ?? { type: t, correct: 0, total: 0 };
    const sb = b.type_stats[t] ?? { type: t, correct: 0, total: 0 };
    type_stats[t] = { type: t, correct: Math.max(sa.correct, sb.correct), total: Math.max(sa.total, sb.total) };
  }
  const failed_ids = [...new Set([...a.failed_ids, ...b.failed_ids])];
  return {
    type_stats,
    failed_ids,
    consecutive_current: Math.max(a.consecutive_current, b.consecutive_current),
    consecutive_max:     Math.max(a.consecutive_max, b.consecutive_max),
  };
}

// ── Supabase helpers ─────────────────────────────────────────────────────────

async function fetchRemoteStats(userId: string): Promise<RemoteStats> {
  const { data } = await supabase
    .from('user_challenge_stats')
    .select('type_stats, failed_ids, consecutive_current, consecutive_max')
    .eq('user_id', userId)
    .single();
  if (!data) return { type_stats: {}, failed_ids: [], consecutive_current: 0, consecutive_max: 0 };
  return {
    type_stats:          (data.type_stats as Record<string, TypeStat>) ?? {},
    failed_ids:          (data.failed_ids as string[]) ?? [],
    consecutive_current: data.consecutive_current ?? 0,
    consecutive_max:     data.consecutive_max ?? 0,
  };
}

async function saveRemoteStats(userId: string, s: RemoteStats) {
  await supabase
    .from('user_challenge_stats')
    .upsert({
      user_id:             userId,
      type_stats:          s.type_stats,
      failed_ids:          s.failed_ids,
      consecutive_current: s.consecutive_current,
      consecutive_max:     s.consecutive_max,
      updated_at:          new Date().toISOString(),
    });
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useChallengeStats() {
  const [failedIds, setFailedIds] = useState<string[]>([]);
  const [typeStats, setTypeStats] = useState<Record<string, TypeStat>>({});
  const [maxConsecutiveCorrect, setMaxConsecutiveCorrect] = useState(0);
  const userIdRef = useRef<string | null>(null);

  function applyStats(s: RemoteStats) {
    setTypeStats(s.type_stats);
    setFailedIds(s.failed_ids);
    setMaxConsecutiveCorrect(s.consecutive_max);
  }

  useEffect(() => {
    applyStats(loadLocalAll());

    async function syncOnLogin(userId: string) {
      userIdRef.current = userId;
      const local = loadLocalAll();
      const remote = await fetchRemoteStats(userId);
      const merged = mergeStats(local, remote);
      saveLocalAll(merged);
      applyStats(merged);
      await saveRemoteStats(userId, merged);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) syncOnLogin(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) syncOnLogin(session.user.id);
      else if (event === 'SIGNED_OUT') userIdRef.current = null;
    });

    return () => subscription.unsubscribe();
  }, []);

  const recordAttempt = useCallback((challenge: Challenge, correct: boolean) => {
    // Update type stats
    setTypeStats(prev => {
      const cur = prev[challenge.type] ?? { type: challenge.type, correct: 0, total: 0 };
      const next = {
        ...prev,
        [challenge.type]: { type: challenge.type, correct: cur.correct + (correct ? 1 : 0), total: cur.total + 1 },
      };
      saveTypeStats(next);
      if (userIdRef.current) {
        const full = loadLocalAll();
        saveRemoteStats(userIdRef.current, { ...full, type_stats: next });
      }
      return next;
    });

    // Update consecutive streak
    setMaxConsecutiveCorrect(prevMax => {
      const consec = loadConsec();
      const nextCurrent = correct ? consec.current + 1 : 0;
      const nextMax = Math.max(consec.max, nextCurrent);
      saveConsec({ current: nextCurrent, max: nextMax });
      if (userIdRef.current) {
        const full = loadLocalAll();
        saveRemoteStats(userIdRef.current, { ...full, consecutive_current: nextCurrent, consecutive_max: nextMax });
      }
      return nextMax;
    });

    // Update failed ids
    if (!correct) {
      setFailedIds(prev => {
        if (prev.includes(challenge.id)) return prev;
        const next = [...prev, challenge.id];
        saveFailed(next);
        if (userIdRef.current) {
          const full = loadLocalAll();
          saveRemoteStats(userIdRef.current, { ...full, failed_ids: next });
        }
        return next;
      });
    } else {
      setFailedIds(prev => {
        if (!prev.includes(challenge.id)) return prev;
        const next = prev.filter(id => id !== challenge.id);
        saveFailed(next);
        if (userIdRef.current) {
          const full = loadLocalAll();
          saveRemoteStats(userIdRef.current, { ...full, failed_ids: next });
        }
        return next;
      });
    }
  }, []);

  return { failedIds, typeStats, maxConsecutiveCorrect, recordAttempt };
}
