'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ChevronRight, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const levelLinks = [
  { href: '/debutant', label: 'Débutant', color: 'text-green-400' },
  { href: '/intermediaire', label: 'Intermédiaire', color: 'text-blue-400' },
  { href: '/avance', label: 'Avancé', color: 'text-purple-400' },
  { href: '/expert', label: 'Expert', color: 'text-yellow-400' },
  { href: '/professionnel', label: 'Pro', color: 'text-red-400' },
  { href: '/defis', label: '🎯 Défis', color: 'text-orange-400' },
  { href: '/outils', label: '🔧 Outils', color: 'text-gray-300' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center text-sm">
            ♠
          </div>
          <span className="font-bold text-white group-hover:text-yellow-400 transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
            Au Tapis
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {levelLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname.startsWith(link.href)
                  ? `${link.color} bg-white/10`
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Accueil</span>
          </Link>
          {user ? (
            <Link
              href="/profil"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname.startsWith('/profil')
                  ? 'text-yellow-400 bg-white/10'
                  : 'text-gray-400 hover:text-yellow-400 hover:bg-white/5'
              }`}
            >
              <User size={14} />
              <span className="hidden sm:inline">Profil</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 text-sm font-medium transition-all"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
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
