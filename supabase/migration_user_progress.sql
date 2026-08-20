-- Migration : remplacer user_progress par la structure JSONB attendue par useProgress.ts
-- À exécuter UNE SEULE FOIS dans l'éditeur SQL Supabase si la table user_progress existe déjà.

-- 1. Supprimer l'ancienne table (colonnes level_id / module_id)
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS user_completed_levels CASCADE;
DROP TABLE IF EXISTS user_quiz_scores CASCADE;

-- 2. Créer la nouvelle table
CREATE TABLE user_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "progress_own" ON user_progress FOR ALL USING (auth.uid() = user_id);
