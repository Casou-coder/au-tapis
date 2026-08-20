'use client';

import { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Menu, X, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const MotionLink = motion.create(Link);

const navGroups = [
  {
    label: 'Niveaux',
    links: [
      { href: '/debutant', label: 'Débutant', color: 'text-green-400', dot: '#22c55e' },
      { href: '/intermediaire', label: 'Intermédiaire', color: 'text-blue-400', dot: '#3b82f6' },
      { href: '/avance', label: 'Avancé', color: 'text-purple-400', dot: '#a855f7' },
      { href: '/expert', label: 'Expert', color: 'text-yellow-400', dot: '#eab308' },
      { href: '/professionnel', label: 'Pro', color: 'text-red-400', dot: '#ef4444' },
    ],
  },
  {
    label: 'Pratique',
    links: [
      { href: '/defis', label: '🎯 Défis', color: 'text-orange-400', dot: '#f97316' },
      { href: '/classement', label: '🏆 Classement', color: 'text-yellow-400', dot: '#eab308' },
      { href: '/preflop', label: '📊 Charts', color: 'text-gray-300', dot: '#9ca3af' },
      { href: '/glossaire', label: '📖 Glossaire', color: 'text-gray-300', dot: '#9ca3af' },
      { href: '/outils', label: '🔧 Outils', color: 'text-gray-300', dot: '#9ca3af' },
    ],
  },
];

const allLinks = navGroups.flatMap(g => g.links);

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const menuId = useId();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [menuOpen]);

  // Close menu on pathname change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

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
          <Link href="/" className="flex items-center gap-2 group" aria-label="Forged Poker, Accueil">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center text-sm font-bold" aria-hidden="true">
              ♠
            </div>
            <span className="font-bold text-white group-hover:text-yellow-400 transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
              Forged Poker
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5" role="list">
            {allLinks.map(link => {
              const isActive = pathname.startsWith(link.href);
              return (
                <MotionLink
                  key={link.href}
                  href={link.href}
                  role="listitem"
                  whileTap={{ scale: 0.93 }}
                  transition={{ duration: 0.1 }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? `${link.color} bg-white/10`
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </MotionLink>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Auth button, toujours visible */}
            {user ? (
              <div className="flex items-center gap-1">
                <Link href="/profil" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all" aria-label="Mon profil">
                  <span className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xs font-bold">
                    {(user.email ?? 'U')[0].toUpperCase()}
                  </span>
                  <span className="hidden sm:inline text-yellow-400 text-xs font-medium">Profil</span>
                </Link>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                  aria-label="Se déconnecter"
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
                <span>Connexion</span>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
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
              aria-label="Menu de navigation"
              className="fixed top-16 left-0 right-0 z-40 lg:hidden border-b border-white/10"
              style={{ background: 'rgba(6, 13, 8, 0.98)' }}
            >
              <nav aria-label="Menu mobile" className="max-w-xl mx-auto px-4 py-5 space-y-6">
                {navGroups.map(group => (
                  <div key={group.label}>
                    <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-3" aria-hidden="true">
                      {group.label}
                    </p>
                    <div className="grid grid-cols-2 gap-2" role="list">
                      {group.links.map(link => {
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
                            <span className={active ? link.color : 'text-gray-300'}>{link.label}</span>
                          </MotionLink>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <Link href="/jeu-responsable" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-400 text-xs transition-colors">
                    <span className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-400/80 font-bold text-xs">18+</span>
                    Jeu responsable
                  </Link>
                  {user ? (
                    <div className="flex items-center justify-between">
                      <Link href="/profil" className="flex items-center gap-2 text-yellow-400 text-sm">
                        <User size={15} /> {user.email}
                      </Link>
                      <button onClick={() => supabase.auth.signOut()} className="text-gray-500 hover:text-red-400 text-xs transition-colors">
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <Link href="/auth" className="flex items-center gap-2 text-yellow-400 text-sm">
                      <User size={15} /> Connexion / Inscription
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
    <nav aria-label="Fil d'Ariane" className="flex items-center gap-1 text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-gray-300 transition-colors">Accueil</Link>
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
