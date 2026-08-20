'use client';

import { useState, useEffect, useCallback } from 'react';
import { useProgress } from './useProgress';
import { Challenge, selectDailyChallenge, getUserLevel } from '@/lib/challenges-data';

const LOCAL_KEY = 'poker-daily-challenges';

interface DayRecord {
  date: string;
  challengeId: string;
  completed: boolean;
  correct: boolean | null;
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function loadHistory(): DayRecord[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); }
  catch { return []; }
}

function saveHistory(h: DayRecord[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(h.slice(-90))); } catch {}
}

function computeStreak(history: DayRecord[]): number {
  const done = history.filter(h => h.completed).map(h => h.date).sort().reverse();
  if (!done.length) return 0;
  let streak = 0;
  const today = getToday();
  const cursor = new Date(today);
  for (const dateStr of done) {
    const expected = cursor.toISOString().split('T')[0];
    if (dateStr === expected) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}

export function useDailyChallenge() {
  const { progress } = useProgress();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<DayRecord[]>([]);

  useEffect(() => {
    const today = getToday();
    const h = loadHistory();
    setHistory(h);
    const todayRecord = h.find(r => r.date === today);
    const completedIds = h.filter(r => r.completed).map(r => r.challengeId);
    const level = getUserLevel(progress.completedLevels);

    const picked = selectDailyChallenge(level, completedIds, 'anonymous', today);
    setChallenge(picked);
    setStreak(computeStreak(h));

    if (todayRecord?.completed) {
      setIsCompleted(true);
      setWasCorrect(todayRecord.correct);
    }
  }, [progress.completedLevels]);

  const completeChallenge = useCallback((correct: boolean) => {
    if (!challenge) return;
    const today = getToday();
    const prev = loadHistory().filter(h => h.date !== today);
    const newRecord: DayRecord = { date: today, challengeId: challenge.id, completed: true, correct };
    const next = [...prev, newRecord];
    saveHistory(next);
    setHistory(next);
    setIsCompleted(true);
    setWasCorrect(correct);
    setStreak(computeStreak(next));
  }, [challenge]);

  return { challenge, isCompleted, wasCorrect, streak, loading: false, completeChallenge, history };
}
