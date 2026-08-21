/**
 * Locale-aware challenge loader.
 * Returns English challenges for 'en', French challenges for 'fr'.
 */

import type { Challenge, ChallengeLevel } from './challenges-data';

export type { Challenge, ChallengeLevel };

export async function getChallenges(locale: string): Promise<Challenge[]> {
  if (locale === 'en') {
    const mod = await import('./challenges-data.en');
    return mod.CHALLENGES;
  }
  const mod = await import('./challenges-data');
  return mod.CHALLENGES;
}

export async function getChallengesForLevel(locale: string, level: ChallengeLevel): Promise<Challenge[]> {
  const challenges = await getChallenges(locale);
  return challenges.filter(c => c.level === level);
}

export async function selectDailyChallenge(
  locale: string,
  level: ChallengeLevel,
  completedIds: string[],
  userId: string,
  date: string,
): Promise<Challenge> {
  const pool = (await getChallengesForLevel(locale, level)).filter(c => !completedIds.includes(c.id));
  const seed = [...(userId + date)].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const eligible = pool.length > 0 ? pool : await getChallengesForLevel(locale, level);
  return eligible[seed % eligible.length];
}
