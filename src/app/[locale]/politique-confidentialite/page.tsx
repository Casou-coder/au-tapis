import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Comment Forged Poker collecte, utilise et protège vos données personnelles.',
  robots: { index: false, follow: false },
};

const LAST_UPDATED = '19 août 2026';
const CONTACT_EMAIL = 'contact@forgedpoker.com';

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <main id="main-content" className="max-w-2xl mx-auto px-4 pt-28 pb-20">

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow-600 mb-3">Légal</p>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Politique de Confidentialité
          </h1>
          <p className="text-gray-500 text-sm">Dernière mise à jour : {LAST_UPDATED}</p>
        </div>

        <div className="prose-legal">

          <Section title="1. Qui sommes-nous ?">
            <p>
              Forged Poker (<strong>forgedpoker.com</strong>) est une plateforme d&apos;apprentissage du poker Texas
              Hold&apos;em, gratuite et sans argent réel. Le site est édité par un particulier (ci-après
              &laquo;&nbsp;nous&nbsp;&raquo;). Pour toute question relative à vos données, contactez-nous à&nbsp;:
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="2. Données collectées">
            <p>Nous collectons uniquement ce qui est strictement nécessaire au fonctionnement du service :</p>
            <ul>
              <li><strong>Adresse email</strong> :lors de la création d&apos;un compte (authentification via Supabase). Facultatif : vous pouvez utiliser le site sans compte, votre progression est alors stockée localement dans votre navigateur.</li>
              <li><strong>Données de progression</strong> :modules complétés, XP accumulés, scores de quiz, historique des défis quotidiens. Stockées dans votre navigateur (<code>localStorage</code>) et, si vous êtes connecté, dans notre base de données Supabase.</li>
              <li><strong>Données techniques</strong> :adresse IP et user-agent, collectées automatiquement par notre hébergeur (Vercel) à des fins de sécurité et de performance. Aucun tracking publicitaire.</li>
            </ul>
            <p>Nous ne collectons pas de données de paiement, de numéro de téléphone, ni aucune information sensible.</p>
          </Section>

          <Section title="3. Finalités et base légale">
            <table>
              <thead>
                <tr><th>Finalité</th><th>Base légale (RGPD)</th></tr>
              </thead>
              <tbody>
                <tr><td>Authentification et sécurité du compte</td><td>Exécution du contrat (Art. 6.1.b)</td></tr>
                <tr><td>Sauvegarde de la progression</td><td>Exécution du contrat (Art. 6.1.b)</td></tr>
                <tr><td>Logs techniques / sécurité</td><td>Intérêt légitime (Art. 6.1.f)</td></tr>
              </tbody>
            </table>
          </Section>

          <Section title="4. Sous-traitants">
            <p>Nous faisons appel aux prestataires suivants :</p>
            <ul>
              <li><strong>Supabase</strong> (authentification + base de données) :serveurs localisés en Europe (UE). <a href="https://supabase.com/privacy" target="_blank" rel="noopener">Politique de confidentialité Supabase</a>.</li>
              <li><strong>Vercel</strong> (hébergement du site) :certifié SOC 2 Type 2. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">Politique de confidentialité Vercel</a>.</li>
            </ul>
          </Section>

          <Section title="5. Durée de conservation">
            <ul>
              <li>Données de compte : jusqu&apos;à suppression du compte.</li>
              <li>Données de progression : jusqu&apos;à réinitialisation ou suppression du compte.</li>
              <li>Logs techniques : 90 jours maximum.</li>
            </ul>
          </Section>

          <Section title="6. Vos droits">
            <p>
              Conformément au RGPD, vous disposez des droits suivants : accès, rectification, suppression,
              limitation du traitement, portabilité, opposition. Pour exercer ces droits, contactez-nous à{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Vous pouvez également supprimer vos
              données directement depuis la page <Link href="/profil">Profil</Link> (bouton &laquo;&nbsp;Réinitialiser la progression&nbsp;&raquo;).
            </p>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
              auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener">CNIL</a>.
            </p>
          </Section>

          <Section title="7. Cookies et stockage local">
            <p>
              Forged Poker utilise deux mécanismes de stockage :
            </p>
            <ul>
              <li><strong>Cookies de session</strong> (Supabase Auth) :strictement nécessaires au maintien de votre connexion. Aucun cookie publicitaire ou de tracking.</li>
              <li><strong>localStorage</strong> :stockage local dans votre navigateur pour votre progression et vos préférences. Ces données ne quittent pas votre appareil sauf si vous êtes connecté.</li>
            </ul>
            <p>Vous pouvez effacer ces données à tout moment depuis les paramètres de votre navigateur.</p>
          </Section>

          <Section title="8. Modifications">
            <p>
              Cette politique peut être mise à jour. En cas de modification substantielle, nous mettrons à
              jour la date en haut de cette page. L&apos;utilisation continue du site après modification vaut
              acceptation.
            </p>
          </Section>

        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex gap-6 text-sm">
          <Link href="/cgu" className="text-yellow-500 hover:text-yellow-400 transition-colors">CGU →</Link>
          <Link href="/" className="text-gray-500 hover:text-gray-400 transition-colors">← Retour à l&apos;accueil</Link>
        </div>

      </main>

      <style>{`
        .prose-legal { color: #9ca3af; line-height: 1.75; }
        .prose-legal p { margin-bottom: 1rem; }
        .prose-legal ul { margin: .75rem 0 1rem 1.25rem; list-style: disc; }
        .prose-legal li { margin-bottom: .4rem; }
        .prose-legal a { color: #eab308; text-decoration: underline; text-underline-offset: 3px; }
        .prose-legal a:hover { color: #fbbf24; }
        .prose-legal strong { color: #e6edf3; }
        .prose-legal code { font-family: ui-monospace, monospace; font-size: .85em; background: rgba(255,255,255,.07); padding: 1px 5px; border-radius: 4px; }
        .prose-legal table { width: 100%; border-collapse: collapse; margin: .75rem 0 1rem; font-size: .85rem; }
        .prose-legal th { text-align: left; padding: 8px 12px; background: rgba(255,255,255,.05); color: #e6edf3; border-bottom: 1px solid rgba(255,255,255,.1); }
        .prose-legal td { padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,.06); vertical-align: top; }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-white mb-3">{title}</h2>
      {children}
    </section>
  );
}
