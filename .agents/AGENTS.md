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

---

*Cette règle prend effet immédiatement et s'applique à l'ensemble des créations web de l'agence.*
