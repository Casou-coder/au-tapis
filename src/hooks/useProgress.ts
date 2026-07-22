'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const supabaseEnabled = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

interface ProgressData {
  completedModules: Record<string, boolean>;
  completedLevels: Record<string, boolean>;
  quizScores: Record<string, number>;
}

const STORAGE_KEY = 'poker-academy-progress';
const defaultProgress: ProgressData = { completedModules: {}, completedLevels: {}, quizScores: {} };

function loadLocal(): ProgressData {
  if (typeof window === 'undefined') return defaultProgress;
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') ?? defaultProgress; }
  catch { return defaultProgress; }
}

function saveLocal(data: ProgressData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// "debutant-regles" → { level_id: "debutant", module_id: "regles" }
function parseModuleKey(key: string) {
  const idx = key.indexOf('-');
  return idx === -1
    ? { level_id: key, module_id: key }
    : { level_id: key.slice(0, idx), module_id: key.slice(idx + 1) };
}

function getSupabase() {
  const { createClient } = require('@/lib/supabase/client');
  return createClient();
}

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);

  useEffect(() => {
    if (!user || !supabaseEnabled) {
      setProgress(loadLocal());
      return;
    }

    async function fetchFromSupabase() {
      const supabase = getSupabase();
      const [{ data: modules }, { data: levels }, { data: quizzes }] = await Promise.all([
        supabase.from('user_progress').select('level_id, module_id').eq('user_id', user!.id),
        supabase.from('user_completed_levels').select('level_id').eq('user_id', user!.id),
        supabase.from('user_quiz_scores').select('quiz_id, score').eq('user_id', user!.id),
      ]);

      const completedModules: Record<string, boolean> = {};
      modules?.forEach((m: { level_id: string; module_id: string }) => {
        completedModules[`${m.level_id}-${m.module_id}`] = true;
      });

      const completedLevels: Record<string, boolean> = {};
      levels?.forEach((l: { level_id: string }) => { completedLevels[l.level_id] = true; });

      const quizScores: Record<string, number> = {};
      quizzes?.forEach((q: { quiz_id: string; score: number }) => { quizScores[q.quiz_id] = q.score; });

      setProgress({ completedModules, completedLevels, quizScores });
    }

    fetchFromSupabase();
  }, [user]);

  const completeModule = useCallback(async (moduleKey: string) => {
    if (progress.completedModules[moduleKey]) return;

    const next = {
      ...progress,
      completedModules: { ...progress.completedModules, [moduleKey]: true },
    };
    setProgress(next);

    if (user && supabaseEnabled) {
      const supabase = getSupabase();
      const { level_id, module_id } = parseModuleKey(moduleKey);
      await supabase.from('user_progress').upsert({ user_id: user.id, level_id, module_id });
    } else {
      saveLocal(next);
    }
  }, [progress, user]);

  const completeLevel = useCallback(async (levelId: string) => {
    if (progress.completedLevels[levelId]) return;

    const next = {
      ...progress,
      completedLevels: { ...progress.completedLevels, [levelId]: true },
    };
    setProgress(next);

    if (user && supabaseEnabled) {
      const supabase = getSupabase();
      await supabase.from('user_completed_levels').upsert({ user_id: user.id, level_id: levelId });
    } else {
      saveLocal(next);
    }
  }, [progress, user]);

  const saveQuizScore = useCallback(async (quizId: string, score: number) => {
    const next = { ...progress, quizScores: { ...progress.quizScores, [quizId]: score } };
    setProgress(next);

    if (user && supabaseEnabled) {
      const supabase = getSupabase();
      await supabase.from('user_quiz_scores').upsert({ user_id: user.id, quiz_id: quizId, score });
    } else {
      saveLocal(next);
    }
  }, [progress, user]);

  const isLevelUnlocked = useCallback((levelId: string) => {
    if (levelId === 'professionnel') return progress.completedLevels['expert'] === true;
    return true;
  }, [progress]);

  const getLevelProgress = useCallback((levelId: string, totalModules: number) => {
    const completed = Object.keys(progress.completedModules)
      .filter(k => k.startsWith(`${levelId}-`) && progress.completedModules[k])
      .length;
    return { completed, total: totalModules, percentage: Math.round((completed / totalModules) * 100) };
  }, [progress]);

  const resetProgress = useCallback(async () => {
    if (user && supabaseEnabled) {
      const supabase = getSupabase();
      await Promise.all([
        supabase.from('user_progress').delete().eq('user_id', user.id),
        supabase.from('user_completed_levels').delete().eq('user_id', user.id),
        supabase.from('user_quiz_scores').delete().eq('user_id', user.id),
      ]);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setProgress(defaultProgress);
  }, [user]);

  return {
    progress,
    completeModule,
    completeLevel,
    saveQuizScore,
    isLevelUnlocked,
    getLevelProgress,
    resetProgress,
  };
}
