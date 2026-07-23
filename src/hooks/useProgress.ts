'use client';

import { useState, useCallback } from 'react';

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

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(() => loadLocal());

  const completeModule = useCallback((moduleKey: string) => {
    setProgress(prev => {
      if (prev.completedModules[moduleKey]) return prev;
      const next = { ...prev, completedModules: { ...prev.completedModules, [moduleKey]: true } };
      saveLocal(next);
      return next;
    });
  }, []);

  const completeLevel = useCallback((levelId: string) => {
    setProgress(prev => {
      if (prev.completedLevels[levelId]) return prev;
      const next = { ...prev, completedLevels: { ...prev.completedLevels, [levelId]: true } };
      saveLocal(next);
      return next;
    });
  }, []);

  const saveQuizScore = useCallback((quizId: string, score: number) => {
    setProgress(prev => {
      const next = { ...prev, quizScores: { ...prev.quizScores, [quizId]: score } };
      saveLocal(next);
      return next;
    });
  }, []);

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
  }, []);

  return { progress, completeModule, completeLevel, saveQuizScore, isLevelUnlocked, getLevelProgress, resetProgress };
}
