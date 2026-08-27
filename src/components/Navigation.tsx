'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { usePathname, Link, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Menu, X, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const MotionLink = motion.create(Link);

function FlagUS({ className }: { className?: string }) {
  // Official US flag ratio 19:10, 13 stripes, blue canton top-left
  const sh = 10 / 13;
  return (
    <svg viewBox="0 0 19 10" className={className} aria-hidden="true">
      <rect width="19" height="10" fill="#B22234"/>
      {/* 6 white stripes (stripes 1,3,5,7,9,11 from top) */}
      {[1, 3, 5, 7, 9, 11].map(i => (
        <rect key={i} x="0" y={i * sh} width="19" height={sh} fill="#fff"/>
      ))}
      {/* Blue canton */}
      <rect x="0" y="0" width="7.6" height={7 * sh} fill="#3C3B6E"/>
      {/* Simplified stars: 2 rows × 3 cols */}
      {Array.from({ length: 2 }, (_, r) =>
        Array.from({ length: 3 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={1.2 + c * 2.6} cy={0.85 + r * 1.85} r={0.28} fill="#fff"/>
        ))
      )}
    </svg>
  );
}

function FlagFR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" className={className} aria-hidden="true">
      <rect width="1" height="2" fill="#002395"/>
      <rect x="1" width="1" height="2" fill="#EDEDED"/>
      <rect x="2" width="1" height="2" fill="#ED2939"/>
    </svg>
  );
}

const niveauxLinks = [
  { href: '/debutant',      labelEn: 'Beginner',      labelFr: 'Débutant',      color: 'text-green-400',  dot: '#22c55e' },
  { href: '/intermediaire', labelEn: 'Intermediate',  labelFr: 'Intermédiaire', color: 'text-blue-400',   dot: '#3b82f6' },
  { href: '/avance',        labelEn: 'Advanced',      labelFr: 'Avancé',        color: 'text-purple-400', dot: '#a855f7' },
  { href: '/expert',        labelEn: 'Expert',        labelFr: 'Expert',        color: 'text-yellow-400', dot: '#eab308' },
  { href: '/professionnel', labelEn: 'Professional',  labelFr: 'Professionnel', color: 'text-red-400',    dot: '#ef4444' },
] as const;

