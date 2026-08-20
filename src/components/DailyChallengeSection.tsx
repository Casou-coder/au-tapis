'use client';

import { useState } from 'react';
import { DailyChallengeCard, DailyChallengeModal } from '@/components/DailyChallenge';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';

export default function DailyChallengeSection() {
  const { challenge, isCompleted, wasCorrect, streak, loading, completeChallenge } = useDailyChallenge();
  const [open, setOpen] = useState(false);

  return (
    <>
      <DailyChallengeCard
        challenge={challenge}
        isCompleted={isCompleted}
        wasCorrect={wasCorrect}
        streak={streak}
        loading={loading}
        onOpen={() => setOpen(true)}
      />
      {open && challenge && (
        <DailyChallengeModal
          challenge={challenge}
          streak={streak}
          onComplete={(correct) => { completeChallenge(correct); }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
