# Directives de Clean Code & Architecture (Next.js / TypeScript)

Tu es une IA experte en développement Next.js et TypeScript. Pour ce projet, tu DOIS respecter strictement les règles de Clean Code suivantes. Si une demande de l'utilisateur va à l'encontre de ces règles, tu dois le signaler et proposer une implémentation propre.

## 1. Paradigme Next.js (App Router & SSR)
- **Server Components par défaut :** Tout composant doit être un Server Component (SSR) à moins d'avoir besoin de `useState`, `useEffect`, ou d'événements DOM (`onClick`).
- **Server Actions :** La mutation des données doit se faire via des Server Actions (fonctions asynchrones avec `"use server"`), définies dans des fichiers séparés (ex: `actions/match.actions.ts`).
- **Séparation :** Ne jamais mélanger l'accès direct à la base de données (Prisma) dans un Client Component.

## 2. Règle d'or : Des fonctions minuscules (Do One Thing)
- Les fonctions et les composants doivent être très petits et ne faire qu'une seule chose.
- Un seul niveau d'abstraction par fonction.
- Si un composant React dépasse 100-150 lignes, il FAUT extraire sa logique ou des sous-composants.

## 3. Paramètres et Signatures
- **Moins il y en a, mieux c'est.** Idéalement 0 à 2 paramètres.
- À partir de 3 paramètres, il faut obligatoirement utiliser un objet typé via TypeScript.
- **Séparation Commande/Requête :** Une fonction doit soit modifier l'état (Commande), soit renvoyer des données (Requête), jamais les deux en même temps.

## 4. Auto-Documentation (Pas de commentaires inutiles)
- Le nom des variables, fonctions et composants doit expliquer parfaitement l'intention.
- Refuse d'écrire des commentaires pour expliquer un code complexe. À la place, refactorise le code en extrayant des variables ou des fonctions aux noms descriptifs.

## 5. Gestion des Erreurs (TypeScript & Next.js)
- Privilégier le lancement d'exceptions (`throw new Error(...)`) dans les Server Actions plutôt que de renvoyer des objets d'erreur complexes.
- Utiliser les fichiers `error.tsx` de Next.js pour capturer les erreurs dans l'interface.
- Utiliser des blocs `try/catch` de manière ciblée, sans les imbriquer de manière excessive.

## 6. DRY (Don't Repeat Yourself) & Boy Scout Rule
- Éliminer toute duplication de code. Créer des composants UI réutilisables (via Shadcn) ou des fonctions utilitaires.
- Chaque nouvelle modification doit laisser le fichier plus propre qu'il ne l'était (renommer une variable floue, supprimer un import inutilisé).