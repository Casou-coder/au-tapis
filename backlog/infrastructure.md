# Infrastructure — Référence Plateforme

Informations opérationnelles sur les limites et coûts de l'infrastructure en production.

---

## Supabase — Capacité & Limites

### Situation actuelle : Plan Gratuit

| Ce qui compte | Limite gratuite | Ce que ça signifie |
|---|---|---|
| Utilisateurs actifs / mois | **50 000** | Largement suffisant au lancement |
| Stockage base de données | 500 MB | ~100 000 profils utilisateurs |
| Bande passante | 5 GB / mois | Suffisant pour débuter |
| Sauvegardes automatiques | ❌ Aucune | Risque de perte de données si incident |
| Support | Communauté uniquement | Pas d'assistance directe |

### ⚠️ Point critique — Mise en veille

**Le plan gratuit endort le projet si aucune connexion pendant 7 jours.**
Concrètement : un nouveau visiteur tombe sur un site gelé pendant ~30 secondes le temps du réveil.
C'est inacceptable pour un site en production. À régler avant le lancement public.

---

### Plan Pro — $25 / mois (≈ €23)

| Ce qui change | Plan Pro |
|---|---|
| Utilisateurs actifs / mois | **100 000 inclus** |
| Mise en veille | ❌ Supprimée — site toujours disponible |
| Sauvegardes | ✅ Quotidiennes automatiques |
| Stockage base de données | 8 GB |
| Bande passante | 250 GB / mois |
| Support | Par email |

---

### Ce que ça coûte selon la taille de la plateforme

| Utilisateurs actifs / mois | Coût mensuel Supabase |
|---|---|
| 0 — lancement | Gratuit (mais mise en veille = risqué) |
| 1 — premier utilisateur réel | **$25/mois** (passer au Pro) |
| 10 000 | $25/mois |
| 50 000 | $25/mois |
| 100 000 | $25/mois |
| 150 000 | ~$175/mois (+50k × $0,003) |
| 200 000 | ~$325/mois (+100k × $0,003) |

> Un "utilisateur actif" = quelqu'un qui se connecte au moins une fois dans le mois.
> Un visiteur anonyme ne compte pas.

---

### Décision à prendre avant le lancement

**Passer au plan Pro ($25/mois) dès le lancement public.**
Raisons : mise en veille supprimée + sauvegardes quotidiennes + support email.
À ce stade de la plateforme, c'est la seule dépense infrastructure mensuelle.

---

### Tableau de bord

Accès aux statistiques en temps réel (utilisateurs, requêtes, stockage) :
→ supabase.com/dashboard — projet Forged Poker

---

*Dernière mise à jour : août 2026*