const pratiqueLinks = [
  { href: '/defis',      labelEn: 'Challenges',     labelFr: 'Défis',          color: 'text-orange-400', dot: '#f97316' },
  { href: '/ranges',     labelEn: 'Range Builder',  labelFr: 'Range Builder',  color: 'text-cyan-400',   dot: '#22d3ee' },
  { href: '/classement', labelEn: 'Leaderboard',    labelFr: 'Classement',     color: 'text-yellow-400', dot: '#eab308' },
  { href: '/preflop',    labelEn: 'Preflop Ranges', labelFr: 'Ranges préflop', color: 'text-gray-300',   dot: '#9ca3af' },
  { href: '/glossaire',  labelEn: 'Glossary',       labelFr: 'Glossaire',      color: 'text-gray-300',   dot: '#9ca3af' },
  { href: '/outils',     labelEn: 'Tools',          labelFr: 'Outils',         color: 'text-gray-300',   dot: '#9ca3af' },
] as const;

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as 'en' | 'fr';
  const [menuOpen, setMenuOpen]       = useState(false);
  const [niveauxOpen, setNiveauxOpen] = useState(false);
  const [langOpen, setLangOpen]       = useState(false);
  const [user, setUser]               = useState<SupabaseUser | null>(null);
  const menuId      = useId();
  const niveauxRef  = useRef<HTMLDivElement>(null);
  const langRef     = useRef<HTMLDivElement>(null);

  const t = (en: string, fr: string) => locale === 'fr' ? fr : en;

  function switchLocale(newLocale: 'en' | 'fr') {
    router.replace(pathname, { locale: newLocale });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [menuOpen]);

  // Close dropdowns on click outside
  useEffect(() => {
    if (!niveauxOpen) return;
    const handler = (e: MouseEvent) => {
      if (niveauxRef.current && !niveauxRef.current.contains(e.target as Node)) setNiveauxOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [niveauxOpen]);

  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  // Close everything on navigation
  useEffect(() => { setMenuOpen(false); setNiveauxOpen(false); setLangOpen(false); }, [pathname]);

  const isNiveauxActive = niveauxLinks.some(l => pathname.startsWith(l.href));

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        aria-label="Navigation principale"
        className="fixed top-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Forged Poker">
            <svg viewBox="85 25 330 340" className="h-9 w-auto flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 42 C205 108 105 165 105 252 C105 319 158 350 207 330 C222 324 237 313 250 296 C263 313 278 324 293 330 C342 350 395 319 395 252 C395 165 295 108 250 42Z" fill="#eab308"/>
              <path d="M154 251 H346 C338 266 320 273 300 276 L291 287 C286 294 286 302 291 310 L309 332 H191 L209 310 C214 302 214 294 209 287 L200 276 C180 273 162 266 154 251Z" fill="#060d08"/>
              <path d="M188 240 H312 L324 251 H176Z" fill="#060d08"/>
              <path d="M250 113 C224 139 210 164 214 187 C216 201 225 211 238 215 C231 204 233 191 242 181 C247 175 252 168 253 157 C268 172 279 185 278 199 C277 209 272 217 264 222 C286 216 297 199 294 181 C291 158 270 137 250 113Z" fill="#060d08"/>
            </svg>
            <span className="font-bold text-white group-hover:text-yellow-400 transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
              Forged Poker
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">

            {/* Niveaux dropdown */}
            <div ref={niveauxRef} className="relative">
              <button
                onClick={() => setNiveauxOpen(o => !o)}
                aria-haspopup="true"
                aria-expanded={niveauxOpen}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isNiveauxActive
                    ? 'text-yellow-400 bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t('Levels', 'Niveaux')}
                <ChevronDown size={13} className={`transition-transform duration-200 ${niveauxOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              <AnimatePresence>
                {niveauxOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-48 rounded-xl overflow-hidden"
                    style={{ background: 'rgba(8, 12, 8, 0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                  >
                    {niveauxLinks.map(link => {
                      const active = pathname.startsWith(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                            active ? `${link.color} bg-white/8` : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: link.dot }} aria-hidden="true" />
                          {t(link.labelEn, link.labelFr)}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pratique links */}
            {pratiqueLinks.map(link => {
              const isActive = pathname.startsWith(link.href);
              return (
                <MotionLink
                  key={link.href}
                  href={link.href}
                  whileTap={{ scale: 0.93 }}
                  transition={{ duration: 0.1 }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? `${link.color} bg-white/10`
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t(link.labelEn, link.labelFr)}
                </MotionLink>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language selector dropdown */}
            <div ref={langRef} className="relative mr-1">
              <button
                onClick={() => setLangOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={t('Select language', 'Sélectionner la langue')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-xs font-semibold text-gray-300 hover:text-white"
              >
                {locale === 'fr' ? <FlagFR className="w-5 h-auto rounded-[2px]" /> : <FlagUS className="w-5 h-auto rounded-[2px]" />}
                <span>{locale === 'fr' ? 'FR' : 'US'}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 text-gray-500 ${langOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.13 }}
                    role="listbox"
                    aria-label={t('Language', 'Langue')}
                    className="absolute top-full right-0 mt-2 w-32 rounded-xl overflow-hidden z-50"
                    style={{ background: 'rgba(8,12,8,0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                  >
                    {([
                      { code: 'en', Flag: FlagUS, label: 'US' },
                      { code: 'fr', Flag: FlagFR, label: 'FR' },
                    ] as const).map(({ code, Flag, label }) => (
                      <li key={code} role="option" aria-selected={locale === code}>
                        <button
                          onClick={() => { switchLocale(code); setLangOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all ${
                            locale === code
                              ? 'text-yellow-400 bg-yellow-500/10'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Flag className="w-5 h-auto rounded-[2px] shrink-0" />
                          <span className="font-semibold">{label}</span>
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/profil"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all"
                  aria-label={t('My profile', 'Mon profil')}
                >
                  <span className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xs font-bold">
                    {(user.email ?? 'U')[0].toUpperCase()}
                  </span>
                  <span className="hidden sm:inline text-yellow-400 text-xs font-medium">{t('Profile', 'Profil')}</span>
                </Link>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                  aria-label={t('Sign out', 'Se déconnecter')}
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition-all text-xs"
              >
                <User size={13} />
                <span>{t('Login', 'Connexion')}</span>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? t('Close menu', 'Fermer le menu') : t('Open menu', 'Ouvrir le menu')}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              id={menuId}
              key="drawer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-label={t('Navigation menu', 'Menu de navigation')}
              className="fixed top-16 left-0 right-0 z-40 lg:hidden border-b border-white/10"
              style={{ background: 'rgba(6, 13, 8, 0.98)' }}
            >
              <nav aria-label={t('Mobile menu', 'Menu mobile')} className="max-w-xl mx-auto px-4 py-5 space-y-6">
                <div>
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-3" aria-hidden="true">
                    {t('Levels', 'Niveaux')}
                  </p>
                  <div className="grid grid-cols-2 gap-2" role="list">
                    {niveauxLinks.map(link => {
                      const active = pathname.startsWith(link.href);
                      return (
                        <MotionLink
                          key={link.href}
                          href={link.href}
                          role="listitem"
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            active ? 'bg-white/10' : 'hover:bg-white/5'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: link.dot }} aria-hidden="true" />
                          <span className={active ? link.color : 'text-gray-300'}>{t(link.labelEn, link.labelFr)}</span>
                        </MotionLink>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-3" aria-hidden="true">
                    {t('Practice', 'Pratique')}
                  </p>
                  <div className="grid grid-cols-2 gap-2" role="list">
                    {pratiqueLinks.map(link => {
                      const active = pathname.startsWith(link.href);
                      return (
                        <MotionLink
                          key={link.href}
                          href={link.href}
                          role="listitem"
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            active ? 'bg-white/10' : 'hover:bg-white/5'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: link.dot }} aria-hidden="true" />
                          <span className={active ? link.color : 'text-gray-300'}>{t(link.labelEn, link.labelFr)}</span>
                        </MotionLink>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  {/* Mobile locale switcher */}
                  <div className="flex items-center gap-2">
                    {([
                      { code: 'en', Flag: FlagUS, label: 'US' },
                      { code: 'fr', Flag: FlagFR, label: 'FR' },
                    ] as const).map(({ code, Flag, label }) => (
                      <button
                        key={code}
                        onClick={() => switchLocale(code)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          locale === code
                            ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                            : 'text-gray-500 border-white/10 hover:text-gray-300'
                        }`}
                      >
                        <Flag className="w-5 h-auto rounded-[2px]" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>

                  <Link href="/jeu-responsable" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-400 text-xs transition-colors">
                    <span className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-400/80 font-bold text-xs">18+</span>
                    {t('Responsible gaming', 'Jeu responsable')}
                  </Link>
                  {user ? (
                    <div className="flex items-center justify-between">
                      <Link href="/profil" className="flex items-center gap-2 text-yellow-400 text-sm">
                        <User size={15} /> {user.email}
                      </Link>
                      <button onClick={() => supabase.auth.signOut()} className="text-gray-500 hover:text-red-400 text-xs transition-colors">
                        {t('Sign out', 'Déconnexion')}
                      </button>
                    </div>
                  ) : (
                    <Link href="/auth" className="flex items-center gap-2 text-yellow-400 text-sm">
                      <User size={15} /> {t('Login / Register', 'Connexion / Inscription')}
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={14} aria-hidden="true" />
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-300 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-gray-300" aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
