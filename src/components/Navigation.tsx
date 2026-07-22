'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ChevronRight, User, Menu, X } from 'lucide-react';

const MotionLink = motion.create(Link);
import { useAuth } from '@/contexts/AuthContext';

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
      { href: '/calculateur', label: '🧮 Calc', color: 'text-gray-300', dot: '#9ca3af' },
      { href: '/outils', label: '🔧 Outils', color: 'text-gray-300', dot: '#9ca3af' },
    ],
  },
];

const allLinks = navGroups.flatMap(g => g.links);

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center text-sm font-bold">
              ♠
            </div>
            <span className="font-bold text-white group-hover:text-yellow-400 transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
              Au Tapis
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {allLinks.map(link => (
              <MotionLink
                key={link.href}
                href={link.href}
                whileTap={{ scale: 0.93 }}
                transition={{ duration: 0.1 }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname.startsWith(link.href)
                    ? `${link.color} bg-white/10`
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </MotionLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Desktop: Home + Auth */}
            <Link href="/" className="hidden sm:flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm">
              <Home size={16} />
            </Link>

            {user ? (
              <MotionLink
                href="/profil"
                onClick={() => setMenuOpen(false)}
                whileTap={{ scale: 0.93 }}
                transition={{ duration: 0.1 }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname.startsWith('/profil')
                    ? 'text-yellow-400 bg-white/10'
                    : 'text-gray-400 hover:text-yellow-400 hover:bg-white/5'
                }`}
              >
                <User size={14} />
                <span className="hidden sm:inline">Profil</span>
              </MotionLink>
            ) : (
              <MotionLink
                href="/login"
                onClick={() => setMenuOpen(false)}
                whileTap={{ scale: 0.93 }}
                transition={{ duration: 0.1 }}
                className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 text-sm font-medium transition-all"
              >
                Connexion
              </MotionLink>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
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
            />
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-0 right-0 z-40 lg:hidden border-b border-white/10"
              style={{ background: 'rgba(6, 13, 8, 0.98)' }}
            >
              <div className="max-w-xl mx-auto px-4 py-5 space-y-6">
                {navGroups.map(group => (
                  <div key={group.label}>
                    <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-3">{group.label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.links.map(link => {
                        const active = pathname.startsWith(link.href);
                        return (
                          <MotionLink
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              active ? 'bg-white/10' : 'hover:bg-white/5'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: link.dot }} />
                            <span className={active ? link.color : 'text-gray-300'}>{link.label}</span>
                          </MotionLink>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="border-t border-white/10 pt-4 flex items-center gap-3">
                  <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                    <Home size={15} /> Accueil
                  </Link>
                  {user ? (
                    <Link href="/profil" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 text-sm transition-colors ml-auto">
                      <User size={15} /> Profil
                    </Link>
                  ) : (
                    <Link href="/login" onClick={() => setMenuOpen(false)} className="ml-auto px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium">
                      Connexion
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-gray-300 transition-colors">Accueil</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={14} />
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-300 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-gray-300">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
