import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions Légales',
  description: 'Mentions légales de Forged Poker : éditeur, hébergeur et informations légales.',
  robots: { index: false, follow: false },
};

const LAST_UPDATED = '21 août 2026';
const CONTACT_EMAIL = 'contact@forgedpoker.com';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-white mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {title}
      </h2>
      <div className="space-y-2 text-gray-400 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <main id="main-content" className="max-w-2xl mx-auto px-4 pt-28 pb-20">

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow-600 mb-3">Légal</p>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Mentions Légales
          </h1>
          <p className="text-gray-500 text-sm">Dernière mise à jour : {LAST_UPDATED}</p>
        </div>

        <Section title="1. Éditeur du site">
          <p>Le site <strong className="text-gray-200">forgedpoker.com</strong> est édité à titre personnel par :</p>
          <div className="mt-2 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p><span className="text-gray-500">Nom :</span> <strong className="text-gray-200">Clément Dupas</strong></p>
            <p><span className="text-gray-500">Qualité :</span> Particulier – éditeur non professionnel</p>
            <p><span className="text-gray-500">Contact :</span>{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-yellow-400 hover:text-yellow-300 transition-colors">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </Section>

        <Section title="2. Directeur de la publication">
          <p>Le directeur de la publication est <strong className="text-gray-200">Clément Dupas</strong>.</p>
        </Section>

        <Section title="3. Hébergeur">
          <p>Le site est hébergé par :</p>
          <div className="mt-2 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p><strong className="text-gray-200">Vercel Inc.</strong></p>
            <p>440 N Barranca Ave #4133</p>
            <p>Covina, CA 91723, États-Unis</p>
            <p>
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                vercel.com
              </a>
            </p>
          </div>
        </Section>

        <Section title="4. Nature du service">
          <p>
            Forged Poker est une plateforme d&apos;apprentissage du poker Texas Hold&apos;em,{' '}
            <strong className="text-gray-200">gratuite et sans argent réel</strong>. Aucune transaction financière
            n&apos;est effectuée sur le site. Il ne s&apos;agit pas d&apos;un site de jeux d&apos;argent en ligne
            au sens de la loi du 12 mai 2010 régulée par l&apos;Arjel (ANJ).
          </p>
          <p>
            Le contenu pédagogique (cours, défis, outils) est fourni à titre informatif et éducatif. Il ne
            constitue pas un conseil financier ou une incitation à jouer de l&apos;argent réel.
          </p>
        </Section>

        <Section title="5. Propriété intellectuelle">
          <p>
            L&apos;ensemble du contenu du site (textes, visuels, code source, structure) est la propriété exclusive
            de l&apos;éditeur. Toute reproduction, distribution ou utilisation à des fins commerciales est interdite
            sans autorisation préalable.
          </p>
        </Section>

        <Section title="6. Données personnelles">
          <p>
            Le traitement des données personnelles est décrit dans notre{' '}
            <Link href="/politique-confidentialite" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              Politique de Confidentialité
            </Link>
            , conformément au RGPD (Règlement Général sur la Protection des Données).
          </p>
        </Section>

        <Section title="7. Cookies">
          <p>
            Le site utilise uniquement des cookies strictement nécessaires au fonctionnement du service
            (authentification via Supabase). Aucun cookie publicitaire ni traceur tiers n&apos;est déposé.
            Voir nos{' '}
            <Link href="/politique-confidentialite" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              informations sur les cookies
            </Link>
            .
          </p>
        </Section>

        <Section title="8. Jeu responsable">
          <p>
            Forged Poker n&apos;est pas un site de jeux d&apos;argent. Nous encourageons néanmoins une pratique
            responsable du poker. En cas de problème avec le jeu d&apos;argent, contactez :{' '}
            <strong className="text-gray-200">Joueurs Info Service</strong> au{' '}
            <a href="tel:0974751313" className="text-yellow-400 hover:text-yellow-300 font-mono">09 74 75 13 13</a>
            {' '}(gratuit, 8h–2h).
          </p>
          <p>
            <Link href="/jeu-responsable" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              En savoir plus sur le jeu responsable →
            </Link>
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Pour toute question relative au site ou à son contenu :{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-yellow-400 hover:text-yellow-300 transition-colors">
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>

        <div className="mt-10 pt-6 border-t border-white/8 flex flex-wrap gap-4 text-xs text-gray-600">
          <Link href="/cgu" className="hover:text-gray-400 transition-colors">CGU</Link>
          <Link href="/politique-confidentialite" className="hover:text-gray-400 transition-colors">Confidentialité</Link>
          <Link href="/jeu-responsable" className="hover:text-gray-400 transition-colors">Jeu responsable</Link>
        </div>

      </main>
    </div>
  );
}
