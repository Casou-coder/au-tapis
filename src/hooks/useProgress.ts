'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface ProgressData {
  completedModules: Record<string, boolean>;
  completedLevels: Record<string, boolean>;
  quizScores: Record<string, number>;
  totalXp: number;
}

const STORAGE_KEY = 'poker-academy-progress';
const defaultProgress: ProgressData = { completedModules: {}, completedLevels: {}, quizScores: {}, totalXp: 0 };

export const XP_TITLES = [
  { min: 0,    max: 299,        label: 'Poisson',  emoji: '🐟' },
  { min: 300,  max: 799,        label: 'Initié',   emoji: '🎯' },
  { min: 800,  max: 1999,       label: 'Régulier', emoji: '🃏' },
  { min: 2000, max: 3999,       label: 'Semi-Pro', emoji: '🚀' },
  { min: 4000, max: 7999,       label: 'Expert',   emoji: '💎' },
  { min: 8000, max: Infinity,   label: 'Légende',  emoji: '👑' },
];

export function getXpTitle(xp: number) {
  return XP_TITLES.find(t => xp >= t.min && xp <= t.max) ?? XP_TITLES[0];
}

function loadLocal(): ProgressData {
  if (typeof window === 'undefined') return defaultProgress;
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') ?? defaultProgress; }
  catch { return defaultProgress; }
}

function saveLocal(data: ProgressData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function mergeProgress(a: ProgressData, b: ProgressData): ProgressData {
  const quizKeys = [...new Set([...Object.keys(a.quizScores ?? {}), ...Object.keys(b.quizScores ?? {})])];
  return {
    completedModules: { ...a.completedModules, ...b.completedModules },
    completedLevels:  { ...a.completedLevels,  ...b.completedLevels  },
    quizScores: Object.fromEntries(
      quizKeys.map(k => [k, Math.max(a.quizScores?.[k] ?? 0, b.quizScores?.[k] ?? 0)])
    ),
    totalXp: Math.max(a.totalXp || 0, b.totalXp || 0),
  };
}

async function fetchRemote(userId: string): Promise<ProgressData> {
  const { data } = await supabase
    .from('user_progress')
    .select('data')
    .eq('user_id', userId)
    .single();
  return (data?.data as ProgressData) ?? defaultProgress;
}

async function saveRemote(userId: string, progressData: ProgressData) {
  await supabase
    .from('user_progress')
    .upsert({ user_id: userId, data: progressData, updated_at: new Date().toISOString() });
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);
  const userIdRef = useRef<string | null>(null);

  // Save helper: local + remote if logged in
  const persist = useCallback((next: ProgressData) => {
    saveLocal(next);
    if (userIdRef.current) saveRemote(userIdRef.current, next);
  }, []);

  // On mount: load localStorage first (client-only, avoids hydration mismatch),
  // then sync with Supabase if logged in.
  useEffect(() => {
    setProgress(loadLocal());

    async function syncOnLogin(userId: string) {
      userIdRef.current = userId;
      const local = loadLocal();
      const remote = await fetchRemote(userId);
      const merged = mergeProgress(local, remote);
      saveLocal(merged);
      setProgress(merged);
      await saveRemote(userId, merged);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) syncOnLogin(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        syncOnLogin(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        userIdRef.current = null;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const completeModule = useCallback((moduleKey: string) => {
    setProgress(prev => {
      if (prev.completedModules[moduleKey]) return prev;
      const next = { ...prev, completedModules: { ...prev.completedModules, [moduleKey]: true } };
      persist(next);
      return next;
    });
  }, [persist]);

  const completeLevel = useCallback((levelId: string) => {
    setProgress(prev => {
      if (prev.completedLevels[levelId]) return prev;
      const next = { ...prev, completedLevels: { ...prev.completedLevels, [levelId]: true } };
      persist(next);
      return next;
    });
  }, [persist]);

  const saveQuizScore = useCallback((quizId: string, score: number) => {
    setProgress(prev => {
      const next = { ...prev, quizScores: { ...prev.quizScores, [quizId]: score } };
      persist(next);
      return next;
    });
  }, [persist]);

  const addXp = useCallback((amount: number) => {
    setProgress(prev => {
      const next = { ...prev, totalXp: (prev.totalXp || 0) + amount };
      persist(next);
      return next;
    });
  }, [persist]);

  const isLevelUnlocked = useCallback((levelId: string) => {
    if (levelId === 'professionnel') return progress.completedLevels['expert'] === true;
    return true;
  }, [progress.completedLevels]);

  const getLevelProgress = useCallback((levelId: string, totalModules: number) => {
    const completed = Object.keys(progress.completedModules)
      .filter(k => k.startsWith(`${levelId}-`) && progress.completedModules[k])
      .length;
    return { completed, total: totalModules, percentage: Math.round((completed / totalModules) * 100) };
  }, [progress.completedModules]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(defaultProgress);
    if (userIdRef.current) saveRemote(userIdRef.current, defaultProgress);
  }, []);

  return { progress, completeModule, completeLevel, saveQuizScore, addXp, isLevelUnlocked, getLevelProgress, resetProgress };
}
