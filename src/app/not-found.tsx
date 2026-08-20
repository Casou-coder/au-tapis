import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">

        <div className="text-6xl mb-6 select-none" aria-hidden="true">♠</div>

        <h1
          className="text-6xl font-bold text-white mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          404
        </h1>
        <p className="text-gray-500 text-lg mb-1">Cette page n&apos;existe pas.</p>
        <p className="text-gray-600 text-sm mb-10">
          Vous avez peut-être suivi un lien cassé, ou la page a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-sm transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/debutant"
            className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-sm transition-colors"
          >
            Commencer le niveau Débutant
          </Link>
        </div>

      </div>
    </div>
  );
}
