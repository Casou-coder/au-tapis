import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Conditions d'utilisation de Forged Poker, plateforme d'apprentissage du poker gratuite.",
  robots: { index: false, follow: false },
};

const LAST_UPDATED = '19 août 2026';
const CONTACT_EMAIL = 'contact@forgedpoker.com';

export default function CguPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <main id="main-content" className="max-w-2xl mx-auto px-4 pt-28 pb-20">

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow-600 mb-3">Légal</p>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-gray-500 text-sm">Dernière mise à jour : {LAST_UPDATED}</p>
        </div>

        <div className="prose-legal">

          <Section title="1. Objet">
            <p>
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation du
              site <strong>Forged Poker</strong> (<strong>forgedpoker.com</strong>), plateforme d&apos;apprentissage
              du poker Texas Hold&apos;em gratuite et sans argent réel.
            </p>
            <p>
              En accédant au site, vous acceptez sans réserve les présentes CGU. Si vous ne les acceptez
              pas, nous vous invitons à ne pas utiliser le service.
            </p>
          </Section>

          <Section title="2. Description du service">
            <p>Forged Poker propose :</p>
            <ul>
              <li>Des cours interactifs organisés en 5 niveaux progressifs (Débutant à Professionnel)</li>
              <li>Des défis quotidiens de stratégie poker</li>
              <li>Des outils d&apos;analyse (calculateur d&apos;équité, charts préflop, glossaire, etc.)</li>
              <li>Un suivi de progression avec système d&apos;XP</li>
            </ul>
            <p>Le service est gratuit, sans abonnement ni achat in-app. Aucun argent réel n&apos;est échangé sur le site.</p>
          </Section>

          <Section title="3. Accès et compte utilisateur">
            <p>
              Le site est librement accessible sans inscription. La création d&apos;un compte (email + mot de
              passe) est facultative et permet uniquement de sauvegarder votre progression sur plusieurs
              appareils.
            </p>
            <p>
              Vous êtes responsable de la confidentialité de vos identifiants. Tout accès effectué avec
              vos identifiants est réputé provenir de vous. En cas de compromission, contactez-nous
              immédiatement à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
            <p>
              Vous devez avoir au moins <strong>18 ans</strong> pour utiliser ce service (les contenus
              traitent de stratégie poker, associé aux jeux d&apos;argent).
            </p>
          </Section>

          <Section title="4. Utilisation acceptable">
            <p>Il est interdit d&apos;utiliser le site pour :</p>
            <ul>
              <li>Toute activité illégale ou contraire à l&apos;ordre public</li>
              <li>Scraper, copier ou redistribuer le contenu sans autorisation écrite</li>
              <li>Tenter de contourner les mesures de sécurité ou d&apos;accéder à des comptes tiers</li>
              <li>Diffuser des contenus offensants, trompeurs ou en violation de droits tiers</li>
            </ul>
          </Section>

          <Section title="5. Propriété intellectuelle">
            <p>
              L&apos;ensemble du contenu de Forged Poker (textes, illustrations, structure des cours, code source)
              est protégé par le droit d&apos;auteur et appartient à l&apos;éditeur, sauf mention contraire.
              Toute reproduction, même partielle, sans autorisation expresse est interdite.
            </p>
          </Section>

          <Section title="6. Jeu responsable et avertissement">
            <p>
              Forged Poker est un site pédagogique <strong>sans argent réel</strong>. Le poker implique
              cependant des risques financiers lorsqu&apos;il est pratiqué en argent réel sur d&apos;autres
              plateformes. Nous vous encourageons à consulter notre page{' '}
              <Link href="/jeu-responsable">Jeu Responsable</Link> avant de jouer en argent réel.
            </p>
            <p>
              En cas de difficulté avec les jeux d&apos;argent, contactez Joueurs Info Service :
              <strong> 09 74 75 13 13</strong> (appel non surtaxé, 7j/7).
            </p>
          </Section>

          <Section title="7. Limitation de responsabilité">
            <p>
              Forged Poker est fourni &laquo;&nbsp;en l&apos;état&nbsp;&raquo;, sans garantie d&apos;aucune sorte. Nous ne
              garantissons pas l&apos;exactitude absolue des contenus pédagogiques ni la disponibilité
              continue du service. En aucun cas nous ne saurions être tenus responsables des pertes
              financières encourues lors de parties de poker en argent réel, quelles qu&apos;en soient les
              circonstances.
            </p>
          </Section>

          <Section title="8. Modifications du service et des CGU">
            <p>
              Nous nous réservons le droit de modifier le service ou les présentes CGU à tout moment.
              Les modifications entrent en vigueur dès leur publication sur cette page. L&apos;utilisation
              continue du service vaut acceptation des nouvelles CGU.
            </p>
          </Section>

          <Section title="9. Résiliation">
            <p>
              Vous pouvez supprimer votre compte à tout moment en nous contactant à{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Vos données seront supprimées
              conformément à notre{' '}
              <Link href="/politique-confidentialite">Politique de Confidentialité</Link>.
            </p>
          </Section>

          <Section title="10. Droit applicable">
            <p>
              Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux tribunaux
              compétents de France.
            </p>
          </Section>

        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex gap-6 text-sm">
          <Link href="/politique-confidentialite" className="text-yellow-500 hover:text-yellow-400 transition-colors">Politique de confidentialité →</Link>
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
