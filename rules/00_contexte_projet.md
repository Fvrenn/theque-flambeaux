# Contexte du Projet : App de Tournoi de Thèque (Scouts Flambeaux)

## 1. Description Générale
L'application sert à gérer un tournoi de "Thèque" (un sport similaire au baseball) pour un groupe scout (Les Flambeaux). Elle sera utilisée sur une seule journée, hébergée sur un VPS Debian avec Docker.
L'objectif principal est d'offrir une expérience "en direct" (Live) aux parents spectateurs et un outil d'arbitrage ultra-simple sur téléphone.

## 2. Stack Technique
- **Framework :** Next.js (App Router).
- **Rendu :** Privilégier au maximum le SSR (React Server Components). N'utiliser `use client` que lorsque c'est strictement nécessaire (interactivité directe, hooks React).
- **Base de données :** PostgreSQL.
- **ORM :** Prisma.
- **Styling :** Tailwind CSS.
- **Composants UI :** Shadcn UI.
- **Design System :** Thème "Flambeaux". Fond principalement blanc, textes sombres, et des touches de "Princeton Orange" (du 50 au 950) pour les boutons et éléments actifs. Un peu de vert pour valider des actions si besoin.

## 3. Règles du Jeu (Simplifiées pour la DB)
- Un match dure un temps donné (ex: 2 mi-temps de 7 min).
- Les équipes marquent des points (+1 pour un tour, +2 pour un Home Run).
- Statistiques bonus à traquer : Balles gobées.
- Classement : Victoire = 2pts, Nul = 1pt, Défaite = 0pt. Aucun autre bonus de point au classement.

## 4. Rôles et Vues
1. **Public / Parents (Mobile-first, PWA style) :**
   - Accès sans compte (juste un pseudo pour le chat).
   - Vues : Accueil (Matchs en cours), Classement, Live (Chat + actions de jeu automatiques), Planning.
2. **Arbitre (Mobile, sur le terrain) :**
   - Sélection du terrain.
   - Interface "Télécommande" : Gros boutons +1, +2 (Home run), +1 Balle gobée, Bouton Annuler (Undo).
3. **Super-Admin (Desktop/Tablette) :**
   - Création du tournoi, ajout dynamique du nombre d'équipes et de terrains.
   - Génération du planning (tout le monde affronte tout le monde) et assignation aux terrains/horaires.
   - Modération (correction des scores, suppression de messages du chat).