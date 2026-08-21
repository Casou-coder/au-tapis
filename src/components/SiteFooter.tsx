import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-black/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Left, branding */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center text-xs font-bold text-black" aria-hidden="true">
              ♠
            </div>
            <span className="text-gray-500 text-sm">
              Forged Poker, apprentissage sans argent réel
            </span>
          </div>

          {/* Right, responsible gambling + legal */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
              <Phone size={12} />
              <span>Aide jeu :</span>
              <a href="tel:0974751313" className="text-gray-400 hover:text-white transition-colors font-mono">
                09 74 75 13 13
              </a>
            </div>
            <Link href="/mentions-legales" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              Mentions légales
            </Link>
            <Link href="/cgu" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              CGU
            </Link>
            <Link href="/politique-confidentialite" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              Confidentialité
            </Link>
            <Link
              href="/jeu-responsable"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400/80 hover:text-red-300 hover:border-red-500/30 text-xs transition-all"
            >
              <span className="font-bold">18+</span>
              <span>Jeu responsable</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
