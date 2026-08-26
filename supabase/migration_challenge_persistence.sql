-- Forged Poker — Migration : persistance des défis et badges
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- ============================================================
-- TABLES
-- ============================================================

-- Historique des défis quotidiens (tableau de DayRecord)
CREATE TABLE IF NOT EXISTS user_daily_history (
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  history    JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Statistiques des défis (type stats, failed ids, streak consécutif)
CREATE TABLE IF NOT EXISTS user_challenge_stats (
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  type_stats          JSONB NOT NULL DEFAULT '{}',
  failed_ids          JSONB NOT NULL DEFAULT '[]',
  consecutive_current INTEGER NOT NULL DEFAULT 0,
  consecutive_max     INTEGER NOT NULL DEFAULT 0,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE user_daily_history   ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_history_own"   ON user_daily_history   FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "challenge_stats_own" ON user_challenge_stats FOR ALL USING (auth.uid() = user_id);
