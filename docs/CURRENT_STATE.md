# Current State

## État réel

Le dépôt contient désormais le premier prototype Genesis-01.

### Présent
- vision Genesis-01 définie ;
- principes d'architecture définis ;
- protocole de reprise IA défini ;
- architecture conceptuelle définie ;
- runtime Phaser 4 + TypeScript + Vite ;
- plateau isométrique procédural 5 × 5 ;
- état du monde sérialisable ;
- action canonique `RAISE_CELL` ;
- simulation séparée du rendu ;
- réaction douce des cellules voisines ;
- un orbe simple descend vers un voisin clairement plus bas ;
- rendu mobile plein écran et interaction tactile ;
- tests de simulation ;
- workflow CI + GitHub Pages.

### Vérifié
Le premier workflow CI a installé les dépendances, exécuté les tests de simulation et produit le build Vite avec succès le 9 septembre 2026.

### En attente de vérification réelle
- déploiement GitHub Pages final ;
- ouverture sur un vrai téléphone ;
- qualité tactile et visuelle ;
- envie réelle de continuer à manipuler le terrain.

### Absent volontairement
- backend ;
- comptes ;
- multijoueur ;
- progression ;
- boutique ;
- système de cartes ;
- assets définitifs ;
- score, adversaire ou condition de victoire.

## Jalón actuel

**Genesis-01 — Terrain tactile**

Le prototype permet déjà conceptuellement :
1. de voir un plateau lisible ;
2. de toucher une cellule ;
3. de modifier sa hauteur dans l'état canonique ;
4. de faire réagir doucement les cellules voisines ;
5. de montrer cette transition sans faire porter la règle par l'animation ;
6. de faire réagir un objet simple à la pente.

## Critère de réussite

Le prochain test n'est plus architectural. Il est sensoriel : **sur téléphone, a-t-on spontanément envie de continuer à toucher et déformer ce petit monde ?**

Si la réponse est non, modifier d'abord le jouet et le game feel avant d'ajouter des systèmes de jeu.
