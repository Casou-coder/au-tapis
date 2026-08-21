'use client';

import { useState, useEffect, useCallback } from 'react';
import { Challenge } from '@/lib/challenges-data';

const FAILED_KEY = 'poker-failed-challenges';
const STATS_KEY = 'poker-type-stats';

export interface TypeStat {
  type: string;
  correct: number;
  total: number;
}

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

export function useChallengeStats() {
  const [failedIds, setFailedIds] = useState<string[]>([]);
  const [typeStats, setTypeStats] = useState<Record<string, TypeStat>>({});

  useEffect(() => {
    setFailedIds(loadFailed());
    setTypeStats(loadTypeStats());
  }, []);

  const recordAttempt = useCallback((challenge: Challenge, correct: boolean) => {
    setTypeStats(prev => {
      const current = prev[challenge.type] ?? { type: challenge.type, correct: 0, total: 0 };
      const next = {
        ...prev,
        [challenge.type]: { type: challenge.type, correct: current.correct + (correct ? 1 : 0), total: current.total + 1 },
      };
      saveTypeStats(next);
      return next;
    });

    if (!correct) {
      setFailedIds(prev => {
        if (prev.includes(challenge.id)) return prev;
        const next = [...prev, challenge.id];
        saveFailed(next);
        return next;
      });
    } else {
      setFailedIds(prev => {
        if (!prev.includes(challenge.id)) return prev;
        const next = prev.filter(id => id !== challenge.id);
        saveFailed(next);
        return next;
      });
    }
  }, []);

  return { failedIds, typeStats, recordAttempt };
}
