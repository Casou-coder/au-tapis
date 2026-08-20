'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronLeft, Play, Square, Plus, Trash2, TrendingUp, TrendingDown,
  Clock, Target, Calendar, Trophy, BarChart2,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type GameType = 'cash' | 'tournoi' | 'spin' | 'sit-n-go';
type Venue = 'online' | 'live';

interface Session {
  id: string;
  date: string;
  gameType: GameType;
  stakes: string;
  venue: Venue;
  buyIn: number;
  cashOut: number;
  durationMinutes: number;
  notes: string;
}

interface ActiveSession {
  startTime: number;
  gameType: GameType;
  stakes: string;
  venue: Venue;
  buyIn: number;
}

const STORAGE_KEY = 'poker-sessions';
const ACTIVE_KEY  = 'poker-session-active';

const GAME_LABELS: Record<GameType, string> = {
  cash: 'Cash Game', tournoi: 'Tournoi', spin: 'Spin & Go', 'sit-n-go': 'Sit & Go',
};
const GAME_COLORS: Record<GameType, string> = {
  cash: 'bg-green-500/20 text-green-400', tournoi: 'bg-blue-500/20 text-blue-400',
  spin: 'bg-purple-500/20 text-purple-400', 'sit-n-go': 'bg-yellow-500/20 text-yellow-400',
};
const VENUE_STYLES: Record<Venue, string> = {
  online: 'bg-gray-500/20 text-gray-400', live: 'bg-amber-500/20 text-amber-400',
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function loadSessions(): Session[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveSessions(s: Session[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function loadActive(): ActiveSession | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(ACTIVE_KEY) || 'null'); } catch { return null; }
}

function saveActive(a: ActiveSession | null) {
  try {
    if (a) localStorage.setItem(ACTIVE_KEY, JSON.stringify(a));
    else localStorage.removeItem(ACTIVE_KEY);
  } catch {}
}

function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h${m > 0 ? String(m).padStart(2, '0') : ''}` : `${m}min`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function sign(n: number) {
  return n >= 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function SessionPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [active, setActive] = useState<ActiveSession | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showEndForm, setShowEndForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // New session form
  const [newGameType, setNewGameType] = useState<GameType>('cash');
  const [newStakes, setNewStakes] = useState('');
  const [newVenue, setNewVenue] = useState<Venue>('online');
  const [newBuyIn, setNewBuyIn] = useState('');

  // End session form
  const [endCashOut, setEndCashOut] = useState('');
  const [endNotes, setEndNotes] = useState('');

  // Load on mount
  useEffect(() => {
    setSessions(loadSessions());
    const a = loadActive();
    setActive(a);
    if (a) setElapsed(Math.floor((Date.now() - a.startTime) / 1000));
  }, []);

  // Live timer
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - active.startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [active]);

  const startSession = useCallback(() => {
    const a: ActiveSession = {
      startTime: Date.now(),
      gameType: newGameType,
      stakes: newStakes || ',',
      venue: newVenue,
      buyIn: parseFloat(newBuyIn) || 0,
    };
    saveActive(a);
    setActive(a);
    setElapsed(0);
    setShowNewForm(false);
    setNewStakes('');
    setNewBuyIn('');
  }, [newGameType, newStakes, newVenue, newBuyIn]);

  const endSession = useCallback(() => {
    if (!active) return;
    const cashOut = parseFloat(endCashOut) || 0;
    const durationMinutes = Math.max(1, Math.round(elapsed / 60));
    const session: Session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      gameType: active.gameType,
      stakes: active.stakes,
      venue: active.venue,
      buyIn: active.buyIn,
      cashOut,
      durationMinutes,
      notes: endNotes,
    };
    const updated = [session, ...sessions];
    saveSessions(updated);
    setSessions(updated);
    saveActive(null);
    setActive(null);
    setElapsed(0);
    setShowEndForm(false);
    setEndCashOut('');
    setEndNotes('');
  }, [active, elapsed, endCashOut, endNotes, sessions]);

  const deleteSession = useCallback((id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);
    setSessions(updated);
    setDeleteConfirm(null);
  }, [sessions]);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const totalPL   = sessions.reduce((s, x) => s + (x.cashOut - x.buyIn), 0);
  const totalBI   = sessions.reduce((s, x) => s + x.buyIn, 0);
  const roi       = totalBI > 0 ? (totalPL / totalBI) * 100 : 0;
  const avgDur    = sessions.length ? Math.round(sessions.reduce((s, x) => s + x.durationMinutes, 0) / sessions.length) : 0;
  const bestPL    = sessions.length ? Math.max(...sessions.map(x => x.cashOut - x.buyIn)) : 0;
  const winRate   = sessions.length ? Math.round((sessions.filter(x => x.cashOut >= x.buyIn).length / sessions.length) * 100) : 0;

  const stats = [
    { label: 'Sessions', value: sessions.length.toString(), icon: Target, sub: 'enregistrées' },
    { label: 'P&L Total', value: `${sign(totalPL)}€`, icon: totalPL >= 0 ? TrendingUp : TrendingDown, sub: 'résultat cumulé', profit: totalPL },
    { label: 'ROI', value: `${sign(roi)}%`, icon: BarChart2, sub: 'retour sur buy-in', profit: roi },
    { label: 'Durée moy.', value: sessions.length ? formatDuration(avgDur) : ',', icon: Clock, sub: 'par session' },
    { label: 'Meilleure', value: sessions.length ? `+${bestPL.toFixed(2)}€` : ',', icon: Trophy, sub: 'session' },
    { label: 'Win rate', value: sessions.length ? `${winRate}%` : ',', icon: BarChart2, sub: 'sessions positives' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#e8f5e9]">
      <main id="main-content" className="pt-24 pb-20 px-4 max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/outils" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> Outils
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                Session Tracker
              </h1>
              <p className="text-gray-400 text-sm mt-1">Suivez vos sessions et analysez votre progression.</p>
            </div>
            {!active && (
              <button
                onClick={() => setShowNewForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-700 hover:bg-green-600 text-white font-semibold text-sm transition-all"
              >
                <Plus size={16} /> Nouvelle session
              </button>
            )}
          </div>
        </motion.div>

        {/* Active session */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-5 rounded-2xl border border-green-500/40 bg-green-500/5"
              style={{ boxShadow: '0 0 20px rgba(39,174,96,0.08)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">Session en cours</span>
                  </div>
                  <p className="font-mono text-4xl font-bold text-white mb-2">{formatTimer(elapsed)}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className={`px-2 py-0.5 rounded-full ${GAME_COLORS[active.gameType]}`}>{GAME_LABELS[active.gameType]}</span>
                    <span>{active.stakes}</span>
                    <span className={`px-2 py-0.5 rounded-full ${VENUE_STYLES[active.venue]}`}>{active.venue}</span>
                    {active.buyIn > 0 && <span>Buy-in : {active.buyIn}€</span>}
                  </div>
                </div>
                <button
                  onClick={() => setShowEndForm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-700/40 hover:bg-red-700/60 border border-red-500/30 text-red-300 font-semibold text-sm transition-all"
                >
                  <Square size={14} /> Terminer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New session form */}
        <AnimatePresence>
          {showNewForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <h3 className="text-white font-bold mb-4">Nouvelle session</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-gray-500 text-xs mb-1.5 block">Type de jeu</label>
                  <select value={newGameType} onChange={e => setNewGameType(e.target.value as GameType)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm">
                    {Object.entries(GAME_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 text-xs mb-1.5 block">Stakes (ex: NL10, €20 MTT)</label>
                  <input value={newStakes} onChange={e => setNewStakes(e.target.value)} placeholder="NL10"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600" />
                </div>
                <div>
                  <label className="text-gray-500 text-xs mb-1.5 block">Format</label>
                  <div className="flex gap-2">
                    {(['online', 'live'] as Venue[]).map(v => (
                      <button key={v} onClick={() => setNewVenue(v)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${newVenue === v ? 'bg-green-700 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                        {v === 'online' ? '💻 Online' : '🏆 Live'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 text-xs mb-1.5 block">Buy-in (€)</label>
                  <input type="number" value={newBuyIn} onChange={e => setNewBuyIn(e.target.value)} placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={startSession}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-700 hover:bg-green-600 text-white font-semibold text-sm transition-all">
                  <Play size={14} /> Démarrer
                </button>
                <button onClick={() => setShowNewForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition-all">
                  Annuler
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* End session form */}
        <AnimatePresence>
          {showEndForm && active && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <h3 className="text-white font-bold mb-4">Terminer la session</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-gray-500 text-xs mb-1.5 block">Cash-out (€)</label>
                  <input type="number" value={endCashOut} onChange={e => setEndCashOut(e.target.value)} placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600" />
                </div>
                <div>
                  <label className="text-gray-500 text-xs mb-1.5 block">Notes (optionnel)</label>
                  <input value={endNotes} onChange={e => setEndNotes(e.target.value)} placeholder="Observations, spots intéressants..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600" />
                </div>
              </div>
              {endCashOut !== '' && (
                <div className="mb-4 p-3 rounded-xl bg-white/3 border border-white/8">
                  <span className="text-gray-400 text-xs">Résultat : </span>
                  <span className={`font-bold text-sm ${(parseFloat(endCashOut) - active.buyIn) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {sign(parseFloat(endCashOut) - active.buyIn)}€
                  </span>
                  <span className="text-gray-500 text-xs ml-2">· {formatTimer(elapsed)}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={endSession}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-700 hover:bg-green-600 text-white font-semibold text-sm transition-all">
                  Enregistrer
                </button>
                <button onClick={() => setShowEndForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition-all">
                  Continuer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        {sessions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-white/5 border border-white/8 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon size={14} className="text-gray-500" />
                  <span className="text-gray-500 text-xs">{s.label}</span>
                </div>
                <p className={`text-xl font-bold ${s.profit !== undefined ? (s.profit >= 0 ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>
                  {s.value}
                </p>
                <p className="text-gray-600 text-xs mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Sessions list */}
        <div className="space-y-2">
          <h2 className="text-white font-bold mb-3">Historique</h2>

          {sessions.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <Play size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune session enregistrée</p>
              <p className="text-xs mt-1">Commencez une session pour suivre vos résultats.</p>
            </div>
          ) : (
            sessions.map((s) => {
              const pl = s.cashOut - s.buyIn;
              const isDeleting = deleteConfirm === s.id;
              return (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/8 hover:border-white/15 transition-all"
                >
                  <div className="shrink-0 text-gray-600">
                    <Calendar size={14} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-gray-300 text-xs">{formatDate(s.date)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${GAME_COLORS[s.gameType]}`}>{GAME_LABELS[s.gameType]}</span>
                      <span className="text-gray-500 text-xs">{s.stakes}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${VENUE_STYLES[s.venue]}`}>{s.venue}</span>
                    </div>
                    {s.notes && <p className="text-gray-600 text-xs truncate">{s.notes}</p>}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className={`font-bold text-sm ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{sign(pl)}€</p>
                      <p className="text-gray-600 text-xs">{formatDuration(s.durationMinutes)}</p>
                    </div>

                    {isDeleting ? (
                      <div className="flex gap-1">
                        <button onClick={() => deleteSession(s.id)} className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-all">Oui</button>
                        <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 transition-all">Non</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(s.id)} className="p-1.5 text-gray-700 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

      </main>
    </div>
  );
}
