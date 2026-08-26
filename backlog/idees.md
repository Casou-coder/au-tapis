# Backlog — Idées en attente

Idées validées conceptuellement mais non développées. À reprendre quand le moment est venu.

---

## Email de rappel quotidien

**Statut** : En attente  
**Décision** : Concept validé, pas prioritaire au stade actuel  
**Effort estimé** : ~0.5 journée de dev

**Comportement**  
Email automatique envoyé à heure fixe (ex : 19h) si l'utilisateur n'a pas fait son défi du jour.  
Contenu : streak actuel, lien direct vers le défi.  
Opt-in obligatoire (case à cocher dans les paramètres du profil).

**Stack technique**  
- Supabase Edge Function (cron job quotidien)  
- Service email : Resend (le plus simple, SDK TypeScript natif)  
- Domaine vérifié pour éviter le spam (forgedpoker.com)  
- Colonne `email_reminders: boolean` à ajouter dans la table `profiles`

**Coût**  
Gratuit jusqu'à ~3 000 utilisateurs actifs (Resend free tier : 3 000 emails/mois).  
Palier payant : $20/mois pour 50 000 emails.

**Prérequis avant de dev**  
- Avoir un domaine vérifié sur Resend  
- Avoir une base d'utilisateurs suffisante pour que ça vaille le coup

---

---

## SEO — Optimisation post-lancement

**Statut** : En attente (à faire dès le site live)
**Décision** : Base technique déjà en place (sitemap, robots, metadata, JSON-LD, hreflang). Actions restantes à faire manuellement une fois le domaine actif.
**Effort estimé** : ~1h le jour du lancement, puis continu

**Checklist dans l'ordre**

1. **Google Search Console** — créer le compte pour `forgedpoker.com`, vérifier la propriété (meta tag dans layout ou DNS), soumettre `https://forgedpoker.com/sitemap.xml`
2. **Vérifier l'indexation** — "Inspection d'URL" dans Search Console sur les pages principales. Rapport "Couverture" pour les erreurs.
3. **Core Web Vitals** — passer les pages clés sur [pagespeed.web.dev](https://pagespeed.web.dev). Vérifier LCP, CLS, INP.
4. **Backlinks** — forums poker FR (CartesMag, PokerFR, PokerCollectif), Reddit r/poker et r/pokerfr, articles "meilleurs sites d'apprentissage poker". C'est le levier principal.
5. **Contenu statique** — vérifier que les pages de niveau et le glossaire ont du texte HTML réel indexable (pas uniquement généré côté client).

**Ce qui est déjà en place (ne pas refaire)**
- `sitemap.ts` — URLs localisées `/fr/...` et `/en/...` ✅
- `robots.ts` — profil/API exclus ✅
- Metadata + OpenGraph + Twitter Card en FR/EN ✅
- hreflang alternates ✅
- JSON-LD EducationalOrganization ✅

---

## Format pour les nouvelles idées

```
## Nom de l'idée

**Statut** : En attente  
**Décision** : [Pourquoi on ne dev pas maintenant]  
**Effort estimé** : [Durée approximative]

**Comportement**  
[Description courte de ce que ça fait pour l'utilisateur]

**Stack technique**  
[Ce qu'il faudra mettre en place]

**Coût**  
[Infra, services tiers, etc.]

**Prérequis avant de dev**  
[Ce qui doit être vrai avant de lancer]
```
