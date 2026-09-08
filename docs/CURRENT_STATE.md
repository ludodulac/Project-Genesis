# Current State

## État réel

Le dépôt vient d'être initialisé comme laboratoire de construction du jeu.

### Présent
- vision Genesis-01 définie ;
- principes d'architecture définis ;
- protocole de reprise IA défini ;
- architecture conceptuelle définie.

### Absent volontairement
- application jouable ;
- dépendances et framework installés ;
- backend ;
- comptes ;
- multijoueur ;
- progression ;
- boutique ;
- système de cartes ;
- assets définitifs.

## Prochain jalon

**Genesis-01 — Terrain tactile**

Créer la plus petite application mobile-web permettant :
1. d'ouvrir une URL sur téléphone ;
2. de voir un plateau lisible et agréable ;
3. de toucher une cellule ;
4. de modifier sa hauteur dans l'état canonique ;
5. de faire réagir doucement les cellules voisines ;
6. de montrer cette transition de façon plaisante ;
7. d'avoir un objet simple qui réagit à la pente.

Le prototype ne doit avoir ni score, ni adversaire, ni progression.

## Critère de réussite

Avant de demander « est-ce un bon jeu ? », demander : **a-t-on spontanément envie de continuer à toucher et déformer ce petit monde ?**

## Non vérifié

Aucun runtime n'existe encore. Aucun choix de stack n'est donc considéré comme implémenté. Phaser + TypeScript reste la direction recommandée, à valider lors du bootstrap technique.
