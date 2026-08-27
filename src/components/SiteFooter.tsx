'use client';

import Link from 'next/link';
import { Phone } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function SiteFooter() {
  const locale = useLocale();
  const isEn = locale === 'en';

  return (
    <footer className="border-t border-white/8 bg-black/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Left, branding */}
          <div className="flex items-center gap-3">
            <svg viewBox="85 25 330 340" className="w-7 h-7 flex-shrink-0" aria-hidden="true">
              <rect x="85" y="25" width="330" height="340" rx="72" fill="#060d08"/>
              <path d="M250 42 C205 108 105 165 105 252 C105 319 158 350 207 330 C222 324 237 313 250 296 C263 313 278 324 293 330 C342 350 395 319 395 252 C395 165 295 108 250 42Z" fill="#eab308"/>
              <path d="M154 251 H346 C338 266 320 273 300 276 L291 287 C286 294 286 302 291 310 L309 332 H191 L209 310 C214 302 214 294 209 287 L200 276 C180 273 162 266 154 251Z" fill="#060d08"/>
              <path d="M188 240 H312 L324 251 H176Z" fill="#060d08"/>
              <path d="M250 113 C224 139 210 164 214 187 C216 201 225 211 238 215 C231 204 233 191 242 181 C247 175 252 168 253 157 C268 172 279 185 278 199 C277 209 272 217 264 222 C286 216 297 199 294 181 C291 158 270 137 250 113Z" fill="#060d08"/>
            </svg>
            <span className="text-gray-500 text-sm">
              {isEn ? 'Forged Poker, learn without real money' : 'Forged Poker, apprentissage sans argent réel'}
            </span>
          </div>

          {/* Right, responsible gambling + legal */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
              <Phone size={12} />
              <span>{isEn ? 'Help line:' : 'Aide jeu :'}</span>
              <a href="tel:0974751313" className="text-gray-400 hover:text-white transition-colors font-mono">
                09 74 75 13 13
              </a>
            </div>
            <Link href="/mentions-legales" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              {isEn ? 'Legal' : 'Mentions légales'}
            </Link>
            <Link href="/cgu" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              {isEn ? 'Terms' : 'CGU'}
            </Link>
            <Link href="/politique-confidentialite" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              {isEn ? 'Privacy' : 'Confidentialité'}
            </Link>
            <Link
              href="/jeu-responsable"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400/80 hover:text-red-300 hover:border-red-500/30 text-xs transition-all"
            >
              <span className="font-bold">18+</span>
              <span>{isEn ? 'Responsible gaming' : 'Jeu responsable'}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
