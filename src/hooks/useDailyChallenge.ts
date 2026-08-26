'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useProgress } from './useProgress';
import { Challenge, ChallengeLevel, selectDailyChallenge, getUserLevel } from '@/lib/challenges-data';
import { supabase } from '@/lib/supabase';

const LOCAL_KEY  = 'poker-daily-challenges';
const JOKER_KEY  = 'poker-streak-joker';

interface DayRecord {
  date: string;
  challengeId: string;
  completed: boolean;
  correct: boolean | null;
  joker?: boolean;
}

interface JokerState { month: string; used: boolean; usedDate: string | null }

function getToday() { return new Date().toISOString().split('T')[0]; }
function getCurrentMonth() { return new Date().toISOString().slice(0, 7); }

function offsetDay(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// ── localStorage ─────────────────────────────────────────────────────────────

function loadHistory(): DayRecord[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); }
  catch { return []; }
}
function saveHistory(h: DayRecord[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(h.slice(-90))); } catch {}
}

function loadJoker(): JokerState {
  const month = getCurrentMonth();
  if (typeof window === 'undefined') return { month, used: false, usedDate: null };
  try {
    const s = JSON.parse(localStorage.getItem(JOKER_KEY) || 'null') as JokerState | null;
    if (!s || s.month !== month) return { month, used: false, usedDate: null };
    return s;
  } catch { return { month: getCurrentMonth(), used: false, usedDate: null }; }
}
function saveJoker(s: JokerState) {
  try { localStorage.setItem(JOKER_KEY, JSON.stringify(s)); } catch {}
}

// ── merge ─────────────────────────────────────────────────────────────────────

function mergeHistories(a: DayRecord[], b: DayRecord[]): DayRecord[] {
  const map = new Map<string, DayRecord>();
  for (const r of [...a, ...b]) {
    const existing = map.get(r.date);
    if (!existing || (!existing.completed && r.completed)) map.set(r.date, r);
  }
  return Array.from(map.values()).sort((x, y) => x.date.localeCompare(y.date));
}

// ── streak computation ────────────────────────────────────────────────────────
// Streak counts today if done, otherwise counts up to yesterday (so the number
// doesn't reset to 0 before you've had a chance to complete today's challenge).

function computeStreak(history: DayRecord[]): number {
  const done = history.filter(h => h.completed).map(h => h.date).sort().reverse();
  if (!done.length) return 0;
  const today = getToday();
  const todayDone = done[0] === today;
  const cursor = new Date(today);
  if (!todayDone) cursor.setDate(cursor.getDate() - 1); // start from yesterday
  let streak = 0;
  for (const dateStr of done) {
    const expected = cursor.toISOString().split('T')[0];
    if (dateStr === expected) { streak++; cursor.setDate(cursor.getDate() - 1); }
    else break;
  }
  return streak;
}

function computeMaxStreak(history: DayRecord[]): number {
  const done = history.filter(h => h.completed).map(h => h.date).sort();
  if (!done.length) return 0;
  let max = 1; let cur = 1;
  for (let i = 1; i < done.length; i++) {
    const diff = (new Date(done[i]).getTime() - new Date(done[i - 1]).getTime()) / 86400000;
    if (diff === 1) { cur++; if (cur > max) max = cur; }
    else if (diff > 1) cur = 1;
  }
  return max;
}

// ── joker ────────────────────────────────────────────────────────────────────
// Auto-applies when: joker unused this month, yesterday was missed, and the
// day before yesterday was completed (there was an active streak to protect).

function tryAutoJoker(history: DayRecord[]): { history: DayRecord[]; jokerApplied: boolean } {
  const joker = loadJoker();
  if (joker.used) return { history, jokerApplied: false };

  const yesterday      = offsetDay(-1);
  const dayBeforeYest  = offsetDay(-2);

  const yesterdayDone  = history.some(h => h.date === yesterday     && h.completed);
  const dayBeforeDone  = history.some(h => h.date === dayBeforeYest && h.completed);

  if (!yesterdayDone && dayBeforeDone) {
    const jokerRecord: DayRecord = {
      date: yesterday, challengeId: 'joker', completed: true, correct: null, joker: true,
    };
    const next = [...history.filter(h => h.date !== yesterday), jokerRecord]
      .sort((a, b) => a.date.localeCompare(b.date));
    saveJoker({ month: joker.month, used: true, usedDate: yesterday });
    return { history: next, jokerApplied: true };
  }
  return { history, jokerApplied: false };
}

// ── Supabase ──────────────────────────────────────────────────────────────────

async function fetchRemoteHistory(userId: string): Promise<DayRecord[]> {
  const { data } = await supabase
    .from('user_daily_history').select('history').eq('user_id', userId).single();
  return (data?.history as DayRecord[]) ?? [];
}
async function saveRemoteHistory(userId: string, history: DayRecord[]) {
  await supabase.from('user_daily_history').upsert({
    user_id: userId, history: history.slice(-90), updated_at: new Date().toISOString(),
  });
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDailyChallenge() {
  const { progress } = useProgress();
  const [challenge, setChallenge]   = useState<Challenge | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wasCorrect, setWasCorrect]   = useState<boolean | null>(null);
  const [streak, setStreak]           = useState(0);
  const [maxStreak, setMaxStreak]     = useState(0);
  const [history, setHistory]         = useState<DayRecord[]>([]);
  const [jokerAvailable, setJokerAvailable] = useState(false);
  const [jokerApplied, setJokerApplied]     = useState(false);
  const userIdRef = useRef<string | null>(null);

  function applyHistory(raw: DayRecord[], levelParam?: ChallengeLevel) {
    const { history: h, jokerApplied: applied } = tryAutoJoker(raw);
    const today = getToday();
    const level = levelParam ?? getUserLevel(progress.completedLevels);
    const completedIds = h.filter(r => r.completed).map(r => r.challengeId);
    const picked = selectDailyChallenge(level, completedIds, 'anonymous', today);
    setChallenge(picked);
    setStreak(computeStreak(h));
    setMaxStreak(computeMaxStreak(h));
    setHistory(h);
    setJokerApplied(applied);
    setJokerAvailable(!loadJoker().used);
    const todayRecord = h.find(r => r.date === today);
    if (todayRecord?.completed) {
      setIsCompleted(true);
      setWasCorrect(todayRecord.correct);
    }
  }

  useEffect(() => {
    applyHistory(loadHistory());

    async function syncOnLogin(userId: string) {
      userIdRef.current = userId;
      const localH  = loadHistory();
      const remoteH = await fetchRemoteHistory(userId);
      const merged  = mergeHistories(localH, remoteH);
      saveHistory(merged);
      applyHistory(merged);
      await saveRemoteHistory(userId, merged);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) syncOnLogin(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) syncOnLogin(session.user.id);
      else if (event === 'SIGNED_OUT') userIdRef.current = null;
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.completedLevels]);

  const completeChallenge = useCallback((correct: boolean) => {
    if (!challenge) return;
    const today = getToday();
    const prev  = loadHistory().filter(h => h.date !== today);
    const newRecord: DayRecord = { date: today, challengeId: challenge.id, completed: true, correct };
    const next  = [...prev, newRecord];
    saveHistory(next);
    setHistory(next);
    setIsCompleted(true);
    setWasCorrect(correct);
    setStreak(computeStreak(next));
    setMaxStreak(computeMaxStreak(next));
    if (userIdRef.current) saveRemoteHistory(userIdRef.current, next);
  }, [challenge]);

  return {
    challenge, isCompleted, wasCorrect, streak, maxStreak,
    jokerAvailable, jokerApplied,
    loading: false, completeChallenge, history,
  };
}
