# Charte de Design & Architecture Agence IA — "STYLE A" (Standard SaaS Dashboard)

## 📌 Principe Fondamental du "STYLE A"
Le **"STYLE A"** est une **ARCHITECTURE VISUELLE ET DISPOSITION EN GRILLE (LAYOUT)** applicable à tout type d'application web (SaaS de facturation, plateforme de débogage/code, réseau social, outil interne, CRM, etc.).

⚠️ **REMARQUE MAJEURE SUR LE CONTENU** :
Le contenu des cartes, des menus, des graphiques et des badges **ADAPTE UNIQUEMENT LES DONNÉES AU METIER DU PROJET** décrit par l'utilisateur.
- *Ne PAS ajouter de devises, pays, ou paiements si le projet est une plateforme de débogage, de dev ou autre.*
- *La structure visuelle (Sidebar + Header + KPIs + Grilles 2 colonnes) reste strictement la même, mais les textes, métriques et icônes s'adaptent au projet.*

---

## 🎨 Spécifications de la Structure Visuelle "STYLE A"

### 1. Structure à 2 Zones Plein Écran
- **Sidebar Fixe à Gauche (20% de la largeur, 100vh)** :
  - En haut : Logo principal du projet + Sous-titre officiel (+ optionnellement un badge de statut de projet ou version si pertinent).
  - Navigation verticale : Liens d'accès avec icônes. L'élément actif possède un **grand bloc plein coloré avec coins arrondis**.
  - Bloc bas : Carte d'option/Action rapide ou Widget contextuel.
  - Pied de page : Profil utilisateur connecté (Avatar, Nom, Rôle).
- **Grand Workspace Principal à Droite (75% à 80% de la largeur)** :
  - Arrière-plan propre, lisible et professionnel (`#F8FAFC` ou thème sombre élégant selon le projet).
  - Utilise 100% de la largeur disponible bord à bord sans centrage étroit.

### 2. Header Supérieur Horizontal du Workspace
- S'étire sur toute la largeur restante à droite de la sidebar.
- Gauche : Titre dynamique de la page active avec icône associée.
- Droite : Contrôles contextuels (Filtre de date/période, Bouton d'action principal `+`, Cloche de notifications, Avatar profil).

### 3. Tableau de Bord (Dashboard Grille Pleine Largeur)
- **Rangée 1 : Cartes KPI** sur **UNE SEULE ligne horizontale** (3 à 4 grandes cartes adaptées au métier du projet : ex. *Tickets ouverts*, *Développeurs actifs*, *Bugs résolus* pour une plateforme de débogage).
- **Rangée 2 : Section Graphiques** en 2 colonnes (65% Grand graphique principal de tendance/courbe | 35% Graphique secondaire donut/barres).
- **Rangée 3 : Section Données** en 2 colonnes (65% Table de données complète avec colonnes métier | 35% Flux d'activités récentes).

### 4. Cohérence Totale sur TOUTES les Pages
- Toutes les sous-pages de l'application conservent exactement la même grille large et le même header sans jamais revenir à une disposition étroite.

### 5. Règles Critiques d'Ingénierie Mobile, PWA & Localisation

#### A. Tiroir Latéral Mobile (Off-Canvas Sidebar)
- **Jamais de `pointer-events: none`** non réinitialisé sur `.sidebar-fixed` ou ses enfants.
- **Interdiction de `backdrop-filter: blur()` sur l'overlay mobile** : Provoque un piège de composition GPU sur Webkit (iOS Safari / Chrome Android) qui rend la sidebar invisible sous le flou. Toujours utiliser un fond uni semi-transparent (`background: rgba(0, 0, 0, 0.65)`).
- **Z-Index & GPU Layering** : `.sidebar-fixed` doit avoir un z-index élevé (`1000000`) et utiliser `transform: translate3d(0, 0, 0)` pour une accélération matérielle fluide.
- **Propagation Tactile** : Toujours synchroniser les 3 classes de déverrouillage (`.open`, `.active`, `body.mobile-sidebar-open`).

#### B. Cache PWA & URLs Vercel
- **Domaine Canonique de Production vs Snapshots Immuables** : Ne jamais partager d'URL contenant un hash de déploiement (ex: `*-eknipzr3b-*.vercel.app`). Toujours maintenir la redirection automatique vers le domaine de production officiel (`credit-track00.vercel.app`).
- **Cache-Busting Strict** : Versionner les `<script src="app.js?v=...">` et `<link rel="stylesheet" href="styles.css?v=...">` avec un numéro de build horodaté.
- **Service Worker** : Toujours appliquer `Network-First` sur les requêtes HTML, `updateViaCache: 'none'`, et purger les anciens caches avec `clients.claim()`.

#### C. Localisation Panafricaine des Moyens de Paiement
- L'application adapte automatiquement ses listes déroulantes de paiement au pays sélectionné :
  - **Bénin (BJ)** : MTN MoMo, Moov Flooz, Celtiis Cash, Wave, Espèces.
  - **Côte d’Ivoire (CI)** : Wave, Orange Money, MTN MoMo, Moov Money, Djamo, Espèces.
  - **Sénégal (SN)** : Wave, Orange Money, Free Money, Wizall, Espèces.
  - **Cameroun (CM)** : Orange Money, MTN MoMo, Express Union (EUM), Espèces.
  - **Nigeria (NG)** : OPay, PalmPay, Moniepoint, Kuda, NIP Bank Transfer, USSD.
  - **Kenya (KE)** : M-Pesa (Safaricom), Airtel Money, T-Kash, Pesalink.
  - **Ghana (GH)** : MTN MoMo, Telecel (Vodafone) Cash, AT Money, G-Money.
  - **RDC (CD)** : M-Pesa, Orange Money, Airtel Money, Afrimoney, Cash (USD/CDF).
  - *(+ 12 autres pays d'Afrique du Nord, Australe, Centrale et de l'Ouest).*

---

## 🧠 Matrice d'Exécution & Sélection des Conditions (Prompt Engineering)
Pour toute tâche demandée par l'utilisateur, l'agent sélectionne et applique systématiquement la condition idoine définie dans [ai_prompt_engineer.md](file:///c:/Users/Utilisateur/Desktop/2e_projet/.agents/rules/ai_prompt_engineer.md) :
- **Condition C1 (Diagnostic & Bug Hunting)** : Traque à la source, analyse de requêtes, promesses avec timeout.
- **Condition C2 (Architecture & Features)** : Respect strict du STYLE A, zéro composant orphelin, responsive.
- **Condition C3 (Refactoring & Clean Code)** : Élimination DRY des doublons, scope clair, non-régression.
- **Condition C4 (Sécurité & Auth Supabase)** : Assainissement des entrées, URLs dynamiques, fallbacks résilients.
- **Condition C5 (Déploiement & DevOps)** : Cache-busting, versions strictes, validation de build.
- **Condition C6 (Contenu & SEO)** : Localisation panafricaine, devises, métadonnées OpenGraph.
- **Condition C7 (Micro-Ajustements)** : Interventions chirurgicales rapides et précises.

---

*Cette règle prend effet immédiatement et s'applique à l'ensemble des créations web de l'agence.*

