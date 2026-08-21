/**
 * Locale-aware range challenge loader.
 */

import type { RangeChallenge } from './range-challenges';

export type { RangeChallenge };

export async function getRangeChallenges(locale: string): Promise<RangeChallenge[]> {
  if (locale === 'en') {
    const mod = await import('./range-challenges.en');
    return mod.RANGE_CHALLENGES;
  }
  const mod = await import('./range-challenges');
  return mod.RANGE_CHALLENGES;
}
